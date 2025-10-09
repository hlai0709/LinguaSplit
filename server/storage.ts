import { type GameProblem, type InsertGameProblem, type GameSession, type InsertGameSession, type Achievement, type InsertAchievement } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Game Problems
  createGameProblem(problem: InsertGameProblem): Promise<GameProblem>;
  getGameProblem(id: string): Promise<GameProblem | undefined>;
  
  // Game Sessions
  createGameSession(session: InsertGameSession): Promise<GameSession>;
  getGameSession(id: string): Promise<GameSession | undefined>;
  updateGameSession(id: string, updates: Partial<GameSession>): Promise<GameSession | undefined>;
  getOrCreateDefaultSession(): Promise<GameSession>;
  
  // Achievements
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  getAchievementsBySession(sessionId: string): Promise<Achievement[]>;
}

export class MemStorage implements IStorage {
  private problems: Map<string, GameProblem>;
  private sessions: Map<string, GameSession>;
  private achievements: Map<string, Achievement>;
  private defaultSessionId: string;

  constructor() {
    this.problems = new Map();
    this.sessions = new Map();
    this.achievements = new Map();
    this.defaultSessionId = randomUUID();
    
    // Create default session
    const defaultSession: GameSession = {
      id: this.defaultSessionId,
      score: 0,
      streak: 0,
      bestStreak: 0,
      correctAnswers: 0,
      totalQuestions: 0,
      difficulty: "easy",
      soundEnabled: true,
      questionsPerSession: 10,
      timerEnabled: false,
      timerSeconds: 30,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.sessions.set(this.defaultSessionId, defaultSession);
  }

  async createGameProblem(insertProblem: InsertGameProblem): Promise<GameProblem> {
    const id = randomUUID();
    const problem: GameProblem = {
      ...insertProblem,
      id,
      createdAt: new Date(),
    };
    this.problems.set(id, problem);
    return problem;
  }

  async getGameProblem(id: string): Promise<GameProblem | undefined> {
    return this.problems.get(id);
  }

  async createGameSession(insertSession: InsertGameSession): Promise<GameSession> {
    const id = randomUUID();
    const session: GameSession = {
      id,
      score: insertSession.score ?? 0,
      streak: insertSession.streak ?? 0,
      bestStreak: insertSession.bestStreak ?? 0,
      correctAnswers: insertSession.correctAnswers ?? 0,
      totalQuestions: insertSession.totalQuestions ?? 0,
      difficulty: insertSession.difficulty ?? "easy",
      soundEnabled: insertSession.soundEnabled ?? true,
      questionsPerSession: insertSession.questionsPerSession ?? 10,
      timerEnabled: insertSession.timerEnabled ?? false,
      timerSeconds: insertSession.timerSeconds ?? 30,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.sessions.set(id, session);
    return session;
  }

  async getGameSession(id: string): Promise<GameSession | undefined> {
    return this.sessions.get(id);
  }

  async updateGameSession(id: string, updates: Partial<GameSession>): Promise<GameSession | undefined> {
    const session = this.sessions.get(id);
    if (!session) return undefined;
    
    const updatedSession: GameSession = {
      ...session,
      ...updates,
      updatedAt: new Date(),
    };
    this.sessions.set(id, updatedSession);
    return updatedSession;
  }

  async getOrCreateDefaultSession(): Promise<GameSession> {
    return this.sessions.get(this.defaultSessionId)!;
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const id = randomUUID();
    const achievement: Achievement = {
      id,
      sessionId: insertAchievement.sessionId ?? null,
      title: insertAchievement.title,
      description: insertAchievement.description,
      icon: insertAchievement.icon,
      color: insertAchievement.color,
      unlockedAt: new Date(),
    };
    this.achievements.set(id, achievement);
    return achievement;
  }

  async getAchievementsBySession(sessionId: string): Promise<Achievement[]> {
    return Array.from(this.achievements.values()).filter(
      (achievement) => achievement.sessionId === sessionId
    );
  }
}

export const storage = new MemStorage();
