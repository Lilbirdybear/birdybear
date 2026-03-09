import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Magnetic from "./Magnetic";

interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  size: number;
  life: number;
}

interface MagneticLetterProps {
  char: string;
  index: number;
}

let particleId = 0;

const MagneticLetter = ({ char, index }: MagneticLetterProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const spawnParticles = useCallback(() => {
    const newParticles: Particle[] = Array.from({ length: 3 }, () => ({
      id: particleId++,
      x: (Math.random() - 0.5) * 20,
      y: (Math.random() - 0.5) * 20,
      angle: Math.random() * Math.PI * 2,
      speed: 15 + Math.random() * 25,
      size: 1.5 + Math.random() * 2.5,
      life: 0.4 + Math.random() * 0.5,
    }));
    setParticles((prev) => [...prev.slice(-20), ...newParticles]);
  }, []);

  const handleHoverStart = useCallback(() => {
    setIsHovered(true);
    spawnParticles();
    intervalRef.current = setInterval(spawnParticles, 120);
  }, [spawnParticles]);

  const handleHoverEnd = useCallback(() => {
    setIsHovered(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  if (char === " ") {
    return (
      <motion.span
        className="inline-block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 + index * 0.05 }}
      >
        &nbsp;
      </motion.span>
    );
  }

  return (
    <Magnetic strength={0.6}>
      <motion.span
        className="inline-block relative cursor-none select-none"
        initial={{ opacity: 0, y: 60, filter: "blur(12px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{
          delay: 0.9 + index * 0.05,
          duration: 0.8,
          ease: [0.23, 1, 0.32, 1],
        }}
        whileHover={{ scale: 1.2 }}
        onHoverStart={handleHoverStart}
        onHoverEnd={handleHoverEnd}
      >
        <motion.span
          className="inline-block text-foreground"
          style={{
            textShadow: isHovered
              ? [
                  "0 1px 0 hsl(var(--primary) / 0.4)",
                  "0 2px 0 hsl(var(--primary) / 0.3)",
                  "0 3px 0 hsl(var(--primary) / 0.2)",
                  "0 4px 0 hsl(var(--primary) / 0.1)",
                  "0 5px 10px rgba(0,0,0,0.4)",
                  "0 0 20px hsl(var(--primary) / 0.5)",
                  "0 0 40px hsl(var(--primary) / 0.2)",
                ].join(", ")
              : [
                  "0 1px 0 hsl(var(--foreground) / 0.15)",
                  "0 2px 0 hsl(var(--foreground) / 0.1)",
                  "0 3px 0 hsl(var(--foreground) / 0.07)",
                  "0 4px 0 hsl(var(--foreground) / 0.04)",
                  "0 5px 10px rgba(0,0,0,0.2)",
                ].join(", "),
          }}
          animate={{
            color: isHovered ? "hsl(var(--primary))" : "hsl(var(--foreground))",
            rotateX: isHovered ? -8 : 0,
            rotateY: isHovered ? 5 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          {char}
        </motion.span>

        {/* Particles */}
        <AnimatePresence>
          {particles.map((p) => (
            <motion.span
              key={p.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: p.size,
                height: p.size,
                background: "hsl(var(--primary))",
                boxShadow: `0 0 ${p.size * 2}px hsl(var(--primary) / 0.6)`,
                left: "50%",
                top: "50%",
              }}
              initial={{
                x: p.x,
                y: p.y,
                opacity: 1,
                scale: 1,
              }}
              animate={{
                x: p.x + Math.cos(p.angle) * p.speed,
                y: p.y + Math.sin(p.angle) * p.speed,
                opacity: 0,
                scale: 0,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: p.life,
                ease: "easeOut",
              }}
            />
          ))}
        </AnimatePresence>
      </motion.span>
    </Magnetic>
  );
};

export default MagneticLetter;
