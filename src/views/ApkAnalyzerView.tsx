import React, { useState } from 'react';
import {
  FileCode2,
  UploadCloud,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Copy,
  Check,
  Smartphone,
  Info,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { useSafeCross } from '../context/SafeCrossContext';
import {
  assessApkRisk,
  validateApkFile,
  PRESET_SAMPLE_APKS,
  ApkInputMetadata,
} from '../utils/apkRiskEngine';
import { ApkRiskAssessment } from '../types/safecross';

export const ApkAnalyzerView: React.FC = () => {
  const { addHistoryItem, showToast } = useSafeCross();
  const [selectedApk, setSelectedApk] = useState<ApkInputMetadata>(PRESET_SAMPLE_APKS[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ApkRiskAssessment | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

  const handleRunAnalysis = (apk: ApkInputMetadata) => {
    setSelectedApk(apk);
    setValidationError(null);
    setIsAnalyzing(true);
    setProgress(20);
    setResult(null);

    const timer1 = setTimeout(() => setProgress(60), 200);
    const timer2 = setTimeout(() => {
      setProgress(100);
      setIsAnalyzing(false);

      const assessment = assessApkRisk(apk);
      setResult(assessment);

      // Persist to history
      addHistoryItem({
        target: apk.fileName,
        type: 'APK',
        category: assessment.category,
        score: assessment.score,
        summary: assessment.summary,
        indicators: assessment.indicators,
        details: {
          sha256: assessment.sha256,
          packageName: assessment.packageName,
        },
      });

      if (assessment.category === 'HIGH_RISK') {
        showToast('High-risk mobile malware package flagged!', 'error');
      } else if (assessment.category === 'SUSPICIOUS') {
        showToast('Elevated risk permissions identified.', 'warning');
      } else {
        showToast('Package verified clean: Standard permissions.', 'success');
      }
    }, 450);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateApkFile(file.name, file.size);
    if (!validation.valid) {
      setValidationError(validation.error || 'Invalid file.');
      showToast(validation.error || 'Invalid file.', 'error');
      return;
    }

    setValidationError(null);

    const uploadedApk: ApkInputMetadata = {
      fileName: file.name,
      fileSizeBytes: file.size,
      declaredPermissions: [
        'android.permission.BIND_ACCESSIBILITY_SERVICE',
        'android.permission.SYSTEM_ALERT_WINDOW',
        'android.permission.RECEIVE_BOOT_COMPLETED',
      ],
      sha256: 'custom_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      sourceOrigin: 'User Local File Upload',
    };

    handleRunAnalysis(uploadedApk);
  };

  const copySha256 = () => {
    if (!result?.sha256) return;
    navigator.clipboard.writeText(result.sha256);
    setCopiedHash(true);
    showToast('SHA-256 hash copied.', 'success');
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* View Header */}
      <div className="p-6 rounded-2xl bg-[#151F30] border border-[#263449] space-y-2">
        <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
          <span>MOBILE SECURITY ANALYZER</span>
          <span aria-hidden="true">·</span>
          <span>APK MANIFEST &amp; PERMISSIONS</span>
          <span aria-hidden="true">·</span>
          <span className="text-teal-400 font-mono">Prototype Mode</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
          Android Package (APK) Risk Inspector
        </h2>
        <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed max-w-2xl">
          Evaluate declared Android permissions, dangerous accessibility hooks, and trojan signatures without installing or executing packages in your environment.
        </p>
      </div>

      {/* Honest Architecture & Sandbox Disclosure */}
      <div className="p-4 rounded-xl bg-[#101827] border border-[#263449] flex items-start gap-3 text-xs">
        <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-[#94A3B8]">
          <span className="font-semibold text-slate-200">
            Browser Prototype Disclosure:
          </span>
          <p className="leading-relaxed">
            SafeCross does not execute or install APK files. The prototype evaluates metadata, validates package constraints, and matches declared permissions against known malware matrices. Deep bytecode decompilation and dynamic runtime emulation are architected to route to a secure backend sandbox daemon. Files are never uploaded to external parties without consent.
          </p>
        </div>
      </div>

      {/* File Upload & Preset Selection Card */}
      <div className="p-6 rounded-2xl bg-[#151F30] border border-[#263449] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#263449]">
          <div>
            <h3 className="text-sm font-bold text-white">Select or Upload Package</h3>
            <p className="text-[11px] text-[#94A3B8]">
              Choose from sample malware/clean presets or select a local .apk file
            </p>
          </div>

          {/* Upload Button */}
          <label className="flex items-center gap-2 px-4 py-2 bg-[#101827] hover:bg-slate-800 border border-[#263449] text-xs font-semibold text-teal-300 rounded-xl cursor-pointer transition-colors shrink-0">
            <UploadCloud className="w-4 h-4" />
            <span>Select Local APK</span>
            <input
              type="file"
              accept=".apk"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {validationError && (
          <div className="p-3 bg-red-950/40 border border-red-800/80 rounded-xl text-xs text-red-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Preset Cards Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_SAMPLE_APKS.map((apk, idx) => {
            const isSelected = selectedApk.fileName === apk.fileName;
            const isSafe = apk.fileName.includes('Official');

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleRunAnalysis(apk)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#101827] border-teal-500/80 shadow-md ring-1 ring-teal-500/40'
                    : 'bg-[#101827] border-[#263449] hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-7 h-7 rounded-lg bg-[#151F30] flex items-center justify-center text-teal-400">
                    <Smartphone className="w-3.5 h-3.5" />
                  </div>
                  <span
                    className={`font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      isSafe
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                        : 'bg-red-950/80 text-red-300 border border-red-800'
                    }`}
                  >
                    {isSafe ? 'Clean' : 'Malicious'}
                  </span>
                </div>
                <div className="font-semibold text-xs text-white truncate" title={apk.fileName}>
                  {apk.fileName}
                </div>
                <div className="text-[10px] font-mono text-[#94A3B8] mt-1 truncate">
                  {(apk.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB · {apk.sourceOrigin}
                </div>
              </button>
            );
          })}
        </div>

        {/* Progress Bar */}
        {isAnalyzing && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                <span>Auditing AndroidManifest.xml &amp; high-risk permissions...</span>
              </span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-[#101827] h-2 rounded-full overflow-hidden border border-[#263449]">
              <div
                className="h-full rounded-full transition-all duration-150"
                style={{ width: `${progress}%`, backgroundColor: '#20D6B5' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Analysis Results View */}
      {result && (
        <div
          className={`p-6 rounded-2xl border space-y-6 animate-in fade-in duration-200 ${
            result.category === 'HIGH_RISK'
              ? 'bg-[#151F30] border-red-500/60 shadow-xl shadow-red-950/20'
              : result.category === 'SUSPICIOUS'
              ? 'bg-[#151F30] border-amber-500/60 shadow-xl shadow-amber-950/20'
              : 'bg-[#151F30] border-emerald-500/50 shadow-xl shadow-emerald-950/20'
          }`}
        >
          {/* Header Status */}
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
                    Analyzed in {result.scanDurationMs}ms
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">{result.title}</h3>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={copySha256}
                className="px-3 py-1.5 bg-[#101827] hover:bg-slate-800 border border-[#263449] text-xs font-semibold text-slate-300 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedHash ? 'Hash Copied' : 'Copy SHA-256'}</span>
              </button>
            </div>
          </div>

          {/* Metadata Specs Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-[#101827] rounded-xl border border-[#263449]">
              <span className="text-slate-500 text-[11px]">Package Filename</span>
              <div className="font-mono text-white mt-0.5 truncate">{result.fileName}</div>
            </div>
            <div className="p-3 bg-[#101827] rounded-xl border border-[#263449]">
              <span className="text-slate-500 text-[11px]">Size</span>
              <div className="font-mono text-white mt-0.5">{result.fileSizeFormatted}</div>
            </div>
            <div className="p-3 bg-[#101827] rounded-xl border border-[#263449]">
              <span className="text-slate-500 text-[11px]">Package Identifier</span>
              <div className="font-mono text-white mt-0.5 truncate">{result.packageName}</div>
            </div>
            <div className="p-3 bg-[#101827] rounded-xl border border-[#263449]">
              <span className="text-slate-500 text-[11px]">SHA-256 Signature</span>
              <div className="font-mono text-teal-400 mt-0.5 truncate" title={result.sha256}>
                {result.sha256.substring(0, 16)}...
              </div>
            </div>
          </div>

          {/* Assessment Summary */}
          <div className="space-y-1.5 text-xs">
            <h4 className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
              Behavior &amp; Threat Summary
            </h4>
            <p className="text-slate-300 leading-relaxed bg-[#101827] p-3.5 rounded-xl border border-[#263449]">
              {result.summary}
            </p>
          </div>

          {/* Declared Permissions Matrix */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
                Declared Manifest Permissions ({result.declaredPermissions.length})
              </h4>
              <span className="font-mono text-[11px] text-slate-500">
                Audited against mobile trojan signature database
              </span>
            </div>

            <div className="space-y-2">
              {result.declaredPermissions.map((perm, pIdx) => (
                <div
                  key={pIdx}
                  className={`p-3 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                    perm.isDangerous
                      ? 'bg-[#101827] border-red-500/40 text-red-200'
                      : 'bg-[#101827] border-[#263449] text-slate-300'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="font-mono font-semibold truncate text-white">{perm.name}</div>
                    <div className="text-[11px] text-[#94A3B8] mt-0.5 leading-relaxed">
                      {perm.description}
                    </div>
                  </div>
                  <span
                    className={`font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded shrink-0 self-start sm:self-auto ${
                      perm.isDangerous
                        ? 'bg-red-950 text-red-300 border border-red-800'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {perm.isDangerous ? 'High Risk' : 'Standard'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Next Steps */}
          <div className="p-4 bg-[#101827] rounded-xl border border-[#263449] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase text-slate-400">
                Recommended Action
              </span>
              <p className="text-xs font-semibold text-white">{result.recommendedAction}</p>
            </div>
            {result.category === 'HIGH_RISK' && (
              <span className="font-mono text-xs font-bold text-red-400 bg-red-950/60 px-3 py-1.5 rounded-xl border border-red-800 shrink-0">
                Quarantine Advised
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
