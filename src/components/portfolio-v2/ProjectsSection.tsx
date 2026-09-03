import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, Star, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GlassCard, Reveal, Section, SectionHeading, TiltCard } from "./primitives";

interface Project {
  id: string;
  title: string;
  description?: string | null;
  image_url?: string | null;
  project_url?: string | null;
  github_url?: string | null;
  technologies?: string[] | null;
  sdg_goals?: string[] | null;
  is_featured?: boolean | null;
}

export const ProjectsSection = ({ projects }: { projects: Project[] }) => {
  const [active, setActive] = useState<Project | null>(null);
  if (!projects.length) return null;

  return (
    <Section id="projects">
      <SectionHeading
        eyebrow="Selected work"
        title={<>Projects <span className="text-slate-500">I've shipped.</span></>}
        description="A curated selection of things I've built — click any card to see the details."
      />

      <div className="space-y-6 md:space-y-8">
        {projects.map((p, i) => {
          const even = i % 2 === 0;
          return (
            <Reveal key={p.id} delay={i * 0.05}>
              <TiltCard max={4}>
                <button
                  onClick={() => setActive(p)}
                  className="block w-full text-left group"
                >
                  <GlassCard className="overflow-hidden">
                    <div className={`grid md:grid-cols-2 ${even ? "" : "md:[direction:rtl]"}`}>
                      <div className="relative aspect-[16/10] md:aspect-auto min-h-[240px] overflow-hidden md:[direction:ltr]">
                        {p.image_url ? (
                          <img
                            src={p.image_url}
                            alt={p.title}
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--pf-blue))]/20 via-[hsl(var(--pf-violet))]/20 to-slate-300 grid place-items-center">
                            <span className="font-display text-6xl text-slate-400">{p.title.slice(0, 1)}</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/45 via-slate-900/5 to-transparent" />
                        {p.is_featured && (
                          <span className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-white/85 backdrop-blur px-3 py-1 text-xs text-slate-900 border border-slate-200">
                            <Star className="h-3 w-3 fill-[hsl(var(--pf-cyan))] text-[hsl(var(--pf-cyan))]" /> Featured
                          </span>
                        )}
                      </div>
                      <div className="p-6 sm:p-8 md:[direction:ltr] flex flex-col justify-center">
                        <h3 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
                          {p.title}
                        </h3>
                        {p.description && (
                          <p className="mt-3 text-sm sm:text-base text-slate-500 leading-relaxed line-clamp-4">{p.description}</p>
                        )}
                        {p.technologies && p.technologies.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {p.technologies.slice(0, 6).map((t) => (
                              <span key={t} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-mono text-slate-600">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="mt-6 inline-flex items-center gap-2 text-sm text-[hsl(var(--pf-cyan))]">
                          View case <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </button>
              </TiltCard>
            </Reveal>
          );
        })}
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-3xl bg-[hsl(var(--pf-surface))]/95 backdrop-blur-2xl border-slate-200 text-slate-900 p-0 overflow-hidden">
          <AnimatePresence>
            {active && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-h-[85vh] overflow-y-auto"
              >
                {active.image_url && (
                  <img src={active.image_url} alt={active.title} className="w-full aspect-[16/9] object-cover" />
                )}
                <div className="p-6 sm:p-8">
                  <DialogHeader>
                    <DialogTitle className="font-display text-2xl sm:text-3xl text-slate-900">{active.title}</DialogTitle>
                  </DialogHeader>
                  {active.description && (
                    <p className="mt-4 text-slate-600 leading-relaxed">{active.description}</p>
                  )}
                  {active.technologies && active.technologies.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {active.technologies.map((t) => (
                        <span key={t} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-6 flex gap-3">
                    {active.project_url && (
                      <a href={active.project_url} target="_blank" rel="noopener noreferrer"
                         className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-4 py-2 text-sm">
                        <ExternalLink className="h-4 w-4" /> Live Demo
                      </a>
                    )}
                    {active.github_url && (
                      <a href={active.github_url} target="_blank" rel="noopener noreferrer"
                         className="inline-flex items-center gap-2 rounded-full border border-slate-200 text-slate-900 px-4 py-2 text-sm hover:bg-slate-50">
                        <Github className="h-4 w-4" /> Source
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </Section>
  );
};
