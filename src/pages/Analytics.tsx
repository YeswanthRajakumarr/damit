import { useDailyLogs } from "@/hooks/useDailyLogs";
import { useLogStats } from "@/hooks/useLogStats";
import { StatsDashboard, StatsDashboardSkeleton } from "@/components/logs/StatsDashboard";
import { TrendChart, TrendChartSkeleton, TimeRange } from "@/components/analytics/TrendChart";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { BarChart3, Plus, Calendar as CalendarIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { toast } from "sonner";
import { NavBar } from "@/components/NavBar";

const Analytics = () => {
    const { data, isLoading: loadingLogs } = useDailyLogs();
    const [timeRange, setTimeRange] = useState<TimeRange>('Week');
    const [startDate, setStartDate] = useState<Date | undefined>(new Date(new Date().setDate(new Date().getDate() - 7)));
    const [endDate, setEndDate] = useState<Date | undefined>(new Date());
    const [isStartOpen, setIsStartOpen] = useState(false);
    const [isEndOpen, setIsEndOpen] = useState(false);

    const customRange = { from: startDate, to: endDate };

    const logs = data?.logs || [];
    const hasLogs = logs.length > 0;

    return (
        <div className="min-h-screen gradient-warm px-4 pt-6 pb-12 sm:px-6 sm:pt-8 safe-bottom">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <NavBar hideAnalytics backLink={{ to: "/app", label: "Back" }} />
                    <div className="mt-4">
                        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Analytics</h1>
                        <p className="text-xs text-muted-foreground hidden sm:block">Your progress over time</p>
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
                    <div className="space-y-6">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-xl border border-border/50 w-fit overflow-x-auto no-scrollbar">
                                {(['Day', 'Week', 'Month', 'Overall', 'Custom'] as TimeRange[]).map((range) => (
                                    <button
                                        key={range}
                                        onClick={() => setTimeRange(range)}
                                        className={cn(
                                            "px-3 py-1 text-xs font-bold rounded-lg transition-all whitespace-nowrap",
                                            timeRange === range
                                                ? "bg-primary text-white shadow-sm"
                                                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                                        )}
                                    >
                                        {range}
                                    </button>
                                ))}
                            </div>

                            {timeRange === 'Custom' && (
                                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                                    <div className="flex items-center gap-2 bg-secondary/30 p-1 rounded-xl border border-border/50 overflow-hidden w-full max-w-xs sm:w-fit">
                                        <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"ghost"}
                                                    className={cn(
                                                        "h-8 flex-1 sm:flex-none px-3 text-[10px] sm:text-xs font-semibold rounded-lg transition-all hover:bg-secondary truncate",
                                                        !startDate && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-3 w-3 text-primary shrink-0" />
                                                    {startDate ? format(startDate, "MMM d, y") : "Start Date"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 rounded-2xl border-border/50 shadow-xl" align="center">
                                                <Calendar
                                                    mode="single"
                                                    selected={startDate}
                                                    onSelect={(date) => {
                                                        setStartDate(date);
                                                        setIsStartOpen(false);
                                                        if (date && endDate && endDate < date) {
                                                            setEndDate(undefined);
                                                        }
                                                    }}
                                                    initialFocus
                                                    className="rounded-2xl"
                                                />
                                            </PopoverContent>
                                        </Popover>

                                        <span className="text-muted-foreground text-[10px] font-bold px-1 opacity-50 uppercase">to</span>

                                        <Popover open={isEndOpen} onOpenChange={setIsEndOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"ghost"}
                                                    className={cn(
                                                        "h-8 flex-1 sm:flex-none px-3 text-[10px] sm:text-xs font-semibold rounded-lg transition-all hover:bg-secondary truncate",
                                                        !endDate && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-3 w-3 text-primary shrink-0" />
                                                    {endDate ? format(endDate, "MMM d, y") : "End Date"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 rounded-2xl border-border/50 shadow-xl" align="center">
                                                <Calendar
                                                    mode="single"
                                                    selected={endDate}
                                                    onSelect={(date) => {
                                                        if (date && startDate) {
                                                            const diffTime = Math.abs(date.getTime() - startDate.getTime());
                                                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                                            if (diffDays > 30) {
                                                                toast.error("Maximum range is 30 days");
                                                                return;
                                                            }
                                                        }
                                                        setEndDate(date);
                                                        setIsEndOpen(false);
                                                    }}
                                                    disabled={(date) => !!startDate && date < startDate}
                                                    initialFocus
                                                    className="rounded-2xl"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    {!startDate || !endDate ? (
                                        <span className="text-[10px] text-destructive font-bold animate-pulse">
                                            Dates required
                                        </span>
                                    ) : null}
                                </div>
                            )}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <StatsDashboard
                                logs={logs}
                                timeRange={timeRange}
                                customRange={customRange as { from: Date; to: Date | undefined }}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <TrendChart
                                logs={logs}
                                timeRange={timeRange}
                                customRange={customRange as { from: Date; to: Date | undefined }}
                            />
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Analytics;
