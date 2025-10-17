import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Brain, FlaskConical, GraduationCap } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <GraduationCap className="h-20 w-20 text-purple-600 dark:text-purple-400" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Homework Help Buddies
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Fun educational games and tutoring session tracking to help students learn and grow!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="border-2 hover:border-purple-400 transition-colors">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Brain className="h-12 w-12 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-center">Math Master</CardTitle>
              <CardDescription className="text-center">
                Practice multiplication with fun challenges and track your progress
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-pink-400 transition-colors">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <BookOpen className="h-12 w-12 text-pink-600 dark:text-pink-400" />
              </div>
              <CardTitle className="text-center">Reading Quest</CardTitle>
              <CardDescription className="text-center">
                Build vocabulary skills by matching words with definitions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-blue-400 transition-colors">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <FlaskConical className="h-12 w-12 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-center">Science Lab</CardTitle>
              <CardDescription className="text-center">
                Test your science knowledge with exciting trivia questions
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="max-w-xl mx-auto border-2 border-purple-200 dark:border-purple-700">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Ready to Start Learning?</CardTitle>
            <CardDescription className="text-center">
              Sign in to access all games, track your progress, and manage tutoring sessions
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Button 
              size="lg" 
              className="w-full max-w-sm bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              onClick={handleLogin}
              data-testid="button-login"
            >
              Sign In to Get Started
            </Button>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Sign in with Google, GitHub, or email
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
