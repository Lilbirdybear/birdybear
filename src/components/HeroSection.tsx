import { useEffect, useRef } from "react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const xPercent = (clientX / innerWidth - 0.5) * 2;
      const yPercent = (clientY / innerHeight - 0.5) * 2;

      containerRef.current.style.setProperty("--rx", `${yPercent * -3}deg`);
      containerRef.current.style.setProperty("--ry", `${xPercent * 3}deg`);
      containerRef.current.style.setProperty("--tx", `${xPercent * 8}px`);
      containerRef.current.style.setProperty("--ty", `${yPercent * 8}px`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden perspective-container">
      {/* Background with parallax */}
      <div className="absolute inset-0 parallax-bg">
        <img src={heroBg} alt="" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
      </div>

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl animate-float" />
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-secondary/5 blur-3xl animate-float-reverse" />
      <div className="absolute top-1/2 right-1/3 w-32 h-32 rounded-full bg-accent/5 blur-3xl animate-float" style={{ animationDelay: "2s" }} />

      {/* Scan line effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="w-full h-px bg-primary/20 animate-scan-line" />
      </div>

      {/* Content with 3D mouse tracking */}
      <div
        className="relative z-10 max-w-5xl mx-auto px-6 text-center preserve-3d"
        style={{
          transform: "rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateX(var(--tx, 0px)) translateY(var(--ty, 0px))",
          transition: "transform 0.15s ease-out",
        }}
      >
        <div className="mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <span className="font-mono text-sm tracking-[0.3em] uppercase text-muted-foreground">
            Design Portfolio
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <span className="block text-foreground" style={{ transform: "translateZ(60px)", transformStyle: "preserve-3d" }}>The Eli</span>
          <span className="block text-foreground/30 text-3xl md:text-4xl lg:text-5xl font-light mt-2" style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>
            Design
          </span>
        </h1>

        <div className="flex items-center justify-center gap-8 mb-12 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.6s", transform: "translateZ(20px)", transformStyle: "preserve-3d" }}>
          <span className="font-mono text-xs tracking-widest text-gradient-ixd">IXD</span>
          <span className="w-px h-4 bg-border" />
          <span className="font-mono text-xs tracking-widest text-gradient-3d">3D DESIGN</span>
          <span className="w-px h-4 bg-border" />
          <span className="font-mono text-xs tracking-widest text-gradient-game">GAME DESIGN</span>
        </div>

        <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: "0.8s", transform: "translateZ(10px)", transformStyle: "preserve-3d" }}>
          <a
            href="#compartments"
            className="inline-flex items-center gap-2 glass-panel px-6 py-3 text-sm font-mono tracking-wider text-foreground hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)] animate-depth-pulse"
          >
            EXPLORE COMPARTMENTS
            <svg className="w-4 h-4 transition-transform group-hover:translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>
      </div>

      {/* Corner markers with float */}
      <div className="absolute top-8 left-8 w-8 h-8 border-l border-t border-primary/30 animate-float" style={{ animationDelay: "0s" }} />
      <div className="absolute top-8 right-8 w-8 h-8 border-r border-t border-primary/30 animate-float-reverse" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-8 left-8 w-8 h-8 border-l border-b border-primary/30 animate-float-reverse" style={{ animationDelay: "2s" }} />
      <div className="absolute bottom-8 right-8 w-8 h-8 border-r border-b border-primary/30 animate-float" style={{ animationDelay: "3s" }} />
    </section>
  );
};

export default HeroSection;
