import { Star, Flame, CheckCircle } from "lucide-react";

interface StatsBarProps {
  score: number;
  streak: number;
  correct: number;
}

export default function StatsBar({ score, streak, correct }: StatsBarProps) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <div className="bg-card rounded-xl p-4 shadow-sm border border-border text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Star className="w-5 h-5 text-accent" fill="currentColor" />
          <span className="text-sm font-medium text-muted-foreground">Score</span>
        </div>
        <p className="text-3xl font-display font-bold text-foreground number-display" data-testid="text-score">
          {score}
        </p>
      </div>
      
      <div className="bg-card rounded-xl p-4 shadow-sm border border-border text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-xl streak-flame">🔥</span>
          <span className="text-sm font-medium text-muted-foreground">Streak</span>
        </div>
        <p className="text-3xl font-display font-bold text-secondary number-display" data-testid="text-streak">
          {streak}
        </p>
      </div>
      
      <div className="bg-card rounded-xl p-4 shadow-sm border border-border text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <CheckCircle className="w-5 h-5 text-success" fill="currentColor" />
          <span className="text-sm font-medium text-muted-foreground">Correct</span>
        </div>
        <p className="text-3xl font-display font-bold text-success number-display" data-testid="text-correct">
          {correct}
        </p>
      </div>
    </div>
  );
}
