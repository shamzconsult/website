import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentor Monthly Report",
  description: "Submit your monthly mentorship session evaluation to Shamzbridge Consult.",
};

export default function MentorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
