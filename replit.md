# Math Master - Multiplication Practice Game

## Overview

Math Master is an interactive multiplication practice web application designed to help users improve their multiplication skills through gamified learning. The application features multiple difficulty levels, real-time score tracking, achievement systems, and customizable settings. Built as a full-stack application with a React frontend and Express backend, it provides an engaging educational experience with immediate feedback and progress tracking.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Authentication

**Replit Auth Integration:**
- OpenID Connect authentication via Replit Auth
- Supports login with Google, GitHub, X, Apple, and email/password
- Session-based authentication with PostgreSQL session storage
- JWT tokens with automatic refresh for seamless user experience

**User Roles:**
- Regular users: Can access games and manage their own tutoring sessions
- Admin users: Can view all users and all tutoring sessions via admin dashboard
- Role-based access control with isAdmin middleware protecting admin routes

**Security:**
- All routes protected with isAuthenticated middleware
- Admin routes additionally protected with isAdmin middleware
- User data scoped to authenticated user (users only see their own data)
- Proper 401/403 error handling with unauthorized/forbidden responses

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
- Authentication-aware routing (landing page for logged-out users, protected routes for authenticated users)
- Modular game components organized by feature (game logic, UI elements, settings)
- Custom hooks for authentication state and user information
- Centralized query client for API communication with configurable error handling
- CSS variables for theming with support for dark mode

**Design Decisions:**
- Component-first architecture with reusable UI primitives
- Client-side state management through React Query reduces complexity
- Path aliases (@/, @shared/) for cleaner imports and better organization
- Framer Motion provides engaging user feedback for correct/incorrect answers
- Authentication-first design: all features require login for data persistence and user tracking

**Authentication Pages:**
- Landing page: Public page with app overview and login button
- Protected pages: Home, Games, Tutoring sessions (user-specific data)
- Admin dashboard: Shows all users and their tutoring sessions (admin-only)

### Backend Architecture

**Technology Stack:**
- Node.js with Express framework
- TypeScript for type safety across the stack
- Drizzle ORM for database interactions
- PostgreSQL (via Neon Database serverless driver) for data persistence
- In-memory storage fallback for development/testing

**API Design:**
- RESTful endpoints for problem generation and game session management
- All routes protected with authentication middleware
- Route structure:
  - Authentication:
    - `GET /api/login` - Initiate Replit Auth login flow
    - `GET /api/callback` - OAuth callback handler
    - `GET /api/logout` - Logout and end session
    - `GET /api/auth/user` - Get current authenticated user
  - Games (user-specific):
    - `GET /api/problem/:difficulty` - Generate multiplication problems
    - `POST /api/check-answer` - Submit answers and update user's session
    - `GET /api/session` - Retrieve current user's session and achievements
    - `PATCH /api/session` - Update user's session settings
    - `POST /api/reset` - Reset user's progress
  - Tutoring (user-specific):
    - `GET /api/tutoring-sessions` - Get user's tutoring sessions
    - `POST /api/tutoring-sessions` - Create new tutoring session for user
    - `PATCH /api/tutoring-sessions/:id` - Update tutoring session
    - `DELETE /api/tutoring-sessions/:id` - Delete tutoring session
  - Admin (admin-only):
    - `GET /api/admin/users` - Get all users
    - `GET /api/admin/tutoring-sessions` - Get all tutoring sessions

**Storage Architecture:**
- Interface-based storage layer (`IStorage`) allows switching between implementations
- `DbStorage` class provides persistent database storage using Drizzle ORM with PostgreSQL (Neon serverless)
- Automatically switches between DbStorage and MemStorage based on DATABASE_URL environment variable
- All tutoring sessions, game sessions, achievements, and user data persist across page refreshes and server restarts
- User-scoped data: Each user has their own game sessions and tutoring sessions
- Admin users can view all data via dedicated admin endpoints

**Problem Generation Logic:**
- Difficulty-based number ranges (easy: 1-5, medium: 1-10, hard: 1-12, expert: 1-20)
- Intelligent wrong answer generation combining close answers and random distractors
- Answer shuffling to prevent pattern recognition

### Database Schema

**Tables:**
- `sessions`: Express session storage for authentication (managed by connect-pg-simple)
- `users`: User accounts with profile information and admin flag
- `game_sessions`: User-specific game progress, scores, streaks, and settings
- `tutoring_sessions`: User-specific tutoring session schedules and notes
- `game_problems`: Generated multiplication problems with answer options
- `achievements`: Unlocked achievements linked to game sessions

**Key Fields:**
- Users: id, email, firstName, lastName, profileImageUrl, isAdmin, createdAt, updatedAt
- Game sessions: userId (foreign key), score, current/best streak, correct answers, settings
- Tutoring sessions: userId (foreign key), weekNumber, date, studentName, topics, duration, status
- Achievements: sessionId (foreign key), title, description, icon, color

**Design Rationale:**
- UUID-based primary keys for distributed scalability
- Timestamp tracking for created/updated records
- Array type for storing answer options and topics efficiently
- Foreign key relationships: game_sessions → users, tutoring_sessions → users, achievements → game_sessions
- isAdmin boolean flag for role-based access control
- User data isolation through userId foreign keys

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
- `connect-pg-simple` for PostgreSQL-backed session storage
- Express session middleware with Replit Auth integration
- OpenID Client for OAuth 2.0/OIDC authentication
- Passport.js with OpenID Connect strategy
- Memoizee for OIDC configuration caching

**Form Handling:**
- React Hook Form with Zod resolvers for type-safe form validation
- Drizzle-Zod integration for schema-based validation

**Date Utilities:**
- date-fns for date manipulation and formatting

**Development Approach:**
- Multi-user application with Replit Auth for authentication
- User-scoped data ensures privacy and data isolation
- Storage layer abstraction allows switching between in-memory and database persistence
- Shared schema types between frontend and backend ensure type consistency
- Role-based access control for admin features
- Landing page for unauthenticated users with sign-in flow
- Protected routes require authentication to access