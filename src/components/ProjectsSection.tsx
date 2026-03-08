import { useState, useEffect, useRef } from "react";

type Filter = "all" | "ixd" | "3d" | "game";

const projects = [
  { id: 1, title: "Neural Interface", category: "ixd" as const, year: "2025", tags: ["UX Research", "Prototyping"] },
  { id: 2, title: "Vertex Creature", category: "3d" as const, year: "2025", tags: ["ZBrush", "Substance"] },
  { id: 3, title: "Neon Descent", category: "game" as const, year: "2024", tags: ["Unreal Engine", "Level Design"] },
  { id: 4, title: "Haptic Dashboard", category: "ixd" as const, year: "2024", tags: ["Figma", "Motion Design"] },
  { id: 5, title: "Mech Assembly", category: "3d" as const, year: "2024", tags: ["Blender", "Hard Surface"] },
  { id: 6, title: "Phantom Protocol", category: "game" as const, year: "2024", tags: ["Unity", "Narrative"] },
];

const filterConfig: { label: string; value: Filter; color: string }[] = [
  { label: "ALL", value: "all", color: "text-foreground" },
  { label: "IXD", value: "ixd", color: "text-ixd" },
  { label: "3D", value: "3d", color: "text-three-d" },
  { label: "GAME", value: "game", color: "text-game" },
];

const categoryDot: Record<string, string> = {
  ixd: "bg-ixd",
  "3d": "bg-three-d",
  game: "bg-game",
};

const ProjectsSection = () => {
  const [active, setActive] = useState<Filter>("all");
  const filtered = active === "all" ? projects : projects.filter((p) => p.category === active);
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 px-6 border-t border-border perspective-container">
      <div className="max-w-6xl mx-auto">
        <div className={`flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div>
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground block mb-4">
              // SELECTED WORK
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Projects</h2>
          </div>

          <div className="flex gap-1">
            {filterConfig.map((f) => (
              <button
                key={f.value}
                onClick={() => setActive(f.value)}
                className={`font-mono text-xs tracking-wider px-4 py-2 transition-all duration-300 ${
                  active === f.value
                    ? `${f.color} glass-panel`
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Project list */}
        <div className="space-y-px">
          {filtered.map((project, i) => (
            <div
              key={project.id}
              className={`group flex items-center justify-between p-6 glass-panel border border-border hover:border-primary/20 transition-all duration-500 cursor-pointer tilt-card ${visible ? "opacity-100" : "opacity-0"}`}
              style={{
                transitionDelay: visible ? `${i * 0.08}s` : "0s",
                transform: visible ? undefined : "perspective(800px) rotateX(8deg) translateY(20px)",
              }}
            >
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${categoryDot[project.category]}`} />
                <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
              </div>

              <div className="flex items-center gap-6">
                <div className="hidden md:flex gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="font-mono text-[10px] tracking-wider text-muted-foreground px-2 py-1 border border-border rounded-sm">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="font-mono text-xs text-muted-foreground">{project.year}</span>
                <svg className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
