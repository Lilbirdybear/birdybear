import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  opacity: number;
  pulseSpeed: number;
  pulseOffset: number;
  vx: number;
  vy: number;
}

const ParticleField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    let mouse = { x: -1000, y: -1000 };
    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      createParticles();
    };

    const createParticles = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const count = Math.floor((w * h) / 3000);

      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 1.8 + 0.3,
        baseOpacity: Math.random() * 0.4 + 0.08,
        opacity: 0,
        pulseSpeed: Math.random() * 0.015 + 0.003,
        pulseOffset: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
      }));
    };

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);
      time += 1;

      // Draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Gentle drift
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        // Twinkle/pulse
        const pulse = Math.sin(time * p.pulseSpeed + p.pulseOffset);
        p.opacity = p.baseOpacity * (0.4 + 0.6 * (pulse * 0.5 + 0.5));

        // Mouse proximity — brighten + repel
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const mouseRadius = 180;

        if (dist < mouseRadius) {
          const proximity = 1 - dist / mouseRadius;
          p.opacity = Math.min(1, p.opacity + proximity * 0.5);

          // Gentle push away
          if (dist > 1) {
            const force = proximity * 0.6;
            p.x -= (dx / dist) * force;
            p.y -= (dy / dist) * force;
          }
        }

        if (p.opacity < 0.015) continue;

        // Draw dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(28, 210, 224, ${p.opacity})`;
        ctx.fill();

        // Soft glow for larger particles
        if (p.size > 1.2 && p.opacity > 0.2) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size + 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(28, 210, 224, ${p.opacity * 0.08})`;
          ctx.fill();
        }
      }

      // Connection lines near mouse
      if (mouse.x > 0) {
        const nearby: Particle[] = [];
        for (const p of particles) {
          const dm = Math.sqrt((mouse.x - p.x) ** 2 + (mouse.y - p.y) ** 2);
          if (dm < 160) nearby.push(p);
        }

        for (let i = 0; i < nearby.length; i++) {
          for (let j = i + 1; j < nearby.length; j++) {
            const a = nearby[i];
            const b = nearby[j];
            const d = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
            if (d < 90) {
              const alpha = (1 - d / 90) * 0.07;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.strokeStyle = `rgba(28, 210, 224, ${alpha})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
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
      style={{ pointerEvents: "none" }}
    />
  );
};

export default ParticleField;
