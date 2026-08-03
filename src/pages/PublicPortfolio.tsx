import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuroraBackground, ScrollProgress } from "@/components/portfolio-v2/primitives";
import { FloatingNav } from "@/components/portfolio-v2/FloatingNav";
import { HeroSection } from "@/components/portfolio-v2/HeroSection";
import { AboutSection } from "@/components/portfolio-v2/AboutSection";
import { SkillsSection } from "@/components/portfolio-v2/SkillsSection";
import { ProjectsSection } from "@/components/portfolio-v2/ProjectsSection";
import { CertificatesSection } from "@/components/portfolio-v2/CertificatesSection";
import { AchievementsSection } from "@/components/portfolio-v2/AchievementsSection";
import { EducationSection } from "@/components/portfolio-v2/EducationSection";
import { ContactSection } from "@/components/portfolio-v2/ContactSection";
import { PortfolioFooter } from "@/components/portfolio-v2/PortfolioFooter";

interface Visible { about: boolean; skills: boolean; education: boolean; achievements: boolean; projects: boolean; certificates: boolean }

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
  const [exporting, setExporting] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<Visible>({
    about: true, skills: true, education: true, achievements: true, projects: true, certificates: false,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setNotFound(false);
      // Public route: never depends on session/auth state. Validate the param first.
      const cleanSlug = decodeURIComponent(slug ?? "").trim().toLowerCase();
      if (!cleanSlug || !/^[a-z0-9-]{1,60}$/.test(cleanSlug)) {
        if (!cancelled) { setNotFound(true); setLoading(false); }
        return;
      }
      const { data: p, error } = await supabase
        .from("profiles").select("*")
        .eq("public_slug", cleanSlug).eq("is_public", true)
        .maybeSingle();
      if (cancelled) return;
      if (error) console.error("Portfolio load failed:", error.message);
      if (error || !p) { setNotFound(true); setLoading(false); return; }
      setProfile(p);
      if (p.visible_sections && typeof p.visible_sections === "object") {
        const s = p.visible_sections as Record<string, unknown>;
        setVisible({
          about: Boolean(s.about ?? true), skills: Boolean(s.skills ?? true), education: Boolean(s.education ?? true),
          achievements: Boolean(s.achievements ?? true), projects: Boolean(s.projects ?? true), certificates: Boolean(s.certificates ?? false),
        });
      }
      const uid = p.user_id;
      const [sk, ed, ac, pr, ce] = await Promise.all([
        supabase.from("skills").select("*").eq("user_id", uid),
        supabase.from("education").select("*").eq("user_id", uid).order("start_date", { ascending: false }),
        supabase.from("achievements").select("*").eq("user_id", uid),
        supabase.from("projects").select("*").eq("user_id", uid).order("is_featured", { ascending: false }),
        supabase.from("certificates").select("*").eq("user_id", uid).order("created_at", { ascending: false }),
      ]);
      if (cancelled) return;
      if (sk.data) setSkills(sk.data);
      if (ed.data) setEducation(ed.data);
      if (ac.data) setAchievements(ac.data);
      if (pr.data) setProjects(pr.data);
      if (ce.data) setCertificates(ce.data);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [slug]);

  const handleDownload = async () => {
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
        skills: skills.map((s: any) => ({ name: s.name, proficiency_level: s.proficiency_level, category: s.category })),
        education: education.map((e: any) => ({
          degree: e.degree, institution: e.institution, field_of_study: e.field_of_study,
          start_date: e.start_date, end_date: e.end_date, grade: e.grade,
        })),
        projects: projects.map((p: any) => ({ title: p.title, description: p.description, technologies: p.technologies || [] })),
        achievements: [
          ...achievements.map((a: any) => ({ title: a.title, description: a.description, issuer: a.issuer })),
          ...certificates.map((c: any) => ({ title: c.title, description: c.description, issuer: c.issuer })),
        ],
      });
    } catch (e) { console.error("PDF export failed", e); }
    finally { setExporting(false); }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-[hsl(224_47%_4%)] grid place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-white/60" />
      </div>
    );
  }
  if (notFound) {
    return (
      <div className="min-h-screen relative text-white grid place-items-center overflow-hidden">
        <AuroraBackground />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center relative z-10 px-6">
          <h1 className="font-pf-display text-4xl sm:text-5xl font-semibold tracking-tight">Portfolio not found</h1>
          <p className="mt-3 text-white/60">This portfolio doesn't exist or is set to private.</p>
          <Link to="/" className="inline-block mt-8">
            <Button className="rounded-full bg-white text-black hover:bg-white/90 px-6"><ArrowLeft className="h-4 w-4 mr-2" />Go home</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const items: { id: string; label: string }[] = [
    { id: "hero", label: "Home" },
    ...(visible.about ? [{ id: "about", label: "About" }] : []),
    ...(visible.skills && skills.length ? [{ id: "skills", label: "Skills" }] : []),
    ...(visible.projects && projects.length ? [{ id: "projects", label: "Work" }] : []),
    ...(visible.certificates && certificates.length ? [{ id: "certificates", label: "Certificates" }] : []),
    ...(visible.achievements && achievements.length ? [{ id: "achievements", label: "Awards" }] : []),
    ...(visible.education && education.length ? [{ id: "education", label: "Education" }] : []),
    { id: "contact", label: "Contact" },
  ];

  const brand = profile?.full_name?.split(" ")[0] || "Portfolio";

  return (
    <div className="relative min-h-screen text-white antialiased [font-family:'Inter',system-ui,sans-serif] [&_.font-pf-display]:font-pf-display [&_h1]:font-pf-display [&_h2]:font-pf-display [&_h3]:font-pf-display">
      <AuroraBackground />
      <ScrollProgress />
      <FloatingNav items={items} onDownload={handleDownload} brand={brand} />
      {exporting && (
        <div className="fixed inset-x-0 top-20 z-50 flex justify-center">
          <div className="rounded-full bg-black/70 backdrop-blur px-4 py-2 text-xs text-white/80 border border-white/10 inline-flex items-center gap-2">
            <Loader2 className="h-3 w-3 animate-spin" /> Generating PDF…
          </div>
        </div>
      )}

      <main ref={rootRef}>
        <HeroSection
          fullName={profile?.full_name || "Your Name"}
          headline={profile?.headline}
          bio={profile?.bio}
          location={profile?.location}
          photoUrl={profile?.profile_photo_url}
          linkedin={profile?.linkedin_url}
          github={profile?.github_url}
          portfolio={profile?.portfolio_url}
          onDownload={handleDownload}
        />

        {visible.about && (
          <AboutSection
            bio={profile?.bio}
            stats={{
              projects: projects.length,
              certificates: certificates.length,
              achievements: achievements.length,
              skills: skills.length,
              education: education.length,
            }}
          />
        )}

        {visible.skills && skills.length > 0 && <SkillsSection skills={skills} />}
        {visible.projects && projects.length > 0 && <ProjectsSection projects={projects} />}
        {visible.certificates && certificates.length > 0 && <CertificatesSection certificates={certificates} slug={slug!} />}
        {visible.achievements && achievements.length > 0 && <AchievementsSection achievements={achievements} />}
        {visible.education && education.length > 0 && <EducationSection education={education} />}

        <ContactSection
          email={profile?.email || profile?.contact_email}
          linkedin={profile?.linkedin_url}
          github={profile?.github_url}
          portfolio={profile?.portfolio_url}
          location={profile?.location}
          fullName={profile?.full_name || ""}
        />
      </main>

      <PortfolioFooter name={profile?.full_name || "Portfolio"} />
    </div>
  );
};

export default PublicPortfolio;
