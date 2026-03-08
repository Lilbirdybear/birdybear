import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
      </div>

      {/* Scan line effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="w-full h-px bg-primary/20 animate-scan-line" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <span className="font-mono text-sm tracking-[0.3em] uppercase text-muted-foreground">
            Design Portfolio
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <span className="block text-foreground">Compartments</span>
          <span className="block text-foreground/30 text-3xl md:text-4xl lg:text-5xl font-light mt-2">
            of Design
          </span>
        </h1>

        <div className="flex items-center justify-center gap-8 mb-12 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <span className="font-mono text-xs tracking-widest text-gradient-ixd">IXD</span>
          <span className="w-px h-4 bg-border" />
          <span className="font-mono text-xs tracking-widest text-gradient-3d">3D DESIGN</span>
          <span className="w-px h-4 bg-border" />
          <span className="font-mono text-xs tracking-widest text-gradient-game">GAME DESIGN</span>
        </div>

        <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
          <a
            href="#compartments"
            className="inline-flex items-center gap-2 glass-panel px-6 py-3 text-sm font-mono tracking-wider text-foreground hover:border-primary/50 transition-colors"
          >
            EXPLORE COMPARTMENTS
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>
      </div>

      {/* Corner markers */}
      <div className="absolute top-8 left-8 w-8 h-8 border-l border-t border-primary/30" />
      <div className="absolute top-8 right-8 w-8 h-8 border-r border-t border-primary/30" />
      <div className="absolute bottom-8 left-8 w-8 h-8 border-l border-b border-primary/30" />
      <div className="absolute bottom-8 right-8 w-8 h-8 border-r border-b border-primary/30" />
    </section>
  );
};

export default HeroSection;
