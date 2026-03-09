import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Magnetic from "./Magnetic";

const socialLabels: Record<string, string> = {
  instagram: "Portfolio Instagram",
  artstation: "ArtStation",
  cara: "Cara",
  linkedin: "LinkedIn",
  github: "GitHub",
};

const socialOrder = ["instagram", "artstation", "cara", "linkedin", "github"];

const FooterSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [80, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").limit(1).single();
      if (error) throw error;
      return data;
    },
  });

  const socialLinks = (settings?.social_links || {}) as Record<string, string>;

  return (
    <motion.footer
      ref={ref}
      className="py-24 px-6 border-t border-border relative overflow-hidden"
      style={{ y, opacity }}
    >
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Big CTA */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h3
            className="text-4xl md:text-6xl font-bold text-foreground mb-6"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            Let's collaborate
          </motion.h3>
          <Magnetic strength={0.15}>
            <a
              href={`mailto:${settings?.email || "eli.birdsall@daydreamingknights.com"}`}
              className="inline-block font-mono text-sm md:text-base text-primary hover:text-primary/80 transition-all duration-300 cursor-magnetic border-b border-primary/30 hover:border-primary pb-1"
            >
              {settings?.email || "eli.birdsall@daydreamingknights.com"}
            </a>
          </Magnetic>
        </motion.div>

        {/* Social links */}
        <motion.div
          className="flex justify-center flex-wrap gap-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {socialOrder
            .filter((key) => socialLinks[key])
            .map((key) => (
              <Magnetic key={key} strength={0.4}>
                <motion.a
                  href={socialLinks[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative font-mono text-xs tracking-wider text-muted-foreground hover:text-foreground transition-colors cursor-magnetic"
                  whileHover={{ scale: 1.1 }}
                >
                  {socialLabels[key] || key}
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
                </motion.a>
              </Magnetic>
            ))}
        </motion.div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <motion.span
            className="font-mono text-[10px] tracking-wider text-muted-foreground/50"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            © 2026 ELI BIRDSALL
          </motion.span>
          <motion.span
            className="font-mono text-[10px] tracking-wider text-muted-foreground/50"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            THE ELI DESIGN
          </motion.span>
        </div>
      </div>
    </motion.footer>
  );
};

export default FooterSection;
