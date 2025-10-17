import { Link, useLocation } from "wouter";
import { Home, Gamepad2, BookOpen, Users, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function Navigation() {
  const [location] = useLocation();
  const { user } = useAuth();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/games", label: "Games", icon: Gamepad2 },
    { path: "/tutoring", label: "Tutoring", icon: BookOpen },
    ...(user?.isAdmin ? [{ path: "/admin", label: "Admin", icon: Users }] : []),
  ];

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <nav className="bg-card shadow-md border-b border-border sticky top-0 z-50 backdrop-blur-xl bg-card/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity" data-testid="link-home-logo">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-display font-bold text-primary">
                Homework Help Buddies
              </h1>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = location === item.path || (item.path === "/games" && location.startsWith("/game"));
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                  data-testid={`link-nav-${item.label.toLowerCase()}`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
