import React, { useState } from 'react';
import {
  Smartphone,
  Laptop,
  Monitor,
  Globe,
  Plus,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Info,
  Shield,
  X,
} from 'lucide-react';
import { useSafeCross } from '../context/SafeCrossContext';
import { ConnectedDeviceItem } from '../types/safecross';
import { ConfirmationDialog } from '../components/ConfirmationDialog';

export const DevicesView: React.FC = () => {
  const { devices, addDevice, removeDevice, syncDevice, showToast } = useSafeCross();
  const [showAddModal, setShowAddModal] = useState(false);
  const [deviceToRemove, setDeviceToRemove] = useState<ConnectedDeviceItem | null>(null);

  // New device form state
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDevicePlatform, setNewDevicePlatform] = useState<'Android' | 'Windows' | 'macOS' | 'iOS' | 'Linux'>('Android');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeviceName.trim()) {
      showToast('Please enter a device identifier or name.', 'warning');
      return;
    }

    addDevice({
      name: newDeviceName.trim(),
      platform: newDevicePlatform,
      deviceType: newDevicePlatform === 'Android' || newDevicePlatform === 'iOS' ? 'mobile' : 'desktop',
      connectionStatus: 'Connected',
      protectionStatus: 'Demo Protection Active',
      lastScanTimestamp: 'Never scanned',
      ipAddress: `10.0.${Math.floor(Math.random() * 8)}.${Math.floor(10 + Math.random() * 200)}`,
      agentVersion: 'v2.4.0 (Demo Agent)',
    });

    setNewDeviceName('');
    setShowAddModal(false);
  };

  const getPlatformIcon = (platform: string, deviceType: string) => {
    if (deviceType === 'browser') return <Globe className="w-5 h-5 text-teal-400" />;
    if (platform === 'Android' || platform === 'iOS') return <Smartphone className="w-5 h-5 text-purple-400" />;
    if (platform === 'Windows') return <Monitor className="w-5 h-5 text-blue-400" />;
    return <Laptop className="w-5 h-5 text-teal-400" />;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#151F30] border border-[#263449] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
            <span>MULTI-DEVICE MESH</span>
            <span aria-hidden="true">·</span>
            <span>CONNECTED ENDPOINT FLEET</span>
            <span aria-hidden="true">·</span>
            <span className="text-teal-400 font-mono">{devices.length} Registered Endpoints</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight mt-1">
            Connected Devices
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] max-w-xl">
            Monitor synchronized endpoints across Android, Windows, and macOS workstations. Real cross-platform protection requires an installed SafeCross background service.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-950 transition-opacity flex items-center gap-2 cursor-pointer shadow-md shrink-0 self-start sm:self-auto"
          style={{ backgroundColor: '#20D6B5' }}
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>Add Demo Device</span>
        </button>
      </div>

      {/* Honest Endpoint Integration Architecture Banner */}
      <div className="p-4 rounded-xl bg-[#101827] border border-[#263449] flex items-start gap-3 text-xs">
        <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-[#94A3B8]">
          <span className="font-semibold text-slate-200">
            Endpoint Synchronization Notice:
          </span>
          <p className="leading-relaxed">
            These cards reflect simulated enrollment entries in the prototype state. A browser cannot inspect host OS network packets or scan background Android processes without a signed native companion app (APK with VPNService / AccessibilityService) or desktop agent (Windows Service / macOS daemon). Future production releases synchronize through authenticated mutual TLS (mTLS) cloud tunnels.
          </p>
        </div>
      </div>

      {/* Devices Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices.map((device) => {
          return (
            <div
              key={device.id}
              className="p-5 rounded-2xl bg-[#151F30] border border-[#263449] space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#101827] border border-[#263449] flex items-center justify-center shrink-0">
                      {getPlatformIcon(device.platform, device.deviceType)}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white truncate max-w-[160px]">
                        {device.name}
                      </h4>
                      <p className="text-[11px] font-mono text-[#94A3B8]">
                        {device.platform} {device.agentVersion && `· ${device.agentVersion}`}
                      </p>
                    </div>
                  </div>

                  <span className="font-mono text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                    {device.connectionStatus}
                  </span>
                </div>

                {/* Telemetry specs */}
                <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-[#101827] border border-[#263449] text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Protection State</span>
                    <span className="font-medium text-slate-200 text-[11px]">
                      {device.protectionStatus}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">IP Address</span>
                    <span className="font-mono text-slate-300 text-[11px]">
                      {device.ipAddress || '10.0.4.x'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Last Seen</span>
                    <span className="font-mono text-slate-300 text-[11px]">{device.lastSeen}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Threats Blocked</span>
                    <span className="font-mono text-teal-400 font-bold text-[11px]">
                      {device.threatsPrevented}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-[#263449]">
                <button
                  onClick={() => syncDevice(device.id)}
                  className="px-3 py-1.5 bg-[#101827] hover:bg-slate-800 border border-[#263449] text-xs font-semibold text-slate-300 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-teal-400" />
                  <span>Sync Telemetry</span>
                </button>

                <button
                  onClick={() => setDeviceToRemove(device)}
                  className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-[#101827] transition-colors"
                  title="Remove Device"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Device Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-[#151F30] border border-[#263449] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Enroll New Endpoint</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-[#101827]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#94A3B8]">
              Register a simulated mobile or workstation endpoint to test cross-device telemetry and policy distribution.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Device Friendly Name:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Finance Samsung Galaxy S24"
                  value={newDeviceName}
                  onChange={(e) => setNewDeviceName(e.target.value)}
                  className="w-full bg-[#101827] border border-[#263449] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Operating System Platform:
                </label>
                <select
                  value={newDevicePlatform}
                  onChange={(e) => setNewDevicePlatform(e.target.value as any)}
                  className="w-full bg-[#101827] border border-[#263449] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400 cursor-pointer"
                >
                  <option value="Android">Android 15 (Mobile)</option>
                  <option value="Windows">Windows 11 (Workstation)</option>
                  <option value="macOS">macOS Sequoia (Laptop)</option>
                  <option value="iOS">iOS 18 (iPhone / iPad)</option>
                  <option value="Linux">Ubuntu 24.04 (Server / Node)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-[#101827] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-slate-950 rounded-xl cursor-pointer"
                  style={{ backgroundColor: '#20D6B5' }}
                >
                  Enroll Device
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation to remove device */}
      <ConfirmationDialog
        isOpen={Boolean(deviceToRemove)}
        title={`Disconnect "${deviceToRemove?.name}"?`}
        message="This endpoint will be unlinked from the SafeCross demo fleet and will stop synchronizing threat intelligence policies."
        confirmLabel="Disconnect Device"
        cancelLabel="Keep Connected"
        isDangerous={true}
        onConfirm={() => {
          if (deviceToRemove) {
            removeDevice(deviceToRemove.id);
            setDeviceToRemove(null);
          }
        }}
        onCancel={() => setDeviceToRemove(null)}
      />
    </div>
  );
};
