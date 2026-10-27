import React, { useState } from 'react';
import { SafeCrossProvider, useSafeCross } from './context/SafeCrossContext';
import { Sidebar } from './components/Sidebar';
import { AppHeader } from './components/AppHeader';
import { BottomNav } from './components/BottomNav';

// Views
import { HomeDashboardView } from './views/HomeDashboardView';
import { ScanUrlView } from './views/ScanUrlView';
import { ApkAnalyzerView } from './views/ApkAnalyzerView';
import { SafeBrowsingView } from './views/SafeBrowsingView';
import { ThreatHistoryView } from './views/ThreatHistoryView';
import { NotificationsView } from './views/NotificationsView';
import { DevicesView } from './views/DevicesView';
import { SecuritySettingsView } from './views/SecuritySettingsView';
import { ReportsView } from './views/ReportsView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { HelpAboutView } from './views/HelpAboutView';

const SafeCrossAppContent: React.FC = () => {
  const { activeSection, settings, toast } = useSafeCross();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const isLight = settings.theme === 'light';

  return (
    <div
      className={`min-h-screen flex flex-row font-sans transition-colors duration-200 ${
        isLight ? 'bg-slate-100 text-slate-900 light' : 'bg-[#0B1220] text-[#F8FAFC] dark'
      }`}
    >
      {/* Desktop Collapsible Left Sidebar + Mobile Navigation Drawer */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileDrawerOpen={isMobileDrawerOpen}
        onCloseMobileDrawer={() => setIsMobileDrawerOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Sticky Header */}
        <AppHeader onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)} />

        {/* Dynamic Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-10">
          {activeSection === 'home' && <HomeDashboardView />}
          {activeSection === 'scan-url' && <ScanUrlView />}
          {activeSection === 'apk-analyzer' && <ApkAnalyzerView />}
          {activeSection === 'safe-browsing' && <SafeBrowsingView />}
          {activeSection === 'history' && <ThreatHistoryView />}
          {activeSection === 'notifications' && <NotificationsView />}
          {activeSection === 'devices' && <DevicesView />}
          {activeSection === 'settings' && <SecuritySettingsView />}
          {activeSection === 'reports' && <ReportsView />}
          {activeSection === 'admin' && <AdminDashboardView />}
          {activeSection === 'help' && <HelpAboutView />}
        </main>

        {/* Global Toast Notification */}
        {toast && (
          <div className="fixed bottom-18 md:bottom-6 right-4 sm:right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div
              className={`px-4 py-2.5 rounded-xl shadow-xl text-xs font-medium flex items-center gap-2 border ${
                toast.type === 'success'
                  ? 'bg-emerald-950/90 text-emerald-200 border-emerald-700/80'
                  : toast.type === 'error'
                  ? 'bg-red-950/90 text-red-200 border-red-700/80'
                  : toast.type === 'warning'
                  ? 'bg-amber-950/90 text-amber-200 border-amber-700/80'
                  : 'bg-[#151F30]/95 text-slate-200 border-[#263449]'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  toast.type === 'success'
                    ? 'bg-emerald-400'
                    : toast.type === 'error'
                    ? 'bg-red-400'
                    : toast.type === 'warning'
                    ? 'bg-amber-400'
                    : 'bg-[#20D6B5]'
                }`}
              />
              <span>{toast.message}</span>
            </div>
          </div>
        )}

        {/* Mobile Bottom Navigation Bar */}
        <BottomNav onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)} />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <SafeCrossProvider>
      <SafeCrossAppContent />
    </SafeCrossProvider>
  );
}
