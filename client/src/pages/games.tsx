import { Link } from "wouter";
import { Play, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import mathImage from "@assets/stock_images/mathematics_numbers__3eb407d2.jpg";
import readingImage from "@assets/stock_images/books_reading_librar_d1be10ed.jpg";
import scienceImage from "@assets/stock_images/science_laboratory_b_ba51ddc7.jpg";

export default function Games() {
  const games = [
    {
      id: "multiplication",
      title: "Math Master",
      description: "Practice multiplication with interactive problems. Choose your difficulty level and improve your mental math skills!",
      image: mathImage,
      path: "/game/multiplication",
      difficulty: "Easy to Expert",
      estimatedTime: "5-15 min",
      skills: ["Multiplication", "Mental Math", "Problem Solving"],
      color: "from-blue-500 to-purple-600",
      available: true,
    },
    {
      id: "reading",
      title: "Reading Quest",
      description: "Build your vocabulary and improve comprehension through word definition challenges.",
      image: readingImage,
      path: "/game/reading-quest",
      difficulty: "Easy to Hard",
      estimatedTime: "5-15 min",
      skills: ["Vocabulary", "Word Meanings", "Language Skills"],
      color: "from-pink-500 to-rose-600",
      available: true,
    },
    {
      id: "science",
      title: "Science Lab",
      description: "Test your science knowledge through fun trivia questions covering biology, chemistry, physics, and more!",
      image: scienceImage,
      path: "/game/science-lab",
      difficulty: "Easy to Hard",
      estimatedTime: "5-15 min",
      skills: ["Science Facts", "Scientific Concepts", "Critical Thinking"],
      color: "from-green-500 to-emerald-600",
      available: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-4" data-testid="text-games-header">
            Educational Minigames
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from our collection of fun, educational games designed to help you learn while having a great time
          </p>
        </div>

        <div className="space-y-8">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              data-testid={`card-game-detail-${game.id}`}
            >
              <div className="grid md:grid-cols-3 gap-6">
                <div className="relative h-64 md:h-auto overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-60`}></div>
                  <img
                    src={game.image}
                    alt={game.title}
                    className="w-full h-full object-cover"
                  />
                  {!game.available && (
                    <div className="absolute top-4 left-4 bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-medium">
                      Coming Soon
                    </div>
                  )}
                </div>

                <div className="md:col-span-2 p-6 flex flex-col justify-between">
                  <div>
                    <h2 className="text-3xl font-display font-bold text-foreground mb-3">
                      {game.title}
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      {game.description}
                    </p>

                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="w-4 h-4 text-primary" />
                        <span>{game.difficulty}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 text-secondary" />
                        <span>{game.estimatedTime}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {game.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {game.available ? (
                    <Link href={game.path}>
                      <Button size="lg" className="w-full sm:w-auto" data-testid={`button-play-${game.id}`}>
                        <Play className="w-5 h-5 mr-2" />
                        Start Playing
                      </Button>
                    </Link>
                  ) : (
                    <Button size="lg" disabled className="w-full sm:w-auto" data-testid={`button-play-${game.id}`}>
                      Coming Soon
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
