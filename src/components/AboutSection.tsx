import { motion } from "framer-motion";
import { useRef, useState } from "react";
import TextReveal from "./TextReveal";

const toolCards = [
  { cls: "compartment-ixd glow-ixd", label: "TOOLS — IXD / UX / PM", labelColor: "text-ixd", tools: ["Figma", "Miro", "Mural", "Framer", "Principle", "Adobe XD", "ProtoPie", "Web Design", "SEO", "Marketing", "Jira", "Monday", "ClickUp", "HacknPlan"] },
  { cls: "compartment-3d glow-3d", label: "TOOLS — 3D / VFX / 2D", labelColor: "text-three-d", tools: ["Blender", "ZBrush", "Maya", "3DS Max", "Cinema 4D", "Substance Painter", "Mari", "Marmoset Toolbag", "Fusion 360", "FreeCAD", "Houdini", "Nuke Studio", "Red Giant", "Redshift", "3D Printing", "Procreate", "Adobe Photoshop", "Adobe Suite"] },
  { cls: "compartment-game glow-game", label: "TOOLS — GAME", labelColor: "text-game", tools: ["Unreal Engine", "Unity", "Godot", "Game Maker"] },
  { cls: "glass-panel", label: "HARDWARE & TINKERING", labelColor: "text-muted-foreground", tools: ["ESP32", "Raspberry Pi", "3D Printers", "Custom PCB Design"] },
  { cls: "glass-panel", label: "CERTIFICATIONS", labelColor: "text-muted-foreground", tools: ["CompTIA Security+", "Blockchain Expert (Blockchain Council)", "NFT Certification of Excellence (Blockchain Council)", "Small Electronics Engineering Products & Systems", "Unreal Engine (ELVTR)", "Unreal Engine (Epic Games)", "3D Design", "Computer Hardware", "UI/UX (Google & Figma)", "CAD (AutoDesk)", "Leadership (Southern Utah University)", "Leadership (Washington School of World Studies)"] },
];

const ToolCard = ({ item, index }: { item: typeof toolCards[0]; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -6, y: x * 6 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className={`glass-panel-hover p-6 ${item.cls} border-gradient overflow-hidden`}
      initial={{ opacity: 0, x: 80, rotateY: -15 }}
      whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.1, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
      }}
      style={{ perspective: 800, transformStyle: "preserve-3d" }}
    >
      <h4 className={`font-mono text-[10px] tracking-[0.15em] ${item.labelColor} mb-4 uppercase`}>{item.label}</h4>
      <div className="flex flex-wrap gap-1.5">
        {item.tools.map((tool, ti) => (
          <motion.span
            key={tool}
            className="inline-block text-[11px] text-muted-foreground px-2 py-0.5 rounded-sm bg-muted/30 border border-border/50 hover:border-primary/30 hover:text-foreground transition-all duration-300"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + ti * 0.02, duration: 0.3 }}
            whileHover={{ scale: 1.05, y: -1 }}
          >
            {tool}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
};

const AboutSection = () => {
  return (
    <section className="py-32 px-6 border-t border-border relative">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
        >
          <motion.span
            className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground block mb-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            // ABOUT
          </motion.span>

          <TextReveal
            text="Eli Birdsall"
            as="h2"
            className="text-3xl md:text-4xl font-bold text-foreground mb-8"
            delay={0.2}
          />

          {[
            "With 8+ years in design, I work across the full spectrum — from interaction design and 3D visualization to game development and hardware tinkering. I run a small print-to-order specialty service that has sharpened my craft as a 3D artist, and I'm constantly building projects that span communication tools, ESP32/Raspberry Pi devices, and immersive game worlds.",
            "Currently working on two titles under NDA: a classic cyberpunk multi-world game delivering a cinematic experience that will blow players' minds, and a mini game designed to elevate the social experience online.",
            "I'm a tinkerer and inventor at heart — every discipline informs the others. Game mechanics sharpen my UX thinking, 3D skills add depth to interfaces, and interaction design brings polish to everything I touch.",
          ].map((para, i) => (
            <motion.p
              key={i}
              className="text-muted-foreground leading-relaxed mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.7 }}
            >
              {para}
            </motion.p>
          ))}
        </motion.div>

        <div className="space-y-4">
          {toolCards.map((item, i) => (
            <ToolCard key={item.label} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
