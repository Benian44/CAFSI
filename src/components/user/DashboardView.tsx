import { BookOpen, FileQuestion, TrendingUp, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { User } from '@/types';
import { getCourses, getQuizzes, getUserResults } from '@/lib/storage';

interface DashboardViewProps {
  user: User;
}

const DashboardView = ({ user }: DashboardViewProps) => {
  const courses = getCourses();
  const quizzes = getQuizzes();
  const results = getUserResults(user.id);

  const completedQuizzes = results.length;
  const averageScore = results.length > 0
    ? Math.round(results.reduce((acc, r) => acc + (r.score / r.totalQuestions) * 100, 0) / results.length)
    : 0;

  const stats = [
    {
      title: 'Cours Disponibles',
      value: courses.length,
      icon: BookOpen,
      description: 'Modules de formation',
      color: 'text-primary',
    },
    {
      title: 'Quiz Complétés',
      value: completedQuizzes,
      icon: FileQuestion,
      description: `sur ${quizzes.length} disponibles`,
      color: 'text-accent',
    },
    {
      title: 'Note Moyenne',
      value: `${averageScore}%`,
      icon: Award,
      description: 'Performance globale',
      color: 'text-secondary',
    },
    {
      title: 'Progression',
      value: `${Math.round((completedQuizzes / quizzes.length) * 100)}%`,
      icon: TrendingUp,
      description: 'Parcours complété',
      color: 'text-primary',
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2 animate-fade-in">
        <h1 className="text-3xl font-bold">
          Bienvenue, {user.name} 👋
        </h1>
        <p className="text-muted-foreground">
          Voici un aperçu de votre progression
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="card-shadow smooth-transition hover:scale-105 animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Progress Section */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Votre Progression</CardTitle>
          <CardDescription>
            Suivez votre avancement dans le programme de formation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Quiz complétés</span>
              <span className="font-semibold">{completedQuizzes} / {quizzes.length}</span>
            </div>
            <Progress value={(completedQuizzes / quizzes.length) * 100} className="h-3" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Performance moyenne</span>
              <span className="font-semibold">{averageScore}%</span>
            </div>
            <Progress value={averageScore} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {results.length > 0 && (
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Derniers Résultats</CardTitle>
            <CardDescription>
              Vos 5 dernières évaluations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.slice(-5).reverse().map((result, index) => {
                const score = Math.round((result.score / result.totalQuestions) * 100);
                return (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{result.quizTitle}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(result.completedAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-bold ${score >= 70 ? 'text-green-600' : 'text-orange-600'}`}>
                        {score}%
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {result.score}/{result.totalQuestions}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardView;
