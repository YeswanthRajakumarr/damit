import { useMemo } from "react";
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

interface TrendChartProps {
    logs: DailyLog[] | undefined;
}

export const TrendChart = ({ logs }: TrendChartProps) => {
    const chartData = useMemo(() => {
        if (!logs) return [];

        return [...logs]
            .sort((a, b) => new Date(a.log_date).getTime() - new Date(b.log_date).getTime())
            .slice(-14) // Last 14 days
            .map(log => ({
                date: format(parseISO(log.log_date), "MMM d"),
                energy: log.energy_level ?? 0,
                stress: log.stress_fatigue ?? 0,
                diet: log.diet ?? 0,
            }));
    }, [logs]);

    if (chartData.length === 0) return null;

    return (
        <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50 shadow-soft mb-8">
            <h3 className="text-lg font-semibold mb-6 text-foreground">Performance Trends</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                        <XAxis
                            dataKey="date"
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            domain={[0, 1]}
                            ticks={[0, 0.5, 1]}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "hsl(var(--card))",
                                borderColor: "hsl(var(--border))",
                                borderRadius: "12px",
                                color: "hsl(var(--foreground))",
                            }}
                            itemStyle={{ fontSize: "12px" }}
                        />
                        <Legend verticalAlign="top" height={36} iconType="circle" />
                        <Line
                            type="monotone"
                            dataKey="energy"
                            name="Energy"
                            stroke="#8b5cf6"
                            strokeWidth={3}
                            dot={{ r: 4, strokeWidth: 2, fill: "hsl(var(--background))" }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="stress"
                            name="Stress Free"
                            stroke="#f59e0b"
                            strokeWidth={3}
                            dot={{ r: 4, strokeWidth: 2, fill: "hsl(var(--background))" }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="diet"
                            name="Diet"
                            stroke="#06b6d4"
                            strokeWidth={3}
                            dot={{ r: 4, strokeWidth: 2, fill: "hsl(var(--background))" }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
