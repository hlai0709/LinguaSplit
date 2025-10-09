import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const gameProblems = pgTable("game_problems", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  num1: integer("num1").notNull(),
  num2: integer("num2").notNull(),
  correctAnswer: integer("correct_answer").notNull(),
  difficulty: text("difficulty").notNull(),
  options: integer("options").array().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const gameSessions = pgTable("game_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  score: integer("score").default(0).notNull(),
  streak: integer("streak").default(0).notNull(),
  bestStreak: integer("best_streak").default(0).notNull(),
  correctAnswers: integer("correct_answers").default(0).notNull(),
  totalQuestions: integer("total_questions").default(0).notNull(),
  difficulty: text("difficulty").default("easy").notNull(),
  soundEnabled: boolean("sound_enabled").default(true).notNull(),
  questionsPerSession: integer("questions_per_session").default(10).notNull(),
  timerEnabled: boolean("timer_enabled").default(false).notNull(),
  timerSeconds: integer("timer_seconds").default(30).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").references(() => gameSessions.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

export const insertGameProblemSchema = createInsertSchema(gameProblems).omit({
  id: true,
  createdAt: true,
});

export const insertGameSessionSchema = createInsertSchema(gameSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  unlockedAt: true,
});

export type GameProblem = typeof gameProblems.$inferSelect;
export type InsertGameProblem = z.infer<typeof insertGameProblemSchema>;
export type GameSession = typeof gameSessions.$inferSelect;
export type InsertGameSession = z.infer<typeof insertGameSessionSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
