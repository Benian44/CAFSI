import { useState } from 'react';
import { Search, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getUsers, getUserResults } from '@/lib/storage';
import { toast } from 'sonner';

const ReportsView = () => {
  const [userId, setUserId] = useState('');
  const [searchedUser, setSearchedUser] = useState<{ id: string; name: string } | null>(null);
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = () => {
    if (!userId) {
      toast.error('Entrez un ID utilisateur');
      return;
    }

    const users = getUsers();
    const user = users.find(u => u.id === userId && u.role === 'user');

    if (!user) {
      toast.error('Utilisateur non trouvé');
      setSearchedUser(null);
      setResults([]);
      return;
    }

    const userResults = getUserResults(userId);
    setSearchedUser({ id: user.id, name: user.name });
    setResults(userResults);
    
    if (userResults.length === 0) {
      toast.info('Aucun résultat pour cet utilisateur');
    } else {
      toast.success(`${userResults.length} résultat(s) trouvé(s)`);
    }
  };

  const handleExport = () => {
    if (results.length === 0) {
      toast.error('Aucune donnée à exporter');
      return;
    }

    const csvContent = [
      ['Quiz', 'Score', 'Total', 'Pourcentage', 'Date'].join(','),
      ...results.map(r => [
        r.quizTitle,
        r.score,
        r.totalQuestions,
        `${Math.round((r.score / r.totalQuestions) * 100)}%`,
        new Date(r.completedAt).toLocaleDateString('fr-FR')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport_${searchedUser?.id}_${Date.now()}.csv`;
    a.click();
    
    toast.success('Rapport exporté');
  };

  const getScoreBadge = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return <Badge className="bg-green-500">Excellent</Badge>;
    if (percentage >= 70) return <Badge className="bg-blue-500">Bien</Badge>;
    if (percentage >= 50) return <Badge className="bg-orange-500">Moyen</Badge>;
    return <Badge variant="destructive">À revoir</Badge>;
  };

  const averageScore = results.length > 0
    ? Math.round(results.reduce((acc, r) => acc + (r.score / r.totalQuestions) * 100, 0) / results.length)
    : 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2 animate-fade-in">
        <h1 className="text-3xl font-bold">Rapports Utilisateurs</h1>
        <p className="text-muted-foreground">
          Consultez les résultats détaillés de chaque utilisateur
        </p>
      </div>

      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Rechercher un Utilisateur</CardTitle>
          <CardDescription>
            Entrez l'ID d'un utilisateur pour voir ses résultats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="user-search">ID Utilisateur</Label>
              <Input
                id="user-search"
                placeholder="asi001"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch} className="fire-gradient">
                <Search className="w-4 h-4 mr-2" />
                Rechercher
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {searchedUser && (
        <>
          <Card className="card-shadow">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Résultats de {searchedUser.name}</CardTitle>
                  <CardDescription>ID: {searchedUser.id}</CardDescription>
                </div>
                {results.length > 0 && (
                  <Button onClick={handleExport} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Exporter CSV
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {results.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Quiz Complétés</p>
                      <p className="text-2xl font-bold">{results.length}</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Note Moyenne</p>
                      <p className="text-2xl font-bold">{averageScore}%</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Taux de Réussite</p>
                      <p className="text-2xl font-bold">
                        {results.filter(r => (r.score / r.totalQuestions) * 100 >= 70).length}/{results.length}
                      </p>
                    </div>
                  </div>

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
                        {results.map((result) => {
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
                                {new Date(result.completedAt).toLocaleDateString('fr-FR')}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  Aucun résultat pour cet utilisateur
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ReportsView;
