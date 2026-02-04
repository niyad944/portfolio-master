import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  Shield, 
  FileText, 
  Sparkles, 
  FolderLock, 
  GraduationCap,
  ArrowRight,
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.25
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden noise-overlay">
      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/[0.06]"
      >
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-accent/90 flex items-center justify-center transition-all duration-500 group-hover:scale-105 group-hover:shadow-glow">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-accent-foreground" />
              </div>
              <span className="text-lg sm:text-xl font-display font-semibold text-foreground tracking-wide">ProFolioX</span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-4">
              <Link to="/login">
                <Button variant="ghost" className="font-medium text-sm sm:text-base px-3 sm:px-4 h-9 sm:h-10 text-foreground/70 hover:text-foreground hover:bg-white/[0.04]">
                  Log in
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-accent/90 hover:bg-accent text-accent-foreground font-medium text-sm sm:text-base px-4 sm:px-5 h-9 sm:h-10 btn-glow transition-all duration-500 hover:shadow-glow">
                  <span className="hidden sm:inline">Sign Up Free</span>
                  <span className="sm:hidden">Sign Up</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center hero-cinematic overflow-hidden pt-16 sm:pt-20 px-4">
        {/* Ethereal light effects */}
        <div className="absolute top-[15%] left-[20%] w-[500px] h-[500px] bg-accent/8 rounded-full blur-[150px] pointer-events-none animate-bloom" />
        <div className="absolute bottom-[20%] right-[15%] w-[400px] h-[400px] bg-plasma/6 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-[60%] left-[50%] w-[300px] h-[300px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container mx-auto px-0 sm:px-6 relative z-10">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2.5 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full glass-strong border border-accent/20 mb-8 sm:mb-10"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-xs sm:text-sm font-medium text-foreground/80 tracking-wide">AI-Powered Portfolio Platform</span>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-7xl font-display font-semibold text-foreground mb-5 sm:mb-7 leading-[1.1] tracking-tight"
            >
              Your Academic Journey,
              <span className="block lumina-text mt-2">Professionally Showcased</span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-base sm:text-xl text-muted-foreground mb-10 sm:mb-12 max-w-2xl mx-auto px-2 leading-relaxed"
            >
              Store certificates securely, showcase your achievements, and generate stunning resumes with AI. 
              The complete portfolio platform for ambitious students.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5"
            >
              <Link to="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 btn-glow min-h-[52px] shadow-glow transition-all duration-500 hover:shadow-bloom">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/10 text-foreground hover:bg-white/[0.04] hover:border-white/20 font-semibold text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 min-h-[52px] transition-all duration-500">
                  Log In
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div 
              variants={itemVariants}
              className="mt-16 sm:mt-20 grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-8 sm:gap-14"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="text-2xl sm:text-3xl font-display font-semibold lumina-text transition-all duration-500 group-hover:drop-shadow-[0_0_20px_hsl(195_80%_65%/0.4)]">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-mono uppercase tracking-widest mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-28 bg-background relative">
        {/* Subtle ambient light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-accent/3 rounded-full blur-[200px] pointer-events-none" />
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-14 sm:mb-20"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-foreground mb-4 sm:mb-5 tracking-tight">
              Everything You Need to
              <span className="text-gradient-primary"> Stand Out</span>
            </h2>
            <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
              A complete platform designed specifically for students to manage, showcase, and leverage their academic achievements.
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="feature-card group"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-5 sm:mb-7 transition-all duration-700 group-hover:bg-accent/15 group-hover:border-accent/35 group-hover:shadow-glow">
                  <feature.icon className="w-7 h-7 sm:w-8 sm:h-8 text-accent" />
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-semibold text-foreground mb-3 sm:mb-4 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 sm:py-28 bg-secondary/30 relative overflow-hidden">
        {/* Light bloom effects */}
        <div className="absolute top-0 right-[20%] w-[400px] h-[400px] bg-plasma/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-[10%] w-[350px] h-[350px] bg-accent/4 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-14 sm:mb-20"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-foreground mb-4 sm:mb-5 tracking-tight">
              Simple Steps to Success
            </h2>
            <p className="text-base sm:text-xl text-muted-foreground">
              Get your professional portfolio up and running in minutes
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid sm:grid-cols-3 gap-10 sm:gap-14"
            >
              {[
                { step: "01", title: "Create Account", desc: "Sign up securely with email verification" },
                { step: "02", title: "Add Your Data", desc: "Upload certificates, skills, and projects" },
                { step: "03", title: "Generate & Share", desc: "Create AI-powered resumes instantly" }
              ].map((item, index) => (
                <motion.div 
                  key={index} 
                  variants={itemVariants}
                  className="text-center relative group"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full lumina-border bg-background/80 backdrop-blur-xl flex items-center justify-center mx-auto mb-6 sm:mb-8 transition-all duration-700 group-hover:shadow-glow">
                    <span className="text-2xl sm:text-3xl font-mono font-semibold lumina-text">{item.step}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-display font-semibold text-foreground mb-3 tracking-tight">{item.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28 hero-cinematic relative overflow-hidden">
        {/* Ethereal ambient effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-accent/8 rounded-full blur-[180px] pointer-events-none" />
        <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-plasma/6 rounded-full blur-[120px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="container mx-auto px-4 sm:px-6 text-center relative z-10"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-foreground mb-5 sm:mb-7 tracking-tight">
            Ready to Showcase Your Potential?
          </h2>
          <p className="text-base sm:text-xl text-muted-foreground mb-10 sm:mb-12 max-w-2xl mx-auto">
            Join thousands of students who are already building their professional future with ProFolioX.
          </p>
          <Link to="/signup" className="inline-block">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-base sm:text-lg px-10 sm:px-12 py-6 sm:py-7 min-h-[52px] btn-glow shadow-glow animate-glow-pulse transition-all duration-500 hover:shadow-bloom">
              Start Building Your Portfolio
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary/40 border-t border-white/[0.05] py-10 sm:py-14">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-5 sm:gap-6 sm:flex-row">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-accent/90 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="text-lg font-display font-semibold text-foreground tracking-wide">ProFolioX</span>
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm text-center font-mono tracking-wide">
              © 2024 ProFolioX. Empowering students to showcase their potential.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;