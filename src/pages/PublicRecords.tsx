import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { usePublicLogs, usePublicProfile } from "@/hooks/usePublicLogs";
import { StatsDashboard } from "@/components/logs/StatsDashboard";
import { TrendChart } from "@/components/analytics/TrendChart";
import { PublicLogsTable } from "@/components/logs/PublicLogsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Share2, BarChart3, Table2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function PublicRecords() {
    const { userId } = useParams();

    // Validate userId format (UUID)
    const isValidUUID = userId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);

    const { data: logs, isLoading: loadingLogs, error: logsError } = usePublicLogs(isValidUUID ? userId : undefined);
    const { data: profile, isLoading: loadingProfile, error: profileError } = usePublicProfile(isValidUUID ? userId : undefined);

    // If userId is invalid format, show error immediately
    if (userId && !isValidUUID) {
        return (
            <div className="min-h-screen gradient-warm flex items-center justify-center px-6 text-center">
                <div className="max-w-md">
                    <h2 className="text-2xl font-bold text-foreground mb-4">Invalid Profile Link</h2>
                    <p className="text-muted-foreground mb-8">
                        The profile link you're trying to access is not valid.
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

    // Handle errors
    if (profileError || logsError) {
        return (
            <div className="min-h-screen gradient-warm flex items-center justify-center px-6 text-center">
                <div className="max-w-md">
                    <h2 className="text-2xl font-bold text-foreground mb-4">Error Loading Profile</h2>
                    <p className="text-muted-foreground mb-8">
                        {profileError?.message || logsError?.message || "Unable to load this profile. Please try again later."}
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
                <div className="flex justify-center mb-6">
                    <Avatar className="h-24 w-24 border-4 border-background shadow-soft">
                        <AvatarImage src={profile.avatar_url || ""} className="object-cover" />
                        <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                            {profile.emoji || profile.display_name?.[0].toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                    {profile.display_name}'s Dashboard
                </h1>
                <p className="text-muted-foreground">Public health & habits tracking snapshot</p>
            </header>

            {/* Main Content */}
            <main className="px-6 pb-12 max-w-5xl mx-auto">
                <Tabs defaultValue="analytics" className="w-full">
                    <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
                        <TabsTrigger value="analytics" className="flex items-center gap-2">
                            <BarChart3 className="w-4 h-4" />
                            Analytics
                        </TabsTrigger>
                        <TabsTrigger value="logs" className="flex items-center gap-2">
                            <Table2 className="w-4 h-4" />
                            Logs
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="analytics" className="space-y-4 mt-0">
                        {logs && logs.length > 0 ? (
                            <>
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
                            </>
                        ) : (
                            <div className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-border/50 text-center">
                                <p className="text-muted-foreground">No analytics data available yet.</p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="logs" className="mt-0">
                        <div className="space-y-4">
                            {/* Legend */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-wrap justify-center gap-4 text-sm"
                            >
                                <span className="flex items-center gap-1">
                                    <span className="text-primary font-bold">✓</span> Excellent/Nill
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="text-success font-bold">½</span> Good/Low
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="text-warning font-bold">○</span> Fair/High
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="text-destructive font-bold">✗</span> Poor/Very High
                                </span>
                            </motion.div>

                            {logs && logs.length > 0 ? (
                                <PublicLogsTable logs={logs} />
                            ) : (
                                <div className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-border/50 text-center">
                                    <p className="text-muted-foreground">No logs available yet.</p>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="mt-12 p-8 rounded-3xl bg-card/30 border border-border/50 text-center backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Want to track your own progress?</h3>
                    <p className="text-muted-foreground mb-6">Join DAMit! to build daily accountability and visualize your health trends, Share your dashboard with friends, coaches, or your community.</p>
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
