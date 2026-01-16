import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Share2, Copy, Check, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserMenu } from "@/components/UserMenu";
import { NotificationSettings } from "@/components/NotificationSettings";
import { useAuthContext } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Profile() {
    const { user } = useAuthContext();
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        if (!user) return;

        const shareUrl = `${window.location.protocol}//${window.location.host}/p/${user.id}`;

        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            toast.success("Public link copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error("Failed to copy link");
        }
    };

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
            <main className="px-6 pb-8 space-y-6">
                <div className="p-8 rounded-3xl bg-card border border-border/50 shadow-soft backdrop-blur-sm relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                <Share2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">Share Your Dashboard</h3>
                        </div>

                        <p className="text-muted-foreground mb-8 max-w-md">
                            Copy your permanent public link to share your analytics and health trends with friends, coaches, or your community.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleShare}
                                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl gradient-primary text-white font-bold shadow-soft hover:shadow-card transition-all"
                            >
                                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                {copied ? "Link Copied!" : "Copy Public Link"}
                            </button>

                            <div className="flex items-center gap-2 px-4 py-2 text-xs text-muted-foreground bg-secondary/30 rounded-xl border border-border/30">
                                <Globe className="w-3 h-3" />
                                <span>This link is permanent and works anytime</span>
                            </div>
                        </div>
                    </div>

                    <div className="absolute -bottom-12 -right-12 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Share2 className="w-48 h-48 text-primary" />
                    </div>
                </div>

                <NotificationSettings />
            </main>
        </div>
    );
}
