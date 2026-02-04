import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25, filter: "blur(6px)" },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3"
        >
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </motion.div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 noise-overlay relative overflow-hidden">
        <div className="absolute top-[30%] left-[25%] w-[400px] h-[400px] bg-accent/8 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[30%] right-[25%] w-[300px] h-[300px] bg-plasma/6 rounded-full blur-[120px] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center relative z-10"
        >
          <h1 className="text-3xl sm:text-4xl font-display font-semibold text-foreground mb-5 tracking-tight">Portfolio Not Found</h1>
          <p className="text-muted-foreground mb-8 text-base sm:text-lg">
            This portfolio doesn't exist or is set to private.
          </p>
          <Link to="/">
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground btn-glow shadow-glow min-h-[52px] px-8 rounded-xl transition-all duration-500 hover:shadow-bloom">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Home
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden noise-overlay">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-accent/4 rounded-full blur-[180px]" />
        <div className="absolute bottom-[20%] right-[5%] w-[400px] h-[400px] bg-plasma/3 rounded-full blur-[150px]" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="border-b border-white/[0.06] glass-strong sticky top-0 z-10"
      >
        <div className="max-w-5xl mx-auto px-4 py-4 sm:py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 text-accent hover:opacity-80 transition-opacity group">
            <div className="w-9 h-9 rounded-xl bg-accent/90 flex items-center justify-center transition-all duration-500 group-hover:scale-105 group-hover:shadow-glow">
              <GraduationCap className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="font-display font-semibold text-sm sm:text-base text-foreground tracking-wide">ProFolioX</span>
          </Link>
          <Badge variant="secondary" className="text-xs font-mono bg-accent/10 text-accent border-accent/20">
            Public Portfolio
          </Badge>
        </div>
      </motion.header>

      <main className="max-w-5xl mx-auto px-4 py-8 sm:py-16 relative z-10">
        {/* Profile Header */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-12 sm:mb-16"
        >
          <motion.div
            variants={itemVariants}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full lumina-border bg-background/60 backdrop-blur-xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-glow"
          >
            <User className="w-12 h-12 sm:w-14 sm:h-14 text-accent" />
          </motion.div>
          
          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-foreground mb-3 tracking-tight"
          >
            {profile?.full_name}
          </motion.h1>
          
          {profile?.location && (
            <motion.p
              variants={itemVariants}
              className="flex items-center justify-center gap-2 text-sm sm:text-base text-muted-foreground mb-5 sm:mb-6"
            >
              <MapPin className="w-4 h-4" />
              {profile.location}
            </motion.p>
          )}
          
          <motion.div variants={itemVariants} className="flex items-center justify-center gap-5">
            {profile?.linkedin_url && (
              <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-all duration-400 p-3 rounded-xl hover:bg-white/[0.06]">
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {profile?.github_url && (
              <a href={profile.github_url} target="_blank" rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-all duration-400 p-3 rounded-xl hover:bg-white/[0.06]">
                <Github className="w-5 h-5" />
              </a>
            )}
            {profile?.portfolio_url && (
              <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-all duration-400 p-3 rounded-xl hover:bg-white/[0.06]">
                <Globe className="w-5 h-5" />
              </a>
            )}
          </motion.div>
        </motion.section>

        {/* About */}
        {visibleSections.about && profile?.bio && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 sm:mb-14"
          >
            <h2 className="text-xl sm:text-2xl font-display font-semibold text-foreground mb-4 sm:mb-5 flex items-center gap-3">
              <User className="w-5 h-5 text-accent" />
              About
            </h2>
            <div className="glass-card rounded-2xl p-5 sm:p-8">
              <p className="text-sm sm:text-base text-foreground leading-relaxed">{profile.bio}</p>
            </div>
          </motion.section>
        )}

        {/* Skills */}
        {visibleSections.skills && skills.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 sm:mb-14"
          >
            <h2 className="text-xl sm:text-2xl font-display font-semibold text-foreground mb-4 sm:mb-5 flex items-center gap-3">
              <Award className="w-5 h-5 text-accent" />
              Skills
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Badge variant="secondary" className="px-4 py-2 text-xs sm:text-sm bg-accent/10 text-accent border-accent/20 hover:bg-accent/15 transition-all duration-400">
                    {skill.name}
                    {skill.proficiency_level && (
                      <span className="ml-2 text-xs text-accent/60 font-mono">
                        ({skill.proficiency_level})
                      </span>
                    )}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Education */}
        {visibleSections.education && education.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 sm:mb-14"
          >
            <h2 className="text-xl sm:text-2xl font-display font-semibold text-foreground mb-4 sm:mb-5 flex items-center gap-3">
              <GraduationCap className="w-5 h-5 text-accent" />
              Education
            </h2>
            <div className="space-y-4 sm:space-y-5">
              {education.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, x: -25 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card rounded-2xl p-5 sm:p-7"
                >
                  <h3 className="font-display font-semibold text-foreground text-base sm:text-lg">{edu.degree}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">{edu.institution}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2 font-mono">
                    {edu.field_of_study && `${edu.field_of_study} • `}
                    {edu.start_date} - {edu.end_date || "Present"}
                    {edu.grade && ` • ${edu.grade}`}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Projects */}
        {visibleSections.projects && projects.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 sm:mb-14"
          >
            <h2 className="text-xl sm:text-2xl font-display font-semibold text-foreground mb-4 sm:mb-5 flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-accent" />
              Projects
            </h2>
            <div className="grid gap-5 sm:gap-6 sm:grid-cols-2">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card-hover rounded-2xl p-5 sm:p-7"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <h3 className="font-display font-semibold text-foreground flex-1 text-base sm:text-lg">{project.title}</h3>
                    {project.is_featured && (
                      <Star className="w-5 h-5 text-accent fill-accent shrink-0" />
                    )}
                  </div>
                  {project.description && (
                    <p className="text-xs sm:text-sm text-muted-foreground mb-4 line-clamp-3">{project.description}</p>
                  )}
                  {project.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.map((tech: string, i: number) => (
                        <Badge key={i} variant="secondary" className="text-xs bg-white/[0.05] border-white/10">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-4 mt-5 pt-4 border-t border-white/[0.06]">
                    {project.project_url && (
                      <a href={project.project_url} target="_blank" rel="noopener noreferrer"
                        className="text-xs sm:text-sm text-accent hover:underline flex items-center gap-1.5 min-h-[44px] transition-colors">
                        <Globe className="w-4 h-4" /> Live
                      </a>
                    )}
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                        className="text-xs sm:text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5 min-h-[44px] transition-colors">
                        <Github className="w-4 h-4" /> Code
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Achievements */}
        {visibleSections.achievements && achievements.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 sm:mb-14"
          >
            <h2 className="text-xl sm:text-2xl font-display font-semibold text-foreground mb-4 sm:mb-5 flex items-center gap-3">
              <Award className="w-5 h-5 text-accent" />
              Achievements
            </h2>
            <div className="space-y-4 sm:space-y-5">
              {achievements.map((ach, index) => (
                <motion.div
                  key={ach.id}
                  initial={{ opacity: 0, x: -25 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card rounded-2xl p-5 sm:p-7"
                >
                  <h3 className="font-display font-semibold text-foreground text-base sm:text-lg">{ach.title}</h3>
                  {ach.issuer && <p className="text-sm text-muted-foreground">{ach.issuer}</p>}
                  {ach.description && (
                    <p className="text-xs sm:text-sm text-muted-foreground mt-2">{ach.description}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8 sm:py-10 text-center relative z-10">
        <p className="text-xs sm:text-sm text-muted-foreground font-mono tracking-wide">
          Powered by <Link to="/" className="text-accent hover:underline transition-colors">ProFolioX</Link>
        </p>
      </footer>
    </div>
  );
};

export default PublicPortfolio;