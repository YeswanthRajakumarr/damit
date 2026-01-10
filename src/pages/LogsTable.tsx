import { motion } from "framer-motion";
import { useDailyLogs } from "@/hooks/useDailyLogs";
import { Leaf, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
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
  if (value === 1) return "text-green-600";
  if (value === 0.5) return "text-yellow-600";
  if (value === 0) return "text-orange-500";
  if (value === -1) return "text-red-500";
  return "text-foreground";
};

export default function LogsTable() {
  const { data: logs, isLoading, error } = useDailyLogs();

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
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl gradient-primary">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">DAM Logs</h1>
          </div>
          <div className="w-16" /> {/* Spacer for centering */}
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
              No logs yet. Complete your first DAM!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead className="sticky left-0 bg-card/95 backdrop-blur-sm z-10 min-w-[100px]">
                      Date
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
                  {logs.map((log) => (
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
            <span className="text-green-600 font-bold">✓</span> Perfect/Very High
          </span>
          <span className="flex items-center gap-1">
            <span className="text-yellow-600 font-bold">½</span> Good/High
          </span>
          <span className="flex items-center gap-1">
            <span className="text-orange-500 font-bold">○</span> Bad/Nill
          </span>
          <span className="flex items-center gap-1">
            <span className="text-red-500 font-bold">✗</span> Too Bad/Low
          </span>
        </motion.div>
      </main>
    </div>
  );
}
