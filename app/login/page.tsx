import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from '../SiteChrome';
import UnifiedLoginExperience from './UnifiedLoginExperience';

export const metadata: Metadata = {
  title: 'Unified sign in',
  description: 'Synthetic employee, employer and pensioner sign-in prototype. No EPFO account or production system is connected.',
};

export default function LoginPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="login-main">
        <header className="login-page-heading">
          <p className="eyebrow">One secure starting point</p>
          <h1>Sign in for your role.</h1>
          <p>Choose Employee, Employer or Pensioner. This approval prototype uses impossible-format demo details and never connects to an EPFO account.</p>
        </header>
        <UnifiedLoginExperience />
      </main>
      <SiteFooter />
    </>
  );
}
