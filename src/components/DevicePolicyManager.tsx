import React, { useState } from 'react';
import {
  Smartphone,
  Laptop,
  Shield,
  ShieldCheck,
  ShieldAlert,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Lock,
  Plus,
  Zap,
  Globe,
  Layers,
  Radio,
  Server,
  X,
  QrCode,
} from 'lucide-react';
import { ConnectedDevice, DevicePolicyConfig } from '../utils/securityEngine';

interface DevicePolicyManagerProps {
  devices: ConnectedDevice[];
  policies: DevicePolicyConfig;
  onUpdatePolicies: (newPolicies: DevicePolicyConfig) => Promise<void>;
  onForceSync: () => Promise<void>;
  onQuarantineDevice: (deviceId: string) => Promise<void>;
}

export const DevicePolicyManager: React.FC<DevicePolicyManagerProps> = ({
  devices,
  policies,
  onUpdatePolicies,
  onForceSync,
  onQuarantineDevice,
}) => {
  const [localPolicies, setLocalPolicies] = useState<DevicePolicyConfig>(policies);
  const [isPushing, setIsPushing] = useState(false);
  const [pushSuccessMessage, setPushSuccessMessage] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showPairModal, setShowPairModal] = useState(false);

  const handlePolicyToggle = (key: keyof DevicePolicyConfig) => {
    if (typeof localPolicies[key] === 'boolean') {
      setLocalPolicies({
        ...localPolicies,
        [key]: !localPolicies[key],
      });
    }
  };

  const applyPreset = (preset: 'strict' | 'balanced' | 'dev') => {
    if (preset === 'strict') {
      setLocalPolicies({
        strictPhishingBlock: true,
        blockApkSideloading: true,
        dnsThreatShield: true,
        scriptSanitizer: true,
        zeroTrustHealthCheck: true,
        cloudSyncFrequencySec: 10,
      });
    } else if (preset === 'balanced') {
      setLocalPolicies({
        strictPhishingBlock: true,
        blockApkSideloading: true,
        dnsThreatShield: true,
        scriptSanitizer: false,
        zeroTrustHealthCheck: true,
        cloudSyncFrequencySec: 30,
      });
    } else {
      setLocalPolicies({
        strictPhishingBlock: false,
        blockApkSideloading: false,
        dnsThreatShield: true,
        scriptSanitizer: false,
        zeroTrustHealthCheck: false,
        cloudSyncFrequencySec: 60,
      });
    }
  };

  const handlePushPolicies = async () => {
    setIsPushing(true);
    try {
      await onUpdatePolicies(localPolicies);
      setPushSuccessMessage(`Security policies deployed and synchronized to ${devices.length} endpoints in 12ms.`);
      setTimeout(() => setPushSuccessMessage(null), 4000);
    } finally {
      setIsPushing(false);
    }
  };

  const handleSyncFleet = async () => {
    setIsSyncing(true);
    try {
      await onForceSync();
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>CROSS-PLATFORM MESH</span>
            <span aria-hidden="true">·</span>
            <span>CENTRAL POLICY ORCHESTRATION</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-mono">100% Endpoints Synchronized</span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight mt-1">
            Device Fleet Synchronization &amp; Security Policies
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Orchestrate zero-trust endpoint rules across iOS, Android, macOS, Windows, and Linux. Threat intelligence signatures and policies update with sub-20ms latency.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowPairModal(true)}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Pair New Device</span>
          </button>
          <button
            onClick={handleSyncFleet}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Force Fleet Sync</span>
          </button>
        </div>
      </div>

      {pushSuccessMessage && (
        <div className="p-3.5 bg-emerald-950/60 border border-emerald-800 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{pushSuccessMessage}</span>
        </div>
      )}

      {/* Connected Devices Fleet Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Connected Endpoints ({devices.length})
          </h3>
          <span className="text-xs font-mono text-slate-500">
            Average Network Latency: ~14ms
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {devices.map((device) => {
            const isQuarantined = device.status === 'QUARANTINED';

            return (
              <div
                key={device.id}
                className={`p-4 rounded-xl border transition-all ${
                  isQuarantined
                    ? 'bg-red-950/20 border-red-900/60'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center text-slate-300">
                      {device.type === 'mobile' ? (
                        <Smartphone className="w-4 h-4" />
                      ) : (
                        <Laptop className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white truncate max-w-[150px]">
                        {device.name}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        {device.platform}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                    isQuarantined
                      ? 'bg-red-950 text-red-300 border border-red-800'
                      : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                  }`}>
                    {device.status}
                  </span>
                </div>

                {/* Network & Security stats */}
                <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800/80 text-[11px] mb-3">
                  <div>
                    <span className="text-slate-500 block text-[10px]">IP Address</span>
                    <span className="font-mono text-slate-300">{device.ipAddress}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Scan Latency</span>
                    <span className="font-mono text-emerald-400 font-bold">{device.latencyMs}ms</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Threats Blocked</span>
                    <span className="font-mono text-white font-bold">{device.threatsPrevented}</span>
                  </div>
                </div>

                {/* Active Shields Icons */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                    <span title="Web Shield">Web: {device.activeShields.webProtection ? 'ON' : 'OFF'}</span>
                    <span>·</span>
                    <span title="APK Sandbox">APK: {device.activeShields.appSandbox ? 'ON' : 'OFF'}</span>
                    <span>·</span>
                    <span title="DNS Filter">DNS: {device.activeShields.dnsFilter ? 'ON' : 'OFF'}</span>
                  </div>

                  <button
                    onClick={() => onQuarantineDevice(device.id)}
                    className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors cursor-pointer ${
                      isQuarantined
                        ? 'bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-800'
                        : 'bg-red-950/60 text-red-300 hover:bg-red-900 border border-red-800'
                    }`}
                  >
                    {isQuarantined ? 'Release Isolation' : 'Quarantine'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Global Administrator Security Policy Center */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white">Central Security Policy Configuration</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Rules enforced across all connected mobile and desktop browsers and application sandboxes.
            </p>
          </div>

          {/* Policy presets */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => applyPreset('strict')}
              className="px-2.5 py-1 bg-slate-800 text-white rounded font-medium cursor-pointer"
            >
              Zero-Trust Strict
            </button>
            <button
              onClick={() => applyPreset('balanced')}
              className="px-2.5 py-1 text-slate-400 hover:text-white rounded cursor-pointer"
            >
              Balanced Enterprise
            </button>
            <button
              onClick={() => applyPreset('dev')}
              className="px-2.5 py-1 text-slate-400 hover:text-white rounded cursor-pointer"
            >
              Permissive Dev
            </button>
          </div>
        </div>

        {/* Policies Switch List */}
        <div className="p-6 divide-y divide-slate-800/80">
          {/* Policy 1: Phishing */}
          <div className="py-4 first:pt-0 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Strict Phishing &amp; Homoglyph Interception</span>
                <span className="text-[10px] text-emerald-400 font-mono">Real-time Stop Screen</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Automatically halts navigation to deceptive domains, Cyrillic lookalikes, and credential harvesters.
              </p>
            </div>
            <button
              onClick={() => handlePolicyToggle('strictPhishingBlock')}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                localPolicies.strictPhishingBlock ? 'bg-red-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  localPolicies.strictPhishingBlock ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Policy 2: APK Sideloading */}
          <div className="py-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Block Untrusted APK Sideloading &amp; Overlay Abuse</span>
                <span className="text-[10px] text-purple-400 font-mono">Mobile Vault</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Quarantines any Android package requesting Accessibility Service + System Alert Window from unverified origins.
              </p>
            </div>
            <button
              onClick={() => handlePolicyToggle('blockApkSideloading')}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                localPolicies.blockApkSideloading ? 'bg-red-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  localPolicies.blockApkSideloading ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Policy 3: DNS Threat Shield */}
          <div className="py-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Cloud Threat Intelligence DNS Shield</span>
                <span className="text-[10px] text-blue-400 font-mono">&lt;15ms Global Resolution</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Filters command-and-control (C2) domains, malvertising networks, and known phishing hosts at the DNS layer.
              </p>
            </div>
            <button
              onClick={() => handlePolicyToggle('dnsThreatShield')}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                localPolicies.dnsThreatShield ? 'bg-red-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  localPolicies.dnsThreatShield ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Policy 4: Script Sanitizer */}
          <div className="py-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>In-Browser Tab Script Sanitizer &amp; Miner Blocker</span>
                <span className="text-[10px] text-amber-400 font-mono">WASM CPU Cap</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Kills browser tabs that exceed 80% CPU usage executing WebAssembly cryptominers or clickjacking iframes.
              </p>
            </div>
            <button
              onClick={() => handlePolicyToggle('scriptSanitizer')}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                localPolicies.scriptSanitizer ? 'bg-red-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  localPolicies.scriptSanitizer ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Policy 5: Zero Trust Device Health */}
          <div className="py-4 last:pb-0 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Continuous Zero-Trust Device Health Verification</span>
                <span className="text-[10px] text-slate-400 font-mono">Heartbeat Telemetry</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Isolates endpoints whose OS patch level falls behind critical CVE compliance thresholds.
              </p>
            </div>
            <button
              onClick={() => handlePolicyToggle('zeroTrustHealthCheck')}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                localPolicies.zeroTrustHealthCheck ? 'bg-red-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  localPolicies.zeroTrustHealthCheck ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer Push Button */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Policies will be pushed to {devices.length} endpoints over authenticated WebSocket tunnel.
          </div>
          <button
            onClick={handlePushPolicies}
            disabled={isPushing}
            className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
          >
            <Zap className={`w-4 h-4 ${isPushing ? 'animate-spin' : ''}`} />
            <span>{isPushing ? 'Deploying Policies...' : 'Push Policies to All Devices'}</span>
          </button>
        </div>
      </div>

      {/* Pair New Device Modal */}
      {showPairModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white">Enroll New Endpoint</h4>
              <button
                onClick={() => setShowPairModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Scan this QR code with the Aegis Mobile Agent (Android/iOS) or execute the enrollment script on desktop:
            </p>

            <div className="w-48 h-48 mx-auto bg-white rounded-xl p-3 flex flex-col items-center justify-center">
              <QrCode className="w-40 h-40 text-slate-950" />
            </div>

            <div className="p-2.5 bg-slate-950 rounded border border-slate-800 font-mono text-[11px] text-slate-300 text-center select-all">
              TOKEN: AEGIS-ENROLL-8921-X99Q
            </div>

            <button
              onClick={() => setShowPairModal(false)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
