import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Games from "@/pages/games";
import Tutoring from "@/pages/tutoring";
import Game from "@/pages/game";
import ReadingQuest from "@/pages/reading-quest";
import ScienceLab from "@/pages/science-lab";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading || !isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  return (
    <>
      <Navigation />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/games" component={Games} />
        <Route path="/tutoring" component={Tutoring} />
        <Route path="/game/multiplication" component={Game} />
        <Route path="/game/reading-quest" component={ReadingQuest} />
        <Route path="/game/science-lab" component={ScienceLab} />
        <Route path="/admin" component={Admin} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
