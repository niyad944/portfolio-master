import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  FileText, 
  Sparkles, 
  FolderLock, 
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  User,
  Briefcase
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: FolderLock,
      title: "Secure Document Locker",
      description: "Store and protect your academic certificates, degrees, and credentials with enterprise-grade security."
    },
    {
      icon: Sparkles,
      title: "AI Resume Generator",
      description: "Generate professional resumes instantly using AI-powered templates from your stored data."
    },
    {
      icon: Shield,
      title: "Security Monitoring",
      description: "AI-powered suspicious activity detection keeps your sensitive information protected."
    },
    {
      icon: Briefcase,
      title: "Project Showcase",
      description: "Display your academic projects and achievements in an elegant, professional portfolio."
    },
    {
      icon: User,
      title: "Personal Branding",
      description: "Create a compelling 'About Me' section that highlights your skills and accomplishments."
    },
    {
      icon: FileText,
      title: "Smart Organization",
      description: "Categorize and manage all your documents with intelligent tagging and search."
    }
  ];

  const stats = [
    { value: "100%", label: "Secure Storage" },
    { value: "AI", label: "Powered Resumes" },
    { value: "24/7", label: "Access Anywhere" },
    { value: "Free", label: "To Get Started" }
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-foreground">ProFolioX</span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-4">
              <Link to="/login">
                <Button variant="ghost" className="font-medium text-sm sm:text-base px-3 sm:px-4 h-9 sm:h-10">
                  Log in
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium text-sm sm:text-base px-3 sm:px-4 h-9 sm:h-10">
                  <span className="hidden sm:inline">Sign Up Free</span>
                  <span className="sm:hidden">Sign Up</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center hero-gradient hero-pattern overflow-hidden pt-16 sm:pt-20 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
        
        <div className="container mx-auto px-0 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center stagger-children">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full glass mb-6 sm:mb-8">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-xs sm:text-sm font-medium text-primary-foreground/90">AI-Powered Portfolio Platform</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-primary-foreground mb-4 sm:mb-6 leading-tight">
              Your Academic Journey,
              <span className="block text-gradient">Professionally Showcased</span>
            </h1>
            
            <p className="text-base sm:text-xl text-primary-foreground/70 mb-8 sm:mb-10 max-w-2xl mx-auto px-2">
              Store certificates securely, showcase your achievements, and generate stunning resumes with AI. 
              The complete portfolio platform for ambitious students.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 btn-glow min-h-[48px]">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 min-h-[48px]">
                  Log In
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 sm:mt-16 grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-4 sm:gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-accent">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-primary-foreground/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16 animate-fade-up">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
              Everything You Need to
              <span className="text-gradient-primary"> Stand Out</span>
            </h2>
            <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
              A complete platform designed specifically for students to manage, showcase, and leverage their academic achievements.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 stagger-children">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card glass-card rounded-xl sm:rounded-2xl p-5 sm:p-8 group"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-accent" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
              Simple Steps to Success
            </h2>
            <p className="text-base sm:text-xl text-muted-foreground">
              Get your professional portfolio up and running in minutes
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
              {[
                { step: "01", title: "Create Account", desc: "Sign up securely with email verification" },
                { step: "02", title: "Add Your Data", desc: "Upload certificates, skills, and projects" },
                { step: "03", title: "Generate & Share", desc: "Create AI-powered resumes instantly" }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <span className="text-xl sm:text-2xl font-bold text-primary-foreground">{item.step}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 hero-gradient">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4 sm:mb-6">
            Ready to Showcase Your Potential?
          </h2>
          <p className="text-base sm:text-xl text-primary-foreground/70 mb-8 sm:mb-10 max-w-2xl mx-auto">
            Join thousands of students who are already building their professional future with ProFolioX.
          </p>
          <Link to="/signup" className="inline-block">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-base sm:text-lg px-6 sm:px-10 py-5 sm:py-6 min-h-[48px]">
              Start Building Your Portfolio
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="text-lg font-bold text-primary-foreground">ProFolioX</span>
            </div>
            <p className="text-primary-foreground/60 text-xs sm:text-sm text-center">
              © 2024 ProFolioX. Empowering students to showcase their potential.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
