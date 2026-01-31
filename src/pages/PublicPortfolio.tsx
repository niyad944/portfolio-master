import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  MapPin,
  Linkedin,
  Github,
  Globe,
  GraduationCap,
  Briefcase,
  Award,
  Loader2,
  ArrowLeft,
  Star
} from "lucide-react";

interface VisibleSections {
  about: boolean;
  skills: boolean;
  education: boolean;
  achievements: boolean;
  projects: boolean;
  certificates: boolean;
}

const PublicPortfolio = () => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [visibleSections, setVisibleSections] = useState<VisibleSections>({
    about: true,
    skills: true,
    education: true,
    achievements: true,
    projects: true,
    certificates: false
  });

  useEffect(() => {
    fetchPortfolio();
  }, [slug]);

  const fetchPortfolio = async () => {
    setLoading(true);

    // Fetch profile by public slug
    const { data: profileData, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("public_slug", slug)
      .eq("is_public", true)
      .single();

    if (error || !profileData) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setProfile(profileData);
    if (profileData.visible_sections && typeof profileData.visible_sections === "object") {
      const sections = profileData.visible_sections as Record<string, unknown>;
      setVisibleSections({
        about: Boolean(sections.about ?? true),
        skills: Boolean(sections.skills ?? true),
        education: Boolean(sections.education ?? true),
        achievements: Boolean(sections.achievements ?? true),
        projects: Boolean(sections.projects ?? true),
        certificates: Boolean(sections.certificates ?? false)
      });
    }

    // Fetch related data
    const userId = profileData.user_id;
    const [skillsRes, eduRes, achRes, projRes] = await Promise.all([
      supabase.from("skills").select("*").eq("user_id", userId),
      supabase.from("education").select("*").eq("user_id", userId).order("start_date", { ascending: false }),
      supabase.from("achievements").select("*").eq("user_id", userId),
      supabase.from("projects").select("*").eq("user_id", userId).order("is_featured", { ascending: false })
    ]);

    if (skillsRes.data) setSkills(skillsRes.data);
    if (eduRes.data) setEducation(eduRes.data);
    if (achRes.data) setAchievements(achRes.data);
    if (projRes.data) setProjects(projRes.data);

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Portfolio Not Found</h1>
          <p className="text-muted-foreground mb-6">
            This portfolio doesn't exist or is set to private.
          </p>
          <Link to="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-accent hover:opacity-80 transition-opacity">
            <GraduationCap className="w-6 h-6" />
            <span className="font-bold">ProFolioX</span>
          </Link>
          <Badge variant="secondary" className="text-xs">
            Public Portfolio
          </Badge>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        {/* Profile Header */}
        <section className="text-center mb-12">
          <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <User className="w-12 h-12 text-accent" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            {profile?.full_name}
          </h1>
          {profile?.location && (
            <p className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
              <MapPin className="w-4 h-4" />
              {profile.location}
            </p>
          )}
          <div className="flex items-center justify-center gap-4">
            {profile?.linkedin_url && (
              <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {profile?.github_url && (
              <a href={profile.github_url} target="_blank" rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors">
                <Github className="w-5 h-5" />
              </a>
            )}
            {profile?.portfolio_url && (
              <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors">
                <Globe className="w-5 h-5" />
              </a>
            )}
          </div>
        </section>

        {/* About */}
        {visibleSections.about && profile?.bio && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-accent" />
              About
            </h2>
            <div className="glass-card rounded-xl p-6">
              <p className="text-foreground leading-relaxed">{profile.bio}</p>
            </div>
          </section>
        )}

        {/* Skills */}
        {visibleSections.skills && skills.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" />
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill.id} variant="secondary" className="px-3 py-1.5">
                  {skill.name}
                  {skill.proficiency_level && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      ({skill.proficiency_level})
                    </span>
                  )}
                </Badge>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {visibleSections.education && education.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-accent" />
              Education
            </h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="glass-card rounded-xl p-6">
                  <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                  <p className="text-muted-foreground">{edu.institution}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {edu.field_of_study && `${edu.field_of_study} • `}
                    {edu.start_date} - {edu.end_date || "Present"}
                    {edu.grade && ` • ${edu.grade}`}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {visibleSections.projects && projects.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-accent" />
              Projects
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="glass-card rounded-xl p-6">
                  <div className="flex items-start gap-2 mb-2">
                    <h3 className="font-semibold text-foreground flex-1">{project.title}</h3>
                    {project.is_featured && (
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    )}
                  </div>
                  {project.description && (
                    <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                  )}
                  {project.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                    {project.technologies.map((tech: string, i: number) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-3 mt-4 pt-3 border-t border-border">
                    {project.project_url && (
                      <a href={project.project_url} target="_blank" rel="noopener noreferrer"
                        className="text-sm text-accent hover:underline flex items-center gap-1">
                        <Globe className="w-3 h-3" /> Live
                      </a>
                    )}
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                        <Github className="w-3 h-3" /> Code
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements */}
        {visibleSections.achievements && achievements.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" />
              Achievements
            </h2>
            <div className="space-y-4">
              {achievements.map((ach) => (
                <div key={ach.id} className="glass-card rounded-xl p-6">
                  <h3 className="font-semibold text-foreground">{ach.title}</h3>
                  {ach.issuer && <p className="text-muted-foreground">{ach.issuer}</p>}
                  {ach.description && (
                    <p className="text-sm text-muted-foreground mt-2">{ach.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center">
        <p className="text-sm text-muted-foreground">
          Powered by <Link to="/" className="text-accent hover:underline">ProFolioX</Link>
        </p>
      </footer>
    </div>
  );
};

export default PublicPortfolio;
