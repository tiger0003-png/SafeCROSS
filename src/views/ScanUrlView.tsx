import React, { useState, useRef } from 'react';
import {
  Globe,
  Search,
  Clipboard,
  X,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Copy,
  Check,
  RotateCcw,
  StopCircle,
  ExternalLink,
  Lock,
  ArrowLeft,
} from 'lucide-react';
import { useSafeCross } from '../context/SafeCrossContext';
import { assessUrlRisk } from '../utils/urlRiskEngine';
import { UrlRiskAssessment } from '../types/safecross';

export const ScanUrlView: React.FC = () => {
  const { blockedUrls, addHistoryItem, showToast, setActiveSection } = useSafeCross();
  const [urlInput, setUrlInput] = useState('https://paypa1-security-verification.com/login');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [result, setResult] = useState<UrlRiskAssessment | null>(null);
  const [copiedReport, setCopiedReport] = useState(false);
  const scanAbortRef = useRef(false);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrlInput(text.trim());
        showToast('Pasted URL from clipboard.', 'info');
      }
    } catch {
      showToast('Clipboard access unavailable.', 'warning');
    }
  };

  const handleClear = () => {
    setUrlInput('');
    setResult(null);
  };

  const handleCancelScan = () => {
    scanAbortRef.current = true;
    setIsScanning(false);
    setScanProgress(0);
    showToast('Scan cancelled by user.', 'info');
  };

  const executeScan = (targetUrl: string) => {
    if (!targetUrl.trim()) {
      showToast('Please enter a URL to analyze.', 'warning');
      return;
    }

    scanAbortRef.current = false;
    setIsScanning(true);
    setScanProgress(15);
    setResult(null);

    // Simulated progress steps for realistic feedback
    const timer1 = setTimeout(() => {
      if (scanAbortRef.current) return;
      setScanProgress(55);
    }, 150);

    const timer2 = setTimeout(() => {
      if (scanAbortRef.current) return;
      setScanProgress(90);
    }, 300);

    const timer3 = setTimeout(() => {
      if (scanAbortRef.current) return;
      setScanProgress(100);
      setIsScanning(false);

      const assessment = assessUrlRisk(targetUrl, blockedUrls);
      setResult(assessment);

      // Persist to scan history
      addHistoryItem({
        target: targetUrl,
        type: 'URL',
        category: assessment.category,
        score: assessment.score,
        summary: assessment.summary,
        indicators: assessment.indicators,
        details: {
          engine: assessment.engine,
          sslStatus: assessment.sslStatus,
        },
      });

      if (assessment.category === 'HIGH_RISK') {
        showToast('High-risk phishing / malicious URL detected!', 'error');
      } else if (assessment.category === 'SUSPICIOUS') {
        showToast('Suspicious link structure identified.', 'warning');
      } else {
        showToast('Scan complete: Low risk destination.', 'success');
      }
    }, 450);
  };

  const handleCopyReport = () => {
    if (!result) return;
    const reportText = `[SAFECROSS URL RISK AUDIT REPORT]
Generated: ${result.timestamp}
Target URL: ${result.url}
Domain: ${result.domain}
Risk Category: ${result.category}
Risk Score: ${result.score}/100
Engine: ${result.engine}
SSL Status: ${result.sslStatus}
Summary: ${result.summary}
Indicators:
${result.indicators.map((i) => ` - ${i}`).join('\n')}
Recommended Action: ${result.recommendedAction}
Disclaimer: Evaluated via SafeCross local pattern heuristics and simulated threat-intel cache.`;

    navigator.clipboard.writeText(reportText);
    setCopiedReport(true);
    showToast('Report copied to clipboard.', 'success');
    setTimeout(() => setCopiedReport(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* View Header */}
      <div className="p-6 rounded-2xl bg-[#151F30] border border-[#263449] space-y-2">
        <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
          <span>URL THREAT SCANNER</span>
          <span aria-hidden="true">·</span>
          <span>PHISHING &amp; HOMOGLYPH ENGINE</span>
          <span aria-hidden="true">·</span>
          <span className="text-teal-400 font-mono">Local Pattern Analysis</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
          Inspect &amp; Verify Suspicious Links
        </h2>
        <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed max-w-2xl">
          Enter any URL to test for homoglyph typosquatting, credential harvesting keywords, excessive subdomain obfuscation, and suspicious top-level domains without executing the link.
        </p>
      </div>

      {/* Input Form Card */}
      <div className="p-6 rounded-2xl bg-[#151F30] border border-[#263449] space-y-4 shadow-lg">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            executeScan(urlInput);
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="url-input" className="block text-xs font-semibold text-slate-300 mb-2">
              Target Destination URL:
            </label>
            <div className="relative flex items-center bg-[#101827] border border-[#263449] rounded-xl focus-within:border-teal-400 transition-colors">
              <Globe className="w-4 h-4 text-slate-400 ml-3.5 shrink-0" />
              <input
                id="url-input"
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="e.g. https://paypa1-security-verification.com/login"
                className="w-full bg-transparent px-3 py-3 text-xs sm:text-sm text-white placeholder-slate-500 font-mono focus:outline-none"
              />
              <div className="flex items-center gap-1.5 pr-2 shrink-0">
                {urlInput && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                    title="Clear input"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handlePaste}
                  className="px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-[#151F30] hover:bg-slate-800 border border-[#263449] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  title="Paste from clipboard"
                >
                  <Clipboard className="w-3.5 h-3.5 text-teal-400" />
                  <span className="hidden sm:inline">Paste</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-[#94A3B8] font-medium text-[11px]">Test Sample Scenarios:</span>
            <button
              type="button"
              onClick={() => {
                setUrlInput('https://paypa1-security-verification.com/login');
                executeScan('https://paypa1-security-verification.com/login');
              }}
              className="px-2 py-0.5 rounded text-[11px] font-mono text-red-300 bg-red-950/40 border border-red-800/60 hover:bg-red-900/40 cursor-pointer"
            >
              PayPal Typosquat
            </button>
            <button
              type="button"
              onClick={() => {
                setUrlInput('https://chase-online-login-update.xyz');
                executeScan('https://chase-online-login-update.xyz');
              }}
              className="px-2 py-0.5 rounded text-[11px] font-mono text-red-300 bg-red-950/40 border border-red-800/60 hover:bg-red-900/40 cursor-pointer"
            >
              Chase .xyz Phishing
            </button>
            <button
              type="button"
              onClick={() => {
                setUrlInput('http://192.168.1.100/admin/auth');
                executeScan('http://192.168.1.100/admin/auth');
              }}
              className="px-2 py-0.5 rounded text-[11px] font-mono text-amber-300 bg-amber-950/40 border border-amber-800/60 hover:bg-amber-900/40 cursor-pointer"
            >
              Raw IP Hostname
            </button>
            <button
              type="button"
              onClick={() => {
                setUrlInput('https://github.com/developer/project');
                executeScan('https://github.com/developer/project');
              }}
              className="px-2 py-0.5 rounded text-[11px] font-mono text-teal-300 bg-teal-950/40 border border-teal-800/60 hover:bg-teal-900/40 cursor-pointer"
            >
              Clean GitHub URL
            </button>
          </div>

          {/* Progress bar if scanning */}
          {isScanning && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                  <span>Evaluating syntactic tokens &amp; threat intelligence...</span>
                </span>
                <span>{scanProgress}%</span>
              </div>
              <div className="w-full bg-[#101827] h-2 rounded-full overflow-hidden border border-[#263449]">
                <div
                  className="h-full rounded-full transition-all duration-150"
                  style={{ width: `${scanProgress}%`, backgroundColor: '#20D6B5' }}
                />
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {isScanning ? (
              <button
                type="button"
                onClick={handleCancelScan}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-red-400 bg-red-950/40 border border-red-800 hover:bg-red-900/40 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <StopCircle className="w-4 h-4" />
                <span>Cancel Scan</span>
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 transition-all shadow-md flex items-center gap-2 cursor-pointer hover:opacity-95"
                style={{ backgroundColor: '#20D6B5' }}
              >
                <Search className="w-4 h-4 text-slate-950" />
                <span>Scan Link Now</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Result Card */}
      {result && (
        <div
          className={`p-6 rounded-2xl border space-y-5 animate-in fade-in duration-200 ${
            result.category === 'HIGH_RISK'
              ? 'bg-[#151F30] border-red-500/60 shadow-xl shadow-red-950/20'
              : result.category === 'SUSPICIOUS'
              ? 'bg-[#151F30] border-amber-500/60 shadow-xl shadow-amber-950/20'
              : 'bg-[#151F30] border-emerald-500/50 shadow-xl shadow-emerald-950/20'
          }`}
        >
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#263449]">
            <div className="flex items-center gap-3.5">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  result.category === 'HIGH_RISK'
                    ? 'bg-red-500/10 text-red-400 border border-red-500/40'
                    : result.category === 'SUSPICIOUS'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/40'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/40'
                }`}
              >
                {result.category === 'HIGH_RISK' ? (
                  <ShieldAlert className="w-6 h-6 stroke-[2.2]" />
                ) : result.category === 'SUSPICIOUS' ? (
                  <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
                ) : (
                  <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`font-mono text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                      result.category === 'HIGH_RISK'
                        ? 'bg-red-950 text-red-300 border-red-800'
                        : result.category === 'SUSPICIOUS'
                        ? 'bg-amber-950 text-amber-300 border-amber-800'
                        : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    }`}
                  >
                    {result.category.replace('_', ' ')}
                  </span>
                  <span className="text-[#94A3B8] text-xs">·</span>
                  <span className="font-mono text-xs text-slate-300">
                    Risk Score: <strong className="text-white">{result.score}/100</strong>
                  </span>
                  <span className="text-[#94A3B8] text-xs">·</span>
                  <span className="font-mono text-[11px] text-[#94A3B8]">
                    Scanned in {result.scanDurationMs}ms
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">{result.title}</h3>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopyReport}
                className="px-3 py-1.5 bg-[#101827] hover:bg-slate-800 border border-[#263449] text-xs font-semibold text-slate-300 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedReport ? 'Copied' : 'Copy Report'}</span>
              </button>
            </div>
          </div>

          {/* High-Risk Explicit Warning */}
          {result.category === 'HIGH_RISK' && (
            <div className="p-4 bg-red-950/40 border border-red-800/80 rounded-xl text-xs space-y-1 text-red-200">
              <div className="font-bold text-red-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>CRITICAL SECURITY WARNING</span>
              </div>
              <p className="leading-relaxed">
                Do not open or enter passwords on this destination. SafeCross will NOT automatically visit or execute this link to protect your credentials and endpoint environment.
              </p>
            </div>
          )}

          {/* Target Spec Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-[#101827] rounded-xl border border-[#263449]">
              <span className="text-slate-500 text-[11px]">Normalized Domain</span>
              <div className="font-mono text-white mt-0.5 truncate">{result.domain}</div>
            </div>
            <div className="p-3 bg-[#101827] rounded-xl border border-[#263449]">
              <span className="text-slate-500 text-[11px]">TLS / SSL State</span>
              <div className="font-mono text-white mt-0.5">{result.sslStatus}</div>
            </div>
            <div className="p-3 bg-[#101827] rounded-xl border border-[#263449]">
              <span className="text-slate-500 text-[11px]">Threat Intel Engine</span>
              <div className="font-mono text-teal-400 mt-0.5">{result.engine}</div>
            </div>
          </div>

          {/* Explanation & Summary */}
          <div className="space-y-1.5 text-xs">
            <h4 className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
              Analysis Assessment Summary
            </h4>
            <p className="text-slate-300 leading-relaxed bg-[#101827] p-3.5 rounded-xl border border-[#263449]">
              {result.summary}
            </p>
          </div>

          {/* Detected Indicators List */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
              Detected Pattern Indicators ({result.indicators.length})
            </h4>
            <div className="space-y-1.5">
              {result.indicators.map((ind, i) => (
                <div
                  key={i}
                  className="p-3 bg-[#101827] rounded-xl border border-[#263449] flex items-start gap-2 text-slate-300"
                >
                  <span
                    className={`font-bold shrink-0 mt-0.5 ${
                      result.category === 'HIGH_RISK'
                        ? 'text-red-400'
                        : result.category === 'SUSPICIOUS'
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    •
                  </span>
                  <span>{ind}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Next Action & Back to Safety */}
          <div className="p-4 bg-[#101827] rounded-xl border border-[#263449] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase text-slate-400">
                Recommended Next Action
              </span>
              <p className="text-xs font-semibold text-white">{result.recommendedAction}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveSection('home')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Safety</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
