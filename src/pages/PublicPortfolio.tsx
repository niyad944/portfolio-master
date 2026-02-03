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
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
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
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center relative z-10"
        >
          <h1 className="text-4xl font-display font-semibold text-foreground mb-4">Portfolio Not Found</h1>
          <p className="text-muted-foreground mb-6">
            This portfolio doesn't exist or is set to private.
          </p>
          <Link to="/">
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground btn-glow">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden noise-overlay">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="border-b border-white/[0.05] bg-background/80 backdrop-blur-xl sticky top-0 z-10"
      >
        <div className="max-w-5xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-accent hover:opacity-80 transition-opacity group">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <GraduationCap className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="font-display font-semibold text-sm sm:text-base text-foreground">ProFolioX</span>
          </Link>
          <Badge variant="secondary" className="text-xs font-mono bg-accent/10 text-accent border-accent/20">
            Public Portfolio
          </Badge>
        </div>
      </motion.header>

      <main className="max-w-5xl mx-auto px-4 py-6 sm:py-12">
        {/* Profile Header */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-8 sm:mb-12"
        >
          <motion.div
            variants={itemVariants}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full gold-border bg-background flex items-center justify-center mx-auto mb-4 sm:mb-6"
          >
            <User className="w-10 h-10 sm:w-12 sm:h-12 text-accent" />
          </motion.div>
          
          <motion.h1
            variants={itemVariants}
            className="text-2xl sm:text-3xl lg:text-4xl font-display font-semibold text-foreground mb-2"
          >
            {profile?.full_name}
          </motion.h1>
          
          {profile?.location && (
            <motion.p
              variants={itemVariants}
              className="flex items-center justify-center gap-2 text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4"
            >
              <MapPin className="w-4 h-4" />
              {profile.location}
            </motion.p>
          )}
          
          <motion.div variants={itemVariants} className="flex items-center justify-center gap-4">
            {profile?.linkedin_url && (
              <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors p-2 rounded-lg hover:bg-white/[0.05]">
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {profile?.github_url && (
              <a href={profile.github_url} target="_blank" rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors p-2 rounded-lg hover:bg-white/[0.05]">
                <Github className="w-5 h-5" />
              </a>
            )}
            {profile?.portfolio_url && (
              <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors p-2 rounded-lg hover:bg-white/[0.05]">
                <Globe className="w-5 h-5" />
              </a>
            )}
          </motion.div>
        </motion.section>

        {/* About */}
        {visibleSections.about && profile?.bio && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8 sm:mb-12"
          >
            <h2 className="text-lg sm:text-xl font-display font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-accent" />
              About
            </h2>
            <div className="glass-card rounded-xl p-4 sm:p-6">
              <p className="text-sm sm:text-base text-foreground leading-relaxed">{profile.bio}</p>
            </div>
          </motion.section>
        )}

        {/* Skills */}
        {visibleSections.skills && skills.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8 sm:mb-12"
          >
            <h2 className="text-lg sm:text-xl font-display font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" />
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Badge variant="secondary" className="px-3 py-1.5 text-xs sm:text-sm bg-accent/10 text-accent border-accent/20 hover:bg-accent/20 transition-colors">
                    {skill.name}
                    {skill.proficiency_level && (
                      <span className="ml-1 sm:ml-2 text-xs text-accent/60 font-mono">
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8 sm:mb-12"
          >
            <h2 className="text-lg sm:text-xl font-display font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-accent" />
              Education
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {education.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card rounded-xl p-4 sm:p-6"
                >
                  <h3 className="font-display font-semibold text-foreground text-sm sm:text-base">{edu.degree}</h3>
                  <p className="text-sm text-muted-foreground">{edu.institution}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-mono">
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8 sm:mb-12"
          >
            <h2 className="text-lg sm:text-xl font-display font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-accent" />
              Projects
            </h2>
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card-hover rounded-xl p-4 sm:p-6"
                >
                  <div className="flex items-start gap-2 mb-2">
                    <h3 className="font-display font-semibold text-foreground flex-1 text-sm sm:text-base">{project.title}</h3>
                    {project.is_featured && (
                      <Star className="w-4 h-4 text-accent fill-accent shrink-0" />
                    )}
                  </div>
                  {project.description && (
                    <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-3">{project.description}</p>
                  )}
                  {project.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech: string, i: number) => (
                        <Badge key={i} variant="secondary" className="text-xs bg-white/[0.05] border-white/10">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-3 mt-4 pt-3 border-t border-white/[0.05]">
                    {project.project_url && (
                      <a href={project.project_url} target="_blank" rel="noopener noreferrer"
                        className="text-xs sm:text-sm text-accent hover:underline flex items-center gap-1 min-h-[44px]">
                        <Globe className="w-3 h-3" /> Live
                      </a>
                    )}
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                        className="text-xs sm:text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 min-h-[44px]">
                        <Github className="w-3 h-3" /> Code
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8 sm:mb-12"
          >
            <h2 className="text-lg sm:text-xl font-display font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" />
              Achievements
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {achievements.map((ach, index) => (
                <motion.div
                  key={ach.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card rounded-xl p-4 sm:p-6"
                >
                  <h3 className="font-display font-semibold text-foreground text-sm sm:text-base">{ach.title}</h3>
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
      <footer className="border-t border-white/[0.05] py-6 text-center">
        <p className="text-xs sm:text-sm text-muted-foreground font-mono">
          Powered by <Link to="/" className="text-accent hover:underline">ProFolioX</Link>
        </p>
      </footer>
    </div>
  );
};

export default PublicPortfolio;
