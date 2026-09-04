import type { Metadata, Viewport } from "next";
import { Geist, Sora } from "next/font/google";

import { PROGRAM } from "@/mentorship/data/program";
import "./portal.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: `Mentorship Feedback Channel — ${PROGRAM.name}`,
    template: `%s — ${PROGRAM.name}`,
  },
  description: `Weekly mentorship feedback channel for the ${PROGRAM.name}, sponsored by ${PROGRAM.sponsor} and facilitated by ${PROGRAM.facilitator}.`,

  icons: {
    icon: [{ url: "/mentorship/favicon.ico", type: "image/x-icon", sizes: "any" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#070c18",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${sora.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-ink-950">{children}</body>
    </html>
  );
}
