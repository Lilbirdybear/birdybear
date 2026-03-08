import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import Magnetic from "./Magnetic";

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const blur = useTransform(scrollYProgress, [0, 0.8], [0, 10]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX / innerWidth - 0.5) * 30);
      mouseY.set((clientY / innerHeight - 0.5) * 30);

      containerRef.current.style.setProperty("--mouse-x", `${clientX}px`);
      containerRef.current.style.setProperty("--mouse-y", `${clientY}px`);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Accessible h1 for SEO (visually hidden, particle canvas is visual)
  const title = "The Eli Design";

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: `radial-gradient(circle 600px at var(--mouse-x, 50%) var(--mouse-y, 50%), hsl(var(--primary) / 0.04), transparent)`,
      }}
    >
      {/* Background parallax */}
      <motion.div className="absolute inset-0" style={{ y: bgY, scale: 1.1 }}>
        <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
      </motion.div>

      {/* Animated grid lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary) / 0.03) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary) / 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }} />
      </div>

      {/* Floating gradient orbs */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary) / 0.15), transparent 70%)",
          x: springX,
          y: springY,
          left: "20%",
          top: "20%",
        }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full opacity-15"
        style={{
          background: "radial-gradient(circle, hsl(var(--secondary) / 0.1), transparent 70%)",
          x: useTransform(springX, v => v * -0.5),
          y: useTransform(springY, v => v * -0.5),
          right: "15%",
          bottom: "20%",
        }}
      />
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, hsl(var(--accent) / 0.1), transparent 70%)",
          x: useTransform(springX, v => v * 0.3),
          y: useTransform(springY, v => v * 0.3),
          right: "30%",
          top: "40%",
        }}
      />

      {/* Scan line */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-scan-line" />
      </div>

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
          className="mb-10"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, duration: 1, ease: [0.23, 1, 0.32, 1] }}
        >
          <span className="inline-flex items-center gap-2 glass-panel px-4 py-2 text-xs font-mono tracking-[0.3em] uppercase text-muted-foreground border-gradient">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Available for work
          </span>
        </motion.div>



        {/* Title with letter-by-letter animation */}
        <div className="mb-4 overflow-hidden">
          <div className="flex items-center justify-center gap-1 md:gap-2">
            {"The Eli Design".split("").map((char, i) => (
              <motion.span
                key={i}
                className={`text-4xl md:text-6xl lg:text-7xl font-bold text-foreground inline-block ${char === " " ? "w-3 md:w-5" : ""}`}
                initial={{ opacity: 0, y: 40, rotateX: -90, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
                transition={{
                  delay: 1.0 + i * 0.05,
                  duration: 0.6,
                  ease: [0.23, 1, 0.32, 1],
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Discipline tags */}
        <motion.div
          className="flex items-center justify-center gap-6 md:gap-10 mb-14"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          {[
            { label: "IXD", cls: "text-gradient-ixd" },
            { label: "3D DESIGN", cls: "text-gradient-3d" },
            { label: "GAME DESIGN", cls: "text-gradient-game" },
          ].map((item, i) => (
            <motion.span
              key={item.label}
              className={`font-mono text-[10px] md:text-xs tracking-[0.2em] ${item.cls}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 + i * 0.15, duration: 0.6 }}
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
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          <Magnetic strength={0.2}>
            <a
              href="#compartments"
              className="group inline-flex items-center gap-3 glass-panel-hover px-8 py-4 text-sm font-mono tracking-wider text-foreground border-gradient cursor-magnetic"
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

      {/* Corner markers with pulse */}
      {[
        { pos: "top-6 left-6", border: "border-l-2 border-t-2" },
        { pos: "top-6 right-6", border: "border-r-2 border-t-2" },
        { pos: "bottom-6 left-6", border: "border-l-2 border-b-2" },
        { pos: "bottom-6 right-6", border: "border-r-2 border-b-2" },
      ].map((m, i) => (
        <motion.div
          key={i}
          className={`absolute ${m.pos} w-6 h-6 ${m.border} border-primary/20`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.8 + i * 0.1, duration: 0.5 }}
        />
      ))}

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
      >
        <span className="font-mono text-[9px] tracking-[0.3em] text-muted-foreground/50 uppercase">Scroll</span>
        <motion.div
          className="w-px h-8 bg-gradient-to-b from-primary/50 to-transparent"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "top" }}
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
