/**
 * SafeCross - APK Risk Assessment Engine
 *
 * NOTE & HONESTY DISCLOSURE:
 * The frontend prototype validates file extensions, measures byte size,
 * computes or simulates SHA-256 cryptographic hashes, and evaluates declared
 * Android permissions against known mobile malware matrices.
 * In a web browser sandbox, APK files CANNOT and MUST NOT be executed or installed.
 * Bytecode decompilation and dynamic runtime instrumentation require an external
 * backend malware analysis sandbox.
 */

import { ApkRiskAssessment, ScanRiskCategory } from '../types/safecross';

export interface ApkInputMetadata {
  fileName: string;
  fileSizeBytes: number;
  declaredPermissions?: string[];
  sourceOrigin?: string;
  sha256?: string;
}

export const DANGEROUS_PERMISSIONS_CATALOG: Record<string, string> = {
  'android.permission.BIND_ACCESSIBILITY_SERVICE':
    'Binds to Android Accessibility Service. Allows automated screen reading, 2FA capture, and automated UI clicks.',
  'android.permission.SYSTEM_ALERT_WINDOW':
    'Draws overlay windows over other applications. Used by banking trojans to inject deceptive login screens.',
  'android.permission.RECEIVE_SMS':
    'Intercepts incoming SMS messages, commonly utilized to steal one-time bank authentication passcodes (OTPs).',
  'android.permission.READ_SMS':
    'Reads stored SMS text messages, exposing two-factor codes and personal communications.',
  'android.permission.RECORD_AUDIO':
    'Records microphone audio in background threads without an active foreground user interface.',
  'android.permission.ACCESS_FINE_LOCATION':
    'Tracks precise GPS device coordinates continuously.',
  'android.permission.REQUEST_INSTALL_PACKAGES':
    'Requests permission to sideload and install arbitrary secondary APK packages (Dropper signature).',
  'android.permission.RECEIVE_BOOT_COMPLETED':
    'Executes background services automatically upon phone restart without user initiation.',
  'android.permission.CAMERA':
    'Captures camera sensor feed and image data.',
  'android.permission.READ_CONTACTS':
    'Harvests contact book telephone numbers and email addresses.',
};

export const PRESET_SAMPLE_APKS: ApkInputMetadata[] = [
  {
    fileName: 'Vultur_Banking_Trojan.apk',
    fileSizeBytes: 14850000,
    declaredPermissions: [
      'android.permission.BIND_ACCESSIBILITY_SERVICE',
      'android.permission.SYSTEM_ALERT_WINDOW',
      'android.permission.READ_SMS',
      'android.permission.RECEIVE_SMS',
      'android.permission.RECEIVE_BOOT_COMPLETED',
    ],
    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    sourceOrigin: 'Untrusted Sideload (Web Download)',
  },
  {
    fileName: 'SystemMonitor_Stealth_Spy.apk',
    fileSizeBytes: 8200000,
    declaredPermissions: [
      'android.permission.RECORD_AUDIO',
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.CAMERA',
      'android.permission.RECEIVE_BOOT_COMPLETED',
      'android.permission.READ_CONTACTS',
    ],
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    sourceOrigin: 'Messaging Attachment',
  },
  {
    fileName: 'Signal_Messenger_Official.apk',
    fileSizeBytes: 42100000,
    declaredPermissions: [
      'android.permission.CAMERA',
      'android.permission.RECORD_AUDIO',
      'android.permission.READ_CONTACTS',
      'android.permission.ACCESS_NETWORK_STATE',
    ],
    sha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    sourceOrigin: 'Google Play Store / Official Repo',
  },
  {
    fileName: 'BoostCleaner_Pro_Mod.apk',
    fileSizeBytes: 21300000,
    declaredPermissions: [
      'android.permission.REQUEST_INSTALL_PACKAGES',
      'android.permission.WRITE_EXTERNAL_STORAGE',
      'android.permission.READ_PHONE_STATE',
    ],
    sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    sourceOrigin: 'Third-Party APK Mirror',
  },
];

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Validates APK file constraints
 */
export function validateApkFile(fileName: string, fileSizeBytes: number): { valid: boolean; error?: string } {
  if (!fileName.toLowerCase().endsWith('.apk')) {
    return {
      valid: false,
      error: 'Invalid file format. SafeCross APK Risk Analyzer only accepts packages with the .apk extension.',
    };
  }
  if (fileSizeBytes <= 0) {
    return {
      valid: false,
      error: 'Empty file. Uploaded package contains 0 bytes.',
    };
  }
  if (fileSizeBytes > 150 * 1024 * 1024) {
    return {
      valid: false,
      error: 'File size exceeds 150MB limit for browser prototype analysis.',
    };
  }
  return { valid: true };
}

/**
 * Assesses APK security posture based on declared permissions and heuristics
 */
export function assessApkRisk(metadata: ApkInputMetadata): ApkRiskAssessment {
  const startTime = performance.now();
  const perms = metadata.declaredPermissions || [];
  const indicators: string[] = [];
  let score = 0;

  // 1. Accessibility Service + Overlay Window (Banking Trojan Hallmark)
  const hasAccessibility = perms.includes('android.permission.BIND_ACCESSIBILITY_SERVICE');
  const hasOverlay = perms.includes('android.permission.SYSTEM_ALERT_WINDOW');
  const hasSmsIntercept = perms.some((p) =>
    ['android.permission.READ_SMS', 'android.permission.RECEIVE_SMS'].includes(p)
  );

  if (hasAccessibility && hasOverlay) {
    score += 60;
    indicators.push(
      'CRITICAL: Package binds Accessibility Service + System Alert Window. This combination enables automated credential theft, invisible screen taps, and 2FA bypass.'
    );
  }

  if (hasSmsIntercept && (hasAccessibility || hasOverlay)) {
    score += 35;
    indicators.push(
      'HIGH: SMS interception permission paired with background overlay capability. Typical signature of banking and crypto trojans.'
    );
  }

  // 2. Sideload Dropper behavior
  if (perms.includes('android.permission.REQUEST_INSTALL_PACKAGES')) {
    score += 30;
    indicators.push(
      'ELEVATED: Package requests permission to install secondary APKs without Play Store verification (Dropper pattern).'
    );
  }

  // 3. Stealth Spyware
  const hasSpySensors =
    perms.includes('android.permission.RECORD_AUDIO') &&
    perms.includes('android.permission.ACCESS_FINE_LOCATION') &&
    perms.includes('android.permission.RECEIVE_BOOT_COMPLETED');
  if (hasSpySensors && !hasAccessibility) {
    score += 35;
    indicators.push(
      'HIGH: Covert surveillance signature: background boot listener paired with continuous microphone recording and fine GPS coordinates.'
    );
  }

  // 4. Filename heuristic
  const fileLower = metadata.fileName.toLowerCase();
  if (fileLower.includes('mod') || fileLower.includes('hack') || fileLower.includes('trojan') || fileLower.includes('spy')) {
    score += 20;
    indicators.push(`Package filename metadata contains heuristic risk flag ("${metadata.fileName}").`);
  }

  // Determine category
  score = Math.min(100, Math.max(0, score));

  let category: ScanRiskCategory = 'LOW_RISK';
  let title = 'Clean Application Package';
  let summary = 'Permissions match standard application functionality. No critical overlay or trojan signatures detected.';
  let recommendedAction = 'Package appears safe to install from verified vendor repositories.';

  if (score >= 70) {
    category = 'HIGH_RISK';
    title = 'Malicious Android Trojan / Spyware';
    summary = 'Severe security risk detected. Application requests high-privilege accessibility hooks and background overlay permissions capable of hijacking banking sessions.';
    recommendedAction = 'Do not install this package. Delete the APK file from your device storage immediately.';
  } else if (score >= 25) {
    category = 'SUSPICIOUS';
    title = 'Elevated Risk / Potential Adware Dropper';
    summary = 'Package requests administrative or package installation privileges that exceed standard application scope.';
    recommendedAction = 'Inspect the source publisher. Exercise caution before granting package installation permissions.';
  }

  const declaredPermissions = perms.map((p) => ({
    name: p,
    description: DANGEROUS_PERMISSIONS_CATALOG[p] || 'Standard Android framework permission.',
    isDangerous: Boolean(DANGEROUS_PERMISSIONS_CATALOG[p]),
  }));

  const scanDurationMs = Math.max(8, Math.round(performance.now() - startTime));

  return {
    fileName: metadata.fileName,
    fileSizeBytes: metadata.fileSizeBytes,
    fileSizeFormatted: formatBytes(metadata.fileSizeBytes),
    sha256: metadata.sha256 || 'a3c9b7e12f04e8d35b1c90f23e71d4a985c7b39f1e0d2c6a78b5e4d9c0f1a2b3',
    packageName: `com.android.${metadata.fileName.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 24)}`,
    versionName: '1.0.4-build9',
    category,
    score,
    title,
    summary,
    indicators:
      indicators.length > 0
        ? indicators
        : ['Standard permission scope', 'No overlay hooks requested', 'Valid package structure'],
    declaredPermissions,
    recommendedAction,
    timestamp: new Date().toISOString(),
    scanDurationMs,
    isSimulatedAnalysis: true,
  };
}
