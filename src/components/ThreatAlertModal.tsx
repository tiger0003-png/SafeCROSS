import React, { useState, useEffect } from 'react';
import {
  AlertOctagon,
  ShieldAlert,
  Lock,
  Copy,
  Check,
  ExternalLink,
  Volume2,
  VolumeX,
  X,
  Terminal,
  ShieldCheck,
} from 'lucide-react';
import { ThreatAnalysisResult } from '../utils/securityEngine';
import { playSecurityAlertSound } from '../utils/soundAlert';

interface ThreatAlertModalProps {
  threat: ThreatAnalysisResult | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenSandboxPreview?: (target: string) => void;
  onOverride?: (threat: ThreatAnalysisResult) => void;
}

export const ThreatAlertModal: React.FC<ThreatAlertModalProps> = ({
  threat,
  isOpen,
  onClose,
  onOpenSandboxPreview,
  onOverride,
}) => {
  const [copied, setCopied] = useState(false);
  const [showOverrideInput, setShowOverrideInput] = useState(false);
  const [overridePin, setOverridePin] = useState('');
  const [overrideError, setOverrideError] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState<'summary' | 'indicators' | 'rawIoc'>('summary');

  useEffect(() => {
    if (isOpen && threat && soundEnabled) {
      playSecurityAlertSound();
    }
  }, [isOpen, threat, soundEnabled]);

  if (!isOpen || !threat) return null;

  const handleCopyIoc = () => {
    const iocText = `[AEGIS-SHIELD-IOC-REPORT]
Timestamp: ${new Date().toISOString()}
Target: ${threat.target}
Threat Type: ${threat.threatType}
Severity: ${threat.severity}
Score: ${threat.score}/100
MITRE Technique: ${threat.mitreTechnique || 'N/A'}
Scan Latency: ${threat.latencyMs}ms
Forensic Reasons:
${threat.reasons.map(r => ` - ${r}`).join('\n')}
SSL: ${threat.indicators.sslStatus || 'N/A'}
ASN Reputation: ${threat.indicators.asnReputation || 'N/A'}
Verdict: Access Blocked by Real-Time Zero-Trust Engine.`;

    navigator.clipboard.writeText(iocText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAdminOverrideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (overridePin === '1337' || overridePin === 'admin') {
      setOverrideError(false);
      if (onOverride) onOverride(threat);
      onClose();
    } else {
      setOverrideError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-red-500/50 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Threat Header Bar */}
        <div className="bg-red-950/80 border-b border-red-800/60 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-600/30 border border-red-500/60 flex items-center justify-center text-red-400">
              <AlertOctagon className="w-6 h-6 stroke-[2.2] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-red-300">
                <span>SECURITY INTERCEPTOR</span>
                <span aria-hidden="true">·</span>
                <span>REAL-TIME STOP ALERT</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums text-red-400">{threat.latencyMs}ms scan</span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                High Risk Threat Blocked
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute alert chime' : 'Enable alert chime'}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Target Alert Banner */}
        <div className="px-6 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs text-slate-400 whitespace-nowrap">Target:</span>
            <span className="text-xs font-mono font-medium text-red-300 truncate max-w-md">
              {threat.target}
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0 text-xs">
            <span className="font-mono tabular-nums font-semibold text-red-400">
              Risk: {threat.score}/100
            </span>
            <span className="text-slate-500">·</span>
            <span className="font-semibold text-red-400">{threat.severity}</span>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800 px-6 pt-2 bg-slate-900/50">
          <button
            onClick={() => setActiveTab('summary')}
            className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'summary'
                ? 'border-red-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Threat Analysis
          </button>
          <button
            onClick={() => setActiveTab('indicators')}
            className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'indicators'
                ? 'border-red-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Forensic Indicators ({threat.reasons.length})
          </button>
          <button
            onClick={() => setActiveTab('rawIoc')}
            className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'rawIoc'
                ? 'border-red-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Raw IOC Feed
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'summary' && (
            <>
              <div className="p-3.5 bg-red-950/30 border border-red-900/40 rounded-lg">
                <div className="text-xs font-semibold text-red-400 mb-1">
                  Threat Classification
                </div>
                <div className="text-sm font-medium text-white mb-2">
                  {threat.threatType}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  AegisShield real-time zero-trust engine intercepted outbound traffic to prevent credential exfiltration, identity theft, and endpoint compromise.
                </p>
              </div>

              {threat.mitreTechnique && (
                <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs">
                  <span className="text-slate-400">Adversary Tactics:</span>
                  <span className="font-mono text-amber-400">{threat.mitreTechnique}</span>
                </div>
              )}

              {/* Forensic reason highlights */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Key Detection Triggers
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {threat.reasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-red-400 font-bold shrink-0 mt-0.5">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Telemetry info row */}
              <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-md">
                  <div className="text-slate-500 text-[11px]">Domain / ASN Rep</div>
                  <div className="font-mono text-slate-200 font-medium">
                    {threat.indicators.asnReputation || 'SUSPICIOUS'}
                  </div>
                </div>
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-md">
                  <div className="text-slate-500 text-[11px]">SSL Verification</div>
                  <div className="font-mono text-slate-200 font-medium">
                    {threat.indicators.sslStatus || 'DECEPTIVE'}
                  </div>
                </div>
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-md">
                  <div className="text-slate-500 text-[11px]">Recommended</div>
                  <div className="font-mono text-red-400 font-medium">
                    {threat.recommendedAction}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'indicators' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-400">
                Detailed heuristics calculated by local zero-latency scanner &amp; cloud intelligence:
              </div>
              <div className="space-y-2">
                {threat.reasons.map((r, i) => (
                  <div key={i} className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs flex items-start gap-3">
                    <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">Rule {i + 1} Triggered</div>
                      <div className="text-slate-300 mt-0.5">{r}</div>
                    </div>
                  </div>
                ))}
              </div>

              {threat.indicators.dangerousPermissions && threat.indicators.dangerousPermissions.length > 0 && (
                <div className="mt-3">
                  <div className="text-xs font-semibold text-slate-400 mb-1.5">
                    Flagged Dangerous Android Permissions:
                  </div>
                  <div className="space-y-1">
                    {threat.indicators.dangerousPermissions.map((perm, pIdx) => (
                      <div key={pIdx} className="font-mono text-[11px] text-amber-300 bg-slate-950 p-1.5 rounded border border-slate-800">
                        {perm}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'rawIoc' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Indicators of Compromise (STIX / OpenIOC format):</span>
                <button
                  onClick={handleCopyIoc}
                  className="flex items-center gap-1 text-slate-300 hover:text-white cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy IOC'}</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg font-mono text-xs text-slate-300 overflow-x-auto whitespace-pre leading-relaxed">
{`{
  "ioc_type": "${threat.vector}",
  "indicator": "${threat.target}",
  "threat_name": "${threat.threatType}",
  "confidence_score": ${threat.score},
  "severity": "${threat.severity}",
  "mitre_technique": "${threat.mitreTechnique || 'N/A'}",
  "ssl_state": "${threat.indicators.sslStatus || 'UNKNOWN'}",
  "asn_class": "${threat.indicators.asnReputation || 'SUSPICIOUS'}",
  "action": "${threat.recommendedAction}",
  "timestamp": "${new Date().toISOString()}"
}`}
              </pre>
            </div>
          )}

          {/* Admin Override Section */}
          {showOverrideInput && (
            <form onSubmit={handleAdminOverrideSubmit} className="p-3.5 bg-amber-950/30 border border-amber-900/50 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                <Lock className="w-3.5 h-3.5" />
                <span>Administrator Override Request</span>
              </div>
              <p className="text-xs text-slate-300">
                Bypassing real-time protection exposes device credentials. Enter administrator PIN to proceed (Demo PIN: <code className="text-amber-300">1337</code>):
              </p>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="Enter PIN (1337)"
                  value={overridePin}
                  onChange={(e) => setOverridePin(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold text-xs rounded transition-colors cursor-pointer"
                >
                  Confirm Bypass
                </button>
              </div>
              {overrideError && (
                <div className="text-[11px] text-red-400 font-medium">
                  Invalid PIN. Authorization denied.
                </div>
              )}
            </form>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyIoc}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied IOC' : 'Copy Threat IOC'}</span>
            </button>

            {onOpenSandboxPreview && threat.vector === 'PHISHING_URL' && (
              <button
                onClick={() => {
                  onClose();
                  onOpenSandboxPreview(threat.target);
                }}
                className="px-3 py-1.5 text-xs font-medium text-amber-300 hover:text-amber-200 bg-amber-950/40 border border-amber-800/60 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Isolated Sandbox View</span>
              </button>
            )}

            {!showOverrideInput && (
              <button
                onClick={() => setShowOverrideInput(true)}
                className="text-xs text-slate-500 hover:text-slate-300 underline underline-offset-4 cursor-pointer"
              >
                Admin Override
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-md transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Quarantine &amp; Abort Visit (Safe)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
