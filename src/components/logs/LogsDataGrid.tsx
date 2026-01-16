import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Loader2, ArrowUp, ArrowDown, Copy, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { DailyLog } from "@/hooks/useDailyLogs";
import { questions, formatAnswerForCopy, Question } from "@/data/questions";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

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

const formatValue = (value: number | null): string => {
    if (value === null) return "-";
    if (value >= 1) return "✓";
    if (value >= 0.5) return "½";
    if (value >= 0 || value === 0.25) return "○";
    return "✗";
};

const getValueColor = (value: number | null): string => {
    if (value === null) return "text-muted-foreground";
    if (value >= 1) return "text-primary";
    if (value >= 0.5) return "text-success";
    if (value >= 0 || value === 0.25) return "text-warning";
    return "text-destructive";
};

export function LogsDataGrid({ logs, totalCount, currentPage, pageSize, onPageChange, onPageSizeChange, isLoading, error, onLogClick }: LogsDataGridProps) {
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [jumpPage, setJumpPage] = useState("");

    const sortedLogs = useMemo(() => {
        if (!logs) return [];
        // Server-side ordering is usually enough, but we keep this for consistency if needed
        return [...logs].sort((a, b) => {
            const dateA = new Date(a.log_date).getTime();
            const dateB = new Date(b.log_date).getTime();
            return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
        });
    }, [logs, sortOrder]);

    const toggleSort = () => {
        setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    };

    const handleCopyRow = async (e: React.MouseEvent, log: DailyLog) => {
        e.stopPropagation();
        const dateStr = format(new Date(log.log_date), "EEEE, MMMM d, yyyy");

        // Map log fields to question IDs
        const answers: Record<number, string | number | null> = {
            1: log.diet,
            2: log.energy_level,
            3: log.stress_fatigue,
            4: log.workout,
            5: log.water_intake,
            6: log.sleep_last_night,
            7: log.cravings,
            8: log.hunger_level,
            9: log.step_goal_reached,
            10: log.good_thing,
            11: log.step_count,
            12: log.proud_of_yourself,
        };

        let text = `DAMit! (Daily Accountable Message)\n`;
        text += `📅 ${dateStr}\n`;
        text += `${"─".repeat(30)}\n\n`;
        text += `Rate your day:\n\n`;

        questions.forEach((q: Question) => {
            const answer = answers[q.id];
            const formattedAnswer = formatAnswerForCopy(q, answer ?? null);

            if (q.type === "rating" && q.options) {
                const optionsStr = q.options
                    .map(o => `(${o.value > 0 ? '+' : ''}${o.value} = ${o.label})`)
                    .join(' ');
                text += `${q.id}. ${q.question} ${optionsStr}\n`;
            } else if (q.type === "number") {
                text += `${q.id}. ${q.question} (In numbers)\n`;
            } else {
                text += `${q.id}. ${q.question}\n`;
            }
            text += `Ans: ${formattedAnswer}\n\n`;
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

    return (
        <div className="space-y-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-border/50"
            >
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : error ? (
                    <div className="text-center py-12 text-destructive">
                        Error loading logs
                    </div>
                ) : !logs || logs.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        No logs found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-border/50">
                                    <TableHead
                                        className="sticky left-0 bg-card/95 backdrop-blur-sm z-10 min-w-[100px] cursor-pointer hover:bg-muted/50 transition-colors"
                                        onClick={toggleSort}
                                    >
                                        <div className="flex items-center gap-1">
                                            Date
                                            {sortOrder === "desc" ? (
                                                <ArrowDown className="w-4 h-4" />
                                            ) : (
                                                <ArrowUp className="w-4 h-4" />
                                            )}
                                        </div>
                                    </TableHead>
                                    <TableHead className="text-center min-w-[60px]">Diet</TableHead>
                                    <TableHead className="text-center min-w-[70px]">Energy</TableHead>
                                    <TableHead className="text-center min-w-[70px]">Stress</TableHead>
                                    <TableHead className="text-center min-w-[70px]">Workout</TableHead>
                                    <TableHead className="text-center min-w-[60px]">Water</TableHead>
                                    <TableHead className="text-center min-w-[60px]">Sleep</TableHead>
                                    <TableHead className="text-center min-w-[70px]">Cravings</TableHead>
                                    <TableHead className="text-center min-w-[70px]">Hunger</TableHead>
                                    <TableHead className="text-center min-w-[70px]">10K Goal</TableHead>
                                    <TableHead className="text-center min-w-[70px]">Steps</TableHead>
                                    <TableHead className="min-w-[120px]">Good Thing</TableHead>
                                    <TableHead className="text-center min-w-[70px]">Proud</TableHead>
                                    <TableHead className="text-center min-w-[60px]">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedLogs.map((log) => (
                                    <TableRow
                                        key={log.id}
                                        className="border-border/30 cursor-pointer hover:bg-muted/30 transition-colors group"
                                        onClick={() => onLogClick(log)}
                                    >
                                        <TableCell className="sticky left-0 bg-card/95 backdrop-blur-sm z-10 font-medium py-2">
                                            {format(new Date(log.log_date), "MMM d")}
                                        </TableCell>
                                        <TableCell className={`text-center font-bold py-2 ${getValueColor(log.diet)}`}>
                                            {formatValue(log.diet)}
                                        </TableCell>
                                        <TableCell className={`text-center font-bold py-2 ${getValueColor(log.energy_level)}`}>
                                            {formatValue(log.energy_level)}
                                        </TableCell>
                                        <TableCell className={`text-center font-bold py-2 ${getValueColor(log.stress_fatigue)}`}>
                                            {formatValue(log.stress_fatigue)}
                                        </TableCell>
                                        <TableCell className={`text-center font-bold py-2 ${getValueColor(log.workout)}`}>
                                            {formatValue(log.workout)}
                                        </TableCell>
                                        <TableCell className={`text-center font-bold py-2 ${getValueColor(log.water_intake)}`}>
                                            {formatValue(log.water_intake)}
                                        </TableCell>
                                        <TableCell className={`text-center font-bold py-2 ${getValueColor(log.sleep_last_night)}`}>
                                            {formatValue(log.sleep_last_night)}
                                        </TableCell>
                                        <TableCell className={`text-center font-bold py-2 ${getValueColor(log.cravings)}`}>
                                            {formatValue(log.cravings)}
                                        </TableCell>
                                        <TableCell className={`text-center font-bold py-2 ${getValueColor(log.hunger_level)}`}>
                                            {formatValue(log.hunger_level)}
                                        </TableCell>
                                        <TableCell className={`text-center font-bold py-2 ${getValueColor(log.step_goal_reached)}`}>
                                            {formatValue(log.step_goal_reached)}
                                        </TableCell>
                                        <TableCell className="text-center py-2">
                                            {log.step_count?.toLocaleString() || "-"}
                                        </TableCell>
                                        <TableCell className="max-w-[150px] truncate py-2" title={log.good_thing || ""}>
                                            {log.good_thing || "-"}
                                        </TableCell>
                                        <TableCell className="text-center py-2">
                                            {(() => {
                                                const val = log.proud_of_yourself;
                                                if (val === null || val === "") return "-";

                                                const strVal = String(val).toLowerCase();
                                                const isYes = ["1", "yes", "yeah"].includes(strVal);
                                                const isNo = ["0", "no"].includes(strVal);

                                                if (isYes) {
                                                    return (
                                                        <span className="inline-flex items-center justify-center px-2 py-1 rounded-md bg-success/10 text-success text-[10px] font-bold border border-success/20 uppercase tracking-wider">
                                                            Yes
                                                        </span>
                                                    );
                                                }
                                                if (isNo) {
                                                    return (
                                                        <span className="inline-flex items-center justify-center px-2 py-1 rounded-md bg-destructive/10 text-destructive text-[10px] font-bold border border-destructive/20 uppercase tracking-wider">
                                                            No
                                                        </span>
                                                    );
                                                }
                                                return <span className="text-muted-foreground">{val}</span>;
                                            })()}
                                        </TableCell>
                                        <TableCell className="text-center py-2">
                                            <button
                                                onClick={(e) => handleCopyRow(e, log)}
                                                className={`p-1.5 rounded-lg transition-all ${copiedId === log.id
                                                    ? "bg-success/20 text-success"
                                                    : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                                                    }`}
                                                title="Copy this log"
                                            >
                                                {copiedId === log.id ? (
                                                    <Check className="w-4 h-4" />
                                                ) : (
                                                    <Copy className="w-4 h-4" />
                                                )}
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
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
                            className="text-xs bg-card border border-border/50 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary/50"
                        >
                            {[10, 15, 20, 50, 100].map(size => (
                                <option key={size} value={size}>{size} per page</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-card/50 p-1 rounded-xl border border-border/50">
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
                                            ? "bg-primary text-white shadow-sm"
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
                                    className="w-16 px-2 py-1.5 text-xs bg-card border border-border/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/50"
                                />
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
