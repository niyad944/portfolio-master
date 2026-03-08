import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Target, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface CareerRole {
  title: string;
  reason: string;
  matchingSkills: string[];
  matchScore: number;
}

interface CareerSuggestionsProps {
  skills: { name: string; proficiency_level: string }[];
  projects: any[];
  bio?: string;
}

const CareerSuggestions = ({ skills, projects, bio }: CareerSuggestionsProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<CareerRole[]>([]);

  const fetchSuggestions = async () => {
    if (skills.length === 0 && projects.length === 0) {
      toast({ title: "Not Enough Data", description: "Add skills or projects first.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("portfolio-ai", {
        body: {
          type: "career-suggestions",
          skills: skills.map(s => ({ name: s.name, level: s.proficiency_level })),
          projects: projects.map(p => ({
            title: p.title,
            description: p.description,
            technologies: p.technologies,
          })),
          resumeData: bio || "",
        },
      });

      if (error) throw error;
      if (data?.roles) {
        setRoles(data.roles.sort((a: CareerRole, b: CareerRole) => b.matchScore - a.matchScore));
        toast({ title: "Career Suggestions Ready!" });
      }
    } catch (err: any) {
      toast({ title: "Failed to get suggestions", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Career Recommendations</h3>
          <p className="text-sm text-muted-foreground">
            AI-powered career paths based on your skills and projects
          </p>
        </div>
        <Button
          onClick={fetchSuggestions}
          disabled={loading}
          variant={roles.length > 0 ? "outline" : "default"}
          className={roles.length > 0 ? "" : "bg-accent hover:bg-accent/90 text-accent-foreground"}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : roles.length > 0 ? (
            <RefreshCw className="w-4 h-4 mr-2" />
          ) : (
            <Target className="w-4 h-4 mr-2" />
          )}
          {loading ? "Analyzing..." : roles.length > 0 ? "Refresh" : "Get Suggestions"}
        </Button>
      </div>

      {roles.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4">
          {roles.map((role, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-foreground">{role.title}</h4>
                <span className="text-xs font-mono text-accent">{role.matchScore}%</span>
              </div>
              <Progress value={role.matchScore} className="h-1.5 mb-3" />
              <p className="text-sm text-muted-foreground mb-3">{role.reason}</p>
              <div className="flex flex-wrap gap-1.5">
                {role.matchingSkills.map((skill, j) => (
                  <Badge key={j} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {roles.length === 0 && !loading && (
        <p className="text-sm text-muted-foreground text-center py-4">
          Click "Get Suggestions" to discover career paths that match your profile.
        </p>
      )}
    </div>
  );
};

export default CareerSuggestions;
