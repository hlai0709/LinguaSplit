import { motion } from "framer-motion";

interface AnswerOptionsProps {
  options: number[];
  correctAnswer: number;
  selectedAnswer: number | null;
  onSelect: (answer: number) => void;
  disabled: boolean;
  showResult: boolean;
}

const optionLabels = ["A", "B", "C", "D"];

export default function AnswerOptions({
  options,
  correctAnswer,
  selectedAnswer,
  onSelect,
  disabled,
  showResult,
}: AnswerOptionsProps) {
  const getButtonClass = (option: number, index: number) => {
    let baseClass = "answer-btn bg-card hover:bg-muted border-2 border-border rounded-xl p-6 sm:p-8 text-center transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed";
    
    if (showResult && selectedAnswer === option) {
      if (option === correctAnswer) {
        baseClass = "answer-btn correct bg-success border-success text-success-foreground rounded-xl p-6 sm:p-8 text-center transition-all shadow-sm";
      } else {
        baseClass = "answer-btn incorrect bg-destructive border-destructive text-destructive-foreground rounded-xl p-6 sm:p-8 text-center transition-all shadow-sm";
      }
    } else if (showResult && option === correctAnswer) {
      baseClass = "answer-btn bg-success border-success text-success-foreground rounded-xl p-6 sm:p-8 text-center transition-all shadow-sm";
    }
    
    return baseClass;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
      {options.map((option, index) => (
        <motion.button
          key={`${option}-${index}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onSelect(option)}
          disabled={disabled}
          className={getButtonClass(option, index)}
          data-testid={`button-answer-${optionLabels[index]}`}
        >
          <span className="block text-sm font-medium mb-2 opacity-80">
            Option {optionLabels[index]}
          </span>
          <span className="block text-4xl sm:text-5xl font-display font-bold number-display">
            {option}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
