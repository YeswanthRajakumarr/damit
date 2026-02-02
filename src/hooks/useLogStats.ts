import { useMemo } from "react";
import { DailyLog } from "@/hooks/useDailyLogs";
import { TimeRange } from "@/components/analytics/TrendChart";

export const useLogStats = (
    logs: DailyLog[] | undefined,
    timeRange: TimeRange = 'Week',
    customRange?: { from: Date; to: Date | undefined }
) => {
    return useMemo(() => {
        if (!logs || logs.length === 0) return null;

        const rangeValue = (() => {
            switch (timeRange) {
                case 'Day': return 1;
                case 'Week': return 7;
                case 'Month': return 30;
                case 'Overall': return 9999;
                case 'Custom': return 0;
                default: return 7;
            }
        })();

        // Get entries based on range
        let sortedLogs = [...logs].sort((a, b) => new Date(b.log_date).getTime() - new Date(a.log_date).getTime());

        let recentLogs;
        if (timeRange === 'Custom') {
            if (!customRange?.from || !customRange?.to) {
                return null;
            }
            const start = new Date(customRange.from).setHours(0, 0, 0, 0);
            const end = new Date(customRange.to).setHours(23, 59, 59, 999);
            recentLogs = sortedLogs.filter(log => {
                const d = new Date(log.log_date).getTime();
                return d >= start && d <= end;
            });
        } else {
            recentLogs = sortedLogs.slice(0, rangeValue);
        }

        if (recentLogs.length === 0) return null;

        const avgDiet = recentLogs.reduce((acc, log) => acc + (log.diet || 0), 0) / recentLogs.length;
        const totalSteps = recentLogs.reduce((acc, log) => acc + (log.step_count || 0), 0);
        const avgSleep = recentLogs.reduce((acc, log) => acc + (log.sleep_last_night || 0), 0) / recentLogs.length;
        const mindsetRate = (recentLogs.filter(log => {
            const val = String(log.proud_of_yourself).toLowerCase();
            return ["1", "yes", "true", "yeah"].includes(val);
        }).length / recentLogs.length) * 100;

        // Convert to scores out of 100 (multiply by 100 and round)
        const avgDietScore = Math.round(avgDiet * 100);
        const avgSleepScore = Math.round(avgSleep * 100);

        // Approx 0.76m per step
        const totalKm = (totalSteps * 0.76) / 1000;

        return {
            avgDiet: avgDietScore,
            totalSteps: totalSteps.toLocaleString(),
            totalKm: totalKm.toFixed(1),
            avgSleep: avgSleepScore,
            mindsetRate: Math.round(mindsetRate),
        };
    }, [logs, timeRange, customRange]);
};
