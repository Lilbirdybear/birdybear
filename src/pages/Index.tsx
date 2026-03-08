import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CompartmentsSection from "@/components/CompartmentsSection";
import ProjectsSection from "@/components/ProjectsSection";
import AboutSection from "@/components/AboutSection";
import FooterSection from "@/components/FooterSection";
import ParticleField from "@/components/ParticleField";
import CursorGlow from "@/components/CursorGlow";
import ScrollProgress from "@/components/ScrollProgress";

const Index = () => {
  return (
    <div className="min-h-screen bg-background scroll-smooth noise-bg">
      <ParticleField />
      <CursorGlow />
      <ScrollProgress />
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
