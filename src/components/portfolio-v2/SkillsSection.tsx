import { useMemo } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { GlassCard, Reveal, Section, SectionHeading, CircularProgress } from "./primitives";

interface Skill { id: string; name: string; proficiency_level?: string | null; category?: string | null }

const levelToPct = (lvl?: string | null) => {
  const m: Record<string, number> = {
    beginner: 40,
    intermediate: 65,
    advanced: 85,
    expert: 95,
  };
  return m[(lvl || "").toLowerCase()] ?? 70;
};

export const SkillsSection = ({ skills }: { skills: Skill[] }) => {
  const grouped = useMemo(() => {
    const map = new Map<string, Skill[]>();
    skills.forEach((s) => {
      const key = (s.category || "General").trim();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    });
    return Array.from(map.entries());
  }, [skills]);

  const radarData = useMemo(
    () =>
      grouped
        .slice(0, 8)
        .map(([cat, list]) => ({
          category: cat,
          value: Math.round(list.reduce((a, s) => a + levelToPct(s.proficiency_level), 0) / Math.max(list.length, 1)),
        })),
    [grouped],
  );

  const topSkills = useMemo(
    () =>
      [...skills]
        .sort((a, b) => levelToPct(b.proficiency_level) - levelToPct(a.proficiency_level))
        .slice(0, 6),
    [skills],
  );

  return (
    <Section id="skills">
      <SectionHeading eyebrow="Toolbox" title={<>Skills & <span className="text-white/50">strengths.</span></>} description="A snapshot of tools I reach for and where my depth sits today." />

      <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-6">
        <Reveal>
          <GlassCard className="p-6 sm:p-8">
            <h3 className="text-sm font-mono uppercase tracking-widest text-white/50 mb-6">Top proficiencies</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {topSkills.map((s) => (
                <CircularProgress key={s.id} label={s.name} sub={s.proficiency_level || undefined} value={levelToPct(s.proficiency_level)} />
              ))}
            </div>
            <div className="mt-8">
              <h3 className="text-sm font-mono uppercase tracking-widest text-white/50 mb-3">Full stack</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <span
                    key={s.id}
                    className="group relative rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs text-white/75 hover:text-white hover:border-white/25 transition-all"
                  >
                    {s.name}
                    {s.proficiency_level && (
                      <span className="ml-1.5 text-[10px] font-mono text-white/40">{s.proficiency_level}</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </GlassCard>
        </Reveal>

        <Reveal delay={0.1}>
          <GlassCard className="p-6 sm:p-8 h-full flex flex-col">
            <h3 className="text-sm font-mono uppercase tracking-widest text-white/50 mb-3">Category radar</h3>
            <div className="flex-1 min-h-[280px]">
              {radarData.length >= 3 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} outerRadius="75%">
                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                    <PolarAngleAxis dataKey="category" tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 11 }} />
                    <PolarRadiusAxis stroke="rgba(255,255,255,0.15)" tick={false} axisLine={false} />
                    <Radar dataKey="value" stroke="hsl(var(--pf-cyan))" fill="hsl(var(--pf-blue))" fillOpacity={0.35} />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full grid place-items-center text-sm text-white/50 text-center p-8">
                  Add categorized skills to see a radar visualization here.
                </div>
              )}
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </Section>
  );
};
