import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import TextReveal from "@/components/TextReveal";

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

const Projects = () => {
  const [active, setActive] = useState<Filter>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("published", true)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const filtered = active === "all" ? projects : projects.filter((p) => p.category === active);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen scroll-smooth noise-bg pt-28 pb-20 px-6 bg-background/80 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <div>
            <motion.span
              className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground block mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              // CASE STUDIES
            </motion.span>
            <TextReveal
              text="Projects"
              as="h1"
              className="text-4xl md:text-5xl font-bold text-foreground"
              staggerChildren={0.05}
            />
          </div>

          <div className="flex gap-1">
            {filterConfig.map((f) => (
              <motion.button
                key={f.value}
                onClick={() => setActive(f.value)}
                className={`font-mono text-[11px] tracking-wider px-4 py-2 transition-all duration-300 relative cursor-magnetic ${
                  active === f.value ? f.color : "text-muted-foreground hover:text-foreground"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {f.label}
                {active === f.value && (
                  <motion.div
                    className="absolute inset-0 glass-panel border-gradient"
                    layoutId="projectsActiveFilter"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{""}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Project list */}
        <div className="space-y-px">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => {
              const isExpanded = expandedId === project.id;

              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, x: -50, filter: "blur(4px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: 50, filter: "blur(4px)" }}
                  transition={{ delay: i * 0.04, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                >
                  {/* Clickable row */}
                  <button
                    onClick={() => toggleExpand(project.id)}
                    className="w-full group flex items-center justify-between p-6 glass-panel-hover border border-border hover:border-primary/20 cursor-magnetic relative overflow-hidden text-left"
                  >
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary"
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: isExpanded ? 1 : 0 }}
                      whileHover={{ scaleY: 1 }}
                      transition={{ duration: 0.3 }}
                      style={{ transformOrigin: "top" }}
                    />

                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${categoryDot[project.category]}`} />
                      <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                        {project.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="hidden md:flex gap-2">
                        {(project.tags || []).map((tag) => (
                          <span
                            key={tag}
                            className="font-mono text-[10px] tracking-wider text-muted-foreground px-2 py-1 border border-border rounded-sm group-hover:border-primary/20 transition-colors"
                          >
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
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                      </motion.svg>
                    </div>
                  </button>

                  {/* Expanded case study panel */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="glass-panel border border-t-0 border-border p-8 md:p-10 space-y-8">
                          {/* Hero image */}
                          {project.image_url && (
                            <motion.div
                              className="w-full aspect-video rounded-lg overflow-hidden border border-border"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 }}
                            >
                              <img
                                src={project.image_url}
                                alt={project.title}
                                className="w-full h-full object-cover"
                              />
                            </motion.div>
                          )}

                          {/* Meta row */}
                          <motion.div
                            className="grid grid-cols-2 md:grid-cols-4 gap-4"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                          >
                            {project.client && (
                              <div>
                                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground block mb-1">Client</span>
                                <span className="text-sm text-foreground">{project.client}</span>
                              </div>
                            )}
                            {project.role && (
                              <div>
                                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground block mb-1">Role</span>
                                <span className="text-sm text-foreground">{project.role}</span>
                              </div>
                            )}
                            {project.duration && (
                              <div>
                                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground block mb-1">Duration</span>
                                <span className="text-sm text-foreground">{project.duration}</span>
                              </div>
                            )}
                            {(project.tools_used || []).length > 0 && (
                              <div>
                                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground block mb-1">Tools</span>
                                <div className="flex flex-wrap gap-1">
                                  {(project.tools_used || []).map((tool) => (
                                    <span key={tool} className="font-mono text-[10px] px-2 py-0.5 border border-border rounded-sm text-foreground">
                                      {tool}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </motion.div>

                          {/* Description */}
                          {project.description && (
                            <motion.p
                              className="text-muted-foreground leading-relaxed max-w-3xl"
                              initial={{ opacity: 0, y: 16 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                            >
                              {project.description}
                            </motion.p>
                          )}

                          {/* Case study sections */}
                          <motion.div
                            className="grid md:grid-cols-3 gap-6"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                          >
                            {project.challenge && (
                              <div className="glass-panel p-6 border border-border space-y-3">
                                <h4 className="font-mono text-xs tracking-[0.2em] uppercase text-primary">Challenge</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">{project.challenge}</p>
                              </div>
                            )}
                            {project.solution && (
                              <div className="glass-panel p-6 border border-border space-y-3">
                                <h4 className="font-mono text-xs tracking-[0.2em] uppercase text-primary">Solution</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">{project.solution}</p>
                              </div>
                            )}
                            {project.outcome && (
                              <div className="glass-panel p-6 border border-border space-y-3">
                                <h4 className="font-mono text-xs tracking-[0.2em] uppercase text-primary">Outcome</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">{project.outcome}</p>
                              </div>
                            )}
                          </motion.div>

                          {/* Content / long-form */}
                          {project.content && (
                            <motion.div
                              className="prose prose-invert prose-sm max-w-none text-muted-foreground"
                              initial={{ opacity: 0, y: 16 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                              dangerouslySetInnerHTML={{ __html: project.content }}
                            />
                          )}

                          {/* Gallery */}
                          {(project.gallery_urls || []).length > 0 && (
                            <motion.div
                              className="grid grid-cols-2 md:grid-cols-3 gap-3"
                              initial={{ opacity: 0, y: 16 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.35 }}
                            >
                              {(project.gallery_urls || []).map((url, idx) => (
                                <div key={idx} className="aspect-video rounded-lg overflow-hidden border border-border">
                                  <img src={url} alt={`${project.title} gallery ${idx + 1}`} className="w-full h-full object-cover" />
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Projects;
