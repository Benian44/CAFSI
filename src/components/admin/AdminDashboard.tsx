import { useState } from 'react';
import { LogOut, LayoutDashboard, Users, BookOpen, FileQuestion, BarChart3, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User } from '@/types';
import { logout } from '@/lib/storage';
import DashboardView from './DashboardView';
import UsersView from './UsersView';
import CoursesManagement from './CoursesManagement';
import QuizzesManagement from './QuizzesManagement';
import ReportsView from './ReportsView';
import SettingsView from './SettingsView';
import { toast } from 'sonner';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

type View = 'dashboard' | 'users' | 'courses' | 'quizzes' | 'reports' | 'settings';

const AdminDashboard = ({ user, onLogout }: AdminDashboardProps) => {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const handleLogout = () => {
    logout();
    toast.success('Déconnexion réussie');
    onLogout();
  };

  const menuItems = [
    { id: 'dashboard' as View, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users' as View, label: 'Utilisateurs', icon: Users },
    { id: 'courses' as View, label: 'Cours', icon: BookOpen },
    { id: 'quizzes' as View, label: 'Quiz', icon: FileQuestion },
    { id: 'reports' as View, label: 'Rapports', icon: BarChart3 },
    { id: 'settings' as View, label: 'Paramètres', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-50 card-shadow">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold fire-gradient bg-clip-text text-transparent">
              CAFSI MINDSET - Admin
            </h1>
            <span className="text-muted-foreground hidden md:inline">
              • {user.name}
            </span>
          </div>
          
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Déconnexion</span>
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r hidden md:block">
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? 'default' : 'ghost'}
                  className={`w-full justify-start ${
                    currentView === item.id ? 'fire-gradient' : ''
                  }`}
                  onClick={() => setCurrentView(item.id)}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t z-50">
          <div className="flex justify-around p-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? 'default' : 'ghost'}
                  size="sm"
                  className={currentView === item.id ? 'fire-gradient' : ''}
                  onClick={() => setCurrentView(item.id)}
                >
                  <Icon className="w-5 h-5" />
                </Button>
              );
            })}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-auto pb-20 md:pb-0">
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'users' && <UsersView />}
          {currentView === 'courses' && <CoursesManagement />}
          {currentView === 'quizzes' && <QuizzesManagement />}
          {currentView === 'reports' && <ReportsView />}
          {currentView === 'settings' && <SettingsView />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
