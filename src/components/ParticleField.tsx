import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  bright: boolean;
  color: [number, number, number]; // RGB
  vx: number;
  vy: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
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
    let shootingStars: ShootingStar[] = [];
    let mouse = { x: -1000, y: -1000 };
    let time = 0;
    let lastShootingStar = 0;

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
      const count = Math.floor(area / 2500);

      stars = Array.from({ length: count }, () => {
        const bright = Math.random() < 0.1;
        // Slight color variation: blue-white, warm-white, cyan-tinted
        const colorVariant = Math.random();
        let color: [number, number, number];
        if (colorVariant < 0.3) {
          color = [200, 220, 255]; // blue-white
        } else if (colorVariant < 0.5) {
          color = [180, 230, 240]; // cyan-tinted
        } else if (colorVariant < 0.7) {
          color = [255, 240, 220]; // warm
        } else {
          color = [255, 255, 255]; // pure white
        }
        
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          size: bright
            ? Math.random() * 2 + 0.8
            : Math.random() * 0.9 + 0.2,
          baseOpacity: bright
            ? Math.random() * 0.5 + 0.45
            : Math.random() * 0.3 + 0.05,
          opacity: 0,
          twinkleSpeed: Math.random() * 0.01 + 0.002,
          twinkleOffset: Math.random() * Math.PI * 2,
          bright,
          color,
          vx: (Math.random() - 0.5) * 0.02,
          vy: (Math.random() - 0.5) * 0.02,
        };
      });
    };

    const spawnShootingStar = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      shootingStars.push({
        x: Math.random() * w * 0.8,
        y: Math.random() * h * 0.3,
        vx: 3 + Math.random() * 4,
        vy: 1 + Math.random() * 2,
        life: 0,
        maxLife: 40 + Math.random() * 30,
        size: 1 + Math.random() * 1.5,
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

      // Occasional shooting stars
      if (time - lastShootingStar > 200 + Math.random() * 400) {
        spawnShootingStar();
        lastShootingStar = time;
      }

      // Subtle center nebula glow
      const grd = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.6);
      grd.addColorStop(0, "rgba(28, 210, 224, 0.006)");
      grd.addColorStop(0.5, "rgba(100, 140, 255, 0.003)");
      grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);

      // Draw stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        // Subtle drift
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0) s.x = w;
        if (s.x > w) s.x = 0;
        if (s.y < 0) s.y = h;
        if (s.y > h) s.y = 0;

        const twinkle = Math.sin(time * s.twinkleSpeed + s.twinkleOffset);
        const flash = Math.sin(time * s.twinkleSpeed * 3.7 + s.twinkleOffset * 2.1);
        const flashBoost = flash > 0.95 ? (flash - 0.95) * 10 : 0;

        s.opacity = s.baseOpacity * (0.5 + 0.5 * twinkle) + flashBoost * 0.2;

        // Mouse proximity
        const dx = mouse.x - s.x;
        const dy = mouse.y - s.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 250) {
          const proximity = (250 - dist) / 250;
          s.opacity += proximity * 0.35;
          // Push stars away slightly
          if (dist < 100) {
            const push = (100 - dist) / 100 * 0.3;
            s.x -= (dx / dist) * push;
            s.y -= (dy / dist) * push;
          }
        }

        s.opacity = Math.min(s.opacity, 1);
        if (s.opacity < 0.01) continue;

        const [r, g, b] = s.color;

        // Glow for bright stars
        if (s.bright && s.opacity > 0.3) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size + 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${s.opacity * 0.05})`;
          ctx.fill();
          
          // Cross-star effect for very bright moments
          if (s.opacity > 0.6) {
            ctx.beginPath();
            ctx.moveTo(s.x - s.size * 3, s.y);
            ctx.lineTo(s.x + s.size * 3, s.y);
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${s.opacity * 0.08})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(s.x, s.y - s.size * 3);
            ctx.lineTo(s.x, s.y + s.size * 3);
            ctx.stroke();
          }
        }

        // Main dot
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${s.opacity})`;
        ctx.fill();
      }

      // Draw shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.life++;

        const progress = ss.life / ss.maxLife;
        const alpha = progress < 0.3 ? progress / 0.3 : 1 - (progress - 0.3) / 0.7;

        if (ss.life > ss.maxLife) {
          shootingStars.splice(i, 1);
          continue;
        }

        // Trail
        const trailLen = 30;
        const gradient = ctx.createLinearGradient(
          ss.x, ss.y,
          ss.x - ss.vx * trailLen, ss.y - ss.vy * trailLen
        );
        gradient.addColorStop(0, `rgba(200, 230, 255, ${alpha * 0.6})`);
        gradient.addColorStop(1, `rgba(200, 230, 255, 0)`);

        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - ss.vx * trailLen, ss.y - ss.vy * trailLen);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = ss.size;
        ctx.stroke();

        // Head glow
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, ss.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 240, 255, ${alpha * 0.3})`;
        ctx.fill();
      }

      // Draw subtle connection lines between nearby stars near mouse
      if (mouse.x > 0) {
        for (let i = 0; i < stars.length; i++) {
          const s = stars[i];
          const dm = Math.sqrt((mouse.x - s.x) ** 2 + (mouse.y - s.y) ** 2);
          if (dm > 200) continue;
          
          for (let j = i + 1; j < stars.length; j++) {
            const s2 = stars[j];
            const dm2 = Math.sqrt((mouse.x - s2.x) ** 2 + (mouse.y - s2.y) ** 2);
            if (dm2 > 200) continue;
            
            const d = Math.sqrt((s.x - s2.x) ** 2 + (s.y - s2.y) ** 2);
            if (d < 80) {
              const lineAlpha = (1 - d / 80) * 0.06;
              ctx.beginPath();
              ctx.moveTo(s.x, s.y);
              ctx.lineTo(s2.x, s2.y);
              ctx.strokeStyle = `rgba(28, 210, 224, ${lineAlpha})`;
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
    />
  );
};

export default ParticleField;
