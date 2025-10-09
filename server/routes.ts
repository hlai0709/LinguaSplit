import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGameSessionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Generate a new multiplication problem
  app.get("/api/problem/:difficulty", async (req, res) => {
    try {
      const difficulty = req.params.difficulty;
      let maxNum = 5;
      
      switch (difficulty) {
        case "easy": maxNum = 5; break;
        case "medium": maxNum = 10; break;
        case "hard": maxNum = 12; break;
        case "expert": maxNum = 20; break;
        default: maxNum = 5;
      }
      
      const num1 = Math.floor(Math.random() * maxNum) + 1;
      const num2 = Math.floor(Math.random() * maxNum) + 1;
      const correctAnswer = num1 * num2;
      
      // Generate 3 wrong answers
      const wrongAnswers: number[] = [];
      while (wrongAnswers.length < 3) {
        let wrongAnswer;
        if (Math.random() < 0.5) {
          // Close wrong answer (within 10)
          wrongAnswer = correctAnswer + Math.floor(Math.random() * 20) - 10;
        } else {
          // Random wrong answer
          wrongAnswer = Math.floor(Math.random() * maxNum * maxNum) + 1;
        }
        
        if (wrongAnswer !== correctAnswer && !wrongAnswers.includes(wrongAnswer) && wrongAnswer > 0) {
          wrongAnswers.push(wrongAnswer);
        }
      }
      
      // Shuffle options
      const options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
      
      const problem = await storage.createGameProblem({
        num1,
        num2,
        correctAnswer,
        difficulty,
        options,
      });
      
      res.json(problem);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate problem" });
    }
  });

  // Check answer and update session
  app.post("/api/check-answer", async (req, res) => {
    try {
      const { problemId, selectedAnswer } = req.body;
      
      const problem = await storage.getGameProblem(problemId);
      if (!problem) {
        return res.status(404).json({ message: "Problem not found" });
      }
      
      const session = await storage.getOrCreateDefaultSession();
      const isCorrect = selectedAnswer === problem.correctAnswer;
      
      let newStreak = isCorrect ? session.streak + 1 : 0;
      let newBestStreak = Math.max(session.bestStreak, newStreak);
      let newScore = session.score;
      
      if (isCorrect) {
        newScore += 10 + (newStreak * 2); // Base points + streak bonus
      }
      
      const updatedSession = await storage.updateGameSession(session.id, {
        score: newScore,
        streak: newStreak,
        bestStreak: newBestStreak,
        correctAnswers: isCorrect ? session.correctAnswers + 1 : session.correctAnswers,
        totalQuestions: session.totalQuestions + 1,
      });
      
      // Check for achievements
      const achievements = await checkAchievements(session.id, updatedSession!, isCorrect);
      
      res.json({
        isCorrect,
        correctAnswer: problem.correctAnswer,
        session: updatedSession,
        newAchievements: achievements,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to check answer" });
    }
  });

  // Get current session
  app.get("/api/session", async (req, res) => {
    try {
      const session = await storage.getOrCreateDefaultSession();
      const achievements = await storage.getAchievementsBySession(session.id);
      res.json({ session, achievements });
    } catch (error) {
      res.status(500).json({ message: "Failed to get session" });
    }
  });

  // Update session settings
  app.patch("/api/session", async (req, res) => {
    try {
      const session = await storage.getOrCreateDefaultSession();
      const updatedSession = await storage.updateGameSession(session.id, req.body);
      res.json(updatedSession);
    } catch (error) {
      res.status(500).json({ message: "Failed to update session" });
    }
  });

  // Reset progress
  app.post("/api/reset", async (req, res) => {
    try {
      const session = await storage.getOrCreateDefaultSession();
      const resetSession = await storage.updateGameSession(session.id, {
        score: 0,
        streak: 0,
        bestStreak: 0,
        correctAnswers: 0,
        totalQuestions: 0,
      });
      res.json(resetSession);
    } catch (error) {
      res.status(500).json({ message: "Failed to reset progress" });
    }
  });

  async function checkAchievements(sessionId: string, session: any, isCorrect: boolean) {
    const newAchievements = [];
    const existingAchievements = await storage.getAchievementsBySession(sessionId);
    const existingTitles = existingAchievements.map(a => a.title);

    if (isCorrect && session.correctAnswers === 1 && !existingTitles.includes("First Victory")) {
      newAchievements.push(await storage.createAchievement({
        sessionId,
        title: "First Victory",
        description: "Answered your first question correctly",
        icon: "⭐",
        color: "accent",
      }));
    }

    if (session.streak === 5 && !existingTitles.includes("Hot Streak")) {
      newAchievements.push(await storage.createAchievement({
        sessionId,
        title: "Hot Streak",
        description: "Reached a 5-question streak",
        icon: "🔥",
        color: "secondary",
      }));
    }

    if (session.streak === 10 && !existingTitles.includes("Perfect Score")) {
      newAchievements.push(await storage.createAchievement({
        sessionId,
        title: "Perfect Score",
        description: "Got 10 questions correct in a row",
        icon: "💯",
        color: "primary",
      }));
    }

    return newAchievements;
  }

  const httpServer = createServer(app);
  return httpServer;
}
