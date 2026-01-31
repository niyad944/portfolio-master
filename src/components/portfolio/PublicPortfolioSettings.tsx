import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Globe,
  Lock,
  Copy,
  Check,
  ExternalLink,
  Loader2,
  Eye,
  EyeOff
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VisibleSections {
  about: boolean;
  skills: boolean;
  education: boolean;
  achievements: boolean;
  projects: boolean;
  certificates: boolean;
}

interface PublicPortfolioSettingsProps {
  userId: string;
  onUpdate?: () => void;
}

const PublicPortfolioSettings = ({ userId, onUpdate }: PublicPortfolioSettingsProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const [isPublic, setIsPublic] = useState(false);
  const [publicSlug, setPublicSlug] = useState("");
  const [visibleSections, setVisibleSections] = useState<VisibleSections>({
    about: true,
    skills: true,
    education: true,
    achievements: true,
    projects: true,
    certificates: false
  });

  useEffect(() => {
    fetchSettings();
  }, [userId]);

  const fetchSettings = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("is_public, public_slug, visible_sections")
      .eq("user_id", userId)
      .single();

    if (data) {
      setIsPublic(data.is_public || false);
      setPublicSlug(data.public_slug || "");
      if (data.visible_sections && typeof data.visible_sections === "object") {
        const sections = data.visible_sections as Record<string, unknown>;
        setVisibleSections({
          about: Boolean(sections.about ?? true),
          skills: Boolean(sections.skills ?? true),
          education: Boolean(sections.education ?? true),
          achievements: Boolean(sections.achievements ?? true),
          projects: Boolean(sections.projects ?? true),
          certificates: Boolean(sections.certificates ?? false)
        });
      }
    }
    setLoading(false);
  };

  const generateSlug = () => {
    const random = Math.random().toString(36).substring(2, 8);
    setPublicSlug(`portfolio-${random}`);
  };

  const saveSettings = async () => {
    if (isPublic && !publicSlug.trim()) {
      toast({
        title: "URL Required",
        description: "Please set a public URL for your portfolio",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    const sectionsData: Record<string, boolean> = {
      about: visibleSections.about,
      skills: visibleSections.skills,
      education: visibleSections.education,
      achievements: visibleSections.achievements,
      projects: visibleSections.projects,
      certificates: visibleSections.certificates
    };
    
    const { error } = await supabase
      .from("profiles")
      .update({
        is_public: isPublic,
        public_slug: isPublic ? publicSlug.toLowerCase().replace(/[^a-z0-9-]/g, "-") : null,
        visible_sections: sectionsData
      })
      .eq("user_id", userId);

    if (error) {
      toast({
        title: "Error",
        description: error.message.includes("duplicate") 
          ? "This URL is already taken. Please choose another."
          : error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Settings Saved",
        description: isPublic 
          ? "Your portfolio is now public!"
          : "Your portfolio is now private."
      });
      onUpdate?.();
    }
    setSaving(false);
  };

  const copyLink = () => {
    const url = `${window.location.origin}/p/${publicSlug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Link copied!", description: "Share it with anyone" });
  };

  const sectionLabels: Record<keyof VisibleSections, string> = {
    about: "About Me & Bio",
    skills: "Skills",
    education: "Education",
    achievements: "Achievements",
    projects: "Projects",
    certificates: "Certificates"
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Visibility Toggle */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
        <div className="flex items-center gap-3">
          {isPublic ? (
            <Globe className="w-5 h-5 text-accent" />
          ) : (
            <Lock className="w-5 h-5 text-muted-foreground" />
          )}
          <div>
            <Label className="font-medium">Portfolio Visibility</Label>
            <p className="text-xs text-muted-foreground">
              {isPublic ? "Anyone with the link can view" : "Only you can see your portfolio"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={isPublic ? "default" : "secondary"} className={isPublic ? "bg-accent" : ""}>
            {isPublic ? "Public" : "Private"}
          </Badge>
          <Switch
            checked={isPublic}
            onCheckedChange={setIsPublic}
          />
        </div>
      </div>

      {/* Public URL */}
      {isPublic && (
        <div className="space-y-3">
          <Label>Your Public URL</Label>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center bg-secondary rounded-lg overflow-hidden">
              <span className="px-3 py-2 text-sm text-muted-foreground bg-secondary/80">
                {window.location.origin}/p/
              </span>
              <Input
                value={publicSlug}
                onChange={(e) => setPublicSlug(e.target.value)}
                placeholder="your-unique-url"
                className="border-0 bg-transparent focus-visible:ring-0"
              />
            </div>
            <Button variant="outline" onClick={generateSlug}>
              Generate
            </Button>
            {publicSlug && (
              <>
                <Button variant="outline" onClick={copyLink}>
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
                <Button variant="outline" asChild>
                  <a href={`/p/${publicSlug}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Section Visibility */}
      <div className="space-y-3">
        <Label>Visible Sections</Label>
        <p className="text-xs text-muted-foreground">
          Choose which sections to show on your public portfolio
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {(Object.keys(sectionLabels) as Array<keyof VisibleSections>).map((key) => (
            <div
              key={key}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                visibleSections[key] ? "border-accent/50 bg-accent/5" : "border-border"
              }`}
            >
              <div className="flex items-center gap-2">
                {visibleSections[key] ? (
                  <Eye className="w-4 h-4 text-accent" />
                ) : (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                )}
                <span className="text-sm font-medium">{sectionLabels[key]}</span>
              </div>
              <Switch
                checked={visibleSections[key]}
                onCheckedChange={(checked) =>
                  setVisibleSections({ ...visibleSections, [key]: checked })
                }
              />
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={saveSettings}
        disabled={saving}
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        Save Settings
      </Button>
    </div>
  );
};

export default PublicPortfolioSettings;
