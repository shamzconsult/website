import Hero from "@/components/hero";
import Services from "@/components/our-service";
import Partners from "@/components/partners";
import UpcomingEvent from "@/components/upcoming-event";
import WhyChooseUs from "@/components/Why-choose-us";
import ImpactStats from "@/components/Impact";
export default function Home() {
  return (
    <>
      <UpcomingEvent />
      <Hero />
      <Services />
      <WhyChooseUs />
      <ImpactStats />
      {/* <Slider /> */}
      {/* <Mission /> */}
      <Partners />
      {/* <Newsletter /> */}
    </>
  );
}
