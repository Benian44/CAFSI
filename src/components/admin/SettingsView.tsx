import { useState } from 'react';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getSettings, saveSettings } from '@/lib/storage';
import { toast } from 'sonner';

const SettingsView = () => {
  const [settings, setSettings] = useState(getSettings());
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      saveSettings(settings);
      toast.success('Paramètres enregistrés avec succès');
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2 animate-fade-in">
        <h1 className="text-3xl font-bold">Paramètres de l'Application</h1>
        <p className="text-muted-foreground">
          Configurez les paramètres globaux de la plateforme
        </p>
      </div>

      <Card className="card-shadow">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full fire-gradient flex items-center justify-center">
              <SettingsIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle>Paramètres Généraux</CardTitle>
              <CardDescription>Personnalisez l'apparence de l'application</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="app-name">Nom de l'Application</Label>
            <Input
              id="app-name"
              value={settings.appName}
              onChange={(e) => setSettings({ ...settings, appName: e.target.value })}
              placeholder="CAFSI MINDSET"
            />
            <p className="text-sm text-muted-foreground">
              Ce nom apparaîtra en en-tête de l'application
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo-url">URL du Logo</Label>
            <Input
              id="logo-url"
              value={settings.logoUrl}
              onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
              placeholder="https://exemple.com/logo.png"
            />
            <p className="text-sm text-muted-foreground">
              Entrez l'URL d'une image pour personnaliser le logo (optionnel)
            </p>
          </div>

          {settings.logoUrl && (
            <div className="p-4 border rounded-lg">
              <Label className="mb-2 block">Aperçu du Logo</Label>
              <img 
                src={settings.logoUrl} 
                alt="Logo preview" 
                className="max-h-20 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  toast.error('Impossible de charger l\'image');
                }}
              />
            </div>
          )}

          <Button onClick={handleSave} className="fire-gradient" disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Enregistrement...' : 'Enregistrer les Paramètres'}
          </Button>
        </CardContent>
      </Card>

      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Informations</CardTitle>
          <CardDescription>À propos de cette plateforme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-semibold">Version</p>
              <p className="text-muted-foreground">1.0.0</p>
            </div>
            <div>
              <p className="font-semibold">Plateforme</p>
              <p className="text-muted-foreground">CAFSI MINDSET - Formation ASI/APS</p>
            </div>
            <div>
              <p className="font-semibold">Stockage</p>
              <p className="text-muted-foreground">LocalStorage (navigateur)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsView;
