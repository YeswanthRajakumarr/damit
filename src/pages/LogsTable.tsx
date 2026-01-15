import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useDailyLogs } from "@/hooks/useDailyLogs";
import { ArrowLeft, Loader2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ThemeToggle } from "@/components/ThemeToggle";
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
  if (value === 1) return "✓";
  if (value === 0.5) return "½";
  if (value === 0) return "○";
  if (value === -1) return "✗";
  return String(value);
};

const getValueColor = (value: number | null): string => {
  if (value === null) return "text-muted-foreground";
  if (value >= 1) return "text-primary"; // Bright Green
  if (value >= 0.5) return "text-success"; // Green
  if (value >= 0.25) return "text-warning"; // Orange
  return "text-destructive"; // Red
};

type SortOrder = "asc" | "desc";

export default function LogsTable() {
  const { data: logs, isLoading, error } = useDailyLogs();
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

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
            <h1 className="text-xl font-bold text-foreground">DAMit! Logs</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="w-10 sm:w-16 hidden sm:block" /> {/* Spacer for centering */}
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="px-4 pb-8">
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
                    <TableHead className="min-w-[120px]">Good Thing</TableHead>
                    <TableHead className="text-center min-w-[70px]">Steps</TableHead>
                    <TableHead className="min-w-[120px]">Proud</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedLogs.map((log) => (
                    <TableRow key={log.id} className="border-border/30">
                      <TableCell className="sticky left-0 bg-card/95 backdrop-blur-sm z-10 font-medium">
                        {format(new Date(log.log_date), "MMM d")}
                      </TableCell>
                      <TableCell className={`text-center font-bold ${getValueColor(log.diet)}`}>
                        {formatValue(log.diet)}
                      </TableCell>
                      <TableCell className={`text-center font-bold ${getValueColor(log.energy_level)}`}>
                        {formatValue(log.energy_level)}
                      </TableCell>
                      <TableCell className={`text-center font-bold ${getValueColor(log.stress_fatigue)}`}>
                        {formatValue(log.stress_fatigue)}
                      </TableCell>
                      <TableCell className={`text-center font-bold ${getValueColor(log.workout)}`}>
                        {formatValue(log.workout)}
                      </TableCell>
                      <TableCell className={`text-center font-bold ${getValueColor(log.water_intake)}`}>
                        {formatValue(log.water_intake)}
                      </TableCell>
                      <TableCell className={`text-center font-bold ${getValueColor(log.sleep_last_night)}`}>
                        {formatValue(log.sleep_last_night)}
                      </TableCell>
                      <TableCell className={`text-center font-bold ${getValueColor(log.cravings)}`}>
                        {formatValue(log.cravings)}
                      </TableCell>
                      <TableCell className={`text-center font-bold ${getValueColor(log.hunger_level)}`}>
                        {formatValue(log.hunger_level)}
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate" title={log.good_thing || ""}>
                        {log.good_thing || "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {log.step_count?.toLocaleString() || "-"}
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate" title={log.proud_of_yourself || ""}>
                        {log.proud_of_yourself || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 flex flex-wrap justify-center gap-4 text-sm"
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
      </main>
    </div>
  );
}
