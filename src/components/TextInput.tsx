import { motion } from "framer-motion";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "number";
}

export const TextInput = ({ value, onChange, placeholder, type = "text" }: TextInputProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      {type === "text" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={1000}
          className="w-full p-4 rounded-xl bg-card border border-border shadow-soft
                     text-foreground placeholder:text-muted-foreground
                     focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                     resize-none min-h-[120px] transition-all duration-200"
          rows={4}
        />
      ) : (
        <input
          type="number"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full p-4 rounded-xl bg-card border border-border shadow-soft
                     text-foreground placeholder:text-muted-foreground text-2xl font-semibold text-center
                     focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                     transition-all duration-200"
        />
      )}
    </motion.div>
  );
};
