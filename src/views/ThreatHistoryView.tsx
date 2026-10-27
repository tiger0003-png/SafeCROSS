import React, { useState } from 'react';
import {
  Clock,
  Search,
  Filter,
  Trash2,
  Download,
  Globe,
  FileCode2,
  ChevronRight,
  X,
  Copy,
  Check,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { useSafeCross } from '../context/SafeCrossContext';
import { HistoryItem, ScanRiskCategory, ScanTargetType } from '../types/safecross';
import { ConfirmationDialog } from '../components/ConfirmationDialog';

export const ThreatHistoryView: React.FC = () => {
  const { history, deleteHistoryItem, clearHistory, exportCsv, showToast } = useSafeCross();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'ALL' | ScanTargetType>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | ScanRiskCategory>('ALL');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [inspectItem, setInspectItem] = useState<HistoryItem | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [copiedDetail, setCopiedDetail] = useState(false);

  // Filtering
  const filteredHistory = history
    .filter((item) => {
      const matchesSearch =
        item.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'ALL' || item.type === selectedType;
      const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
      return matchesSearch && matchesType && matchesCategory;
    })
    .sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });

  const handleCopyDetail = (item: HistoryItem) => {
    const text = `[SAFECROSS AUDIT ENTRY - ${item.id}]
Target: ${item.target}
Type: ${item.type}
Risk Category: ${item.category}
Score: ${item.score}/100
Timestamp: ${item.timestamp}
Summary: ${item.summary}
Indicators: ${item.indicators.join('; ')}`;

    navigator.clipboard.writeText(text);
    setCopiedDetail(true);
    showToast('Entry details copied.', 'success');
    setTimeout(() => setCopiedDetail(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#151F30] border border-[#263449] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
            <span>AUDIT &amp; FORENSICS</span>
            <span aria-hidden="true">·</span>
            <span>PERSISTENT SCAN LOGS</span>
            <span aria-hidden="true">·</span>
            <span className="text-teal-400 font-mono">{history.length} Total Records</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight mt-1">
            Threat &amp; Scan History
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] max-w-xl">
            Review previous URL verifications and APK analyses. History is stored locally in your browser storage with exportable forensic CSV reports.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={exportCsv}
            className="px-3.5 py-2 bg-[#101827] hover:bg-slate-800 border border-[#263449] text-xs font-semibold text-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4 text-teal-400" />
            <span>Export CSV</span>
          </button>
          {history.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-3 py-2 bg-red-950/40 hover:bg-red-900/40 border border-red-800 text-xs font-semibold text-red-300 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 bg-[#151F30] border border-[#263449] rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-md">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search target, domain, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#101827] border border-[#263449] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 font-mono"
          />
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Type filter */}
          <div className="flex items-center bg-[#101827] p-1 rounded-xl border border-[#263449] text-xs">
            <button
              onClick={() => setSelectedType('ALL')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedType === 'ALL' ? 'bg-[#151F30] text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setSelectedType('URL')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedType === 'URL' ? 'bg-[#151F30] text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              URLs
            </button>
            <button
              onClick={() => setSelectedType('APK')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedType === 'APK' ? 'bg-[#151F30] text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              APKs
            </button>
          </div>

          {/* Category filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="bg-[#101827] border border-[#263449] text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="HIGH_RISK">High Risk Only</option>
            <option value="SUSPICIOUS">Suspicious Only</option>
            <option value="LOW_RISK">Low Risk Only</option>
          </select>

          {/* Sort order */}
          <button
            onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
            className="px-3 py-2 bg-[#101827] border border-[#263449] hover:bg-slate-800 text-xs font-mono text-slate-300 rounded-xl transition-colors cursor-pointer"
          >
            {sortOrder === 'newest' ? '↓ Newest' : '↑ Oldest'}
          </button>
        </div>
      </div>

      {/* History Table List */}
      <div className="bg-[#151F30] border border-[#263449] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#101827] text-[#94A3B8] uppercase font-mono text-[10px] tracking-wider border-b border-[#263449]">
              <tr>
                <th className="py-3.5 px-4">Scan ID &amp; Target</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Risk Evaluation</th>
                <th className="py-3.5 px-4">Summary</th>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#263449]/60">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500">
                    No scan history records match your search or filter options.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item) => {
                  const isHigh = item.category === 'HIGH_RISK';
                  const isSuspicious = item.category === 'SUSPICIOUS';

                  return (
                    <tr
                      key={item.id}
                      onClick={() => setInspectItem(item)}
                      className="hover:bg-[#101827]/60 transition-colors cursor-pointer group"
                    >
                      {/* Target */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-teal-400 bg-teal-950/40 px-1.5 py-0.5 rounded border border-teal-800/40">
                            {item.id}
                          </span>
                          <span className="font-mono font-semibold text-white truncate max-w-xs sm:max-w-sm">
                            {item.target}
                          </span>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-medium text-slate-300">
                          {item.type === 'URL' ? (
                            <Globe className="w-3.5 h-3.5 text-blue-400" />
                          ) : (
                            <FileCode2 className="w-3.5 h-3.5 text-purple-400" />
                          )}
                          <span>{item.type}</span>
                        </div>
                      </td>

                      {/* Risk Category & Score */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                              isHigh
                                ? 'bg-red-500/10 text-red-400 border-red-500/30'
                                : isSuspicious
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            }`}
                          >
                            {item.category.replace('_', ' ')}
                          </span>
                          <span className="font-mono tabular-nums text-slate-300">
                            {item.score}/100
                          </span>
                        </div>
                      </td>

                      {/* Summary */}
                      <td className="py-3.5 px-4 text-[#94A3B8] max-w-xs truncate">
                        {item.summary}
                      </td>

                      {/* Timestamp */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setInspectItem(item)}
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#101827] transition-colors"
                            title="Inspect Details"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteHistoryItem(item.id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-[#101827] transition-colors"
                            title="Delete entry"
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

      {/* Inspect Item Modal Drawer */}
      {inspectItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl bg-[#151F30] border border-[#263449] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 bg-[#101827] border-b border-[#263449] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold font-mono text-xs">
                  {inspectItem.id}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Forensic Audit Record</h3>
                  <div className="text-[11px] text-[#94A3B8] font-mono">
                    {new Date(inspectItem.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setInspectItem(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#151F30]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              {/* Target info */}
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-500">
                  Target Asset
                </span>
                <div className="font-mono text-white text-sm mt-0.5 break-all bg-[#101827] p-3 rounded-xl border border-[#263449]">
                  {inspectItem.target}
                </div>
              </div>

              {/* Status and Score */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#101827] rounded-xl border border-[#263449]">
                  <span className="text-slate-500 text-[10px]">Risk Category</span>
                  <div className="font-bold text-white mt-1">{inspectItem.category}</div>
                </div>
                <div className="p-3 bg-[#101827] rounded-xl border border-[#263449]">
                  <span className="text-slate-500 text-[10px]">Heuristic Score</span>
                  <div className="font-bold font-mono text-teal-400 mt-1">
                    {inspectItem.score}/100
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-500">
                  Assessment Summary
                </span>
                <p className="p-3.5 bg-[#101827] rounded-xl border border-[#263449] text-slate-300 leading-relaxed mt-1">
                  {inspectItem.summary}
                </p>
              </div>

              {/* Indicators */}
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-500">
                  Detected Indicators ({inspectItem.indicators.length})
                </span>
                <div className="space-y-1.5 mt-1.5">
                  {inspectItem.indicators.map((ind, i) => (
                    <div
                      key={i}
                      className="p-2.5 bg-[#101827] rounded-xl border border-[#263449] text-slate-300 flex items-start gap-2"
                    >
                      <span className="text-teal-400 font-bold">•</span>
                      <span>{ind}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Details */}
              {inspectItem.details && (
                <div className="p-3 bg-[#101827] rounded-xl border border-[#263449] font-mono text-[11px] text-slate-400 space-y-1">
                  {inspectItem.details.sha256 && (
                    <div className="break-all">
                      <strong className="text-slate-300">SHA-256:</strong> {inspectItem.details.sha256}
                    </div>
                  )}
                  {inspectItem.details.engine && (
                    <div>
                      <strong className="text-slate-300">Engine:</strong> {inspectItem.details.engine}
                    </div>
                  )}
                  {inspectItem.details.sslStatus && (
                    <div>
                      <strong className="text-slate-300">SSL:</strong> {inspectItem.details.sslStatus}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 bg-[#101827] border-t border-[#263449] flex items-center justify-between">
              <button
                onClick={() => handleCopyDetail(inspectItem)}
                className="px-3.5 py-1.5 bg-[#151F30] hover:bg-slate-800 border border-[#263449] text-xs font-semibold text-slate-300 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copiedDetail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedDetail ? 'Copied' : 'Copy Entry'}</span>
              </button>
              <button
                onClick={() => setInspectItem(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Clearing History */}
      <ConfirmationDialog
        isOpen={showClearConfirm}
        title="Clear All Scan History?"
        message="This action will delete all recorded scan logs from your local browser storage. This cannot be undone."
        confirmLabel="Yes, Clear History"
        cancelLabel="Cancel"
        isDangerous={true}
        onConfirm={() => {
          clearHistory();
          setShowClearConfirm(false);
        }}
        onCancel={() => setShowClearConfirm(false)}
      />
    </div>
  );
};
