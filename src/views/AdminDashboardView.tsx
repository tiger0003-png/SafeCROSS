import React, { useState } from 'react';
import {
  ShieldAlert,
  Server,
  Activity,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Plus,
  Trash2,
  Globe,
  Lock,
  Cpu,
  Smartphone,
  Eye,
  Info
} from 'lucide-react';
import { useSafeCross } from '../context/SafeCrossContext';

export const AdminDashboardView: React.FC = () => {
  const {
    history,
    devices,
    blockedUrls,
    addBlockedUrl,
    removeBlockedUrl,
    showToast,
    isAdminMode,
    setIsAdminMode,
    setActiveSection
  } = useSafeCross();

  const [newDomain, setNewDomain] = useState('');
  const [fleetPolicies, setFleetPolicies] = useState({
    enforcePhishingBlock: true,
    blockUntrustedApk: true,
    enforceDnsOverHttps: true,
    quarantineInvalidCertificates: true,
    telemetryAnonymization: true,
    mandatoryBiometricVerification: false,
  });

  const [serviceHealth] = useState([
    {
      name: 'SafeCross Cloud Threat Intel Feed',
      status: 'OPERATIONAL',
      latency: '18ms',
      uptime: '99.98%',
      lastSync: '42s ago',
      icon: Server,
    },
    {
      name: 'Safe Browsing DNS-over-HTTPS Resolver',
      status: 'OPERATIONAL',
      latency: '12ms',
      uptime: '100%',
      lastSync: 'Real-time stream',
      icon: Activity,
    },
    {
      name: 'Cross-Device Policy Synchronization Bus',
      status: 'SYNCHRONIZED',
      latency: '34ms',
      uptime: '99.94%',
      lastSync: '1m ago',
      icon: Cpu,
    },
  ]);

  const togglePolicy = (key: keyof typeof fleetPolicies) => {
    setFleetPolicies(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      showToast(`Fleet policy "${key}" updated across connected endpoints.`, 'success');
      return updated;
    });
  };

  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) return;
    addBlockedUrl(newDomain);
    setNewDomain('');
  };

  const highRiskThreats = history.filter(h => h.category === 'HIGH_RISK');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-[#20D6B5]/15 text-[#20D6B5] border border-[#20D6B5]/30">
              CENTRAL POLICY &amp; THREAT INTELLIGENCE
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Admin Console
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            System Administrator Control Plane
          </h1>
          <p className="text-sm text-slate-400">
            Coordinate fleet-wide threat intelligence, enforce security baseline policies, and manage global domain filters.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsAdminMode(!isAdminMode);
              showToast(`Administrator privilege mode ${!isAdminMode ? 'enabled' : 'restricted'}.`, 'info');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 border transition-all ${
              isAdminMode
                ? 'bg-[#20D6B5]/20 text-[#20D6B5] border-[#20D6B5]/50 shadow-sm'
                : 'bg-[#151F30] text-slate-400 border-[#263449] hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            {isAdminMode ? 'Admin Role Active' : 'Enable Elevated Admin Mode'}
          </button>
        </div>
      </div>

      {/* Honest Prototype Notice */}
      <div className="p-3.5 rounded-xl bg-[#151F30] border border-[#263449] text-xs text-slate-300 flex items-start gap-3">
        <Info className="w-4 h-4 text-[#20D6B5] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-slate-100 font-semibold">Simulated Centralized Policy Architecture:</strong>{' '}
          In this prototype, policy updates and domain blocks propagate immediately across local storage state and the connected demo devices fleet. In enterprise production, SafeCross utilizes an authenticated gRPC agent sync protocol with encrypted client certificates.
        </div>
      </div>

      {/* Service Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {serviceHealth.map((svc) => {
          const Icon = svc.icon;
          return (
            <div
              key={svc.name}
              className="p-4 rounded-xl bg-[#151F30] border border-[#263449] flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-lg bg-[#101827] flex items-center justify-center border border-[#263449]">
                  <Icon className="w-4 h-4 text-[#20D6B5]" />
                </div>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {svc.status}
                </span>
              </div>
              <div className="mt-3">
                <h3 className="text-xs font-semibold text-slate-200 line-clamp-1">{svc.name}</h3>
                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-[#263449]/60 text-[11px]">
                  <div>
                    <span className="text-slate-400">Latency: </span>
                    <span className="font-mono text-emerald-400 font-medium">{svc.latency}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Uptime: </span>
                    <span className="font-mono text-slate-200 font-medium">{svc.uptime}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid: Global Policies & Fleet Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fleet Security Policies */}
        <div className="p-5 rounded-2xl bg-[#151F30] border border-[#263449] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#20D6B5]" />
              <h2 className="text-base font-semibold text-slate-100">Fleet Security Policies</h2>
            </div>
            <span className="text-xs text-slate-400">{devices.length} devices synchronized</span>
          </div>
          <p className="text-xs text-slate-400">
            Enforce rules universally across all enrolled mobile and desktop endpoints.
          </p>

          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#101827] border border-[#263449]">
              <div>
                <p className="text-xs font-medium text-slate-200">Strict Phishing Block</p>
                <p className="text-[11px] text-slate-400">Prevent bypass on verified malicious and homoglyph URLs</p>
              </div>
              <button
                onClick={() => togglePolicy('enforcePhishingBlock')}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  fleetPolicies.enforcePhishingBlock ? 'bg-[#20D6B5]' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    fleetPolicies.enforcePhishingBlock ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#101827] border border-[#263449]">
              <div>
                <p className="text-xs font-medium text-slate-200">Prevent Untrusted APK Sideloads</p>
                <p className="text-[11px] text-slate-400">Flag packages demanding accessibility service without corporate signature</p>
              </div>
              <button
                onClick={() => togglePolicy('blockUntrustedApk')}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  fleetPolicies.blockUntrustedApk ? 'bg-[#20D6B5]' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    fleetPolicies.blockUntrustedApk ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#101827] border border-[#263449]">
              <div>
                <p className="text-xs font-medium text-slate-200">Force DNS-over-HTTPS Resolution</p>
                <p className="text-[11px] text-slate-400">Route mobile and desktop DNS requests through SafeCross encrypted resolver</p>
              </div>
              <button
                onClick={() => togglePolicy('enforceDnsOverHttps')}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  fleetPolicies.enforceDnsOverHttps ? 'bg-[#20D6B5]' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    fleetPolicies.enforceDnsOverHttps ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#101827] border border-[#263449]">
              <div>
                <p className="text-xs font-medium text-slate-200">Quarantine Untrusted SSL/TLS Certificates</p>
                <p className="text-[11px] text-slate-400">Block connections when certificate subject mismatch or self-signed cert detected</p>
              </div>
              <button
                onClick={() => togglePolicy('quarantineInvalidCertificates')}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  fleetPolicies.quarantineInvalidCertificates ? 'bg-[#20D6B5]' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    fleetPolicies.quarantineInvalidCertificates ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Global Blocklist Manager */}
        <div className="p-5 rounded-2xl bg-[#151F30] border border-[#263449] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#20D6B5]" />
              <h2 className="text-base font-semibold text-slate-100">Global Blocklist Rules</h2>
            </div>
            <span className="text-xs font-mono text-[#20D6B5] bg-[#20D6B5]/10 px-2 py-0.5 rounded">
              {blockedUrls.length} Active Rules
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Domains added here are instantly blocked on Safe Browsing and URL Scanners for all endpoints.
          </p>

          <form onSubmit={handleAddDomain} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. malicious-portal.xyz or scam-bank.com"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-[#101827] border border-[#263449] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#20D6B5]"
            />
            <button
              type="submit"
              className="px-3 py-2 rounded-xl bg-[#20D6B5] hover:bg-[#1bc1a2] text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Domain
            </button>
          </form>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {blockedUrls.map((domain) => (
              <div
                key={domain}
                className="flex items-center justify-between p-2.5 rounded-lg bg-[#101827] border border-[#263449]/70 text-xs"
              >
                <div className="flex items-center gap-2 font-mono text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                  <span className="truncate max-w-[200px] sm:max-w-xs">{domain}</span>
                </div>
                <button
                  onClick={() => removeBlockedUrl(domain)}
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                  title="Remove from blocklist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Flagged Threat Audit Feed */}
      <div className="p-5 rounded-2xl bg-[#151F30] border border-[#263449] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              Recent High-Risk Fleet Interceptions
            </h2>
            <p className="text-xs text-slate-400">
              Correlated audit log of dangerous items quarantined across registered client devices.
            </p>
          </div>
          <button
            onClick={() => setActiveSection('history')}
            className="text-xs text-[#20D6B5] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <Eye className="w-3.5 h-3.5" />
            View Full Forensics Log
          </button>
        </div>

        {highRiskThreats.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 bg-[#101827] rounded-xl border border-[#263449]">
            No high-risk threats currently flagged in fleet history.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] font-semibold text-slate-400 border-b border-[#263449]">
                <tr>
                  <th className="py-2.5 px-3">Scan ID</th>
                  <th className="py-2.5 px-3">Target</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Risk Score</th>
                  <th className="py-2.5 px-3">Detected Anomaly</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#263449]/60 text-slate-300">
                {highRiskThreats.slice(0, 5).map((threat) => (
                  <tr key={threat.id} className="hover:bg-[#101827]/50 transition-colors">
                    <td className="py-3 px-3 font-mono text-slate-400">{threat.id}</td>
                    <td className="py-3 px-3 font-medium text-slate-200 max-w-[220px] truncate" title={threat.target}>
                      {threat.target}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-[#263449]">
                        {threat.type}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 font-mono">
                        {threat.score}/100
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 max-w-[240px] truncate">
                      {threat.summary}
                    </td>
                    <td className="py-3 px-3 text-right space-x-1">
                      <button
                        onClick={() => {
                          const domain = threat.target.replace(/^https?:\/\//, '').split('/')[0];
                          addBlockedUrl(domain);
                        }}
                        className="px-2 py-1 rounded text-[11px] bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
                      >
                        Block Domain
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
