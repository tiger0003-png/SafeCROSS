import React, { useState } from 'react';
import {
  Layers,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  Play,
  Cpu,
  RefreshCw,
  Plus,
} from 'lucide-react';
import {
  analyzeTabSafety,
  HarmfulTabInspectionInput,
  ThreatAnalysisResult,
} from '../utils/securityEngine';

interface HarmfulTabsMonitorProps {
  onTriggerAlert: (threat: ThreatAnalysisResult) => void;
}

interface SimulatedTab extends HarmfulTabInspectionInput {
  id: string;
  deviceOrigin: string;
  cpuUsagePercent: number;
  isKilled: boolean;
}

const INITIAL_TABS: SimulatedTab[] = [
  {
    id: 'tab-01',
    tabTitle: 'Free Movie Stream HD - Watch Unlimited',
    url: 'https://free-movie-stream-online.cc/watch',
    detectedScripts: ['coinhive.wasm', 'eval_obfuscator.js', 'tracker_min.js'],
    hasCryptominingSignature: true,
    hasClickjackingOverlay: false,
    hasUnencryptedForm: false,
    hasPersistentPushPrompt: true,
    deviceOrigin: 'CEO MacBook Pro',
    cpuUsagePercent: 99.2,
    isKilled: false,
  },
  {
    id: 'tab-02',
    tabTitle: 'Corporate Cloud ERP - Employee Portal',
    url: 'https://erp.company.internal/dashboard',
    detectedScripts: ['react.min.js', 'auth_sso.js'],
    hasCryptominingSignature: false,
    hasClickjackingOverlay: false,
    hasUnencryptedForm: false,
    hasPersistentPushPrompt: false,
    deviceOrigin: 'Admin Workstation',
    cpuUsagePercent: 2.1,
    isKilled: false,
  },
  {
    id: 'tab-03',
    tabTitle: 'Invoice #8491 Payment Verification',
    url: 'https://billing-invoice-verify.vip/pay',
    detectedScripts: ['overlay_hijack.js', 'unencrypted_post.js'],
    hasCryptominingSignature: false,
    hasClickjackingOverlay: true,
    hasUnencryptedForm: true,
    hasPersistentPushPrompt: false,
    deviceOrigin: 'Finance iPhone 16',
    cpuUsagePercent: 14.5,
    isKilled: false,
  },
  {
    id: 'tab-04',
    tabTitle: 'GitHub Enterprise - PR Review #492',
    url: 'https://github.com/enterprise/aegis-core/pull/492',
    detectedScripts: ['app.js', 'vendor.js'],
    hasCryptominingSignature: false,
    hasClickjackingOverlay: false,
    hasUnencryptedForm: false,
    hasPersistentPushPrompt: false,
    deviceOrigin: 'Dev Linux Workstation',
    cpuUsagePercent: 3.4,
    isKilled: false,
  },
];

export const HarmfulTabsMonitor: React.FC<HarmfulTabsMonitorProps> = ({ onTriggerAlert }) => {
  const [tabs, setTabs] = useState<SimulatedTab[]>(INITIAL_TABS);
  const [isScanningAll, setIsScanningAll] = useState(false);
  const [customTabUrl, setCustomTabUrl] = useState('');
  const [showAddTab, setShowAddTab] = useState(false);

  const killTab = (tabId: string) => {
    setTabs(
      tabs.map(t =>
        t.id === tabId
          ? { ...t, isKilled: true, cpuUsagePercent: 0 }
          : t
      )
    );
  };

  const inspectAndAlert = (tab: SimulatedTab) => {
    // 1. Instant local analysis
    const instantResult = analyzeTabSafety(tab);
    if (instantResult.isThreat) {
      onTriggerAlert(instantResult);
    }

    // 2. Background server record
    fetch('/api/scan/tab', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tabData: tab,
        deviceOrigin: tab.deviceOrigin,
      }),
    }).catch((err) => {
      console.debug('Tab scan background sync:', err);
    });
  };

  const handleScanAll = () => {
    setIsScanningAll(true);
    setTimeout(() => {
      setIsScanningAll(false);
      // Trigger alert for highest risk unkilled tab
      const threatTab = tabs.find(t => !t.isKilled && (t.hasCryptominingSignature || t.hasClickjackingOverlay));
      if (threatTab) {
        inspectAndAlert(threatTab);
      }
    }, 450);
  };

  const handleAddCustomTab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTabUrl.trim()) return;

    const isHarmful = customTabUrl.includes('movie') || customTabUrl.includes('free') || customTabUrl.includes('crypto');
    const newTab: SimulatedTab = {
      id: `tab-${Date.now()}`,
      tabTitle: customTabUrl.replace(/^https?:\/\//, '').split('/')[0] + ' - Session Tab',
      url: customTabUrl.startsWith('http') ? customTabUrl : `https://${customTabUrl}`,
      detectedScripts: isHarmful ? ['coinhive.wasm', 'script_hook.js'] : ['main.js'],
      hasCryptominingSignature: isHarmful,
      hasClickjackingOverlay: false,
      hasUnencryptedForm: false,
      hasPersistentPushPrompt: isHarmful,
      deviceOrigin: 'CEO MacBook Pro',
      cpuUsagePercent: isHarmful ? 88.5 : 2.5,
      isKilled: false,
    };

    setTabs([newTab, ...tabs]);
    setCustomTabUrl('');
    setShowAddTab(false);
    inspectAndAlert(newTab);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>REAL-TIME BROWSER DEFENSE</span>
            <span aria-hidden="true">·</span>
            <span>DOM SCRIPT &amp; TAB INTERCEPTOR</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-mono">Active Tab Guard</span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight mt-1">
            Harmful Browser Tabs &amp; Malicious Script Shield
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Continuously inspects active browser processes across connected devices for background cryptomining, clickjacking frames, credential harvesters, and deceptive popups.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAddTab(!showAddTab)}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Simulate New Tab</span>
          </button>

          <button
            onClick={handleScanAll}
            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanningAll ? 'animate-spin' : ''}`} />
            <span>Deep Scan All Tabs</span>
          </button>
        </div>
      </div>

      {/* Add Tab Form */}
      {showAddTab && (
        <form onSubmit={handleAddCustomTab} className="p-4 bg-slate-900 border border-slate-700 rounded-xl space-y-3">
          <div className="text-xs font-semibold text-white">Simulate Opening a Browser Tab:</div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. https://free-crypto-giveaway.io or https://docs.google.com"
              value={customTabUrl}
              onChange={(e) => setCustomTabUrl(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-red-500"
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              Open &amp; Inspect
            </button>
          </div>
        </form>
      )}

      {/* Tab Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tabs.map((tab) => {
          const analysis = analyzeTabSafety(tab);
          const isDanger = analysis.isThreat && !tab.isKilled;

          return (
            <div
              key={tab.id}
              className={`p-5 rounded-xl border transition-all ${
                tab.isKilled
                  ? 'bg-slate-950/60 border-slate-800/60 opacity-60'
                  : isDanger
                  ? 'bg-red-950/20 border-red-900/60 shadow-lg shadow-red-950/20'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    tab.isKilled
                      ? 'bg-slate-800 text-slate-500'
                      : isDanger
                      ? 'bg-red-600/30 text-red-400 border border-red-500/50'
                      : 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40'
                  }`}>
                    {tab.isKilled ? (
                      <XCircle className="w-4 h-4" />
                    ) : isDanger ? (
                      <ShieldAlert className="w-4 h-4 animate-pulse" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate" title={tab.tabTitle}>
                      {tab.tabTitle}
                    </h4>
                    <p className="text-[11px] font-mono text-slate-400 truncate mt-0.5">
                      {tab.url}
                    </p>
                  </div>
                </div>

                <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded uppercase whitespace-nowrap shrink-0 ${
                  tab.isKilled
                    ? 'bg-slate-800 text-slate-400'
                    : isDanger
                    ? 'bg-red-900/60 text-red-200 border border-red-700'
                    : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                }`}>
                  {tab.isKilled ? 'TERMINATED' : analysis.severity}
                </span>
              </div>

              {/* Specs & Hardware Telemetry */}
              <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-slate-800/80 text-xs mb-3">
                <div>
                  <div className="text-[10px] text-slate-500">Device Origin</div>
                  <div className="font-mono text-slate-300 truncate text-[11px]">{tab.deviceOrigin}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">CPU Core Load</div>
                  <div className={`font-mono text-[11px] flex items-center gap-1 ${
                    tab.cpuUsagePercent > 50 ? 'text-red-400 font-bold' : 'text-slate-300'
                  }`}>
                    <Cpu className="w-3 h-3" />
                    <span>{tab.cpuUsagePercent}%</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">Scripts Running</div>
                  <div className="font-mono text-[11px] text-slate-300">
                    {tab.isKilled ? '0' : tab.detectedScripts.length}
                  </div>
                </div>
              </div>

              {/* Detected Threat Flags */}
              <div className="space-y-1 text-xs mb-4">
                {tab.isKilled ? (
                  <div className="text-[11px] text-slate-500 italic">
                    Process halted. Malicious WebSocket and WebWorker memory freed.
                  </div>
                ) : (
                  analysis.reasons.map((r, rIdx) => (
                    <div key={rIdx} className="flex items-start gap-1.5 text-slate-300 text-[11px]">
                      <span className={isDanger ? 'text-red-400 font-bold' : 'text-emerald-400'}>•</span>
                      <span>{r}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-mono text-slate-500">
                  {tab.detectedScripts.slice(0, 2).join(', ')}
                </span>

                <div className="flex items-center gap-2">
                  {!tab.isKilled && isDanger && (
                    <button
                      onClick={() => inspectAndAlert(tab)}
                      className="px-2.5 py-1 text-xs text-red-300 bg-red-950/60 hover:bg-red-900 border border-red-800 rounded transition-colors cursor-pointer"
                    >
                      Trigger Alert
                    </button>
                  )}

                  {!tab.isKilled && (
                    <button
                      onClick={() => killTab(tab.id)}
                      className="px-3 py-1 text-xs font-semibold text-white bg-slate-800 hover:bg-red-700 rounded transition-colors cursor-pointer"
                    >
                      Kill Tab Process
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
