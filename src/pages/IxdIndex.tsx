import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";

const IxdIndex = () => {
  const { data: pages, isLoading } = useQuery({
    queryKey: ["ixd-pages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ixd_pages")
        .select("*")
        .eq("published", true)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen noise-bg">
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground block mb-4">
            // INTERACTION DESIGN
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">IXD</h1>
          <p className="text-muted-foreground max-w-xl mb-16">
            A collection of coursework, case studies, and explorations in interaction design.
          </p>
        </motion.div>

        {isLoading ? (
          <p className="text-muted-foreground font-mono text-sm">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pages?.map((page, i) => (
              <motion.div
                key={page.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <Link
                  to={`/ixd/${page.slug}`}
                  className="group block glass-panel p-6 border border-border hover:border-primary/40 transition-all duration-300"
                >
                  {page.cover_image_url && (
                    <img
                      src={page.cover_image_url}
                      alt={page.title}
                      className="w-full aspect-video object-cover mb-4 rounded"
                    />
                  )}
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {page.title}
                  </h3>
                  {page.description && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {page.description}
                    </p>
                  )}
                  <span className="inline-block mt-4 font-mono text-[10px] tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                    VIEW →
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <FooterSection />
    </div>
  );
};

export default IxdIndex;
