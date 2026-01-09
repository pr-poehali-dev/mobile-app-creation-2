import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import QRCode from '@/components/QRCode';
import BottomNav from '@/components/BottomNav';

interface HomePageProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  onNavigate: (page: 'home' | 'schedule' | 'profile') => void;
}

const newsData = [
  {
    id: 1,
    title: 'Новое расписание на январь',
    content: 'С 15 января обновленное расписание занятий. Больше вечерних сеансов!',
    date: '10 янв 2026',
    type: 'pool',
  },
  {
    id: 2,
    title: 'ТОГУ в топ-100 вузов России',
    content: 'Университет занял высокое место в рейтинге технических вузов страны.',
    date: '8 янв 2026',
    type: 'university',
  },
];

const specialOffers = [
  {
    id: 1,
    title: 'Скидка 20% на абонемент',
    description: 'Специальное предложение для студентов при покупке абонемента на месяц',
    discount: '-20%',
  },
  {
    id: 2,
    title: 'Бесплатное первое занятие',
    description: 'Приведи друга - получи бесплатное занятие в подарок',
    discount: 'FREE',
  },
];

const userSessions = [
  {
    id: 1,
    date: '12 янв 2026',
    time: '18:00 - 19:00',
    trainer: 'Петров А.И.',
  },
  {
    id: 2,
    date: '14 янв 2026',
    time: '17:00 - 18:00',
    trainer: 'Сидорова М.В.',
  },
];

export default function HomePage({ user, onNavigate }: HomePageProps) {
  const [showSessions, setShowSessions] = useState(false);

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-white to-gray-50">
      <div className="bg-primary text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">PacificPool</h1>
          <button
            onClick={() => onNavigate('profile')}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <Icon name="User" size={24} />
          </button>
        </div>
        <p className="text-white/90">
          Добро пожаловать, {user.firstName}!
        </p>
      </div>

      <div className="p-4 space-y-6 animate-fade-in">
        <section>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Icon name="Newspaper" size={20} className="text-primary" />
            Новости
          </h2>
          <div className="space-y-3">
            {newsData.map((news) => (
              <Card key={news.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{news.title}</h3>
                  <Badge variant={news.type === 'pool' ? 'default' : 'secondary'}>
                    {news.type === 'pool' ? 'Бассейн' : 'ТОГУ'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{news.content}</p>
                <p className="text-xs text-gray-400">{news.date}</p>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Icon name="Tag" size={20} className="text-primary" />
            Специальные предложения
          </h2>
          <div className="space-y-3">
            {specialOffers.map((offer) => (
              <Card key={offer.id} className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                <div className="flex items-start gap-3">
                  <div className="bg-primary text-white font-bold px-3 py-1 rounded-lg text-sm">
                    {offer.discount}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{offer.title}</h3>
                    <p className="text-sm text-gray-600">{offer.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Icon name="Calendar" size={20} className="text-primary" />
              Ваши сеансы
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSessions(!showSessions)}
            >
              {showSessions ? 'Скрыть' : 'Показать'}
            </Button>
          </div>

          {showSessions && (
            <div className="space-y-3 animate-fade-in">
              {userSessions.map((session) => (
                <Card key={session.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{session.date}</p>
                      <p className="text-sm text-gray-600">{session.time}</p>
                      <p className="text-sm text-gray-500">Тренер: {session.trainer}</p>
                    </div>
                    <Button variant="destructive" size="sm">
                      Отменить
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Icon name="QrCode" size={20} className="text-primary" />
            Ваш пропуск
          </h2>
          <Card className="p-6">
            <QRCode value={`STUDENT:${user.email}`} />
            <p className="text-center text-sm text-gray-600 mt-4">
              Покажите этот QR-код на входе
            </p>
          </Card>
        </section>
      </div>

      <BottomNav currentPage="home" onNavigate={onNavigate} />
    </div>
  );
}
