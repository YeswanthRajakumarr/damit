import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { questions } from "@/data/questions";
import { QuestionCard } from "./QuestionCard";
import { ProgressBar } from "./ProgressBar";
import { ResultsView } from "./ResultsView";
import { InstallPrompt } from "./InstallPrompt";
import { Table2, LogOut, CalendarIcon, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { useCheckExistingLog } from "@/hooks/useDailyLogs";

export const DAMForm = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | number | null>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [direction, setDirection] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { signOut } = useAuthContext();
  const { data: existingLog, isLoading: checkingLog } = useCheckExistingLog(selectedDate);

  const currentQuestion = questions[currentIndex];

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Failed to logout");
    }
  };

  const handleAnswer = useCallback((value: string | number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  }, [currentQuestion.id]);

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setDirection(1);
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const handleReset = useCallback(() => {
    setCurrentIndex(0);
    setAnswers({});
    setIsComplete(false);
    setDirection(0);
    setSelectedDate(new Date());
  }, []);

  return (
    <div className="min-h-screen gradient-warm flex flex-col safe-bottom">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 pt-8 pb-4"
      >
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium
                       text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>

          <div className="flex items-center gap-2">
            <img src="/favicon.png" alt="Logo" className="w-10 h-10 rounded-xl" />
            <h1 className="text-xl font-bold text-foreground">DAMit!</h1>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/logs"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium
                         bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all"
            >
              <Table2 className="w-4 h-4" />
              <span className="hidden sm:inline">Records</span>
            </Link>
          </div>
        </div>

        {/* Date Picker */}
        {!isComplete && (
          <div className="mb-4">
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl",
                    "bg-secondary text-secondary-foreground font-medium",
                    "hover:bg-secondary/80 transition-all border border-border"
                  )}
                >
                  <CalendarIcon className="w-4 h-4" />
                  {format(selectedDate, "EEEE, MMMM d, yyyy")}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  disabled={(date) => date > new Date()}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>

            {/* Existing log warning */}
            {existingLog && !checkingLog && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30"
              >
                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span className="text-xs text-amber-600 dark:text-amber-400">
                  A log exists for this date. Submitting will update it.
                </span>
              </motion.div>
            )}
          </div>
        )}

        {!isComplete && (
          <ProgressBar current={currentIndex} total={questions.length} />
        )}
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-4 flex items-center">
        <div className="w-full max-w-md mx-auto">
          <AnimatePresence mode="wait">
            {isComplete ? (
              <ResultsView answers={answers} onReset={handleReset} selectedDate={selectedDate} />
            ) : (
              <QuestionCard
                key={currentQuestion.id}
                question={currentQuestion}
                answer={answers[currentQuestion.id] ?? null}
                onAnswer={handleAnswer}
                onNext={handleNext}
                onPrev={handlePrev}
                isFirst={currentIndex === 0}
                isLast={currentIndex === questions.length - 1}
                direction={direction}
              />
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 text-center">
        <p className="text-xs text-muted-foreground">
          Built with ♥️ by Yeswanth Rajakumar
        </p>
      </footer>

      {/* Install Prompt */}
      <InstallPrompt />
    </div>
  );
};
