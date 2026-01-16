import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { usePublicLogs, usePublicProfile } from "@/hooks/usePublicLogs";
import { StatsDashboard, StatsDashboardSkeleton } from "@/components/logs/StatsDashboard";
import { TrendChart, TrendChartSkeleton } from "@/components/analytics/TrendChart";
import { Loader2, Share2 } from "lucide-react";

export default function PublicRecords() {
    const { userId } = useParams();
    const { data: logs, isLoading: loadingLogs } = usePublicLogs(userId);
    const { data: profile, isLoading: loadingProfile } = usePublicProfile(userId);
    if (loadingLogs || loadingProfile) {
        return (
            <div className="min-h-screen gradient-warm flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading public records...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen gradient-warm flex items-center justify-center px-6 text-center">
                <div className="max-w-md">
                    <h2 className="text-2xl font-bold text-foreground mb-4">Profile Not Found</h2>
                    <p className="text-muted-foreground mb-8">
                        The profile you are looking for might be private or does not exist.
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold hover:shadow-elevated transition-all"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen gradient-warm">
            {/* Header */}
            <header className="px-6 pt-12 pb-8 text-center max-w-5xl mx-auto">
                <div className="w-20 h-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
                    <Share2 className="w-10 h-10" />
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                    {profile.display_name}'s Dashboard
                </h1>
                <p className="text-muted-foreground">Public health & habits tracking snapshot</p>
            </header>

            {/* Main Content */}
            <main className="px-6 pb-12 max-w-5xl mx-auto">
                <div className="space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <StatsDashboard logs={logs} />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <TrendChart logs={logs} />
                    </motion.div>
                </div>

                <div className="mt-12 p-8 rounded-3xl bg-card/30 border border-border/50 text-center backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Want to track your own progress?</h3>
                    <p className="text-muted-foreground mb-6">Join DAMit! to build daily accountability and visualize your health trends.</p>
                    <a
                        href="/auth"
                        className="inline-flex items-center justify-center px-6 py-3 rounded-xl gradient-primary text-white font-bold shadow-soft hover:shadow-card transition-all"
                    >
                        Get Started for Free
                    </a>
                </div>
            </main>
        </div>
    );
}
