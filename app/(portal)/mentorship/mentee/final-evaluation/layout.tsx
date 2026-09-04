import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentee Final Evaluation",
  description: "Rate how the mentorship went, at the end of the programme.",
};

export default function MenteeFinalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
