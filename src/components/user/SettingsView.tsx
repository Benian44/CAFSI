import { useState } from 'react';
import { Key, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateUser } from '@/lib/storage';
import { User } from '@/types';
import { toast } from 'sonner';

interface SettingsViewProps {
  user: User;
}

const SettingsView = ({ user }: SettingsViewProps) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentPassword !== user.password) {
      toast.error('Mot de passe actuel incorrect');
      return;
    }

    if (newPassword.length < 4) {
      toast.error('Le nouveau mot de passe doit contenir au moins 4 caractères');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      updateUser(user.id, { password: newPassword });
      toast.success('Mot de passe modifié avec succès');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2 animate-fade-in">
        <h1 className="text-3xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground">
          Gérez vos préférences et votre compte
        </p>
      </div>

      {/* Profile Info */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Informations du Profil</CardTitle>
          <CardDescription>Vos informations personnelles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Identifiant</Label>
              <p className="text-lg font-semibold">{user.id}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Nom</Label>
              <p className="text-lg font-semibold">{user.name}</p>
            </div>
          </div>
          {user.lastLogin && (
            <div>
              <Label className="text-muted-foreground">Dernière connexion</Label>
              <p className="text-lg font-semibold">
                {new Date(user.lastLogin).toLocaleString('fr-FR')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="card-shadow">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full fire-gradient flex items-center justify-center">
              <Key className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle>Changer le Mot de Passe</CardTitle>
              <CardDescription>Mettez à jour votre mot de passe de connexion</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Mot de passe actuel</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">Nouveau mot de passe</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={4}
              />
            </div>

            <Button type="submit" className="fire-gradient" disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsView;
