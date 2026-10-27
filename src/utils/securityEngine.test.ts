import test from 'node:test';
import assert from 'node:assert/strict';
import {
  analyzeUrlSafety,
  analyzeApkSafety,
  analyzeTabSafety,
} from './securityEngine';

test('detects known phishing link and homoglyphs with critical severity', () => {
  const result = analyzeUrlSafety('https://paypa1-security-verification.com/login');
  assert.equal(result.isThreat, true);
  assert.equal(result.severity, 'CRITICAL');
  assert.equal(result.recommendedAction, 'BLOCK_IMMEDIATELY');
  assert.ok(result.score >= 75);
  assert.ok(result.reasons.length > 0);
  assert.ok(result.latencyMs < 50); // Low-latency requirement
});

test('identifies safe URL without false positives', () => {
  const result = analyzeUrlSafety('https://github.com/developer/project');
  assert.equal(result.isThreat, false);
  assert.equal(result.severity, 'CLEAN');
  assert.equal(result.recommendedAction, 'ALLOW');
  assert.equal(result.score, 0);
});

test('detects suspicious TLD and banking keyword combination', () => {
  const result = analyzeUrlSafety('https://secure-chase-update-account.xyz');
  assert.equal(result.isThreat, true);
  assert.ok(['CRITICAL', 'HIGH'].includes(result.severity));
  assert.ok(result.indicators.suspiciousTld);
});

test('identifies banking trojan APK by accessibility service and overlay combo', () => {
  const trojanResult = analyzeApkSafety({
    fileName: 'BankSecurity_Update_v2.apk',
    packageName: 'com.android.system.service.update',
    fileSizeBytes: 12400000,
    declaredPermissions: [
      'android.permission.BIND_ACCESSIBILITY_SERVICE',
      'android.permission.SYSTEM_ALERT_WINDOW',
      'android.permission.READ_SMS',
      'android.permission.RECEIVE_BOOT_COMPLETED',
    ],
    hasAccessibilityService: true,
    hasOverlayPermission: true,
    sourceOrigin: 'UNTRUSTED_SIDELOAD',
  });

  assert.equal(trojanResult.isThreat, true);
  assert.equal(trojanResult.severity, 'CRITICAL');
  assert.equal(trojanResult.recommendedAction, 'QUARANTINE_FILE');
  assert.ok(trojanResult.reasons.some(r => r.includes('Accessibility Service')));
});

test('allows clean APK with standard developer permissions', () => {
  const cleanResult = analyzeApkSafety({
    fileName: 'Signal_Messenger_Official.apk',
    packageName: 'org.thoughtcrime.securesms',
    fileSizeBytes: 35000000,
    declaredPermissions: [
      'android.permission.CAMERA',
      'android.permission.RECORD_AUDIO',
      'android.permission.READ_CONTACTS',
    ],
    hasAccessibilityService: false,
    hasOverlayPermission: false,
    sourceOrigin: 'GOOGLE_PLAY_STORE',
  });

  assert.equal(cleanResult.isThreat, false);
  assert.equal(cleanResult.severity, 'CLEAN');
  assert.equal(cleanResult.recommendedAction, 'ALLOW');
});

test('identifies harmful tab with cryptominer script', () => {
  const tabResult = analyzeTabSafety({
    url: 'https://free-movie-stream-online.cc/watch',
    tabTitle: 'Watch Free Movies Online HD',
    detectedScripts: ['coinhive.min.js', 'eval_unpacker.js'],
    hasCryptominingSignature: true,
    hasClickjackingOverlay: false,
    hasUnencryptedForm: false,
    hasPersistentPushPrompt: true,
  });

  assert.equal(tabResult.isThreat, true);
  assert.equal(tabResult.severity, 'CRITICAL');
  assert.equal(tabResult.threatType, 'Cryptomining Web Tab');
  assert.equal(tabResult.recommendedAction, 'BLOCK_IMMEDIATELY');
});
