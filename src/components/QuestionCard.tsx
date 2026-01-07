import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { Question } from "@/data/questions";
import { RatingSelector } from "./RatingSelector";
import { TextInput } from "./TextInput";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface QuestionCardProps {
  question: Question;
  answer: string | number | null;
  onAnswer: (value: string | number) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
  direction: number;
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

export const QuestionCard = ({
  question,
  answer,
  onAnswer,
  onNext,
  onPrev,
  isFirst,
  isLast,
  direction,
}: QuestionCardProps) => {
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x < -threshold && !isLast) {
      onNext();
    } else if (info.offset.x > threshold && !isFirst) {
      onPrev();
    }
  };

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={question.id}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        className="w-full touch-pan-x"
      >
        <div className="bg-card rounded-2xl p-6 shadow-card gradient-card">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium mb-3">
              Question {question.id}
            </span>
            <h2 className="text-2xl font-bold text-foreground">
              {question.question}
            </h2>
            {question.type === "rating" && (
              <p className="text-sm text-muted-foreground mt-2">
                Rate your experience today
              </p>
            )}
          </div>

          <div className="mb-6">
            {question.type === "rating" && question.options && (
              <RatingSelector
                options={question.options}
                value={answer as number | null}
                onChange={onAnswer}
              />
            )}
            {question.type === "text" && (
              <TextInput
                value={(answer as string) || ""}
                onChange={onAnswer}
                placeholder={question.placeholder}
                type="text"
              />
            )}
            {question.type === "number" && (
              <TextInput
                value={(answer as string) || ""}
                onChange={onAnswer}
                placeholder={question.placeholder}
                type="number"
              />
            )}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-border">
            <button
              onClick={onPrev}
              disabled={isFirst}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all
                ${isFirst 
                  ? "opacity-30 cursor-not-allowed" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            
            <div className="flex gap-1">
              {[...Array(11)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === question.id - 1 ? "bg-primary w-4" : "bg-secondary"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={onNext}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all
                ${isLast
                  ? "gradient-primary text-primary-foreground shadow-soft"
                  : "text-primary hover:bg-secondary"
                }`}
            >
              {isLast ? "Submit" : "Next"}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Swipe left or right to navigate
        </p>
      </motion.div>
    </AnimatePresence>
  );
};
