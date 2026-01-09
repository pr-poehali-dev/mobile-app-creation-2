import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import BottomNav from '@/components/BottomNav';
import { useToast } from '@/hooks/use-toast';

interface SchedulePageProps {
  onNavigate: (page: 'home' | 'schedule' | 'profile') => void;
}

const dates = [
  { date: '10 янв', day: 'ПН', fullDate: '10 янв 2026' },
  { date: '11 янв', day: 'ВТ', fullDate: '11 янв 2026' },
  { date: '12 янв', day: 'СР', fullDate: '12 янв 2026' },
  { date: '13 янв', day: 'ЧТ', fullDate: '13 янв 2026' },
  { date: '14 янв', day: 'ПТ', fullDate: '14 янв 2026' },
  { date: '15 янв', day: 'СБ', fullDate: '15 янв 2026' },
  { date: '16 янв', day: 'ВС', fullDate: '16 янв 2026' },
];

const sessionsData = {
  '10 янв 2026': [
    { id: 1, time: '08:00 - 09:00', trainer: 'Петров А.И.', available: 45 },
    { id: 2, time: '09:00 - 10:00', trainer: 'Сидорова М.В.', available: 38 },
    { id: 3, time: '17:00 - 18:00', trainer: 'Иванов С.П.', available: 12 },
    { id: 4, time: '18:00 - 19:00', trainer: 'Петров А.И.', available: 5 },
  ],
  '11 янв 2026': [
    { id: 5, time: '08:00 - 09:00', trainer: 'Сидорова М.В.', available: 50 },
    { id: 6, time: '17:00 - 18:00', trainer: 'Петров А.И.', available: 23 },
    { id: 7, time: '18:00 - 19:00', trainer: 'Иванов С.П.', available: 8 },
  ],
  '12 янв 2026': [
    { id: 8, time: '08:00 - 09:00', trainer: 'Петров А.И.', available: 42 },
    { id: 9, time: '17:00 - 18:00', trainer: 'Сидорова М.В.', available: 30 },
    { id: 10, time: '18:00 - 19:00', trainer: 'Петров А.И.', available: 0 },
  ],
};

export default function SchedulePage({ onNavigate }: SchedulePageProps) {
  const [selectedDate, setSelectedDate] = useState(dates[0].fullDate);
  const { toast } = useToast();

  const handleBooking = (time: string) => {
    toast({
      title: 'Успешно записано!',
      description: `Вы записаны на сеанс ${time} ${selectedDate}`,
    });
  };

  const sessions = sessionsData[selectedDate as keyof typeof sessionsData] || [];

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

          {sessions.length === 0 ? (
            <Card className="p-8 text-center">
              <Icon name="CalendarX" size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-600">Нет доступных сеансов на эту дату</p>
            </Card>
          ) : (
            sessions.map((session) => (
              <Card
                key={session.id}
                className={`p-4 ${
                  session.available === 0 ? 'opacity-60 bg-gray-50' : 'hover:shadow-md'
                } transition-all`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-semibold text-gray-900">{session.time}</p>
                      <Badge
                        variant={
                          session.available === 0
                            ? 'destructive'
                            : session.available < 10
                            ? 'secondary'
                            : 'default'
                        }
                      >
                        {session.available === 0
                          ? 'Нет мест'
                          : `${session.available} мест`}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Icon name="User" size={14} />
                      Тренер: {session.trainer}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleBooking(session.time)}
                    disabled={session.available === 0}
                    size="sm"
                  >
                    {session.available === 0 ? 'Занято' : 'Записаться'}
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
