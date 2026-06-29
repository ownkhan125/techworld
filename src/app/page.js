import Hero from "@/sections/Hero";
import FeaturesTabs from "@/sections/FeaturesTabs";
import AISection from "@/sections/AISection";
import IntegrationsReel from "@/sections/IntegrationsReel";
import CalcShowcase from "@/sections/CalcShowcase";
import Automation from "@/sections/Automation";
import Notes from "@/sections/Notes";
import Ergonomics from "@/sections/Ergonomics";
import Testimonials from "@/sections/Testimonials";
import Developer from "@/sections/Developer";
import Community from "@/sections/Community";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturesTabs />
      <AISection />
      <IntegrationsReel />
      <CalcShowcase />
      <Automation />
      <Notes />
      <Ergonomics />
      <Testimonials />
      <Developer />
      <Community />
    </>
  );
}
