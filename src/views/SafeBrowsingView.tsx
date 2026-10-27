import React, { useState } from 'react';
import {
  Compass,
  Search,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  ArrowLeft,
  ExternalLink,
  Plus,
  Trash2,
  Lock,
  RotateCcw,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { useSafeCross } from '../context/SafeCrossContext';
import { assessUrlRisk } from '../utils/urlRiskEngine';
import { UrlRiskAssessment } from '../types/safecross';

export const SafeBrowsingView: React.FC = () => {
  const { blockedUrls, addBlockedUrl, removeBlockedUrl, showToast, setActiveSection } = useSafeCross();
  const [navUrl, setNavUrl] = useState('https://chase.com');
  const [currentAssessment, setCurrentAssessment] = useState<UrlRiskAssessment>(() =>
    assessUrlRisk('https://chase.com', blockedUrls)
  );
  const [explicitBypass, setExplicitBypass] = useState(false);
  const [newBlockDomain, setNewBlockDomain] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleNavigate = (url: string) => {
    setIsEvaluating(true);
    setExplicitBypass(false);
    setNavUrl(url);

    setTimeout(() => {
      const assessment = assessUrlRisk(url, blockedUrls);
      setCurrentAssessment(assessment);
      setIsEvaluating(false);

      if (assessment.category === 'HIGH_RISK') {
        showToast('High-risk link blocked before navigation.', 'error');
      }
    }, 200);
  };

  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockDomain.trim()) return;
    addBlockedUrl(newBlockDomain.trim());
    setNewBlockDomain('');
  };

  const isBlocked = currentAssessment.category === 'HIGH_RISK';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#151F30] border border-[#263449] space-y-2">
        <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
          <span>SAFE BROWSING TESTBED</span>
          <span aria-hidden="true">·</span>
          <span>PRE-NAVIGATION GATEWAY</span>
          <span aria-hidden="true">·</span>
          <span className="text-teal-400 font-mono">Disarmed Sandbox</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
          Safe Web Visit &amp; Blocklist Manager
        </h2>
        <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed max-w-2xl">
          Evaluate links before opening them in a real browser. SafeCross blocks known phishing domains and requires explicit user confirmation before navigating to suspect destinations.
        </p>
      </div>

      {/* Honest Boundary Disclosure */}
      <div className="p-4 rounded-xl bg-[#101827] border border-[#263449] flex items-start gap-3 text-xs">
        <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-[#94A3B8]">
          <span className="font-semibold text-slate-200">
            Safe Browsing Architecture Note:
          </span>
          <p className="leading-relaxed">
            This testbed simulates pre-navigation gatekeeping inside the application viewport. A web application cannot automatically intercept external browser tabs opened outside this website. System-wide URL evaluation requires the SafeCross Browser Extension (Manifest V3 webRequest/declarativeNetRequest) or native OS DNS daemon.
          </p>
        </div>
      </div>

      {/* Safe Browser Frame */}
      <div className="rounded-2xl bg-[#151F30] border border-[#263449] overflow-hidden shadow-xl">
        {/* URL Bar */}
        <div className="p-4 bg-[#101827] border-b border-[#263449] flex items-center gap-3">
          <button
            onClick={() => handleNavigate(navUrl)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="Re-verify destination"
          >
            <RotateCcw className={`w-4 h-4 ${isEvaluating ? 'animate-spin text-teal-400' : ''}`} />
          </button>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleNavigate(navUrl);
            }}
            className="flex-1 flex items-center bg-[#151F30] border border-[#263449] rounded-xl px-3 py-2 focus-within:border-teal-400"
          >
            {isBlocked ? (
              <ShieldAlert className="w-4 h-4 text-red-400 mr-2 shrink-0" />
            ) : (
              <Lock className="w-4 h-4 text-emerald-400 mr-2 shrink-0" />
            )}
            <input
              type="text"
              value={navUrl}
              onChange={(e) => setNavUrl(e.target.value)}
              placeholder="Enter destination URL to inspect..."
              className="w-full bg-transparent text-xs text-white placeholder-slate-500 font-mono focus:outline-none"
            />
          </form>

          <button
            onClick={() => handleNavigate(navUrl)}
            className="px-4 py-2 text-xs font-bold text-slate-950 rounded-xl cursor-pointer"
            style={{ backgroundColor: '#20D6B5' }}
          >
            Go
          </button>
        </div>

        {/* Browser Sandbox Viewport */}
        <div className="min-h-[340px] p-6 bg-[#0B1220] flex flex-col justify-center">
          {isBlocked && !explicitBypass ? (
            /* Warning Screen */
            <div className="max-w-xl mx-auto text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto shadow-lg shadow-red-950/40">
                <ShieldAlert className="w-8 h-8 stroke-[2.2] animate-bounce" />
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-red-400 tracking-wider">
                  Access Intercepted
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight mt-1">
                  High Risk Phishing Destination Blocked
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  The destination <code className="text-red-300 font-mono bg-red-950 px-1 py-0.5 rounded">{navUrl}</code> was identified as dangerous. Proceeding may compromise credentials, banking credentials, or personal identity.
                </p>
              </div>

              {/* Reasons */}
              <div className="p-4 bg-[#151F30] rounded-xl border border-red-500/40 text-left text-xs space-y-2">
                <div className="font-semibold text-red-400">Triggered Security Gateways:</div>
                <ul className="space-y-1 text-slate-300">
                  {currentAssessment.indicators.map((ind, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">•</span>
                      <span>{ind}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => handleNavigate('https://chase.com')}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 transition-opacity cursor-pointer shadow-md flex items-center gap-2"
                  style={{ backgroundColor: '#20D6B5' }}
                >
                  <ArrowLeft className="w-4 h-4 text-slate-950" />
                  <span>Back to Safety (Recommended)</span>
                </button>
                <button
                  onClick={() => setExplicitBypass(true)}
                  className="px-4 py-2 bg-red-950/40 hover:bg-red-900/40 text-red-300 border border-red-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Proceed Anyway (Unsafe)
                </button>
              </div>
            </div>
          ) : (
            /* Safe Destination or Explicit Override */
            <div className="max-w-2xl mx-auto w-full p-6 bg-[#151F30] rounded-2xl border border-[#263449] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#263449]">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Pre-Navigation Check Passed</h4>
                    <p className="font-mono text-[11px] text-[#94A3B8]">{navUrl}</p>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-800">
                  Safe to Visit
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-3 bg-[#101827] rounded-xl border border-[#263449]">
                  <span className="text-slate-500 text-[10px]">TLS Certificate</span>
                  <div className="font-mono text-white mt-0.5">{currentAssessment.sslStatus}</div>
                </div>
                <div className="p-3 bg-[#101827] rounded-xl border border-[#263449]">
                  <span className="text-slate-500 text-[10px]">Reputation Score</span>
                  <div className="font-mono text-teal-400 font-bold mt-0.5">
                    {100 - currentAssessment.score}/100 Safe
                  </div>
                </div>
                <div className="p-3 bg-[#101827] rounded-xl border border-[#263449] col-span-2 sm:col-span-1">
                  <span className="text-slate-500 text-[10px]">Pre-Scan Latency</span>
                  <div className="font-mono text-white mt-0.5">{currentAssessment.scanDurationMs}ms</div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-[#101827] p-3.5 rounded-xl border border-[#263449]">
                {currentAssessment.summary}
              </p>

              {explicitBypass && (
                <div className="p-3 bg-red-950/30 border border-red-800 rounded-xl text-xs text-red-300 font-mono">
                  [Warning: Bypassed by user decision. Content rendering isolated.]
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Local Blocklist Manager Card */}
      <div className="p-6 rounded-2xl bg-[#151F30] border border-[#263449] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#263449]">
          <div>
            <h3 className="text-sm font-bold text-white">Local Demonstration Blocklist</h3>
            <p className="text-[11px] text-[#94A3B8]">
              Domains blocked locally by SafeCross during URL checks ({blockedUrls.length} entries)
            </p>
          </div>
        </div>

        {/* Add custom domain to blocklist */}
        <form onSubmit={handleAddDomain} className="flex gap-2">
          <input
            type="text"
            placeholder="Add domain to blocklist (e.g. malicious-test-site.com)"
            value={newBlockDomain}
            onChange={(e) => setNewBlockDomain(e.target.value)}
            className="flex-1 bg-[#101827] border border-[#263449] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 font-mono"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#101827] hover:bg-slate-800 border border-[#263449] text-xs font-semibold text-teal-400 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Block</span>
          </button>
        </form>

        {/* Blocklist tags */}
        <div className="flex flex-wrap gap-2">
          {blockedUrls.map((domain, idx) => (
            <div
              key={idx}
              className="px-2.5 py-1.5 bg-[#101827] border border-[#263449] rounded-xl text-xs font-mono text-slate-300 flex items-center gap-2"
            >
              <span className="truncate max-w-[200px]">{domain}</span>
              <button
                onClick={() => removeBlockedUrl(domain)}
                className="text-slate-500 hover:text-red-400 p-0.5 cursor-pointer"
                title="Remove from blocklist"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
