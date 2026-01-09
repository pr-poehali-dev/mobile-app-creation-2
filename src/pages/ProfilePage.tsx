import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import QRCode from '@/components/QRCode';
import BottomNav from '@/components/BottomNav';

interface ProfilePageProps {
  user: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
  onNavigate: (page: 'home' | 'schedule' | 'profile') => void;
  onLogout: () => void;
}

const stats = [
  { label: 'Всего посещений', value: '24', icon: 'Activity' },
  { label: 'В этом месяце', value: '8', icon: 'Calendar' },
  { label: 'Пропущено', value: '2', icon: 'XCircle' },
];

export default function ProfilePage({ user, onNavigate, onLogout }: ProfilePageProps) {
  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-white to-gray-50">
      <div className="bg-primary text-white p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Icon name="User" size={28} />
          Профиль
        </h1>
      </div>

      <div className="p-4 space-y-6 animate-fade-in">
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="User" size={32} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {user.lastName} {user.firstName}
              </h2>
              <p className="text-sm text-gray-600">Студент ТОГУ</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Icon name="Mail" size={16} className="text-gray-400" />
              <span className="text-gray-700">{user.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Icon name="Phone" size={16} className="text-gray-400" />
              <span className="text-gray-700">{user.phone}</span>
            </div>
          </div>
        </Card>

        <section>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Icon name="BarChart3" size={20} className="text-primary" />
            Статистика посещений
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {stats.map((stat) => (
              <Card key={stat.label} className="p-4 text-center">
                <Icon
                  name={stat.icon as any}
                  size={24}
                  className="mx-auto text-primary mb-2"
                />
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Icon name="QrCode" size={20} className="text-primary" />
            Студенческий пропуск
          </h2>
          <Card className="p-6">
            <QRCode value={`STUDENT:${user.email}`} />
            <div className="mt-4 text-center">
              <p className="text-sm font-semibold text-gray-900">
                {user.lastName} {user.firstName}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Тихоокеанский государственный университет
              </p>
            </div>
          </Card>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Icon name="Settings" size={20} className="text-primary" />
            Настройки
          </h2>
          
          <Card className="p-4">
            <button className="w-full flex items-center justify-between text-left">
              <div className="flex items-center gap-3">
                <Icon name="Bell" size={20} className="text-gray-600" />
                <span className="text-gray-900">Уведомления</span>
              </div>
              <Icon name="ChevronRight" size={20} className="text-gray-400" />
            </button>
          </Card>

          <Card className="p-4">
            <button className="w-full flex items-center justify-between text-left">
              <div className="flex items-center gap-3">
                <Icon name="CreditCard" size={20} className="text-gray-600" />
                <span className="text-gray-900">Способы оплаты</span>
              </div>
              <Icon name="ChevronRight" size={20} className="text-gray-400" />
            </button>
          </Card>

          <Card className="p-4">
            <button className="w-full flex items-center justify-between text-left">
              <div className="flex items-center gap-3">
                <Icon name="HelpCircle" size={20} className="text-gray-600" />
                <span className="text-gray-900">Помощь и поддержка</span>
              </div>
              <Icon name="ChevronRight" size={20} className="text-gray-400" />
            </button>
          </Card>

          <Button
            variant="outline"
            className="w-full text-red-600 border-red-200 hover:bg-red-50"
            onClick={onLogout}
          >
            <Icon name="LogOut" size={20} className="mr-2" />
            Выйти из аккаунта
          </Button>
        </section>
      </div>

      <BottomNav currentPage="profile" onNavigate={onNavigate} />
    </div>
  );
}
