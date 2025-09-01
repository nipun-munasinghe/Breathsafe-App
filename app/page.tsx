
import CallToActionSection from "@/components/home/CallToActionSection";
import FAQSection from "@/components/home/FAQSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import HeroSection from "@/components/home/HeroSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import UseCasesSection from "@/components/home/UseCasesSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <CallToActionSection />
      <HowItWorksSection />
      <UseCasesSection />
      <FAQSection />
    </>
  );
}
