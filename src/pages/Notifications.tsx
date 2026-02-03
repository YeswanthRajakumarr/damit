import { useDailyLogs } from "@/hooks/useDailyLogs";
import { subDays, startOfToday, format, isSameDay } from "date-fns";
import { formatDateLocal } from "@/lib/utils";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMemo } from "react";
import { NavBar } from "@/components/NavBar";

const Notifications = () => {
    const { data, isLoading } = useDailyLogs();
    const navigate = useNavigate();

    const missingDays = useMemo(() => {
        if (!data?.logs) return [];

        const today = startOfToday();
        const last7Days = Array.from({ length: 7 }, (_, i) => subDays(today, i));

        return last7Days.filter(day => {
            const dateStr = formatDateLocal(day);
            return !data.logs.some(log => log.log_date === dateStr);
        }).reverse(); // Show oldest first
    }, [data?.logs]);

    const handleSelectDate = (date: Date) => {
        // We navigate back to home but we might need to pass the date
        // For now, let's just go home and let the user pick it or 
        // implement a better way if DAMForm supports date via state/params
        navigate("/app", { state: { selectedDate: date.toISOString() } });
    };

    return (
        <div className="min-h-screen gradient-warm px-6 pt-8 pb-12 safe-bottom">
            <div className="max-w-2xl mx-auto">
                <header className="mb-8">
                    <NavBar backLink={{ to: "/app", label: "Back" }} />
                    <div className="mt-4">
                        <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
                        <p className="text-sm text-muted-foreground">Keep your streak alive</p>
                    </div>
                </header>

                <main className="space-y-6">
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-24 w-full bg-card/50 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : missingDays.length > 0 ? (
                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Card className="bg-amber-500/5 border-amber-500/20 shadow-soft">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="relative">
                                                <div className="p-3 rounded-2xl bg-amber-500/20">
                                                    <AlertCircle className="w-6 h-6 text-amber-500" />
                                                </div>
                                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full border-2 border-background animate-pulse" />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-lg font-bold text-amber-600 dark:text-amber-400">
                                                    Missing Accountability
                                                </h3>
                                                <p className="text-sm text-amber-600/80 dark:text-amber-400/80 leading-relaxed">
                                                    You missed {missingDays.length} {missingDays.length === 1 ? 'day' : 'days'} this week.
                                                    Don't let your progress slip away!
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <div className="grid gap-3">
                                {missingDays.map((day, index) => (
                                    <motion.div
                                        key={day.toISOString()}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Button
                                            variant="secondary"
                                            className="w-full justify-between h-16 px-6 bg-card/40 hover:bg-card/60 border-border/50 rounded-2xl group transition-all"
                                            onClick={() => handleSelectDate(day)}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <div className="p-2 rounded-xl bg-secondary/50 text-muted-foreground group-hover:text-primary transition-colors">
                                                        <CalendarIcon className="w-5 h-5" />
                                                    </div>
                                                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-background shadow-sm" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-sm font-bold text-foreground">
                                                        {isSameDay(day, startOfToday()) ? "Today's Log" : format(day, "EEEE, MMMM d")}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Click to fill for this date
                                                    </p>
                                                </div>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-1" />
                                        </Button>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-20 text-center"
                        >
                            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                                <CheckCircle2 className="w-10 h-10 text-primary" />
                            </div>
                            <h2 className="text-xl font-bold text-foreground mb-2">All Caught Up!</h2>
                            <p className="text-muted-foreground max-w-xs">
                                Great job! You've filled out all your logs for the week.
                            </p>
                            <Button asChild className="mt-8 rounded-xl" variant="outline">
                                <Link to="/app">Back to Dashboard</Link>
                            </Button>
                        </motion.div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Notifications;
