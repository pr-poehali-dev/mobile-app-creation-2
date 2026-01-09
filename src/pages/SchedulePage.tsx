import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import BottomNav from '@/components/BottomNav';
import { useToast } from '@/hooks/use-toast';
import { bookingsAPI, Session } from '@/config/api';

interface SchedulePageProps {
  userId?: number;
  onNavigate: (page: 'home' | 'schedule' | 'profile') => void;
}

function generateDates() {
  const dates = [];
  const today = new Date();
  const days = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
  const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push({
      date: `${date.getDate()} ${months[date.getMonth()]}`,
      day: days[date.getDay()],
      fullDate: date.toISOString().split('T')[0],
    });
  }
  return dates;
}

export default function SchedulePage({ userId, onNavigate }: SchedulePageProps) {
  const dates = generateDates();
  const [selectedDate, setSelectedDate] = useState(dates[0].fullDate);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSessions();
  }, [selectedDate]);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const result = await bookingsAPI.getSessions(selectedDate);
      if (result.sessions) {
        setSessions(result.sessions);
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить расписание',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (sessionId: number) => {
    if (!userId) {
      toast({
        title: 'Ошибка',
        description: 'Необходимо войти в систему',
        variant: 'destructive',
      });
      return;
    }

    try {
      const result = await bookingsAPI.bookSession(userId, sessionId);
      
      if (result.error) {
        toast({
          title: 'Ошибка бронирования',
          description: result.error === 'No available slots' ? 'Нет свободных мест' : 
                      result.error === 'Already booked' ? 'Вы уже записаны на этот сеанс' : result.error,
          variant: 'destructive',
        });
        return;
      }

      if (result.success) {
        toast({
          title: 'Успешно записано!',
          description: 'Вы успешно записались на сеанс',
        });
        loadSessions();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось записаться на сеанс',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-white to-gray-50">
      <div className="bg-primary text-white p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Icon name="CalendarDays" size={28} />
          Расписание
        </h1>
      </div>

      <div className="p-4 space-y-6">
        <div className="overflow-x-auto -mx-4 px-4">
          <div className="flex gap-2 pb-2">
            {dates.map((item) => (
              <button
                key={item.fullDate}
                onClick={() => setSelectedDate(item.fullDate)}
                className={`flex-shrink-0 w-16 p-3 rounded-xl border-2 transition-all ${
                  selectedDate === item.fullDate
                    ? 'bg-primary text-white border-primary scale-105'
                    : 'bg-white border-gray-200 hover:border-primary/50'
                }`}
              >
                <div className="text-center">
                  <p className="text-xs font-medium mb-1">{item.day}</p>
                  <p className="text-sm font-bold">{item.date}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 animate-fade-in">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Icon name="Clock" size={18} className="text-primary" />
            Доступные сеансы
          </h2>

          {loading ? (
            <Card className="p-8 text-center">
              <p className="text-gray-600">Загрузка...</p>
            </Card>
          ) : sessions.length === 0 ? (
            <Card className="p-8 text-center">
              <Icon name="CalendarX" size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-600">Нет доступных сеансов на эту дату</p>
            </Card>
          ) : (
            sessions.map((session) => (
              <Card
                key={session.id}
                className={`p-4 ${
                  session.available_slots === 0 ? 'opacity-60 bg-gray-50' : 'hover:shadow-md'
                } transition-all`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-semibold text-gray-900">{session.start_time.slice(0, 5)} - {session.end_time.slice(0, 5)}</p>
                      <Badge
                        variant={
                          session.available_slots === 0
                            ? 'destructive'
                            : session.available_slots < 5
                            ? 'secondary'
                            : 'default'
                        }
                      >
                        {session.available_slots === 0
                          ? 'Нет мест'
                          : `${session.available_slots} мест`}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Icon name="User" size={14} />
                      Тренер: {session.trainer_name}
                    </p>
                    {session.specialization && (
                      <p className="text-xs text-gray-500 mt-1">{session.specialization}</p>
                    )}
                  </div>
                  <Button
                    onClick={() => handleBooking(session.id)}
                    disabled={session.available_slots === 0 || !userId}
                    size="sm"
                  >
                    {session.available_slots === 0 ? 'Занято' : 'Записаться'}
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <Icon name="Info" size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-blue-900 mb-1">Информация</p>
              <p className="text-blue-700">
                Максимальная вместимость: 60 человек. Запись доступна за 7 дней.
                Отмена записи возможна за 2 часа до начала сеанса.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <BottomNav currentPage="schedule" onNavigate={onNavigate} />
    </div>
  );
}