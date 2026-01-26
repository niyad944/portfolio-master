import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Activity,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Clock,
  Monitor,
  MapPin
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface DashboardContext {
  user: SupabaseUser;
}

interface ActivityLog {
  id: string;
  action: string;
  ip_address: string | null;
  user_agent: string | null;
  metadata: any;
  is_suspicious: boolean;
  created_at: string;
}

const ActivityLog = () => {
  const { user } = useOutletContext<DashboardContext>();
  const { toast } = useToast();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
    logActivity("viewed_activity_log");
  }, [user.id]);

  const fetchLogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("activity_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (data) setLogs(data);
    setLoading(false);
  };

  const logActivity = async (action: string, metadata?: any) => {
    await supabase.from("activity_logs").insert({
      user_id: user.id,
      action,
      user_agent: navigator.userAgent,
      metadata
    });
  };

  const getActionIcon = (action: string, isSuspicious: boolean) => {
    if (isSuspicious) return AlertTriangle;
    switch (action) {
      case "login":
      case "signup":
        return Shield;
      case "viewed_activity_log":
        return Activity;
      default:
        return CheckCircle2;
    }
  };

  const getActionLabel = (action: string) => {
    const labels: { [key: string]: string } = {
      login: "Logged in",
      logout: "Logged out",
      signup: "Account created",
      viewed_activity_log: "Viewed activity log",
      profile_updated: "Profile updated",
      certificate_uploaded: "Certificate uploaded",
      certificate_deleted: "Certificate deleted",
      project_added: "Project added",
      project_updated: "Project updated",
      project_deleted: "Project deleted",
      resume_generated: "Resume generated"
    };
    return labels[action] || action.replace(/_/g, " ");
  };

  const formatTime = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days < 7) return `${days} days ago`;
    return d.toLocaleDateString();
  };

  const suspiciousCount = logs.filter(l => l.is_suspicious).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Activity Log</h1>
          <p className="text-muted-foreground">
            Monitor your account activity and security events
          </p>
        </div>
        <Button variant="outline" onClick={fetchLogs}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Security Overview */}
      <div className="grid sm:grid-cols-3 gap-6 mb-10">
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-accent" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Security Status</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {suspiciousCount === 0 ? "Secure" : "Review Needed"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {suspiciousCount === 0 ? "No suspicious activity" : `${suspiciousCount} suspicious event(s)`}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Total Events</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{logs.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Last 50 activities</p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-500" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Last Activity</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {logs.length > 0 ? formatTime(logs[0].created_at) : "N/A"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {logs.length > 0 ? getActionLabel(logs[0].action) : "No activity yet"}
          </p>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="glass-card rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-foreground mb-6">Recent Activity</h2>

        {logs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No Activity Yet</h3>
            <p className="text-muted-foreground">
              Your activity will be logged here as you use the platform
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log, index) => {
              const Icon = getActionIcon(log.action, log.is_suspicious);
              return (
                <div
                  key={log.id}
                  className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${
                    log.is_suspicious
                      ? "border-destructive/50 bg-destructive/5"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    log.is_suspicious ? "bg-destructive/10" : "bg-accent/10"
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      log.is_suspicious ? "text-destructive" : "text-accent"
                    }`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground">
                        {getActionLabel(log.action)}
                      </span>
                      {log.is_suspicious && (
                        <Badge variant="destructive" className="text-xs">
                          Suspicious
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(log.created_at)}
                      </span>
                      {log.user_agent && (
                        <span className="flex items-center gap-1">
                          <Monitor className="w-3 h-3" />
                          {log.user_agent.includes("Mobile") ? "Mobile" : "Desktop"}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="text-xs text-muted-foreground shrink-0">
                    {new Date(log.created_at).toLocaleDateString()}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLog;
