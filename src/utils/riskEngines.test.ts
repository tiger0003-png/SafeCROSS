import test from 'node:test';
import assert from 'node:assert/strict';
import { assessUrlRisk, DEFAULT_DEMO_BLOCKLIST } from './urlRiskEngine';
import { assessApkRisk, validateApkFile, PRESET_SAMPLE_APKS } from './apkRiskEngine';

test('assessUrlRisk detects default blocklist domain as HIGH_RISK', () => {
  const result = assessUrlRisk('https://paypa1-security-verification.com/login');
  assert.equal(result.category, 'HIGH_RISK');
  assert.ok(result.score >= 70);
  assert.ok(result.indicators.length > 0);
  assert.equal(result.engine, 'Cloud Threat Intel Cache (Simulated)');
});

test('assessUrlRisk flags numeric IP addresses as suspicious or high risk', () => {
  const result = assessUrlRisk('http://192.168.1.100/auth');
  assert.ok(['SUSPICIOUS', 'HIGH_RISK'].includes(result.category));
  assert.ok(result.indicators.some((i) => i.includes('numeric IP address')));
});

test('assessUrlRisk passes legitimate clean domain as LOW_RISK', () => {
  const result = assessUrlRisk('https://github.com/developer/project');
  assert.equal(result.category, 'LOW_RISK');
  assert.equal(result.score, 0);
  assert.equal(result.sslStatus, 'Valid Certificate');
});

test('assessUrlRisk handles user custom blocklist', () => {
  const customBlock = ['custom-malicious-site.org'];
  const result = assessUrlRisk('https://custom-malicious-site.org/phish', customBlock);
  assert.equal(result.category, 'HIGH_RISK');
  assert.ok(result.indicators.some((i) => i.includes('active demonstration blocklist')));
});

test('validateApkFile rejects non-apk files and oversized packages', () => {
  const invalidExt = validateApkFile('malware.exe', 1024);
  assert.equal(invalidExt.valid, false);

  const emptyFile = validateApkFile('app.apk', 0);
  assert.equal(emptyFile.valid, false);

  const oversized = validateApkFile('heavy.apk', 200 * 1024 * 1024);
  assert.equal(oversized.valid, false);

  const valid = validateApkFile('clean.apk', 20 * 1024 * 1024);
  assert.equal(valid.valid, true);
});

test('assessApkRisk detects banking trojan signature (accessibility + overlay + sms)', () => {
  const trojanSample = PRESET_SAMPLE_APKS[0]; // Vultur_Banking_Trojan.apk
  const result = assessApkRisk(trojanSample);
  assert.equal(result.category, 'HIGH_RISK');
  assert.ok(result.score >= 70);
  assert.ok(result.indicators.some((i) => i.includes('Accessibility Service')));
});

test('assessApkRisk allows clean package with standard permissions', () => {
  const cleanSample = PRESET_SAMPLE_APKS[2]; // Signal_Messenger_Official.apk
  const result = assessApkRisk(cleanSample);
  assert.equal(result.category, 'LOW_RISK');
  assert.equal(result.score, 0);
});
