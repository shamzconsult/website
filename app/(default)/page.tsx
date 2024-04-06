export const metadata = {
  title: "Shamz - Shamz consult",
  description: "Your trusted ally for your personal and organizational growth",
};

import Hero from "@/components/hero";
import Testimonials from "@/components/testimonials";
import Newsletter from "@/components/newsletter";
import Mission from "@/components/mission-vision";
import Services from "@/components/our-service";
import Slider from "@/components/carousel/Slider";

export default function Home() {
  return (
    <>
      <Hero />
      <Slider />
      <Mission />
      <Services />
      <Testimonials />
      <Newsletter />
    </>
  );
}
