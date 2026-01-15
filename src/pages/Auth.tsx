import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    signIn,
    signUp
  } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const {
          error
        } = await signIn(email, password);
        if (error) throw error;
        toast.success("Welcome back!");
        navigate("/");
      } else {
        const {
          error
        } = await signUp(email, password, displayName);
        if (error) throw error;
        toast.success("Account created! Welcome!");
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-screen gradient-warm flex flex-col items-center justify-center px-6 relative">
    {/* Theme Toggle */}
    <div className="absolute top-4 right-4">
      <ThemeToggle />
    </div>

    <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} className="w-full max-w-sm">
      {/* Logo */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <img src="/favicon.png" alt="DAMit! Logo" className="w-14 h-14 rounded-2xl shadow-soft" />
        <h1 className="text-2xl font-bold text-foreground">DAMit!</h1>
      </div>

      {/* Card */}
      <div className="bg-card rounded-2xl p-6 shadow-card gradient-card">
        <h2 className="text-xl font-semibold text-center mb-6 text-foreground">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input type="text" placeholder="Display Name" value={displayName} onChange={e => setDisplayName(e.target.value)} maxLength={100} className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary text-foreground 
                             placeholder:text-muted-foreground border-0 focus:ring-2 
                             focus:ring-primary/50 outline-none transition-all" />
          </div>}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary text-foreground 
                           placeholder:text-muted-foreground border-0 focus:ring-2 
                           focus:ring-primary/50 outline-none transition-all" />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className="w-full pl-10 pr-12 py-3 rounded-xl bg-secondary text-foreground 
                           placeholder:text-muted-foreground border-0 focus:ring-2 
                           focus:ring-primary/50 outline-none transition-all" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 rounded-xl gradient-primary text-primary-foreground 
                         font-medium shadow-soft hover:shadow-card transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>

      <div className="text-center mt-6 space-y-1">

        <p className="text-xs text-muted-foreground">
          Built with ♥️ by Yeswanth Rajakumar
        </p>
      </div>
    </motion.div>
  </div>;
}