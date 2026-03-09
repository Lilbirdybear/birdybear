import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TextReveal from "@/components/TextReveal";
import { toast } from "sonner";

import herwayImg from "@/assets/projects/herway.jpg";
import echoesImg from "@/assets/projects/echoes-atlantis.jpg";
import neuralImg from "@/assets/projects/neural-interface.jpg";
import vertexImg from "@/assets/projects/vertex-creature.jpg";
import neonImg from "@/assets/projects/neon-descent.jpg";
import hapticImg from "@/assets/projects/haptic-dashboard.jpg";
import mechImg from "@/assets/projects/mech-assembly.jpg";
import phantomImg from "@/assets/projects/phantom-protocol.jpg";
import modularEmorraImg from "@/assets/projects/modular-emorra.jpg";
import flybyWinchImg from "@/assets/projects/flyby-winch.jpg";
import civicWebImg from "@/assets/projects/civic-web.jpg";
import arLensImg from "@/assets/projects/ar-lens.jpg";
import crystalRealmsImg from "@/assets/projects/crystal-realms.jpg";
import smartHabitatImg from "@/assets/projects/smart-habitat.jpg";
import synthHandImg from "@/assets/projects/synth-hand.jpg";

const fallbackImages: Record<string, string> = {
  "HerWay": herwayImg,
  "Echoes of Atlantis": echoesImg,
  "Neural Interface": neuralImg,
  "Vertex Creature": vertexImg,
  "Neon Descent": neonImg,
  "Haptic Dashboard": hapticImg,
  "Mech Assembly": mechImg,
  "Phantom Protocol": phantomImg,
  "Modular Emorra": modularEmorraImg,
  "Flyby Mechanical Winch": flybyWinchImg,
  "Civic Web Redesign": civicWebImg,
  "AR Lens Prototype": arLensImg,
  "Crystal Realms": crystalRealmsImg,
  "Smart Habitat": smartHabitatImg,
  "Synth Hand": synthHandImg,
};

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

const categoryBorder: Record<string, string> = {
  ixd: "hover:border-ixd/40",
  "3d": "hover:border-three-d/40",
  game: "hover:border-game/40",
};

const Projects = () => {
  const [active, setActive] = useState<Filter>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());
  const [passwordInputs, setPasswordInputs] = useState<Record<string, string>>({});
  const [pendingUnlockId, setPendingUnlockId] = useState<string | null>(null);
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const { scrollYProgress } = useScroll();
  const topButtonY = useTransform(scrollYProgress, [0, 1], ["90vh", "10vh"]);

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

  const scrollToPanel = (id: string) => {
    const project = projects.find(p => p.id === id);
    const isLocked = project && (project as any).is_password_protected && !unlockedIds.has(id);

    if (isLocked) {
      setPendingUnlockId(id);
    } else {
      setExpandedId(id);
    }

    // Use requestAnimationFrame + setTimeout to ensure DOM has updated after state change
    requestAnimationFrame(() => {
      setTimeout(() => {
        const el = document.getElementById(`project-panel-${id}`);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 112;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }, 250);
    });
  };

  const toggleExpand = (id: string) => {
    const project = projects.find(p => p.id === id);
    if (project && (project as any).is_password_protected && !unlockedIds.has(id)) {
      setPendingUnlockId(id);
      return;
    }
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleUnlock = async (projectId: string) => {
    const password = passwordInputs[projectId] || "";
    const { data, error } = await supabase.rpc("verify_project_password" as any, {
      _project_id: projectId,
      _password: password,
    });
    if (error || !data) {
      toast.error("Incorrect password");
      return;
    }
    setUnlockedIds(prev => new Set(prev).add(projectId));
    setPendingUnlockId(null);
    setExpandedId(projectId);
    setPasswordInputs(prev => ({ ...prev, [projectId]: "" }));
    toast.success("Access granted");
  };

  const isProtected = (project: any) => project.is_password_protected && !unlockedIds.has(project.id);

  return (
    <div className="min-h-screen scroll-smooth noise-bg pt-28 pb-20 px-6 bg-background/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
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

        {/* Table of Contents */}
        <motion.div
          id="toc-section"
          className="mb-20 border border-border rounded-sm overflow-hidden scroll-mt-28"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="px-5 py-3 border-b border-border bg-muted/30">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
              TABLE OF CONTENTS
            </span>
          </div>
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => {
              const locked = isProtected(project);
              return (
                <motion.button
                  key={project.id}
                  onClick={() => scrollToPanel(project.id)}
                  className="w-full flex items-center justify-between px-5 py-3 border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors duration-200 text-left group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: i * 0.03, duration: 0.4 }}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] text-muted-foreground w-6">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className={`w-1.5 h-1.5 rounded-full ${categoryDot[project.category]}`} />
                    <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                      {project.title}
                    </span>
                    {locked && (
                      <svg className="w-3.5 h-3.5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    )}
                    {!locked && !(project as any).is_password_protected && (
                      <span className="font-mono text-[9px] tracking-wider text-primary/60 px-1.5 py-0.5 border border-primary/20 rounded-sm">
                        PUBLIC
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden md:flex gap-1.5">
                      {(project.tags || []).slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[9px] tracking-wider text-muted-foreground px-1.5 py-0.5 border border-border rounded-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground">{project.year}</span>
                    <svg
                      className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Large Case Study Panels */}
        <div className="space-y-10">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => {
              const isExpanded = expandedId === project.id;
              const locked = isProtected(project);
              const showPasswordPrompt = pendingUnlockId === project.id;

              return (
                <motion.div
                  key={project.id}
                  ref={(el) => { panelRefs.current[project.id] = el; }}
                  id={`project-panel-${project.id}`}
                  layout
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 40 }}
                  transition={{ delay: i * 0.06, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                  className="scroll-mt-28"
                >
                  {/* Large square panel */}
                  <button
                    onClick={() => toggleExpand(project.id)}
                    className={`w-full relative aspect-square md:aspect-[2/1] overflow-hidden rounded-sm border border-border ${categoryBorder[project.category]} transition-all duration-500 group text-left`}
                  >
                    {/* Background image with privacy glass effect for locked projects */}
                    {(project.image_url || fallbackImages[project.title]) && (
                      <img
                        src={project.image_url || fallbackImages[project.title]}
                        alt={project.title}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                          locked
                            ? "opacity-20 blur-[12px] saturate-0 scale-110"
                            : "opacity-40 group-hover:opacity-60 group-hover:scale-105"
                        }`}
                      />
                    )}

                    {/* Privacy glass overlay for locked projects */}
                    {locked && (
                      <div className="absolute inset-0 bg-gradient-to-br from-muted/40 via-background/60 to-muted/30 backdrop-blur-sm">
                        <div
                          className="absolute inset-0 opacity-[0.03]"
                          style={{
                            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, currentColor 2px, currentColor 3px)`,
                          }}
                        />
                      </div>
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

                    {/* Content overlay */}
                    <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                      {/* Category + year */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-2 h-2 rounded-full ${categoryDot[project.category]}`} />
                        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                          {project.category} — {project.year}
                        </span>
                        {locked && (
                          <span className="font-mono text-[10px] tracking-wider text-muted-foreground flex items-center gap-1.5 ml-2">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            PASSWORD PROTECTED
                          </span>
                        )}
                        {!(project as any).is_password_protected && (
                          <span className="font-mono text-[10px] tracking-wider text-primary/60 ml-2">
                            PUBLIC
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                        {project.title}
                      </h2>

                      {/* Description preview */}
                      {project.description && !locked && (
                        <p className="text-sm md:text-base text-muted-foreground max-w-2xl line-clamp-2 mb-4">
                          {project.description}
                        </p>
                      )}

                      {locked && (
                        <p className="text-sm text-muted-foreground/60 italic mb-4">
                          Enter password to view case study details
                        </p>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {(project.tags || []).map((tag) => (
                          <span
                            key={tag}
                            className={`font-mono text-[10px] tracking-wider text-muted-foreground px-2 py-1 border border-border rounded-sm backdrop-blur-sm bg-background/30 ${
                              locked ? "blur-[3px]" : ""
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Expand indicator / lock icon */}
                      <div className="absolute top-8 right-8 md:top-12 md:right-12">
                        {locked ? (
                          <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center backdrop-blur-sm bg-background/30">
                            <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                        ) : (
                          <motion.div
                            className="w-10 h-10 rounded-full border border-border flex items-center justify-center backdrop-blur-sm bg-background/30 group-hover:border-primary/40 transition-colors"
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <svg className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                            </svg>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Password prompt */}
                  <AnimatePresence>
                    {showPasswordPrompt && locked && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="glass-panel border border-t-0 border-border p-8 flex flex-col items-center gap-4">
                          <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center mb-2">
                            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                          <h3 className="font-mono text-sm tracking-wider text-foreground">ENTER ACCESS PASSWORD</h3>
                          <p className="text-xs text-muted-foreground text-center max-w-sm">
                            This project is protected under NDA. Please enter the password to view the case study.
                          </p>
                          <div className="flex gap-2 w-full max-w-xs">
                            <Input
                              type="password"
                              placeholder="Password"
                              value={passwordInputs[project.id] || ""}
                              onChange={(e) => setPasswordInputs(prev => ({ ...prev, [project.id]: e.target.value }))}
                              onKeyDown={(e) => e.key === "Enter" && handleUnlock(project.id)}
                              className="bg-muted/50 border-border text-sm"
                            />
                            <Button
                              onClick={(e) => { e.stopPropagation(); handleUnlock(project.id); }}
                              size="sm"
                              className="font-mono text-xs"
                            >
                              Unlock
                            </Button>
                          </div>
                          <button
                            onClick={() => setPendingUnlockId(null)}
                            className="font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Expanded case study detail */}
                  <AnimatePresence>
                    {isExpanded && !locked && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="glass-panel border border-t-0 border-border p-8 md:p-10 space-y-8">
                          {/* Meta row */}
                          <motion.div
                            className="grid grid-cols-2 md:grid-cols-4 gap-4"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
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

                          {/* Challenge / Solution / Outcome */}
                          <motion.div
                            className="grid md:grid-cols-3 gap-6"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
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

                          {/* Long-form content */}
                          {project.content && (
                            <motion.div
                              className="prose prose-invert prose-sm max-w-none text-muted-foreground"
                              initial={{ opacity: 0, y: 16 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                              dangerouslySetInnerHTML={{ __html: project.content }}
                            />
                          )}

                          {/* Gallery */}
                          {(project.gallery_urls || []).length > 0 && (
                            <motion.div
                              className="grid grid-cols-2 md:grid-cols-3 gap-3"
                              initial={{ opacity: 0, y: 16 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.25 }}
                            >
                              {(project.gallery_urls || []).map((url, idx) => (
                                <div key={idx} className="aspect-video rounded-sm overflow-hidden border border-border">
                                  {url.match(/\.(mp4|webm|mov)$/i) ? (
                                    <video src={url} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                                  ) : (
                                    <img src={url} alt={`${project.title} gallery ${idx + 1}`} className="w-full h-full object-cover" />
                                  )}
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

      {/* Floating TOP button that moves with scroll */}
      <motion.button
        onClick={() => {
          const el = document.getElementById("toc-section");
          if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY - 112;
            window.scrollTo({ top, behavior: "smooth" });
          }
        }}
        className="fixed right-8 z-50 group flex flex-col items-center gap-2 cursor-magnetic"
        style={{ top: topButtonY }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <motion.div
          className="w-10 h-10 rounded-full border border-border flex items-center justify-center backdrop-blur-md bg-background/60 group-hover:border-primary/40 transition-colors duration-300 shadow-lg"
        >
          <svg
            className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-300 rotate-180"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
        <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-muted-foreground group-hover:text-primary transition-colors duration-300">
          TOP
        </span>
      </motion.button>
      </div>
    </div>
  );
};

export default Projects;
