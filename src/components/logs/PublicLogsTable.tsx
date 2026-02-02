import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ArrowUp, ArrowDown, Copy, Check } from "lucide-react";
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

interface PublicLogsTableProps {
    logs: DailyLog[] | undefined;
}

type SortOrder = "asc" | "desc";

const formatValue = (value: number | null): string => {
    if (value === null) return "-";
    if (value >= 1) return "Excellent";
    if (value >= 0.5) return "Good";
    if (value >= 0 || value === 0.25) return "Fair";
    return "Poor";
};

const getValueColor = (value: number | null): string => {
    if (value === null) return "text-muted-foreground";
    if (value >= 1) return "text-primary";
    if (value >= 0.5) return "text-success";
    if (value >= 0 || value === 0.25) return "text-warning";
    return "text-destructive";
};

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

    const handleCopyRow = async (e: React.MouseEvent, log: DailyLog) => {
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
            { label: "10K Goal Reached", value: log.step_goal_reached },
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
            <div className="text-center py-12 text-muted-foreground">
                No logs found.
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-border/50"
        >
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
                                className="border-border/30 hover:bg-muted/30 transition-colors"
                            >
                                <TableCell className="sticky left-0 bg-card/95 backdrop-blur-sm z-10 font-medium py-2">
                                    {format(new Date(log.log_date), "MMM d, yyyy")}
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
        </motion.div>
    );
}
