import { motion } from "framer-motion";
import CompartmentCard from "./CompartmentCard";
import TextReveal from "./TextReveal";
import ixdPreview from "@/assets/ixd-preview.jpg";
import threeDPreview from "@/assets/3d-preview.jpg";
import gamePreview from "@/assets/game-preview.jpg";

const compartments = [
  {
    title: "Interaction Design",
    subtitle: "IXD — Interface Systems",
    description: "Crafting intuitive digital experiences through research-driven interfaces, micro-interactions, and user-centered design systems.",
    image: ixdPreview,
    variant: "ixd" as const,
  },
  {
    title: "3D Design",
    subtitle: "3D — Spatial Modeling",
    description: "Sculpting digital dimensions through high-fidelity 3D modeling, texturing, and rendering for product and environment visualization.",
    image: threeDPreview,
    variant: "3d" as const,
  },
  {
    title: "Game Design",
    subtitle: "GAME — Interactive Worlds",
    description: "Building immersive game experiences through level design, mechanics systems, and narrative-driven environments.",
    image: gamePreview,
    variant: "game" as const,
  },
];

const CompartmentsSection = () => {
  return (
    <section id="compartments" className="py-32 px-6 relative">
      {/* Decorative line */}
      <motion.div
        className="absolute top-0 left-1/2 w-px h-24 -translate-x-1/2"
        style={{ background: "linear-gradient(to bottom, hsl(var(--primary) / 0.3), transparent)", transformOrigin: "top" }}
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      />

      <div className="max-w-6xl mx-auto">
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <motion.span
            className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground block mb-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            // DISCIPLINES
          </motion.span>
          <TextReveal
            text="Main Disciplines"
            as="h2"
            className="text-3xl md:text-4xl font-bold text-foreground"
            staggerChildren={0.04}
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {compartments.map((c, i) => (
            <CompartmentCard key={c.variant} {...c} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompartmentsSection;
