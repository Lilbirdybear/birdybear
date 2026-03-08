import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CompartmentsSection from "@/components/CompartmentsSection";
import ProjectsSection from "@/components/ProjectsSection";
import AboutSection from "@/components/AboutSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <CompartmentsSection />
      <div id="projects">
        <ProjectsSection />
      </div>
      <div id="about">
        <AboutSection />
      </div>
      <div id="contact">
        <FooterSection />
      </div>
    </div>
  );
};

export default Index;
