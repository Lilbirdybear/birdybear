import { motion } from "framer-motion";

const FooterSection = () => {
  return (
    <motion.footer
      className="py-16 px-6 border-t border-border"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7 }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h3 className="text-xl font-bold text-foreground mb-2">Let's collaborate</h3>
          <a
            href="mailto:eli.birdsall@daydreamingknights.com"
            className="font-mono text-sm text-primary hover:text-primary/80 transition-colors"
          >
            eli.birdsall@daydreamingknights.com
          </a>
        </motion.div>

        <motion.div
          className="flex gap-6"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {["Behance", "Dribbble", "LinkedIn", "GitHub"].map((link, i) => (
            <motion.a
              key={link}
              href="#"
              className="font-mono text-xs tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              whileHover={{ y: -2, scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {link}
            </motion.a>
          ))}
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-border flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-wider text-muted-foreground">© 2026 PORTFOLIO</span>
        <span className="font-mono text-[10px] tracking-wider text-muted-foreground">THE ELI DESIGN</span>
      </div>
    </motion.footer>
  );
};

export default FooterSection;
