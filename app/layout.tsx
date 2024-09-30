import "./css/style.css";
import { Inter } from "next/font/google";
import Header from "@/components/ui/header";
import TallyScript from "@/components/ui/TallyScript";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title:
    "ShamzBridge | Expert Consultation, Capacity Building, and Project Management Services in Nigeria",
  description:
    "Trusted for project management, capacity building, and consultancy services. ShamzBridge empowers growth and innovation. Located in Abuja, Nigeria.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body
        className={`${inter.variable} font-inter antialiased bg-white text-gray-900 tracking-tight`}
      >
        <div className='flex flex-col min-h-screen overflow-hidden supports-[overflow:clip]:overflow-clip'>
          <Header />
          <TallyScript />
          {children}
        </div>
      </body>
    </html>
  );
}
