export const metadata = {
  title: "Shamz - Shamz consult",
  description: "Your trusted ally for your personal and organizational growth",
};

import Hero from "@/components/hero";
import Testimonials from "@/components/testimonials";
import Newsletter from "@/components/newsletter";
import Mission from "@/components/mission-vision";
import Services from "@/components/our-service";

export default function Home() {
  return (
    <>
      <Hero />
      <Mission />
      <Services />
      <Testimonials />
      <Newsletter />
    </>
  );
}
