export const metadata = {
  title: "ShamzBridge Consult",
  description: "Your trusted ally",
};

import Hero from "@/components/hero";
// import Newsletter from "@/components/newsletter";
import Mission from "@/components/mission-vision";
import Services from "@/components/our-service";
import Slider from "@/components/carousel/slider";
import AboutUs from "@/components/about";
import Partners from "@/components/partners";
import UpcomingEvent from "@/components/upcoming-event";

export default function Home() {
  return (
    <>
      <UpcomingEvent />
      <Hero />
      <Slider />
      <Mission />
      <AboutUs />
      <Services />
      <Partners />
      {/* <Newsletter /> */}
    </>
  );
}
