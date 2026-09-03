import { motion } from "framer-motion";
import { ArrowDown, Github, Linkedin, Globe, MapPin, Sparkles, Download, Mail } from "lucide-react";
import { GradientText, MagneticButton, TypingText, useReducedMotionSafe } from "./primitives";

interface HeroProps {
  fullName: string;
  headline?: string | null;
  bio?: string | null;
  location?: string | null;
  photoUrl?: string | null;
  linkedin?: string | null;
  github?: string | null;
  portfolio?: string | null;
  onDownload: () => void;
}

export const HeroSection = ({
  fullName,
  headline,
  bio,
  location,
  photoUrl,
  linkedin,
  github,
  portfolio,
  onDownload,
}: HeroProps) => {
  const roles = (headline || "Software Engineer • Builder • Learner")
    .split(/[•|,\/]/)
    .map((s) => s.trim())
    .filter(Boolean);
  const reduce = useReducedMotionSafe();

  return (
    <section id="hero" aria-labelledby="hero-heading" className="relative min-h-[100svh] flex items-center pt-28 pb-16">
      <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 grid md:grid-cols-[1.1fr_.9fr] gap-10 md:gap-16 items-center">
        <div className="order-2 md:order-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Available for opportunities
          </motion.div>

          <motion.h1
            id="hero-heading"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-5xl sm:text-6xl md:text-7xl font-semibold leading-[1.02] tracking-tight text-slate-900"
          >
            Hey, I'm <GradientText>{fullName.split(" ")[0]}</GradientText>.
            <br />
            <span className="text-slate-600">I craft digital things that matter.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mt-6 text-lg sm:text-xl text-slate-700 font-medium"
          >
            <TypingText words={roles} />
          </motion.div>

          {bio && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7 }}
              className="mt-6 max-w-xl text-base text-slate-500 leading-relaxed"
            >
              {bio}
            </motion.p>
          )}

          {location && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="mt-4 inline-flex items-center gap-2 text-sm text-slate-500"
            >
              <MapPin className="h-4 w-4" /> {location}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <MagneticButton
              onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-slate-900 text-white hover:bg-slate-800 shadow-[0_10px_40px_hsl(var(--pf-cyan)/0.35)] px-6 py-3.5"
            >
              <Sparkles className="h-4 w-4" />
              View Work
            </MagneticButton>
            <MagneticButton
              onClick={onDownload}
              className="border border-slate-200 text-slate-900 hover:border-slate-300 hover:bg-slate-50 px-6 py-3.5"
            >
              <Download className="h-4 w-4" />
              Download CV
            </MagneticButton>
            <MagneticButton
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="text-slate-600 hover:text-slate-900 px-4 py-3.5"
            >
              <Mail className="h-4 w-4" />
              Get in touch
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
            className="mt-8 flex items-center gap-2"
          >
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                className="h-10 w-10 grid place-items-center rounded-full border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 transition">
                <Linkedin className="h-4 w-4" />
              </a>
            )}
            {github && (
              <a href={github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"
                className="h-10 w-10 grid place-items-center rounded-full border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 transition">
                <Github className="h-4 w-4" />
              </a>
            )}
            {portfolio && (
              <a href={portfolio} target="_blank" rel="noopener noreferrer" aria-label="Personal site"
                className="h-10 w-10 grid place-items-center rounded-full border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 transition">
                <Globe className="h-4 w-4" />
              </a>
            )}
          </motion.div>
        </div>

        {/* Portrait */}
        <div className="order-1 md:order-2 flex justify-center md:justify-end">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Rotating rings */}
            {!reduce && (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-6 rounded-full border border-slate-200 [mask-image:linear-gradient(to_bottom,white,transparent)]"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-12 rounded-full border border-dashed border-slate-200 [mask-image:linear-gradient(to_top,white,transparent)]"
                />
              </>
            )}
            <div className="relative h-64 w-64 sm:h-80 sm:w-80 rounded-full p-[2px] bg-gradient-to-br from-[hsl(var(--pf-cyan))] via-[hsl(var(--pf-blue))] to-[hsl(var(--pf-violet))] shadow-[0_20px_80px_hsl(var(--pf-violet)/0.35)]">
              <div className="h-full w-full rounded-full overflow-hidden bg-white">
                {photoUrl ? (
                  <img src={photoUrl} alt={fullName} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full grid place-items-center text-6xl font-display text-slate-400">
                    {fullName.slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            {/* Floating chips */}
            {!reduce && (
              <>
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -left-6 top-8 rounded-2xl border border-slate-200 bg-white/85 backdrop-blur-xl px-3 py-2 text-xs text-slate-700"
                >
                  <span className="text-[hsl(var(--pf-cyan))]">✦</span> Building
                </motion.div>
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -right-4 bottom-10 rounded-2xl border border-slate-200 bg-white/85 backdrop-blur-xl px-3 py-2 text-xs text-slate-700"
                >
                  <span className="text-[hsl(var(--pf-violet))]">◆</span> Shipping
                </motion.div>
              </>
            )}
          </motion.div>
        </div>
      </div>

      <motion.button
        onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1 }, y: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-slate-400 hover:text-slate-900 transition-colors"
        aria-label="Scroll down"
      >
        <ArrowDown className="h-5 w-5" />
      </motion.button>
    </section>
  );
};
