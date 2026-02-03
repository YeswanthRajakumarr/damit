import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { usePublicLogs, usePublicProfile } from "@/hooks/usePublicLogs";
import { StatsDashboard } from "@/components/logs/StatsDashboard";
import { TrendChart } from "@/components/analytics/TrendChart";
import { PublicLogsTable } from "@/components/logs/PublicLogsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, BarChart3, Table2, Calendar as CalendarIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function PublicRecords() {
    const { userId } = useParams();
    const [isStartOpen, setIsStartOpen] = useState(false);
    const [isEndOpen, setIsEndOpen] = useState(false);
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);

    // Validate userId format (UUID)
    const isValidUUID = userId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);

    const dateRange = startDate && endDate ? { from: startDate, to: endDate } : undefined;
    const { data: logs, isLoading: loadingLogs, error: logsError } = usePublicLogs(isValidUUID ? userId : undefined, dateRange);
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
            <header className="px-6 pt-12 pb-8 text-center max-w-5xl mx-auto relative">
                {/* Theme Toggle - Top Right */}
                <div className="absolute top-4 right-6">
                    <ThemeToggle />
                </div>
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

                {/* Date Range Filter */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
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
                </div>
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
                                    <StatsDashboard logs={logs} timeRange="Overall" />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <TrendChart logs={logs} timeRange="Overall" />
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
                                transition={{ delay: 0.2 }}
                                className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 py-1.5 px-3 bg-card/40 backdrop-blur-sm rounded-xl border border-border/50 w-full max-w-sm sm:w-fit mx-auto text-[10px] sm:text-xs shadow-sm"
                            >
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" />
                                    <span className="text-muted-foreground font-medium">Excellent</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-success opacity-80" />
                                    <span className="text-muted-foreground font-medium">Good</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-warning opacity-60" />
                                    <span className="text-muted-foreground font-medium">Fair</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <motion.div
                                        animate={{ opacity: [1, 0.4, 1] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                        className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-destructive shadow-[0_0_8px_shadow-destructive/40]"
                                    />
                                    <span className="text-muted-foreground font-medium">Poor</span>
                                </div>
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
