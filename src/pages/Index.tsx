import HeroSection from "@/components/HeroSection";
import CompartmentsSection from "@/components/CompartmentsSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen scroll-smooth noise-bg">
      <HeroSection />
      <CompartmentsSection />
      <div id="contact">
        <FooterSection />
      </div>
    </div>
  );
};

export default Index;
