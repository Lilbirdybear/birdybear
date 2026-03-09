import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import FooterSection from "@/components/FooterSection";

const categoryColor: Record<string, string> = {
  ixd: "text-ixd",
  "3d": "text-three-d",
  game: "text-game",
};

const categoryLabel: Record<string, string> = {
  ixd: "IXD",
  "3d": "3D",
  game: "GAME",
};

const ProjectDetail = () => {
  const { slug } = useParams();

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug!)
        .eq("published", true)
        .single();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background/80 backdrop-blur-sm flex items-center justify-center">
        <p className="text-muted-foreground font-mono text-sm">Loading...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background/80 backdrop-blur-sm flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Project not found</h1>
          <Link to="/" className="text-primary hover:underline font-mono text-sm">← Back home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/80 backdrop-blur-sm">
      
      <div className="pt-14">
        {/* Hero area */}
        <motion.div
          className="relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {project.image_url ? (
            <div className="w-full h-[40vh] md:h-[50vh] relative">
              <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            </div>
          ) : (
            <div className="w-full h-[30vh] bg-gradient-to-b from-muted/30 to-background" />
          )}
        </motion.div>

        <motion.div
          className="max-w-4xl mx-auto px-6 -mt-20 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            BACK TO PROJECTS
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <span className={`font-mono text-xs tracking-wider ${categoryColor[project.category] || "text-muted-foreground"}`}>
              {categoryLabel[project.category] || project.category.toUpperCase()}
            </span>
            <span className="text-muted-foreground/30">|</span>
            <span className="font-mono text-xs text-muted-foreground">{project.year}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">{project.title}</h1>

          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[10px] tracking-wider text-muted-foreground px-3 py-1.5 border border-border rounded-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="glass-panel p-8 md:p-12 mb-16">
            {project.description ? (
              <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-wrap">
                {project.description}
              </p>
            ) : (
              <p className="text-muted-foreground/50 italic">
                Project details coming soon. Check back for a full case study.
              </p>
            )}
          </div>
        </motion.div>

        <FooterSection />
      </div>
    </div>
  );
};

export default ProjectDetail;
