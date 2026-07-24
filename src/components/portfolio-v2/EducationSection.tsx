import { GraduationCap, Calendar } from "lucide-react";
import { Reveal, Section, SectionHeading } from "./primitives";

interface Edu {
  id: string;
  degree: string;
  institution: string;
  field_of_study?: string | null;
  grade?: string | null;
  start_date?: string | null;
  end_date?: string | null;
}

export const EducationSection = ({ education }: { education: Edu[] }) => {
  if (!education.length) return null;
  return (
    <Section id="education">
      <SectionHeading eyebrow="Journey" title={<>Education <span className="text-white/50">timeline.</span></>} />
      <div className="relative">
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent" />
        <div className="space-y-8">
          {education.map((e, i) => {
            const right = i % 2 === 0;
            return (
              <Reveal key={e.id} delay={i * 0.06}>
                <div className={`relative grid md:grid-cols-2 gap-6 ${right ? "" : "md:[&>*:first-child]:col-start-2"}`}>
                  <div className={`pl-12 md:pl-0 ${right ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                    <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 hover:border-white/25 transition-colors">
                      <div className={`absolute top-6 -left-[9px] md:left-auto ${right ? "md:-right-[9px]" : "md:-left-[9px]"} h-4 w-4 rounded-full bg-gradient-to-br from-[hsl(var(--pf-cyan))] to-[hsl(var(--pf-violet))] shadow-[0_0_20px_hsl(var(--pf-cyan)/0.6)] hidden md:block`} />
                      <div className={`absolute top-6 -left-[9px] h-4 w-4 rounded-full bg-gradient-to-br from-[hsl(var(--pf-cyan))] to-[hsl(var(--pf-violet))] shadow-[0_0_20px_hsl(var(--pf-cyan)/0.6)] md:hidden`} />
                      <div className={`flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-white/50 mb-3 ${right ? "md:justify-end" : ""}`}>
                        <Calendar className="h-3 w-3" />
                        {e.start_date} — {e.end_date || "Present"}
                      </div>
                      <h3 className="font-display text-xl font-semibold text-white">{e.degree}</h3>
                      <p className="mt-1 text-white/70">{e.institution}</p>
                      {e.field_of_study && <p className="mt-1 text-sm text-white/50">{e.field_of_study}</p>}
                      {e.grade && (
                        <div className={`mt-4 flex ${right ? "md:justify-end" : ""}`}>
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[hsl(var(--pf-cyan))]/20 to-[hsl(var(--pf-violet))]/20 border border-white/15 px-3.5 py-1.5 text-sm font-semibold text-white shadow-[0_0_20px_hsl(var(--pf-cyan)/0.15)]">
                            <GraduationCap className="h-3.5 w-3.5" /> {e.grade}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div />
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
};
