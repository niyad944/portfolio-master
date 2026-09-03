import { GlassCard, Reveal, Section, SectionHeading, AnimatedCounter } from "./primitives";
import { Award, BookOpen, Briefcase, Code2, GraduationCap, Sparkles } from "lucide-react";

interface AboutProps {
  bio?: string | null;
  stats: {
    projects: number;
    certificates: number;
    achievements: number;
    skills: number;
    education: number;
  };
}

const items = (s: AboutProps["stats"]) => [
  { icon: Sparkles, label: "Years Learning", value: Math.max(1, new Date().getFullYear() - 2020), suffix: "+" },
  { icon: Briefcase, label: "Projects", value: s.projects, suffix: "" },
  { icon: Award, label: "Certificates", value: s.certificates, suffix: "" },
  { icon: Code2, label: "Skills", value: s.skills, suffix: "" },
  { icon: GraduationCap, label: "Milestones", value: s.education, suffix: "" },
  { icon: BookOpen, label: "Achievements", value: s.achievements, suffix: "" },
];

export const AboutSection = ({ bio, stats }: AboutProps) => (
  <Section id="about">
    <SectionHeading eyebrow="About" title={<>A little about <span className="text-slate-500">me.</span></>} />
    <div className="grid md:grid-cols-[1.1fr_.9fr] gap-6">
      <Reveal>
        <GlassCard className="p-6 sm:p-8 h-full">
          <div className="prose prose-invert max-w-none">
            <p className="text-base sm:text-lg leading-relaxed text-slate-700">
              {bio ||
                "Curious builder who loves shipping thoughtful software. I care about details, performance, and design — the kind of interfaces that feel inevitable once you see them."}
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Problem-Solver", "Team Player", "Design-Minded", "Fast Learner"].map((t) => (
              <span key={t} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
                {t}
              </span>
            ))}
          </div>
        </GlassCard>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="grid grid-cols-2 gap-3 h-full">
          {items(stats).map(({ icon: Icon, label, value, suffix }) => (
            <GlassCard key={label} className="p-4 sm:p-5">
              <Icon className="h-4 w-4 text-[hsl(var(--pf-cyan))]" />
              <div className="mt-3 font-display text-3xl sm:text-4xl font-semibold text-slate-900">
                <AnimatedCounter value={value} suffix={suffix} />
              </div>
              <div className="mt-1 text-xs uppercase tracking-widest text-slate-400">{label}</div>
            </GlassCard>
          ))}
        </div>
      </Reveal>
    </div>
  </Section>
);
