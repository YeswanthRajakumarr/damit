import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ArrowUp, ArrowDown, Copy, Check, Zap, Brain, Dumbbell, Droplets, Moon, Utensils, Footprints, Heart, Cookie, Flame } from "lucide-react";
import { toast } from "sonner";
import { DailyLog } from "@/hooks/useDailyLogs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface PublicLogsTableProps {
    logs: DailyLog[] | undefined;
}

type SortOrder = "asc" | "desc";

const StatusIndicator = ({ value }: { value: number | null }) => {
    if (value === null) return <span className="text-muted-foreground/30">-</span>;

    const getColor = (v: number) => {
        if (v >= 1) return "bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]";
        if (v >= 0.5) return "bg-success shadow-[0_0_8px_shadow-success/40]";
        if (v >= 0.25 || v === 0) return "bg-warning shadow-[0_0_8px_shadow-warning/40]";
        return "bg-destructive animate-pulse shadow-[0_0_8px_shadow-destructive/40]";
    };

    const getOpacity = (v: number) => {
        if (v >= 1) return "opacity-100";
        if (v >= 0.5) return "opacity-80";
        if (v >= 0) return "opacity-60";
        return "opacity-100";
    };

    return (
        <div className="flex items-center justify-center">
            {value !== null && value < 0.25 && value !== 0 ? (
                <motion.div
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className={cn(
                        "w-2.5 h-2.5 rounded-full transition-all duration-300 bg-destructive shadow-[0_0_8px_shadow-destructive/40]"
                    )}
                />
            ) : (
                <div
                    className={cn(
                        "w-2.5 h-2.5 rounded-full transition-all duration-300",
                        getColor(value),
                        getOpacity(value)
                    )}
                />
            )}
        </div>
    );
};

const METRICS = [
    { label: "Diet", key: "diet", type: "status", icon: Utensils, color: "text-emerald-500" },
    { label: "Energy", key: "energy_level", type: "status", icon: Zap, color: "text-amber-500" },
    { label: "Stress", key: "stress_fatigue", type: "status", icon: Brain, color: "text-purple-500" },
    { label: "Workout", key: "workout", type: "status", icon: Dumbbell, color: "text-blue-500" },
    { label: "Water", key: "water_intake", type: "status", icon: Droplets, color: "text-cyan-500" },
    { label: "Sleep", key: "sleep_last_night", type: "status", icon: Moon, color: "text-indigo-500" },
    { label: "Cravings", key: "cravings", type: "status", icon: Cookie, color: "text-orange-500" },
    { label: "Hunger", key: "hunger_level", type: "status", icon: Flame, color: "text-red-500" },
    { label: "Steps(10k)", key: "step_count", type: "number", icon: Footprints, color: "text-teal-500" },
    { label: "Mindset", key: "proud_of_yourself", type: "boolean", icon: Heart, color: "text-rose-500" },
];

export function PublicLogsTable({ logs }: PublicLogsTableProps) {
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const sortedLogs = useMemo(() => {
        if (!logs) return [];
        return [...logs].sort((a, b) => {
            const dateA = new Date(a.log_date).getTime();
            const dateB = new Date(b.log_date).getTime();
            return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
        });
    }, [logs, sortOrder]);

    const toggleSort = () => {
        setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    };

    const handleCopyLog = async (e: React.MouseEvent, log: DailyLog) => {
        e.stopPropagation();
        const dateStr = format(new Date(log.log_date), "EEEE, MMMM d, yyyy");

        let text = `DAMit! (Daily Accountable Message)\n`;
        text += `📅 ${dateStr}\n`;
        text += `${"─".repeat(30)}\n\n`;

        const fields = [
            { label: "Diet", value: log.diet },
            { label: "Energy Level", value: log.energy_level },
            { label: "Stress & Fatigue", value: log.stress_fatigue },
            { label: "Workout", value: log.workout },
            { label: "Water Intake", value: log.water_intake },
            { label: "Sleep", value: log.sleep_last_night },
            { label: "Cravings", value: log.cravings },
            { label: "Hunger Level", value: log.hunger_level },
            { label: "Step Count", value: log.step_count },
            { label: "Good Thing", value: log.good_thing },
            { label: "Proud of Yourself", value: log.proud_of_yourself },
        ];

        fields.forEach((field) => {
            if (field.value !== null && field.value !== "") {
                text += `${field.label}: ${field.value}\n`;
            }
        });

        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(log.id);
            toast.success(`Copied log for ${format(new Date(log.log_date), "MMM d")}`);
            setTimeout(() => setCopiedId(null), 2000);
        } catch {
            toast.error("Failed to copy");
        }
    };

    if (!logs || logs.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50">
                No logs found.
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg border border-border/50 overflow-hidden"
        >
            <div className="overflow-x-auto scrollbar-hide focus-visible:outline-none">
                <Table>
                    <TableHeader>
                        <TableRow className="border-border/50 hover:bg-transparent">
                            <TableHead
                                className="sticky left-0 bg-card/95 backdrop-blur-sm z-30 min-w-[85px] sm:min-w-[110px] font-bold text-foreground border-r border-border/50 cursor-pointer hover:text-primary transition-colors text-[9px] sm:text-[10px] uppercase tracking-wider px-2"
                                onClick={toggleSort}
                            >
                                <div className="flex items-center gap-1">
                                    Metric
                                    {sortOrder === "desc" ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />}
                                </div>
                            </TableHead>
                            {sortedLogs.map((log) => (
                                <TableHead
                                    key={log.id}
                                    className="text-center min-w-[38px] sm:min-w-[85px] py-1 sm:py-2 bg-muted/10 hover:bg-muted/30 transition-colors border-r border-border/10 last:border-r-0 px-0 sm:px-1 relative group"
                                >
                                    <div className="flex flex-col items-center gap-0">
                                        <span className="text-[7px] sm:text-[10px] uppercase tracking-tighter sm:tracking-wider text-muted-foreground/60 font-bold leading-none mb-0.5">
                                            {format(new Date(log.log_date), "EEE")}
                                        </span>
                                        <span className="text-[10px] sm:text-sm font-black text-foreground whitespace-nowrap leading-none">
                                            {format(new Date(log.log_date), "d")}
                                            <span className="hidden sm:inline font-bold"> {format(new Date(log.log_date), "MMM")}</span>
                                        </span>
                                    </div>
                                    {/* Copy button on hover */}
                                    <button
                                        onClick={(e) => handleCopyLog(e, log)}
                                        className={cn(
                                            "absolute top-1 right-1 p-1 rounded-md transition-all opacity-0 group-hover:opacity-100",
                                            copiedId === log.id
                                                ? "bg-success/20 text-success opacity-100"
                                                : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                                        )}
                                        title="Copy this log"
                                    >
                                        {copiedId === log.id ? (
                                            <Check className="w-3 h-3" />
                                        ) : (
                                            <Copy className="w-3 h-3" />
                                        )}
                                    </button>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {METRICS.map((metric) => (
                            <TableRow key={metric.key} className="border-border/30 hover:bg-muted/5 transition-colors group">
                                <TableCell className="sticky left-0 bg-card/95 backdrop-blur-sm z-20 font-bold text-[9px] sm:text-[10px] py-1.5 sm:py-2 px-2 border-r border-border/50 text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-tight min-w-[85px] sm:min-w-[110px]">
                                    <div className="flex items-center gap-1 sm:gap-1.5">
                                        {metric.icon && (
                                            <metric.icon className={cn(
                                                "w-3 h-3 sm:w-4 sm:h-4 shrink-0 transition-opacity",
                                                (metric as any).color
                                            )} />
                                        )}
                                        <span className="truncate">{metric.label}</span>
                                    </div>
                                </TableCell>
                                {sortedLogs.map((log) => {
                                    const value = (log as any)[metric.key];

                                    return (
                                        <TableCell
                                            key={`${log.id}-${metric.key}`}
                                            className="text-center py-1 sm:py-2 px-0 sm:px-1 border-r border-border/10 last:border-r-0"
                                        >
                                            {metric.type === "status" ? (
                                                <StatusIndicator value={value} />
                                            ) : metric.type === "number" ? (
                                                <span className={cn(
                                                    "text-[11px] font-bold opacity-80",
                                                    metric.key === 'step_count' && value !== null && value < 10000
                                                        ? "text-destructive"
                                                        : "text-foreground"
                                                )}>
                                                    {value?.toLocaleString() || "-"}
                                                </span>
                                            ) : metric.type === "boolean" ? (
                                                <div className="flex justify-center">
                                                    {(() => {
                                                        if (value === null || value === "") return <span className="text-muted-foreground/30 text-[10px]">-</span>;
                                                        const strVal = String(value).toLowerCase();
                                                        const isYes = ["1", "yes", "yeah", "true"].includes(strVal);
                                                        return isYes ? (
                                                            <div className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(var(--success-rgb),0.5)]" />
                                                        ) : (
                                                            <div className="w-2 h-2 rounded-full bg-destructive/20" />
                                                        );
                                                    })()}
                                                </div>
                                            ) : (
                                                <span className="text-[11px] text-muted-foreground">{value || "-"}</span>
                                            )}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </motion.div>
    );
}
