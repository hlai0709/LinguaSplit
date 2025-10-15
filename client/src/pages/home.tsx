import { Link } from "wouter";
import { Sparkles, Trophy, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@assets/stock_images/diverse_children_stu_562f3eb6.jpg";
import mathImage from "@assets/stock_images/mathematics_numbers__3eb407d2.jpg";
import readingImage from "@assets/stock_images/books_reading_librar_d1be10ed.jpg";
import scienceImage from "@assets/stock_images/science_laboratory_b_ba51ddc7.jpg";

export default function Home() {
  const features = [
    {
      icon: Sparkles,
      title: "Interactive Minigames",
      description: "Learn through fun educational games designed to make studying exciting",
      color: "text-primary",
    },
    {
      icon: Users,
      title: "Weekly Tutoring",
      description: "Track your tutoring sessions and monitor progress week by week",
      color: "text-secondary",
    },
    {
      icon: Trophy,
      title: "Achievements & Rewards",
      description: "Earn badges and unlock rewards as you improve and reach milestones",
      color: "text-accent",
    },
  ];

  const minigames = [
    {
      title: "Math Master",
      description: "Practice multiplication with fun challenges",
      image: mathImage,
      path: "/game/multiplication",
      color: "from-blue-500 to-purple-600",
    },
    {
      title: "Reading Quest",
      description: "Build vocabulary with word definitions",
      image: readingImage,
      path: "/game/reading-quest",
      color: "from-pink-500 to-rose-600",
    },
    {
      title: "Science Lab",
      description: "Test your science knowledge with trivia",
      image: scienceImage,
      path: "/game/science-lab",
      color: "from-green-500 to-emerald-600",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6" data-testid="text-hero-title">
                Learn, Play, and Grow with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  Homework Help Buddies
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8" data-testid="text-hero-subtitle">
                Educational games and tutoring support to make learning fun and effective for students of all ages
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/games">
                  <Button size="lg" className="text-lg px-8" data-testid="button-get-started">
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/tutoring">
                  <Button size="lg" variant="outline" className="text-lg px-8" data-testid="button-track-progress">
                    Track Progress
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl border-8 border-card">
                <img
                  src={heroImage}
                  alt="Students learning together"
                  className="w-full h-auto object-cover"
                  data-testid="img-hero"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-center text-foreground mb-12" data-testid="text-features-title">
            Why Students Love Us
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-card rounded-2xl p-8 border border-border shadow-sm hover:shadow-lg transition-shadow"
                  data-testid={`card-feature-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} bg-opacity-10 flex items-center justify-center mb-6`}>
                    <Icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-2xl font-display font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Minigames Showcase */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4" data-testid="text-games-title">
              Educational Minigames
            </h2>
            <p className="text-lg text-muted-foreground">
              Learn through play with our collection of educational games
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {minigames.map((game) => (
              <Link
                key={game.title}
                href={game.path}
                className={`block bg-card rounded-2xl overflow-hidden border border-border shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all ${
                  game.comingSoon ? "opacity-80" : ""
                }`}
                data-testid={`card-game-${game.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="relative h-48 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-60`}></div>
                  <img
                    src={game.image}
                    alt={game.title}
                    className="w-full h-full object-cover"
                  />
                  {game.comingSoon && (
                    <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
                      Coming Soon
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-display font-semibold text-foreground mb-2">
                    {game.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {game.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-12 text-white">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4" data-testid="text-cta-title">
              Ready to Start Learning?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Join thousands of students who are making learning fun and effective
            </p>
            <Link href="/games">
              <Button size="lg" variant="secondary" className="text-lg px-8" data-testid="button-cta-start">
                Start Playing Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
