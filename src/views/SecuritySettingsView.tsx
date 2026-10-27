import React, { useState } from 'react';
import {
  Settings,
  Shield,
  ShieldCheck,
  Bell,
  Moon,
  Sun,
  Lock,
  Smartphone,
  Info,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useSafeCross } from '../context/SafeCrossContext';

export const SecuritySettingsView: React.FC = () => {
  const { settings, updateSettings, toggleTheme, showToast } = useSafeCross();
  const [showAndroidGuide, setShowAndroidGuide] = useState(false);
  const [showDesktopGuide, setShowDesktopGuide] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#151F30] border border-[#263449] space-y-2">
        <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
          <span>CENTRAL CONTROL</span>
          <span aria-hidden="true">·</span>
          <span>PREFERENCES &amp; OS COMPLIANCE</span>
          <span aria-hidden="true">·</span>
          <span className="text-teal-400 font-mono">Zero-Trust Baseline</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
          Security Settings &amp; Permissions
        </h2>
        <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed max-w-2xl">
          Configure scanning thresholds, retention rules, and notification preferences. Inspect hardware and operating-system security capability boundaries.
        </p>
      </div>

      {/* Critical Permissions & Native OS Honest Status Card */}
      <div className="p-6 rounded-2xl bg-[#151F30] border border-[#263449] space-y-4">
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#263449]">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-purple-400" />
              <span>Native Operating System Permissions</span>
            </h3>
            <p className="text-[11px] text-[#94A3B8] mt-0.5">
              Current hardware privilege status on host device
            </p>
          </div>
          <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded text-amber-300 bg-amber-950/80 border border-amber-800">
            Web Sandbox Mode
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#101827] border border-amber-500/30 text-xs text-amber-200/90 leading-relaxed space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-amber-300">
            <AlertTriangle className="w-4 h-4" />
            <span>Browser Application Boundary Disclosure:</span>
          </div>
          <p>
            Standard web browser applications cannot independently enable Android Accessibility, system-wide VPN interception, Device Administrator, or host-level antivirus hooks.
            SafeCross honestly reports these capabilities as <strong>Not configured</strong> until a signed native companion APK or desktop daemon is installed and explicitly granted user consent.
          </p>
        </div>

        {/* Permissions List */}
        <div className="space-y-3">
          {/* Android Accessibility */}
          <div className="p-4 bg-[#101827] rounded-xl border border-[#263449] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="font-semibold text-xs text-white">Android Accessibility Service API</div>
              <p className="text-[11px] text-[#94A3B8]">
                Required for real-time URL inspection across third-party browser apps and messaging links.
              </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                Not Configured
              </span>
              <button
                onClick={() => setShowAndroidGuide(!showAndroidGuide)}
                className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1 cursor-pointer"
              >
                <span>Setup Guide</span>
                {showAndroidGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {showAndroidGuide && (
            <div className="p-4 bg-[#101827]/80 rounded-xl border border-[#263449] font-mono text-xs text-slate-300 space-y-2 animate-in fade-in">
              <div className="font-bold text-teal-400">Android Companion Setup Architecture:</div>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-[#94A3B8]">
                <li>Install signed <code className="text-slate-200">SafeCross_Agent.apk</code> from trusted repository.</li>
                <li>Navigate to Android Settings &gt; Accessibility &gt; Downloaded Apps &gt; SafeCross.</li>
                <li>Explicitly toggle &quot;Use SafeCross Protection&quot; and grant accessibility permission.</li>
                <li>Device will automatically link to this dashboard via secure local intent.</li>
              </ol>
            </div>
          )}

          {/* VPN Device Filter */}
          <div className="p-4 bg-[#101827] rounded-xl border border-[#263449] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="font-semibold text-xs text-white">Local VPN / DNS-over-HTTPS Shield</div>
              <p className="text-[11px] text-[#94A3B8]">
                Routes DNS resolution through a zero-latency encrypted local filter to block C2 and phishing domains.
              </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                Not Configured
              </span>
              <button
                onClick={() => setShowDesktopGuide(!showDesktopGuide)}
                className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1 cursor-pointer"
              >
                <span>Setup Guide</span>
                {showDesktopGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {showDesktopGuide && (
            <div className="p-4 bg-[#101827]/80 rounded-xl border border-[#263449] font-mono text-xs text-slate-300 space-y-2 animate-in fade-in">
              <div className="font-bold text-teal-400">Desktop / VPN Shield Setup Architecture:</div>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-[#94A3B8]">
                <li>Download SafeCross Desktop Service installer (.msi on Windows, .pkg on macOS).</li>
                <li>Install local loopback DNS daemon running at <code className="text-slate-200">127.0.0.1:5353</code>.</li>
                <li>Confirm system prompt to install WireGuard / TUN network adapter.</li>
              </ol>
            </div>
          )}
        </div>
      </div>

      {/* Prototype Application Preferences */}
      <div className="p-6 rounded-2xl bg-[#151F30] border border-[#263449] space-y-5">
        <div className="pb-3 border-b border-[#263449]">
          <h3 className="text-sm font-bold text-white">Application Scanning Preferences</h3>
          <p className="text-[11px] text-[#94A3B8]">
            Configure frontend prototype security engine behavior
          </p>
        </div>

        <div className="divide-y divide-[#263449]">
          {/* Setting 1: Prototype Protection */}
          <div className="py-4 first:pt-0 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-white">Enable Prototype Protection</div>
              <p className="text-[11px] text-[#94A3B8] mt-0.5">
                Activates local pattern heuristics and simulated threat-intel cache lookups.
              </p>
            </div>
            <button
              onClick={() =>
                updateSettings({ prototypeProtectionEnabled: !settings.prototypeProtectionEnabled })
              }
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.prototypeProtectionEnabled ? 'bg-teal-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  settings.prototypeProtectionEnabled ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Setting 2: Suspicious Link Warning */}
          <div className="py-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-white">Suspicious Link Warnings</div>
              <p className="text-[11px] text-[#94A3B8] mt-0.5">
                Displays warning prompts for URLs with unusual nesting, raw IP addresses, or low-reputation TLDs.
              </p>
            </div>
            <button
              onClick={() =>
                updateSettings({ suspiciousLinkWarning: !settings.suspiciousLinkWarning })
              }
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.suspiciousLinkWarning ? 'bg-teal-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  settings.suspiciousLinkWarning ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Setting 3: High-Risk Blocking */}
          <div className="py-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-white">Strict High-Risk Interception</div>
              <p className="text-[11px] text-[#94A3B8] mt-0.5">
                Prevents accidental visits to blocklisted domains and verified phishing destinations.
              </p>
            </div>
            <button
              onClick={() => updateSettings({ highRiskBlocking: !settings.highRiskBlocking })}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.highRiskBlocking ? 'bg-teal-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  settings.highRiskBlocking ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Setting 4: Automatic URL Scanning */}
          <div className="py-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-white">Automatic URL Verification</div>
              <p className="text-[11px] text-[#94A3B8] mt-0.5">
                Evaluates URLs immediately upon entering or pasting without waiting for manual enter press.
              </p>
            </div>
            <button
              onClick={() =>
                updateSettings({ automaticUrlScanning: !settings.automaticUrlScanning })
              }
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.automaticUrlScanning ? 'bg-teal-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  settings.automaticUrlScanning ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Setting 5: Retention */}
          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-white">Scan History Retention Period</div>
              <p className="text-[11px] text-[#94A3B8] mt-0.5">
                How long audit records remain stored in your local browser sandbox.
              </p>
            </div>
            <select
              value={settings.scanHistoryRetentionDays}
              onChange={(e) =>
                updateSettings({ scanHistoryRetentionDays: Number(e.target.value) })
              }
              className="bg-[#101827] border border-[#263449] text-xs text-white rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer self-start sm:self-auto"
            >
              <option value={7}>7 Days</option>
              <option value={30}>30 Days (Recommended)</option>
              <option value={90}>90 Days</option>
              <option value={365}>1 Year</option>
            </select>
          </div>

          {/* Setting 6: Privacy Anonymization */}
          <div className="py-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-white">Anonymize Threat Telemetry</div>
              <p className="text-[11px] text-[#94A3B8] mt-0.5">
                Strips user identifiers, session parameters, and query strings prior to threat intel checks.
              </p>
            </div>
            <button
              onClick={() =>
                updateSettings({ anonymizeTelemetry: !settings.anonymizeTelemetry })
              }
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.anonymizeTelemetry ? 'bg-teal-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  settings.anonymizeTelemetry ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Setting 7: Light / Dark Theme */}
          <div className="py-4 last:pb-0 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-white">Interface Visual Theme</div>
              <p className="text-[11px] text-[#94A3B8] mt-0.5">
                Toggle between dark cybersecurity palette and accessible high-contrast light mode.
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#101827] hover:bg-slate-800 border border-[#263449] text-slate-200 transition-colors flex items-center gap-2 cursor-pointer"
            >
              {settings.theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Switch to Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-teal-300" />
                  <span>Switch to Dark</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
