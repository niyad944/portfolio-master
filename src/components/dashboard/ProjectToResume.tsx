import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Copy, Check, Edit2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

interface ResumeEntry {
  projectTitle: string;
  bullets: string[];
}

interface ProjectToResumeProps {
  projects: any[];
  onEntriesGenerated?: (entries: ResumeEntry[]) => void;
}

const ProjectToResume = ({ projects, onEntriesGenerated }: ProjectToResumeProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState<ResumeEntry[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateEntries = async () => {
    if (projects.length === 0) {
      toast({ title: "No Projects", description: "Add some projects first to generate resume entries.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("portfolio-ai", {
        body: {
          type: "project-to-resume",
          projects: projects.map(p => ({
            title: p.title,
            description: p.description,
            technologies: p.technologies,
            start_date: p.start_date,
            end_date: p.end_date,
            project_url: p.project_url,
            github_url: p.github_url,
          })),
        },
      });

      if (error) throw error;
      if (data?.entries) {
        setEntries(data.entries);
        onEntriesGenerated?.(data.entries);
        toast({ title: "Resume Entries Generated!", description: `${data.entries.length} project entries created.` });
      }
    } catch (err: any) {
      toast({ title: "Generation Failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const copyEntry = (index: number) => {
    const entry = entries[index];
    const text = `${entry.projectTitle}\n${entry.bullets.map(b => `• ${b}`).join("\n")}`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    toast({ title: "Copied to clipboard!" });
  };

  const startEdit = (index: number, bulletIndex: number) => {
    setEditingIndex(index * 100 + bulletIndex);
    setEditText(entries[index].bullets[bulletIndex]);
  };

  const saveEdit = (entryIndex: number, bulletIndex: number) => {
    const updated = [...entries];
    updated[entryIndex].bullets[bulletIndex] = editText;
    setEntries(updated);
    setEditingIndex(null);
    onEntriesGenerated?.(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Portfolio → Resume</h3>
          <p className="text-sm text-muted-foreground">
            Auto-generate professional resume bullet points from your projects
          </p>
        </div>
        <Button
          onClick={generateEntries}
          disabled={loading || projects.length === 0}
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
          {loading ? "Generating..." : "Generate"}
        </Button>
      </div>

      {entries.length > 0 && (
        <div className="space-y-4">
          {entries.map((entry, i) => (
            <div key={i} className="p-4 rounded-xl border border-border bg-secondary/30">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-foreground">{entry.projectTitle}</h4>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyEntry(i)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {copiedIndex === i ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <ul className="space-y-2">
                {entry.bullets.map((bullet, j) => (
                  <li key={j} className="flex items-start gap-2 group">
                    <span className="text-accent mt-1">•</span>
                    {editingIndex === i * 100 + j ? (
                      <div className="flex-1 space-y-2">
                        <Textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="min-h-[60px] text-sm"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => saveEdit(i, j)} className="bg-accent hover:bg-accent/90 text-accent-foreground">Save</Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditingIndex(null)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground flex-1">
                        {bullet}
                        <button
                          onClick={() => startEdit(i, j)}
                          className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Edit2 className="w-3 h-3 text-muted-foreground hover:text-foreground inline" />
                        </button>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {projects.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          Add projects to your portfolio first to generate resume entries.
        </p>
      )}
    </div>
  );
};

export default ProjectToResume;
