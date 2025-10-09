import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { motion, AnimatePresence } from "framer-motion";
import AppHeader from "@/components/game/AppHeader";
import StatsBar from "@/components/game/StatsBar";
import DifficultySelector from "@/components/game/DifficultySelector";
import QuestionCard from "@/components/game/QuestionCard";
import AnswerOptions from "@/components/game/AnswerOptions";
import FeedbackMessage from "@/components/game/FeedbackMessage";
import ProgressSection from "@/components/game/ProgressSection";
import AchievementsSection from "@/components/game/AchievementsSection";
import SettingsModal from "@/components/game/SettingsModal";
import { useToast } from "@/hooks/use-toast";
import type { GameProblem, GameSession, Achievement } from "@shared/schema";

export default function Game() {
  const [difficulty, setDifficulty] = useState("easy");
  const [currentProblem, setCurrentProblem] = useState<GameProblem | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<"correct" | "incorrect">("correct");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { toast } = useToast();

  // Fetch session data
  const { data: sessionData, isLoading: sessionLoading } = useQuery<{ session: GameSession; achievements: Achievement[] }>({
    queryKey: ["/api/session"],
  });

  const session = sessionData?.session;
  const achievements = sessionData?.achievements;

  // Generate new problem
  const { mutate: generateProblem, isPending: generatingProblem } = useMutation({
    mutationFn: async (difficulty: string) => {
      const response = await apiRequest("GET", `/api/problem/${difficulty}`);
      return await response.json();
    },
    onSuccess: (problem: GameProblem) => {
      setCurrentProblem(problem);
      setSelectedAnswer(null);
      setShowFeedback(false);
    },
  });

  // Check answer
  const { mutate: checkAnswer, isPending: checkingAnswer } = useMutation({
    mutationFn: async ({ problemId, answer }: { problemId: string; answer: number }) => {
      const response = await apiRequest("POST", "/api/check-answer", {
        problemId,
        selectedAnswer: answer,
      });
      return await response.json();
    },
    onSuccess: (result) => {
      setFeedbackType(result.isCorrect ? "correct" : "incorrect");
      setShowFeedback(true);
      
      // Show new achievements
      if (result.newAchievements?.length > 0) {
        result.newAchievements.forEach((achievement: Achievement) => {
          toast({
            title: "🎉 Achievement Unlocked!",
            description: `${achievement.icon} ${achievement.title}`,
          });
        });
      }
      
      // Auto-generate next problem after 2 seconds
      setTimeout(() => {
        generateProblem(difficulty);
      }, 2000);
      
      queryClient.invalidateQueries({ queryKey: ["/api/session"] });
    },
  });

  // Update session settings
  const { mutate: updateSettings } = useMutation({
    mutationFn: async (updates: Partial<GameSession>) => {
      const response = await apiRequest("PATCH", "/api/session", updates);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/session"] });
    },
  });

  // Reset progress
  const { mutate: resetProgress } = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/reset");
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/session"] });
      generateProblem(difficulty);
      toast({
        title: "Progress Reset",
        description: "Your progress has been reset successfully!",
      });
    },
  });

  // Generate initial problem
  useEffect(() => {
    if (session && !currentProblem) {
      generateProblem(difficulty);
    }
  }, [session, currentProblem, difficulty, generateProblem]);

  // Handle difficulty change
  const handleDifficultyChange = (newDifficulty: string) => {
    setDifficulty(newDifficulty);
    updateSettings({ difficulty: newDifficulty });
    generateProblem(newDifficulty);
  };

  const handleAnswerSelect = (answer: number) => {
    if (selectedAnswer !== null || checkingAnswer || !currentProblem) return;
    
    setSelectedAnswer(answer);
    checkAnswer({ problemId: currentProblem.id, answer });
  };

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-display text-muted-foreground">Loading Math Master...</p>
        </div>
      </div>
    );
  }

  const accuracy = session?.totalQuestions ? Math.round((session.correctAnswers / session.totalQuestions) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader onOpenSettings={() => setSettingsOpen(true)} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatsBar
          score={session?.score || 0}
          streak={session?.streak || 0}
          correct={session?.correctAnswers || 0}
        />
        
        <DifficultySelector
          difficulty={difficulty}
          onChange={handleDifficultyChange}
        />

        <AnimatePresence mode="wait">
          {currentProblem && (
            <motion.div
              key={currentProblem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <QuestionCard
                num1={currentProblem.num1}
                num2={currentProblem.num2}
                loading={generatingProblem}
              />
              
              <AnswerOptions
                options={currentProblem.options}
                correctAnswer={currentProblem.correctAnswer}
                selectedAnswer={selectedAnswer}
                onSelect={handleAnswerSelect}
                disabled={checkingAnswer || selectedAnswer !== null}
                showResult={showFeedback}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showFeedback && (
            <FeedbackMessage
              type={feedbackType}
              correctAnswer={currentProblem?.correctAnswer}
            />
          )}
        </AnimatePresence>

        <ProgressSection
          questionsAnswered={session?.totalQuestions || 0}
          accuracy={accuracy}
          bestStreak={session?.bestStreak || 0}
          progressPercentage={session?.questionsPerSession ? Math.min(100, (session.totalQuestions / session.questionsPerSession) * 100) : 0}
        />

        {achievements && achievements.length > 0 && (
          <AchievementsSection achievements={achievements} />
        )}
      </main>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        session={session}
        onUpdateSettings={updateSettings}
        onResetProgress={resetProgress}
      />
    </div>
  );
}
