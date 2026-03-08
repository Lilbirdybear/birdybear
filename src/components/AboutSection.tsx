import { motion } from "framer-motion";

const toolCards = [
  { cls: "compartment-ixd glow-ixd", label: "TOOLS — IXD", labelColor: "text-ixd", tools: "Figma, Framer, Principle, Adobe XD, ProtoPie" },
  { cls: "compartment-3d glow-3d", label: "TOOLS — 3D", labelColor: "text-three-d", tools: "Blender, ZBrush, Substance Painter, Cinema 4D, Maya" },
  { cls: "compartment-game glow-game", label: "TOOLS — GAME", labelColor: "text-game", tools: "Unreal Engine, Unity, Godot, Game Maker" },
];

const AboutSection = () => {
  return (
    <section className="py-32 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
        <motion.div
          initial={{ opacity: 0, y: 50, rotateX: 8 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground block mb-4">
            // ABOUT
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            Designer across<br />dimensions
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            I work at the intersection of interaction design, 3D visualization, and game development — 
            creating experiences that blur the line between functional interfaces and immersive worlds.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Each discipline informs the others: game mechanics sharpen my UX thinking, 
            3D skills add depth to interfaces, and interaction design brings polish to game experiences.
          </p>
        </motion.div>

        <div className="space-y-6">
          {toolCards.map((item, i) => (
            <motion.div
              key={item.label}
              className={`glass-panel p-6 ${item.cls} tilt-card`}
              initial={{ opacity: 0, x: 60, rotateY: -12 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.15, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
              whileHover={{
                scale: 1.03,
                rotateY: 3,
                transition: { duration: 0.3 },
              }}
            >
              <h4 className={`font-mono text-xs tracking-wider ${item.labelColor} mb-3`}>{item.label}</h4>
              <p className="text-sm text-muted-foreground">{item.tools}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
