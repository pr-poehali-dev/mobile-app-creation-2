import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import QRCode from '@/components/QRCode';
import BottomNav from '@/components/BottomNav';
import { useToast } from '@/hooks/use-toast';
import { bookingsAPI, Booking, User } from '@/config/api';

interface HomePageProps {
  user: User;
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

export default function HomePage({ user, onNavigate }: HomePageProps) {
  const [showSessions, setShowSessions] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user?.id) {
      loadBookings();
    }
  }, [user]);

  const loadBookings = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const result = await bookingsAPI.getUserBookings(user.id);
      if (result.bookings) {
        setBookings(result.bookings.filter((b: Booking) => b.status === 'active'));
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    try {
      const result = await bookingsAPI.cancelBooking(bookingId);
      
      if (result.error) {
        toast({
          title: 'Ошибка',
          description: result.error,
          variant: 'destructive',
        });
        return;
      }

      if (result.success) {
        toast({
          title: 'Запись отменена',
          description: 'Ваша запись успешно отменена',
        });
        loadBookings();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отменить запись',
        variant: 'destructive',
      });
    }
  };

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
          Добро пожаловать, {user.first_name}!
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
              {loading ? (
                <Card className="p-8 text-center">
                  <p className="text-gray-600">Загрузка...</p>
                </Card>
              ) : bookings.length === 0 ? (
                <Card className="p-8 text-center">
                  <Icon name="Calendar" size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-600">У вас пока нет записей</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => onNavigate('schedule')}
                  >
                    Перейти к расписанию
                  </Button>
                </Card>
              ) : (
                bookings.map((booking) => (
                  <Card key={booking.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {new Date(booking.session_date).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                        <p className="text-sm text-gray-600">
                          {booking.start_time.slice(0, 5)} - {booking.end_time.slice(0, 5)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Тренер: {booking.trainer_name}
                        </p>
                        {booking.specialization && (
                          <p className="text-xs text-gray-400">{booking.specialization}</p>
                        )}
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        Отменить
                      </Button>
                    </div>
                  </Card>
                ))
              )}
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