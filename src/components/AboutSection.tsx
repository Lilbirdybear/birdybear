import { useEffect, useRef, useState } from "react";

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 px-6 border-t border-border perspective-container">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground block mb-4">
            // ABOUT
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            Designer across<br />dimensions
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            I work at the intersection of interaction design, 3D visualization, and game development — 
            creating experiences that blur the line between functional interfaces and immersive worlds.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Each discipline informs the others: game mechanics sharpen my UX thinking, 
            3D skills add depth to interfaces, and interaction design brings polish to game experiences.
          </p>
        </div>

        <div className="space-y-6">
          {[
            { cls: "compartment-ixd glow-ixd", label: "TOOLS — IXD", labelColor: "text-ixd", tools: "Figma, Framer, Principle, Adobe XD, ProtoPie", delay: 0.1 },
            { cls: "compartment-3d glow-3d", label: "TOOLS — 3D", labelColor: "text-three-d", tools: "Blender, ZBrush, Substance Painter, Cinema 4D, Maya", delay: 0.25 },
            { cls: "compartment-game glow-game", label: "TOOLS — GAME", labelColor: "text-game", tools: "Unreal Engine, Unity, Godot, Game Maker", delay: 0.4 },
          ].map((item) => (
            <div
              key={item.label}
              className={`glass-panel p-6 ${item.cls} tilt-card ${visible ? "opacity-100" : "opacity-0"}`}
              style={{
                transition: "all 0.7s cubic-bezier(0.23, 1, 0.32, 1)",
                transitionDelay: visible ? `${item.delay}s` : "0s",
                transform: visible ? undefined : "perspective(800px) rotateY(-10deg) translateX(-30px)",
              }}
            >
              <h4 className={`font-mono text-xs tracking-wider ${item.labelColor} mb-3`}>{item.label}</h4>
              <p className="text-sm text-muted-foreground">{item.tools}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
