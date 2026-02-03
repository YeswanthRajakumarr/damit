import { useState } from "react";
import { motion } from "framer-motion";
import { useDailyLogs, DailyLog, useDeleteLog } from "@/hooks/useDailyLogs";
import { Trash2, Calendar as CalendarIcon, Filter } from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { NavBar } from "@/components/NavBar";
import { LogsDataGrid } from "@/components/logs/LogsDataGrid";
import { LogDetailsDialog } from "@/components/logs/LogDetailsDialog";

const LogsTable = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const dateRange = startDate && endDate ? { from: startDate, to: endDate } : undefined;
  const { data, isLoading, error } = useDailyLogs(currentPage, pageSize, dateRange);
  const logs = data?.logs;
  const totalCount = data?.totalCount || 0;
  const [selectedLog, setSelectedLog] = useState<DailyLog | null>(null);
  const deleteLog = useDeleteLog();

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(0); // Reset to first page
  };



  const handleDelete = async (id: string, date: string) => {
    if (window.confirm(`Are you sure you want to delete the log for ${format(parseISO(date), "MMMM d, yyyy")}?`)) {
      try {
        await deleteLog.mutateAsync(id);
        toast.success("Log deleted successfully");
      } catch (error) {
        toast.error("Failed to delete log");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-warm px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-soft overflow-hidden">
            <div className="p-4 border-b border-border/50 flex gap-4">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 border-b border-border/50 flex gap-4">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-warm">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 pt-8 pb-4"
      >
        <div className="flex flex-col gap-4 mb-6">
          {/* Top Row: Navigation & App Branding */}
          <NavBar hidePastDAMs backLink={{ to: "/app", label: "Back" }} />

          {/* Bottom Row: Controls/Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="flex items-center gap-2 bg-secondary/30 p-1 rounded-xl border border-border/50 overflow-hidden w-full max-w-xs sm:w-fit">
              <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"ghost"}
                    className={cn(
                      "h-8 flex-1 sm:flex-none px-3 text-[10px] sm:text-xs font-semibold rounded-lg transition-all hover:bg-secondary truncate",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3 w-3 text-primary shrink-0" />
                    {startDate ? format(startDate, "MMM d, y") : "Start Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-2xl border-border/50 shadow-xl" align="center">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      setStartDate(date);
                      setIsStartOpen(false);
                      setCurrentPage(0);
                      if (date && endDate && endDate < date) {
                        setEndDate(undefined);
                      }
                    }}
                    initialFocus
                    className="rounded-2xl"
                  />
                </PopoverContent>
              </Popover>

              <span className="text-muted-foreground text-[10px] font-bold px-1 opacity-50 uppercase">to</span>

              <Popover open={isEndOpen} onOpenChange={setIsEndOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"ghost"}
                    className={cn(
                      "h-8 flex-1 sm:flex-none px-3 text-[10px] sm:text-xs font-semibold rounded-lg transition-all hover:bg-secondary truncate",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3 w-3 text-primary shrink-0" />
                    {endDate ? format(endDate, "MMM d, y") : "End Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-2xl border-border/50 shadow-xl" align="center">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => {
                      if (date && startDate) {
                        const diffTime = Math.abs(date.getTime() - startDate.getTime());
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        if (diffDays > 30) {
                          toast.error("Maximum range is 30 days");
                          return;
                        }
                        setPageSize(diffDays + 1);
                      }
                      setEndDate(date);
                      setIsEndOpen(false);
                      setCurrentPage(0);
                    }}
                    disabled={(date) => !!startDate && date < startDate}
                    initialFocus
                    className="rounded-2xl"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="px-4 pb-8 space-y-4">
        {/* Legend */}
        {/* Contents were already fixed in previous step, ensuring tags match now */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 py-1.5 px-3 bg-card/40 backdrop-blur-sm rounded-xl border border-border/50 w-full max-w-sm sm:w-fit mx-auto text-[10px] sm:text-xs shadow-sm"
        >
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" />
            <span className="text-muted-foreground font-medium">Excellent</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-success opacity-80" />
            <span className="text-muted-foreground font-medium">Good</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-warning opacity-60" />
            <span className="text-muted-foreground font-medium">Fair</span>
          </div>
          <div className="flex items-center gap-1.5">
            <motion.div
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-destructive shadow-[0_0_8px_shadow-destructive/40]"
            />
            <span className="text-muted-foreground font-medium">Poor</span>
          </div>
        </motion.div>

        <LogsDataGrid
          logs={logs}
          totalCount={totalCount}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={handlePageSizeChange}
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

export default LogsTable;
