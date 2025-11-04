import { useState, useEffect } from 'react';
import HomePage from '@/components/HomePage';
import LoginForm from '@/components/LoginForm';
import UserDashboard from '@/components/user/UserDashboard';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { User } from '@/types';
import { getCurrentUser, initializeStorage } from '@/lib/storage';

type Screen = 'home' | 'login-user' | 'login-admin' | 'user-dashboard' | 'admin-dashboard';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Initialize storage on first load
    initializeStorage();

    // Check if user is already logged in
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setCurrentScreen(user.role === 'admin' ? 'admin-dashboard' : 'user-dashboard');
    }
  }, []);

  const handleLoginClick = (role: 'user' | 'admin') => {
    setCurrentScreen(role === 'user' ? 'login-user' : 'login-admin');
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentScreen(user.role === 'admin' ? 'admin-dashboard' : 'user-dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentScreen('home');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  return (
    <div className="min-h-screen">
      {currentScreen === 'home' && (
        <HomePage onLoginClick={handleLoginClick} />
      )}
      
      {currentScreen === 'login-user' && (
        <LoginForm
          role="user"
          onBack={handleBackToHome}
          onSuccess={handleLoginSuccess}
        />
      )}
      
      {currentScreen === 'login-admin' && (
        <LoginForm
          role="admin"
          onBack={handleBackToHome}
          onSuccess={handleLoginSuccess}
        />
      )}
      
      {currentScreen === 'user-dashboard' && currentUser && (
        <UserDashboard user={currentUser} onLogout={handleLogout} />
      )}
      
      {currentScreen === 'admin-dashboard' && currentUser && (
        <AdminDashboard user={currentUser} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default Index;
