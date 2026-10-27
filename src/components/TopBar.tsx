import React from 'react';
import { Shield, AlertTriangle, FileText, Smartphone, Globe, Layers, Activity } from 'lucide-react';

export type ActiveNavTab = 'dashboard' | 'safeweb' | 'apk' | 'tabs' | 'devices' | 'reports';

interface TopBarProps {
  activeTab: ActiveNavTab;
  onSelectTab: (tab: ActiveNavTab) => void;
  onSimulateThreat: () => void;
  onOpenReport: () => void;
  unreadThreatCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onSelectTab,
  onSimulateThreat,
  onOpenReport,
  unreadThreatCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950 border-b border-slate-800/80 backdrop-blur-md px-6 py-3.5 flex items-center justify-between gap-8">
      {/* Zone 1: Single wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400">
          <Shield className="w-4 h-4 stroke-[2.2]" />
        </div>
        <button
          onClick={() => onSelectTab('dashboard')}
          className="text-lg font-bold tracking-tight text-white hover:text-slate-200 transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer"
        >
          AegisShield
        </button>
      </div>

      {/* Zone 2: Single-line nav links */}
      <nav className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-slate-300">
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'dashboard'
              ? 'bg-slate-800 text-white font-semibold'
              : 'hover:bg-slate-900 hover:text-white text-slate-400'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Threat Dashboard</span>
          {unreadThreatCount > 0 && (
            <span className="font-mono text-[10px] text-red-400 ml-1">
              ({unreadThreatCount})
            </span>
          )}
        </button>

        <button
          onClick={() => onSelectTab('safeweb')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'safeweb'
              ? 'bg-slate-800 text-white font-semibold'
              : 'hover:bg-slate-900 hover:text-white text-slate-400'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Safe Web Browser</span>
        </button>

        <button
          onClick={() => onSelectTab('apk')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'apk'
              ? 'bg-slate-800 text-white font-semibold'
              : 'hover:bg-slate-900 hover:text-white text-slate-400'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>APK Malware Scanner</span>
        </button>

        <button
          onClick={() => onSelectTab('tabs')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'tabs'
              ? 'bg-slate-800 text-white font-semibold'
              : 'hover:bg-slate-900 hover:text-white text-slate-400'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Harmful Tabs Monitor</span>
        </button>

        <button
          onClick={() => onSelectTab('devices')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'devices'
              ? 'bg-slate-800 text-white font-semibold'
              : 'hover:bg-slate-900 hover:text-white text-slate-400'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Device Sync &amp; Policy</span>
        </button>
      </nav>

      {/* Zone 3: Primary action button + Report trigger */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onOpenReport}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Audit Report</span>
        </button>
        <button
          onClick={onSimulateThreat}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-500 rounded-md transition-colors whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Test Threat Intercept</span>
        </button>
      </div>
    </header>
  );
};
