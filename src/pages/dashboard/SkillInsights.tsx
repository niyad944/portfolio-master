import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Radar, Target, FileText } from "lucide-react";
import SkillRadar from "@/components/dashboard/SkillRadar";
import CareerSuggestions from "@/components/dashboard/CareerSuggestions";
import ProjectToResume from "@/components/dashboard/ProjectToResume";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface DashboardContext {
  user: SupabaseUser;
}

const SkillInsights = () => {
  const { user } = useOutletContext<DashboardContext>();
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<{ name: string; proficiency_level: string }[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [bio, setBio] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [skillsRes, projectsRes, profileRes] = await Promise.all([
        supabase.from("skills").select("name, proficiency_level").eq("user_id", user.id),
        supabase.from("projects").select("*").eq("user_id", user.id).order("is_featured", { ascending: false }),
        supabase.from("profiles").select("bio").eq("user_id", user.id).single(),
      ]);
      if (skillsRes.data) setSkills(skillsRes.data);
      if (projectsRes.data) setProjects(projectsRes.data);
      if (profileRes.data?.bio) setBio(profileRes.data.bio);
      setLoading(false);
    };
    fetchData();
  }, [user.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 lg:p-12 max-w-6xl mx-auto">
      <div className="mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Skill Insights</h1>
        <p className="text-muted-foreground">
          Visualize your skills, auto-generate resume content, and discover career paths
        </p>
      </div>

      {/* Skill Radar */}
      <section className="glass-card rounded-2xl p-4 sm:p-8 mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Radar className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">Skill Radar</h2>
            <p className="text-sm text-muted-foreground">Your top skills from profile and projects</p>
          </div>
        </div>
        <SkillRadar
          skills={skills}
          projectTechnologies={projects.map(p => p.technologies || [])}
        />
      </section>

      {/* Portfolio to Resume */}
      <section className="glass-card rounded-2xl p-4 sm:p-8 mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">Portfolio → Resume</h2>
            <p className="text-sm text-muted-foreground">Convert your projects into resume-ready bullet points</p>
          </div>
        </div>
        <ProjectToResume projects={projects} />
      </section>

      {/* Career Suggestions */}
      <section className="glass-card rounded-2xl p-4 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Target className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">Career Recommendations</h2>
            <p className="text-sm text-muted-foreground">AI-suggested career paths based on your portfolio</p>
          </div>
        </div>
        <CareerSuggestions skills={skills} projects={projects} bio={bio} />
      </section>
    </div>
  );
};

export default SkillInsights;
