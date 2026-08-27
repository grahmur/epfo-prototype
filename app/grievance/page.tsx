import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from '../SiteChrome';
import { GrievancePortal } from './GrievancePortal';

export const metadata: Metadata = {
  title: 'EPFiGMS — Online Grievance Redressal Portal | EPFO',
  description:
    'Lodge grievances, send reminders, and track resolution status on the official EPFO grievance redressal portal.',
};

export default function GrievancePage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="sg-page-canvas">
        <div className="sg-page-container">
          {/* Breadcrumb Navigation */}
          <nav className="sg-breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span aria-hidden="true">/</span>
            <a href="/contact-us">Support</a>
            <span aria-hidden="true">/</span>
            <span>Grievance Redressal</span>
          </nav>

          {/* Simple Clean Header on Top */}
          <div className="sg-page-header">
            <span className="sg-eyebrow">EPFiGMS Portal</span>
            <h1>Grievance Redressal & Support</h1>
            <p>
              Lodge complaints directly with the Regional Office, track investigation status in real-time, or dispatch escalation reminders.
            </p>
          </div>

          {/* Clean Simple Grievance Form Starts Directly After Header */}
          <GrievancePortal />

          {/* Simple Help Info Footer Strip */}
          <div className="sg-footer-help-strip">
            <div className="sg-help-item">
              <span className="sg-help-icon">⏱️</span>
              <div>
                <strong>Resolution SLA:</strong> 15 to 30 working days under Citizen&apos;s Charter.
              </div>
            </div>
            <div className="sg-help-item">
              <span className="sg-help-icon">📞</span>
              <div>
                <strong>Toll-Free Helpline:</strong> Call 14470 or 1800 118 005 for 24×7 assistance.
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
