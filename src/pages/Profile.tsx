import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserMenu } from "@/components/UserMenu";
import { ShareManagement } from "@/components/ShareManagement";

export default function Profile() {
    return (
        <div className="min-h-screen gradient-warm">
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-6 pt-8 pb-4"
            >
                <div className="flex items-center justify-between mb-6">
                    <Link
                        to="/"
                        className="flex items-center gap-2 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="hidden sm:inline">Back</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <img src="/favicon.png" alt="Logo" className="w-10 h-10 rounded-xl" />
                        <h1 className="text-xl font-bold text-foreground">DAMit!</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <UserMenu />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-foreground px-2 mb-6">Profile</h2>
            </motion.header>

            {/* Main Content */}
            <main className="px-6 pb-8 space-y-6 max-w-2xl mx-auto">
                <ShareManagement />

                <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50 shadow-soft">
                    <p className="text-muted-foreground">Your profile settings and other privacy options will appear here.</p>
                </div>
            </main>
        </div>
    );
}
