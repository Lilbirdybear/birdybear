import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  // Some stars will be "bright" with a subtle glow
  bright: boolean;
}

const ParticleField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let stars: Star[] = [];
    let mouse = { x: -1000, y: -1000 };
    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      createStars();
    };

    const createStars = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const area = w * h;
      // Dense star count like chronark — lots of tiny dots
      const count = Math.floor(area / 3000);

      stars = Array.from({ length: count }, () => {
        const bright = Math.random() < 0.08; // 8% are brighter stars
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          size: bright
            ? Math.random() * 1.8 + 0.8  // bright stars: 0.8-2.6px
            : Math.random() * 0.8 + 0.2,  // dim stars: 0.2-1.0px
          baseOpacity: bright
            ? Math.random() * 0.5 + 0.4   // bright: 0.4-0.9
            : Math.random() * 0.3 + 0.05, // dim: 0.05-0.35
          opacity: 0,
          twinkleSpeed: Math.random() * 0.008 + 0.002, // Very slow twinkle
          twinkleOffset: Math.random() * Math.PI * 2,
          bright,
        };
      });
    };

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      const dpr = window.devicePixelRatio || 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      time += 1;

      // Subtle radial vignette gradient from center
      const grd = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.7);
      grd.addColorStop(0, "rgba(28, 210, 224, 0.008)");
      grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        // Twinkle: smooth sine-based opacity oscillation
        const twinkle = Math.sin(time * s.twinkleSpeed + s.twinkleOffset);
        // Some stars occasionally "flash" brighter
        const flash = Math.sin(time * s.twinkleSpeed * 3.7 + s.twinkleOffset * 2.1);
        const flashBoost = flash > 0.95 ? (flash - 0.95) * 8 : 0;

        s.opacity = s.baseOpacity * (0.5 + 0.5 * twinkle) + flashBoost * 0.15;

        // Subtle mouse proximity brightening
        const dx = mouse.x - s.x;
        const dy = mouse.y - s.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          const proximity = (200 - dist) / 200;
          s.opacity += proximity * 0.25;
        }

        s.opacity = Math.min(s.opacity, 1);

        if (s.opacity < 0.01) continue;

        // Draw glow for bright stars
        if (s.bright && s.opacity > 0.3) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size + 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 220, 255, ${s.opacity * 0.06})`;
          ctx.fill();
        }

        // Main star dot
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        // Slightly warm/cool color variation
        if (s.bright) {
          ctx.fillStyle = `rgba(220, 235, 255, ${s.opacity})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
        }
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    const handleMouse = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    resize();
    draw();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouse);
    document.addEventListener("mouseleave", handleLeave);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      document.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};

export default ParticleField;
