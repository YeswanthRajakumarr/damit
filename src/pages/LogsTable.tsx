import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useDailyLogs, DailyLog } from "@/hooks/useDailyLogs";
import { ArrowLeft, Loader2, ArrowUpDown, ArrowUp, ArrowDown, Copy, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserMenu } from "@/components/UserMenu";
import { toast } from "sonner";
import { questions, formatAnswerForCopy, Question } from "@/data/questions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

type SortOrder = "asc" | "desc";

export default function LogsTable() {
  const { data: logs, isLoading, error } = useDailyLogs();
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

  const handleCopyRow = async (log: DailyLog) => {
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

  return (
    <div className="min-h-screen gradient-warm">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 pt-8 pb-4"
      >
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/"
            className="flex items-center gap-2 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <img src="/favicon.png" alt="Logo" className="w-10 h-10 rounded-xl" />
            <h1 className="text-xl font-bold text-foreground">DAMit!</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="px-4 pb-8 space-y-4">
        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 text-sm"
        >
          <span className="flex items-center gap-1">
            <span className="text-primary font-bold">✓</span> Excellent/Nill
          </span>
          <span className="flex items-center gap-1">
            <span className="text-success font-bold">½</span> Good/Low
          </span>
          <span className="flex items-center gap-1">
            <span className="text-warning font-bold">○</span> Fair/High
          </span>
          <span className="flex items-center gap-1">
            <span className="text-destructive font-bold">✗</span> Poor/Very High
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden"
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
              No logs yet. Complete your first DAMit!
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
                    <TableRow key={log.id} className="border-border/30">
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
                          onClick={() => handleCopyRow(log)}
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
      </main>
    </div>
  );
}
