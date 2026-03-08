import { motion } from "framer-motion";

const toolCards = [
  { cls: "compartment-ixd glow-ixd", label: "TOOLS — IXD", labelColor: "text-ixd", tools: "Figma, Framer, Principle, Adobe XD, ProtoPie" },
  { cls: "compartment-3d glow-3d", label: "TOOLS — 3D", labelColor: "text-three-d", tools: "Blender, ZBrush, Substance Painter, Cinema 4D, 3D Printing" },
  { cls: "compartment-game glow-game", label: "TOOLS — GAME", labelColor: "text-game", tools: "Unreal Engine, Unity, Godot, Game Maker" },
  { cls: "glass-panel", label: "HARDWARE & TINKERING", labelColor: "text-muted-foreground", tools: "ESP32, Raspberry Pi, 3D Printers, Custom PCB Design" },
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
            Eli Birdsall
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            With 8+ years in design, I work across the full spectrum — from interaction design and 3D visualization
            to game development and hardware tinkering. I run a small print-to-order specialty service that has
            sharpened my craft as a 3D artist, and I'm constantly building projects that span communication tools,
            ESP32/Raspberry Pi devices, and immersive game worlds.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Currently working on two titles under NDA: a classic cyberpunk multi-world game delivering a
            cinematic experience that will blow players' minds, and a mini game designed to elevate the
            social experience online.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            I'm a tinkerer and inventor at heart — every discipline informs the others. Game mechanics sharpen my
            UX thinking, 3D skills add depth to interfaces, and interaction design brings polish to everything I touch.
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
