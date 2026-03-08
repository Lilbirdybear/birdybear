import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  isLoading: boolean;
}

const LoadingScreen = ({ isLoading }: LoadingScreenProps) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: "hsl(var(--background))" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="flex flex-col items-center gap-6">
            {/* Logo text */}
            <div className="overflow-hidden">
              <motion.h1
                className="font-display text-4xl md:text-5xl font-bold tracking-tight"
                style={{ color: "hsl(var(--foreground))" }}
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
              >
                <span style={{ color: "hsl(var(--foreground) / 0.9)" }}>The Eli</span>{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Design
                </span>
              </motion.h1>
            </div>

            {/* Underline */}
            <motion.div
              className="h-px w-0"
              style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)" }}
              animate={{ width: 120 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.23, 1, 0.32, 1] }}
            />

            {/* Loading dots */}
            <div className="flex gap-1.5 mt-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 h-1 rounded-full"
                  style={{ background: "hsl(var(--primary))" }}
                  initial={{ opacity: 0.2 }}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
