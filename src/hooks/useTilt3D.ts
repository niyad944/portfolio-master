import { useRef, useCallback, useEffect, useState } from "react";

interface Tilt3DOptions {
  maxTilt?: number;
  scale?: number;
  speed?: number;
  glareEnabled?: boolean;
}

export const useTilt3D = <T extends HTMLElement = HTMLDivElement>({
  maxTilt = 8,
  scale = 1.02,
  speed = 400,
  glareEnabled = false,
}: Tilt3DOptions = {}) => {
  const ref = useRef<T>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current || prefersReducedMotion) return;
      const el = ref.current;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const percentX = (e.clientX - centerX) / (rect.width / 2);
      const percentY = (e.clientY - centerY) / (rect.height / 2);

      const tiltX = -percentY * maxTilt;
      const tiltY = percentX * maxTilt;

      el.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(${scale}, ${scale}, ${scale})`;
    },
    [maxTilt, scale, prefersReducedMotion]
  );

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion) return;

    el.style.transition = `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`;
    el.style.willChange = "transform";
    el.style.transformStyle = "preserve-3d";

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave, speed, prefersReducedMotion]);

  return ref;
};
