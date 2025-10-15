# Math Master - Multiplication Practice Game

## Overview

Math Master is an interactive multiplication practice web application designed to help users improve their multiplication skills through gamified learning. The application features multiple difficulty levels, real-time score tracking, achievement systems, and customizable settings. Built as a full-stack application with a React frontend and Express backend, it provides an engaging educational experience with immediate feedback and progress tracking.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and data fetching
- Framer Motion for smooth animations and transitions
- Tailwind CSS with custom design tokens for styling
- shadcn/ui component library (Radix UI primitives) for accessible UI components

**Component Structure:**
- Single-page application with route-based navigation
- Modular game components organized by feature (game logic, UI elements, settings)
- Custom hooks for mobile detection and toast notifications
- Centralized query client for API communication with configurable error handling
- CSS variables for theming with support for dark mode

**Design Decisions:**
- Component-first architecture with reusable UI primitives
- Client-side state management through React Query reduces complexity
- Path aliases (@/, @shared/) for cleaner imports and better organization
- Framer Motion provides engaging user feedback for correct/incorrect answers

### Backend Architecture

**Technology Stack:**
- Node.js with Express framework
- TypeScript for type safety across the stack
- Drizzle ORM for database interactions
- PostgreSQL (via Neon Database serverless driver) for data persistence
- In-memory storage fallback for development/testing

**API Design:**
- RESTful endpoints for problem generation and game session management
- Route structure:
  - `GET /api/problem/:difficulty` - Generate multiplication problems with answer options
  - `POST /api/session/answer` - Submit answers and update session state
  - `GET /api/session` - Retrieve current session and achievements
  - `PUT /api/session/settings` - Update user preferences
  - `POST /api/session/reset` - Reset progress

**Storage Architecture:**
- Interface-based storage layer (`IStorage`) allows switching between implementations
- `DbStorage` class provides persistent database storage using Drizzle ORM with PostgreSQL (Neon serverless)
- Automatically switches between DbStorage and MemStorage based on DATABASE_URL environment variable
- All tutoring sessions, game sessions, and achievements persist across page refreshes and server restarts
- Default session pattern ensures single-user experience without authentication

**Problem Generation Logic:**
- Difficulty-based number ranges (easy: 1-5, medium: 1-10, hard: 1-12, expert: 1-20)
- Intelligent wrong answer generation combining close answers and random distractors
- Answer shuffling to prevent pattern recognition

### Database Schema

**Tables:**
- `game_problems`: Stores generated multiplication problems with answer options
- `game_sessions`: Tracks user progress, scores, streaks, and settings
- `achievements`: Records unlocked achievements linked to sessions

**Key Fields:**
- Sessions maintain score, current/best streak, correct answers, and total questions
- Configurable settings: difficulty, sound, questions per session, timer preferences
- Achievement system with title, description, icon, and color attributes

**Design Rationale:**
- UUID-based primary keys for distributed scalability
- Timestamp tracking for created/updated records
- Array type for storing answer options efficiently
- Foreign key relationship between achievements and sessions

### External Dependencies

**Database:**
- Neon Database (PostgreSQL serverless) via `@neondatabase/serverless`
- Drizzle ORM for schema management and queries
- Drizzle Kit for migrations

**UI Components:**
- Radix UI primitives for accessible, unstyled components
- shadcn/ui for pre-built component patterns
- Tailwind CSS for utility-first styling
- Custom fonts from Google Fonts (Nunito, Inter, Roboto)

**Development Tools:**
- Vite with Replit-specific plugins (runtime error overlay, cartographer, dev banner)
- ESBuild for server-side bundling
- TSX for TypeScript execution in development

**Session Management:**
- `connect-pg-simple` for PostgreSQL-backed session storage (installed but not actively used)
- Express session middleware for potential authentication features

**Form Handling:**
- React Hook Form with Zod resolvers for type-safe form validation
- Drizzle-Zod integration for schema-based validation

**Date Utilities:**
- date-fns for date manipulation and formatting

**Development Approach:**
- The application currently uses a default session pattern without authentication
- Storage layer abstraction allows easy migration from in-memory to database persistence
- Shared schema types between frontend and backend ensure type consistency
- The architecture supports future addition of user authentication and multi-user features