import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Message Your Mentor",
  description: "Send a question, comment or document to your assigned bootcamp mentor.",
};

export default function MenteeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
