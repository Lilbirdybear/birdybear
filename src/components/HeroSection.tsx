import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import Magnetic from "./Magnetic";

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const blur = useTransform(scrollYProgress, [0, 0.7], [0, 12]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX / innerWidth - 0.5) * 40);
      mouseY.set((clientY / innerHeight - 0.5) * 40);

      containerRef.current.style.setProperty("--mouse-x", `${clientX}px`);
      containerRef.current.style.setProperty("--mouse-y", `${clientY}px`);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const title = "THE ELI DESIGN";

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: `radial-gradient(circle 800px at var(--mouse-x, 50%) var(--mouse-y, 50%), hsl(var(--primary) / 0.03), transparent)`,
      }}
    >
      {/* Subtle gradient vignette */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-background/30" />
      </div>

      {/* Floating gradient orbs */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-15"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary) / 0.12), transparent 70%)",
          x: springX,
          y: springY,
          left: "15%",
          top: "15%",
        }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, hsl(var(--secondary) / 0.08), transparent 70%)",
          x: useTransform(springX, v => v * -0.6),
          y: useTransform(springY, v => v * -0.6),
          right: "10%",
          bottom: "15%",
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-6 text-center preserve-3d"
        style={{
          y: contentY,
          opacity,
          scale,
          filter: useTransform(blur, v => `blur(${v}px)`),
        }}
      >
        {/* Status badge */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.3, duration: 1, ease: [0.23, 1, 0.32, 1] }}
        >
          <span className="inline-flex items-center gap-3 glass-panel px-5 py-2.5 text-[10px] font-mono tracking-[0.35em] uppercase text-muted-foreground border-gradient">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Available for work
          </span>
        </motion.div>

        {/* Large title with magnetic letters */}
        <div className="mb-16 overflow-hidden">
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none flex flex-wrap items-center justify-center gap-1 md:gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {title.split("").map((char, i) => (
              <Magnetic key={i} strength={0.4}>
                <motion.span
                  className="inline-block text-foreground hover:text-primary transition-colors duration-300 cursor-none"
                  initial={{ opacity: 0, y: 60, filter: "blur(12px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    delay: 0.9 + i * 0.05,
                    duration: 0.8,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                  whileHover={{ scale: 1.15, color: "hsl(var(--primary))" }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              </Magnetic>
            ))}
          </motion.h1>
        </div>

        {/* Discipline tags */}
        <motion.div
          className="flex items-center justify-center gap-8 md:gap-12 mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
        >
          {[
            { label: "IXD", cls: "text-gradient-ixd" },
            { label: "3D DESIGN", cls: "text-gradient-3d" },
            { label: "GAME DESIGN", cls: "text-gradient-game" },
          ].map((item, i) => (
            <motion.span
              key={item.label}
              className={`font-mono text-[10px] md:text-xs tracking-[0.25em] ${item.cls}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 + i * 0.15, duration: 0.6 }}
              whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
            >
              {item.label}
            </motion.span>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          <Magnetic strength={0.2}>
            <a
              href="#compartments"
              className="group inline-flex items-center gap-3 glass-panel-hover px-10 py-5 text-sm font-mono tracking-[0.2em] text-foreground border-gradient cursor-magnetic"
            >
              EXPLORE WORK
              <motion.svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* Corner markers */}
      {[
        { pos: "top-8 left-8", border: "border-l border-t" },
        { pos: "top-8 right-8", border: "border-r border-t" },
        { pos: "bottom-8 left-8", border: "border-l border-b" },
        { pos: "bottom-8 right-8", border: "border-r border-b" },
      ].map((m, i) => (
        <motion.div
          key={i}
          className={`absolute ${m.pos} w-8 h-8 ${m.border} border-primary/15`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.2 + i * 0.1, duration: 0.5 }}
        />
      ))}

      {/* Mouse scroll indicator - LUXE style */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
      >
        {/* Mouse icon */}
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-primary/40 flex justify-center pt-2"
          animate={{ borderColor: ["hsl(var(--primary) / 0.4)", "hsl(var(--primary) / 0.7)", "hsl(var(--primary) / 0.4)"] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-2 rounded-full bg-primary"
            animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
        <span className="font-mono text-[9px] tracking-[0.4em] text-muted-foreground/50 uppercase">Scroll</span>
      </motion.div>
    </section>
  );
};

export default HeroSection;
