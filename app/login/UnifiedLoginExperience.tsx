'use client';

import { FormEvent, useState } from 'react';

type Role = 'employee' | 'employer' | 'pensioner';

const roleDetails = {
  employee: {
    label: 'Employee',
    identifierLabel: 'Demo UAN',
    identifier: 'DEMO-UAN-001',
    password: 'DEMO-EMPLOYEE-PASS',
    person: 'Member Demo 001',
    referenceLabel: 'Member reference',
    reference: 'DEMO-UAN-001',
    summaries: [
      ['Passbook', 'DEMO-BALANCE-001'],
      ['Latest contribution', 'DEMO-CONTRIBUTION-001'],
      ['Claim status', 'DEMO-CLAIM-STATUS'],
    ],
    tasks: [
      ['Passbook preview', 'Synthetic contribution history'],
      ['Claims and transfers', 'Simulated requests and status'],
      ['Profile and KYC', 'Synthetic verification overview'],
      ['Nomination', 'Guidance-only preview'],
    ],
  },
  employer: {
    label: 'Employer',
    identifierLabel: 'Demo establishment ID',
    identifier: 'DEMO-EST-001',
    password: 'DEMO-EMPLOYER-PASS',
    person: 'Establishment Demo 001',
    referenceLabel: 'Establishment reference',
    reference: 'DEMO-EST-001',
    summaries: [
      ['ECR status', 'DEMO-ECR-STATUS'],
      ['Employee records', 'DEMO-COUNT-001'],
      ['Payment receipt', 'DEMO-RECEIPT-001'],
    ],
    tasks: [
      ['ECR and challans', 'Simulated filing workspace'],
      ['Employee lifecycle', 'Demo enrolment and exit records'],
      ['Payments and receipts', 'Synthetic payment history'],
      ['Compliance overview', 'Demonstration status only'],
    ],
  },
  pensioner: {
    label: 'Pensioner',
    identifierLabel: 'Demo PPO',
    identifier: 'DEMO-PPO-001',
    password: 'DEMO-PENSIONER-PASS',
    person: 'Pensioner Demo 001',
    referenceLabel: 'Pension reference',
    reference: 'DEMO-PPO-001',
    summaries: [
      ['Pension payment', 'DEMO-PAYMENT-STATUS'],
      ['Life certificate', 'DEMO-DLC-STATUS'],
      ['Payee bank', 'DEMO-BANK-001'],
    ],
    tasks: [
      ['Pension payments', 'Synthetic payment overview'],
      ['PPO details', 'Impossible-format PPO fixture'],
      ['Life certificate', 'Simulated Jeevan Pramaan status'],
      ['Pension support', 'Public guidance preview'],
    ],
  },
} as const;

export default function UnifiedLoginExperience() {
  const [role, setRole] = useState<Role>('employee');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [signedIn, setSignedIn] = useState(false);
  const [message, setMessage] = useState('');
  const detail = roleDetails[role];

  function chooseRole(nextRole: Role) {
    setRole(nextRole);
    setIdentifier('');
    setPassword('');
    setMessage('');
    setSignedIn(false);
  }

  function useDemoDetails() {
    setIdentifier(detail.identifier);
    setPassword(detail.password);
    setMessage('Synthetic demo details filled. Nothing has been sent.');
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (identifier === detail.identifier && password === detail.password) {
      setSignedIn(true);
      setMessage('Simulated sign-in complete. No session or EPFO account was created.');
      return;
    }

    setMessage(`Demo details do not match. Use ${detail.identifier} and ${detail.password}. Nothing was sent.`);
  }

  if (signedIn) {
    return (
      <section className="demo-dashboard notranslate" translate="no" aria-labelledby="dashboard-heading">
        <div className="prototype-boundary"><b>Prototype — synthetic data only.</b><span>Simulated {detail.label.toLowerCase()} dashboard · no live account or backend session</span></div>
        <div className="dashboard-heading-row">
          <div><p className="eyebrow">{detail.label} workspace</p><h2 id="dashboard-heading">Welcome, {detail.person}</h2><p>{detail.referenceLabel}: <span className="notranslate" translate="no">{detail.reference}</span></p></div>
          <button type="button" className="button secondary" onClick={() => { setSignedIn(false); setPassword(''); setMessage('Simulated session ended.'); }}>End simulated session</button>
        </div>
        <div className="dashboard-summary-grid">
          {detail.summaries.map(([label, value]) => <article key={label}><small>{label}</small><strong className="notranslate" translate="no">{value}</strong><span>Synthetic fixture</span></article>)}
        </div>
        <div className="dashboard-task-grid">
          {detail.tasks.map(([title, description]) => (
            <button type="button" key={title} onClick={() => setMessage(`Simulation only: ${title} will be designed in a later prototype slice.`)}>
              <span><strong>{title}</strong><small>{description}</small></span><i aria-hidden="true">→</i>
            </button>
          ))}
        </div>
        <p className="login-message" role="status" aria-live="polite">{message}</p>
      </section>
    );
  }

  return (
    <section className="unified-login-shell notranslate" translate="no" aria-labelledby="role-login-heading">
      <div className="prototype-boundary"><b>Prototype — synthetic data only.</b><span>No identifier, password, OTP or personal data leaves this page.</span></div>
      <div className="login-role-tabs" role="tablist" aria-label="Choose account role">
        {(Object.keys(roleDetails) as Role[]).map((roleName) => (
          <button key={roleName} type="button" role="tab" id={`${roleName}-tab`} aria-selected={role === roleName} aria-controls="role-login-panel" onClick={() => chooseRole(roleName)}>{roleDetails[roleName].label}</button>
        ))}
      </div>
      <div className="login-panel" id="role-login-panel" role="tabpanel" aria-labelledby={`${role}-tab`}>
        <div className="login-form-copy">
          <p className="eyebrow">{detail.label} access</p>
          <h2 id="role-login-heading">{detail.label} sign in</h2>
          <p>Enter the visible synthetic details or fill them automatically. This demonstrates the future journey only.</p>
          <div className="demo-credential-card">
            <small>Demo details</small>
            <code className="notranslate" translate="no">{detail.identifier}</code>
            <code className="notranslate" translate="no">{detail.password}</code>
            <button type="button" onClick={useDemoDetails}>Use synthetic demo details</button>
          </div>
        </div>
        <form className="login-form" onSubmit={submit} noValidate>
          <label htmlFor="demo-identifier">{detail.identifierLabel}</label>
          <input id="demo-identifier" name="demo-identifier" value={identifier} onChange={(event) => setIdentifier(event.target.value)} autoComplete="off" spellCheck="false" required />
          <label htmlFor="demo-password">Demo password</label>
          <input id="demo-password" name="demo-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="off" required />
          <button className="button primary" type="submit">Enter simulated dashboard <span aria-hidden="true">→</span></button>
          <p className="login-message" role="status" aria-live="polite">{message}</p>
          <div className="login-security-note"><b>Production authentication is not implemented.</b><span>Passkeys, MFA, recovery, server-side authorization and sensitive-action reauthentication require approved identity and security design.</span></div>
        </form>
      </div>
    </section>
  );
}
