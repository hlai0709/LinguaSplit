# Homework Help Buddies - Design Guidelines

## Design Approach: Reference-Based (Educational Gaming Hybrid)

**Primary Inspiration**: Duolingo's playful gamification + Khan Academy's educational trust + Prodigy's adventure aesthetic

**Core Principle**: Dual-personality design that speaks to kids through visual delight while reassuring parents through clean structure and professionalism.

---

## Color Palette

**Primary Colors (Dark Mode)**
- Hero Purple: 260 65% 55% (main brand, CTA buttons)
- Sky Blue: 200 85% 60% (secondary actions, accents)
- Success Green: 145 60% 50% (achievements, progress)

**Primary Colors (Light Mode)**
- Hero Purple: 260 70% 50%
- Sky Blue: 200 80% 45%  
- Success Green: 145 65% 45%

**Supporting Colors**
- Sunshine Yellow: 45 95% 60% (highlights, badges, stars)
- Coral Pink: 10 75% 65% (warm accents, encouragement)
- Neutral Gray: 220 15% 25% (text, dark mode base)
- Soft White: 220 20% 98% (light mode base, cards)

**Semantic Colors**
- Error/Warning: 0 70% 60%
- Info: 210 80% 55%

---

## Typography

**Font Stack**
- Primary: 'Fredoka' (Google Fonts) - rounded, friendly headers
- Secondary: 'Inter' (Google Fonts) - clean body text, professional elements

**Type Scale**
- Hero/H1: 3.5rem (56px) desktop / 2.5rem mobile, Fredoka Bold
- H2: 2.5rem desktop / 2rem mobile, Fredoka SemiBold
- H3: 1.75rem, Fredoka Medium
- Body Large: 1.125rem, Inter Regular
- Body: 1rem, Inter Regular
- Small/Caption: 0.875rem, Inter Regular

**Usage Rules**
- All student-facing headers: Fredoka
- Parent/tutor sections, forms, tables: Inter
- Button text: Fredoka Medium for primary, Inter SemiBold for secondary

---

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24

**Container Strategy**
- Full-width hero: w-full with max-w-7xl inner container
- Content sections: max-w-6xl mx-auto
- Cards/Components: p-6 to p-8 standard

**Grid Patterns**
- Features: 3-column desktop (lg:grid-cols-3), 2-col tablet (md:grid-cols-2), 1-col mobile
- Minigame cards: 4-column desktop, 2-col tablet, 1-col mobile
- Testimonials: 2-column desktop, stacked mobile

---

## Component Library

### Navigation
- Sticky header with blur backdrop (backdrop-blur-xl)
- Logo: Playful mascot icon + "Homework Help Buddies" in Fredoka
- Desktop: Horizontal nav with rounded-full active state indicators
- Mobile: Slide-in drawer with fun bounce animation
- CTA: "Start Free Trial" button (Hero Purple, rounded-full, px-6 py-3)

### Hero Section
- Full-width with gradient overlay (purple to blue, 45deg, 60% opacity)
- Large hero image: Illustrated kids collaborating on homework with floating educational icons
- Two-column layout: Left = headline + subheadline + dual CTAs, Right = hero image
- Primary CTA: "Get Started Free" (solid purple, large)
- Secondary CTA: "Watch Demo" (outline white with blur backdrop)
- Trust indicators: "Join 10,000+ Happy Students" with 5-star rating

### Minigame Cards
- Rounded-2xl with soft shadow (shadow-lg)
- Gradient backgrounds per game category (math=blue, reading=coral, science=green)
- Floating icons (absolute positioned stars, books, atoms)
- Hover: Lift effect (translate-y-1) with increased shadow
- Badge overlay: "NEW" or "Popular" in top-right corner

### Progress Tracking Dashboard
- Clean data visualization with colorful progress bars
- Achievement badges: Circular with gradient fills and subtle glow
- Weekly calendar: Grid with color-coded session types
- Stats cards: Icon + number + label in rounded containers

### Session Booking Interface
- Calendar view with available slots in Success Green
- Tutor cards: Photo + name + rating + subjects in rounded containers
- Time slot pills: Rounded-full, interactive with purple active state

### Testimonial Cards
- Parent testimonials: Professional photo + quote + name/title
- Student reviews: Cartoon avatar + enthusiastic quote + age/grade
- Alternating layouts for visual interest
- Star ratings in Sunshine Yellow

### Footer
- Two-section: Top = quick links grid (4-col), Bottom = social + copyright
- Newsletter signup: Playful "Get Study Tips!" with cartoon mailbox icon
- Trust badges: "Safe for Kids" certification icons
- Social icons: Rounded squares with brand colors

---

## Images

**Required Images:**

1. **Hero Image** (Large, primary focal point)
   - Description: Bright, illustrated scene of diverse children (ages 8-14) sitting together with laptops and books, animated learning icons (lightbulbs, stars, equations) floating around them
   - Style: Modern flat illustration with gradient shading, vibrant colors
   - Placement: Right side of hero section, takes up 50% width on desktop

2. **Minigame Thumbnails** (4-6 images)
   - Math Adventures: Cartoon numbers on a treasure map
   - Reading Quest: Books forming a magical castle
   - Science Lab: Colorful beakers and atoms
   - History Detective: Magnifying glass over ancient scroll
   - Placement: Grid section below hero

3. **Tutor Profile Photos** (3-4 images)
   - Professional headshots with warm, friendly expressions
   - Diverse representation, bright backgrounds
   - Placement: Tutoring section cards

4. **Parent/Student Testimonials** (2-3 images)
   - Parent testimonials: Professional photos
   - Student testimonials: Fun cartoon avatars or real photos with stickers
   - Placement: Social proof section

5. **Feature Illustrations** (3 images)
   - Live Tutoring: Video call with animated sparkles
   - Progress Tracking: Chart growing upward with celebration confetti
   - Fun Learning: Game controller with educational symbols
   - Placement: Features section, paired with text descriptions

---

## Interactions & Animations

**Minimal, Purposeful Motion:**
- Button hovers: Subtle scale (1.02) with shadow increase
- Card hovers: Gentle lift (-2px translate) with glow
- Page transitions: Smooth fade-in for sections (no aggressive slides)
- Success states: Confetti burst for achievements (lightweight particle effect)
- Loading: Playful bouncing mascot animation

**Accessibility:**
- Respect prefers-reduced-motion
- All animations under 300ms
- Clear focus states with purple outline (2px solid)

---

## Page Structure

1. **Hero**: Large image + headline + dual CTAs + trust indicators
2. **How It Works**: 3-step process with illustrations
3. **Minigames Showcase**: 4-column grid of game cards
4. **Tutoring Features**: 2-column alternating text + illustrations
5. **Progress Dashboard Preview**: Screenshot/mockup with annotations
6. **Pricing Plans**: 3-tier cards (free, starter, premium) with Success Green highlight on recommended
7. **Social Proof**: Mixed parent testimonials + student reviews
8. **Final CTA**: Centered call-to-action with gradient background
9. **Footer**: Comprehensive links + newsletter signup

**Dual Audience Balance:**
- Top sections (Hero, Games): Kid-focused, playful
- Middle sections (Tutoring, Dashboard): Professional, feature-rich
- Bottom sections (Pricing, Testimonials): Parent-focused, trust-building

---

## Dark Mode Specifics

- Maintain bright accent colors (purple, blue, green) at full saturation
- Background: Deep navy (220 25% 12%) instead of pure black
- Cards: Slightly lighter (220 20% 18%) with subtle glow borders
- Images: 90% opacity overlay for cohesion
- Text: Soft white (220 20% 95%) for readability
- Form inputs: Dark with light borders, maintain color accents