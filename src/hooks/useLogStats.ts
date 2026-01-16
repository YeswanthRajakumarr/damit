import { useMemo } from "react";
import { DailyLog } from "@/hooks/useDailyLogs";

export const useLogStats = (logs: DailyLog[] | undefined) => {
    return useMemo(() => {
        if (!logs || logs.length === 0) return null;

        // Get last 7 entries for stats (assuming logs are dated accurately)
        const recentLogs = [...logs]
            .sort((a, b) => new Date(b.log_date).getTime() - new Date(a.log_date).getTime())
            .slice(0, 7);

        const avgDiet = recentLogs.reduce((acc, log) => acc + (log.diet || 0), 0) / recentLogs.length;
        const totalSteps = recentLogs.reduce((acc, log) => acc + (log.step_count || 0), 0);
        const avgSleep = recentLogs.reduce((acc, log) => acc + (log.sleep_last_night || 0), 0) / recentLogs.length;
        const mindsetRate = (recentLogs.filter(log => {
            const val = String(log.proud_of_yourself).toLowerCase();
            return ["1", "yes", "yeah"].includes(val);
        }).length / recentLogs.length) * 100;

        // Convert to scores out of 100 (multiply by 100 and round)
        const avgDietScore = Math.round(avgDiet * 100);
        const avgSleepScore = Math.round(avgSleep * 100);

        return {
            avgDiet: avgDietScore,
            totalSteps: totalSteps.toLocaleString(),
            avgSleep: avgSleepScore,
            mindsetRate: Math.round(mindsetRate),
        };
    }, [logs]);
};
