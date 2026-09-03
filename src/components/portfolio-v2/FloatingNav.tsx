import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Mail, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MagneticButton } from "./primitives";

interface NavItem { id: string; label: string }

export const FloatingNav = ({
  items,
  onDownload,
  brand,
}: {
  items: NavItem[];
  onDownload: () => void;
  brand: string;
}) => {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [items]);

  const scrollTo = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "pf-nav pf-no-print fixed top-4 left-1/2 -translate-x-1/2 z-40 w-[min(1100px,calc(100vw-2rem))]",
        )}
      >
        <nav
          className={cn(
            "flex items-center justify-between gap-4 rounded-full border border-slate-200 px-4 py-2.5 sm:px-6 backdrop-blur-2xl transition-all duration-500",
            scrolled ? "bg-white/90 shadow-[0_10px_40px_rgba(15,23,42,0.08)]" : "bg-white/60",
          )}
        >
          <button
            onClick={() => scrollTo("hero")}
            className="flex items-center gap-2 shrink-0"
            aria-label="Scroll to top"
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[hsl(var(--pf-cyan))] to-[hsl(var(--pf-violet))] shadow-[0_0_20px_hsl(var(--pf-blue)/0.5)]" />
            <span className="hidden sm:block font-display font-semibold tracking-tight text-slate-900">
              {brand}
            </span>
          </button>

          <ul className="hidden md:flex items-center gap-1">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollTo(item.id)}
                  className={cn(
                    "relative px-3.5 py-2 text-sm rounded-full transition-colors",
                    active === item.id ? "text-slate-900" : "text-slate-500 hover:text-slate-900",
                  )}
                >
                  {active === item.id && (
                    <motion.span
                      layoutId="pf-nav-pill"
                      transition={{ type: "spring", stiffness: 280, damping: 25 }}
                      className="absolute inset-0 rounded-full bg-slate-100"
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <MagneticButton
              onClick={() => scrollTo("contact")}
              className="hidden sm:inline-flex text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 px-4 py-2 text-sm"
              ariaLabel="Jump to contact"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>Contact</span>
            </MagneticButton>
            <MagneticButton
              onClick={onDownload}
              className="text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 text-sm font-medium shadow-[0_0_30px_hsl(var(--pf-cyan)/0.35)]"
              ariaLabel="Download portfolio as PDF"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Resume</span>
            </MagneticButton>
            <button
              onClick={() => setOpen((o) => !o)}
              className="md:hidden h-9 w-9 grid place-items-center rounded-full border border-slate-200 text-slate-900"
              aria-label="Toggle navigation"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden mt-2 rounded-3xl border border-slate-200 bg-white/85 backdrop-blur-2xl p-2"
            >
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm text-left transition-colors",
                    active === item.id ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50",
                  )}
                >
                  {item.label}
                  <span className="text-xs font-mono text-slate-400">↗</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
};
