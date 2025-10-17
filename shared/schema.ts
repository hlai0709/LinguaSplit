import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

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
  userId: varchar("user_id").references(() => users.id).notNull(),
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

export const tutoringSessions = pgTable("tutoring_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  weekNumber: integer("week_number").notNull(),
  date: timestamp("date").notNull(),
  studentName: text("student_name").notNull(),
  topicsCovered: text("topics_covered").array().notNull(),
  notes: text("notes"),
  duration: integer("duration").notNull(),
  status: text("status").notNull().default("scheduled"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertGameProblemSchema = createInsertSchema(gameProblems).omit({
  id: true,
  createdAt: true,
});

export const insertGameSessionSchema = createInsertSchema(gameSessions).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  unlockedAt: true,
});

export const insertTutoringSessionSchema = createInsertSchema(tutoringSessions).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type User = typeof users.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;
export type GameProblem = typeof gameProblems.$inferSelect;
export type InsertGameProblem = z.infer<typeof insertGameProblemSchema>;
export type GameSession = typeof gameSessions.$inferSelect;
export type InsertGameSession = z.infer<typeof insertGameSessionSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type TutoringSession = typeof tutoringSessions.$inferSelect;
export type InsertTutoringSession = z.infer<typeof insertTutoringSessionSchema>;
