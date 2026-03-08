import { useEffect, useRef, useCallback } from "react";

interface ParticleTextProps {
  text: string;
  subtext?: string;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  life: number;
}

const ParticleText = ({ text, subtext, className = "" }: ParticleTextProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef<number>(0);
  const initializedRef = useRef(false);

  const sampleText = useCallback((canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    // Clear and draw text to sample
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(dpr, dpr);

    // Main title
    const fontSize = Math.min(w * 0.14, 140);
    ctx.font = `700 ${fontSize}px 'Space Grotesk', sans-serif`;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, w / 2, h * 0.42);

    // Subtext
    if (subtext) {
      const subSize = fontSize * 0.55;
      ctx.font = `300 ${subSize}px 'Space Grotesk', sans-serif`;
      ctx.fillStyle = "#ffffff";
      ctx.fillText(subtext, w / 2, h * 0.42 + fontSize * 0.7);
    }

    ctx.restore();

    // Sample pixels
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const particles: Particle[] = [];
    const gap = Math.max(2, Math.floor(3 * (1 / dpr)));

    // Primary: hsl(185 90% 55%) ≈ #1cd2e0
    // Secondary: hsl(12 85% 60%) ≈ #e8613a  
    // Accent: hsl(145 80% 50%) ≈ #1ae07a
    const colors = [
      "rgba(28, 210, 224,",  // primary
      "rgba(28, 210, 224,",
      "rgba(28, 210, 224,",
      "rgba(255, 255, 255,", // white
      "rgba(255, 255, 255,",
      "rgba(26, 224, 122,",  // accent
      "rgba(232, 97, 58,",   // secondary
    ];

    for (let y = 0; y < canvas.height; y += gap) {
      for (let x = 0; x < canvas.width; x += gap) {
        const i = (y * canvas.width + x) * 4;
        if (data[i + 3] > 128) {
          const px = x / dpr;
          const py = y / dpr;
          particles.push({
            x: px + (Math.random() - 0.5) * 400,
            y: py + (Math.random() - 0.5) * 400,
            originX: px,
            originY: py,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 2 + 0.8,
            color: colors[Math.floor(Math.random() * colors.length)],
            opacity: Math.random() * 0.5 + 0.5,
            life: Math.random() * Math.PI * 2,
          });
        }
      }
    }

    return particles;
  }, [text, subtext]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      particlesRef.current = sampleText(canvas, ctx);
      initializedRef.current = true;
    };

    resize();

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    const MOUSE_RADIUS = 120;
    const RETURN_SPEED = 0.06;
    const FRICTION = 0.92;

    const draw = () => {
      if (!ctx || !canvas) return;
      const dprLocal = window.devicePixelRatio || 1;
      
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dprLocal, dprLocal);

      const mouse = mouseRef.current;
      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life += 0.015;

        // Mouse interaction
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_RADIUS) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          const angle = Math.atan2(dy, dx);
          p.vx -= Math.cos(angle) * force * 3;
          p.vy -= Math.sin(angle) * force * 3;
        }

        // Return to origin
        p.vx += (p.originX - p.x) * RETURN_SPEED;
        p.vy += (p.originY - p.y) * RETURN_SPEED;

        // Friction
        p.vx *= FRICTION;
        p.vy *= FRICTION;

        p.x += p.vx;
        p.y += p.vy;

        // Distance from origin for glow effect
        const distFromOrigin = Math.sqrt((p.x - p.originX) ** 2 + (p.y - p.originY) ** 2);
        const displaced = Math.min(distFromOrigin / 40, 1);

        const pulseAlpha = p.opacity * (0.7 + 0.3 * Math.sin(p.life));
        const finalAlpha = Math.min(pulseAlpha + displaced * 0.3, 1);

        // Glow when displaced
        if (displaced > 0.1) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size + 2 + displaced * 3, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${(displaced * 0.08).toFixed(3)})`;
          ctx.fill();
        }

        // Main particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size + displaced * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${finalAlpha.toFixed(3)})`;
        ctx.fill();
      }

      // Draw connections between nearby displaced particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dOrig = Math.sqrt((p.x - p.originX) ** 2 + (p.y - p.originY) ** 2);
        if (dOrig < 5) continue;

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const qOrig = Math.sqrt((q.x - q.originX) ** 2 + (q.y - q.originY) ** 2);
          if (qOrig < 5) continue;

          const ddx = p.x - q.x;
          const ddy = p.y - q.y;
          const dd = Math.sqrt(ddx * ddx + ddy * ddy);
          if (dd < 30) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(28, 210, 224, ${0.08 * (1 - dd / 30)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    draw();

    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", handleMouse);
    canvas.addEventListener("mouseleave", handleLeave);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouse);
      canvas.removeEventListener("mouseleave", handleLeave);
    };
  }, [sampleText]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full pointer-events-auto ${className}`}
      style={{ height: "320px" }}
    />
  );
};

export default ParticleText;
