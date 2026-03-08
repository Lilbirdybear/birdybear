import HeroSection from "@/components/HeroSection";
import CompartmentsSection from "@/components/CompartmentsSection";
import ProjectsSection from "@/components/ProjectsSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background scroll-smooth noise-bg">
      <HeroSection />
      <CompartmentsSection />
      <div id="projects">
        <ProjectsSection />
      </div>
      <div id="contact">
        <FooterSection />
      </div>
    </div>
  );
};

export default Index;
