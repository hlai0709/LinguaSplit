interface QuestionCardProps {
  num1: number;
  num2: number;
  loading?: boolean;
}

export default function QuestionCard({ num1, num2, loading = false }: QuestionCardProps) {
  return (
    <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 sm:p-12 shadow-xl mb-8 text-center fade-in">
      <p className="text-white/80 text-lg sm:text-xl font-medium mb-6">What is</p>
      <div className="flex items-center justify-center gap-6 mb-8">
        <span className="text-5xl sm:text-7xl font-display font-bold text-white number-display" data-testid="text-num1">
          {loading ? "?" : num1}
        </span>
        <span className="text-4xl sm:text-6xl font-display font-bold text-white/90">×</span>
        <span className="text-5xl sm:text-7xl font-display font-bold text-white number-display" data-testid="text-num2">
          {loading ? "?" : num2}
        </span>
      </div>
      <div className="w-24 h-1 bg-white/30 mx-auto rounded-full"></div>
    </div>
  );
}
