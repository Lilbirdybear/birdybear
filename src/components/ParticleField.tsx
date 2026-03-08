import { useEffect, useRef } from "react";

const ParticleField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let mouse = { x: -1000, y: -1000, down: false };
    let particles: {
      x: number; y: number; vx: number; vy: number;
      baseSize: number; size: number; opacity: number; pulse: number;
      originX: number; originY: number;
    }[] = [];

    const INTERACTION_RADIUS = 200;
    const CONNECTION_RADIUS = 120;
    const MOUSE_CONNECTION_RADIUS = 250;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      const count = Math.floor((canvas.width * canvas.height) / 12000);
      particles = Array.from({ length: count }, () => {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        return {
          x, y,
          originX: x, originY: y,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          baseSize: Math.random() * 1.5 + 0.5,
          size: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.5 + 0.1,
          pulse: Math.random() * Math.PI * 2,
        };
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Primary color from CSS: hsl(185 90% 55%) ≈ rgb(28, 210, 224)
      const pr = 28, pg = 210, pb = 224;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.02;

        // Wrap
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Mouse repulsion / attraction
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < INTERACTION_RADIUS) {
          const force = (INTERACTION_RADIUS - dist) / INTERACTION_RADIUS;
          if (mouse.down) {
            // Attract on click
            p.vx += (dx / dist) * force * 0.08;
            p.vy += (dy / dist) * force * 0.08;
          } else {
            // Repel on hover
            p.vx -= (dx / dist) * force * 0.04;
            p.vy -= (dy / dist) * force * 0.04;
          }
          // Grow near cursor
          p.size = p.baseSize + (1 - dist / INTERACTION_RADIUS) * 2;
        } else {
          p.size += (p.baseSize - p.size) * 0.05;
        }

        // Dampen & gentle drift back
        p.vx *= 0.985;
        p.vy *= 0.985;

        const pulseOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));

        // Glow near cursor
        const glowStrength = dist < INTERACTION_RADIUS ? (1 - dist / INTERACTION_RADIUS) * 0.6 : 0;

        if (glowStrength > 0.05) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size + 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${pr}, ${pg}, ${pb}, ${glowStrength * 0.15})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        const r = Math.round(255 + (pr - 255) * glowStrength);
        const g = Math.round(255 + (pg - 255) * glowStrength);
        const b = Math.round(255 + (pb - 255) * glowStrength);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${pulseOpacity + glowStrength * 0.3})`;
        ctx.fill();
      });

      // Draw connections — brighter near cursor
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_RADIUS) {
            const midX = (particles[i].x + particles[j].x) / 2;
            const midY = (particles[i].y + particles[j].y) / 2;
            const mouseDist = Math.sqrt((mouse.x - midX) ** 2 + (mouse.y - midY) ** 2);
            const nearMouse = mouseDist < MOUSE_CONNECTION_RADIUS;
            const baseAlpha = 0.04 * (1 - dist / CONNECTION_RADIUS);
            const alpha = nearMouse
              ? baseAlpha + (1 - mouseDist / MOUSE_CONNECTION_RADIUS) * 0.12
              : baseAlpha;

            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = nearMouse
              ? `rgba(${pr}, ${pg}, ${pb}, ${alpha})`
              : `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = nearMouse ? 0.8 : 0.5;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    const handleMouse = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleDown = () => { mouse.down = true; };
    const handleUp = () => { mouse.down = false; };
    const handleLeave = () => { mouse.x = -1000; mouse.y = -1000; };

    resize();
    createParticles();
    draw();

    window.addEventListener("resize", () => { resize(); createParticles(); });
    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);
    document.addEventListener("mouseleave", handleLeave);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
      document.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  );
};

export default ParticleField;
