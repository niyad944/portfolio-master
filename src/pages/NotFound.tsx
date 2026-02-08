import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import FloatingOrbs from "@/components/effects/FloatingOrbs";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background noise-overlay relative overflow-hidden">
      <FloatingOrbs variant="dense" />
      
      {/* Ethereal ambient effects */}
      <div className="absolute top-[25%] left-[20%] w-[400px] h-[400px] bg-accent/8 rounded-full blur-[150px] pointer-events-none animate-bloom" />
      <div className="absolute bottom-[25%] right-[20%] w-[300px] h-[300px] bg-plasma/6 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="text-center relative z-10 px-4 perspective-1200"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)", rotateX: -15 }}
          animate={{ scale: 1, opacity: 1, filter: "blur(0px)", rotateX: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 preserve-3d"
        >
          <span className="text-8xl sm:text-9xl font-display font-semibold lumina-text float-3d inline-block">404</span>
        </motion.div>
        
        <h1 className="text-2xl sm:text-4xl font-display font-semibold text-foreground mb-5 tracking-tight">
          Page Not Found
        </h1>
        <p className="text-muted-foreground mb-10 max-w-md mx-auto text-base sm:text-lg">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/">
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground btn-glow btn-3d-lift shadow-glow min-h-[52px] px-8 text-base rounded-xl transition-all duration-500 hover:shadow-bloom">
              <Home className="w-5 h-5 mr-2" />
              Return Home
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="border-white/10 hover:bg-white/[0.05] min-h-[52px] px-8 text-base rounded-xl btn-3d-lift transition-all duration-400"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
