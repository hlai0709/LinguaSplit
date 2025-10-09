import { Settings } from "lucide-react";

interface AppHeaderProps {
  onOpenSettings: () => void;
}

export default function AppHeader({ onOpenSettings }: AppHeaderProps) {
  return (
    <header className="bg-card shadow-sm border-b border-border sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-3xl">🎯</span>
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">Math Master</h1>
              <p className="text-sm text-muted-foreground">Multiplication Practice</p>
            </div>
          </div>
          <button
            onClick={onOpenSettings}
            className="p-3 rounded-lg hover:bg-muted transition-colors"
            data-testid="button-settings"
          >
            <Settings className="w-6 h-6 text-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
}
