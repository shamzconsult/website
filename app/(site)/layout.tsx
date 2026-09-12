import "./css/style.css";
import { Inter } from "next/font/google";
import Header from "@/components/ui/header";
import TallyScript from "@/components/ui/TallyScript";
import { GoogleAnalytics } from "@/components/scripts/GoogleAnalytics";
import { Sabilytics } from "@/components/scripts/Sabilytics";
import type { Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title:
    "ShamzBridge | Expert Consultation, Capacity Building, and Project Management Services in Nigeria",
  description:
    "Trusted for project management, capacity building, and consultancy services. ShamzBridge empowers growth and innovation. Located in Abuja, Nigeria.",
  keywords: [
    "Consultation",
    "Event Hosting",
    "Content management",
    "Web development",
    "Job Listing",
    "Community development",
  ],
  other: {
    "google-site-verification": "google96cebe6d60efa3ce",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-inter antialiased bg-white text-gray-900 tracking-tight`}
      >
        <div className="flex flex-col min-h-screen overflow-hidden supports-[overflow:clip]:overflow-clip">
          <Header />
          <TallyScript />
          <GoogleAnalytics />
          <Sabilytics />
          {children}
        </div>
      </body>
    </html>
  );
}
