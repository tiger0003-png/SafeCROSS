import React from 'react';
import { Bell, Sun, Moon, ShieldCheck, Menu, ShieldAlert } from 'lucide-react';
import { useSafeCross } from '../context/SafeCrossContext';
import { SafeCrossLogo } from './SafeCrossLogo';

interface AppHeaderProps {
  onOpenMobileDrawer: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onOpenMobileDrawer }) => {
  const {
    unreadNotificationCount,
    setActiveSection,
    settings,
    toggleTheme,
    isAdminMode,
    setIsAdminMode,
  } = useSafeCross();

  return (
    <header className="sticky top-0 z-20 h-16 bg-[#101827]/90 dark:bg-[#101827]/90 backdrop-blur-md border-b border-[#263449] px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger + Greeting / Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileDrawer}
          className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#151F30]"
          aria-label="Open navigation drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <h1 className="text-sm font-bold text-[#F8FAFC] tracking-tight">
            Your digital safety, at a glance.
          </h1>
          <p className="text-[11px] text-[#94A3B8] font-normal">
            SafeCross Threat Intelligence · Smart Protection. Safer Digital Life.
          </p>
        </div>

        <div className="sm:hidden">
          <SafeCrossLogo size="sm" showTagline={false} />
        </div>
      </div>

      {/* Right Controls: Notifications, Theme, Admin Mode badge */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Admin toggle badge */}
        <button
          onClick={() => {
            setIsAdminMode(!isAdminMode);
            if (!isAdminMode) setActiveSection('admin');
          }}
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium border transition-colors cursor-pointer ${
            isAdminMode
              ? 'bg-amber-500/10 border-amber-500/50 text-amber-300 hover:bg-amber-500/20'
              : 'bg-[#151F30] border-[#263449] text-slate-400 hover:text-slate-200'
          }`}
          title="Toggle Administrator Simulation Mode"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>{isAdminMode ? 'Admin View: ON' : 'Admin Demo'}</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-[#151F30] transition-colors cursor-pointer"
          title={settings.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle colour theme"
        >
          {settings.theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-teal-300" />
          )}
        </button>

        {/* Notifications Bell */}
        <button
          onClick={() => setActiveSection('notifications')}
          className="relative p-2 text-slate-400 hover:text-white rounded-xl hover:bg-[#151F30] transition-colors cursor-pointer"
          title="Security Notifications"
          aria-label="View security notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
        </button>

        {/* Settings shortcut */}
        <button
          onClick={() => setActiveSection('settings')}
          className="hidden sm:flex items-center gap-2 p-1.5 pl-2 pr-3 rounded-xl bg-[#151F30] border border-[#263449] hover:border-slate-700 transition-colors text-xs text-slate-300 cursor-pointer"
          title="Security Settings"
        >
          <div className="w-5 h-5 rounded-md bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-[10px]">
            SC
          </div>
          <span className="font-medium text-[11px]">Settings</span>
        </button>
      </div>
    </header>
  );
};
