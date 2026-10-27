import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Layers,
  Smartphone,
  Globe,
  Trash2,
  ExternalLink,
  ChevronRight,
  X,
  FileText,
  Activity,
  Shield,
} from 'lucide-react';
import { FlaggedThreatRecord } from '../../server';
import { ThreatSeverity, ThreatVector } from '../utils/securityEngine';

interface ThreatHistoryDashboardProps {
  threats: FlaggedThreatRecord[];
  onSelectThreat: (threat: FlaggedThreatRecord) => void;
  onDeleteThreat: (id: string) => void;
  onOverrideThreat: (id: string) => void;
  onOpenReportModal: () => void;
}

export const ThreatHistoryDashboard: React.FC<ThreatHistoryDashboardProps> = ({
  threats,
  onSelectThreat,
  onDeleteThreat,
  onOverrideThreat,
  onOpenReportModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [vectorFilter, setVectorFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [selectedThreatDetail, setSelectedThreatDetail] = useState<FlaggedThreatRecord | null>(null);

  const filteredThreats = threats.filter((item) => {
    const matchesSearch =
      item.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.threatType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.deviceOrigin.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesVector = vectorFilter === 'ALL' || item.vector === vectorFilter;
    const matchesSeverity = severityFilter === 'ALL' || item.severity === severityFilter;

    return matchesSearch && matchesVector && matchesSeverity;
  });

  const criticalCount = threats.filter((t) => t.severity === 'CRITICAL').length;
  const highCount = threats.filter((t) => t.severity === 'HIGH').length;

  return (
    <div className="space-y-6">
      {/* Hero Operational Intelligence Strip */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src="/src/assets/images/cyber_threat_map_1793086110158.jpg"
            alt="Cyber Threat Intelligence Map"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>ZERO-TRUST INTELLIGENCE</span>
              <span aria-hidden="true">·</span>
              <span>GLOBAL CLOUD SENSOR MESH</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-mono">Real-Time Sync 12ms</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
              Active Endpoint Threat Defense
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Real-time threat interception neutralizing credential harvesters, trojanized Android APKs, and browser cryptomining across desktop and mobile devices.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenReportModal}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors border border-slate-700 flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <FileText className="w-4 h-4 text-slate-300" />
              <span>Export Forensic Audit</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Strips (Tabular figures) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-slate-400 text-xs">Total Inspects Today</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white mt-1">
            14,820
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">
            99.78% clean traffic
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-slate-400 text-xs">Blocked Cyber Threats</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-red-400 mt-1">
            {threats.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {criticalCount} Critical · {highCount} High
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-slate-400 text-xs">Scan &amp; Filter Latency</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white mt-1">
            14<span className="text-sm font-normal text-slate-400 ml-0.5">ms</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">
            Sub-25ms zero-trust SLA
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-slate-400 text-xs">Synchronized Endpoints</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white mt-1">
            5 / 5
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Mobile &amp; Desktop Fleet
          </div>
        </div>
      </div>

      {/* Main Review Dashboard Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        {/* Filter & Search Bar */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search threat target, vector, or device..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-600"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Vector filter */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setVectorFilter('ALL')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  vectorFilter === 'ALL' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                All Vectors
              </button>
              <button
                onClick={() => setVectorFilter('PHISHING_URL')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  vectorFilter === 'PHISHING_URL' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                Links
              </button>
              <button
                onClick={() => setVectorFilter('MALWARE_APK')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  vectorFilter === 'MALWARE_APK' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                APKs
              </button>
              <button
                onClick={() => setVectorFilter('HARMFUL_TAB')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  vectorFilter === 'HARMFUL_TAB' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                Tabs
              </button>
            </div>

            {/* Severity filter */}
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical Only</option>
              <option value="HIGH">High Only</option>
              <option value="MEDIUM">Medium Only</option>
            </select>
          </div>
        </div>

        {/* Flagged Threat Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Threat Target &amp; Origin</th>
                <th className="py-3 px-4">Attack Vector</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4">Risk Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredThreats.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No flagged threats match your search filter criteria.
                  </td>
                </tr>
              ) : (
                filteredThreats.map((threat) => {
                  return (
                    <tr
                      key={threat.id}
                      className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      onClick={() => setSelectedThreatDetail(threat)}
                    >
                      {/* Target */}
                      <td className="py-3 px-4">
                        <div className="font-mono text-slate-200 font-medium truncate max-w-xs">
                          {threat.target}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {threat.deviceOrigin} · <span className="font-mono">{new Date(threat.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </td>

                      {/* Vector */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          {threat.vector === 'PHISHING_URL' && <Globe className="w-3.5 h-3.5 text-blue-400" />}
                          {threat.vector === 'MALWARE_APK' && <Smartphone className="w-3.5 h-3.5 text-purple-400" />}
                          {threat.vector === 'HARMFUL_TAB' && <Layers className="w-3.5 h-3.5 text-amber-400" />}
                          <span className="font-medium text-slate-300">
                            {threat.vector.replace('_', ' ')}
                          </span>
                        </div>
                      </td>

                      {/* Classification */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-white">{threat.threatType}</div>
                        {threat.mitreTechnique && (
                          <div className="font-mono text-[10px] text-slate-400 mt-0.5">
                            {threat.mitreTechnique.split(' ')[0]}
                          </div>
                        )}
                      </td>

                      {/* Risk Score */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono tabular-nums font-bold ${
                            threat.severity === 'CRITICAL' ? 'text-red-400' : 'text-amber-400'
                          }`}>
                            {threat.score}/100
                          </span>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded uppercase ${
                            threat.severity === 'CRITICAL' ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}>
                            {threat.severity}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span className={`text-[11px] font-mono font-medium ${
                          threat.status === 'BLOCKED' ? 'text-red-400' : threat.status === 'QUARANTINED' ? 'text-purple-400' : 'text-emerald-400'
                        }`}>
                          {threat.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setSelectedThreatDetail(threat)}
                            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                            title="Inspect Forensics"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteThreat(threat.id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-slate-800 transition-colors"
                            title="Dismiss record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Forensic Drawer for Selected Threat */}
      {selectedThreatDetail && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
          <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-950 border border-red-800 flex items-center justify-center text-red-400">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Threat Incident Forensics</h3>
                <p className="text-xs font-mono text-slate-400">{selectedThreatDetail.id}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedThreatDetail(null)}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
            {/* Target info */}
            <div>
              <div className="text-slate-500 uppercase tracking-wider text-[10px]">Target Asset</div>
              <div className="font-mono text-white text-sm mt-0.5 break-all">
                {selectedThreatDetail.target}
              </div>
            </div>

            {/* AI Forensics Note */}
            {selectedThreatDetail.aiForensics && (
              <div className="p-4 bg-slate-950 border border-indigo-900/50 rounded-xl space-y-1">
                <div className="text-indigo-400 font-semibold text-xs">
                  Automated Threat Intelligence Briefing
                </div>
                <p className="text-slate-300 leading-relaxed text-xs">
                  {selectedThreatDetail.aiForensics}
                </p>
              </div>
            )}

            {/* Heuristic Reasons */}
            <div className="space-y-2">
              <div className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                Flagged Heuristic Rules
              </div>
              <div className="space-y-1.5">
                {selectedThreatDetail.reasons.map((r, i) => (
                  <div key={i} className="p-2.5 bg-slate-950 rounded border border-slate-800 text-slate-300 flex items-start gap-2">
                    <span className="text-red-400 font-bold">•</span>
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Metadata */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-500 text-[10px]">Severity</span>
                <div className="font-mono font-bold text-red-400 mt-0.5">{selectedThreatDetail.severity}</div>
              </div>
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-500 text-[10px]">Risk Confidence</span>
                <div className="font-mono font-bold text-white mt-0.5">{selectedThreatDetail.score}%</div>
              </div>
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-500 text-[10px]">Device Source</span>
                <div className="font-mono text-slate-300 mt-0.5">{selectedThreatDetail.deviceOrigin}</div>
              </div>
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-500 text-[10px]">MITRE Technique</span>
                <div className="font-mono text-amber-400 mt-0.5 truncate">{selectedThreatDetail.mitreTechnique || 'N/A'}</div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => onOverrideThreat(selectedThreatDetail.id)}
              className="px-3 py-1.5 text-xs text-amber-400 hover:text-amber-300 bg-amber-950/40 border border-amber-800/60 rounded cursor-pointer transition-colors"
            >
              Admin Override
            </button>
            <button
              onClick={() => setSelectedThreatDetail(null)}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded cursor-pointer"
            >
              Close Drawer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
