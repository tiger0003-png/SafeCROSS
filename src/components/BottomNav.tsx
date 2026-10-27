import React from 'react';
import { Home, Globe, Clock, Settings, Menu } from 'lucide-react';
import { NavigationSection } from '../types/safecross';
import { useSafeCross } from '../context/SafeCrossContext';

interface BottomNavProps {
  onOpenMobileDrawer: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenMobileDrawer }) => {
  const { activeSection, setActiveSection, unreadNotificationCount } = useSafeCross();

  const primaryItems: Array<{
    id: NavigationSection;
    label: string;
    icon: React.ElementType;
  }> = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'scan-url', label: 'Scan URL', icon: Globe },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#101827]/95 backdrop-blur-md border-t border-[#263449] px-2 py-2 flex items-center justify-around"
      aria-label="Mobile Bottom Navigation"
    >
      {primaryItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className="flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-colors cursor-pointer"
            style={{ color: isActive ? '#20D6B5' : '#94A3B8' }}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium tracking-tight">{item.label}</span>
          </button>
        );
      })}

      {/* More / Menu Drawer trigger */}
      <button
        onClick={onOpenMobileDrawer}
        className="flex flex-col items-center justify-center py-1 px-3 text-[#94A3B8] hover:text-[#F8FAFC] rounded-lg transition-colors cursor-pointer relative"
        aria-label="Open secondary navigation menu"
      >
        <Menu className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] font-medium tracking-tight">More</span>
        {unreadNotificationCount > 0 && (
          <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-red-500" />
        )}
      </button>
    </nav>
  );
};
