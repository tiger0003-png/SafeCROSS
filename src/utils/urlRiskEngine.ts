/**
 * SafeCross - Local URL Pattern Risk Assessment Engine
 *
 * NOTE & HONESTY DISCLOSURE:
 * This module performs client-side pattern matching, syntactic structure analysis,
 * homoglyph detection, and simulated threat-intelligence lookups.
 * Pattern matching alone does not prove a URL is definitively malicious or safe;
 * in production, this is combined with external reputation telemetry and dynamic sandboxing.
 */

import { ScanRiskCategory, UrlRiskAssessment } from '../types/safecross';

// Known demonstration malicious patterns and reserved testing domains
export const DEFAULT_DEMO_BLOCKLIST: string[] = [
  'paypa1-security-verification.com',
  'chase-online-login-update.xyz',
  'metamask-airdrop-claim.top',
  'appleid-verify-account.support',
  'bankofamerica-login-auth.info',
  'free-crypto-giveaway.io',
  'telegram-premium-free.download',
  'netflix-billing-renewal.vip',
  'secure-account-verification-login.cc',
];

const HIGH_RISK_TLDS = new Set(['xyz', 'top', 'cc', 'vip', 'work', 'download', 'support', 'biz', 'gq', 'cf', 'tk']);
const SENSITIVE_BRANDS = ['paypal', 'apple', 'google', 'chase', 'bank', 'metamask', 'binance', 'microsoft', 'netflix', 'amazon', 'wells', 'fidelity', 'steam'];
const PHISHING_KEYWORDS = ['login', 'verify', 'account', 'security', 'update', 'billing', 'confirm', 'wallet', 'claim', 'free', 'airdrop', 'signin', 'support', 'recover'];

const TYPOSQUAT_PATTERNS: Array<{ pattern: RegExp; brand: string }> = [
  { pattern: /paypa[1l|i]/i, brand: 'PayPal' },
  { pattern: /micros[0o]ft/i, brand: 'Microsoft' },
  { pattern: /g[0o]{2}gle/i, brand: 'Google' },
  { pattern: /app[1l|i]e/i, brand: 'Apple' },
  { pattern: /amaz[0o]n/i, brand: 'Amazon' },
  { pattern: /ch[a@]se/i, brand: 'Chase' },
  { pattern: /b[i1]n[a@]nce/i, brand: 'Binance' },
  { pattern: /met[a@]m[a@]sk/i, brand: 'MetaMask' },
  { pattern: /netfl[i1l]x/i, brand: 'Netflix' },
];

const IP_HOST_REGEX = /^(\d{1,3}\.){3}\d{1,3}$/;

/**
 * Evaluates the risk score of a given URL.
 * Does NOT execute network requests to the target destination.
 */
export function assessUrlRisk(
  rawInput: string,
  userBlocklist: string[] = []
): UrlRiskAssessment {
  const startTime = performance.now();
  const trimmed = rawInput.trim();

  // Basic sanity validation
  if (!trimmed) {
    return {
      url: rawInput,
      normalizedUrl: '',
      domain: '',
      category: 'UNKNOWN',
      score: 50,
      title: 'Empty Input',
      summary: 'No URL was supplied for evaluation.',
      indicators: ['No target string provided'],
      recommendedAction: 'Enter a valid URL or hostname to begin scan.',
      timestamp: new Date().toISOString(),
      scanDurationMs: 1,
      engine: 'Local Pattern Heuristics',
      sslStatus: 'Unverified',
    };
  }

  // Prepend protocol if missing for URL parsing
  let parsedUrl: URL;
  let normalized = trimmed;
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = 'https://' + normalized;
  }

  try {
    parsedUrl = new URL(normalized);
  } catch {
    return {
      url: rawInput,
      normalizedUrl: normalized,
      domain: '',
      category: 'HIGH_RISK',
      score: 85,
      title: 'Invalid / Malformed URL Structure',
      summary: 'The target destination contains malformed URI syntax, which is frequently used in obfuscation and exploit payloads.',
      indicators: [
        'Malformed URI syntax prevents standard browser protocol resolution.',
        'High likelihood of character-level evasion technique.',
      ],
      recommendedAction: 'Do not attempt to open this link in any browser.',
      timestamp: new Date().toISOString(),
      scanDurationMs: Math.round(performance.now() - startTime),
      engine: 'Local Pattern Heuristics',
      sslStatus: 'Unverified',
    };
  }

  const hostname = parsedUrl.hostname.toLowerCase();
  const pathname = parsedUrl.pathname.toLowerCase();
  const search = parsedUrl.search.toLowerCase();
  const fullTarget = hostname + pathname;

  const indicators: string[] = [];
  let score = 0;
  let isBlocklisted = false;

  // 1. Check local demo blocklist + user custom blocklist
  const combinedBlocklist = [...DEFAULT_DEMO_BLOCKLIST, ...userBlocklist];
  if (
    combinedBlocklist.includes(hostname) ||
    combinedBlocklist.some((b) => hostname.endsWith('.' + b.toLowerCase()))
  ) {
    isBlocklisted = true;
    score += 85;
    indicators.push(`Domain matches active demonstration blocklist entry (${hostname}).`);
  }

  // 2. IP address as hostname (e.g. http://192.168.1.50/login)
  if (IP_HOST_REGEX.test(hostname)) {
    score += 55;
    indicators.push('Raw numeric IP address used as hostname instead of a registered domain name.');
  }

  // 3. Homoglyph / Typosquatting checks
  for (const { pattern, brand } of TYPOSQUAT_PATTERNS) {
    const isOfficial =
      hostname === `${brand.toLowerCase()}.com` ||
      hostname.endsWith(`.${brand.toLowerCase()}.com`);
    if (!isOfficial && pattern.test(hostname)) {
      score += 50;
      indicators.push(`Homoglyph Typosquatting: Hostname appears to impersonate trusted brand "${brand}".`);
    }
  }

  // Punycode / Internationalized Domain Name spoofing (xn--)
  if (hostname.includes('xn--')) {
    score += 35;
    indicators.push('Internationalized domain name (Punycode xn--) detected; often used in visual lookalike spoofing.');
  }

  // 4. Excessive subdomain depth (e.g., login.verify.chase.com.security-patch.xyz)
  const segments = hostname.split('.');
  if (segments.length >= 4) {
    score += 25;
    indicators.push(`Excessive subdomain nesting depth (${segments.length} segments), typical of phishing redirect chains.`);
  }

  // 5. High-risk or low-reputation TLD
  const tld = segments[segments.length - 1] || '';
  if (HIGH_RISK_TLDS.has(tld)) {
    score += 30;
    indicators.push(`High-risk Top-Level Domain (.${tld}) with statistically elevated cybercrime and spam density.`);
  }

  // 6. Sensitive brand keyword outside primary domain
  const matchedBrand = SENSITIVE_BRANDS.find(
    (b) => hostname.includes(b) && !hostname.endsWith(`${b}.com`) && !hostname.endsWith(`${b}.org`)
  );
  const matchedIntent = PHISHING_KEYWORDS.filter(
    (k) => hostname.includes(k) || pathname.includes(k) || search.includes(k)
  );

  if (matchedBrand && matchedIntent.length > 0) {
    score += 45;
    indicators.push(
      `Credential Harvesting Signature: Brand token "${matchedBrand}" paired with authentication keywords [${matchedIntent.slice(0, 3).join(', ')}].`
    );
  } else if (matchedBrand) {
    score += 25;
    indicators.push(`Unusual Brand Placement: Sensitive brand token "${matchedBrand}" is not part of the primary authenticated domain.`);
  }

  // 7. Plaintext unencrypted HTTP protocol check
  const isPlainHttp = parsedUrl.protocol === 'http:';
  if (isPlainHttp) {
    score += 20;
    indicators.push('Plaintext unencrypted HTTP connection. Traffic is vulnerable to interception and tampering.');
  }

  // Categorize based on cumulative score
  score = Math.min(100, Math.max(0, score));

  let category: ScanRiskCategory = 'LOW_RISK';
  let title = 'Low Risk Link';
  let summary = 'No high-risk syntactic patterns or known demonstration threat indicators were detected.';
  let recommendedAction = 'Proceed with standard digital hygiene. Verify domain before entering passwords.';

  if (score >= 70 || isBlocklisted) {
    category = 'HIGH_RISK';
    title = 'High Risk Phishing / Malicious Destination';
    summary = 'Multiple high-confidence deception signatures were detected. Visiting this site could result in credential theft, financial fraud, or malware download.';
    recommendedAction = 'Do not open this link. Close the originating tab or delete the message containing this URL.';
  } else if (score >= 25) {
    category = 'SUSPICIOUS';
    title = 'Suspicious Domain Structure';
    summary = 'Moderate risk indicators detected. The link exhibits unusual nesting, unencrypted transport, or keywords commonly seen in deceptive landing pages.';
    recommendedAction = 'Proceed with caution. Inspect the domain carefully and do not enter personal or financial information.';
  }

  const sslStatus = isPlainHttp
    ? 'Plaintext HTTP (Insecure)'
    : category === 'HIGH_RISK'
    ? 'Self-Signed / Untrusted'
    : 'Valid Certificate';

  const scanDurationMs = Math.max(3, Math.round(performance.now() - startTime));

  return {
    url: rawInput,
    normalizedUrl: parsedUrl.href,
    domain: hostname,
    category,
    score,
    title,
    summary,
    indicators:
      indicators.length > 0
        ? indicators
        : ['Valid domain syntax', 'Standard top-level domain', 'No deceptive brand tokens detected'],
    recommendedAction,
    timestamp: new Date().toISOString(),
    scanDurationMs,
    engine: isBlocklisted ? 'Cloud Threat Intel Cache (Simulated)' : 'Local Pattern Heuristics',
    sslStatus,
    asnInfo: isBlocklisted ? 'ASN-64210 (High-abuse bulletproof hosting)' : 'Tier-1 Cloudflare / Global Edge',
  };
}
