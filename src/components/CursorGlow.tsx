import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

const CursorGlow = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  const springX = useSpring(0, { stiffness: 150, damping: 15 });
  const springY = useSpring(0, { stiffness: 150, damping: 15 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      springX.set(e.clientX);
      springY.set(e.clientY);
      setVisible(true);
    };

    const checkHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setHovering(
        !!target.closest("a, button, [role='button'], .cursor-magnetic")
      );
    };

    const leave = () => setVisible(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mousemove", checkHover);
    document.addEventListener("mouseleave", leave);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousemove", checkHover);
      document.removeEventListener("mouseleave", leave);
    };
  }, [springX, springY]);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      {/* Glow blob */}
      <motion.div
        className="fixed pointer-events-none z-[9999]"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          width: hovering ? 60 : 300,
          height: hovering ? 60 : 300,
          opacity: visible ? 1 : 0,
          transition: "width 0.4s, height 0.4s, opacity 0.3s",
        }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background: hovering
              ? "radial-gradient(circle, hsl(185 90% 55% / 0.4), transparent 70%)"
              : "radial-gradient(circle, hsl(185 90% 55% / 0.08), transparent 70%)",
            transition: "background 0.4s",
          }}
        />
      </motion.div>

      {/* Dot cursor */}
      <motion.div
        className="fixed pointer-events-none z-[10000] rounded-full"
        style={{
          left: pos.x,
          top: pos.y,
          translateX: "-50%",
          translateY: "-50%",
          width: hovering ? 16 : 8,
          height: hovering ? 16 : 8,
          opacity: visible ? 1 : 0,
          transition: "width 0.25s cubic-bezier(0.23,1,0.32,1), height 0.25s cubic-bezier(0.23,1,0.32,1), opacity 0.2s, box-shadow 0.25s",
          background: hovering
            ? "hsl(var(--primary))"
            : "radial-gradient(circle, hsl(var(--primary)), hsl(var(--primary) / 0.6))",
          boxShadow: hovering
            ? "0 0 12px 4px hsl(var(--primary) / 0.5), 0 0 4px 1px hsl(var(--primary) / 0.8)"
            : "0 0 6px 2px hsl(var(--primary) / 0.4)",
        }}
      />

      {/* Outer ring */}
      <motion.div
        className="fixed pointer-events-none z-[9999] rounded-full border border-primary/40"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          width: hovering ? 40 : 24,
          height: hovering ? 40 : 24,
          opacity: visible ? 0.6 : 0,
          transition: "width 0.35s cubic-bezier(0.23,1,0.32,1), height 0.35s cubic-bezier(0.23,1,0.32,1), opacity 0.2s",
        }}
      />
    </>
  );
};

export default CursorGlow;
