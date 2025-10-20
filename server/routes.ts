import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGameSessionSchema, insertTutoringSessionSchema } from "@shared/schema";
// import { setupAuth, isAuthenticated, isAdmin } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // await setupAuth(app);

  // Public route for user (skipped for now - returns null for anonymous)
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // For anonymous testing, return null or basic info
      res.json(null); // No user for public mode
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Generate a new multiplication problem (public)
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

  // Check answer and update session (public - use anonymous user)
  app.post("/api/check-answer", async (req: any, res) => {
    try {
      const { problemId, selectedAnswer } = req.body;
      const userId = 'anonymous'; // Fixed for public mode
      
      const problem = await storage.getGameProblem(problemId);
      if (!problem) {
        return res.status(404).json({ message: "Problem not found" });
      }
      
      const session = await storage.getOrCreateDefaultSession(userId);
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

  // Get current session (public - anonymous)
  app.get("/api/session", async (req: any, res) => {
    try {
      const userId = 'anonymous'; // Fixed for public mode
      const session = await storage.getOrCreateDefaultSession(userId);
      const achievements = await storage.getAchievementsBySession(session.id);
      res.json({ session, achievements });
    } catch (error) {
      res.status(500).json({ message: "Failed to get session" });
    }
  });

  // Update session settings (public - anonymous)
  app.patch("/api/session", async (req: any, res) => {
    try {
      const userId = 'anonymous'; // Fixed for public mode
      const session = await storage.getOrCreateDefaultSession(userId);
      const updatedSession = await storage.updateGameSession(session.id, req.body);
      res.json(updatedSession);
    } catch (error) {
      res.status(500).json({ message: "Failed to update session" });
    }
  });

  // Reset progress (public - anonymous)
  app.post("/api/reset", async (req: any, res) => {
    try {
      const userId = 'anonymous'; // Fixed for public mode
      const session = await storage.getOrCreateDefaultSession(userId);
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

  // Admin routes - commented out for public mode
  /*
  app.get("/api/admin/users", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/admin/tutoring-sessions", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const sessions = await storage.getAllTutoringSessions();
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch all tutoring sessions" });
    }
  });
  */

  // Tutoring session routes - public with anonymous user
  app.get("/api/tutoring-sessions", async (req: any, res) => {
    try {
      const userId = 'anonymous'; // Fixed for public mode
      const sessions = await storage.getAllTutoringSessions(userId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tutoring sessions" });
    }
  });

  app.get("/api/tutoring-sessions/:id", async (req: any, res) => {
    try {
      const userId = 'anonymous'; // Fixed for public mode
      const session = await storage.getTutoringSession(req.params.id);
      if (!session) {
        return res.status(404).json({ message: "Tutoring session not found" });
      }
      // Skip ownership check for public mode
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tutoring session" });
    }
  });

  app.post("/api/tutoring-sessions", async (req: any, res) => {
    try {
      const userId = 'anonymous'; // Fixed for public mode
      const data = {
        ...req.body,
        date: req.body.date ? new Date(req.body.date) : undefined,
      };
      console.log("Received data:", JSON.stringify(req.body, null, 2));
      console.log("Transformed data:", JSON.stringify(data, null, 2));
      const validatedData = insertTutoringSessionSchema.parse(data);
      const session = await storage.createTutoringSession(validatedData, userId);
      res.status(201).json(session);
    } catch (error) {
      console.error("Validation error:", error);
      res.status(400).json({ message: "Invalid tutoring session data", error: error instanceof Error ? error.message : String(error) });
    }
  });

  app.patch("/api/tutoring-sessions/:id", async (req: any, res) => {
    try {
      const userId = 'anonymous'; // Fixed for public mode
      const existing = await storage.getTutoringSession(req.params.id);
      if (!existing) {
        return res.status(404).json({ message: "Tutoring session not found" });
      }
      // Skip ownership check for public mode
      const data = {
        ...req.body,
        date: req.body.date ? new Date(req.body.date) : undefined,
      };
      const session = await storage.updateTutoringSession(req.params.id, data);
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to update tutoring session" });
    }
  });

  app.delete("/api/tutoring-sessions/:id", async (req: any, res) => {
    try {
      const userId = 'anonymous'; // Fixed for public mode
      const existing = await storage.getTutoringSession(req.params.id);
      if (!existing) {
        return res.status(404).json({ message: "Tutoring session not found" });
      }
      // Skip ownership check for public mode
      const deleted = await storage.deleteTutoringSession(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete tutoring session" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
