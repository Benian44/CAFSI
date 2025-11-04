import { useState } from 'react';
import { ArrowLeft, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { login } from '@/lib/storage';
import { User } from '@/types';
import { toast } from 'sonner';

interface LoginFormProps {
  role: 'user' | 'admin';
  onBack: () => void;
  onSuccess: (user: User) => void;
}

const LoginForm = ({ role, onBack, onSuccess }: LoginFormProps) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const user = login(id, password);
      
      if (user && user.role === role) {
        toast.success(`Bienvenue ${user.name}!`);
        onSuccess(user);
      } else if (user && user.role !== role) {
        toast.error('Identifiants invalides pour ce type de compte');
      } else {
        toast.error('Identifiant ou mot de passe incorrect');
      }
      
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 hero-gradient">
      <Card className="w-full max-w-md card-shadow animate-scale-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">
            {role === 'admin' ? 'Connexion Admin' : 'Connexion ASI/APS'}
          </CardTitle>
          <CardDescription className="text-center">
            Entrez vos identifiants pour accéder à la plateforme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="id">Identifiant</Label>
              <Input
                id="id"
                type="text"
                placeholder={role === 'admin' ? 'admin' : 'asi001'}
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
                className="h-12"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-3 pt-4">
              <Button
                type="submit"
                className="w-full h-12 text-lg font-semibold fire-gradient hover:opacity-90"
                disabled={isLoading}
              >
                <LogIn className="w-5 h-5 mr-2" />
                {isLoading ? 'Connexion...' : 'Se Connecter'}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="w-full h-12"
                onClick={onBack}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
