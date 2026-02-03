import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { GraduationCap, Mail, Lock, User, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        toast({
          title: "Signup Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Account Created!",
          description: "Welcome to ProFolioX. Let's build your portfolio!",
        });
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    "Secure document storage",
    "AI-powered resume generation",
    "Professional project showcase",
    "Activity monitoring & security"
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background noise-overlay">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex flex-1 hero-cinematic items-center justify-center p-12 relative overflow-hidden">
        {/* Ambient effects */}
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-accent/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-56 h-56 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="max-w-lg relative z-10"
        >
          <div className="w-24 h-24 rounded-2xl gold-border bg-background/50 backdrop-blur-sm flex items-center justify-center mb-8">
            <GraduationCap className="w-12 h-12 text-accent" />
          </div>
          <h2 className="text-3xl font-display font-semibold text-foreground mb-4">
            Start Your Professional Journey
          </h2>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            Join thousands of students showcasing their achievements and landing opportunities.
          </p>
          <ul className="space-y-4">
            {benefits.map((benefit, index) => (
              <motion.li 
                key={index} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                className="flex items-center gap-3 text-foreground/80"
              >
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                </div>
                <span>{benefit}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Right Side - Form */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex items-center justify-center px-4 sm:px-8 py-8 sm:py-12"
      >
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          <motion.div variants={itemVariants}>
            <Link to="/" className="flex items-center gap-2 mb-8 sm:mb-12 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-accent flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-accent-foreground" />
              </div>
              <span className="text-lg sm:text-xl font-display font-semibold text-foreground">ProFolioX</span>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-display font-semibold text-foreground mb-2">Create your account</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Get started with your professional portfolio in minutes
            </p>
          </motion.div>

          <motion.form 
            variants={containerVariants}
            onSubmit={handleSignup} 
            className="space-y-5 sm:space-y-6"
          >
            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="fullName" className="text-foreground font-medium text-sm sm:text-base">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10 h-11 sm:h-12 input-focus text-base bg-secondary/50 border-white/10 focus:border-accent/50"
                  required
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium text-sm sm:text-base">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 sm:h-12 input-focus text-base bg-secondary/50 border-white/10 focus:border-accent/50"
                  required
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium text-sm sm:text-base">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 sm:h-12 input-focus text-base bg-secondary/50 border-white/10 focus:border-accent/50"
                  required
                  minLength={6}
                />
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                Must be at least 6 characters
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                className="w-full h-11 sm:h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-base min-h-[44px] btn-glow shadow-glow"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </motion.div>
          </motion.form>

          <motion.p 
            variants={itemVariants}
            className="mt-6 sm:mt-8 text-center text-sm sm:text-base text-muted-foreground"
          >
            Already have an account?{" "}
            <Link to="/login" className="text-accent font-medium hover:underline transition-colors">
              Log in
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;
