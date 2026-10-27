import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  HistoryItem,
  NotificationItem,
  ConnectedDeviceItem,
  SecuritySettings,
  NavigationSection,
  ScanRiskCategory,
} from '../types/safecross';
import { DEFAULT_DEMO_BLOCKLIST } from '../utils/urlRiskEngine';

interface SafeCrossContextType {
  activeSection: NavigationSection;
  setActiveSection: (section: NavigationSection) => void;
  // History
  history: HistoryItem[];
  addHistoryItem: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  deleteHistoryItem: (id: string) => void;
  clearHistory: () => void;
  exportCsv: () => void;
  // Notifications
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  addNotification: (item: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>) => void;
  // Devices
  devices: ConnectedDeviceItem[];
  addDevice: (device: Omit<ConnectedDeviceItem, 'id' | 'lastSeen' | 'threatsPrevented'>) => void;
  removeDevice: (id: string) => void;
  syncDevice: (id: string) => void;
  // Settings & Theme
  settings: SecuritySettings;
  updateSettings: (newSettings: Partial<SecuritySettings>) => void;
  toggleTheme: () => void;
  // Blocklist
  blockedUrls: string[];
  addBlockedUrl: (domain: string) => void;
  removeBlockedUrl: (domain: string) => void;
  // Toast
  toast: { message: string; type: 'success' | 'warning' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  // Admin role simulation
  isAdminMode: boolean;
  setIsAdminMode: (val: boolean) => void;
}

const DEFAULT_SETTINGS: SecuritySettings = {
  prototypeProtectionEnabled: true,
  suspiciousLinkWarning: true,
  highRiskBlocking: true,
  browserNotificationsEnabled: false,
  automaticUrlScanning: true,
  scanHistoryRetentionDays: 30,
  cloudThreatIntelligenceOptIn: true,
  anonymizeTelemetry: true,
  theme: 'dark',
  androidAccessibilityPermission: 'NOT_CONFIGURED',
  vpnDeviceFilterPermission: 'NOT_CONFIGURED',
  systemNotificationPermission: 'DEFAULT',
};

const SEED_HISTORY: HistoryItem[] = [
  {
    id: 'SC-9101',
    timestamp: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
    target: 'https://paypa1-security-verification.com/login',
    type: 'URL',
    category: 'HIGH_RISK',
    score: 95,
    summary: 'Homoglyph domain mimicking PayPal credential recovery.',
    indicators: [
      'Typosquatting homoglyph "paypa1" detected.',
      'Active demonstration blocklist match.',
      'Mismatched TLS certificate payload.',
    ],
    details: {
      engine: 'Cloud Threat Intel Cache (Simulated)',
      sslStatus: 'Self-Signed / Untrusted',
    },
  },
  {
    id: 'SC-9102',
    timestamp: new Date(Date.now() - 1000 * 60 * 48).toISOString(),
    target: 'Vultur_Banking_Trojan.apk',
    type: 'APK',
    category: 'HIGH_RISK',
    score: 92,
    summary: 'Malicious banking trojan requesting Accessibility Service and background overlay.',
    indicators: [
      'Requests BIND_ACCESSIBILITY_SERVICE.',
      'Requests SYSTEM_ALERT_WINDOW.',
      'Requests SMS interception privileges.',
    ],
    details: {
      sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      packageName: 'com.android.system.service.update',
    },
  },
  {
    id: 'SC-9103',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    target: 'https://github.com/developer/project',
    type: 'URL',
    category: 'LOW_RISK',
    score: 0,
    summary: 'Clean verified developer repository destination.',
    indicators: ['Authentic TLS 1.3 certificate', 'Zero brand anomalies', 'Established domain age'],
    details: {
      engine: 'Local Pattern Heuristics',
      sslStatus: 'Valid Certificate',
    },
  },
  {
    id: 'SC-9104',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    target: 'https://chase-online-login-update.xyz',
    type: 'URL',
    category: 'HIGH_RISK',
    score: 88,
    summary: 'Deceptive banking verification subdomain hosted on high-abuse TLD (.xyz).',
    indicators: ['High-risk TLD .xyz', 'Sensitive brand token "chase" paired with "login"', 'Blocklisted demo link'],
    details: {
      engine: 'Cloud Threat Intel Cache (Simulated)',
      sslStatus: 'Self-Signed / Untrusted',
    },
  },
  {
    id: 'SC-9105',
    timestamp: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    target: 'Signal_Messenger_Official.apk',
    type: 'APK',
    category: 'LOW_RISK',
    score: 0,
    summary: 'Official encrypted messaging application package with standard permissions.',
    indicators: ['Valid framework permissions', 'No overlay or accessibility hooks', 'Official Play Store source'],
    details: {
      sha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      packageName: 'org.thoughtcrime.securesms',
    },
  },
];

const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'High-Risk URL Blocked',
    description: 'SafeCross intercepted access to "paypa1-security-verification.com" in prototype demo mode.',
    timestamp: '14m ago',
    severity: 'high',
    isRead: false,
    category: 'threat',
    relatedTarget: 'https://paypa1-security-verification.com/login',
    actionLabel: 'View in History',
  },
  {
    id: 'notif-2',
    title: 'Trojanized APK Identified',
    description: 'File "Vultur_Banking_Trojan.apk" was analyzed and flagged for dangerous accessibility service abuse.',
    timestamp: '48m ago',
    severity: 'high',
    isRead: false,
    category: 'threat',
    relatedTarget: 'Vultur_Banking_Trojan.apk',
    actionLabel: 'Review Findings',
  },
  {
    id: 'notif-3',
    title: 'System Protection Notice',
    description: 'Note: Web browser prototype cannot enable native Android Accessibility or VPN permissions. Native agent setup required for system-wide interception.',
    timestamp: '2h ago',
    severity: 'warning',
    isRead: false,
    category: 'permission',
    actionLabel: 'Open Setup Guide',
  },
  {
    id: 'notif-4',
    title: 'New Demo Device Connected',
    description: 'Windows 11 Workstation synchronized with SafeCross central policy engine.',
    timestamp: '5h ago',
    severity: 'info',
    isRead: true,
    category: 'device',
  },
];

const SEED_DEVICES: ConnectedDeviceItem[] = [
  {
    id: 'dev-1',
    name: 'Google Pixel 9 Pro',
    platform: 'Android',
    deviceType: 'mobile',
    lastSeen: 'Active now',
    connectionStatus: 'Connected',
    protectionStatus: 'Demo Protection Active',
    lastScanTimestamp: '14m ago',
    threatsPrevented: 14,
    ipAddress: '10.0.5.88',
    agentVersion: 'v2.4.0 (Demo Agent)',
  },
  {
    id: 'dev-2',
    name: 'Workstation Elite Tower',
    platform: 'Windows',
    deviceType: 'desktop',
    lastSeen: 'Active now',
    connectionStatus: 'Connected',
    protectionStatus: 'Demo Protection Active',
    lastScanTimestamp: '28m ago',
    threatsPrevented: 29,
    ipAddress: '10.0.4.12',
    agentVersion: 'v2.4.0 (Demo Daemon)',
  },
  {
    id: 'dev-3',
    name: 'MacBook Air - Safari',
    platform: 'macOS',
    deviceType: 'browser',
    lastSeen: '12m ago',
    connectionStatus: 'Connected',
    protectionStatus: 'Limited (Browser Only)',
    lastScanTimestamp: '1h ago',
    threatsPrevented: 6,
    ipAddress: '10.0.4.45',
    agentVersion: 'Web Prototype Extension v0.9',
  },
];

const SafeCrossContext = createContext<SafeCrossContextType | undefined>(undefined);

export const SafeCrossProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSection, setActiveSection] = useState<NavigationSection>('home');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'warning' | 'error' | 'info' } | null>(null);

  // Load from localStorage or use seeds
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem('safecross_history');
      return stored ? JSON.parse(stored) : SEED_HISTORY;
    } catch {
      return SEED_HISTORY;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const stored = localStorage.getItem('safecross_notifications');
      return stored ? JSON.parse(stored) : SEED_NOTIFICATIONS;
    } catch {
      return SEED_NOTIFICATIONS;
    }
  });

  const [devices, setDevices] = useState<ConnectedDeviceItem[]>(() => {
    try {
      const stored = localStorage.getItem('safecross_devices');
      return stored ? JSON.parse(stored) : SEED_DEVICES;
    } catch {
      return SEED_DEVICES;
    }
  });

  const [settings, setSettings] = useState<SecuritySettings>(() => {
    try {
      const stored = localStorage.getItem('safecross_settings');
      return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [blockedUrls, setBlockedUrls] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('safecross_blocklist');
      return stored ? JSON.parse(stored) : DEFAULT_DEMO_BLOCKLIST;
    } catch {
      return DEFAULT_DEMO_BLOCKLIST;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('safecross_history', JSON.stringify(history));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem('safecross_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem('safecross_devices', JSON.stringify(devices));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  }, [devices]);

  useEffect(() => {
    try {
      localStorage.setItem('safecross_settings', JSON.stringify(settings));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('safecross_blocklist', JSON.stringify(blockedUrls));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  }, [blockedUrls]);

  const showToast = (message: string, type: 'success' | 'warning' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const addHistoryItem = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: `SC-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
    };
    setHistory((prev) => [newItem, ...prev]);

    // Also trigger notification if suspicious or high risk
    if (item.category === 'HIGH_RISK') {
      addNotification({
        title: `High-Risk ${item.type} Flagged`,
        description: `Threat detection on "${item.target}": ${item.summary}`,
        severity: 'high',
        category: 'threat',
        relatedTarget: item.target,
        actionLabel: 'Inspect in History',
      });
    } else if (item.category === 'SUSPICIOUS') {
      addNotification({
        title: `Suspicious ${item.type} Detected`,
        description: `Unusual structure identified in "${item.target}". Proceed with care.`,
        severity: 'warning',
        category: 'threat',
        relatedTarget: item.target,
        actionLabel: 'Inspect in History',
      });
    }
  };

  const deleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    showToast('Entry removed from history.', 'info');
  };

  const clearHistory = () => {
    setHistory([]);
    showToast('Scan history cleared.', 'success');
  };

  const exportCsv = () => {
    const headers = ['Scan ID', 'Timestamp', 'Target', 'Type', 'Category', 'Score', 'Summary', 'Indicators'];
    const rows = history.map((item) => [
      item.id,
      item.timestamp,
      `"${item.target.replace(/"/g, '""')}"`,
      item.type,
      item.category,
      item.score,
      `"${item.summary.replace(/"/g, '""')}"`,
      `"${item.indicators.join('; ').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `safecross_scan_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported scan history to CSV.', 'success');
  };

  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast('All notifications marked as read.', 'info');
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const addNotification = (item: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotif: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: 'Just now',
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const addDevice = (device: Omit<ConnectedDeviceItem, 'id' | 'lastSeen' | 'threatsPrevented'>) => {
    const newDev: ConnectedDeviceItem = {
      ...device,
      id: `dev-${Date.now()}`,
      lastSeen: 'Active now',
      threatsPrevented: 0,
    };
    setDevices((prev) => [...prev, newDev]);
    showToast(`Device "${device.name}" enrolled.`, 'success');
  };

  const removeDevice = (id: string) => {
    const dev = devices.find((d) => d.id === id);
    setDevices((prev) => prev.filter((d) => d.id !== id));
    showToast(`Device "${dev?.name || 'Device'}" disconnected.`, 'info');
  };

  const syncDevice = (id: string) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, lastSeen: 'Just now', lastScanTimestamp: 'Just now' } : d))
    );
    showToast('Device telemetry synchronized.', 'success');
  };

  const updateSettings = (newSettings: Partial<SecuritySettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Settings saved successfully.', 'success');
  };

  const toggleTheme = () => {
    setSettings((prev) => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }));
  };

  const addBlockedUrl = (domain: string) => {
    const clean = domain.trim().toLowerCase().replace(/^https?:\/\//, '').split('/')[0];
    if (clean && !blockedUrls.includes(clean)) {
      setBlockedUrls((prev) => [...prev, clean]);
      showToast(`Domain "${clean}" added to local blocklist.`, 'success');
    }
  };

  const removeBlockedUrl = (domain: string) => {
    setBlockedUrls((prev) => prev.filter((d) => d !== domain));
    showToast(`Domain "${domain}" removed from local blocklist.`, 'info');
  };

  return (
    <SafeCrossContext.Provider
      value={{
        activeSection,
        setActiveSection,
        history,
        addHistoryItem,
        deleteHistoryItem,
        clearHistory,
        exportCsv,
        notifications,
        unreadNotificationCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        addNotification,
        devices,
        addDevice,
        removeDevice,
        syncDevice,
        settings,
        updateSettings,
        toggleTheme,
        blockedUrls,
        addBlockedUrl,
        removeBlockedUrl,
        toast,
        showToast,
        isAdminMode,
        setIsAdminMode,
      }}
    >
      {children}
    </SafeCrossContext.Provider>
  );
};

export const useSafeCross = (): SafeCrossContextType => {
  const context = useContext(SafeCrossContext);
  if (!context) {
    throw new Error('useSafeCross must be used within a SafeCrossProvider');
  }
  return context;
};
