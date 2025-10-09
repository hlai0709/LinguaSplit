interface ProgressSectionProps {
  questionsAnswered: number;
  accuracy: number;
  bestStreak: number;
  progressPercentage: number;
}

export default function ProgressSection({
  questionsAnswered,
  accuracy,
  bestStreak,
  progressPercentage,
}: ProgressSectionProps) {
  return (
    <div className="mt-12 bg-card rounded-xl p-6 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold text-foreground">Today's Progress</h3>
        <span className="text-sm text-muted-foreground" data-testid="text-questions-answered">
          {questionsAnswered} questions
        </span>
      </div>
      <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
        <div
          className="progress-bar-fill bg-gradient-to-r from-primary to-secondary h-full rounded-full"
          style={{ width: `${progressPercentage}%` }}
          data-testid="progress-bar"
        ></div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-2xl font-display font-bold text-foreground number-display" data-testid="text-accuracy">
            {accuracy}%
          </p>
          <p className="text-sm text-muted-foreground">Accuracy</p>
        </div>
        <div>
          <p className="text-2xl font-display font-bold text-foreground number-display" data-testid="text-best-streak">
            {bestStreak}
          </p>
          <p className="text-sm text-muted-foreground">Best Streak</p>
        </div>
      </div>
    </div>
  );
}
