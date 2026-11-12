import "server-only";
import { z } from "zod";
import { defineTool, type AgentTool } from "./defineTool";
import { getSupabase } from "../supabase";
import {
  addHours,
  CATEGORIES,
  CURRENT_EMPLOYEE_ID,
  formatIST,
  PRIORITIES,
  slaText,
} from "../deskbot";

const searchKnowledgeBase = defineTool({
  name: "searchKnowledgeBase",
  description:
    "Use this when an employee describes an IT problem and you need to find an approved self-fix article.",
  schema: z.object({
    query: z.string().trim().min(2).max(100).describe("Short keywords describing the issue"),
    category: z.enum(CATEGORIES).optional().describe("Known issue category, if clear"),
  }),
  run: async ({ query, category }) => {
    const words = [...new Set(query.replace(/[^a-zA-Z0-9 ]/g, " ").split(/\s+/).filter((word) => word.length >= 3))];
    if (words.length === 0) return { articles: [], note: "No self-fix article found" };

    let request = getSupabase()
      .from("kb_articles")
      .select("id, title, category, keywords, solution_steps, team_id")
      .or(words.map((word) => `title.ilike.%${word}%,keywords.ilike.%${word}%`).join(","))
      .limit(50);
    if (category) request = request.eq("category", category);

    const { data, error } = await request;
    if (error) throw new Error(error.message);
    const articles = data
      .map((article) => ({
        ...article,
        matches: words.filter((word) =>
          `${article.title} ${article.keywords}`.toLowerCase().includes(word.toLowerCase())
        ).length,
      }))
      .sort((a, b) => b.matches - a.matches || a.title.localeCompare(b.title))
      .slice(0, 3)
      .map(({ matches: _matches, keywords: _keywords, team_id: _teamId, ...article }) => ({
        ...article,
        steps: article.solution_steps,
      }));

    return articles.length > 0
      ? { articles }
      : { articles: [], note: "No self-fix article found" };
  },
});

const getEmployeeInfo = defineTool({
  name: "getEmployeeInfo",
  description: "Use this when you need the signed-in employee's name, department, or office location.",
  schema: z.object({}),
  run: async () => {
    const { data, error } = await getSupabase()
      .from("employees")
      .select("id, name, email, department, location, laptop_model")
      .eq("id", CURRENT_EMPLOYEE_ID)
      .single();
    if (error) throw new Error(error.message);
    return data;
  },
});

const getMyTickets = defineTool({
  name: "getMyTickets",
  description: "Use this when the employee asks about their existing IT tickets or before raising a related ticket.",
  schema: z.object({
    status: z.enum(["active", "all"]).optional().describe("Show active tickets or all recent tickets"),
  }),
  run: async ({ status }) => {
    let request = getSupabase()
      .from("tickets")
      .select("id, title, description, category, priority, status, created_at, team_id, support_teams(name)")
      .eq("employee_id", CURRENT_EMPLOYEE_ID)
      .order("created_at", { ascending: false })
      .limit(10);
    if (status === "active") request = request.in("status", ["open", "in_progress", "waiting_for_user"]);

    const { data, error } = await request;
    if (error) throw new Error(error.message);

    const priorities = await getSupabase().from("sla_rules").select("priority, response_hours, resolve_hours");
    if (priorities.error) throw new Error(priorities.error.message);
    const slaByPriority = new Map(priorities.data.map((rule) => [rule.priority, rule]));

    return {
      count: data.length,
      tickets: data.map((ticket) => {
        const rule = slaByPriority.get(ticket.priority);
        const slaDue = rule ? addHours(ticket.created_at, rule.resolve_hours) : null;
        const team = Array.isArray(ticket.support_teams) ? ticket.support_teams[0] : ticket.support_teams;
        return {
          id: ticket.id,
          title: ticket.title,
          category: ticket.category,
          priority: ticket.priority,
          status: ticket.status,
          team: team?.name ?? null,
          created_at: ticket.created_at,
          sla_due: slaDue ? formatIST(slaDue) : null,
          sla_text: slaDue && ["open", "in_progress", "waiting_for_user"].includes(ticket.status)
            ? slaText(slaDue)
            : null,
        };
      }),
    };
  },
});

const getSupportTeams = defineTool({
  name: "getSupportTeams",
  description: "Use this when the employee asks which IT team handles an issue or service.",
  schema: z.object({}),
  run: async () => {
    const { data, error } = await getSupabase()
      .from("support_teams")
      .select("id, name, handles")
      .order("id");
    if (error) throw new Error(error.message);
    return { teams: data };
  },
});

const getSlaRules = defineTool({
  name: "getSlaRules",
  description: "Use this when you need the response or resolution target for a ticket priority.",
  schema: z.object({
    priority: z.enum(PRIORITIES).optional().describe("Filter to one priority"),
  }),
  run: async ({ priority }) => {
    let request = getSupabase()
      .from("sla_rules")
      .select("priority, meaning, response_hours, resolve_hours")
      .order("priority");
    if (priority) request = request.eq("priority", priority);
    const { data, error } = await request;
    if (error) throw new Error(error.message);
    return { rules: data };
  },
});

const createTicket = defineTool({
  name: "createTicket",
  description: "Use this when a self-fix did not solve the employee's issue or they request an IT ticket.",
  writes: true,
  schema: z.object({
    category: z.enum(CATEGORIES).describe("Category matching the PS4 helpdesk seed"),
    priority: z.enum(PRIORITIES).describe("P1, P2, P3, or P4 based on the stated impact"),
    title: z.string().trim().min(5).max(100).describe("Short summary of the problem"),
    description: z.string().trim().min(5).max(1000).describe("Symptoms, impact, and troubleshooting already tried"),
  }),
  run: async ({ category, priority, title, description }) => {
    const [articleResult, slaResult] = await Promise.all([
      getSupabase().from("kb_articles").select("team_id").eq("category", category).limit(1).maybeSingle(),
      getSupabase()
        .from("sla_rules")
        .select("response_hours, resolve_hours")
        .eq("priority", priority)
        .single(),
    ]);
    if (articleResult.error) throw new Error(articleResult.error.message);
    if (slaResult.error) throw new Error(slaResult.error.message);
    if (!articleResult.data) throw new Error(`No support team is configured for ${category}.`);

    const teamResult = await getSupabase()
      .from("support_teams")
      .select("name")
      .eq("id", articleResult.data.team_id)
      .single();
    if (teamResult.error) throw new Error(teamResult.error.message);

    const { data, error } = await getSupabase()
      .from("tickets")
      .insert({
        employee_id: CURRENT_EMPLOYEE_ID,
        title,
        description,
        category,
        priority,
        team_id: articleResult.data.team_id,
      })
      .select("id, title, category, priority, status, created_at, team_id")
      .single();
    if (error) throw new Error(error.message);

    const slaDueAt = addHours(data.created_at, slaResult.data.resolve_hours);
    return {
      ticket: data,
      team: teamResult.data.name,
      response_target_hours: slaResult.data.response_hours,
      resolution_target_hours: slaResult.data.resolve_hours,
      sla_due_at: slaDueAt,
      sla_due: formatIST(slaDueAt),
    };
  },
});

export const tools: AgentTool[] = [
  searchKnowledgeBase,
  getEmployeeInfo,
  getMyTickets,
  getSupportTeams,
  getSlaRules,
  createTicket,
];
