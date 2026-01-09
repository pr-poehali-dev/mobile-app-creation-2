import { useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import HomePage from '@/pages/HomePage';
import SchedulePage from '@/pages/SchedulePage';
import ProfilePage from '@/pages/ProfilePage';
import { User } from '@/config/api';

type Page = 'login' | 'register' | 'home' | 'schedule' | 'profile';

const App = () => {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentPage('home');
  };

  const handleRegister = (userData: User) => {
    setUser(userData);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-white">
        {currentPage === 'login' && (
          <LoginPage
            onLogin={handleLogin}
            onNavigateToRegister={() => setCurrentPage('register')}
          />
        )}
        {currentPage === 'register' && (
          <RegisterPage
            onRegister={handleRegister}
            onNavigateToLogin={() => setCurrentPage('login')}
          />
        )}
        {currentPage === 'home' && user && (
          <HomePage
            user={user}
            onNavigate={setCurrentPage}
          />
        )}
        {currentPage === 'schedule' && user && (
          <SchedulePage
            userId={user.id}
            onNavigate={setCurrentPage}
          />
        )}
        {currentPage === 'profile' && user && (
          <ProfilePage
            user={user}
            onNavigate={setCurrentPage}
            onLogout={handleLogout}
          />
        )}
        <Toaster />
        <Sonner />
      </div>
    </TooltipProvider>
  );
};

export default App;