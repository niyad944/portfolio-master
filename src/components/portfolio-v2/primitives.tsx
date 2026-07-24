import { useEffect, useRef, useState, useMemo, ReactNode, MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion, useScroll } from "framer-motion";
import { cn } from "@/lib/utils";

/* ---------- Reduced motion helper ---------- */
export const useReducedMotionSafe = () => {
  const rm = useReducedMotion();
  return !!rm;
};

/* ---------- GradientText ---------- */
export const GradientText = ({ children, className }: { children: ReactNode; className?: string }) => (
  <span
    className={cn("bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--pf-cyan))] via-[hsl(var(--pf-blue))] to-[hsl(var(--pf-violet))] animate-[pf-gradient-shift_8s_ease_infinite] bg-[length:200%_200%]", className)}
  >
    {children}
  </span>
);

/* ---------- GlassCard ---------- */
export const GlassCard = ({
  children,
  className,
  hover = true,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  as?: any;
}) => (
  <Tag
    className={cn(
      "relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl",
      "shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]",
      hover && "transition-all duration-500 hover:border-white/20 hover:bg-white/[0.05] hover:shadow-[0_20px_60px_rgba(59,130,246,0.15),inset_0_1px_0_rgba(255,255,255,0.08)]",
      className,
    )}
  >
    {children}
  </Tag>
);

/* ---------- MagneticButton ---------- */
export const MagneticButton = ({
  children,
  className,
  strength = 0.25,
  onClick,
  href,
  target,
  rel,
  type = "button",
  disabled,
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  ariaLabel?: string;
}) => {
  const ref = useRef<HTMLElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });
  const reduce = useReducedMotionSafe();

  const handleMove = (e: MouseEvent) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(((e.clientX - rect.left - rect.width / 2) * strength));
    y.set(((e.clientY - rect.top - rect.height / 2) * strength));
  };
  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const inner = (
    <motion.span
      style={{ x: sx, y: sy }}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-medium tracking-tight",
        "overflow-hidden isolation-auto",
        className,
      )}
    >
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <a
        ref={ref as any}
        href={href}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        onClick={onClick}
        className="inline-block"
      >
        {inner}
      </a>
    );
  }
  return (
    <button
      ref={ref as any}
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      className="inline-block disabled:opacity-60 disabled:pointer-events-none"
    >
      {inner}
    </button>
  );
};

/* ---------- TiltCard ---------- */
export const TiltCard = ({ children, className, max = 8 }: { children: ReactNode; className?: string; max?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 15 });
  const sry = useSpring(ry, { stiffness: 150, damping: 15 });
  const reduce = useReducedMotionSafe();

  const move = (e: MouseEvent) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * max);
    rx.set(-py * max);
  };
  const leave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={move}
      onMouseLeave={leave}
      style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
      className={cn("[perspective:1200px]", className)}
    >
      {children}
    </motion.div>
  );
};

/* ---------- SectionHeading ---------- */
export const SectionHeading = ({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
}) => (
  <div className={cn("mb-10 sm:mb-14", align === "center" && "text-center")}>
    {eyebrow && (
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-xs font-mono tracking-[0.3em] text-[hsl(var(--pf-cyan))] uppercase mb-3"
      >
        {eyebrow}
      </motion.p>
    )}
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white"
    >
      {title}
    </motion.h2>
    {description && (
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className={cn("mt-4 text-base text-white/60 max-w-2xl", align === "center" && "mx-auto")}
      >
        {description}
      </motion.p>
    )}
  </div>
);

/* ---------- AnimatedCounter ---------- */
export const AnimatedCounter = ({ value, duration = 1600, suffix = "" }: { value: number; duration?: number; suffix?: string }) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setDisplay(Math.round(value * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
};

/* ---------- Aurora background ---------- */
export const AuroraBackground = () => {
  const reduce = useReducedMotionSafe();
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[hsl(var(--pf-bg))]">
      {/* Base radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--pf-surface))_0%,hsl(var(--pf-bg))_60%)]" />
      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
      {/* Blobs */}
      <motion.div
        animate={reduce ? undefined : { x: [0, 60, -40, 0], y: [0, -30, 40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 -left-32 h-[520px] w-[520px] rounded-full bg-[hsl(var(--pf-blue))]/25 blur-[140px]"
      />
      <motion.div
        animate={reduce ? undefined : { x: [0, -60, 30, 0], y: [0, 40, -20, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full bg-[hsl(var(--pf-violet))]/25 blur-[160px]"
      />
      <motion.div
        animate={reduce ? undefined : { x: [0, 40, -50, 0], y: [0, -50, 30, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-1/4 h-[500px] w-[500px] rounded-full bg-[hsl(var(--pf-cyan))]/20 blur-[150px]"
      />
      {/* Noise */}
      <div className="absolute inset-0 opacity-[0.035] mix-blend-overlay [background-image:url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")]" />
    </div>
  );
};

/* ---------- ScrollProgress ---------- */
export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return (
    <motion.div
      style={{ width }}
      className="fixed left-0 top-0 z-50 h-[2px] bg-gradient-to-r from-[hsl(var(--pf-cyan))] via-[hsl(var(--pf-blue))] to-[hsl(var(--pf-violet))]"
    />
  );
};

/* ---------- Reveal wrapper ---------- */
export const Reveal = ({ children, delay = 0, y = 24, className }: { children: ReactNode; delay?: number; y?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ---------- Typing text ---------- */
export const TypingText = ({ words, className }: { words: string[]; className?: string }) => {
  const [idx, setIdx] = useState(0);
  const [sub, setSub] = useState(0);
  const [del, setDel] = useState(false);
  const reduce = useReducedMotionSafe();

  useEffect(() => {
    if (reduce) return;
    const cur = words[idx % words.length];
    if (!del && sub === cur.length) {
      const t = setTimeout(() => setDel(true), 1600);
      return () => clearTimeout(t);
    }
    if (del && sub === 0) {
      setDel(false);
      setIdx((i) => i + 1);
      return;
    }
    const t = setTimeout(() => setSub((s) => s + (del ? -1 : 1)), del ? 40 : 80);
    return () => clearTimeout(t);
  }, [sub, del, idx, words, reduce]);

  const text = reduce ? words[0] : words[idx % words.length].slice(0, sub);
  return (
    <span className={className}>
      {text}
      <span className="ml-1 inline-block w-[2px] h-[1em] bg-[hsl(var(--pf-cyan))] align-middle animate-pulse" />
    </span>
  );
};

/* ---------- CircularProgress ---------- */
export const CircularProgress = ({ value, label, sub }: { value: number; label: string; sub?: string }) => {
  const size = 96;
  const stroke = 6;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <defs>
            <linearGradient id={`g-${label}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="hsl(var(--pf-cyan))" />
              <stop offset="100%" stopColor="hsl(var(--pf-violet))" />
            </linearGradient>
          </defs>
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#g-${label})`}
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="none"
            initial={{ strokeDasharray: circ, strokeDashoffset: circ }}
            whileInView={{ strokeDashoffset: circ - (circ * pct) / 100 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white">
          {pct}%
        </div>
      </div>
      <div className="text-center">
        <div className="text-sm font-medium text-white">{label}</div>
        {sub && <div className="text-[10px] font-mono uppercase tracking-widest text-white/40">{sub}</div>}
      </div>
    </div>
  );
};

/* ---------- Section wrapper ---------- */
export const Section = ({ id, children, className }: { id: string; children: ReactNode; className?: string }) => (
  <section id={id} aria-labelledby={`${id}-heading`} className={cn("relative py-20 sm:py-28 scroll-mt-24", className)}>
    <div className="mx-auto max-w-6xl px-4 sm:px-6">{children}</div>
  </section>
);
