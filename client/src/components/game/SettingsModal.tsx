import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { GameSession } from "@shared/schema";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  session?: GameSession;
  onUpdateSettings: (updates: Partial<GameSession>) => void;
  onResetProgress: () => void;
}

export default function SettingsModal({
  open,
  onClose,
  session,
  onUpdateSettings,
  onResetProgress,
}: SettingsModalProps) {
  const [localSettings, setLocalSettings] = useState({
    soundEnabled: session?.soundEnabled ?? true,
    questionsPerSession: session?.questionsPerSession ?? 10,
    timerEnabled: session?.timerEnabled ?? false,
    timerSeconds: session?.timerSeconds ?? 30,
  });

  const handleSave = () => {
    onUpdateSettings(localSettings);
    onClose();
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
      onResetProgress();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display font-bold text-foreground">Settings</DialogTitle>
          <DialogClose className="absolute right-4 top-4">
            <X className="w-6 h-6" />
          </DialogClose>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Sound Effects</label>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <span className="text-foreground">Enable sounds</span>
              <Switch
                checked={localSettings.soundEnabled}
                onCheckedChange={(checked) => 
                  setLocalSettings({ ...localSettings, soundEnabled: checked })
                }
                data-testid="switch-sound"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Questions per Session</label>
            <Select
              value={localSettings.questionsPerSession.toString()}
              onValueChange={(value) => 
                setLocalSettings({ ...localSettings, questionsPerSession: parseInt(value) })
              }
            >
              <SelectTrigger data-testid="select-questions-per-session">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 questions</SelectItem>
                <SelectItem value="20">20 questions</SelectItem>
                <SelectItem value="30">30 questions</SelectItem>
                <SelectItem value="999">Unlimited</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Timer</label>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <span className="text-foreground">Enable timer</span>
                <Switch
                  checked={localSettings.timerEnabled}
                  onCheckedChange={(checked) => 
                    setLocalSettings({ ...localSettings, timerEnabled: checked })
                  }
                  data-testid="switch-timer"
                />
              </div>
              {localSettings.timerEnabled && (
                <Select
                  value={localSettings.timerSeconds.toString()}
                  onValueChange={(value) => 
                    setLocalSettings({ ...localSettings, timerSeconds: parseInt(value) })
                  }
                >
                  <SelectTrigger data-testid="select-timer-seconds">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 seconds</SelectItem>
                    <SelectItem value="60">60 seconds</SelectItem>
                    <SelectItem value="90">90 seconds</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
          
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              onClick={handleSave}
              className="flex-1 bg-primary text-primary-foreground hover:opacity-90"
              data-testid="button-save-settings"
            >
              Save Settings
            </Button>
            <Button
              onClick={handleReset}
              variant="destructive"
              className="flex-1"
              data-testid="button-reset-progress"
            >
              Reset Progress
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
