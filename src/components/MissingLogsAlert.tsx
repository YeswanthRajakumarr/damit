import { useDailyLogs } from "@/hooks/useDailyLogs";
import { subDays, startOfToday, format, isSameDay } from "date-fns";
import { formatDateLocal } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, ArrowRight, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";

interface MissingLogsAlertProps {
    onSelectDate: (date: Date) => void;
}

export const MissingLogsAlert = ({ onSelectDate }: MissingLogsAlertProps) => {
    const { data } = useDailyLogs();
    const [isDismissed, setIsDismissed] = useState(false);

    const missingDays = useMemo(() => {
        if (!data?.logs) return [];

        const today = startOfToday();
        const last7Days = Array.from({ length: 7 }, (_, i) => subDays(today, i));

        return last7Days.filter(day => {
            const dateStr = formatDateLocal(day);
            return !data.logs.some(log => log.log_date === dateStr);
        }).reverse(); // Show oldest first
    }, [data?.logs]);

    if (missingDays.length === 0 || isDismissed) return null;

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
        >
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
                <div className="flex items-start gap-3 mb-3">
                    <div className="p-1.5 rounded-lg bg-amber-500/20">
                        <AlertCircle className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-amber-600 dark:text-amber-400">
                            Missing Accountability
                        </h4>
                        <p className="text-xs text-amber-600/80 dark:text-amber-400/80 leading-relaxed">
                            You missed {missingDays.length} {missingDays.length === 1 ? 'day' : 'days'} this week. Don't break the chain!
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {missingDays.map((day) => (
                        <Button
                            key={day.toISOString()}
                            variant="secondary"
                            size="sm"
                            onClick={() => onSelectDate(day)}
                            className="bg-background/50 hover:bg-background border-amber-500/20 text-amber-700 dark:text-amber-300 h-8 text-[11px] px-3 rounded-lg"
                        >
                            <CalendarIcon className="w-3 h-3 mr-1.5 opacity-50" />
                            {isSameDay(day, startOfToday()) ? "Today" : format(day, "EEE, MMM d")}
                            <ArrowRight className="w-3 h-3 ml-1.5 opacity-50" />
                        </Button>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};
