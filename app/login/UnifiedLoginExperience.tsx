'use client';

import { FormEvent, useEffect, useState, useSyncExternalStore } from 'react';
import LanguageSelector from '../LanguageSelector';
import MemberDashboard, { RoleDashboardPreview } from './MemberDashboard';
import { dashboardSessionRoleKey } from './dashboardSession';

type Role = 'employee' | 'employer' | 'pensioner';

type UnifiedLoginExperienceProps = {
  initialDashboardRole?: string;
  initialTranslationLanguage?: string;
};

type HindiLoginCopy = {
  identifierLabel: string;
  identifierPlaceholder: string;
  secretLabel: string;
  secretPlaceholder: string;
};

const captchaSamples = ['7M4WR', 'K9X2P', 'B4T8N', 'R6V3Y', 'H2P9D', 'W8K5M', '3Q9LT', 'D5N8Z'];

const hindiLoginCopy: Record<Role, HindiLoginCopy> = {
  employee: {
    identifierLabel: 'यूनिवर्सल अकाउंट नंबर (UAN)',
    identifierPlaceholder: 'अपना बारह अंकों का UAN दर्ज करें',
    secretLabel: 'अकाउंट Password',
    secretPlaceholder: 'अपना Password दर्ज करें',
  },
  employer: {
    identifierLabel: 'एस्टैब्लिशमेंट ID',
    identifierPlaceholder: 'कृपया अपना Establishment ID दर्ज करें',
    secretLabel: 'एस्टैब्लिशमेंट Password',
    secretPlaceholder: 'अपना Establishment Password दर्ज करें',
  },
  pensioner: {
    identifierLabel: 'पेंशन भुगतान आदेश (PPO नंबर)',
    identifierPlaceholder: 'अपना PPO नंबर दर्ज करें',
    secretLabel: 'जीवन प्रमाण ID (DLC) / जन्म तिथि',
    secretPlaceholder: 'DLC ID या DD/MM/YYYY दर्ज करें',
  },
};

function subscribeToLanguageChange(callback: () => void) {
  document.addEventListener('epfo-language-change', callback);
  return () => document.removeEventListener('epfo-language-change', callback);
}

function currentDocumentLanguage() {
  return document.documentElement.lang || 'en';
}

const roleDetails = {
  employee: {
    shortLabel: 'Employee',
    icon: '👤',
    identifierLabel: 'Universal Account Number (UAN)',
    identifierPlaceholder: 'Enter your 12-digit UAN',
    identifierDefault: 'DEMO-UAN-001',
    hasPassword: true,
    secretLabel: 'Account Password',
    secretPlaceholder: 'Enter your password',
    secretDefault: 'DEMO-EMPLOYEE-PASS',
    submitText: 'Login to Member Portal',
    person: 'MEMBER DEMO 001',
  },
  employer: {
    shortLabel: 'Employer',
    icon: '🏢',
    identifierLabel: 'Establishment Username / ID',
    identifierPlaceholder: 'Enter establishment ID',
    identifierDefault: 'DEMO-EST-001',
    hasPassword: true,
    secretLabel: 'Establishment Password',
    secretPlaceholder: 'Enter establishment password',
    secretDefault: 'DEMO-EMPLOYER-PASS',
    submitText: 'Login to Employer Portal',
    person: 'DEMO ENTERPRISES PVT LTD',
  },
  pensioner: {
    shortLabel: 'Pensioner',
    icon: '🎖️',
    identifierLabel: 'Pension Payment Order (PPO Number)',
    identifierPlaceholder: 'Enter PPO number',
    identifierDefault: 'DEMO-PPO-001',
    hasPassword: false,
    secretLabel: 'Jeevan Pramaan ID (DLC) / Date of Birth',
    secretPlaceholder: 'Enter DLC ID or DD/MM/YYYY',
    secretDefault: 'DEMO-DLC-001',
    submitText: 'View Pension & DLC Status',
    person: 'RAMESH CHANDER (PENSIONER DEMO 001)',
  },
} as const;

export default function UnifiedLoginExperience({ initialDashboardRole, initialTranslationLanguage }: UnifiedLoginExperienceProps) {
  const restoresDashboard = initialDashboardRole === 'employee' || initialDashboardRole === 'employer' || initialDashboardRole === 'pensioner';
  const restoredRole = restoresDashboard ? initialDashboardRole : 'employee';
  const [role, setRole] = useState<Role>(restoredRole);
  const [identifier, setIdentifier] = useState('');
  const [secret, setSecret] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaIndex, setCaptchaIndex] = useState(0);

  // Authentication step state: 'credentials' | 'otp' | 'dashboard'
  const [authStep, setAuthStep] = useState<'credentials' | 'otp' | 'dashboard'>(restoresDashboard ? 'dashboard' : 'credentials');
  const [otpValues, setOtpValues] = useState<string[]>(['0', '0', '0', '0', '0', '0']);
  const [message, setMessage] = useState('');
  const isHydrated = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const language = useSyncExternalStore(
    subscribeToLanguageChange,
    currentDocumentLanguage,
    () => 'en',
  );

  const detail = roleDetails[role];
  const localizedCopy = language === 'hi' ? hindiLoginCopy[role] : null;
  const currentCaptcha = captchaSamples[captchaIndex];

  useEffect(() => {
    if (authStep !== 'dashboard') return;

    let idleTimer = window.setTimeout(endForInactivity, 120_000);
    const activityEvents = ['pointerdown', 'pointermove', 'keydown', 'scroll', 'touchstart'] as const;
    function resetIdleTimer() {
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(endForInactivity, 120_000);
    }
    function endForInactivity() {
      document.cookie = `${dashboardSessionRoleKey}=; Max-Age=0; path=/; SameSite=Lax`;
      setAuthStep('credentials');
      setSecret('');
      setMessage('Simulated session ended after two minutes of inactivity.');
    }

    activityEvents.forEach((eventName) => window.addEventListener(eventName, resetIdleTimer, { passive: true }));
    return () => {
      window.clearTimeout(idleTimer);
      activityEvents.forEach((eventName) => window.removeEventListener(eventName, resetIdleTimer));
    };
  }, [authStep]);

  function chooseRole(nextRole: Role) {
    setRole(nextRole);
    setIdentifier('');
    setSecret('');
    setCaptchaInput('');
    setMessage('');
    setAuthStep('credentials');
  }

  function refreshCaptcha() {
    setCaptchaIndex((prev) => (prev + 1) % captchaSamples.length);
    setCaptchaInput('');
  }

  function handleCredentialsSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const effectiveId = identifier.trim();
    const effectiveSecret = secret.trim();
    const effectiveCaptcha = captchaInput.trim().toUpperCase();

    if (
      effectiveId === detail.identifierDefault
      && effectiveSecret === detail.secretDefault
      && effectiveCaptcha === currentCaptcha
    ) {
      setAuthStep('otp');
      setOtpValues(['0', '0', '0', '0', '0', '0']);
      setMessage('');
      return;
    }

    setMessage(`Please use demo credentials: ${detail.identifierDefault}, ${detail.secretDefault}, and code ${currentCaptcha}.`);
  }

  function handleOtpChange(index: number, val: string) {
    const clean = val.replace(/\D/g, '').slice(-1);
    const updated = [...otpValues];
    updated[index] = clean;
    setOtpValues(updated);

    if (clean && index < 5) {
      const nextInput = document.getElementById(`otp-box-${index + 1}`);
      nextInput?.focus();
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      const prevInput = document.getElementById(`otp-box-${index - 1}`);
      prevInput?.focus();
    }
  }

  function handleOtpSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (otpValues.join('') !== '000000') {
      setMessage('Please enter synthetic demo OTP 000000.');
      return;
    }
    document.cookie = `${dashboardSessionRoleKey}=${role}; path=/; SameSite=Lax`;
    setAuthStep('dashboard');
    setMessage('');
  }

  if (authStep === 'dashboard') {
    const endSession = () => {
      setAuthStep('credentials');
      setSecret('');
      setMessage('Simulated session ended.');
      document.cookie = `${dashboardSessionRoleKey}=; Max-Age=0; path=/; SameSite=Lax`;
    };

    if (role === 'employee') {
      return <MemberDashboard onSignOut={endSession} initialTranslationLanguage={initialTranslationLanguage} />;
    }

    return (
      <RoleDashboardPreview
        role={role}
        displayName={detail.person}
        onSignOut={endSession}
        initialTranslationLanguage={initialTranslationLanguage}
      />
    );
  }

  // Standalone Full-Screen SaaS Split Experience (Showcase on Left, Sign-in on Right)
  return (
    <div className="standalone-login-viewport">
      {/* Extreme Top-Left Brand Logo */}
      <header className="standalone-outer-header">
        <a href="/" className="outer-logo-link" title="Return to EPFO Portal Home">
          <div className="outer-logo-badge">
            <span className="outer-logo-emblem">🇮🇳</span>
          </div>
          <div className="outer-brand-text">
            <strong>EPFO Digital</strong>
            <span>Social Security Portal</span>
          </div>
        </a>
        <div className="standalone-header-actions">
          <span className="standalone-prototype-label notranslate" translate="no">Prototype — synthetic data only.</span>
          <LanguageSelector />
        </div>
      </header>

      {/* Main Centered Login Section Frame (Lowered on screen) */}
      <div className="standalone-login-frame">
        {/* Floating Back to Website Button aligned with Top Edge of Login Section */}
        <a href="/" className="login-card-back-btn" title="Return to EPFO Portal Home">
          <span aria-hidden="true">←</span>
          <span>Back to Website</span>
        </a>

        {/* Main Rounded Login Container */}
        <main className="standalone-login-container" role="main">

        {/* Left Column: Rich Artwork Showcase with User-Supplied Photograph & Editorial Typography */}
        <section className="standalone-showcase-col" aria-label="Social security features showcase">
          <div
            className="showcase-artwork-wrap"
            role="img"
            aria-label="EPFO Universal Social Security Diagram showing UAN, EPF, EPS, and Pension coverage across the workforce"
          >
            <div className="showcase-artwork-gradient" />
          </div>

          <div className="showcase-card">
            {/* Bottom Scrim with Editorial Typography */}
            <div className="showcase-bottom-scrim">
              <div className="showcase-bottom-text">
                <h2>The easiest way to manage your social security.</h2>
                <p>
                  Serving over 6.5 Crore active members, 75 Lakh pensioners, and 7.8 Lakh establishments across India.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Dead-Centered Minimalist Authentication Form */}
        <section className="standalone-auth-col" aria-label="Sign in form">
          <div className="auth-form-card">
            {authStep === 'credentials' ? (
              <>
                <div className="auth-headline-block">
                  <h1>Log in to your account.</h1>
                  <p>Choose your account type and enter your universal credentials.</p>
                </div>

                {/* 3 Role Selection Tabs */}
                <div className="auth-role-tabs" role="tablist" aria-label="Select account role">
                  {(Object.keys(roleDetails) as Role[]).map((roleName) => {
                    const r = roleDetails[roleName];
                    return (
                      <button
                        key={roleName}
                        type="button"
                        role="tab"
                        id={`${roleName}-tab`}
                        aria-selected={role === roleName}
                        aria-controls="auth-form-panel"
                        onClick={() => chooseRole(roleName)}
                      >
                        <span className="tab-icon" aria-hidden="true">{r.icon}</span>
                        <span>{r.shortLabel}</span>
                      </button>
                    );
                  })}
                </div>

                <form className="login-form" method="post" onSubmit={handleCredentialsSubmit} noValidate>
                  {/* Field 1: Universal Identifier */}
                  <div className="auth-field-group">
                    <label htmlFor="user-identifier" className={localizedCopy ? 'notranslate' : undefined} translate={localizedCopy ? 'no' : 'yes'}>
                      {localizedCopy?.identifierLabel ?? detail.identifierLabel}
                    </label>
                    <div className="auth-input-wrapper">
                      <span className="field-prefix-icon" aria-hidden="true">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </span>
                      <input
                        id="user-identifier"
                        name="identifier"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder={localizedCopy?.identifierPlaceholder ?? detail.identifierPlaceholder}
                        className={localizedCopy ? 'notranslate' : undefined}
                        translate={localizedCopy ? 'no' : 'yes'}
                        autoComplete="off"
                        spellCheck="false"
                        required
                      />
                    </div>
                  </div>

                  {/* Field 2: Password or DLC Secret */}
                  <div className="auth-field-group">
                    <div className="field-label-row">
                      <label htmlFor="user-secret" className={localizedCopy ? 'notranslate' : undefined} translate={localizedCopy ? 'no' : 'yes'}>
                        {localizedCopy?.secretLabel ?? detail.secretLabel}
                      </label>
                      <a href="/#services" className="auth-forgot-link">
                        Forgot password?
                      </a>
                    </div>
                    <div className="auth-input-wrapper">
                      <span className="field-prefix-icon" aria-hidden="true">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </span>
                      <input
                        id="user-secret"
                        name="secret"
                        type={!detail.hasPassword ? 'text' : showSecret ? 'text' : 'password'}
                        value={secret}
                        onChange={(e) => setSecret(e.target.value)}
                        placeholder={localizedCopy?.secretPlaceholder ?? detail.secretPlaceholder}
                        className={localizedCopy ? 'notranslate' : undefined}
                        translate={localizedCopy ? 'no' : 'yes'}
                        autoComplete="off"
                        required
                      />
                      {detail.hasPassword && (
                        <button
                          type="button"
                          className="auth-password-toggle"
                          onClick={() => setShowSecret((prev) => !prev)}
                          aria-label={showSecret ? 'Hide password' : 'Show password'}
                        >
                          {showSecret ? '👁️' : '👁️‍🗨️'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Field 3: Visual Captcha */}
                  <div className="auth-field-group">
                    <label htmlFor="captcha-input" className={localizedCopy ? 'notranslate' : undefined} translate={localizedCopy ? 'no' : 'yes'}>
                      {localizedCopy ? 'सुरक्षा कोड' : 'Security Code'}
                    </label>
                    <div className="auth-captcha-wrapper">
                      <div className="auth-captcha-box" aria-label={`Captcha code: ${currentCaptcha}`}>
                        <span className="captcha-text notranslate" translate="no">{currentCaptcha}</span>
                        <span className="captcha-lines" aria-hidden="true" />
                      </div>
                      <button
                        type="button"
                        className="auth-captcha-reload"
                        onClick={refreshCaptcha}
                        title="Reload security code"
                        aria-label="Reload security code"
                      >
                        ⟳
                      </button>
                      <input
                        id="captcha-input"
                        name="captcha"
                        value={captchaInput}
                        onChange={(e) => setCaptchaInput(e.target.value)}
                        placeholder={localizedCopy ? 'सुरक्षा कोड दर्ज करें' : 'Enter Code'}
                        autoComplete="off"
                        spellCheck="false"
                        className={`captcha-entry-input${localizedCopy ? ' notranslate' : ''}`}
                        translate={localizedCopy ? 'no' : 'yes'}
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button className="auth-submit-btn" type="submit" disabled={!isHydrated}>
                    <span>{detail.submitText}</span>
                    <i aria-hidden="true">→</i>
                  </button>

                  {message && <p className="auth-form-message" role="status" aria-live="polite">{message}</p>}
                </form>
              </>
            ) : (
              /* Step 2: 2FA OTP Panel */
              <div className="auth-otp-screen">
                <button
                  type="button"
                  className="auth-otp-back"
                  onClick={() => setAuthStep('credentials')}
                >
                  ← Back to Credentials
                </button>

                <div className="auth-headline-block">
                  <h1>Two-Factor Verification</h1>
                  <p>
                    Enter the 6-digit security code dispatched to your registered Aadhaar mobile ending in <strong>••••9021</strong>.
                  </p>
                </div>

                <form className="auth-otp-form" method="post" onSubmit={handleOtpSubmit}>
                  <label htmlFor="otp-box-0" className="otp-boxes-label">Enter 6-Digit SMS Code</label>
                  <div className="auth-otp-boxes">
                    {otpValues.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-box-${idx}`}
                        name={`otp-${idx}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="auth-otp-input"
                        autoFocus={idx === 0}
                        required
                      />
                    ))}
                  </div>

                  <button className="auth-submit-btn" type="submit" disabled={!isHydrated}>
                    <span>Verify & Enter Portal</span>
                    <i aria-hidden="true">→</i>
                  </button>

                  <div className="auth-otp-resend">
                    <span>Didn&apos;t receive OTP?</span>
                    <button
                      type="button"
                      className="auth-resend-link"
                      onClick={() => setMessage('New simulated OTP code generated.')}
                    >
                      Resend SMS Code
                    </button>
                  </div>

                  {message && <p className="auth-form-message" role="status" aria-live="polite">{message}</p>}
                </form>
              </div>
            )}

            {/* Security Notice Footnote (Anchored at the bottom of the section) */}
            <div className="auth-security-footnote">
              <span className="shield-icon">🛡️</span>
              <span>Protected by 256-Bit SSL & Aadhaar-linked Two-Factor OTP.</span>
            </div>
          </div>
        </section>
      </main>
      </div>
    </div>
  );
}
