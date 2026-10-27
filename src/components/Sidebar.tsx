import React from 'react';
import {
  Home,
  Globe,
  FileCode2,
  Clock,
  Bell,
  Smartphone,
  Settings,
  BarChart3,
  HelpCircle,
  Compass,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { NavigationSection } from '../types/safecross';
import { useSafeCross } from '../context/SafeCrossContext';
import { SafeCrossLogo } from './SafeCrossLogo';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileDrawerOpen: boolean;
  onCloseMobileDrawer: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileDrawerOpen,
  onCloseMobileDrawer,
}) => {
  const { activeSection, setActiveSection, unreadNotificationCount, isAdminMode, setIsAdminMode } =
    useSafeCross();

  const navItems: Array<{
    id: NavigationSection;
    label: string;
    icon: React.ElementType;
    badge?: number;
    adminOnly?: boolean;
  }> = [
    { id: 'home', label: 'Home Dashboard', icon: Home },
    { id: 'scan-url', label: 'Scan URL', icon: Globe },
    { id: 'apk-analyzer', label: 'APK Risk Analyzer', icon: FileCode2 },
    { id: 'safe-browsing', label: 'Safe Browsing', icon: Compass },
    { id: 'history', label: 'Threat History', icon: Clock },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotificationCount },
    { id: 'devices', label: 'Connected Devices', icon: Smartphone },
    { id: 'settings', label: 'Security Settings', icon: Settings },
    { id: 'reports', label: 'Security Reports', icon: BarChart3 },
    { id: 'admin', label: 'Admin Dashboard', icon: ShieldAlert },
    { id: 'help', label: 'Help & Architecture', icon: HelpCircle },
  ];

  const handleSelect = (id: NavigationSection) => {
    setActiveSection(id);
    onCloseMobileDrawer();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileDrawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs md:hidden"
          onClick={onCloseMobileDrawer}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen transition-all duration-200 ease-in-out flex flex-col border-r ${
          isMobileDrawerOpen
            ? 'translate-x-0 w-72'
            : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'md:w-20' : 'md:w-64'} bg-[#101827] border-[#263449]`}
      >
        {/* Header / Brand */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#263449] shrink-0">
          <div className="overflow-hidden">
            {!isCollapsed ? (
              <SafeCrossLogo size="md" showTagline={false} />
            ) : (
              <SafeCrossLogo size="sm" showTagline={false} />
            )}
          </div>

          {/* Close for mobile drawer */}
          <button
            onClick={onCloseMobileDrawer}
            className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#151F30]"
            aria-label="Close mobile menu"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Desktop collapse toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#151F30] transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left ${
                  isActive
                    ? 'bg-[#151F30] text-white font-semibold shadow-xs'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#151F30]/60'
                }`}
                style={isActive ? { borderLeft: '3px solid #20D6B5' } : {}}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className="w-4 h-4 shrink-0 transition-colors"
                  style={{ color: isActive ? '#20D6B5' : undefined }}
                />
                {!isCollapsed && (
                  <span className="flex-1 truncate tracking-tight">{item.label}</span>
                )}
                {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
                  <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer: Role Status */}
        <div className="p-3 border-t border-[#263449] shrink-0">
          <div
            className={`p-2.5 rounded-xl bg-[#151F30] border border-[#263449] ${
              isCollapsed ? 'text-center' : ''
            }`}
          >
            {!isCollapsed ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    Mode
                  </div>
                  <div className="text-xs font-semibold text-white flex items-center gap-1.5 mt-0.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: isAdminMode ? '#F59E0B' : '#20D6B5' }}
                    />
                    <span>{isAdminMode ? 'Administrator' : 'Standard User'}</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsAdminMode(!isAdminMode)}
                  className="text-[10px] font-medium text-slate-400 hover:text-teal-300 underline underline-offset-2"
                >
                  Switch
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAdminMode(!isAdminMode)}
                className="w-full text-center"
                title={`Current: ${isAdminMode ? 'Admin' : 'User'}. Click to toggle.`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ backgroundColor: isAdminMode ? '#F59E0B' : '#20D6B5' }}
                />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
