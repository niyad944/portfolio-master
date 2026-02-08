import React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface ScrollReveal3DProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right";
  depth?: number;
}

const ScrollReveal3D = ({
  children,
  className = "",
  delay = 0,
  direction = "up",
  depth = 60,
}: ScrollReveal3DProps) => {
  const shouldReduceMotion = useReducedMotion();

  const getInitial = () => {
    if (shouldReduceMotion) return { opacity: 0 };
    switch (direction) {
      case "left":
        return { opacity: 0, x: -40, z: -depth, rotateY: 4, filter: "blur(6px)" };
      case "right":
        return { opacity: 0, x: 40, z: -depth, rotateY: -4, filter: "blur(6px)" };
      default:
        return { opacity: 0, y: 40, z: -depth, rotateX: -3, filter: "blur(6px)" };
    }
  };

  const getAnimate = () => {
    if (shouldReduceMotion) return { opacity: 1 };
    return { opacity: 1, x: 0, y: 0, z: 0, rotateX: 0, rotateY: 0, filter: "blur(0px)" };
  };

  return (
    <motion.div
      className={className}
      style={{ perspective: 1200, transformStyle: "preserve-3d" }}
      initial={getInitial()}
      whileInView={getAnimate()}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: shouldReduceMotion ? 0.3 : 0.9,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal3D;
