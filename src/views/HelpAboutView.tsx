import React from 'react';
import {
  ShieldCheck,
  Cpu,
  Layers,
  Lock,
  Smartphone,
  Monitor,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Globe,
  Info,
  Server
} from 'lucide-react';
import { SafeCrossLogo } from '../components/SafeCrossLogo';

export const HelpAboutView: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Brand Hero */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#151F30] via-[#101827] to-[#0B1220] border border-[#263449] shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-[#0B1220] flex items-center justify-center border border-[#20D6B5]/30 shadow-inner">
            <SafeCrossLogo size="lg" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">
                SafeCross
              </h1>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#20D6B5]/15 text-[#20D6B5] border border-[#20D6B5]/30">
                v2.4 Prototype
              </span>
            </div>
            <p className="text-base font-medium text-[#20D6B5]">
              Smart Protection. Safer Digital Life.
            </p>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              SafeCross assists individuals and organizations in preempting cyber attacks by rapidly identifying malicious URLs, phishing portals, deceptive homoglyph domains, and trojanized APK installation packages before data breaches happen.
            </p>
          </div>
        </div>

        <div className="absolute right-0 top-0 w-80 h-80 bg-[#20D6B5]/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Honest Boundary Disclosure Notice */}
      <div className="p-5 rounded-2xl bg-[#151F30] border border-amber-500/30 space-y-2">
        <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          Prototype Verification &amp; Operating System Boundary Notice
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          SafeCross operates inside your web browser sandbox. It executes real local algorithmic heuristics (typosquatting checks, Unicode homoglyph analysis, TLD reputation indices, and APK manifest permission parsing) directly on your device.
        </p>
        <p className="text-xs text-slate-400 leading-relaxed">
          However, because standard web browser sandboxes strictly prohibit modifying system-level network packets or inspecting external apps, <strong>SafeCross does not falsely claim active device-wide OS interception</strong>. For full continuous background scanning across all apps on Android or Windows, the native SafeCross endpoint agent must be installed with explicit OS permissions.
        </p>
      </div>

      {/* Architectural Blueprint */}
      <div className="p-6 rounded-2xl bg-[#151F30] border border-[#263449] space-y-6">
        <div>
          <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-[#20D6B5]/15 text-[#20D6B5] border border-[#20D6B5]/30">
            SYSTEM ARCHITECTURE
          </span>
          <h2 className="text-xl font-bold text-slate-100 mt-2">
            SafeCross Layered Threat Defense Model
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            How SafeCross coordinates low-latency client heuristics with cloud intelligence feeds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#101827] border border-[#263449] space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#151F30] flex items-center justify-center border border-[#263449]">
              <Cpu className="w-5 h-5 text-[#20D6B5]" />
            </div>
            <h3 className="text-sm font-semibold text-slate-200">1. Client-Side Heuristic Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Executes in sub-20ms with zero telemetry leakage. Parses URL authority patterns, calculates character Shannon entropy, flags homoglyphs (e.g. Cyrillic/Greek substitutions), and screens against local known bad actor databases.
            </p>
            <div className="text-[11px] font-mono text-[#20D6B5]">Latency: &lt; 15ms</div>
          </div>

          <div className="p-4 rounded-xl bg-[#101827] border border-[#263449] space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#151F30] flex items-center justify-center border border-[#263449]">
              <Server className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="text-sm font-semibold text-slate-200">2. Cloud Threat Intelligence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Provides real-time validation against decentralized reputation networks, DNS sinkholes, phishing honeypots, and verified SHA-256 malware signatures across millions of live telemetry endpoints.
            </p>
            <div className="text-[11px] font-mono text-indigo-400">Sync: Real-time stream</div>
          </div>

          <div className="p-4 rounded-xl bg-[#101827] border border-[#263449] space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#151F30] flex items-center justify-center border border-[#263449]">
              <Layers className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-sm font-semibold text-slate-200">3. Policy &amp; Fleet Management</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Allows administrators to propagate strict zero-trust rules, custom domain whitelists/blocklists, and mandatory certificate inspection policies instantly to all connected mobile and desktop devices.
            </p>
            <div className="text-[11px] font-mono text-emerald-400">Scope: Cross-platform</div>
          </div>
        </div>
      </div>

      {/* Native Platform Integration Guide */}
      <div className="p-6 rounded-2xl bg-[#151F30] border border-[#263449] space-y-5">
        <div>
          <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-[#20D6B5]/15 text-[#20D6B5] border border-[#20D6B5]/30">
            DEPLOYMENT GUIDE
          </span>
          <h2 className="text-xl font-bold text-slate-100 mt-2">
            Native Platform Integration &amp; Setup Requirements
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Steps necessary when transitioning from this prototype to full operating system protection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#101827] border border-[#263449] space-y-2">
            <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
              <Smartphone className="w-4 h-4 text-[#20D6B5]" />
              Android OS Agent (Native APK)
            </div>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
              <li>Requires <strong className="text-slate-300">Accessibility Service</strong> permission to inspect active URLs across Chrome, Firefox, and social media in-app browsers.</li>
              <li>Requires local <strong className="text-slate-300">VpnService</strong> hook for packet-level DNS filtering without routing external traffic.</li>
              <li>Requires <strong className="text-slate-300">QUERY_ALL_PACKAGES</strong> for APK installation auditing.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#101827] border border-[#263449] space-y-2">
            <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
              <Monitor className="w-4 h-4 text-[#20D6B5]" />
              Windows &amp; macOS Desktop Daemon
            </div>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
              <li>Requires <strong className="text-slate-300">Windows Filtering Platform (WFP)</strong> driver or macOS Network Extension.</li>
              <li>Installs lightweight local DNS-over-HTTPS proxy on localhost (127.0.0.1:53).</li>
              <li>Enforces automatic browser extension synchronization via enterprise group policy.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Security Best Practices */}
      <div className="p-6 rounded-2xl bg-[#151F30] border border-[#263449] space-y-4">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#20D6B5]" />
          Key Digital Safety Hygiene
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#101827] border border-[#263449] text-slate-300">
            <strong className="text-slate-100 block mb-1">Verify Homoglyphs &amp; Subdomains:</strong>
            Scammers often register domains like <code className="text-[#20D6B5]">paypa1.com</code> or create deceptive subdomains like <code className="text-[#20D6B5]">chase.security-update.xyz</code>. Always inspect the actual top-level domain.
          </div>

          <div className="p-3 rounded-xl bg-[#101827] border border-[#263449] text-slate-300">
            <strong className="text-slate-100 block mb-1">Beware of APK Accessibility Requests:</strong>
            Legitimate banking and utility apps rarely require Android Accessibility Service permissions. Any sideloaded APK asking for this is likely a keylogger or overlay trojan.
          </div>

          <div className="p-3 rounded-xl bg-[#101827] border border-[#263449] text-slate-300">
            <strong className="text-slate-100 block mb-1">Always Check HTTPS &amp; Certificates:</strong>
            Never input passwords or personal information on sites showing "Not Secure" (HTTP) or with invalid certificate warnings.
          </div>

          <div className="p-3 rounded-xl bg-[#101827] border border-[#263449] text-slate-300">
            <strong className="text-slate-100 block mb-1">Keep Sideloading Disabled:</strong>
            Only enable APK installations from unknown sources when strictly necessary, and scan every APK with SafeCross before installing.
          </div>
        </div>
      </div>
    </div>
  );
};
