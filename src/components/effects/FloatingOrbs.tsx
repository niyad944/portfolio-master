import { motion, useReducedMotion } from "framer-motion";

interface Orb {
  size: number;
  x: string;
  y: string;
  color: string;
  duration: number;
  delay: number;
}

interface FloatingOrbsProps {
  variant?: "hero" | "subtle" | "dense";
  className?: string;
}

const orbSets: Record<string, Orb[]> = {
  hero: [
    { size: 80, x: "15%", y: "20%", color: "hsl(195 80% 65% / 0.06)", duration: 18, delay: 0 },
    { size: 60, x: "75%", y: "30%", color: "hsl(270 60% 70% / 0.04)", duration: 22, delay: 2 },
    { size: 40, x: "50%", y: "70%", color: "hsl(195 80% 65% / 0.05)", duration: 16, delay: 4 },
    { size: 50, x: "85%", y: "75%", color: "hsl(270 60% 70% / 0.03)", duration: 20, delay: 1 },
    { size: 30, x: "25%", y: "80%", color: "hsl(195 80% 65% / 0.04)", duration: 14, delay: 3 },
  ],
  subtle: [
    { size: 60, x: "20%", y: "30%", color: "hsl(195 80% 65% / 0.04)", duration: 20, delay: 0 },
    { size: 45, x: "70%", y: "60%", color: "hsl(270 60% 70% / 0.03)", duration: 24, delay: 3 },
    { size: 35, x: "50%", y: "40%", color: "hsl(195 80% 65% / 0.03)", duration: 18, delay: 1 },
  ],
  dense: [
    { size: 70, x: "10%", y: "15%", color: "hsl(195 80% 65% / 0.05)", duration: 16, delay: 0 },
    { size: 55, x: "80%", y: "25%", color: "hsl(270 60% 70% / 0.04)", duration: 20, delay: 1 },
    { size: 40, x: "40%", y: "55%", color: "hsl(195 80% 65% / 0.04)", duration: 22, delay: 2 },
    { size: 65, x: "60%", y: "80%", color: "hsl(270 60% 70% / 0.03)", duration: 18, delay: 3 },
    { size: 30, x: "90%", y: "50%", color: "hsl(195 80% 65% / 0.03)", duration: 14, delay: 4 },
    { size: 50, x: "30%", y: "90%", color: "hsl(270 60% 70% / 0.04)", duration: 26, delay: 2 },
  ],
};

const FloatingOrbs = ({ variant = "subtle", className = "" }: FloatingOrbsProps) => {
  const shouldReduceMotion = useReducedMotion();
  const orbs = orbSets[variant];

  if (shouldReduceMotion) return null;

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden>
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
            filter: `blur(${orb.size * 0.4}px)`,
          }}
          animate={{
            y: [0, -20, 10, -15, 0],
            x: [0, 10, -8, 12, 0],
            scale: [1, 1.1, 0.95, 1.05, 1],
            opacity: [0.6, 0.9, 0.5, 0.8, 0.6],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default FloatingOrbs;
