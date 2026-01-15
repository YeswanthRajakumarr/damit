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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TrendingUp, Activity, Heart, Quote } from "lucide-react";

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
  const [selectedLog, setSelectedLog] = useState<DailyLog | null>(null);

  const sortedLogs = useMemo(() => {
    if (!logs) return [];
    return [...logs].sort((a, b) => {
      const dateA = new Date(a.log_date).getTime();
      const dateB = new Date(b.log_date).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
  }, [logs, sortOrder]);

  const stats = useMemo(() => {
    if (!logs || logs.length === 0) return null;

    // Get last 7 entries for stats (assuming logs are dated accurately)
    const recentLogs = [...logs]
      .sort((a, b) => new Date(b.log_date).getTime() - new Date(a.log_date).getTime())
      .slice(0, 7);

    const avgDiet = recentLogs.reduce((acc, log) => acc + (log.diet || 0), 0) / recentLogs.length;
    const totalSteps = recentLogs.reduce((acc, log) => acc + (log.step_count || 0), 0);
    const mindsetRate = (recentLogs.filter(log => {
      const val = String(log.proud_of_yourself).toLowerCase();
      return ["1", "yes", "yeah"].includes(val);
    }).length / recentLogs.length) * 100;

    return {
      avgDiet: avgDiet.toFixed(1),
      totalSteps: totalSteps.toLocaleString(),
      mindsetRate: Math.round(mindsetRate),
    };
  }, [logs]);

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

        {/* Weekly Summary */}
        {
          stats && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-card/80 backdrop-blur-sm p-4 rounded-2xl border border-border/50 shadow-soft"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Avg Diet</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground">{stats.avgDiet}</span>
                  <span className="text-xs text-muted-foreground">/ 1.0</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-card/80 backdrop-blur-sm p-4 rounded-2xl border border-border/50 shadow-soft"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                    <Activity className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Weekly Steps</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground">{stats.totalSteps}</span>
                  <span className="text-xs text-muted-foreground">Total</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-card/80 backdrop-blur-sm p-4 rounded-2xl border border-border/50 shadow-soft"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-heart/10 text-destructive">
                    <Heart className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Mindset Rate</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground">{stats.mindsetRate}%</span>
                  <span className="text-xs text-muted-foreground text-success">Proud Logs</span>
                </div>
              </motion.div>
            </div>
          )
        }
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
                    <TableRow
                      key={log.id}
                      className="border-border/30 cursor-pointer hover:bg-muted/30 transition-colors group"
                      onClick={() => setSelectedLog(log)}
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyRow(log);
                          }}
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

        {/* Detail Snapshot Dialog */}
        <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
          <DialogContent className="sm:max-w-lg rounded-3xl p-0 overflow-hidden border-none shadow-elevated">
            {selectedLog && (
              <div className="flex flex-col">
                <div className="relative h-24 gradient-primary flex items-center px-8">
                  <DialogHeader>
                    <div className="flex items-baseline gap-2">
                      <DialogTitle className="text-2xl font-bold text-white">
                        {format(new Date(selectedLog.log_date), "EEEE")}
                      </DialogTitle>
                      <span className="text-white/80 font-medium">
                        {format(new Date(selectedLog.log_date), "MMM d, yyyy")}
                      </span>
                    </div>
                  </DialogHeader>
                </div>

                <div className="px-8 py-6 space-y-6 max-h-[70vh] overflow-y-auto gradient-warm">
                  {/* Scores Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Diet", val: selectedLog.diet, icon: TrendingUp },
                      { label: "Energy", val: selectedLog.energy_level, icon: Activity },
                      { label: "Stress", val: selectedLog.stress_fatigue, icon: Activity },
                      { label: "Workout", val: selectedLog.workout, icon: Heart },
                      { label: "Water", val: selectedLog.water_intake, icon: Activity },
                      { label: "Mindset", val: selectedLog.proud_of_yourself, icon: Heart }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-card/50 p-3 rounded-2xl border border-border/50 text-center">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                          {item.label}
                        </p>
                        <p className={`text-lg font-bold ${getValueColor(Number(item.val))}`}>
                          {item.label === "Mindset"
                            ? (String(item.val).toLowerCase().includes('yes') ? '✓' : '✗')
                            : formatValue(Number(item.val))}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Steps Card */}
                  <div className="bg-card rounded-2xl p-4 border border-border/50 shadow-soft flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Daily Movement</p>
                        <p className="text-lg font-bold">{selectedLog.step_count?.toLocaleString() || "0"} Steps</p>
                      </div>
                    </div>
                    {selectedLog.step_goal_reached && (
                      <span className="px-2 py-1 rounded-full bg-success/10 text-success text-[10px] font-bold border border-success/20">
                        GOAL MET
                      </span>
                    )}
                  </div>

                  {/* Good Thing Quote */}
                  <div className="bg-primary/5 rounded-2xl p-6 relative border border-primary/10">
                    <Quote className="absolute top-4 left-4 w-8 h-8 text-primary/10" />
                    <div className="relative z-10">
                      <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">One Good Thing</p>
                      <p className="text-foreground leading-relaxed italic font-serif text-lg">
                        "{selectedLog.good_thing || "Today was a day of focus and growth."}"
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted/30 border-t border-border flex justify-end">
                  <button
                    onClick={() => setSelectedLog(null)}
                    className="px-6 py-2 rounded-xl bg-foreground text-background font-medium hover:opacity-90 transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
