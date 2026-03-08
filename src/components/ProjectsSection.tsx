import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import TextReveal from "./TextReveal";

type Filter = "all" | "ixd" | "3d" | "game";

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

  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").eq("published", true).order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const filtered = active === "all" ? projects : projects.filter((p) => p.category === active);

  return (
    <section className="py-32 px-6 border-t border-border relative">
      {/* Ambient glow */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-secondary/3 blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <div>
            <motion.span
              className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground block mb-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              // SELECTED WORK
            </motion.span>
            <TextReveal
              text="Projects"
              as="h2"
              className="text-3xl md:text-4xl font-bold text-foreground"
              staggerChildren={0.05}
            />
          </div>

          <div className="flex gap-1">
            {filterConfig.map((f) => (
              <motion.button
                key={f.value}
                onClick={() => setActive(f.value)}
                className={`font-mono text-[11px] tracking-wider px-4 py-2 transition-all duration-300 relative cursor-magnetic ${
                  active === f.value ? `${f.color}` : "text-muted-foreground hover:text-foreground"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {f.label}
                {active === f.value && (
                  <motion.div
                    className="absolute inset-0 glass-panel border-gradient"
                    layoutId="activeFilter"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{""}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <div className="space-y-px">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, x: -50, filter: "blur(4px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: 50, filter: "blur(4px)" }}
                transition={{ delay: i * 0.05, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              >
                <Link
                  to={`/project/${project.slug}`}
                  className="group flex items-center justify-between p-6 glass-panel-hover border border-border hover:border-primary/20 cursor-magnetic block relative overflow-hidden"
                >
                  {/* Hover line indicator */}
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary"
                    initial={{ scaleY: 0 }}
                    whileHover={{ scaleY: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{ transformOrigin: "top" }}
                  />

                  <div className="flex items-center gap-4">
                    <motion.div
                      className={`w-2 h-2 rounded-full ${categoryDot[project.category]}`}
                      whileHover={{ scale: 1.5 }}
                    />
                    <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                      {project.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="hidden md:flex gap-2">
                      {(project.tags || []).map((tag) => (
                        <span key={tag} className="font-mono text-[10px] tracking-wider text-muted-foreground px-2 py-1 border border-border rounded-sm group-hover:border-primary/20 transition-colors">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">{project.year}</span>
                    <motion.svg
                      className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      whileHover={{ x: 4 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </motion.svg>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
