import Navbar from "@/components/Navbar";
import AboutSection from "@/components/AboutSection";
import FooterSection from "@/components/FooterSection";

const About = () => {
  return (
    <div className="min-h-screen bg-background scroll-smooth noise-bg">
      <Navbar />
      <div className="pt-16">
        <AboutSection />
      </div>
      <FooterSection />
    </div>
  );
};

export default About;
