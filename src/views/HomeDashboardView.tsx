import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Globe,
  FileCode2,
  Clock,
  ArrowRight,
  ExternalLink,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Info,
  Laptop,
} from 'lucide-react';
import { useSafeCross } from '../context/SafeCrossContext';
import { HistoryItem } from '../types/safecross';

export const HomeDashboardView: React.FC = () => {
  const { history, devices, setActiveSection, settings } = useSafeCross();

  // Metrics
  const urlScans = history.filter((h) => h.type === 'URL');
  const apkScans = history.filter((h) => h.type === 'APK');
  const highRiskThreats = history.filter((h) => h.category === 'HIGH_RISK');
  const suspiciousLinks = history.filter((h) => h.category === 'SUSPICIOUS');

  const recentHistory = history.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Main Protection Hero Card */}
      <div className="relative rounded-2xl overflow-hidden bg-[#151F30] border border-[#263449] p-6 sm:p-8 shadow-xl">
        {/* Subtle radial glow */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none opacity-20"
          style={{
            background: 'radial-gradient(circle, #20D6B5 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            {/* Shield Graphic */}
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shrink-0 flex items-center justify-center border"
              style={{
                backgroundColor: 'rgba(32,214,181,0.12)',
                borderColor: 'rgba(32,214,181,0.4)',
                boxShadow: '0 0 20px rgba(32,214,181,0.15)',
              }}
            >
              <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
                <path
                  d="M16 3L26 7.5V15C26 21.8 21.7 27.2 16 29C10.3 27.2 6 21.8 6 15V7.5L16 3Z"
                  stroke="#20D6B5"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M16 9V21" stroke="#20D6B5" strokeWidth="2" strokeLinecap="round" />
                <path d="M10 15H22" stroke="#20D6B5" strokeWidth="2" strokeLinecap="round" />
                <circle cx="16" cy="15" r="2" fill="#20D6B5" />
              </svg>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-teal-300 bg-teal-950/80 border border-teal-800">
                  Demo Protection: Active
                </span>
                <span className="text-xs text-[#94A3B8]">·</span>
                <span className="text-xs text-[#94A3B8] font-mono">
                  {devices.length} Devices Connected
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
                System Guardrail Active
              </h2>
              <p className="text-xs sm:text-sm text-[#94A3B8] max-w-xl leading-relaxed">
                SafeCross prototype is evaluating links and files through local heuristics.
                <span className="text-amber-400/90 font-medium ml-1">
                  (Note: In this browser demo, OS-level interception requires native Android/desktop agent installation.)
                </span>
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex sm:flex-row flex-col items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveSection('scan-url')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs text-slate-950 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 hover:opacity-95"
              style={{ backgroundColor: '#20D6B5' }}
            >
              <Globe className="w-4 h-4 text-slate-950" />
              <span>Run Security Check</span>
            </button>
            <button
              onClick={() => setActiveSection('settings')}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-[#101827] hover:bg-slate-800 border border-[#263449] transition-colors cursor-pointer"
            >
              Configure Protection
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total URLs Scanned */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#151F30] border border-[#263449]">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs">
            <span>Total URLs Scanned</span>
            <Globe className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-[#F8FAFC] mt-2">
            {urlScans.length}
          </div>
          <div className="text-[11px] text-[#94A3B8] mt-1 flex items-center gap-1">
            <span className="text-teal-400 font-medium">Heuristics active</span>
          </div>
        </div>

        {/* Threats Detected */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#151F30] border border-[#263449]">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs">
            <span>High Risk Threats</span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-red-400 mt-2">
            {highRiskThreats.length}
          </div>
          <div className="text-[11px] text-[#94A3B8] mt-1">
            <span>Critical actions blocked</span>
          </div>
        </div>

        {/* Suspicious Links */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#151F30] border border-[#263449]">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs">
            <span>Suspicious Links</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-400 mt-2">
            {suspiciousLinks.length}
          </div>
          <div className="text-[11px] text-[#94A3B8] mt-1">
            <span>Flagged for user review</span>
          </div>
        </div>

        {/* APK Files Analyzed */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#151F30] border border-[#263449]">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs">
            <span>APK Files Analyzed</span>
            <FileCode2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-[#F8FAFC] mt-2">
            {apkScans.length}
          </div>
          <div className="text-[11px] text-[#94A3B8] mt-1">
            <span>Permission matrices tested</span>
          </div>
        </div>
      </div>

      {/* Main Content Split: Recent Activity vs. Security Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity (2 Cols on lg) */}
        <div className="lg:col-span-2 rounded-2xl bg-[#151F30] border border-[#263449] p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#263449]">
            <div>
              <h3 className="text-sm font-bold text-[#F8FAFC]">Recent Security Activity</h3>
              <p className="text-[11px] text-[#94A3B8]">
                Persistent scan history (Demo &amp; prototype logs)
              </p>
            </div>
            <button
              onClick={() => setActiveSection('history')}
              className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View All History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentHistory.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No scan history entries available. Run a URL or APK scan to see results here.
              </div>
            ) : (
              recentHistory.map((item) => {
                const isHigh = item.category === 'HIGH_RISK';
                const isSuspicious = item.category === 'SUSPICIOUS';
                const isClean = item.category === 'LOW_RISK';

                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-[#101827] border border-[#263449] flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isHigh
                            ? 'bg-red-500/10 text-red-400'
                            : isSuspicious
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-emerald-500/10 text-emerald-400'
                        }`}
                      >
                        {item.type === 'URL' ? (
                          <Globe className="w-4 h-4" />
                        ) : (
                          <FileCode2 className="w-4 h-4" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-[#F8FAFC] truncate max-w-xs sm:max-w-md">
                            {item.target}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#94A3B8] truncate mt-0.5">
                          {item.summary}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                          isHigh
                            ? 'bg-red-500/10 text-red-400 border-red-500/30'
                            : isSuspicious
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        {item.category.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Security Hygiene & Tips (1 Col on lg) */}
        <div className="rounded-2xl bg-[#151F30] border border-[#263449] p-5 sm:p-6 space-y-4">
          <div className="pb-3 border-b border-[#263449]">
            <h3 className="text-sm font-bold text-[#F8FAFC]">Security Best Practices</h3>
            <p className="text-[11px] text-[#94A3B8]">Essential digital hygiene tips</p>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-[#101827] rounded-xl border border-[#263449] space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Avoid Sideloaded APKs</span>
              </div>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                Third-party APK files frequently conceal banking overlay trojans and keyloggers. Only download from official app stores.
              </p>
            </div>

            <div className="p-3 bg-[#101827] rounded-xl border border-[#263449] space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Verify Hostname Before Login</span>
              </div>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                Check for subtle typosquatting like numeral &quot;1&quot; replacing &quot;l&quot; in domains before submitting passwords or credentials.
              </p>
            </div>

            <div className="p-3 bg-[#101827] rounded-xl border border-[#263449] space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Keep Operating Systems Updated</span>
              </div>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                Security patches close critical zero-day vulnerabilities in browser engines and mobile kernel frameworks.
              </p>
            </div>

            <div className="p-3 bg-[#101827] rounded-xl border border-[#263449] space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Enable Multi-Factor Authentication</span>
              </div>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                Use hardware security keys or authenticator apps instead of SMS OTPs, which are vulnerable to SIM swap attacks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
