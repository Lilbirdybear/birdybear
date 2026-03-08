import { useState, useEffect, Suspense, lazy } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Magnetic from "./Magnetic";

const LogoCube = lazy(() => import("./LogoCube"));

const navLinks = [
  { label: "Home", href: "/", isHash: false },
  { label: "Work", href: "/#compartments", isHash: true },
  { label: "Projects", href: "/#projects", isHash: true },
  { label: "Blog", href: "/blog", isHash: false },
  { label: "About", href: "/about", isHash: false },
  { label: "Contact", href: "/contact", isHash: false },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cubeReady, setCubeReady] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const location = useLocation();
  const isHome = location.pathname === "/";

  // Get active link index
  const activeIndex = navLinks.findIndex((link) => {
    if (link.isHash) {
      return isHome && location.hash === link.href.replace("/", "");
    }
    return location.pathname === link.href;
  });

  useEffect(() => {
    const timer = setTimeout(() => setCubeReady(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const renderLink = (link: typeof navLinks[0], index: number, onClick?: () => void) => {
    const isActive = location.pathname === link.href || (link.isHash && isHome);
    const cls = `relative font-mono text-[11px] tracking-[0.2em] uppercase transition-all duration-300 py-3 ${
      isActive
        ? "text-foreground"
        : "text-muted-foreground hover:text-foreground"
    }`;

    const content = (
      <span
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {link.label}
      </span>
    );

    if (link.isHash && isHome) {
      return (
        <Magnetic key={link.label} strength={0.3}>
          <a href={link.href.replace("/", "")} onClick={onClick} className={`${cls} cursor-magnetic`}>
            {content}
          </a>
        </Magnetic>
      );
    }

    return (
      <Magnetic key={link.label} strength={0.3}>
        <Link to={link.href} onClick={onClick} className={`${cls} cursor-magnetic`}>
          {content}
        </Link>
      </Magnetic>
    );
  };

  // Determine which index to highlight
  const indicatorIndex = hoveredIndex !== null ? hoveredIndex : (activeIndex >= 0 ? activeIndex : 0);

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass-panel border-b border-border"
            : "bg-transparent border-b border-transparent"
        }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Magnetic strength={0.2}>
            <Link to="/" className="flex items-center gap-2 cursor-magnetic group">
              <div className="w-16 h-16 relative">
                {cubeReady ? (
                  <Suspense fallback={
                    <span className="font-mono text-lg tracking-[0.15em] text-foreground font-medium flex items-center h-full">
                      ELI<span className="text-primary group-hover:animate-pulse">.</span>
                    </span>
                  }>
                    <motion.div
                      className="w-full h-full"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
                    >
                      <LogoCube className="w-full h-full" />
                    </motion.div>
                  </Suspense>
                ) : (
                  <span className="font-mono text-lg tracking-[0.15em] text-foreground font-medium flex items-center h-full">
                    ELI<span className="text-primary">.</span>
                  </span>
                )}
              </div>
            </Link>
          </Magnetic>

          {/* Desktop nav with sliding top indicator */}
          <div className="hidden md:flex items-center relative">
            {/* The sliding indicator line - positioned ABOVE */}
            <motion.div
              className="absolute h-[2px] bg-primary rounded-full"
              style={{ top: 0 }}
              initial={false}
              animate={{
                left: `${indicatorIndex * 80}px`,
                width: "60px",
                opacity: hoveredIndex !== null || activeIndex >= 0 ? 1 : 0,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 35,
              }}
            />
            
            <div className="flex items-center gap-0">
              {navLinks.map((link, index) => (
                <div key={link.label} className="w-20 flex justify-center">
                  {renderLink(link, index)}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-foreground relative w-6 h-6"
            aria-label="Toggle menu"
          >
            <motion.span
              className="absolute left-0 w-6 h-px bg-foreground"
              animate={{
                top: open ? "50%" : "30%",
                rotate: open ? 45 : 0,
              }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="absolute left-0 top-1/2 w-6 h-px bg-foreground"
              animate={{ opacity: open ? 0 : 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="absolute left-0 w-6 h-px bg-foreground"
              animate={{
                top: open ? "50%" : "70%",
                rotate: open ? -45 : 0,
              }}
              transition={{ duration: 0.3 }}
            />
          </button>
        </div>
      </motion.nav>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                >
                  {link.isHash && isHome ? (
                    <a
                      href={link.href.replace("/", "")}
                      onClick={() => setOpen(false)}
                      className="text-3xl font-bold text-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      onClick={() => setOpen(false)}
                      className="text-3xl font-bold text-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
