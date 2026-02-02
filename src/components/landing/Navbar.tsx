import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuthContext } from "@/contexts/AuthContext";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <img src="/favicon.png" alt="DAMit Logo" className="w-8 h-8 rounded-lg" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              DAMit!
            </span>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {useAuthContext().user ? (
              <Link to="/app">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" className="hidden sm:inline-flex">
                    Log In
                  </Button>
                </Link>
                <Link to="/auth?mode=signup">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
