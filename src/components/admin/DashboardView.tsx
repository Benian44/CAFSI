import { Users, BookOpen, FileQuestion, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getUsers, getCourses, getQuizzes, getResults } from '@/lib/storage';

const DashboardView = () => {
  const users = getUsers().filter(u => u.role === 'user');
  const courses = getCourses();
  const quizzes = getQuizzes();
  const results = getResults();

  const averageScore = results.length > 0
    ? Math.round(results.reduce((acc, r) => acc + (r.score / r.totalQuestions) * 100, 0) / results.length)
    : 0;

  const stats = [
    {
      title: 'Utilisateurs ASI/APS',
      value: users.length,
      icon: Users,
      description: 'Comptes actifs',
      color: 'text-primary',
    },
    {
      title: 'Cours Disponibles',
      value: courses.length,
      icon: BookOpen,
      description: 'Modules de formation',
      color: 'text-accent',
    },
    {
      title: 'Quiz Créés',
      value: quizzes.length,
      icon: FileQuestion,
      description: 'Évaluations disponibles',
      color: 'text-secondary',
    },
    {
      title: 'Note Moyenne',
      value: `${averageScore}%`,
      icon: TrendingUp,
      description: 'Performance globale',
      color: 'text-primary',
    },
  ];

  const recentActivity = users
    .filter(u => u.lastLogin)
    .sort((a, b) => new Date(b.lastLogin!).getTime() - new Date(a.lastLogin!).getTime())
    .slice(0, 5);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2 animate-fade-in">
        <h1 className="text-3xl font-bold">Tableau de Bord</h1>
        <p className="text-muted-foreground">
          Vue d'ensemble de la plateforme CAFSI MINDSET
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

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Activité Récente</CardTitle>
            <CardDescription>Dernières connexions des utilisateurs</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.id}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(user.lastLogin!).toLocaleString('fr-FR')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Aucune activité récente
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Statistiques</CardTitle>
            <CardDescription>Aperçu de la performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Évaluations complétées</span>
                <span className="font-semibold">{results.length}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Taux de réussite moyen</span>
                <span className="font-semibold">{averageScore}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Cours par utilisateur</span>
                <span className="font-semibold">{users.length > 0 ? (courses.length / users.length).toFixed(1) : 0}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Quiz par utilisateur</span>
                <span className="font-semibold">{users.length > 0 ? (results.length / users.length).toFixed(1) : 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;
