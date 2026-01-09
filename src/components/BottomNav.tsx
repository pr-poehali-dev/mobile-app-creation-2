import Icon from '@/components/ui/icon';

interface BottomNavProps {
  currentPage: 'home' | 'schedule' | 'profile';
  onNavigate: (page: 'home' | 'schedule' | 'profile') => void;
}

export default function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  const navItems = [
    { page: 'home' as const, icon: 'Home', label: 'Главная' },
    { page: 'schedule' as const, icon: 'CalendarDays', label: 'Расписание' },
    { page: 'profile' as const, icon: 'User', label: 'Профиль' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.page}
            onClick={() => onNavigate(item.page)}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              currentPage === item.page
                ? 'text-primary'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Icon
              name={item.icon as any}
              size={24}
              className={currentPage === item.page ? 'scale-110' : ''}
            />
            <span className="text-xs mt-1 font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
