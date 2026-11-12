import type { Metadata } from "next";
import "./globals.css";

// YOUR JOB: change the title and description for your app.
export const metadata: Metadata = {
  title: "DeskBot · IT Helpdesk",
  description: "AI-powered IT helpdesk for Zentrix Software",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
