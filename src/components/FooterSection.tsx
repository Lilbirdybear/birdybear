const FooterSection = () => {
  return (
    <footer className="py-16 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-2">Let's collaborate</h3>
          <a
            href="mailto:hello@example.com"
            className="font-mono text-sm text-primary hover:text-primary/80 transition-colors"
          >
            hello@example.com
          </a>
        </div>

        <div className="flex gap-6">
          {["Behance", "Dribbble", "LinkedIn", "GitHub"].map((link) => (
            <a
              key={link}
              href="#"
              className="font-mono text-xs tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            >
              {link}
            </a>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-border flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-wider text-muted-foreground">
          © 2026 PORTFOLIO
        </span>
        <span className="font-mono text-[10px] tracking-wider text-muted-foreground">
          THE ELI DESIGN
        </span>
      </div>
    </footer>
  );
};

export default FooterSection;
