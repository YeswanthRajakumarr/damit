import { motion } from "framer-motion";
import { DailyLog } from "@/hooks/useDailyLogs";
import { format, parseISO } from "date-fns";
import { Heart } from "lucide-react";

interface GratitudeWallProps {
    logs: DailyLog[] | undefined;
}

export const GratitudeWall = ({ logs }: GratitudeWallProps) => {
    const gratitudeLogs = logs?.filter(log => log.good_thing && log.good_thing.trim() !== "") || [];

    if (gratitudeLogs.length === 0) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 px-2">
                <Heart className="w-5 h-5 text-destructive fill-destructive" />
                <h3 className="text-xl font-bold text-foreground">Gratitude Wall</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gratitudeLogs.slice(0, 8).map((log, index) => (
                    <motion.div
                        key={log.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-5 rounded-2xl bg-card border border-border/50 shadow-soft relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Heart className="w-12 h-12 text-primary" />
                        </div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                            {format(parseISO(log.log_date), "EEEE, MMMM d")}
                        </p>
                        <p className="text-foreground italic leading-relaxed">
                            "{log.good_thing}"
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
