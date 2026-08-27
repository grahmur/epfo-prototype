import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../app/login/UnifiedLoginExperience.tsx', import.meta.url), 'utf8');
const loginPageSource = readFileSync(new URL('../app/login/page.tsx', import.meta.url), 'utf8');
const dashboardSource = readFileSync(new URL('../app/login/MemberDashboard.tsx', import.meta.url), 'utf8');
const dashboardSessionSource = readFileSync(new URL('../app/login/dashboardSession.ts', import.meta.url), 'utf8');
const languageSource = readFileSync(new URL('../app/LanguageSelector.tsx', import.meta.url), 'utf8');
const cssSource = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8');
const combinedSource = `${source}\n${dashboardSource}`;

for (const fixture of ['DEMO-UAN-001', 'DEMO-EST-001', 'DEMO-PPO-001']) {
  assert.match(source, new RegExp(fixture), `Missing impossible-format fixture: ${fixture}`);
}

assert.doesNotMatch(source, /unifiedportal-|passbook\.epfindia|mis\.epfindia/, 'Demo login must not call a live EPFO account portal.');
assert.doesNotMatch(combinedSource, /\b\d{12}\b/, 'Demo UI must not contain a plausible 12-digit UAN.');
assert.doesNotMatch(combinedSource, /\b[A-Z]{5}\d{4}[A-Z]\b/, 'Demo UI must not contain a plausible PAN.');
assert.doesNotMatch(combinedSource, /\b[A-Z]{4}0[A-Z0-9]{6}\b/, 'Demo UI must not contain a plausible IFSC.');
assert.doesNotMatch(combinedSource, /\+91\s*[•*\d]/, 'Demo UI must not contain a plausible Indian mobile number.');

for (const feature of [
  'Passbook & Ledger',
  'Submit Online Claim',
  'Track Claims',
  'KYC & Nomination',
  'Banking Details',
  'Member notification center',
  'Submit simulated claim',
]) {
  assert.match(dashboardSource, new RegExp(feature), `Missing member dashboard feature: ${feature}`);
}

assert.doesNotMatch(dashboardSource, /\['overview', 'Overview', 'OV'\]|\['schemes', 'Schemes & PMVBRY', 'SC'\]/, 'Sidebar navigation must not use letter abbreviations as icons.');
assert.match(dashboardSource, /function PortalNavIcon/, 'Sidebar navigation must provide semantic visual icons.');
assert.match(cssSource, /\.nav-icon-tile/, 'Sidebar navigation icons must retain a shared visible tile treatment.');
assert.match(dashboardSource, /<h1 className="topbar-heading">\{viewLabels\[activeView\]\}<\/h1>/, 'Dashboard header must show the active page name.');
assert.doesNotMatch(dashboardSource, /Member portal \/ \{viewLabels\[activeView\]\}|Primary MID: DEMO-MID-00101/, 'Dashboard header must not expose breadcrumb or member-reference details.');
assert.doesNotMatch(dashboardSource, /portal-notice-strip/, 'Dashboards must not render the removed top synthetic-data strip.');
assert.doesNotMatch(dashboardSource, /sidebar-prototype-note|role-preview-disclosure/, 'Prototype disclosure must not be nested in the sidebar profile launcher or preview header.');
assert.match(dashboardSource, /dashboard-prototype-disclosure notranslate/, 'Dashboards must retain the required synthetic-data disclosure at the end of their content.');
assert.match(cssSource, /\.dashboard-prototype-disclosure/, 'Dashboard disclosure must retain dedicated footer styling.');
assert.match(dashboardSource, /member-profile-menu/, 'The complete sidebar member card must open a profile menu.');
assert.match(dashboardSource, /openView\('profile'\)/, 'The profile menu must open the dedicated profile page.');
assert.match(dashboardSource, /function ProfileView/, 'A dedicated synthetic profile page must be rendered.');
assert.match(dashboardSource, /openView\('grievances'\)/, 'The dashboard must link to the Grievances & Help view.');
assert.match(dashboardSource, /End simulated session/, 'The profile menu must provide the simulated sign-out action.');
assert.match(dashboardSource, /\^DEMO MEMBER \\d\{3\}\$/, 'Synthetic profile-name edits must reject real-looking names.');

assert.match(source, /<form className="login-form" method="post"/, 'Credential form must not fall back to a URL-query GET.');
assert.match(source, /otpValues\.join\(''\) !== '000000'/, 'Synthetic OTP must be checked before dashboard access.');

assert.equal(
  (combinedSource.match(/<LanguageSelector\b/g) ?? []).length,
  3,
  'Language selection must be available on login, member dashboard, and role dashboard previews.',
);
assert.doesNotMatch(combinedSource, /(?:standalone-login-viewport|modern-portal-layout glass-member-portal) notranslate/, 'Login and dashboard shells must remain translatable.');
assert.match(source, /Prototype — synthetic data only\.<\/span>/, 'Login must retain the untranslated synthetic-data disclosure.');
assert.match(languageSource, /saved !== 'en' && !document\.querySelector\('script\[data-epfo-translate\]'\)/, 'English-only visits must not load the translation provider.');
assert.match(languageSource, /initialTranslationLanguage/, 'Language selector must be able to receive the server-rendered target language.');
assert.match(languageSource, /epfo-language-change/, 'Language changes must notify the login copy without a page reload.');
assert.match(languageSource, /reloadAfterChange = false/, 'Public and login language changes must remain in place by default.');
assert.match(languageSource, /window\.location\.reload\(\)/, 'Dashboard language changes must be able to reload fresh translatable markup.');
assert.match(dashboardSessionSource, /epfo-prototype-dashboard-role/, 'A synthetic dashboard session must store only the selected role.');
assert.match(source, /from '\.\/dashboardSession'/, 'The client login flow must use the shared synthetic session key.');
assert.match(loginPageSource, /from '\.\/dashboardSession'/, 'The server login entry must use the shared synthetic session key.');
assert.match(source, /window\.setTimeout\(endForInactivity, 60_000\)/, 'Dashboard sessions must end after one minute without activity.');
assert.match(source, /'pointerdown', 'pointermove', 'keydown', 'scroll', 'touchstart'/, 'Common dashboard activity must reset the idle timeout.');
assert.match(source, /document\.cookie = `\$\{dashboardSessionRoleKey\}=; Max-Age=0/, 'Sign-out and inactivity must clear the synthetic dashboard session.');
assert.match(loginPageSource, /await cookies\(\)/, 'The refresh response must read the synthetic role marker before rendering.');
assert.match(loginPageSource, /initialDashboardRole/, 'The refresh response must pass the selected synthetic role to the dashboard entry component.');
assert.match(languageSource, /window\.setTimeout\(\(\) => window\.location\.reload\(\), 160\)/, 'Dashboard refresh must leave the selector-adjacent progress panel visible before navigation.');
assert.equal(
  (dashboardSource.match(/reloadAfterChange/g) ?? []).length,
  2,
  'Each dashboard selector must opt into reload-and-restore translation.',
);
assert.match(source, /अपना बारह अंकों का UAN दर्ज करें/, 'Hindi employee UAN placeholder must preserve the UAN abbreviation.');
assert.match(source, /अपना Password दर्ज करें/, 'Hindi employee password placeholder must preserve the Password term.');
assert.match(source, /कृपया अपना Establishment ID दर्ज करें/, 'Hindi employer identifier placeholder must preserve the Establishment ID term.');
assert.match(cssSource, /\.standalone-login-viewport :where\(font\)/, 'Google translation markup must inherit the login typography metrics.');
assert.doesNotMatch(cssSource, /html\[lang\]:not\(\[lang="en"\]\) h1/, 'Non-English languages must not override shared heading dimensions.');
assert.match(cssSource, /\.translation-toast \{ position: absolute; top: calc\(100% \+ \.55rem\); right: 0;/, 'Translation status must appear beside its language selector.');
assert.match(cssSource, /\.portal-top-bar \{\s+position: sticky;\s+top: 0;\s+z-index: 600;/, 'The sticky dashboard header must layer above Passbook filter controls.');
assert.match(cssSource, /\.passbook-filter-card:has\(.modern-select-container\.is-open\)[\s\S]*?z-index: 500 !important;/, 'Passbook dropdowns must remain below the shared dashboard header layer.');
