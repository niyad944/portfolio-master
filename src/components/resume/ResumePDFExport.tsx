import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { printResume } from "./ResumePrint";
import ResumePreview from "./ResumePreview";


interface ResumeContent {
  profile: {
    full_name: string;
    bio: string;
    email: string;
    phone: string;
    location: string;
    linkedin_url: string;
    github_url: string;
    portfolio_url?: string;
    profile_photo_url?: string;
  };
  skills: Array<{ name: string; proficiency_level: string; category?: string }>;
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

  const generatePDF = useCallback(async () => {
    setExporting(true);
    try {
      await printResume(templateKey, content);
      onGenerated?.();
    } catch (error: any) {
      console.error("PDF export error:", error);
      alert(error?.message || "Failed to open the print dialog. Please try again.");
    } finally {
      setExporting(false);
    }
  }, [content, templateKey, onGenerated]);


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
          <ResumePreview content={content} templateKey={templateKey} />
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
        {exporting ? "Generating PDF..." : "Download as PDF"}
      </Button>
    </div>
  );
};

export default ResumePDFExport;
