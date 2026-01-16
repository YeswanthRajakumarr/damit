import { useDailyLogs } from "@/hooks/useDailyLogs";
import { useLogStats } from "@/hooks/useLogStats";
import { StatsDashboard, StatsDashboardSkeleton } from "@/components/logs/StatsDashboard";
import { TrendChart, TrendChartSkeleton } from "@/components/analytics/TrendChart";
import { motion } from "framer-motion";
import { TrendingUp, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Analytics = () => {
    const { data, isLoading: loadingLogs } = useDailyLogs();
    const logs = data?.logs;
    const stats = useLogStats(logs);

    return (
        <div className="min-h-screen gradient-warm px-6 pt-8 pb-12 safe-bottom">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link
                            to="/"
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

                <div className="space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {loadingLogs ? <StatsDashboardSkeleton /> : <StatsDashboard logs={logs} />}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        {loadingLogs ? <TrendChartSkeleton /> : <TrendChart logs={logs} />}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
