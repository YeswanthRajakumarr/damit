import { motion } from "framer-motion";
import { questions, formatAnswerForCopy, Question } from "@/data/questions";
import { Copy, Check, RotateCcw, Table2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSaveDailyLog } from "@/hooks/useDailyLogs";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface ResultsViewProps {
  answers: Record<number, string | number | null>;
  onReset: () => void;
  selectedDate: Date;
}

export const ResultsView = ({ answers, onReset, selectedDate }: ResultsViewProps) => {
  const [copied, setCopied] = useState(false);
  const saveMutation = useSaveDailyLog();
  const [saved, setSaved] = useState(false);

  // Save to database when component mounts
  useEffect(() => {
    if (!saved) {
      saveMutation.mutate({ answers, selectedDate }, {
        onSuccess: () => {
          setSaved(true);
          toast.success("DAM saved to database!");
        },
        onError: () => {
          toast.error("Failed to save DAM");
        },
      });
    }
  }, []);

  const generateCopyText = () => {
    const dateStr = format(selectedDate, "EEEE, MMMM d, yyyy");

    let text = `DAM (Daily Accountable Message)\n`;
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

    return text;
  };

  const handleCopy = async () => {
    const text = generateCopyText();
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const calculateScore = () => {
    let total = 0;
    let count = 0;
    
    questions.forEach(q => {
      if (q.type === "rating" && answers[q.id] !== null && answers[q.id] !== undefined) {
        total += Number(answers[q.id]);
        count++;
      }
    });
    
    return count > 0 ? (total / count).toFixed(2) : "0";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full"
    >
      <div className="bg-card rounded-2xl p-6 shadow-card gradient-card mb-4">
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-primary mb-4"
          >
            <Check className="w-8 h-8 text-primary-foreground" />
          </motion.div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Great job! 🎉
          </h2>
          <p className="text-muted-foreground">
            Your DAM is ready to share
          </p>
        </div>

        <div className="bg-secondary rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">
              Average Score
            </span>
            <span className="text-2xl font-bold text-primary">
              {calculateScore()}
            </span>
          </div>
        </div>

        <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto">
          {questions.map((q, index) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex justify-between items-start py-2 border-b border-border last:border-0"
            >
              <span className="text-sm text-muted-foreground flex-1">
                {q.id}. {q.question}
              </span>
              <span className="text-sm font-medium text-foreground ml-4 text-right">
                {formatAnswerForCopy(q, answers[q.id] ?? null)}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <button
              onClick={onReset}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                         bg-secondary text-secondary-foreground font-medium
                         hover:bg-secondary/80 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Start Over
            </button>
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                         gradient-primary text-primary-foreground font-medium
                         shadow-soft hover:shadow-card transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy DAM
                </>
              )}
            </button>
          </div>
          
          <Link
            to="/logs"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                       border border-border text-foreground font-medium
                       hover:bg-secondary/50 transition-all"
          >
            {saveMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Table2 className="w-4 h-4" />
            )}
            View All Logs
          </Link>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Paste your DAM anywhere to share your daily progress
      </p>
    </motion.div>
  );
};
