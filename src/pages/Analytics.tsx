import { useDailyLogs } from "@/hooks/useDailyLogs";
import { useLogStats } from "@/hooks/useLogStats";
import { StatsDashboard, StatsDashboardSkeleton } from "@/components/logs/StatsDashboard";
import { TrendChart, TrendChartSkeleton } from "@/components/analytics/TrendChart";
import { motion } from "framer-motion";
import { ArrowLeft, BarChart3, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Analytics = () => {
    const { data, isLoading: loadingLogs } = useDailyLogs();
    const logs = data?.logs || [];
    const stats = useLogStats(logs);
    const hasLogs = logs.length > 0;

    return (
        <div className="min-h-screen gradient-warm px-6 pt-8 pb-12 safe-bottom">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link
                            to="/app"
                            className="p-2 rounded-xl bg-secondary/80 text-secondary-foreground hover:bg-secondary transition-all border border-border/50"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
                            <p className="text-sm text-muted-foreground">Your progress over time</p>
                        </div>
                    </div>
                </header>

                {loadingLogs ? (
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <StatsDashboardSkeleton />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <TrendChartSkeleton />
                        </motion.div>
                    </div>
                ) : !hasLogs ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center min-h-[60vh]"
                    >
                        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-soft max-w-md w-full">
                            <CardContent className="flex flex-col items-center justify-center text-center p-8 sm:p-12">
                                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                                    <BarChart3 className="w-10 h-10 text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold text-foreground mb-2">
                                    No Data Yet
                                </h2>
                                <p className="text-muted-foreground mb-6 max-w-sm">
                                    Start tracking your daily progress to see analytics, trends, and insights.
                                    Fill out your first daily log to get started!
                                </p>
                                <Button asChild size="lg" className="gap-2">
                                    <Link to="/app">
                                        <Plus className="w-4 h-4" />
                                        Fill Your First Log
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
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
                )}
            </div>
        </div>
    );
};

export default Analytics;
