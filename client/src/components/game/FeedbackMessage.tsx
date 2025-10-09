import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

interface FeedbackMessageProps {
  type: "correct" | "incorrect";
  correctAnswer?: number;
}

export default function FeedbackMessage({ type, correctAnswer }: FeedbackMessageProps) {
  const isCorrect = type === "correct";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className={`${
        isCorrect ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"
      } rounded-xl p-6 text-center shadow-lg mb-8`}
      data-testid={`feedback-${type}`}
    >
      <div className="flex items-center justify-center gap-3 mb-2">
        {isCorrect ? (
          <CheckCircle className="w-8 h-8" fill="currentColor" />
        ) : (
          <XCircle className="w-8 h-8" fill="currentColor" />
        )}
        <p className="text-2xl font-display font-bold">
          {isCorrect ? "Correct! 🎉" : "Incorrect 😕"}
        </p>
      </div>
      <p className="text-lg">
        {isCorrect
          ? "Keep up the great work!"
          : `The correct answer was ${correctAnswer}. Try again!`}
      </p>
    </motion.div>
  );
}
