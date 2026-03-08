import { useRef, useState } from "react";
import { motion } from "framer-motion";

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

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rotateX: y * -8, rotateY: x * 8 });
  };

  const handleMouseLeave = () => setTilt({ rotateX: 0, rotateY: 0 });

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group glass-panel border ${styles.border} ${styles.glow} overflow-hidden preserve-3d`}
      initial={{ opacity: 0, rotateY: -15, z: -200 }}
      whileInView={{ opacity: 1, rotateY: 0, z: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.2, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      style={{
        perspective: 800,
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY,
        transition: "rotateX 0.3s, rotateY 0.3s",
      }}
      whileHover={{ z: 20, transition: { duration: 0.3 } }}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <motion.img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.7 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${styles.dot}`} />
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-foreground/70">{subtitle}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6" style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}>
        <h3 className={`text-2xl font-bold mb-3 ${styles.gradient}`}>{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        <div className="mt-6 flex items-center gap-2 font-mono text-xs tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
          <span>VIEW PROJECTS</span>
          <svg className="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
};

export default CompartmentCard;
