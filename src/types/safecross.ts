/**
 * SafeCross - Application Types & Data Models
 * Tagline: Smart Protection. Safer Digital Life.
 */

export type ScanRiskCategory = 'LOW_RISK' | 'SUSPICIOUS' | 'HIGH_RISK' | 'UNKNOWN';
export type ScanTargetType = 'URL' | 'APK';

export interface UrlRiskAssessment {
  url: string;
  normalizedUrl: string;
  domain: string;
  category: ScanRiskCategory;
  score: number; // 0 (safest) to 100 (most dangerous)
  title: string;
  summary: string;
  indicators: string[];
  recommendedAction: string;
  timestamp: string;
  scanDurationMs: number;
  engine: 'Local Pattern Heuristics' | 'Cloud Threat Intel Cache (Simulated)';
  sslStatus: 'Valid Certificate' | 'Self-Signed / Untrusted' | 'Plaintext HTTP (Insecure)' | 'Unverified';
  asnInfo?: string;
}

export interface ApkRiskAssessment {
  fileName: string;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  sha256: string;
  packageName: string;
  versionName: string;
  category: ScanRiskCategory;
  score: number;
  title: string;
  summary: string;
  indicators: string[];
  declaredPermissions: Array<{
    name: string;
    description: string;
    isDangerous: boolean;
  }>;
  recommendedAction: string;
  timestamp: string;
  scanDurationMs: number;
  isSimulatedAnalysis: true;
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  target: string;
  type: ScanTargetType;
  category: ScanRiskCategory;
  score: number;
  summary: string;
  indicators: string[];
  details?: {
    sha256?: string;
    packageName?: string;
    sslStatus?: string;
    engine?: string;
  };
}

export type NotificationSeverity = 'low' | 'warning' | 'high' | 'info';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  severity: NotificationSeverity;
  isRead: boolean;
  category: 'threat' | 'device' | 'system' | 'permission';
  relatedTarget?: string;
  actionLabel?: string;
}

export interface ConnectedDeviceItem {
  id: string;
  name: string;
  platform: 'Android' | 'Windows' | 'macOS' | 'iOS' | 'Linux' | 'Web Browser';
  deviceType: 'mobile' | 'desktop' | 'browser';
  lastSeen: string;
  connectionStatus: 'Connected' | 'Idle' | 'Offline';
  protectionStatus: 'Demo Protection Active' | 'Setup Required' | 'Limited (Browser Only)';
  lastScanTimestamp: string;
  threatsPrevented: number;
  ipAddress?: string;
  agentVersion?: string;
}

export interface SecuritySettings {
  prototypeProtectionEnabled: boolean;
  suspiciousLinkWarning: boolean;
  highRiskBlocking: boolean;
  browserNotificationsEnabled: boolean;
  automaticUrlScanning: boolean;
  scanHistoryRetentionDays: number;
  cloudThreatIntelligenceOptIn: boolean;
  anonymizeTelemetry: boolean;
  theme: 'dark' | 'light';
  // Hardware/OS Permissions (Honest Prototype Status)
  androidAccessibilityPermission: 'NOT_CONFIGURED';
  vpnDeviceFilterPermission: 'NOT_CONFIGURED';
  systemNotificationPermission: 'GRANTED' | 'DEFAULT' | 'DENIED';
}

export type NavigationSection =
  | 'home'
  | 'scan-url'
  | 'apk-analyzer'
  | 'history'
  | 'notifications'
  | 'devices'
  | 'settings'
  | 'reports'
  | 'help'
  | 'safe-browsing'
  | 'admin';
