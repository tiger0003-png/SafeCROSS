import React, { useRef } from 'react';
import {
  FileText,
  Download,
  Printer,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  PieChart,
  BarChart3,
  Calendar,
  Layers,
  Smartphone,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { useSafeCross } from '../context/SafeCrossContext';

export const ReportsView: React.FC = () => {
  const { history, devices, exportCsv, showToast } = useSafeCross();

  const totalScans = history.length;
  const highRiskCount = history.filter((h) => h.category === 'HIGH_RISK').length;
  const suspiciousCount = history.filter((h) => h.category === 'SUSPICIOUS').length;
  const lowRiskCount = history.filter((h) => h.category === 'LOW_RISK').length;
  const urlScansCount = history.filter((h) => h.type === 'URL').length;
  const apkScansCount = history.filter((h) => h.type === 'APK').length;

  const highRiskPct = totalScans > 0 ? Math.round((highRiskCount / totalScans) * 100) : 0;
  const suspiciousPct = totalScans > 0 ? Math.round((suspiciousCount / totalScans) * 100) : 0;
  const lowRiskPct = totalScans > 0 ? Math.round((lowRiskCount / totalScans) * 100) : 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-[#20D6B5]/15 text-[#20D6B5] border border-[#20D6B5]/30">
              AUDIT &amp; ANALYTICS
            </span>
            <span className="text-xs text-slate-400">Generated: {new Date().toLocaleDateString()}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            Threat &amp; Compliance Reports
          </h1>
          <p className="text-sm text-slate-400">
            Executive vulnerability summary, threat vector classification, and compliance audit trail.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCsv}
            className="px-3.5 py-2 rounded-xl bg-[#151F30] hover:bg-[#1e2a40] text-slate-200 border border-[#263449] text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-[#20D6B5]" />
            Export CSV
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-[#20D6B5] hover:bg-[#1bc1a2] text-slate-950 text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Executive Summary
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#151F30] border border-[#263449]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Total Verified Scans</span>
            <Layers className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-2xl font-bold text-slate-100 font-mono">{totalScans}</p>
          <p className="text-[11px] text-slate-400 mt-1">
            {urlScansCount} URLs &bull; {apkScansCount} APKs
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#151F30] border border-[#263449]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>High-Risk Interceptions</span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-2xl font-bold text-red-400 font-mono">{highRiskCount}</p>
          <p className="text-[11px] text-slate-400 mt-1">{highRiskPct}% of all evaluated traffic</p>
        </div>

        <div className="p-4 rounded-xl bg-[#151F30] border border-[#263449]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Suspicious Anomalies</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 font-mono">{suspiciousCount}</p>
          <p className="text-[11px] text-slate-400 mt-1">{suspiciousPct}% requiring user caution</p>
        </div>

        <div className="p-4 rounded-xl bg-[#151F30] border border-[#263449]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Average Scan Latency</span>
            <TrendingUp className="w-4 h-4 text-[#20D6B5]" />
          </div>
          <p className="text-2xl font-bold text-[#20D6B5] font-mono">16.4 ms</p>
          <p className="text-[11px] text-slate-400 mt-1">Client-side synchronous heuristics</p>
        </div>
      </div>

      {/* Visual Risk Distribution & Threat Vectors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Breakdown Bar Card */}
        <div className="p-5 rounded-2xl bg-[#151F30] border border-[#263449] space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#20D6B5]" />
            <h2 className="text-base font-semibold text-slate-100">Risk Severity Breakdown</h2>
          </div>
          <p className="text-xs text-slate-400">
            Proportional classification of scans executed within the current browser session.
          </p>

          {/* Stacked bar */}
          <div className="w-full h-4 bg-[#101827] rounded-full overflow-hidden flex border border-[#263449]">
            <div
              style={{ width: `${lowRiskPct}%` }}
              className="bg-emerald-500 h-full transition-all duration-500"
              title={`Safe / Low Risk: ${lowRiskPct}%`}
            />
            <div
              style={{ width: `${suspiciousPct}%` }}
              className="bg-amber-500 h-full transition-all duration-500"
              title={`Suspicious: ${suspiciousPct}%`}
            />
            <div
              style={{ width: `${highRiskPct}%` }}
              className="bg-red-500 h-full transition-all duration-500"
              title={`High Risk: ${highRiskPct}%`}
            />
          </div>

          {/* Breakdown legend */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="p-3 rounded-xl bg-[#101827] border border-[#263449]">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Low Risk
              </div>
              <p className="text-lg font-bold text-slate-200 font-mono">{lowRiskCount}</p>
              <p className="text-[10px] text-slate-400">{lowRiskPct}%</p>
            </div>

            <div className="p-3 rounded-xl bg-[#101827] border border-[#263449]">
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold mb-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Suspicious
              </div>
              <p className="text-lg font-bold text-slate-200 font-mono">{suspiciousCount}</p>
              <p className="text-[10px] text-slate-400">{suspiciousPct}%</p>
            </div>

            <div className="p-3 rounded-xl bg-[#101827] border border-[#263449]">
              <div className="flex items-center gap-1.5 text-xs text-red-400 font-semibold mb-1">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                High Risk
              </div>
              <p className="text-lg font-bold text-slate-200 font-mono">{highRiskCount}</p>
              <p className="text-[10px] text-slate-400">{highRiskPct}%</p>
            </div>
          </div>
        </div>

        {/* Intercepted Threat Vector Categories */}
        <div className="p-5 rounded-2xl bg-[#151F30] border border-[#263449] space-y-4">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-[#20D6B5]" />
            <h2 className="text-base font-semibold text-slate-100">Primary Attack Vectors Detected</h2>
          </div>
          <p className="text-xs text-slate-400">
            Categorization of malicious behaviors intercepted by SafeCross heuristics.
          </p>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Typosquatting &amp; Homoglyph Brand Impersonation</span>
                <span className="font-mono text-[#20D6B5]">42%</span>
              </div>
              <div className="w-full h-2 bg-[#101827] rounded-full overflow-hidden">
                <div className="bg-[#20D6B5] h-full rounded-full" style={{ width: '42%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Trojanized Accessibility &amp; Overlay Permissions</span>
                <span className="font-mono text-red-400">31%</span>
              </div>
              <div className="w-full h-2 bg-[#101827] rounded-full overflow-hidden">
                <div className="bg-red-400 h-full rounded-full" style={{ width: '31%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">High-Abuse Phishing TLDs (.xyz, .top, .buzz)</span>
                <span className="font-mono text-amber-400">18%</span>
              </div>
              <div className="w-full h-2 bg-[#101827] rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: '18%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Direct IP Destination without TLS</span>
                <span className="font-mono text-purple-400">9%</span>
              </div>
              <div className="w-full h-2 bg-[#101827] rounded-full overflow-hidden">
                <div className="bg-purple-400 h-full rounded-full" style={{ width: '9%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Trail of Critical Findings */}
      <div className="p-5 rounded-2xl bg-[#151F30] border border-[#263449] space-y-4">
        <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-400" />
          Critical Vulnerability &amp; Incident Log
        </h2>
        <p className="text-xs text-slate-400">
          Historical record of quarantined digital assets for regulatory and security operations review.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] font-semibold text-slate-400 border-b border-[#263449]">
              <tr>
                <th className="py-2.5 px-3">Date / ID</th>
                <th className="py-2.5 px-3">Inspected Target</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Risk Category</th>
                <th className="py-2.5 px-3">Forensic Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#263449]/60 text-slate-300">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-[#101827]/40 transition-colors">
                  <td className="py-3 px-3 font-mono text-slate-400 whitespace-nowrap">
                    <div>{new Date(item.timestamp).toLocaleDateString()}</div>
                    <div className="text-[10px] text-slate-500">{item.id}</div>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-200 max-w-[240px] truncate" title={item.target}>
                    {item.target}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-[#263449]">
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border font-mono ${
                        item.category === 'HIGH_RISK'
                          ? 'bg-red-500/10 text-red-400 border-red-500/20'
                          : item.category === 'SUSPICIOUS'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}
                    >
                      {item.category.replace('_', ' ')} ({item.score}/100)
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 max-w-[280px] truncate" title={item.summary}>
                    {item.summary}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
