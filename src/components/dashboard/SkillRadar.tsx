import { useMemo } from "react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

interface SkillRadarProps {
  skills: { name: string; proficiency_level: string }[];
  projectTechnologies: string[][];
}

const PROFICIENCY_MAP: Record<string, number> = {
  beginner: 25,
  intermediate: 50,
  advanced: 75,
  expert: 100,
};

const SkillRadar = ({ skills, projectTechnologies }: SkillRadarProps) => {
  const chartData = useMemo(() => {
    // Aggregate all tech mentions from projects
    const techCounts: Record<string, number> = {};
    projectTechnologies.forEach((techs) => {
      techs?.forEach((t) => {
        const key = t.trim().toLowerCase();
        techCounts[key] = (techCounts[key] || 0) + 1;
      });
    });

    // Build skill map from user skills
    const skillMap: Record<string, number> = {};
    skills.forEach((s) => {
      skillMap[s.name.toLowerCase()] = PROFICIENCY_MAP[s.proficiency_level] || 50;
    });

    // Merge: prefer user-set proficiency, fallback to project frequency
    const allSkills = new Set([
      ...Object.keys(skillMap),
      ...Object.keys(techCounts),
    ]);

    const entries = Array.from(allSkills).map((key) => ({
      skill: key.length > 12 ? key.slice(0, 12) + "…" : key,
      fullName: key,
      value: skillMap[key] || Math.min(techCounts[key] * 20, 80),
      fromProjects: techCounts[key] || 0,
    }));

    // Take top 8 by value for readability
    return entries.sort((a, b) => b.value - a.value).slice(0, 8);
  }, [skills, projectTechnologies]);

  if (chartData.length < 3) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground text-sm">
          Add at least 3 skills or projects to see your skill radar.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={320}>
        <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis
            dataKey="skill"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
            tickCount={5}
          />
          <Radar
            name="Proficiency"
            dataKey="value"
            stroke="hsl(var(--accent))"
            fill="hsl(var(--accent))"
            fillOpacity={0.25}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* Skill legend */}
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        {chartData.map((d) => (
          <div
            key={d.fullName}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/50 text-xs"
          >
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-foreground capitalize">{d.fullName}</span>
            <span className="text-muted-foreground">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillRadar;
