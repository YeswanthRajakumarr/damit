import {
  Utensils,
  Zap,
  Brain,
  Dumbbell,
  GlassWater,
  Moon,
  Cookie,
  Sandwich,
  Footprints,
  Heart,
  Star,
  LucideIcon
} from "lucide-react";

export type QuestionType = 'rating' | 'text' | 'number';

export interface RatingOption {
  value: number;
  label: string;
}

export interface Question {
  id: number;
  question: string;
  type: QuestionType;
  options?: RatingOption[];
  placeholder?: string;
  icon?: LucideIcon;
  allowImageUpload?: boolean;
}

export const questions: Question[] = [
  {
    id: 1,
    question: "Diet",
    type: "rating",
    icon: Utensils,
    options: [
      { value: 1, label: "Perfect" },
      { value: 0.5, label: "Good" },
      { value: 0, label: "Bad" },
      { value: -1, label: "Too bad" },
    ],
  },
  {
    id: 2,
    question: "Energy level",
    type: "rating",
    icon: Zap,
    options: [
      { value: 1, label: "Very High" },
      { value: 0.5, label: "High" },
      { value: 0, label: "Low" },
      { value: -1, label: "Too low" },
    ],
  },
  {
    id: 3,
    question: "Stress & Fatigue",
    type: "rating",
    icon: Brain,
    options: [
      { value: 0, label: "Very High" },
      { value: 0.25, label: "High" },
      { value: 0.5, label: "Low" },
      { value: 1, label: "Nill" },
    ],
  },
  {
    id: 4,
    question: "Workout",
    type: "rating",
    icon: Dumbbell,
    options: [
      { value: 1, label: "Perfect" },
      { value: 0.5, label: "Good" },
      { value: 0, label: "Bad" },
      { value: -1, label: "Too bad" },
    ],
  },
  {
    id: 5,
    question: "Water intake",
    type: "rating",
    icon: GlassWater,
    options: [
      { value: 1, label: "Perfect" },
      { value: 0.5, label: "Good" },
      { value: 0, label: "Bad" },
      { value: -1, label: "Too bad" },
    ],
  },
  {
    id: 6,
    question: "Sleep last night",
    type: "rating",
    icon: Moon,
    options: [
      { value: 1, label: "Perfect" },
      { value: 0.5, label: "Good" },
      { value: 0, label: "Bad" },
      { value: -1, label: "Too bad" },
    ],
  },
  {
    id: 7,
    question: "Cravings",
    type: "rating",
    icon: Cookie,
    options: [
      { value: 0, label: "Very High" },
      { value: 0.25, label: "High" },
      { value: 0.5, label: "Low" },
      { value: 1, label: "Nill" },
    ],
  },
  {
    id: 8,
    question: "Hunger level",
    type: "rating",
    icon: Sandwich,
    options: [
      { value: 0, label: "Very High" },
      { value: 0.25, label: "High" },
      { value: 0.5, label: "Low" },
      { value: 1, label: "Nill" },
    ],
  },
  {
    id: 9,
    question: "Did you reach your 10K goal?",
    type: "rating",
    icon: Footprints,
    options: [
      { value: 1, label: "Yes" },
      { value: 0, label: "No" },
    ],
  },
  {
    id: 10,
    question: "One good thing about today",
    type: "text",
    icon: Heart,
    placeholder: "Share something positive...",
    allowImageUpload: true,
  },
  {
    id: 11,
    question: "Total step count?",
    type: "number",
    icon: Footprints,
    placeholder: "Enter your steps",
  },
  {
    id: 12,
    question: "Proud of yourself?",
    type: "rating",
    icon: Star,
    options: [
      { value: 1, label: "Yes" },
      { value: 0, label: "No" },
    ],
  },
];

export const formatAnswerForCopy = (question: Question, answer: string | number | null): string => {
  if (answer === null || answer === '') return 'Not answered';

  if (question.type === 'rating' && question.options) {
    const option = question.options.find(o => o.value === answer);
    if (option) {
      const sign = option.value > 0 ? '+' : '';
      return `${option.label} (${sign}${option.value})`;
    }
  }

  return String(answer);
};
