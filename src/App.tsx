import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { AnimatePresence, motion } from "framer-motion";
import ParticleField from "@/components/ParticleField";
import CursorGlow from "@/components/CursorGlow";
import ScrollProgress from "@/components/ScrollProgress";
import LoadingScreen from "@/components/LoadingScreen";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import ProjectDetail from "./pages/ProjectDetail";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const pageVariants = {
  initial: { opacity: 0, y: 12, filter: "blur(6px)" },
  animate: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] },
  },
  exit: {
    opacity: 0, y: -8, filter: "blur(4px)",
    transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] },
  },
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          <Route path="/project/:slug" element={<ProjectDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showEffects, setShowEffects] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Stagger heavy effects: mount them 300ms after loading screen starts fading
  useEffect(() => {
    if (!isLoading) {
      const effectsTimer = setTimeout(() => setShowEffects(true), 400);
      return () => clearTimeout(effectsTimer);
    }
  }, [isLoading]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <LoadingScreen isLoading={isLoading} />
          <Toaster />
          <Sonner />

          {/* Pre-render site content behind loading screen — crossfade */}
          <div
            style={{
              opacity: isLoading ? 0 : 1,
              transition: "opacity 1.2s cubic-bezier(0.23, 1, 0.32, 1)",
              willChange: isLoading ? "opacity" : "auto",
            }}
          >
            {showEffects && (
              <>
                <ParticleField />
                <CursorGlow />
                <ScrollProgress />
              </>
            )}
            <BrowserRouter>
              <AnimatedRoutes />
            </BrowserRouter>
          </div>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
