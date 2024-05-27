export const metadata = {
  title: "ShamzBridge Consult",
  description: "Your trusted ally for your personal and organizational growth",
};

import Hero from "@/components/hero";
// import Newsletter from "@/components/newsletter";
import Mission from "@/components/mission-vision";
import Services from "@/components/our-service";
import Slider from "@/components/carousel/slider";
import AboutUs from "@/components/about";
import Partners from "@/components/partners";

export default function Home() {
  return (
    <>
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
