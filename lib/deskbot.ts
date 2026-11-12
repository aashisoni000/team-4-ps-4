export const CURRENT_EMPLOYEE_ID = "E101";

export const CATEGORIES = [
  "VPN",
  "Network",
  "Account",
  "Access",
  "Email",
  "Apps",
  "Hardware",
  "Security",
] as const;

export const PRIORITIES = ["P1", "P2", "P3", "P4"] as const;

export const TICKET_STATUSES = [
  "open",
  "in_progress",
  "waiting_for_user",
  "resolved",
  "closed",
] as const;

export type TicketPriority = (typeof PRIORITIES)[number];
export type TicketStatus = (typeof TICKET_STATUSES)[number];

export function formatIST(iso: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));
}

export function slaText(iso: string): string {
  const minutes = Math.ceil((new Date(iso).getTime() - Date.now()) / 60_000);
  const hours = Math.floor(Math.abs(minutes) / 60);
  const remainder = Math.abs(minutes) % 60;
  const duration = hours > 0 ? `${hours}h ${remainder}m` : `${remainder}m`;
  return minutes >= 0 ? `due in ${duration}` : `overdue by ${duration}`;
}

export function addHours(iso: string, hours: number): string {
  return new Date(new Date(iso).getTime() + hours * 60 * 60 * 1000).toISOString();
}

export function formatISTHour(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    hour12: true,
  }).format(date);
}
