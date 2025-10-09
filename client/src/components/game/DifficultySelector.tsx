interface DifficultySelectorProps {
  difficulty: string;
  onChange: (difficulty: string) => void;
}

const difficulties = [
  { key: "easy", label: "Easy (1-5)" },
  { key: "medium", label: "Medium (1-10)" },
  { key: "hard", label: "Hard (1-12)" },
  { key: "expert", label: "Expert (1-20)" },
];

export default function DifficultySelector({ difficulty, onChange }: DifficultySelectorProps) {
  return (
    <div className="bg-card rounded-xl p-4 shadow-sm border border-border mb-8">
      <label className="block text-sm font-medium text-foreground mb-3">Difficulty Level</label>
      <div className="flex gap-2 flex-wrap">
        {difficulties.map((diff) => (
          <button
            key={diff.key}
            onClick={() => onChange(diff.key)}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              difficulty === diff.key
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground"
            }`}
            data-testid={`button-difficulty-${diff.key}`}
          >
            {diff.label}
          </button>
        ))}
      </div>
    </div>
  );
}
