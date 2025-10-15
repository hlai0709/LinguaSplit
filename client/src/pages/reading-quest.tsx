import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { motion, AnimatePresence } from "framer-motion";
import { Book, Star, CheckCircle, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface VocabQuestion {
  id: string;
  word: string;
  correctDefinition: string;
  options: string[];
  difficulty: string;
}

const vocabularyData: Record<string, Array<{ word: string; definition: string }>> = {
  easy: [
    { word: "Happy", definition: "Feeling joy or pleasure" },
    { word: "Big", definition: "Large in size" },
    { word: "Fast", definition: "Moving quickly" },
    { word: "Bright", definition: "Giving off much light" },
    { word: "Kind", definition: "Friendly and caring" },
    { word: "Small", definition: "Little in size" },
    { word: "Brave", definition: "Showing courage" },
    { word: "Clean", definition: "Free from dirt" },
  ],
  medium: [
    { word: "Curious", definition: "Eager to learn or know" },
    { word: "Generous", definition: "Willing to give and share" },
    { word: "Ancient", definition: "Very old" },
    { word: "Swift", definition: "Moving very quickly" },
    { word: "Precious", definition: "Of great value" },
    { word: "Humble", definition: "Not proud or arrogant" },
    { word: "Brilliant", definition: "Exceptionally smart or bright" },
    { word: "Tranquil", definition: "Calm and peaceful" },
  ],
  hard: [
    { word: "Diligent", definition: "Showing care and effort" },
    { word: "Resilient", definition: "Able to recover from difficulties" },
    { word: "Meticulous", definition: "Very careful and precise" },
    { word: "Eloquent", definition: "Fluent and persuasive in speaking" },
    { word: "Tenacious", definition: "Persistent and determined" },
    { word: "Benevolent", definition: "Well-meaning and kindly" },
    { word: "Astute", definition: "Having good judgment" },
    { word: "Zealous", definition: "Full of enthusiasm" },
  ],
};

function generateQuestion(difficulty: string): VocabQuestion {
  const words = vocabularyData[difficulty];
  const randomWord = words[Math.floor(Math.random() * words.length)];
  
  const wrongOptions = words
    .filter(w => w.word !== randomWord.word)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map(w => w.definition);
  
  const options = [randomWord.definition, ...wrongOptions].sort(() => Math.random() - 0.5);
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    word: randomWord.word,
    correctDefinition: randomWord.definition,
    options,
    difficulty,
  };
}

export default function ReadingQuest() {
  const [difficulty, setDifficulty] = useState("easy");
  const [currentQuestion, setCurrentQuestion] = useState<VocabQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    generateNewQuestion();
  }, [difficulty]);

  const generateNewQuestion = () => {
    setCurrentQuestion(generateQuestion(difficulty));
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer !== null || !currentQuestion) return;
    
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.correctDefinition;
    setIsCorrect(correct);
    setShowFeedback(true);
    setTotal(total + 1);
    
    if (correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setCorrect(prev => prev + 1);
      setScore(score + 10 + (newStreak * 2));
      
      if (newStreak === 5) {
        toast({
          title: "🔥 Hot Streak!",
          description: "5 correct answers in a row!",
        });
      }
    } else {
      setStreak(0);
    }
    
    setTimeout(() => {
      generateNewQuestion();
    }, 2000);
  };

  const handleDifficultyChange = (newDifficulty: string) => {
    setDifficulty(newDifficulty);
    generateNewQuestion();
  };

  const difficulties = [
    { key: "easy", label: "Easy" },
    { key: "medium", label: "Medium" },
    { key: "hard", label: "Hard" },
  ];

  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/games">
                <Button variant="ghost" size="sm" data-testid="button-back">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
                <Book className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-foreground">Reading Quest</h1>
                <p className="text-sm text-muted-foreground">Vocabulary Challenge</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-xl p-4 shadow-sm border border-border text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Star className="w-5 h-5 text-accent" fill="currentColor" />
              <span className="text-sm font-medium text-muted-foreground">Score</span>
            </div>
            <p className="text-3xl font-display font-bold text-foreground number-display" data-testid="text-score">
              {score}
            </p>
          </div>
          
          <div className="bg-card rounded-xl p-4 shadow-sm border border-border text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-xl streak-flame">🔥</span>
              <span className="text-sm font-medium text-muted-foreground">Streak</span>
            </div>
            <p className="text-3xl font-display font-bold text-secondary number-display" data-testid="text-streak">
              {streak}
            </p>
          </div>
          
          <div className="bg-card rounded-xl p-4 shadow-sm border border-border text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <CheckCircle className="w-5 h-5 text-success" fill="currentColor" />
              <span className="text-sm font-medium text-muted-foreground">Correct</span>
            </div>
            <p className="text-3xl font-display font-bold text-success number-display" data-testid="text-correct">
              {correct}
            </p>
          </div>
        </div>
        
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border mb-8">
          <label className="block text-sm font-medium text-foreground mb-3">Difficulty Level</label>
          <div className="flex gap-2 flex-wrap">
            {difficulties.map((diff) => (
              <button
                key={diff.key}
                onClick={() => handleDifficultyChange(diff.key)}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  difficulty === diff.key
                    ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-pink-500 hover:text-white"
                }`}
                data-testid={`button-difficulty-${diff.key}`}
              >
                {diff.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {currentQuestion && (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-8 sm:p-12 shadow-xl mb-8 text-center fade-in">
                <p className="text-white/80 text-lg sm:text-xl font-medium mb-4">What does this word mean?</p>
                <p className="text-5xl sm:text-7xl font-display font-bold text-white mb-4" data-testid="text-word">
                  {currentQuestion.word}
                </p>
                <div className="w-24 h-1 bg-white/30 mx-auto rounded-full"></div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {currentQuestion.options.map((option, index) => {
                  const optionLabels = ["A", "B", "C", "D"];
                  let buttonClass = "answer-btn bg-card hover:bg-muted border-2 border-border rounded-xl p-6 text-left transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed";
                  
                  if (showFeedback && selectedAnswer === option) {
                    if (option === currentQuestion.correctDefinition) {
                      buttonClass = "answer-btn correct bg-success border-success text-success-foreground rounded-xl p-6 text-left transition-all shadow-sm";
                    } else {
                      buttonClass = "answer-btn incorrect bg-destructive border-destructive text-destructive-foreground rounded-xl p-6 text-left transition-all shadow-sm";
                    }
                  } else if (showFeedback && option === currentQuestion.correctDefinition) {
                    buttonClass = "answer-btn bg-success border-success text-success-foreground rounded-xl p-6 text-left transition-all shadow-sm";
                  }
                  
                  return (
                    <motion.button
                      key={`${option}-${index}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={selectedAnswer !== null}
                      className={buttonClass}
                      data-testid={`button-answer-${optionLabels[index]}`}
                    >
                      <span className="block text-sm font-medium mb-2 opacity-80">
                        Option {optionLabels[index]}
                      </span>
                      <span className="block text-lg font-medium">
                        {option}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className={`${
                isCorrect ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"
              } rounded-xl p-6 text-center shadow-lg mb-8`}
              data-testid={`feedback-${isCorrect ? 'correct' : 'incorrect'}`}
            >
              <p className="text-2xl font-display font-bold">
                {isCorrect ? "Excellent! 📚" : "Not quite! 📖"}
              </p>
              <p className="text-lg mt-2">
                {isCorrect
                  ? "You got it right!"
                  : `The correct answer is: ${currentQuestion?.correctDefinition}`}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 bg-card rounded-xl p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-semibold text-foreground">Your Progress</h3>
            <span className="text-sm text-muted-foreground" data-testid="text-questions-answered">
              {total} questions
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-4 overflow-hidden mb-4">
            <div
              className="progress-bar-fill bg-gradient-to-r from-pink-500 to-rose-600 h-full rounded-full"
              style={{ width: `${Math.min(100, (total / 10) * 100)}%` }}
              data-testid="progress-bar"
            ></div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-display font-bold text-foreground number-display" data-testid="text-accuracy">
                {accuracy}%
              </p>
              <p className="text-sm text-muted-foreground">Accuracy</p>
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-foreground number-display">
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </p>
              <p className="text-sm text-muted-foreground">Difficulty</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
