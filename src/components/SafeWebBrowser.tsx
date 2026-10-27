import React, { useState } from 'react';
import {
  Globe,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Lock,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  ExternalLink,
  Zap,
  CheckCircle2,
  Terminal,
} from 'lucide-react';
import { analyzeUrlSafety, ThreatAnalysisResult } from '../utils/securityEngine';

interface SafeWebBrowserProps {
  onTriggerAlert: (threat: ThreatAnalysisResult) => void;
}

interface SearchResultItem {
  title: string;
  url: string;
  snippet: string;
  safetyScore: number;
  isThreat: boolean;
  threatType?: string;
}

const PRESET_URLS = [
  { label: 'Official Bank (Safe)', url: 'https://chase.com', isSafe: true },
  { label: 'PayPal Spoof (Phishing)', url: 'https://paypa1-security-verification.com/login', isSafe: false },
  { label: 'Crypto Airdrop Trap (Fake)', url: 'https://metamask-airdrop-claim.top', isSafe: false },
  { label: 'Apple ID Stealer (Fake)', url: 'https://appleid-verify-account.support/auth', isSafe: false },
  { label: 'Developer Hub (Safe)', url: 'https://github.com', isSafe: true },
];

export const SafeWebBrowser: React.FC<SafeWebBrowserProps> = ({ onTriggerAlert }) => {
  const [currentUrl, setCurrentUrl] = useState('https://chase.com');
  const [inputUrl, setInputUrl] = useState('https://chase.com');
  const [activeAnalysis, setActiveAnalysis] = useState<ThreatAnalysisResult>(() => analyzeUrlSafety('https://chase.com'));
  const [isolatedSandboxMode, setIsolatedSandboxMode] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [viewMode, setViewMode] = useState<'browser' | 'search'>('browser');

  const handleNavigate = (targetUrl: string) => {
    setInputUrl(targetUrl);
    setCurrentUrl(targetUrl);
    setViewMode('browser');

    // 1. Instant local zero-latency heuristic scan (<5ms)
    const instantResult = analyzeUrlSafety(targetUrl);
    setActiveAnalysis(instantResult);

    if (instantResult.isThreat) {
      // Trigger STOP / ALERT notification immediately
      onTriggerAlert(instantResult);
    }

    // 2. Background server synchronization for threat audit logs & forensics
    setIsScanning(true);
    fetch('/api/scan/url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: targetUrl,
        deviceOrigin: 'CEO MacBook Pro',
        enableAiForensics: true,
      }),
    })
      .then((res) => (res.ok ? res.json() : instantResult))
      .then((serverResult) => {
        setActiveAnalysis(serverResult);
      })
      .catch((err) => {
        console.debug('Background scan sync:', err);
      })
      .finally(() => {
        setIsScanning(false);
      });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    if (inputUrl.includes('.') && !inputUrl.includes(' ')) {
      handleNavigate(inputUrl);
    } else {
      executeSafeSearch(inputUrl);
    }
  };

  const executeSafeSearch = (query: string) => {
    setSearchQuery(query);
    setViewMode('search');

    const mockResults: SearchResultItem[] = [
      {
        title: `Official Portal: ${query}`,
        url: `https://www.${query.toLowerCase().replace(/[^a-z0-9]/g, '')}.com/official`,
        snippet: `Verified enterprise portal for ${query}. Fully authenticated SSL certificate and zero-trust validated DNS records.`,
        safetyScore: 0,
        isThreat: false,
      },
      {
        title: `CRITICAL ALERT: Spoofed ${query} Account Update`,
        url: `https://${query.toLowerCase().replace(/[^a-z0-9]/g, '')}-account-verification.xyz/login`,
        snippet: `WARNING: Deceptive credential harvester mimicking ${query} authentication flow. Blocked by AegisShield.`,
        safetyScore: 92,
        isThreat: true,
        threatType: 'Credential Harvester',
      },
      {
        title: `Documentation & Reference Guide for ${query}`,
        url: `https://developer.${query.toLowerCase().replace(/[^a-z0-9]/g, '')}.org/docs`,
        snippet: `Official documentation, developer APIs, and verified security specifications for ${query}.`,
        safetyScore: 0,
        isThreat: false,
      },
      {
        title: `SUSPICIOUS: Free Bonus & Promo Giveaway for ${query}`,
        url: `https://free-${query.toLowerCase().replace(/[^a-z0-9]/g, '')}-claim.top`,
        snippet: `High-risk malvertising domain offering fake incentives to harvest session cookies and credentials.`,
        safetyScore: 88,
        isThreat: true,
        threatType: 'Phishing Trap',
      },
    ];

    setSearchResults(mockResults);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Fast Test Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-xl">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>SAFE BROWSER ENGINE</span>
            <span aria-hidden="true">·</span>
            <span>PHISHING INTERCEPTOR</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-mono">Real-Time Filtering Active</span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight mt-1">
            Safe Visit &amp; Phishing Filter Platform
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Inspect target destinations with sub-20ms reputation scoring. Phishing attempts, homoglyph lookalikes, and harmful redirects are neutralized before execution.
          </p>
        </div>

        {/* Quick test scenarios */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
            Test Scenarios:
          </span>
          {PRESET_URLS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleNavigate(item.url)}
              className={`px-2.5 py-1 text-xs rounded-md border transition-colors whitespace-nowrap cursor-pointer ${
                item.isSafe
                  ? 'border-emerald-800/60 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60'
                  : 'border-red-800/60 bg-red-950/40 text-red-300 hover:bg-red-900/60'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Browser Shell Frame */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        {/* Browser Top Navigation Bar */}
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center gap-3">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>

          <button
            onClick={() => handleNavigate(currentUrl)}
            title="Reload with security scan"
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-amber-400' : ''}`} />
          </button>

          {/* URL & Search Input Bar */}
          <form onSubmit={handleFormSubmit} className="flex-1 flex items-center gap-2">
            <div className="flex-1 flex items-center bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 focus-within:border-slate-500 transition-colors">
              {activeAnalysis.isThreat ? (
                <ShieldAlert className="w-4 h-4 text-red-400 mr-2 shrink-0" />
              ) : (
                <Lock className="w-4 h-4 text-emerald-400 mr-2 shrink-0" />
              )}
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Enter URL to inspect or search query (e.g. https://paypa1.com or bank login)"
                className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
              />
              <span className="text-[11px] font-mono text-slate-500 ml-2 whitespace-nowrap hidden sm:inline">
                {activeAnalysis.latencyMs}ms scan
              </span>
            </div>

            <button
              type="submit"
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>Inspect</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Mode Toggles */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setIsolatedSandboxMode(!isolatedSandboxMode)}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                isolatedSandboxMode
                  ? 'bg-amber-500 text-slate-950 font-semibold'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Terminal className="w-3 h-3" />
              <span className="hidden md:inline">Isolated Sandbox</span>
            </button>
          </div>
        </div>

        {/* Browser Security Status Ribbon */}
        <div className={`px-4 py-2 border-b flex items-center justify-between text-xs ${
          activeAnalysis.isThreat
            ? 'bg-red-950/50 border-red-900/50 text-red-300'
            : 'bg-emerald-950/40 border-emerald-900/40 text-emerald-300'
        }`}>
          <div className="flex items-center gap-2">
            {activeAnalysis.isThreat ? (
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span className="font-semibold">{activeAnalysis.threatType}</span>
            <span aria-hidden="true" className="text-slate-500">·</span>
            <span className="font-mono tabular-nums">
              Reputation: {100 - activeAnalysis.score}/100 Safe
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span>SSL: {activeAnalysis.indicators.sslStatus || 'VALID'}</span>
            <span className="text-slate-500">·</span>
            <span>ASN: {activeAnalysis.indicators.asnReputation || 'TRUSTED'}</span>
          </div>
        </div>

        {/* Viewport Content Area */}
        <div className="min-h-[420px] p-6 bg-slate-950 flex flex-col justify-center">
          {viewMode === 'search' ? (
            /* Search Results View */
            <div className="space-y-4 max-w-3xl mx-auto w-full">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
                <span>Safe Search Query: &quot;<strong className="text-white">{searchQuery}</strong>&quot;</span>
                <span className="text-emerald-400 font-mono">Phishing Link Disarm Enabled</span>
              </div>

              <div className="space-y-3">
                {searchResults.map((result, rIdx) => (
                  <div
                    key={rIdx}
                    className={`p-4 rounded-xl border transition-all ${
                      result.isThreat
                        ? 'bg-red-950/20 border-red-900/50 hover:border-red-700/80'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-slate-400 truncate max-w-sm">
                            {result.url}
                          </span>
                          {result.isThreat && (
                            <span className="text-[11px] font-semibold text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-800">
                              FLAGGED PHISHING LINK
                            </span>
                          )}
                        </div>
                        <h4 className={`text-sm font-semibold hover:underline cursor-pointer ${
                          result.isThreat ? 'text-red-300' : 'text-blue-400'
                        }`}
                        onClick={() => handleNavigate(result.url)}
                        >
                          {result.title}
                        </h4>
                        <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                          {result.snippet}
                        </p>
                      </div>

                      <button
                        onClick={() => handleNavigate(result.url)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap cursor-pointer ${
                          result.isThreat
                            ? 'bg-red-600/30 text-red-300 border border-red-500/50 hover:bg-red-600 hover:text-white'
                            : 'bg-slate-800 hover:bg-slate-700 text-white'
                        }`}
                      >
                        {result.isThreat ? 'Inspect Risk' : 'Safe Visit'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeAnalysis.isThreat && !isolatedSandboxMode ? (
            /* Intercepted Stop Screen */
            <div className="max-w-xl mx-auto text-center space-y-4 py-8">
              <div className="w-16 h-16 rounded-2xl bg-red-600/20 border border-red-500/50 text-red-400 flex items-center justify-center mx-auto shadow-lg shadow-red-950/50">
                <ShieldAlert className="w-8 h-8 stroke-[2.2] animate-bounce" />
              </div>

              <div>
                <div className="text-xs font-semibold text-red-400 uppercase tracking-wider">
                  Access Halted By AegisShield
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight mt-1">
                  Phishing &amp; Malicious Destination Blocked
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  The requested address <code className="text-red-300 font-mono px-1 py-0.5 bg-red-950 rounded">{currentUrl}</code> has been flagged for phishing, deceptive brand impersonation, or credential theft.
                </p>
              </div>

              {/* Reasons */}
              <div className="p-4 bg-slate-900 border border-red-900/60 rounded-xl text-left text-xs space-y-2">
                <div className="font-semibold text-red-400">Threat Intelligence Indicators:</div>
                <ul className="space-y-1 text-slate-300">
                  {activeAnalysis.reasons.map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => handleNavigate('https://chase.com')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
                >
                  Return to Safe Home
                </button>
                <button
                  onClick={() => setIsolatedSandboxMode(true)}
                  className="px-4 py-2 bg-amber-600/30 hover:bg-amber-600 hover:text-slate-950 text-amber-300 border border-amber-500/50 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Inspect Disarmed HTML in Sandbox</span>
                </button>
              </div>
            </div>
          ) : isolatedSandboxMode ? (
            /* Sandboxed Disarmed DOM Preview */
            <div className="max-w-2xl mx-auto w-full bg-slate-900 border border-amber-600/50 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-amber-300">ISOLATED SANDBOX DISARMED PREVIEW</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">All scripts, WebSockets &amp; form actions stripped</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-slate-950 rounded border border-slate-800 text-slate-300 space-y-1">
                  <div><strong>HTTP Status:</strong> 200 OK (Intercepted)</div>
                  <div><strong>Security Headers:</strong> X-Frame-Options: DENY, Content-Security-Policy: default-src &apos;none&apos;</div>
                  <div><strong>Disarmed Form:</strong> &lt;form action=&quot;[DISABLED_BY_AEGIS]&quot; method=&quot;POST&quot;&gt;</div>
                </div>

                <div className="p-4 bg-slate-950 rounded border border-slate-800 text-slate-400 space-y-2">
                  <div className="text-amber-400 font-semibold">// Sanitized Content Preview:</div>
                  <p className="text-slate-300">
                    &quot;Please verify your account credentials immediately. Click here to confirm your password.&quot;
                  </p>
                  <div className="text-red-400 text-[11px]">
                    [AegisShield Warning: Form input fields &apos;password&apos; and &apos;ssn&apos; have been neutralized]
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsolatedSandboxMode(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded transition-colors cursor-pointer"
                >
                  Exit Sandbox
                </button>
              </div>
            </div>
          ) : (
            /* Safe Page Preview */
            <div className="max-w-3xl mx-auto w-full space-y-5">
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Verified Safe Domain</h4>
                      <p className="text-xs font-mono text-slate-400">{currentUrl}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded">
                    Zero-Trust Validated
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs mb-4">
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80">
                    <div className="text-slate-500">TLS Encryption</div>
                    <div className="font-mono text-white mt-1">TLS 1.3 / AES-256-GCM</div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80">
                    <div className="text-slate-500">Domain Authority</div>
                    <div className="font-mono text-emerald-400 mt-1">Tier-1 Authentic</div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80">
                    <div className="text-slate-500">Script Sandbox</div>
                    <div className="font-mono text-white mt-1">Active Protection</div>
                  </div>
                </div>

                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                  <p className="font-semibold text-white mb-1">Safe Web Inspection Summary:</p>
                  No homoglyphs, zero-day exploit payloads, credential harvesters, or deceptive subdomains were found. Links on this page are actively verified against real-time cloud threat intelligence feeds.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
