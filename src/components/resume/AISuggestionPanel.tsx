import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Sparkles,
  Loader2,
  Check,
  RefreshCw,
  Lightbulb,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface Suggestion {
  text: string;
  highlight: string;
}

interface AISuggestionPanelProps {
  type: "summary" | "project" | "achievement" | "skill";
  resumeData: any;
  currentText?: string;
  onAccept: (text: string) => void;
}

const AISuggestionPanel = ({
  type,
  resumeData,
  currentText,
  onAccept
}: AISuggestionPanelProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [expanded, setExpanded] = useState(false);

  const typeLabels = {
    summary: "Professional Summary",
    project: "Project Description",
    achievement: "Achievements",
    skill: "Skills"
  };

  const fetchSuggestions = async () => {
    setLoading(true);
    setExpanded(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-resume-helper", {
        body: { type, data: resumeData, currentText }
      });

      if (error) throw error;

      if (data?.suggestions) {
        setSuggestions(data.suggestions);
      }
    } catch (error: any) {
      console.error("AI suggestion error:", error);
      toast({
        title: "Couldn't get suggestions",
        description: error.message || "Please try again in a moment",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = (text: string) => {
    onAccept(text);
    toast({
      title: "Suggestion applied! ✨",
      description: "Feel free to edit it further to match your style."
    });
  };

  return (
    <div className="border border-accent/20 rounded-xl bg-accent/5 overflow-hidden">
      <button
        onClick={() => suggestions.length > 0 ? setExpanded(!expanded) : fetchSuggestions()}
        className="w-full flex items-center justify-between p-4 hover:bg-accent/10 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-accent" />
          </div>
          <div className="text-left">
            <span className="text-sm font-medium text-foreground">
              AI {typeLabels[type]} Helper
            </span>
            <p className="text-xs text-muted-foreground">
              Get mentor-style suggestions to improve your content
            </p>
          </div>
        </div>
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin text-accent" />
        ) : suggestions.length > 0 ? (
          expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
        ) : (
          <Lightbulb className="w-4 h-4 text-accent" />
        )}
      </button>

      {expanded && (
        <div className="p-4 pt-0 space-y-3">
          {suggestions.length === 0 && !loading && (
            <div className="text-center py-4">
              <Button
                onClick={fetchSuggestions}
                variant="outline"
                size="sm"
                className="border-accent/30 hover:bg-accent/10"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Get AI Suggestions
              </Button>
            </div>
          )}

          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-4 bg-background rounded-lg border border-border hover:border-accent/50 transition-colors"
            >
              <p className="text-sm text-foreground mb-2">{suggestion.text}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Lightbulb className="w-3 h-3" />
                  {suggestion.highlight}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleAccept(suggestion.text)}
                  className="text-accent hover:text-accent hover:bg-accent/10"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Use this
                </Button>
              </div>
            </div>
          ))}

          {suggestions.length > 0 && (
            <div className="flex justify-center pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchSuggestions}
                disabled={loading}
                className="text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Generate new suggestions
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AISuggestionPanel;
