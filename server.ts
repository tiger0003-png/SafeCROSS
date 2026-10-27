import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import {
  analyzeUrlSafety,
  analyzeApkSafety,
  analyzeTabSafety,
  ConnectedDevice,
  DevicePolicyConfig,
  DEFAULT_SECURITY_POLICIES,
  ThreatSeverity,
  ThreatVector,
} from './src/utils/securityEngine.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());

// Initialize Server-side Gemini AI client
const geminiApiKey = process.env.GEMINI_API_KEY;
const isRealApiKey = geminiApiKey && geminiApiKey !== 'MY_GEMINI_API_KEY' && geminiApiKey.trim().length > 15;
const ai = isRealApiKey
  ? new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

export interface FlaggedThreatRecord {
  id: string;
  timestamp: string;
  target: string;
  threatType: string;
  vector: ThreatVector;
  severity: ThreatSeverity;
  score: number;
  reasons: string[];
  mitreTechnique?: string;
  deviceOrigin: string;
  status: 'BLOCKED' | 'QUARANTINED' | 'OVERRIDDEN' | 'ISOLATED';
  aiForensics?: string;
}

// In-memory threat database with realistic enterprise seed threats
let threatHistory: FlaggedThreatRecord[] = [
  {
    id: 'THR-8901',
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    target: 'https://paypa1-security-verification.com/login',
    threatType: 'Credential Harvesting Phishing Link',
    vector: 'PHISHING_URL',
    severity: 'CRITICAL',
    score: 98,
    reasons: [
      'Domain identified in active global Threat Intelligence feed.',
      'Homoglyph Typosquatting detected: Spoofing "PayPal" with numeral "1".',
      'Punycode and mismatched SSL certificate payload.',
    ],
    mitreTechnique: 'MITRE ATT&CK T1566.002 (Spearphishing Link)',
    deviceOrigin: 'CEO MacBook Pro',
    status: 'BLOCKED',
    aiForensics: 'High-confidence brand spoofing campaign impersonating PayPal account recovery. Server hosted in bulletproof bullet-drop ASN. Immediate network egress blocked.',
  },
  {
    id: 'THR-8902',
    timestamp: new Date(Date.now() - 1000 * 60 * 52).toISOString(),
    target: 'BankSecurity_Update_v2.apk',
    threatType: 'Trojanized Android Malware (Overlay/Spyware)',
    vector: 'MALWARE_APK',
    severity: 'CRITICAL',
    score: 95,
    reasons: [
      'Package binds Accessibility Service + System Alert Window.',
      'SMS intercept capability detected without legitimate carrier manifest.',
      'Sideloaded from unauthenticated browser download source.',
    ],
    mitreTechnique: 'MITRE ATT&CK T1476 (Sideloading) / T1418',
    deviceOrigin: 'Field Tech Pixel 9',
    status: 'QUARANTINED',
    aiForensics: 'Known Vultur/TeaBot variant utilizing accessibility injection to steal banking credentials and intercept 2FA SMS tokens. File placed in encrypted sandbox quarantine.',
  },
  {
    id: 'THR-8903',
    timestamp: new Date(Date.now() - 1000 * 60 * 115).toISOString(),
    target: 'StreamingHub - Free HD Watch',
    threatType: 'Cryptomining Web Tab',
    vector: 'HARMFUL_TAB',
    severity: 'HIGH',
    score: 75,
    reasons: [
      'WASM WebWorker executing cryptominer script (CoinHive/Monero signature).',
      'CPU core saturation spike at 99.4% inside background tab.',
    ],
    mitreTechnique: 'MITRE ATT&CK T1496 (Resource Hijacking)',
    deviceOrigin: 'Admin Workstation',
    status: 'BLOCKED',
    aiForensics: 'Silent background browser cryptomining script terminated. WebWorker thread killed and domain blacklisted across connected mesh.',
  },
  {
    id: 'THR-8904',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    target: 'https://appleid-verify-account.support/auth',
    threatType: 'Credential Harvesting Phishing Link',
    vector: 'PHISHING_URL',
    severity: 'CRITICAL',
    score: 92,
    reasons: [
      'Suspicious low-reputation top-level domain (.support).',
      'Deceptive brand token "appleid" paired with auth pathway.',
    ],
    mitreTechnique: 'MITRE ATT&CK T1566.002',
    deviceOrigin: 'Finance iPhone 16',
    status: 'BLOCKED',
    aiForensics: 'Targeted spearphishing page mimicking Apple ID 2-Factor Authentication portal. Blocked by DNS threat shield in 14ms.',
  },
];

// In-memory connected devices
let connectedDevices: ConnectedDevice[] = [
  {
    id: 'dev-01',
    name: 'CEO MacBook Pro',
    platform: 'macOS Sequoia',
    type: 'desktop',
    ipAddress: '10.0.4.12',
    status: 'SYNCHRONIZED',
    latencyMs: 14,
    lastHeartbeat: 'Just now',
    policyVersion: 'v2.4.1-strict',
    threatsPrevented: 18,
    activeShields: { webProtection: true, appSandbox: true, dnsFilter: true },
  },
  {
    id: 'dev-02',
    name: 'Admin Workstation',
    platform: 'Windows 11',
    type: 'desktop',
    ipAddress: '10.0.4.18',
    status: 'SYNCHRONIZED',
    latencyMs: 11,
    lastHeartbeat: 'Just now',
    policyVersion: 'v2.4.1-strict',
    threatsPrevented: 34,
    activeShields: { webProtection: true, appSandbox: true, dnsFilter: true },
  },
  {
    id: 'dev-03',
    name: 'Field Tech Pixel 9',
    platform: 'Android 15',
    type: 'mobile',
    ipAddress: '10.0.5.88',
    status: 'SYNCHRONIZED',
    latencyMs: 19,
    lastHeartbeat: '1m ago',
    policyVersion: 'v2.4.1-strict',
    threatsPrevented: 12,
    activeShields: { webProtection: true, appSandbox: true, dnsFilter: true },
  },
  {
    id: 'dev-04',
    name: 'Finance iPhone 16',
    platform: 'iOS 18',
    type: 'mobile',
    ipAddress: '10.0.5.94',
    status: 'SYNCHRONIZED',
    latencyMs: 16,
    lastHeartbeat: 'Just now',
    policyVersion: 'v2.4.1-strict',
    threatsPrevented: 7,
    activeShields: { webProtection: true, appSandbox: true, dnsFilter: true },
  },
  {
    id: 'dev-05',
    name: 'Dev Linux Workstation',
    platform: 'Ubuntu 24.04',
    type: 'desktop',
    ipAddress: '10.0.4.45',
    status: 'SYNCHRONIZED',
    latencyMs: 9,
    lastHeartbeat: 'Just now',
    policyVersion: 'v2.4.1-strict',
    threatsPrevented: 4,
    activeShields: { webProtection: true, appSandbox: true, dnsFilter: true },
  },
];

let globalPolicies: DevicePolicyConfig = { ...DEFAULT_SECURITY_POLICIES };

// API Routes

// 1. Scan URL
app.post('/api/scan/url', async (req, res) => {
  try {
    const { url, deviceOrigin, enableAiForensics } = req.body;
    if (!url || typeof url !== 'string') {
      res.status(400).json({ error: 'Valid URL is required' });
      return;
    }

    const result = analyzeUrlSafety(url);

    // If threat detected or AI analysis requested, generate deep AI forensics summary
    let aiForensics: string | undefined;
    if (result.isThreat && ai && enableAiForensics) {
      try {
        const prompt = `As a cybersecurity threat analyst for an enterprise Zero-Trust endpoint security platform, provide a concise 2-sentence forensic threat briefing for this flagged URL:
URL: ${url}
Threat Type: ${result.threatType}
Heuristic Score: ${result.score}/100
Flags: ${result.reasons.join('; ')}
Explain the threat vector and confirm why user access must be intercepted.`;

        const aiResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });
        aiForensics = aiResponse.text?.trim();
      } catch (e) {
        console.warn('Gemini AI analysis fallback:', e);
      }
    }

    if (!aiForensics && result.isThreat) {
      aiForensics = `Automated threat engine detected ${result.reasons.length} risk indicators for ${url}. Domain flagged with ${result.score}% malicious probability. Interception policy enforced.`;
    }

    // If threat, persist to threat audit log
    if (result.isThreat) {
      const record: FlaggedThreatRecord = {
        id: `THR-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toISOString(),
        target: url,
        threatType: result.threatType,
        vector: result.vector,
        severity: result.severity,
        score: result.score,
        reasons: result.reasons,
        mitreTechnique: result.mitreTechnique,
        deviceOrigin: deviceOrigin || 'CEO MacBook Pro',
        status: 'BLOCKED',
        aiForensics,
      };
      threatHistory.unshift(record);

      // Increment threat count for originating device
      const dev = connectedDevices.find(d => d.name === (deviceOrigin || 'CEO MacBook Pro'));
      if (dev) dev.threatsPrevented += 1;
    }

    res.json({
      ...result,
      aiForensics,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error scanning URL' });
  }
});

// 2. Scan APK
app.post('/api/scan/apk', async (req, res) => {
  try {
    const { apkData, deviceOrigin, enableAiForensics } = req.body;
    if (!apkData || !apkData.fileName) {
      res.status(400).json({ error: 'Valid APK metadata is required' });
      return;
    }

    const result = analyzeApkSafety(apkData);

    let aiForensics: string | undefined;
    if (result.isThreat && ai && enableAiForensics) {
      try {
        const prompt = `As a mobile malware reverse engineer, provide a 2-sentence forensic evaluation of this Android APK:
File Name: ${apkData.fileName}
Package: ${apkData.packageName}
Permissions: ${(apkData.declaredPermissions || []).join(', ')}
Flags: ${result.reasons.join('; ')}
Explain the malicious payload behavior (e.g. banking overlay, SMS stealer, or spyware) and recommended endpoint action.`;

        const aiResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });
        aiForensics = aiResponse.text?.trim();
      } catch (e) {
        console.warn('Gemini AI APK analysis fallback:', e);
      }
    }

    if (!aiForensics && result.isThreat) {
      aiForensics = `Heuristic permission audit identified trojan overlay behavior in ${apkData.fileName}. Critical permissions intercepted and quarantined.`;
    }

    if (result.isThreat) {
      const record: FlaggedThreatRecord = {
        id: `THR-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toISOString(),
        target: apkData.fileName,
        threatType: result.threatType,
        vector: result.vector,
        severity: result.severity,
        score: result.score,
        reasons: result.reasons,
        mitreTechnique: result.mitreTechnique,
        deviceOrigin: deviceOrigin || 'Field Tech Pixel 9',
        status: 'QUARANTINED',
        aiForensics,
      };
      threatHistory.unshift(record);

      const dev = connectedDevices.find(d => d.name === (deviceOrigin || 'Field Tech Pixel 9'));
      if (dev) dev.threatsPrevented += 1;
    }

    res.json({
      ...result,
      aiForensics,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error scanning APK' });
  }
});

// 3. Scan Tab
app.post('/api/scan/tab', (req, res) => {
  try {
    const { tabData, deviceOrigin } = req.body;
    const result = analyzeTabSafety(tabData);

    if (result.isThreat) {
      const record: FlaggedThreatRecord = {
        id: `THR-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toISOString(),
        target: tabData.tabTitle || tabData.url,
        threatType: result.threatType,
        vector: result.vector,
        severity: result.severity,
        score: result.score,
        reasons: result.reasons,
        mitreTechnique: result.mitreTechnique,
        deviceOrigin: deviceOrigin || 'Admin Workstation',
        status: 'BLOCKED',
        aiForensics: 'Active browser tab script execution intercepted. Process terminated before malicious payload could exfiltrate keystrokes or exploit CPU.',
      };
      threatHistory.unshift(record);

      const dev = connectedDevices.find(d => d.name === (deviceOrigin || 'Admin Workstation'));
      if (dev) dev.threatsPrevented += 1;
    }

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Get Threat History & Audit Logs
app.get('/api/threats', (req, res) => {
  res.json({
    threats: threatHistory,
    totalCount: threatHistory.length,
    criticalCount: threatHistory.filter(t => t.severity === 'CRITICAL').length,
    highCount: threatHistory.filter(t => t.severity === 'HIGH').length,
  });
});

// Clear or dismiss threat record
app.delete('/api/threats/:id', (req, res) => {
  const { id } = req.params;
  threatHistory = threatHistory.filter(t => t.id !== id);
  res.json({ success: true, remaining: threatHistory.length });
});

// Override threat (admin bypass)
app.patch('/api/threats/:id/override', (req, res) => {
  const { id } = req.params;
  const threat = threatHistory.find(t => t.id === id);
  if (threat) {
    threat.status = 'OVERRIDDEN';
    res.json({ success: true, threat });
  } else {
    res.status(404).json({ error: 'Threat record not found' });
  }
});

// 5. Get Connected Devices & Sync Status
app.get('/api/devices', (req, res) => {
  res.json({
    devices: connectedDevices,
    totalDevices: connectedDevices.length,
    synchronizedDevices: connectedDevices.filter(d => d.status === 'SYNCHRONIZED').length,
    averageLatencyMs: Math.round(connectedDevices.reduce((acc, d) => acc + d.latencyMs, 0) / connectedDevices.length),
  });
});

// Force sync devices
app.post('/api/devices/sync', (req, res) => {
  connectedDevices = connectedDevices.map(d => ({
    ...d,
    status: 'SYNCHRONIZED',
    lastHeartbeat: 'Just now',
    latencyMs: Math.floor(8 + Math.random() * 12),
  }));
  res.json({
    success: true,
    message: 'Synchronized all connected endpoints with latest threat intelligence cache.',
    devices: connectedDevices,
  });
});

// Quarantine device
app.post('/api/devices/:id/quarantine', (req, res) => {
  const { id } = req.params;
  const dev = connectedDevices.find(d => d.id === id);
  if (dev) {
    dev.status = dev.status === 'QUARANTINED' ? 'SYNCHRONIZED' : 'QUARANTINED';
    res.json({ success: true, device: dev });
  } else {
    res.status(404).json({ error: 'Device not found' });
  }
});

// 6. Security Policies
app.get('/api/policies', (req, res) => {
  res.json({
    policies: globalPolicies,
    lastUpdated: new Date().toISOString(),
    pushedToDevicesCount: connectedDevices.length,
  });
});

app.put('/api/policies', (req, res) => {
  const newPolicies = req.body;
  globalPolicies = { ...globalPolicies, ...newPolicies };
  // Update policy version across devices
  const newVersion = `v2.4.${Math.floor(2 + Math.random() * 8)}`;
  connectedDevices = connectedDevices.map(d => ({
    ...d,
    policyVersion: newVersion,
    activeShields: {
      webProtection: globalPolicies.strictPhishingBlock,
      appSandbox: globalPolicies.blockApkSideloading,
      dnsFilter: globalPolicies.dnsThreatShield,
    },
  }));
  res.json({
    success: true,
    message: `Security policies updated and pushed to ${connectedDevices.length} devices in 12ms.`,
    policies: globalPolicies,
    devices: connectedDevices,
  });
});

// 7. Comprehensive Vulnerability & Executive Report
app.get('/api/report', async (req, res) => {
  const stats = {
    totalScansToday: 14820,
    threatsNeutralized: threatHistory.length + 142,
    cleanRatePercent: 99.78,
    activeVulnerabilities: [
      {
        cve: 'CVE-2026-3821',
        title: 'Chromium V8 Engine Remote Type Confusion',
        severity: 'CRITICAL',
        affectedPlatforms: ['macOS Sequoia', 'Windows 11', 'Android 15'],
        status: 'PATCHED_BY_AEGIS_SHIELD_VIRTUAL_PATCH',
        description: 'Allows remote attackers to execute arbitrary code via malicious WebAssembly script.',
      },
      {
        cve: 'CVE-2026-1192',
        title: 'Android Binder IPC Privilege Escalation via Sideloaded APK',
        severity: 'HIGH',
        affectedPlatforms: ['Android 15'],
        status: 'MITIGATED_VIA_SIDELOAD_SANDBOX',
        description: 'Malicious sideloaded apps could manipulate Binder tokens to acquire system permissions.',
      },
      {
        cve: 'CVE-2026-0844',
        title: 'IDN Homograph Visual Spoofing in Modern Browsers',
        severity: 'MEDIUM',
        affectedPlatforms: ['All Platforms'],
        status: 'BLOCKED_BY_HOMOGLYPH_FILTER',
        description: 'Deceptive Cyrillic and Greek unicode lookalike domain names bypassing standard URL decoders.',
      },
    ],
  };

  res.json(stats);
});

// Setup Vite or static serving
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`AegisShield Security Platform listening on http://0.0.0.0:${port}`);
  });
}

startServer();
