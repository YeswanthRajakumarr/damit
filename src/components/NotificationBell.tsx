import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { useDailyLogs } from "@/hooks/useDailyLogs";
import { subDays, startOfToday } from "date-fns";
import { formatDateLocal } from "@/lib/utils";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

export const NotificationBell = () => {
    const { data } = useDailyLogs();

    const hasMissingLogs = useMemo(() => {
        if (!data?.logs) return false;

        const today = startOfToday();
        const last7Days = Array.from({ length: 7 }, (_, i) => subDays(today, i));

        return last7Days.some(day => {
            const dateStr = formatDateLocal(day);
            return !data.logs.some(log => log.log_date === dateStr);
        });
    }, [data?.logs]);

    return (
        <Link
            to="/app/notifications"
            className="relative p-2 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
            aria-label="Notifications"
            title="Notifications"
        >
            <Bell className="w-5 h-5 text-foreground" />
            {hasMissingLogs && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-background animate-pulse" />
            )}
        </Link>
    );
};
