import { useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import HomePage from '@/pages/HomePage';
import SchedulePage from '@/pages/SchedulePage';
import ProfilePage from '@/pages/ProfilePage';

type Page = 'login' | 'register' | 'home' | 'schedule' | 'profile';

const App = () => {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [user, setUser] = useState<{
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  } | null>(null);

  const handleLogin = (email: string) => {
    setUser({
      firstName: 'Иван',
      lastName: 'Иванов',
      phone: '+7 (999) 123-45-67',
      email,
    });
    setCurrentPage('home');
  };

  const handleRegister = (data: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  }) => {
    setUser(data);
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
