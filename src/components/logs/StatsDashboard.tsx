import { useLogStats } from "@/hooks/useLogStats";
import { motion } from "framer-motion";
import { DailyLog } from "@/hooks/useDailyLogs";
import { TrendingUp, Activity, Heart, Moon } from "lucide-react";
import { TimeRange } from "@/components/analytics/TrendChart";

interface StatsDashboardProps {
    logs: DailyLog[] | undefined;
    timeRange: TimeRange;
    customRange?: { from: Date; to: Date | undefined };
}

import { Skeleton } from "@/components/ui/skeleton";

export const StatsDashboardSkeleton = () => {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-card/80 backdrop-blur-sm p-3 rounded-2xl border border-border/50 shadow-soft">
                    <div className="flex items-center gap-3 mb-2">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-8 w-16" />
                </div>
            ))}
        </div>
    );
};

export const StatsDashboard = ({ logs, timeRange, customRange }: StatsDashboardProps) => {
    const stats = useLogStats(logs, timeRange, customRange);

    const renderEmptyValue = (label: string) => (
        <div className="flex flex-col animate-pulse">
            <span className="text-2xl font-bold text-muted-foreground/30">--</span>
            <span className="text-[10px] text-muted-foreground/50 italic">
                {timeRange === 'Custom' && (!customRange?.from || !customRange?.to)
                    ? "Select range"
                    : "No data"}
            </span>
        </div>
    );

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-card/80 backdrop-blur-sm p-3 rounded-2xl border border-border/50 shadow-soft"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <TrendingUp className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">Diet Score</span>
                </div>
                <div className="flex items-baseline gap-2">
                    {stats ? (
                        <>
                            <span className="text-2xl font-bold text-foreground">{stats.avgDiet}</span>
                            <span className="text-xs text-muted-foreground">/ 100</span>
                        </>
                    ) : renderEmptyValue("Diet")}
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-card/80 backdrop-blur-sm p-3 rounded-2xl border border-border/50 shadow-soft"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                        <Activity className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                        {timeRange === 'Overall' ? 'Lifetime' : timeRange} Steps
                    </span>
                </div>
                <div className="flex flex-col gap-0.5">
                    <div className="flex items-baseline gap-2">
                        {stats ? (
                            <>
                                <span className="text-2xl font-bold text-foreground">{stats.totalSteps}</span>
                                <span className="text-xs text-muted-foreground">Total</span>
                            </>
                        ) : renderEmptyValue("Steps")}
                    </div>
                    {stats && (
                        <div className="text-[10px] text-blue-500 font-medium bg-blue-500/10 px-1.5 py-0.5 rounded-md w-fit">
                            ≈ {stats.totalKm} km
                        </div>
                    )}
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 }}
                className="bg-card/80 backdrop-blur-sm p-3 rounded-2xl border border-border/50 shadow-soft"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                        <Moon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">Sleep Score</span>
                </div>
                <div className="flex items-baseline gap-2">
                    {stats ? (
                        <>
                            <span className="text-2xl font-bold text-foreground">{stats.avgSleep}</span>
                            <span className="text-xs text-muted-foreground">/ 100</span>
                        </>
                    ) : renderEmptyValue("Sleep")}
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-card/80 backdrop-blur-sm p-3 rounded-2xl border border-border/50 shadow-soft"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-heart/10 text-destructive">
                        <Heart className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">Mindset Rate</span>
                </div>
                <div className="flex items-baseline gap-2">
                    {stats ? (
                        <>
                            <span className="text-2xl font-bold text-foreground">{stats.mindsetRate}%</span>
                            <span className="text-xs text-muted-foreground text-success">Proud Logs</span>
                        </>
                    ) : renderEmptyValue("Mindset")}
                </div>
            </motion.div>
        </div>
    );
}
