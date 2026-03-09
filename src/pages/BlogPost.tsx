import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import FooterSection from "@/components/FooterSection";

const BlogPost = () => {
  const { slug } = useParams();

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug!).eq("published", true).single();
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

  if (!post) {
    return (
      <div className="min-h-screen bg-background/80 backdrop-blur-sm flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Post not found</h1>
          <Link to="/blog" className="text-primary hover:underline font-mono text-sm">← Back to blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/80 backdrop-blur-sm">
      
      <div className="pt-14">
        <motion.article
          className="max-w-3xl mx-auto px-6 py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            BACK TO BLOG
          </Link>

          {post.cover_image_url && (
            <img src={post.cover_image_url} alt={post.title} className="w-full h-64 md:h-80 object-cover rounded mb-8" />
          )}
          <h1 className="text-4xl font-bold text-foreground mb-4">{post.title}</h1>
          {post.published_at && (
            <p className="font-mono text-xs text-muted-foreground mb-8">
              {new Date(post.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          )}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map(tag => (
                <span key={tag} className="font-mono text-[10px] tracking-wider text-muted-foreground px-2 py-1 border border-border rounded-sm">{tag}</span>
              ))}
            </div>
          )}
          <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-base">
            {post.content}
          </div>
        </motion.article>
        <FooterSection />
      </div>
    </div>
  );
};

export default BlogPost;
