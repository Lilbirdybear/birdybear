import AboutSection from "@/components/AboutSection";
import FooterSection from "@/components/FooterSection";

const About = () => {
  return (
    <div className="min-h-screen bg-background scroll-smooth noise-bg">
      <div className="pt-16">
        <AboutSection />
      </div>
      <FooterSection />
    </div>
  );
};

export default About;
