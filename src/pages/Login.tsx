import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { GraduationCap, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { logActivity } from "@/hooks/useActivityLogger";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (data.user) {
        // Log successful login
        await logActivity(data.user.id, "login");
        
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
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
      {/* Left Side - Form */}
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
            <h1 className="text-2xl sm:text-3xl font-display font-semibold text-foreground mb-2">Welcome back</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Enter your credentials to access your portfolio
            </p>
          </motion.div>

          <motion.form 
            variants={containerVariants}
            onSubmit={handleLogin} 
            className="space-y-5 sm:space-y-6"
          >
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 sm:h-12 input-focus text-base bg-secondary/50 border-white/10 focus:border-accent/50"
                  required
                />
              </div>
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
                    Log In
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
            Don't have an account?{" "}
            <Link to="/signup" className="text-accent font-medium hover:underline transition-colors">
              Sign up for free
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-1 hero-cinematic items-center justify-center p-12 relative overflow-hidden">
        {/* Ambient effects */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-accent/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-accent/10 rounded-full blur-[80px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="max-w-lg text-center relative z-10"
        >
          <div className="w-24 h-24 rounded-2xl gold-border bg-background/50 backdrop-blur-sm flex items-center justify-center mx-auto mb-8">
            <GraduationCap className="w-12 h-12 text-accent" />
          </div>
          <h2 className="text-3xl font-display font-semibold text-foreground mb-4">
            Your Professional Portfolio Awaits
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Access your secure document locker, manage your projects, and generate AI-powered resumes.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
