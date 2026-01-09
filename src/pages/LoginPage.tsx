import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

interface LoginPageProps {
  onLogin: (email: string) => void;
  onNavigateToRegister: () => void;
}

export default function LoginPage({ onLogin, onNavigateToRegister }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-white to-gray-50">
      <Card className="w-full max-w-md p-8 space-y-6 animate-fade-in">
        <div className="flex flex-col items-center space-y-4">
          <img
            src="https://cdn.poehali.dev/files/i (1).jpeg"
            alt="ТОГУ"
            className="w-24 h-24 object-contain rounded-2xl"
          />
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">PacificPool</h1>
            <p className="text-sm text-gray-600 mt-1">Бассейн ТОГУ</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Логин или Email</Label>
            <Input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ivan.ivanov@student.pnu.edu.ru"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <Button type="submit" className="w-full" size="lg">
            Войти
          </Button>
        </form>

        <div className="text-center">
          <button
            onClick={onNavigateToRegister}
            className="text-sm text-primary hover:underline"
          >
            Нет аккаунта? Зарегистрироваться
          </button>
        </div>
      </Card>
    </div>
  );
}
