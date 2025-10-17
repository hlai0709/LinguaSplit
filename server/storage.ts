import { type GameProblem, type InsertGameProblem, type GameSession, type InsertGameSession, type Achievement, type InsertAchievement, type TutoringSession, type InsertTutoringSession, type User, type UpsertUser, gameProblems, gameSessions, achievements, tutoringSessions, users } from "@shared/schema";
import { randomUUID } from "crypto";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Game Problems
  createGameProblem(problem: InsertGameProblem): Promise<GameProblem>;
  getGameProblem(id: string): Promise<GameProblem | undefined>;
  
  // Game Sessions
  createGameSession(session: InsertGameSession, userId: string): Promise<GameSession>;
  getGameSession(id: string): Promise<GameSession | undefined>;
  updateGameSession(id: string, updates: Partial<GameSession>): Promise<GameSession | undefined>;
  getOrCreateDefaultSession(userId: string): Promise<GameSession>;
  
  // Achievements
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  getAchievementsBySession(sessionId: string): Promise<Achievement[]>;
  
  // Tutoring Sessions
  createTutoringSession(session: InsertTutoringSession, userId: string): Promise<TutoringSession>;
  getTutoringSession(id: string): Promise<TutoringSession | undefined>;
  getAllTutoringSessions(userId?: string): Promise<TutoringSession[]>;
  updateTutoringSession(id: string, updates: Partial<TutoringSession>): Promise<TutoringSession | undefined>;
  deleteTutoringSession(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private problems: Map<string, GameProblem>;
  private sessions: Map<string, GameSession>;
  private achievements: Map<string, Achievement>;
  private tutoringSessions: Map<string, TutoringSession>;
  private users: Map<string, User>;

  constructor() {
    this.problems = new Map();
    this.sessions = new Map();
    this.achievements = new Map();
    this.tutoringSessions = new Map();
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existing = this.users.get(userData.id!);
    const user: User = {
      id: userData.id || randomUUID(),
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      createdAt: existing?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
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

  async createGameSession(insertSession: InsertGameSession, userId: string): Promise<GameSession> {
    const id = randomUUID();
    const session: GameSession = {
      id,
      userId,
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

  async getOrCreateDefaultSession(userId: string): Promise<GameSession> {
    const sessionId = `default-${userId}`;
    let session = this.sessions.get(sessionId);
    
    if (!session) {
      session = {
        id: sessionId,
        userId,
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
      this.sessions.set(sessionId, session);
    }
    
    return session;
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

  async createTutoringSession(insertSession: InsertTutoringSession, userId: string): Promise<TutoringSession> {
    const id = randomUUID();
    const session: TutoringSession = {
      id,
      userId,
      weekNumber: insertSession.weekNumber,
      date: insertSession.date,
      studentName: insertSession.studentName,
      topicsCovered: insertSession.topicsCovered,
      notes: insertSession.notes ?? null,
      duration: insertSession.duration,
      status: insertSession.status ?? "scheduled",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tutoringSessions.set(id, session);
    return session;
  }

  async getTutoringSession(id: string): Promise<TutoringSession | undefined> {
    return this.tutoringSessions.get(id);
  }

  async getAllTutoringSessions(userId?: string): Promise<TutoringSession[]> {
    const sessions = Array.from(this.tutoringSessions.values());
    const filtered = userId ? sessions.filter(s => s.userId === userId) : sessions;
    return filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async updateTutoringSession(id: string, updates: Partial<TutoringSession>): Promise<TutoringSession | undefined> {
    const session = this.tutoringSessions.get(id);
    if (!session) return undefined;
    
    const updatedSession: TutoringSession = {
      ...session,
      ...updates,
      updatedAt: new Date(),
    };
    this.tutoringSessions.set(id, updatedSession);
    return updatedSession;
  }

  async deleteTutoringSession(id: string): Promise<boolean> {
    return this.tutoringSessions.delete(id);
  }
}

export class DbStorage implements IStorage {
  private db;

  constructor() {
    const sql = neon(process.env.DATABASE_URL!);
    this.db = drizzle(sql);
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await this.db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await this.db.select().from(users);
  }

  async createGameProblem(insertProblem: InsertGameProblem): Promise<GameProblem> {
    const [problem] = await this.db.insert(gameProblems).values(insertProblem).returning();
    return problem;
  }

  async getGameProblem(id: string): Promise<GameProblem | undefined> {
    const [problem] = await this.db.select().from(gameProblems).where(eq(gameProblems.id, id));
    return problem;
  }

  async createGameSession(insertSession: InsertGameSession, userId: string): Promise<GameSession> {
    const [session] = await this.db.insert(gameSessions).values({ ...insertSession, userId }).returning();
    return session;
  }

  async getGameSession(id: string): Promise<GameSession | undefined> {
    const [session] = await this.db.select().from(gameSessions).where(eq(gameSessions.id, id));
    return session;
  }

  async updateGameSession(id: string, updates: Partial<GameSession>): Promise<GameSession | undefined> {
    const [session] = await this.db.update(gameSessions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(gameSessions.id, id))
      .returning();
    return session;
  }

  async getOrCreateDefaultSession(userId: string): Promise<GameSession> {
    const sessionId = `default-${userId}`;
    let [session] = await this.db.select().from(gameSessions).where(eq(gameSessions.id, sessionId));
    
    if (!session) {
      [session] = await this.db.insert(gameSessions).values({
        id: sessionId,
        userId,
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
      }).returning();
    }
    
    return session;
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const [achievement] = await this.db.insert(achievements).values(insertAchievement).returning();
    return achievement;
  }

  async getAchievementsBySession(sessionId: string): Promise<Achievement[]> {
    return await this.db.select().from(achievements).where(eq(achievements.sessionId, sessionId));
  }

  async createTutoringSession(insertSession: InsertTutoringSession, userId: string): Promise<TutoringSession> {
    const [session] = await this.db.insert(tutoringSessions).values({ ...insertSession, userId }).returning();
    return session;
  }

  async getTutoringSession(id: string): Promise<TutoringSession | undefined> {
    const [session] = await this.db.select().from(tutoringSessions).where(eq(tutoringSessions.id, id));
    return session;
  }

  async getAllTutoringSessions(userId?: string): Promise<TutoringSession[]> {
    if (userId) {
      return await this.db.select().from(tutoringSessions).where(eq(tutoringSessions.userId, userId)).orderBy(desc(tutoringSessions.date));
    }
    return await this.db.select().from(tutoringSessions).orderBy(desc(tutoringSessions.date));
  }

  async updateTutoringSession(id: string, updates: Partial<TutoringSession>): Promise<TutoringSession | undefined> {
    const [session] = await this.db.update(tutoringSessions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tutoringSessions.id, id))
      .returning();
    return session;
  }

  async deleteTutoringSession(id: string): Promise<boolean> {
    const result = await this.db.delete(tutoringSessions).where(eq(tutoringSessions.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = process.env.DATABASE_URL ? new DbStorage() : new MemStorage();
