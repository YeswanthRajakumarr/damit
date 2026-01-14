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
  invertColors?: boolean; // For questions where high values are bad (stress, cravings, hunger)
}

export const questions: Question[] = [
  {
    id: 1,
    question: "Diet",
    type: "rating",
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
    options: [
      { value: 1, label: "Very High" },
      { value: 0.5, label: "High" },
      { value: 0, label: "Low" },
      { value: -1, label: "Too low" },
    ],
  },
  {
    id: 3,
    invertColors: true,
    question: "Stress & Fatigue",
    type: "rating",
    options: [
      { value: 1, label: "Very High" },
      { value: 0.5, label: "High" },
      { value: 0.25, label: "Low" },
      { value: 0, label: "Nill" },
    ],
  },
  {
    id: 4,
    question: "Workout",
    type: "rating",
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
    options: [
      { value: 1, label: "Perfect" },
      { value: 0.5, label: "Good" },
      { value: 0, label: "Bad" },
      { value: -1, label: "Too bad" },
    ],
  },
  {
    id: 7,
    invertColors: true,
    question: "Cravings",
    type: "rating",
    options: [
      { value: 1, label: "Very High" },
      { value: 0.5, label: "High" },
      { value: 0.25, label: "Low" },
      { value: 0, label: "Nill" },
    ],
  },
  {
    id: 8,
    invertColors: true,
    question: "Hunger level",
    type: "rating",
    options: [
      { value: 1, label: "Very High" },
      { value: 0.5, label: "High" },
      { value: 0.25, label: "Low" },
      { value: 0, label: "Nill" },
    ],
  },
  {
    id: 9,
    question: "Did you reach your 10K goal?",
    type: "rating",
    options: [
      { value: 1, label: "Yes" },
      { value: 0, label: "No" },
    ],
  },
  {
    id: 10,
    question: "One good thing about today",
    type: "text",
    placeholder: "Share something positive...",
  },
  {
    id: 11,
    question: "Total step count?",
    type: "number",
    placeholder: "Enter your steps",
  },
  {
    id: 12,
    question: "Proud of yourself?",
    type: "text",
    placeholder: "Tell us why...",
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
