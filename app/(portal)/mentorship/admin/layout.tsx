import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Organiser Dashboard",
  description: "Submission status, completion rates and exports for the mentorship programme.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
