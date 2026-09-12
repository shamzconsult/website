import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log a Call",
  description: "Record a mentorship call: the date, how you spoke, and a short note.",
};

export default function CallLogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
