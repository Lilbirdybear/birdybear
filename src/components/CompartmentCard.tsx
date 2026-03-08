import { useRef, useState } from "react";

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
  const [transform, setTransform] = useState("");

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTransform(`perspective(800px) rotateX(${y * -8}deg) rotateY(${x * 8}deg) translateZ(10px)`);
  };

  const handleMouseLeave = () => {
    setTransform("perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)");
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group glass-panel border ${styles.border} ${styles.glow} overflow-hidden opacity-0 animate-slide-in-3d preserve-3d`}
      style={{
        animationDelay: `${0.2 + index * 0.2}s`,
        transform,
        transition: "transform 0.3s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.5s ease",
      }}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          style={{ transform: "translateZ(0)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        
        {/* Label */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${styles.dot}`} />
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-foreground/70">
            {subtitle}
          </span>
        </div>
      </div>

      {/* Content - pushed forward in Z space */}
      <div className="p-6" style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}>
        <h3 className={`text-2xl font-bold mb-3 ${styles.gradient}`}>
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>

        <div className="mt-6 flex items-center gap-2 font-mono text-xs tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
          <span>VIEW PROJECTS</span>
          <svg className="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CompartmentCard;
