import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

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
      {/* Background with scroll parallax */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <img src={heroBg} alt="" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
      </motion.div>

      {/* Floating orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl"
        animate={{ y: [0, -12, 0], rotateY: [0, 3, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-secondary/5 blur-3xl"
        animate={{ y: [0, -8, 0], rotateX: [0, 2, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 right-1/3 w-32 h-32 rounded-full bg-accent/5 blur-3xl"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Scan line */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="w-full h-px bg-primary/20 animate-scan-line" />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-6 text-center preserve-3d"
        style={{
          y: contentY,
          opacity,
          transform: "rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateX(var(--tx, 0px)) translateY(var(--ty, 0px))",
          transition: "transform 0.15s ease-out",
        }}
      >
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 30, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
        >
          <span className="font-mono text-sm tracking-[0.3em] uppercase text-muted-foreground">
            Design Portfolio
          </span>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8"
          initial={{ opacity: 0, y: 40, rotateX: 15 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.4, duration: 0.9, ease: "easeOut" }}
        >
          <span className="block text-foreground" style={{ transform: "translateZ(60px)", transformStyle: "preserve-3d" }}>The Eli</span>
          <span className="block text-foreground/30 text-3xl md:text-4xl lg:text-5xl font-light mt-2" style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>
            Design
          </span>
        </motion.h1>

        <motion.div
          className="flex items-center justify-center gap-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}
        >
          <span className="font-mono text-xs tracking-widest text-gradient-ixd">IXD</span>
          <span className="w-px h-4 bg-border" />
          <span className="font-mono text-xs tracking-widest text-gradient-3d">3D DESIGN</span>
          <span className="w-px h-4 bg-border" />
          <span className="font-mono text-xs tracking-widest text-gradient-game">GAME DESIGN</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
          style={{ transform: "translateZ(10px)", transformStyle: "preserve-3d" }}
        >
          <a
            href="#compartments"
            className="inline-flex items-center gap-2 glass-panel px-6 py-3 text-sm font-mono tracking-wider text-foreground hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)]"
          >
            EXPLORE COMPARTMENTS
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </motion.div>
      </motion.div>

      {/* Corner markers */}
      {[
        { pos: "top-8 left-8", border: "border-l border-t", delay: 0 },
        { pos: "top-8 right-8", border: "border-r border-t", delay: 1 },
        { pos: "bottom-8 left-8", border: "border-l border-b", delay: 2 },
        { pos: "bottom-8 right-8", border: "border-r border-b", delay: 3 },
      ].map((m, i) => (
        <motion.div
          key={i}
          className={`absolute ${m.pos} w-8 h-8 ${m.border} border-primary/30`}
          animate={{ y: [0, -6, 0], x: [0, i % 2 === 0 ? -3 : 3, 0] }}
          transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: m.delay }}
        />
      ))}
    </section>
  );
};

export default HeroSection;
