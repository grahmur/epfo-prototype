import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../app/login/UnifiedLoginExperience.tsx', import.meta.url), 'utf8');

for (const fixture of ['DEMO-UAN-001', 'DEMO-EST-001', 'DEMO-PPO-001']) {
  assert.match(source, new RegExp(fixture), `Missing impossible-format fixture: ${fixture}`);
}

assert.doesNotMatch(source, /unifiedportal-|passbook\.epfindia|mis\.epfindia/, 'Demo login must not call a live EPFO account portal.');
