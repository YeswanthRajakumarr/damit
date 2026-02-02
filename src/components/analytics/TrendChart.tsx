import { useMemo, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";
import { DailyLog } from "@/hooks/useDailyLogs";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

import { Skeleton } from "@/components/ui/skeleton";

interface TrendChartProps {
    logs: DailyLog[] | undefined;
}

export const TrendChartSkeleton = () => {
    return (
        <div className="bg-card/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-border/50 shadow-soft mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-9 w-48 rounded-xl" />
            </div>
            <div className="h-[250px] sm:h-[300px] w-full">
                <Skeleton className="h-full w-full rounded-lg" />
            </div>
        </div>
    );
};

type TimeRange = 'Day' | 'Week' | 'Month' | 'Overall';

export const TrendChart = ({ logs }: TrendChartProps) => {
    const [timeRange, setTimeRange] = useState<TimeRange>('Week');
    const [hiddenMetrics, setHiddenMetrics] = useState<Set<string>>(new Set());

    const rangeValue = useMemo(() => {
        switch (timeRange) {
            case 'Day': return 1;
            case 'Week': return 7;
            case 'Month': return 30;
            case 'Overall': return 9999;
            default: return 7;
        }
    }, [timeRange]);

    const chartData = useMemo(() => {
        if (!logs) return [];

        return [...logs]
            .sort((a, b) => new Date(a.log_date).getTime() - new Date(b.log_date).getTime())
            .slice(-rangeValue)
            .map(log => {
                const sleepValue = log.sleep_last_night ?? 0;
                let sleepLabel = "N/A";
                if (sleepValue === 1) sleepLabel = "Perfect";
                else if (sleepValue === 0.5) sleepLabel = "Good";
                else if (sleepValue === 0) sleepLabel = "Bad";
                else if (sleepValue === -1) sleepLabel = "Too bad";

                const normalize = (val: number | null | undefined) => (val === -1 ? -0.5 : (val ?? 0));

                return {
                    date: format(parseISO(log.log_date), "MMM d"),
                    energy: normalize(log.energy_level),
                    stress: normalize(log.stress_fatigue),
                    diet: normalize(log.diet),
                    sleep: normalize(sleepValue),
                    sleepLabel,
                };
            });
    }, [logs, rangeValue]);

    const toggleMetric = (e: any) => {
        const { dataKey } = e;
        setHiddenMetrics((prev) => {
            const next = new Set(prev);
            if (next.has(dataKey)) {
                next.delete(dataKey);
            } else {
                next.add(dataKey);
            }
            return next;
        });
    };

    if (chartData.length === 0) return null;

    return (
        <div className="bg-card/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-border/50 shadow-soft mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-lg font-semibold text-foreground">Performance Trends</h3>

                <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-xl border border-border/50 w-fit">
                    {(['Day', 'Week', 'Month', 'Overall'] as TimeRange[]).map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={cn(
                                "px-3 py-1 text-xs font-bold rounded-lg transition-all",
                                timeRange === range
                                    ? "bg-primary text-white shadow-sm"
                                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                            )}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-[250px] sm:h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 10, left: 5, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                        <XAxis
                            dataKey="date"
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            minTickGap={15}
                            dy={10}
                        />
                        <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            domain={[-0.6, 1.1]}
                            ticks={[-0.5, 0, 0.5, 1]}
                            tickFormatter={(value) => {
                                if (value === -0.5) return "Worst";
                                if (value === 0) return "Poor";
                                if (value === 0.5) return "Balanced";
                                if (value === 1) return "Excellent";
                                return value;
                            }}
                            width={70}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "hsl(var(--card))",
                                borderColor: "hsl(var(--border))",
                                borderRadius: "12px",
                                color: "hsl(var(--foreground))",
                            }}
                            itemStyle={{ fontSize: "10px" }}
                            formatter={(value: any, name: string, props: any) => {
                                if (name === "Sleep") return [props.payload.sleepLabel, name];
                                return [value, name];
                            }}
                        />
                        <Legend
                            verticalAlign="top"
                            height={40}
                            iconType="circle"
                            onClick={toggleMetric}
                            wrapperStyle={{
                                fontSize: '10px',
                                paddingBottom: '10px',
                                cursor: 'pointer'
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="energy"
                            name="Energy"
                            stroke="#8b5cf6"
                            strokeWidth={2}
                            strokeOpacity={hiddenMetrics.has("energy") ? 0.1 : 1}
                            dot={hiddenMetrics.has("energy") ? false : { r: 3, strokeWidth: 2, fill: "hsl(var(--background))" }}
                            activeDot={hiddenMetrics.has("energy") ? false : { r: 5, strokeWidth: 0 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="stress"
                            name="Stress Free"
                            stroke="#f59e0b"
                            strokeWidth={2}
                            strokeOpacity={hiddenMetrics.has("stress") ? 0.1 : 1}
                            dot={hiddenMetrics.has("stress") ? false : { r: 3, strokeWidth: 2, fill: "hsl(var(--background))" }}
                            activeDot={hiddenMetrics.has("stress") ? false : { r: 5, strokeWidth: 0 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="diet"
                            name="Diet"
                            stroke="#06b6d4"
                            strokeWidth={2}
                            strokeOpacity={hiddenMetrics.has("diet") ? 0.1 : 1}
                            dot={hiddenMetrics.has("diet") ? false : { r: 3, strokeWidth: 2, fill: "hsl(var(--background))" }}
                            activeDot={hiddenMetrics.has("diet") ? false : { r: 5, strokeWidth: 0 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="sleep"
                            name="Sleep"
                            stroke="#22c55e"
                            strokeWidth={2}
                            strokeOpacity={hiddenMetrics.has("sleep") ? 0.1 : 1}
                            dot={hiddenMetrics.has("sleep") ? false : { r: 3, strokeWidth: 2, fill: "hsl(var(--background))" }}
                            activeDot={hiddenMetrics.has("sleep") ? false : { r: 5, strokeWidth: 0 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <p className="text-[10px] text-muted-foreground text-center mt-2 italic">
                Tip: Click legend items to toggle visibility
            </p>
        </div>
    );
};
