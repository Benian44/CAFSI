import { Flame, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-firefighters.jpg';

interface HomePageProps {
  onLoginClick: (role: 'user' | 'admin') => void;
}

const HomePage = ({ onLoginClick }: HomePageProps) => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 hero-gradient opacity-70" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-8 animate-fade-in">
          {/* Logo & Title */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Flame className="w-16 h-16 text-white animate-pulse" />
              <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight">
                CAFSI
              </h1>
              <Flame className="w-16 h-16 text-white animate-pulse" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              MINDSET
            </h2>
            <p className="text-xl md:text-2xl text-white/90 font-medium">
              Formation et Évaluation pour ASI/APS
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-6 pt-8 animate-slide-up">
            <Button
              size="lg"
              onClick={() => onLoginClick('user')}
              className="h-20 px-12 text-xl font-bold bg-white hover:bg-white/90 text-primary fire-gradient border-4 border-white/50 glow-effect smooth-transition hover:scale-105"
            >
              <Shield className="w-8 h-8 mr-3" />
              Connexion ASI/APS
            </Button>
            
            <Button
              size="lg"
              onClick={() => onLoginClick('admin')}
              className="h-20 px-12 text-xl font-bold bg-accent hover:bg-accent/90 text-white border-4 border-white/30 glow-effect smooth-transition hover:scale-105"
            >
              <Flame className="w-8 h-8 mr-3" />
              Administrateur
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent z-0" />
    </div>
  );
};

export default HomePage;
