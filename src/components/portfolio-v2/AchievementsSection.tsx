import { Award, Trophy } from "lucide-react";
import { GlassCard, Reveal, Section, SectionHeading, TiltCard } from "./primitives";

interface Achievement {
  id: string;
  title: string;
  issuer?: string | null;
  description?: string | null;
  date?: string | null;
}

export const AchievementsSection = ({ achievements }: { achievements: Achievement[] }) => {
  if (!achievements.length) return null;
  return (
    <Section id="achievements">
      <SectionHeading eyebrow="Recognition" title={<>Achievements <span className="text-white/50">& milestones.</span></>} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((a, i) => (
          <Reveal key={a.id} delay={i * 0.06}>
            <TiltCard max={4}>
              <GlassCard className="p-6 h-full group relative overflow-hidden">
                <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[hsl(var(--pf-cyan))]/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="h-11 w-11 rounded-2xl grid place-items-center bg-gradient-to-br from-[hsl(var(--pf-cyan))]/20 to-[hsl(var(--pf-violet))]/20 border border-white/10 mb-4">
                    <Trophy className="h-5 w-5 text-[hsl(var(--pf-cyan))]" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-white">{a.title}</h3>
                  {a.issuer && <p className="mt-1 text-sm text-white/60">{a.issuer}</p>}
                  {a.date && (
                    <p className="mt-1 text-xs font-mono text-white/40">
                      {new Date(a.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </p>
                  )}
                  {a.description && (
                    <p className="mt-3 text-sm text-white/70 leading-relaxed line-clamp-4">{a.description}</p>
                  )}
                </div>
              </GlassCard>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
};
