import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import FooterSection from "@/components/FooterSection";

const IxdPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: page, isLoading: pageLoading } = useQuery({
    queryKey: ["ixd-page", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ixd_pages")
        .select("*")
        .eq("slug", slug!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const { data: articles } = useQuery({
    queryKey: ["ixd-articles", page?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ixd_articles")
        .select("*")
        .eq("page_id", page!.id)
        .eq("published", true)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
    enabled: !!page?.id,
  });

  if (pageLoading) {
    return (
      <div className="min-h-screen noise-bg flex items-center justify-center">
        <p className="text-muted-foreground font-mono text-sm">Loading...</p>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen noise-bg flex items-center justify-center">
        <p className="text-muted-foreground font-mono text-sm">Page not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen noise-bg">
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            to="/ixd"
            className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors mb-8 inline-block"
          >
            ← Back to IXD
          </Link>

          {page.cover_image_url && (
            <img
              src={page.cover_image_url}
              alt={page.title}
              className="w-full aspect-video object-cover rounded mb-8"
            />
          )}

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{page.title}</h1>
          {page.description && (
            <p className="text-lg text-muted-foreground mb-8">{page.description}</p>
          )}

          {page.content && (
            <div className="prose prose-invert max-w-none mb-16">
              <div dangerouslySetInnerHTML={{ __html: page.content.replace(/\n/g, "<br/>") }} />
            </div>
          )}
        </motion.div>

        {/* Articles / Case Studies */}
        {articles && articles.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-8">Articles & Case Studies</h2>
            <div className="space-y-4">
              {articles.map((article, i) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-panel border border-border p-6 hover:border-primary/40 transition-all duration-300"
                >
                  <div className="flex gap-6">
                    {article.cover_image_url && (
                      <img
                        src={article.cover_image_url}
                        alt={article.title}
                        className="w-32 h-24 object-cover rounded flex-shrink-0"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-foreground mb-2">{article.title}</h3>
                      {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {article.tags.map((tag) => (
                            <span
                              key={tag}
                              className="font-mono text-[9px] tracking-wider uppercase px-2 py-0.5 bg-muted rounded text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {article.content && (
                        <div
                          className="text-sm text-muted-foreground prose prose-invert max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: article.content.replace(/\n/g, "<br/>"),
                          }}
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
      <FooterSection />
    </div>
  );
};

export default IxdPage;
