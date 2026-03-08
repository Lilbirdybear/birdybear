import { useEffect, useRef, useState } from "react";
import CompartmentCard from "./CompartmentCard";
import ixdPreview from "@/assets/ixd-preview.jpg";
import threeDPreview from "@/assets/3d-preview.jpg";
import gamePreview from "@/assets/game-preview.jpg";

const compartments = [
  {
    title: "Interaction Design",
    subtitle: "IXD — Interface Systems",
    description:
      "Crafting intuitive digital experiences through research-driven interfaces, micro-interactions, and user-centered design systems.",
    image: ixdPreview,
    variant: "ixd" as const,
  },
  {
    title: "3D Design",
    subtitle: "3D — Spatial Modeling",
    description:
      "Sculpting digital dimensions through high-fidelity 3D modeling, texturing, and rendering for product and environment visualization.",
    image: threeDPreview,
    variant: "3d" as const,
  },
  {
    title: "Game Design",
    subtitle: "GAME — Interactive Worlds",
    description:
      "Building immersive game experiences through level design, mechanics systems, and narrative-driven environments.",
    image: gamePreview,
    variant: "game" as const,
  },
];

const CompartmentsSection = () => {
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
    <section ref={sectionRef} id="compartments" className="py-32 px-6 perspective-container">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className={`mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground block mb-4">
            // DISCIPLINES
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Three Compartments
          </h2>
        </div>

        {/* Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${visible ? "" : "opacity-0"}`}>
          {compartments.map((c, i) => (
            <CompartmentCard key={c.variant} {...c} index={visible ? i : -1} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompartmentsSection;
