import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

  return (
    <section className="py-32 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
          initial={{ opacity: 0, y: 40, rotateX: 6 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
        >
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
                  active === f.value ? `${f.color} glass-panel` : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="space-y-px">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, x: -40, rotateY: -5 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                exit={{ opacity: 0, x: 40, rotateY: 5 }}
                transition={{ delay: i * 0.06, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                whileHover={{
                  scale: 1.01,
                  x: 6,
                  transition: { duration: 0.25 },
                }}
                className="group flex items-center justify-between p-6 glass-panel border border-border hover:border-primary/20 cursor-pointer"
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
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
