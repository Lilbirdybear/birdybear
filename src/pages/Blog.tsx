import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import FooterSection from "@/components/FooterSection";

const Blog = () => {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      
      <div className="pt-14">
        <section className="py-32 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground block mb-4">
                // BLOG
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Articles & Thoughts</h1>
              <p className="text-muted-foreground mb-16 max-w-lg">
                Writing about design, game development, 3D art, tinkering, and everything in between.
              </p>
            </motion.div>

            {isLoading ? (
              <p className="text-muted-foreground font-mono text-sm">Loading posts...</p>
            ) : posts.length === 0 ? (
              <motion.div
                className="glass-panel p-12 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-muted-foreground mb-2">No posts yet.</p>
                <p className="text-muted-foreground/50 text-sm">Check back soon for new articles.</p>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {posts.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  >
                    <Link to={`/blog/${post.slug}`} className="block group">
                      <div className="glass-panel p-6 md:p-8 border border-border hover:border-primary/20 transition-all duration-300">
                        <div className="flex flex-col md:flex-row gap-6">
                          {post.cover_image_url && (
                            <img
                              src={post.cover_image_url}
                              alt={post.title}
                              className="w-full md:w-48 h-32 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                              {post.title}
                            </h2>
                            {post.excerpt && (
                              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                            )}
                            <div className="flex items-center gap-4">
                              {post.published_at && (
                                <span className="font-mono text-[10px] text-muted-foreground">
                                  {new Date(post.published_at).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              )}
                              {post.tags && post.tags.length > 0 && (
                                <div className="hidden md:flex gap-2">
                                  {post.tags.slice(0, 3).map((tag) => (
                                    <span key={tag} className="font-mono text-[10px] tracking-wider text-muted-foreground px-2 py-0.5 border border-border rounded-sm">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <svg className="hidden md:block w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all self-center" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
        <FooterSection />
      </div>
    </div>
  );
};

export default Blog;
