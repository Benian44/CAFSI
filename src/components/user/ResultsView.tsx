import { BarChart, TrendingUp, Award, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getUserResults } from '@/lib/storage';
import { User } from '@/types';

interface ResultsViewProps {
  user: User;
}

const ResultsView = ({ user }: ResultsViewProps) => {
  const results = getUserResults(user.id);
  const sortedResults = [...results].sort((a, b) => 
    new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );

  const averageScore = results.length > 0
    ? Math.round(results.reduce((acc, r) => acc + (r.score / r.totalQuestions) * 100, 0) / results.length)
    : 0;

  const bestScore = results.length > 0
    ? Math.max(...results.map(r => Math.round((r.score / r.totalQuestions) * 100)))
    : 0;

  const getScoreBadge = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return <Badge className="bg-green-500">Excellent</Badge>;
    if (percentage >= 70) return <Badge className="bg-blue-500">Bien</Badge>;
    if (percentage >= 50) return <Badge className="bg-orange-500">Moyen</Badge>;
    return <Badge variant="destructive">À revoir</Badge>;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2 animate-fade-in">
        <h1 className="text-3xl font-bold">Mes Résultats</h1>
        <p className="text-muted-foreground">
          Consultez vos performances et votre progression
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quiz Complétés</CardTitle>
            <BarChart className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{results.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Évaluations terminées</p>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Note Moyenne</CardTitle>
            <TrendingUp className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{averageScore}%</div>
            <p className="text-xs text-muted-foreground mt-1">Performance globale</p>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meilleur Score</CardTitle>
            <Award className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{bestScore}%</div>
            <p className="text-xs text-muted-foreground mt-1">Record personnel</p>
          </CardContent>
        </Card>
      </div>

      {/* Results Table */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Historique des Quiz</CardTitle>
          <CardDescription>Tous vos résultats d'évaluation</CardDescription>
        </CardHeader>
        <CardContent>
          {results.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quiz</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedResults.map((result) => {
                    const percentage = Math.round((result.score / result.totalQuestions) * 100);
                    return (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium">{result.quizTitle}</TableCell>
                        <TableCell>{result.score} / {result.totalQuestions}</TableCell>
                        <TableCell>
                          <span className={`font-bold ${percentage >= 70 ? 'text-green-600' : 'text-orange-600'}`}>
                            {percentage}%
                          </span>
                        </TableCell>
                        <TableCell>{getScoreBadge(result.score, result.totalQuestions)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            {new Date(result.completedAt).toLocaleDateString('fr-FR')}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <BarChart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucun résultat</h3>
              <p className="text-muted-foreground">
                Complétez vos premiers quiz pour voir vos résultats ici
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsView;
