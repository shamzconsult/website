import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentor Interest & Expectations",
  description: "Share your work, interests, availability and mentoring experience.",
};

export default function MentorIntakeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
