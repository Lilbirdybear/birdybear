import { motion } from "framer-motion";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  staggerChildren?: number;
}

const TextReveal = ({ text, className = "", delay = 0, as: Tag = "span", staggerChildren = 0.03 }: TextRevealProps) => {
  const words = text.split(" ");

  return (
    <Tag className={className}>
      <motion.span
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={{
          visible: { transition: { staggerChildren, delayChildren: delay } },
          hidden: {},
        }}
        className="inline"
      >
        {words.map((word, wi) => (
          <span key={wi} className="inline-block mr-[0.25em]">
            {word.split("").map((char, ci) => (
              <motion.span
                key={ci}
                className="inline-block"
                variants={{
                  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] },
                  },
                }}
              >
                {char}
              </motion.span>
            ))}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
};

export default TextReveal;
