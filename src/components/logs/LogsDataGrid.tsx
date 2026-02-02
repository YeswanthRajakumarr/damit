import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Loader2, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Zap, Brain, Dumbbell, Droplets, Moon, Utensils, Footprints, Heart, Cookie, Flame } from "lucide-react";
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

interface LogsDataGridProps {
    logs: DailyLog[] | undefined;
    totalCount: number;
    currentPage: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    isLoading: boolean;
    error: Error | null;
    onLogClick: (log: DailyLog) => void;
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

export function LogsDataGrid({ logs, totalCount, currentPage, pageSize, onPageChange, onPageSizeChange, isLoading, error, onLogClick }: LogsDataGridProps) {
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
    const [jumpPage, setJumpPage] = useState("");

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

    const totalPages = Math.ceil(totalCount / pageSize);

    const handleJump = (e: React.FormEvent) => {
        e.preventDefault();
        const pageNum = parseInt(jumpPage);
        if (!isNaN(pageNum) && pageNum > 0 && pageNum <= totalPages) {
            onPageChange(pageNum - 1);
            setJumpPage("");
        } else {
            toast.error(`Please enter a page between 1 and ${totalPages}`);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12 bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !logs || logs.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50">
                {error ? "Error loading logs" : "No logs found."}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
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
                                        className="text-center min-w-[38px] sm:min-w-[85px] py-1 sm:py-2 bg-muted/10 cursor-pointer hover:bg-muted/30 transition-colors border-r border-border/10 last:border-r-0 px-0 sm:px-1"
                                        onClick={() => onLogClick(log)}
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
                                                className="text-center py-1 sm:py-2 px-0 sm:px-1 cursor-pointer border-r border-border/10 last:border-r-0"
                                                onClick={() => onLogClick(log)}
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

            {/* Pagination Controls */}
            {totalCount > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
                    <div className="flex items-center gap-4">
                        <p className="text-sm text-muted-foreground">
                            Showing <span className="font-medium">{currentPage * pageSize + 1}</span> to <span className="font-medium">{Math.min((currentPage + 1) * pageSize, totalCount)}</span> of <span className="font-medium">{totalCount}</span> results
                        </p>

                        <select
                            value={pageSize}
                            onChange={(e) => onPageSizeChange(Number(e.target.value))}
                            className="text-xs bg-card border border-border/50 rounded-xl px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer"
                        >
                            {[10, 15, 20, 30, 50, 100].map(size => (
                                <option key={size} value={size}>{size} per page</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-card/50 p-1 rounded-xl border border-border/50 shadow-soft">
                            <button
                                onClick={() => onPageChange(currentPage - 1)}
                                disabled={currentPage === 0 || isLoading}
                                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            <div className="flex items-center gap-1">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => onPageChange(i)}
                                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === i
                                            ? "bg-primary text-white shadow-md scale-105"
                                            : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                )).slice(Math.max(0, currentPage - 2), Math.min(totalPages, currentPage + 3))}
                            </div>

                            <button
                                onClick={() => onPageChange(currentPage + 1)}
                                disabled={currentPage >= totalPages - 1 || isLoading}
                                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        {totalPages > 5 && (
                            <form onSubmit={handleJump} className="flex items-center gap-2 ml-2">
                                <input
                                    type="text"
                                    placeholder="Jump to..."
                                    value={jumpPage}
                                    onChange={(e) => setJumpPage(e.target.value)}
                                    className="w-20 px-3 py-1.5 text-xs bg-card border border-border/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-[10px]"
                                />
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
