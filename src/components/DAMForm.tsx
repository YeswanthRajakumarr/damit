import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { questions } from "@/data/questions";
import { QuestionCard } from "./QuestionCard";
import { ProgressBar } from "./ProgressBar";
import { ResultsView } from "./ResultsView";
import { InstallPrompt } from "./InstallPrompt";
import { Leaf } from "lucide-react";

export const DAMForm = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | number | null>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [direction, setDirection] = useState(0);

  const currentQuestion = questions[currentIndex];

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
  }, []);

  return (
    <div className="min-h-screen gradient-warm flex flex-col safe-bottom">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 pt-8 pb-4"
      >
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="p-2 rounded-xl gradient-primary">
            <Leaf className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground">DAM</h1>
        </div>
        
        {!isComplete && (
          <ProgressBar current={currentIndex} total={questions.length} />
        )}
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-4 flex items-center">
        <div className="w-full max-w-md mx-auto">
          <AnimatePresence mode="wait">
            {isComplete ? (
              <ResultsView answers={answers} onReset={handleReset} />
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
          Daily Accountable Message
        </p>
      </footer>

      {/* Install Prompt */}
      <InstallPrompt />
    </div>
  );
};
