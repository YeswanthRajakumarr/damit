import { useState } from "react";
import { motion } from "framer-motion";
import { useDailyLogs, DailyLog } from "@/hooks/useDailyLogs";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserMenu } from "@/components/UserMenu";
import { StatsDashboard } from "@/components/logs/StatsDashboard";
import { LogsDataGrid } from "@/components/logs/LogsDataGrid";
import { LogDetailsDialog } from "@/components/logs/LogDetailsDialog";

export default function LogsTable() {
  const { data: logs, isLoading, error } = useDailyLogs();
  const [selectedLog, setSelectedLog] = useState<DailyLog | null>(null);

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
        <StatsDashboard logs={logs} />
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

        <LogsDataGrid
          logs={logs}
          isLoading={isLoading}
          error={error as Error | null}
          onLogClick={setSelectedLog}
        />

        {/* Detail Snapshot Dialog */}
        <LogDetailsDialog
          selectedLog={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      </main>
    </div>
  );
}
