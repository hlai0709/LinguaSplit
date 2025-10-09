import type { Achievement } from "@shared/schema";

interface AchievementsSectionProps {
  achievements: Achievement[];
}

const getAchievementBgColor = (color: string) => {
  switch (color) {
    case "accent": return "bg-accent";
    case "secondary": return "bg-secondary";
    case "primary": return "bg-primary";
    default: return "bg-accent";
  }
};

export default function AchievementsSection({ achievements }: AchievementsSectionProps) {
  if (achievements.length === 0) return null;

  return (
    <div className="mt-8 bg-card rounded-xl p-6 shadow-sm border border-border">
      <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
        <span className="text-2xl">🏆</span>
        Recent Achievements
      </h3>
      <div className="space-y-3">
        {achievements.slice(-3).reverse().map((achievement) => (
          <div
            key={achievement.id}
            className="flex items-center gap-4 p-3 bg-muted rounded-lg"
            data-testid={`achievement-${achievement.title.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <div className={`w-12 h-12 ${getAchievementBgColor(achievement.color)} rounded-lg flex items-center justify-center text-2xl`}>
              {achievement.icon}
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">{achievement.title}</p>
              <p className="text-sm text-muted-foreground">{achievement.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
