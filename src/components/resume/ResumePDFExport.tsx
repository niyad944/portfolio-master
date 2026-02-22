import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2, FileText, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getResumeHTML, templatePreviewStyles } from "./resumeTemplates";

interface ResumeContent {
  profile: {
    full_name: string;
    bio: string;
    email: string;
    phone: string;
    location: string;
    linkedin_url: string;
    github_url: string;
  };
  skills: Array<{ name: string; proficiency_level: string }>;
  education: Array<{
    degree: string;
    institution: string;
    field_of_study: string;
    start_date: string;
    end_date: string;
    grade: string;
  }>;
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
  }>;
  achievements: Array<{
    title: string;
    description: string;
    issuer: string;
  }>;
}

interface ResumePDFExportProps {
  content: ResumeContent;
  templateKey?: string;
  onGenerated?: () => void;
}

const ResumePDFExport = ({ content, templateKey = "professional", onGenerated }: ResumePDFExportProps) => {
  const [exporting, setExporting] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const { profile, skills, education, projects, achievements } = content;
  const style = templatePreviewStyles[templateKey] || templatePreviewStyles.professional;

  const generatePDF = async () => {
    setExporting(true);
    
    try {
      // Create a printable HTML document
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        throw new Error("Please allow popups to download your resume");
      }

      const htmlContent = getResumeHTML(templateKey, content);
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      onGenerated?.();
    } catch (error: any) {
      console.error("PDF export error:", error);
      alert(error.message || "Failed to generate PDF");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="lg">
            <Eye className="w-4 h-4 mr-2" />
            Preview Resume
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Resume Preview</DialogTitle>
          </DialogHeader>
          <div ref={printRef} className="bg-white text-gray-900 p-8 rounded-lg shadow-inner">
            {/* Preview Header */}
            <div className={style.headerClass}>
              <div>
                <h1 className={style.nameClass}>
                  {profile?.full_name || "Your Name"}
                </h1>
                {templateKey === "creative" ? (
                  <p className="text-xs text-gray-400 mt-1 font-mono">Portfolio & Resume</p>
                ) : null}
                {style.layout !== "two-col" && (
                  <div className={`${style.contactClass} space-x-2 mt-1`}>
                    {profile?.email && <span>{profile.email}</span>}
                    {profile?.phone && <span>· {profile.phone}</span>}
                    {profile?.location && <span>· {profile.location}</span>}
                  </div>
                )}
              </div>
              {(style.layout === "two-col" || style.layout === "sidebar") && templateKey !== "modern" && (
                <div className={`${style.contactClass}`}>
                  {profile?.email && <div>{profile.email}</div>}
                  {profile?.phone && <div>{profile.phone}</div>}
                  {profile?.location && <div>{profile.location}</div>}
                </div>
              )}
            </div>

            {/* Bio - always full width */}
            {profile?.bio && (
              <div className={`mb-5 ${templateKey === "creative" ? "pb-4 border-b border-gray-200" : ""}`}>
                {templateKey !== "creative" && (
                  <h2 className={style.sectionTitleClass}>
                    {templateKey === "professional" ? "Professional Summary" : "Summary"}
                  </h2>
                )}
                <p className={`text-sm ${templateKey === "minimal" ? "text-gray-500 font-light leading-relaxed" : "text-gray-600"}`}>{profile.bio}</p>
              </div>
            )}

            {/* Preview Content */}
            <div className={style.layout === "two-col" ? "grid grid-cols-[1fr_220px] gap-8" : ""}>
              <div>
                {templateKey === "professional" && skills && skills.length > 0 && (
                  <div className="mb-5">
                    <h2 className={style.sectionTitleClass}>Core Competencies</h2>
                    <p className="text-sm text-gray-600">{skills.map(s => s.name).join("  |  ")}</p>
                  </div>
                )}

                {templateKey === "minimal" && skills && skills.length > 0 && (
                  <div className="mb-5">
                    <h2 className={style.sectionTitleClass}>Skills</h2>
                    <p className="text-sm text-gray-500 font-light">{skills.map(s => s.name).join(", ")}</p>
                  </div>
                )}

                {education && education.length > 0 && (
                  <div className="mb-5">
                    <h2 className={style.sectionTitleClass}>Education</h2>
                    {education.map((e, i) => (
                      <div key={i} className={`mb-3 ${templateKey === "minimal" ? "mb-4" : ""}`}>
                        <div className="flex justify-between">
                          <span className="font-medium text-sm text-gray-900">{e.degree} {e.field_of_study && `in ${e.field_of_study}`}</span>
                          <span className={`text-xs text-gray-500 ${templateKey === "creative" ? "font-mono" : templateKey === "professional" ? "italic" : ""}`}>
                            {e.start_date} – {e.end_date || "Present"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{e.institution}</p>
                      </div>
                    ))}
                  </div>
                )}

                {projects && projects.length > 0 && (
                  <div className="mb-5">
                    <h2 className={style.sectionTitleClass}>Projects</h2>
                    {projects.map((p, i) => (
                      <div key={i} className="mb-3">
                        <p className="font-medium text-sm text-gray-900">{p.title}</p>
                        {p.description && <p className="text-sm text-gray-500">{p.description}</p>}
                        {p.technologies?.length > 0 && (
                          templateKey === "creative" ? (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {p.technologies.map((t, j) => <span key={j} className={style.skillClass}>{t}</span>)}
                            </div>
                          ) : (
                            <p className={`text-xs mt-1 ${style.accentColor}`}>
                              {p.technologies.join(", ")}
                            </p>
                          )
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {achievements && achievements.length > 0 && (
                  <div className="mb-5">
                    <h2 className={style.sectionTitleClass}>Achievements</h2>
                    {achievements.map((a, i) => (
                      <div key={i} className="mb-3">
                        <p className="font-medium text-sm text-gray-900">{a.title}</p>
                        {a.issuer && <p className="text-xs text-gray-500">{a.issuer}</p>}
                        {a.description && <p className="text-sm text-gray-500">{a.description}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Side column for creative template */}
              {style.layout === "two-col" && skills && skills.length > 0 && (
                <div>
                  <h2 className={style.sectionTitleClass}>Tech Stack</h2>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((s, i) => (
                      <span key={i} className={style.skillClass}>{s.name}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Button
        onClick={generatePDF}
        disabled={exporting}
        className="bg-accent hover:bg-accent/90 text-accent-foreground"
        size="lg"
      >
        {exporting ? (
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
        ) : (
          <Download className="w-4 h-4 mr-2" />
        )}
        Download as PDF
      </Button>
    </div>
  );
};

export default ResumePDFExport;
