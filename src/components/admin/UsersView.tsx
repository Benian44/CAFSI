import { useState } from 'react';
import { UserPlus, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getUsers, addUser, deleteUser } from '@/lib/storage';
import { User } from '@/types';
import { toast } from 'sonner';

const UsersView = () => {
  const [users, setUsers] = useState(getUsers().filter(u => u.role === 'user'));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({ id: '', name: '', password: '' });

  const refreshUsers = () => {
    setUsers(getUsers().filter(u => u.role === 'user'));
  };

  const handleCreateUser = () => {
    if (!newUser.id || !newUser.name || !newUser.password) {
      toast.error('Tous les champs sont requis');
      return;
    }

    const existingUser = getUsers().find(u => u.id === newUser.id);
    if (existingUser) {
      toast.error('Cet identifiant existe déjà');
      return;
    }

    const user: User = {
      ...newUser,
      role: 'user',
    };

    addUser(user);
    toast.success(`Utilisateur ${user.name} créé avec succès`);
    setNewUser({ id: '', name: '', password: '' });
    setIsDialogOpen(false);
    refreshUsers();
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${userName} ?`)) {
      deleteUser(userId);
      toast.success(`Utilisateur ${userName} supprimé`);
      refreshUsers();
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center animate-fade-in">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
          <p className="text-muted-foreground">
            Gérez les comptes ASI/APS
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="fire-gradient">
              <UserPlus className="w-4 h-4 mr-2" />
              Créer un Compte
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un Nouvel Utilisateur</DialogTitle>
              <DialogDescription>
                Ajoutez un nouveau compte ASI/APS à la plateforme
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user-id">Identifiant</Label>
                <Input
                  id="user-id"
                  placeholder="asi003"
                  value={newUser.id}
                  onChange={(e) => setNewUser({ ...newUser, id: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-name">Nom Complet</Label>
                <Input
                  id="user-name"
                  placeholder="Pierre Martin"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-password">Mot de Passe</Label>
                <Input
                  id="user-password"
                  type="password"
                  placeholder="••••••••"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button className="fire-gradient" onClick={handleCreateUser}>
                Créer le Compte
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Liste des Utilisateurs</CardTitle>
          <CardDescription>
            {users.length} utilisateur(s) enregistré(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Dernière Connexion</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleString('fr-FR')
                        : 'Jamais connecté'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id, user.name)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Aucun utilisateur enregistré
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersView;
