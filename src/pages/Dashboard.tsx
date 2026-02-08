import { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  User,
  FolderLock,
  Briefcase,
  FileText,
  Activity,
  LogOut,
  Menu,
  X,
  ChevronRight,
  LayoutDashboard
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import SecurityAlert from "@/components/security/SecurityAlert";
import { checkSuspiciousActivity, logActivity } from "@/hooks/useActivityLogger";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import FloatingOrbs from "@/components/effects/FloatingOrbs";

const Dashboard = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [securityAlert, setSecurityAlert] = useState<{
    type: "new_device" | "suspicious";
    message?: string;
  } | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const checkSecurityAndSetUser = async (currentUser: SupabaseUser) => {
      setUser(currentUser);
      
      const securityCheck = await checkSuspiciousActivity(currentUser.id);
      
      if (securityCheck.newDevice) {
        setSecurityAlert({
          type: "new_device"
        });
        await logActivity(currentUser.id, "new_device_login");
      } else if (securityCheck.isSuspicious) {
        setSecurityAlert({
          type: "suspicious",
          message: securityCheck.reason
        });
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        checkSecurityAndSetUser(session.user);
      } else {
        navigate("/login");
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        checkSecurityAndSetUser(session.user);
      } else {
        navigate("/login");
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    if (user) {
      await logActivity(user.id, "logout");
    }
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
    navigate("/");
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
    { icon: User, label: "About Me", path: "/dashboard/about" },
    { icon: FolderLock, label: "Certificates", path: "/dashboard/certificates" },
    { icon: Briefcase, label: "Projects", path: "/dashboard/projects" },
    { icon: FileText, label: "Resume Generator", path: "/dashboard/resume" },
    { icon: Activity, label: "Activity Log", path: "/dashboard/activity" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full bg-background overflow-x-hidden noise-overlay">
      {/* Ambient background effects with floating orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <FloatingOrbs variant="subtle" />
        <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-accent/4 rounded-full blur-[150px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[350px] h-[350px] bg-plasma/3 rounded-full blur-[130px]" />
      </div>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 264 : 80 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col glass-strong border-r border-white/[0.06] ${
          !sidebarOpen && "max-lg:w-0 max-lg:overflow-hidden"
        }`}
      >
        {/* Logo */}
        <div className={`flex items-center justify-between p-5 border-b border-white/[0.06] ${!sidebarOpen && "lg:justify-center"}`}>
          <motion.div 
            initial={false}
            animate={{ opacity: sidebarOpen ? 1 : 0 }}
            className={`flex items-center gap-3 ${!sidebarOpen && "lg:hidden"}`}
          >
            <div className="w-10 h-10 rounded-xl bg-accent/90 flex items-center justify-center shrink-0 shadow-glow">
              <GraduationCap className="w-6 h-6 text-accent-foreground" />
            </div>
            <span className="text-lg font-display font-semibold text-sidebar-foreground tracking-wide">ProFolioX</span>
          </motion.div>
          
          {/* Collapsed logo */}
          {!sidebarOpen && (
            <div className="hidden lg:flex w-10 h-10 rounded-xl bg-accent/90 items-center justify-center shadow-glow">
              <GraduationCap className="w-6 h-6 text-accent-foreground" />
            </div>
          )}
          
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex w-8 h-8 items-center justify-center rounded-lg hover:bg-white/[0.06] transition-all duration-300"
          >
            <ChevronRight className={`w-5 h-5 text-sidebar-foreground transition-transform duration-400 ${sidebarOpen ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 py-5 sm:py-6 px-3 sm:px-4 space-y-1.5 sm:space-y-2 overflow-y-auto custom-scrollbar ${!sidebarOpen && "max-lg:hidden"}`}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              className="sidebar-item text-sidebar-foreground min-h-[48px]"
              activeClassName="active"
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setSidebarOpen(false);
                }
              }}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.25 }}
                    className="font-medium text-sm sm:text-base whitespace-nowrap overflow-hidden tracking-wide"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className={`p-4 border-t border-white/[0.06] ${!sidebarOpen && "max-lg:hidden"}`}>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 mb-4"
              >
                <div className="w-11 h-11 rounded-full bg-accent/15 border border-accent/25 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    {user?.user_metadata?.full_name || "User"}
                  </p>
                  <p className="text-xs text-sidebar-foreground/50 truncate font-mono">
                    {user?.email}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={`w-full justify-start text-sidebar-foreground hover:bg-white/[0.06] hover:text-accent min-h-[48px] transition-all duration-400 ${
              !sidebarOpen && "lg:justify-center lg:px-2"
            }`}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="ml-3 whitespace-nowrap overflow-hidden"
                >
                  Log out
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </motion.aside>

      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] w-12 h-12 rounded-xl bg-accent/90 text-accent-foreground flex items-center justify-center shadow-glow"
        aria-label={sidebarOpen ? "Close menu" : "Open menu"}
      >
        <AnimatePresence mode="wait">
          {sidebarOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <X className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Menu className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed inset-0 bg-background/70 backdrop-blur-md z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 min-h-screen overflow-x-hidden pt-16 lg:pt-0 relative z-10">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Outlet context={{ user }} />
        </motion.div>
      </main>

      {/* Security Alert */}
      {securityAlert && (
        <SecurityAlert
          type={securityAlert.type}
          message={securityAlert.message}
          onDismiss={() => setSecurityAlert(null)}
          onConfirm={() => setSecurityAlert(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
