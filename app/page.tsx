import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import CallToActionSection from "@/components/home/CallToActionSection";
import FAQSection from "@/components/home/FAQSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import HeroSection from "@/components/home/HeroSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import UseCasesSection from "@/components/home/UseCasesSection";

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <FeaturesSection />
      <CallToActionSection />
      <HowItWorksSection />
      <UseCasesSection />
      <FAQSection />
      <Footer />
    </>
  );
}
