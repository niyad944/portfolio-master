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
                <div className={`${style.contactClass} space-x-2 mt-1`}>
                  {profile?.email && <span>{profile.email}</span>}
                  {profile?.phone && <span>· {profile.phone}</span>}
                  {profile?.location && <span>· {profile.location}</span>}
                </div>
              </div>
              {style.layout === "two-col" && (
                <div className={`${style.contactClass} text-right`}>
                  {profile?.email && <div>{profile.email}</div>}
                  {profile?.phone && <div>{profile.phone}</div>}
                  {profile?.location && <div>{profile.location}</div>}
                </div>
              )}
            </div>

            {/* Preview Content */}
            <div className={style.layout === "two-col" ? "grid grid-cols-2 gap-6" : ""}>
              <div>
                {profile?.bio && (
                  <div className="mb-5">
                    <h2 className={style.sectionTitleClass}>
                      {templateKey === "minimal" ? "// Summary" : "Professional Summary"}
                    </h2>
                    <p className="text-sm text-gray-600">{profile.bio}</p>
                  </div>
                )}

                {skills && skills.length > 0 && (
                  <div className="mb-5">
                    <h2 className={style.sectionTitleClass}>
                      {templateKey === "minimal" ? "// Tech Stack" : templateKey === "creative" ? "Expertise" : "Skills"}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((s, i) => (
                        <span key={i} className={style.skillClass}>
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {education && education.length > 0 && (
                  <div className="mb-5">
                    <h2 className={style.sectionTitleClass}>
                      {templateKey === "minimal" ? "// Education" : "Education"}
                    </h2>
                    {education.map((e, i) => (
                      <div key={i} className="mb-3">
                        <div className="flex justify-between">
                          <span className="font-medium text-sm text-gray-900">{e.degree} {e.field_of_study && `in ${e.field_of_study}`}</span>
                          <span className="text-xs text-gray-500">
                            {e.start_date} – {e.end_date || "Present"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{e.institution}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                {projects && projects.length > 0 && (
                  <div className="mb-5">
                    <h2 className={style.sectionTitleClass}>
                      {templateKey === "minimal" ? "// Projects" : templateKey === "creative" ? "Selected Projects" : "Projects"}
                    </h2>
                    {projects.map((p, i) => (
                      <div key={i} className="mb-3">
                        <p className="font-medium text-sm text-gray-900">{p.title}</p>
                        {p.description && <p className="text-sm text-gray-500">{p.description}</p>}
                        {p.technologies?.length > 0 && (
                          <p className={`text-xs mt-1 ${style.accentColor}`}>
                            {p.technologies.join(templateKey === "minimal" ? ", " : " · ")}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {achievements && achievements.length > 0 && (
                  <div className="mb-5">
                    <h2 className={style.sectionTitleClass}>
                      {templateKey === "minimal" ? "// Achievements" : templateKey === "creative" ? "Honors & Awards" : "Achievements"}
                    </h2>
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
