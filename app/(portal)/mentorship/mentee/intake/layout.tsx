import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentee Interest & Expectations",
  description: "Share your aspirations, interests and goals before the mentorship begins.",
};

export default function MenteeIntakeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
