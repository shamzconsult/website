import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentor Final Evaluation",
  description: "Rate each mentee at the end of the programme.",
};

export default function MentorFinalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
