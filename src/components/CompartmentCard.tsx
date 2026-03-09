import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface CompartmentCardProps {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  variant: "ixd" | "3d" | "game";
  index: number;
}

const variantStyles = {
  ixd: {
    border: "compartment-ixd",
    glow: "glow-ixd",
    gradient: "text-gradient-ixd",
    dot: "bg-ixd",
  },
  "3d": {
    border: "compartment-3d",
    glow: "glow-3d",
    gradient: "text-gradient-3d",
    dot: "bg-three-d",
  },
  game: {
    border: "compartment-game",
    glow: "glow-game",
    gradient: "text-gradient-game",
    dot: "bg-game",
  },
};

const CompartmentCard = ({ title, subtitle, description, image, variant, index }: CompartmentCardProps) => {
  const styles = variantStyles[variant];
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({ rotateX: (y - 0.5) * -12, rotateY: (x - 0.5) * 12 });
    setGlowPos({ x: x * 100, y: y * 100 });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
    setGlowPos({ x: 50, y: 50 });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group glass-panel-hover ${styles.border} overflow-hidden border-gradient cursor-magnetic`}
      initial={{ opacity: 0, y: 60, rotateY: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.15, duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
      animate={{
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY,
      }}
      style={{
        perspective: 1000,
        transformStyle: "preserve-3d",
        transition: "rotateX 0.2s, rotateY 0.2s",
      }}
    >
      {/* Mouse-following glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(300px circle at ${glowPos.x}% ${glowPos.y}%, hsl(var(--primary) / 0.1), transparent 70%)`,
        }}
      />

      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <motion.img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <motion.div
            className={`w-2 h-2 rounded-full ${styles.dot}`}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-foreground/60">{subtitle}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6" style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>
        <h3 className={`text-2xl font-bold mb-3 ${styles.gradient}`}>{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        <Link to="/projects#toc-section">
          <motion.div
            className="mt-6 flex items-center gap-2 font-mono text-[10px] tracking-wider text-muted-foreground group-hover:text-foreground transition-all duration-300"
            whileHover={{ x: 4 }}
          >
            <span>VIEW PROJECTS</span>
            <motion.svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </motion.svg>
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
};

export default CompartmentCard;
