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
  const mouseRef = useRef({ x: -1000, y: -1000, down: false, prevX: -1000, prevY: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef<number>(0);

  const sampleText = useCallback((canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(dpr, dpr);

    const fontSize = Math.min(w * 0.14, 140);
    ctx.font = `700 ${fontSize}px 'Space Grotesk', sans-serif`;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, w / 2, h * 0.42);

    if (subtext) {
      const subSize = fontSize * 0.55;
      ctx.font = `300 ${subSize}px 'Space Grotesk', sans-serif`;
      ctx.fillStyle = "#ffffff";
      ctx.fillText(subtext, w / 2, h * 0.42 + fontSize * 0.7);
    }

    ctx.restore();

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const particles: Particle[] = [];
    const gap = Math.max(2, Math.floor(3 * (1 / dpr)));

    const colors = [
      "rgba(28, 210, 224,",
      "rgba(28, 210, 224,",
      "rgba(28, 210, 224,",
      "rgba(255, 255, 255,",
      "rgba(255, 255, 255,",
      "rgba(26, 224, 122,",
      "rgba(232, 97, 58,",
    ];

    for (let y = 0; y < canvas.height; y += gap) {
      for (let x = 0; x < canvas.width; x += gap) {
        const i = (y * canvas.width + x) * 4;
        if (data[i + 3] > 128) {
          const px = x / dpr;
          const py = y / dpr;
          particles.push({
            x: px + (Math.random() - 0.5) * 600,
            y: py + (Math.random() - 0.5) * 600,
            originX: px,
            originY: py,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
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

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      particlesRef.current = sampleText(canvas, ctx);
    };

    resize();

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const m = mouseRef.current;
      m.prevX = m.x;
      m.prevY = m.y;
      m.x = e.clientX - rect.left;
      m.y = e.clientY - rect.top;
    };

    const handleLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    const handleDown = () => { mouseRef.current.down = true; };
    const handleUp = () => { mouseRef.current.down = false; };

    // Click explosion
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const particles = particlesRef.current;
      const EXPLODE_RADIUS = 200;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dx = p.x - cx;
        const dy = p.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < EXPLODE_RADIUS) {
          const force = ((EXPLODE_RADIUS - dist) / EXPLODE_RADIUS) * 18;
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * force;
          p.vy += Math.sin(angle) * force;
        }
      }
    };

    const HOVER_RADIUS = 140;
    const DRAG_RADIUS = 100;
    const RETURN_SPEED = 0.045;
    const FRICTION = 0.93;

    const draw = () => {
      if (!ctx || !canvas) return;
      const dprLocal = window.devicePixelRatio || 1;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dprLocal, dprLocal);

      const mouse = mouseRef.current;
      const particles = particlesRef.current;

      // Mouse velocity for swirl
      const mouseVX = mouse.x - mouse.prevX;
      const mouseVY = mouse.y - mouse.prevY;
      const mouseSpeed = Math.sqrt(mouseVX * mouseVX + mouseVY * mouseVY);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life += 0.018;

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (mouse.down && dist < DRAG_RADIUS) {
          // Vortex swirl when dragging
          const force = ((DRAG_RADIUS - dist) / DRAG_RADIUS) * 4;
          const angle = Math.atan2(dy, dx);
          // Tangential force for swirl + slight attraction
          p.vx += (-Math.sin(angle) * force * 0.8 + Math.cos(angle) * force * 0.3);
          p.vy += (Math.cos(angle) * force * 0.8 + Math.sin(angle) * force * 0.3);
        } else if (dist < HOVER_RADIUS) {
          // Repel on hover
          const force = ((HOVER_RADIUS - dist) / HOVER_RADIUS);
          const angle = Math.atan2(dy, dx);
          const repelStrength = 4 + mouseSpeed * 0.5;
          p.vx -= Math.cos(angle) * force * repelStrength;
          p.vy -= Math.sin(angle) * force * repelStrength;

          // Transfer mouse momentum to particles
          if (mouseSpeed > 2) {
            p.vx += mouseVX * force * 0.15;
            p.vy += mouseVY * force * 0.15;
          }
        }

        // Return to origin
        p.vx += (p.originX - p.x) * RETURN_SPEED;
        p.vy += (p.originY - p.y) * RETURN_SPEED;

        p.vx *= FRICTION;
        p.vy *= FRICTION;

        p.x += p.vx;
        p.y += p.vy;

        // Displacement metrics
        const distFromOrigin = Math.sqrt((p.x - p.originX) ** 2 + (p.y - p.originY) ** 2);
        const displaced = Math.min(distFromOrigin / 50, 1);
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const speedFactor = Math.min(speed / 8, 1);

        const pulseAlpha = p.opacity * (0.7 + 0.3 * Math.sin(p.life));
        const finalAlpha = Math.min(pulseAlpha + displaced * 0.4, 1);

        // Outer glow when displaced or fast
        if (displaced > 0.08 || speedFactor > 0.1) {
          const glowSize = p.size + 3 + displaced * 4 + speedFactor * 2;
          const glowAlpha = Math.max(displaced, speedFactor) * 0.1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${glowAlpha.toFixed(3)})`;
          ctx.fill();
        }

        // Motion trail when fast
        if (speed > 3) {
          const trailAlpha = speedFactor * 0.15;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 2, p.y - p.vy * 2);
          ctx.strokeStyle = `${p.color}${trailAlpha.toFixed(3)})`;
          ctx.lineWidth = p.size * 0.6;
          ctx.stroke();
        }

        // Main particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size + displaced * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${finalAlpha.toFixed(3)})`;
        ctx.fill();
      }

      // Connections between displaced particles near mouse
      const connRadius = 35;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const pDist = Math.sqrt((p.x - p.originX) ** 2 + (p.y - p.originY) ** 2);
        if (pDist < 4) continue;

        const pMouseDist = Math.sqrt((p.x - mouse.x) ** 2 + (p.y - mouse.y) ** 2);
        if (pMouseDist > 200) continue;

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const qDist = Math.sqrt((q.x - q.originX) ** 2 + (q.y - q.originY) ** 2);
          if (qDist < 4) continue;

          const ddx = p.x - q.x;
          const ddy = p.y - q.y;
          const dd = Math.sqrt(ddx * ddx + ddy * ddy);
          if (dd < connRadius) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(28, 210, 224, ${0.12 * (1 - dd / connRadius)})`;
            ctx.lineWidth = 0.6;
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
    canvas.addEventListener("mousedown", handleDown);
    canvas.addEventListener("mouseup", handleUp);
    canvas.addEventListener("click", handleClick);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouse);
      canvas.removeEventListener("mouseleave", handleLeave);
      canvas.removeEventListener("mousedown", handleDown);
      canvas.removeEventListener("mouseup", handleUp);
      canvas.removeEventListener("click", handleClick);
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
