import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
  Star,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  Download,
} from "lucide-react";
import FloatingOrbs from "@/components/effects/FloatingOrbs";
import ScrollReveal3D from "@/components/effects/ScrollReveal3D";
import Tilt3DCard from "@/components/effects/Tilt3DCard";

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
  const [certificates, setCertificates] = useState<any[]>([]);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState(false);
  const [exporting, setExporting] = useState(false);
  const portfolioRef = useRef<HTMLDivElement>(null);
  const [visibleSections, setVisibleSections] = useState<VisibleSections>({
    about: true,
    skills: true,
    education: true,
    achievements: true,
    projects: true,
    certificates: false,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setNotFound(false);
      const cleanSlug = decodeURIComponent(slug ?? "").trim().toLowerCase();
      if (!cleanSlug || !/^[a-z0-9-]{1,60}$/.test(cleanSlug)) {
        if (!cancelled) { setNotFound(true); setLoading(false); }
        return;
      }

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("public_slug", cleanSlug)
        .eq("is_public", true)
        .maybeSingle();

      if (cancelled) return;
      if (error) console.error("Portfolio load failed:", error.message);
      if (error || !profileData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setProfile(profileData);
      setProfilePhotoUrl(profileData.profile_photo_url || null);

      if (profileData.visible_sections && typeof profileData.visible_sections === "object") {
        const sections = profileData.visible_sections as Record<string, unknown>;
        setVisibleSections({
          about: Boolean(sections.about ?? true),
          skills: Boolean(sections.skills ?? true),
          education: Boolean(sections.education ?? true),
          achievements: Boolean(sections.achievements ?? true),
          projects: Boolean(sections.projects ?? true),
          certificates: Boolean(sections.certificates ?? false),
        });
      }

      const userId = profileData.user_id;
      const [skillsRes, eduRes, achRes, projRes, certRes] = await Promise.all([
        supabase.from("skills").select("*").eq("user_id", userId),
        supabase.from("education").select("*").eq("user_id", userId).order("start_date", { ascending: false }),
        supabase.from("achievements").select("*").eq("user_id", userId),
        supabase.from("projects").select("*").eq("user_id", userId).order("is_featured", { ascending: false }),
        supabase.from("certificates").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      ]);

      if (cancelled) return;
      if (skillsRes.data) setSkills(skillsRes.data);
      if (eduRes.data) setEducation(eduRes.data);
      if (achRes.data) setAchievements(achRes.data);
      if (projRes.data) setProjects(projRes.data);
      if (certRes.data) setCertificates(certRes.data);
      setLoading(false);
    })();

    return () => { cancelled = true; };
  }, [slug]);

  const getFilePreviewUrl = (cert: any) => {
    if (!cert.file_path) return null;
    const { data } = supabase.storage.from("certificates").getPublicUrl(cert.file_path);
    return data?.publicUrl || null;
  };

  const isImageFile = (cert: any) => {
    return cert.mime_type?.startsWith("image/") || cert.file_name?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  };

  const handleDownloadPDF = async () => {
    setExporting(true);
    try {
      const { printResume } = await import("@/components/resume/ResumePrint");
      await printResume("professional", {
        profile: {
          full_name: profile?.full_name || "",
          bio: profile?.bio || "",
          email: profile?.email || profile?.contact_email || "",
          phone: profile?.phone || "",
          location: profile?.location || "",
          linkedin_url: profile?.linkedin_url || "",
          github_url: profile?.github_url || "",
          portfolio_url: profile?.portfolio_url || "",
          profile_photo_url: profile?.profile_photo_url || "",
        },
        skills: skills.map((skill: any) => ({ name: skill.name, proficiency_level: skill.proficiency_level, category: skill.category })),
        education: education.map((entry: any) => ({
          degree: entry.degree,
          institution: entry.institution,
          field_of_study: entry.field_of_study,
          start_date: entry.start_date,
          end_date: entry.end_date,
          grade: entry.grade,
        })),
        projects: projects.map((project: any) => ({
          title: project.title,
          description: project.description,
          technologies: project.technologies || [],
        })),
        achievements: [
          ...achievements.map((achievement: any) => ({ title: achievement.title, description: achievement.description, issuer: achievement.issuer })),
          ...certificates.map((certificate: any) => ({ title: certificate.name, description: certificate.description, issuer: certificate.issuing_organization })),
        ],
      });
    } catch (error) {
      console.error("PDF export failed", error);
    } finally {
      setExporting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  if (loading) {
    return (
      <div className="portfolio-original-light min-h-screen bg-background p-4 sm:p-8">
        <div className="max-w-5xl mx-auto space-y-8 pt-16">
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="w-28 h-28 rounded-full" />
            <Skeleton className="w-48 h-8" />
            <Skeleton className="w-32 h-5" />
          </div>
          <div className="space-y-4">
            <Skeleton className="w-full h-32 rounded-2xl" />
            <Skeleton className="w-full h-24 rounded-2xl" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-40 rounded-2xl" />
              <Skeleton className="h-40 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="portfolio-original-light min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
        <FloatingOrbs variant="subtle" />
        <div className="absolute top-[30%] left-[25%] w-[400px] h-[400px] bg-accent/8 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[30%] right-[25%] w-[300px] h-[300px] bg-plasma/6 rounded-full blur-[120px] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center relative z-10"
        >
          <h1 className="text-3xl sm:text-4xl font-display font-semibold text-foreground mb-5 tracking-tight">
            Portfolio Not Found
          </h1>
          <p className="text-muted-foreground mb-8 text-base sm:text-lg">
            This portfolio doesn't exist or is set to private.
          </p>
          <Link to="/">
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground btn-glow btn-3d-lift shadow-glow min-h-[52px] px-8 rounded-xl transition-all duration-500 hover:shadow-bloom">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Home
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="portfolio-original-light min-h-screen bg-background overflow-x-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <FloatingOrbs variant="subtle" />
        <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-accent/4 rounded-full blur-[180px]" />
        <div className="absolute bottom-[20%] right-[5%] w-[400px] h-[400px] bg-plasma/3 rounded-full blur-[150px]" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="pf-no-print border-b border-border glass-strong sticky top-0 z-10"
      >
        <div className="max-w-5xl mx-auto px-4 py-4 sm:py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 text-accent hover:opacity-80 transition-opacity group">
            <div className="w-9 h-9 rounded-xl bg-accent/90 flex items-center justify-center transition-all duration-500 group-hover:scale-105 group-hover:shadow-glow">
              <GraduationCap className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="font-display font-semibold text-sm sm:text-base text-foreground tracking-wide">
              ProFolioX
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleDownloadPDF}
              disabled={exporting}
              variant="outline"
              size="sm"
              className="border-accent/30 text-accent hover:bg-accent/10"
            >
              {exporting ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : <Download className="w-4 h-4 mr-1.5" />}
              {exporting ? "Exporting..." : "Download PDF"}
            </Button>
            <Badge variant="secondary" className="text-xs font-mono bg-accent/10 text-accent border-accent/20">
              Public Portfolio
            </Badge>
          </div>
        </div>
      </motion.header>

      <div ref={portfolioRef}>
        <main className="max-w-5xl mx-auto px-4 py-8 sm:py-16 relative z-10">
          {/* Profile Header */}
          <motion.section
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-12 sm:mb-16 perspective-1200"
          >
            <motion.div variants={itemVariants}>
              <Tilt3DCard maxTilt={8} scale={1.03} className="inline-block">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full lumina-border bg-background/60 backdrop-blur-xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-glow float-3d overflow-hidden">
                  {profilePhotoUrl && !photoError ? (
                    <img
                      src={profilePhotoUrl}
                      alt={profile?.full_name || "Profile"}
                      className="w-full h-full object-cover"
                      onError={() => setPhotoError(true)}
                    />
                  ) : (
                    <User className="w-12 h-12 sm:w-14 sm:h-14 text-accent" />
                  )}
                </div>
              </Tilt3DCard>
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
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-accent transition-all duration-400 p-3 rounded-xl hover:bg-white/[0.06]"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {profile?.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-accent transition-all duration-400 p-3 rounded-xl hover:bg-white/[0.06]"
                >
                  <Github className="w-5 h-5" />
                </a>
              )}
              {profile?.portfolio_url && (
                <a
                  href={profile.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-accent transition-all duration-400 p-3 rounded-xl hover:bg-white/[0.06]"
                >
                  <Globe className="w-5 h-5" />
                </a>
              )}
            </motion.div>
          </motion.section>

          {/* About */}
          {visibleSections.about && profile?.bio && (
            <ScrollReveal3D className="mb-10 sm:mb-14" depth={50}>
              <h2 className="text-xl sm:text-2xl font-display font-semibold text-foreground mb-4 sm:mb-5 flex items-center gap-3">
                <User className="w-5 h-5 text-accent" />
                About
              </h2>
              <div className="glass-card rounded-2xl p-5 sm:p-8">
                <p className="text-sm sm:text-base text-foreground leading-relaxed">{profile.bio}</p>
              </div>
            </ScrollReveal3D>
          )}

          {/* Skills */}
          {visibleSections.skills && skills.length > 0 && (
            <ScrollReveal3D className="mb-10 sm:mb-14" depth={50} direction="left">
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
                    <Badge
                      variant="secondary"
                      className="px-4 py-2 text-xs sm:text-sm bg-accent/10 text-accent border-accent/20 hover:bg-accent/15 transition-all duration-400"
                    >
                      {skill.name}
                      {skill.proficiency_level && (
                        <span className="ml-2 text-xs text-accent/60 font-mono">({skill.proficiency_level})</span>
                      )}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal3D>
          )}

          {/* Education */}
          {visibleSections.education && education.length > 0 && (
            <ScrollReveal3D className="mb-10 sm:mb-14" depth={60}>
              <h2 className="text-xl sm:text-2xl font-display font-semibold text-foreground mb-4 sm:mb-5 flex items-center gap-3">
                <GraduationCap className="w-5 h-5 text-accent" />
                Education
              </h2>
              <div className="space-y-5 sm:space-y-6">
                {education.map((edu, index) => (
                  <ScrollReveal3D key={edu.id} delay={index * 0.1} direction="left">
                    <div className="group relative glass-card rounded-2xl overflow-hidden shadow-3d-hover hover:border-accent/30 transition-all duration-300">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-accent to-accent/40 rounded-l-2xl" />
                      <div className="p-5 sm:p-7 pl-6 sm:pl-8">
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                          <h3 className="font-display font-bold text-foreground text-lg sm:text-xl tracking-tight">{edu.degree}</h3>
                          {edu.grade && (
                            <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-sm sm:text-base font-bold bg-accent/15 text-accent border border-accent/25 shadow-[0_0_12px_hsl(var(--accent)/0.1)]">
                              {edu.grade}
                            </span>
                          )}
                        </div>
                        <p className="text-sm sm:text-base text-foreground/75 font-medium">{edu.institution}</p>
                        {edu.field_of_study && (
                          <p className="text-sm text-muted-foreground mt-1">{edu.field_of_study}</p>
                        )}
                        <div className="flex items-center gap-1.5 mt-3 text-xs sm:text-sm text-muted-foreground font-mono">
                          <GraduationCap className="w-3.5 h-3.5 text-accent/60" />
                          <span>{edu.start_date} — {edu.end_date || "Present"}</span>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal3D>
                ))}
              </div>
            </ScrollReveal3D>
          )}

          {/* Projects */}
          {visibleSections.projects && projects.length > 0 && (
            <ScrollReveal3D className="mb-10 sm:mb-14" depth={60}>
              <h2 className="text-xl sm:text-2xl font-display font-semibold text-foreground mb-4 sm:mb-5 flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-accent" />
                Projects
              </h2>
              <div className="space-y-8 sm:space-y-12">
                {projects.map((project, index) => {
                  const isEven = index % 2 === 0;
                  const hasImage = !!project.image_url;

                  return (
                    <ScrollReveal3D key={project.id} delay={index * 0.12} direction={isEven ? "left" : "right"}>
                      <div className={`glass-card-hover rounded-2xl overflow-hidden shadow-3d-hover ${hasImage ? "" : "p-5 sm:p-7"}`}>
                        {hasImage ? (
                          <div className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"}`}>
                            <div className="w-full md:w-1/2 h-56 sm:h-64 md:h-auto md:min-h-[280px] relative overflow-hidden group">
                              <img
                                src={project.image_url}
                                alt={project.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent md:hidden" />
                            </div>
                            <div className="w-full md:w-1/2 p-5 sm:p-7 flex flex-col justify-center">
                              {project.sdg_goals?.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                  {project.sdg_goals.map((sdg: string, i: number) => (
                                    <Badge
                                      key={i}
                                      className="text-[10px] sm:text-xs font-bold bg-gradient-to-r from-accent/25 to-accent/10 text-accent border-accent/30 px-2.5 py-1"
                                    >
                                      {sdg}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                              <div className="flex items-start gap-3 mb-3">
                                <h3 className="font-display font-semibold text-foreground flex-1 text-lg sm:text-xl">
                                  {project.title}
                                </h3>
                                {project.is_featured && <Star className="w-5 h-5 text-accent fill-accent shrink-0" />}
                              </div>
                              {project.description && (
                                <p className="text-xs sm:text-sm text-muted-foreground mb-4 line-clamp-4">
                                  {project.description}
                                </p>
                              )}
                              {project.technologies?.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                  {project.technologies.map((tech: string, i: number) => (
                                    <Badge key={i} variant="secondary" className="text-xs bg-white/[0.05] border-white/10">
                                      {tech}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                              <div className="flex gap-4 pt-4 border-t border-white/[0.06] mt-auto">
                                {project.project_url && (
                                  <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-accent hover:underline flex items-center gap-1.5 min-h-[44px] transition-colors">
                                    <Globe className="w-4 h-4" /> Live
                                  </a>
                                )}
                                {project.github_url && (
                                  <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5 min-h-[44px] transition-colors">
                                    <Github className="w-4 h-4" /> Code
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <>
                            {project.sdg_goals?.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mb-3">
                                {project.sdg_goals.map((sdg: string, i: number) => (
                                  <Badge key={i} className="text-[10px] sm:text-xs font-bold bg-gradient-to-r from-accent/25 to-accent/10 text-accent border-accent/30 px-2.5 py-1">
                                    {sdg}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            <div className="flex items-start gap-3 mb-3">
                              <h3 className="font-display font-semibold text-foreground flex-1 text-base sm:text-lg">
                                {project.title}
                              </h3>
                              {project.is_featured && <Star className="w-5 h-5 text-accent fill-accent shrink-0" />}
                            </div>
                            {project.description && (
                              <p className="text-xs sm:text-sm text-muted-foreground mb-4 line-clamp-3">
                                {project.description}
                              </p>
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
                                <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-accent hover:underline flex items-center gap-1.5 min-h-[44px] transition-colors">
                                  <Globe className="w-4 h-4" /> Live
                                </a>
                              )}
                              {project.github_url && (
                                <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5 min-h-[44px] transition-colors">
                                  <Github className="w-4 h-4" /> Code
                                </a>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </ScrollReveal3D>
                  );
                })}
              </div>
            </ScrollReveal3D>
          )}

          {/* Achievements */}
          {visibleSections.achievements && achievements.length > 0 && (
            <ScrollReveal3D className="mb-10 sm:mb-14" depth={50} direction="right">
              <h2 className="text-xl sm:text-2xl font-display font-semibold text-foreground mb-4 sm:mb-5 flex items-center gap-3">
                <Award className="w-5 h-5 text-accent" />
                Achievements
              </h2>
              <div className="space-y-4 sm:space-y-5">
                {achievements.map((ach, index) => (
                  <ScrollReveal3D key={ach.id} delay={index * 0.1} direction="left">
                    <div className="glass-card rounded-2xl p-5 sm:p-7 shadow-3d-hover">
                      <h3 className="font-display font-semibold text-foreground text-base sm:text-lg">{ach.title}</h3>
                      {ach.issuer && <p className="text-sm text-muted-foreground">{ach.issuer}</p>}
                      {ach.description && (
                        <p className="text-xs sm:text-sm text-muted-foreground mt-2">{ach.description}</p>
                      )}
                    </div>
                  </ScrollReveal3D>
                ))}
              </div>
            </ScrollReveal3D>
          )}

          {/* Certificates — Same zig-zag layout as Projects */}
          {visibleSections.certificates && certificates.length > 0 && (
            <ScrollReveal3D className="mb-10 sm:mb-14" depth={60} direction="left">
              <h2 className="text-xl sm:text-2xl font-display font-semibold text-foreground mb-4 sm:mb-5 flex items-center gap-3">
                <FileText className="w-5 h-5 text-accent" />
                Certificates
              </h2>
              <div className="space-y-8 sm:space-y-12">
                {certificates.map((cert, index) => {
                  const isEven = index % 2 === 0;
                  const previewUrl = getFilePreviewUrl(cert);
                  const isImage = isImageFile(cert);
                  const hasPreview = previewUrl && isImage;

                  return (
                    <ScrollReveal3D key={cert.id} delay={index * 0.12} direction={isEven ? "left" : "right"}>
                      <div className={`glass-card-hover rounded-2xl overflow-hidden shadow-3d-hover ${hasPreview ? "" : "p-5 sm:p-7"}`}>
                        {hasPreview ? (
                          <div className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"}`}>
                            {/* Image side */}
                            <div className="w-full md:w-1/2 h-56 sm:h-64 md:h-auto md:min-h-[280px] relative overflow-hidden group">
                              <img
                                src={previewUrl}
                                alt={cert.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent md:hidden" />
                              {/* SDG overlay on image */}
                              {cert.sdg_goals?.length > 0 && (
                                <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5">
                                  {cert.sdg_goals.map((sdg: string, i: number) => (
                                    <span
                                      key={i}
                                      className="inline-flex items-center gap-2 text-base sm:text-lg font-extrabold tracking-wide text-accent drop-shadow-lg bg-background/80 backdrop-blur-md px-4 py-1.5 rounded-xl shadow-[0_0_16px_hsl(var(--accent)/0.2)]"
                                      style={{ textShadow: '0 0 20px hsl(var(--accent) / 0.3)' }}
                                    >
                                      <SDGLogo sdg={sdg} size={24} />
                                      {sdg.split(":")[0]}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            {/* Details side */}
                            <div className="w-full md:w-1/2 p-5 sm:p-7 flex flex-col justify-center">
                              {/* SDG large text on details side too */}
                              {cert.sdg_goals?.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {cert.sdg_goals.map((sdg: string, i: number) => (
                                    <span key={i} className="inline-flex items-center gap-2">
                                      <SDGLogo sdg={sdg} size={30} />
                                      <Badge
                                        className="text-base sm:text-lg font-extrabold bg-gradient-to-r from-accent/30 to-accent/10 text-accent border-accent/40 px-4 py-2 tracking-wide shadow-[0_0_16px_hsl(var(--accent)/0.15)]"
                                        style={{ textShadow: '0 0 20px hsl(var(--accent) / 0.25)' }}
                                      >
                                        {sdg}
                                      </Badge>
                                    </span>
                                  ))}
                                </div>
                              )}
                              <h3 className="font-display font-semibold text-foreground text-lg sm:text-xl mb-2">
                                {cert.name}
                              </h3>
                              {cert.issuing_organization && (
                                <p className="text-sm text-muted-foreground mb-1">{cert.issuing_organization}</p>
                              )}
                              {cert.issue_date && (
                                <p className="text-xs text-muted-foreground mb-3 font-mono">
                                  {new Date(cert.issue_date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                                </p>
                              )}
                              {cert.description && (
                                <p className="text-xs sm:text-sm text-muted-foreground mb-4 line-clamp-4">
                                  {cert.description}
                                </p>
                              )}
                              <div className="flex gap-4 pt-4 border-t border-white/[0.06] mt-auto">
                                <Link
                                  to={`/p/${slug}/document/${cert.id}`}
                                  className="text-xs sm:text-sm text-accent hover:underline flex items-center gap-1.5 min-h-[44px] transition-colors"
                                >
                                  <ExternalLink className="w-4 h-4" /> View
                                </Link>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* No-image certificate card */
                          <>
                            {cert.sdg_goals?.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {cert.sdg_goals.map((sdg: string, i: number) => (
                                  <span key={i} className="inline-flex items-center gap-2">
                                    <SDGLogo sdg={sdg} size={30} />
                                    <Badge
                                      className="text-base sm:text-lg font-extrabold bg-gradient-to-r from-accent/30 to-accent/10 text-accent border-accent/40 px-4 py-2 tracking-wide shadow-[0_0_16px_hsl(var(--accent)/0.15)]"
                                      style={{ textShadow: '0 0 20px hsl(var(--accent) / 0.25)' }}
                                    >
                                      {sdg}
                                    </Badge>
                                  </span>
                                ))}
                              </div>
                            )}
                            <h3 className="font-display font-semibold text-foreground text-base sm:text-lg mb-2">
                              {cert.name}
                            </h3>
                            {cert.issuing_organization && (
                              <p className="text-sm text-muted-foreground mb-1">{cert.issuing_organization}</p>
                            )}
                            {cert.issue_date && (
                              <p className="text-xs text-muted-foreground mb-3 font-mono">
                                {new Date(cert.issue_date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                              </p>
                            )}
                            {cert.description && (
                              <p className="text-xs sm:text-sm text-muted-foreground mb-4 line-clamp-3">
                                {cert.description}
                              </p>
                            )}
                            <div className="flex gap-4 mt-4 pt-4 border-t border-white/[0.06]">
                              <Link
                                to={`/p/${slug}/document/${cert.id}`}
                                className="text-xs sm:text-sm text-accent hover:underline flex items-center gap-1.5 min-h-[44px] transition-colors"
                              >
                                <ExternalLink className="w-4 h-4" /> View
                              </Link>
                            </div>
                          </>
                        )}
                      </div>
                    </ScrollReveal3D>
                  );
                })}
              </div>
            </ScrollReveal3D>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="pf-no-print border-t border-border py-8 sm:py-10 text-center relative z-10">
        <p className="text-xs sm:text-sm text-muted-foreground font-mono tracking-wide">
          Powered by{" "}
          <Link to="/" className="text-accent hover:underline transition-colors">
            ProFolioX
          </Link>
        </p>
      </footer>
    </div>
  );
};

export default PublicPortfolio;
