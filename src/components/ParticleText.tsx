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
            x: px + (Math.random() - 0.5) * 500,
            y: py + (Math.random() - 0.5) * 500,
            originX: px,
            originY: py,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 1.8 + 0.6,
            color: colors[Math.floor(Math.random() * colors.length)],
            opacity: Math.random() * 0.4 + 0.5,
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
      // Smoothly reset instead of snapping
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    const handleDown = () => { mouseRef.current.down = true; };
    const handleUp = () => { mouseRef.current.down = false; };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const particles = particlesRef.current;
      const EXPLODE_RADIUS = 180;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dx = p.x - cx;
        const dy = p.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < EXPLODE_RADIUS && dist > 0) {
          const force = ((EXPLODE_RADIUS - dist) / EXPLODE_RADIUS) * 10;
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * force;
          p.vy += Math.sin(angle) * force;
        }
      }
    };

    // Smooth, organic physics — inspired by unshift.jp
    const HOVER_RADIUS = 160;
    const DRAG_RADIUS = 130;
    const RETURN_SPRING = 0.015;   // Very gentle spring — slow, elastic return
    const FRICTION = 0.965;         // High friction = smooth deceleration, no jitter
    const REPEL_STRENGTH = 1.8;     // Gentle push, not harsh snap

    const draw = () => {
      if (!ctx || !canvas) return;
      const dprLocal = window.devicePixelRatio || 1;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dprLocal, dprLocal);

      const mouse = mouseRef.current;
      const particles = particlesRef.current;

      const mouseVX = mouse.x - mouse.prevX;
      const mouseVY = mouse.y - mouse.prevY;
      const mouseSpeed = Math.sqrt(mouseVX * mouseVX + mouseVY * mouseVY);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life += 0.012;

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (mouse.down && dist < DRAG_RADIUS && dist > 0) {
          // Smooth vortex — gentle tangential + radial
          const force = ((DRAG_RADIUS - dist) / DRAG_RADIUS);
          const angle = Math.atan2(dy, dx);
          const easedForce = force * force * 2; // Quadratic easing for smooth falloff
          p.vx += (-Math.sin(angle) * easedForce * 0.6 + Math.cos(angle) * easedForce * 0.2);
          p.vy += (Math.cos(angle) * easedForce * 0.6 + Math.sin(angle) * easedForce * 0.2);
        } else if (dist < HOVER_RADIUS && dist > 0) {
          // Smooth repulsion with quadratic falloff
          const t = (HOVER_RADIUS - dist) / HOVER_RADIUS;
          const easedT = t * t; // Smooth quadratic curve
          const angle = Math.atan2(dy, dx);
          const strength = REPEL_STRENGTH + mouseSpeed * 0.08;
          p.vx -= Math.cos(angle) * easedT * strength;
          p.vy -= Math.sin(angle) * easedT * strength;

          // Subtle momentum transfer from mouse movement
          if (mouseSpeed > 1) {
            p.vx += mouseVX * easedT * 0.06;
            p.vy += mouseVY * easedT * 0.06;
          }
        }

        // Gentle spring return — creates that elastic, organic feel
        const toOriginX = p.originX - p.x;
        const toOriginY = p.originY - p.y;
        p.vx += toOriginX * RETURN_SPRING;
        p.vy += toOriginY * RETURN_SPRING;

        // Smooth friction
        p.vx *= FRICTION;
        p.vy *= FRICTION;

        p.x += p.vx;
        p.y += p.vy;

        // Visual feedback
        const distFromOrigin = Math.sqrt(toOriginX * toOriginX + toOriginY * toOriginY);
        const displaced = Math.min(distFromOrigin / 60, 1);
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);

        const pulseAlpha = p.opacity * (0.75 + 0.25 * Math.sin(p.life));
        const finalAlpha = Math.min(pulseAlpha + displaced * 0.25, 1);

        // Soft glow halo when displaced
        if (displaced > 0.1) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size + 2 + displaced * 3, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${(displaced * 0.06).toFixed(3)})`;
          ctx.fill();
        }

        // Subtle motion trail
        if (speed > 1.5) {
          const trailAlpha = Math.min(speed / 15, 0.12);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 2.5, p.y - p.vy * 2.5);
          ctx.strokeStyle = `${p.color}${trailAlpha.toFixed(3)})`;
          ctx.lineWidth = p.size * 0.5;
          ctx.stroke();
        }

        // Main particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size + displaced * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${finalAlpha.toFixed(3)})`;
        ctx.fill();
      }

      // Elegant connections — only between nearby displaced particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const pDist = Math.sqrt((p.x - p.originX) ** 2 + (p.y - p.originY) ** 2);
        if (pDist < 5) continue;
        const pMouseDist = Math.sqrt((p.x - mouse.x) ** 2 + (p.y - mouse.y) ** 2);
        if (pMouseDist > 180) continue;

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const qDist = Math.sqrt((q.x - q.originX) ** 2 + (q.y - q.originY) ** 2);
          if (qDist < 5) continue;

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
