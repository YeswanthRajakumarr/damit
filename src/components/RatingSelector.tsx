import { motion } from "framer-motion";
import { RatingOption } from "@/data/questions";

interface RatingSelectorProps {
  options: RatingOption[];
  value: number | null;
  onChange: (value: number) => void;
  invertColors?: boolean;
}

const getOptionStyle = (value: number, isSelected: boolean, invertColors: boolean = false) => {
  if (!isSelected) return "bg-secondary text-secondary-foreground";
  
  if (invertColors) {
    // For questions where high values are bad (stress, cravings, hunger)
    if (value >= 1) return "bg-destructive text-destructive-foreground";
    if (value >= 0.5) return "bg-warning text-warning-foreground";
    if (value >= 0.25) return "bg-success text-success-foreground";
    return "bg-primary text-primary-foreground"; // Nill is best
  }
  
  // Normal questions where high values are good
  if (value === 1) return "bg-primary text-primary-foreground";
  if (value === 0.5) return "bg-success text-success-foreground";
  if (value === 0) return "bg-warning text-warning-foreground";
  return "bg-destructive text-destructive-foreground";
};

export const RatingSelector = ({ options, value, onChange, invertColors = false }: RatingSelectorProps) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((option, index) => {
        const isSelected = value === option.value;
        const sign = option.value > 0 ? "+" : "";
        
        return (
          <motion.button
            key={option.value}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onChange(option.value)}
            className={`
              relative p-4 rounded-xl text-left transition-all duration-200
              ${getOptionStyle(option.value, isSelected, invertColors)}
              ${isSelected ? "shadow-card ring-2 ring-primary/30" : "shadow-soft hover:shadow-card"}
            `}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{option.label}</span>
              <span className={`text-sm font-semibold ${isSelected ? "opacity-100" : "opacity-60"}`}>
                {sign}{option.value}
              </span>
            </div>
            {isSelected && (
              <motion.div
                layoutId="selected-indicator"
                className="absolute inset-0 rounded-xl ring-2 ring-primary"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
};
