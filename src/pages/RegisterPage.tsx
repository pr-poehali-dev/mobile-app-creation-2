import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

interface RegisterPageProps {
  onRegister: (data: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  }) => void;
  onNavigateToLogin: () => void;
}

export default function RegisterPage({ onRegister, onNavigateToLogin }: RegisterPageProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
            <h1 className="text-2xl font-bold text-gray-900">Регистрация</h1>
            <p className="text-sm text-gray-600 mt-1">Создайте аккаунт PacificPool</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lastName">Фамилия</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              placeholder="Иванов"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstName">Имя</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              placeholder="Иван"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Номер телефона</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+7 (999) 123-45-67"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="ivan.ivanov@student.pnu.edu.ru"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <Button type="submit" className="w-full" size="lg">
            Зарегистрироваться
          </Button>
        </form>

        <div className="text-center">
          <button
            onClick={onNavigateToLogin}
            className="text-sm text-primary hover:underline"
          >
            Уже есть аккаунт? Войти
          </button>
        </div>
      </Card>
    </div>
  );
}
