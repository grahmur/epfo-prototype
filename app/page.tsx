import { SiteFooter, SiteHeader } from './SiteChrome';
import { isExternal, navigation } from './siteNavigation';

const serviceGroups = [
  {
    id: 'employee-services',
    label: 'For employees',
    intro: 'Manage your account, contributions and claims.',
    services: [
      ['Activate UAN', 'Easily Activate your UAN to access EPF services online.', '✦'],
      ['View Passbook', 'Check your real-time EPF account balance and transaction history.', '₹'],
      ['Update KYC', 'Update your KYC details online such as Aadhaar, PAN & Bank details.', '✓'],
      ['Withdraw PF', 'Apply online for partial or full withdrawal of your PF amount.', '↙'],
      ['Know Your UAN', 'Know Your UAN anytime, anywhere online.', '?'],
      ['Online Claims & Transfer', 'Submit claim requests or transfer your EPF account online.', '⇄'],
      ['File Death Claim', 'Eligible nominees can claim in case of employee’s demise.', '♡'],
    ],
  },
  {
    id: 'employer-services',
    label: 'For employers',
    intro: 'Manage employees, filings and establishment records.',
    services: [
      ['UAN Management', 'Manage UANs of employees centrally.', '◎'],
      ['Submit ECR (Electronic Challan cum Return)', 'File monthly EPF challans and other details online.', '▤'],
      ['View/Download Payment Receipts & Certificate', 'Access EPF receipts and certificates instantly for audits and records.', '₹'],
      ['Employee Enrollment & Exit Management', 'Enroll or exit employees to keep EPF records updated in real-time.', '+'],
      ['Employer Registration', 'Register your organization under EPF & MP Act through online portal.', '⌂'],
      ['Download Forms & Circulars', 'Download forms, circulars, and notices from one centralized portal.', '≡'],
      ['Performance of Establishments', 'Check employer’s EPF compliance and contribution performance.', '↗'],
    ],
  },
  {
    id: 'pensioner-services',
    label: 'For pensioners',
    intro: 'Access pension, PPO and life-certificate services.',
    services: [
      ['Jeevan Pramaan (Life Certificate) Submission', 'Submit digital life certificate online without physical visits.', '✓'],
      ['View PPO (Pension Payment Order) Details', 'Access pension order details through the online portal.', '#'],
      ['Download Pensioner Forms & Circulars', 'Access and download pension-related documents.', '▤'],
    ],
  },
];

const videos = [
  ['Check EPF balance', 'Member · 1 minute', 'https://youtube.com/shorts/Ga7PrBr57pU?si=KjWumvGoyCGBvXsd'],
  ['Withdraw EPF', 'Member guide', 'https://www.youtube.com/watch?v=FZj2fHhrkpM'],
  ['Apply for pension', 'Pensioner guide', 'https://youtu.be/2SvXSJn9TzY?si=EC-Bf_ObAKTctiWP'],
  ['Submit ECR', 'Employer guide', 'https://youtu.be/1WIlhyvUNXs?si=F1BddxfLe3RTWkvn'],
  ['Employer registration', 'Employer guide', 'https://youtu.be/OYYnZvctNEY?si=0AaLj7liC13TEAcL'],
  ['Generate UAN', 'Member guide', 'https://www.youtube.com/watch?v=vw3k-w_3g1I&t=31s'],
  ['EPF advance', 'Member guide', 'https://www.youtube.com/watch?v=0OZ7ibyOyfQ'],
  ['Submit life certificate', 'Pensioner guide', 'https://www.youtube.com/watch?v=ZqG5K_0yca0'],
  ['Submit e-Nomination', 'Member guide', 'https://www.youtube.com/watch?v=YDi9SVLlzWw'],
];

function ServiceCard({ service }: { service: string[] }) {
  const [title, result, icon] = service;

  return (
    <article className="service-card">
      <div className="feature-heading"><span className="feature-icon" aria-hidden="true">{icon}</span><h3>{title}</h3></div>
      <p>{result}</p>
    </article>
  );
}

export default function Home() {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'EPFO service experience prototype',
    description: 'A synthetic, task-first prototype for finding EPFO services and understanding official handoffs.',
    inLanguage: ['en'],
  };

  return (
    <>
      <SiteHeader />

      <main id="main">
        <section className="hero">
          <div className="hero-copy">
            <h1>Your gateway to<br /><em>social security.</em></h1>
            <p className="hero-service-line">Provident Fund · Pension · Insurance Services</p>
            <p className="hero-intro">Access and manage EPF, pension, insurance and compliance services digitally—whether you are an employee tracking savings, an employer filing returns, or a pensioner or nominee accessing benefits.</p>
            <div className="hero-actions">
              <a className="button primary" href="#services">Find your service <span>→</span></a>
              <a className="button secondary" href="#how-it-works">How services work</a>
            </div>
            <p className="trust-note"><span aria-hidden="true">✓</span> Explore services without entering personal details</p>
          </div>
        </section>

        <section className="access-strip" aria-label="Official portal access">
          <div className="strip-logins">
            <small>Official portal access</small>
            <a className="strip-login employee" href="https://unifiedportal-mem.epfindia.gov.in/memberinterface/" target="_blank" rel="noreferrer" aria-label="Employee login — opens the current official member portal in a new tab">Employee login <span aria-hidden="true">↗</span></a>
            <a className="strip-login employer" href="https://unifiedportal-emp.epfindia.gov.in/epfo/" target="_blank" rel="noreferrer" aria-label="Employer login — opens the current official employer portal in a new tab">Employer login <span aria-hidden="true">↗</span></a>
          </div>
        </section>

        <section id="services" className="role-services section-shell" aria-labelledby="role-services-heading">
          <header className="role-section-heading">
            <p className="eyebrow">Services by role</p>
            <h2 id="role-services-heading">EPFO and You</h2>
            <p>Choose your role to explore the services available to you.</p>
          </header>
          <fieldset className="role-switcher">
            <legend className="sr-only">Choose your role</legend>
            <input className="role-tab-input" type="radio" name="service-role" id="role-employee" defaultChecked />
            <input className="role-tab-input" type="radio" name="service-role" id="role-employer" />
            <input className="role-tab-input" type="radio" name="service-role" id="role-pensioner" />
            <div className="role-tab-list">
              <label htmlFor="role-employee">For Employees</label>
              <label htmlFor="role-employer">For Employers</label>
              <label htmlFor="role-pensioner">For Pensioners</label>
            </div>
            <div className="role-panels">
              {serviceGroups.map((group) => (
                <section className="role-panel" data-role={group.id.replace('-services', '')} key={group.id}>
                  <h3 className="sr-only">{group.label}: {group.intro}</h3>
                  <div className="feature-grid">
                    {group.services.map((service) => <ServiceCard key={service[0]} service={service} />)}
                  </div>
                </section>
              ))}
            </div>
          </fieldset>
        </section>

        <section id="how-it-works" className="videos section-shell">
          <div className="section-heading-row">
            <div><p className="eyebrow">Learn before you act</p><h2>Official how-to videos.</h2></div>
            <a href="https://www.youtube.com/socialepfo" target="_blank" rel="noreferrer">Official EPFO YouTube <span aria-hidden="true">↗</span></a>
          </div>
          <p className="section-lede">Step-by-step guidance from EPFO’s official channel. Browse at your own pace—the row never auto-advances.</p>
          <div className="video-row" aria-label="EPFO how-to videos">
            {videos.map(([title, meta, href], index) => (
              <a className="video-card" href={href} target="_blank" rel="noreferrer" key={title}>
                <span className={`video-art video-art-${index % 3}`}><i aria-hidden="true">▶</i><small>Official video</small></span>
                <b>{title}</b><small>{meta} · Opens YouTube</small>
              </a>
            ))}
          </div>
        </section>

        <section className="about section-shell" id="about">
          <div className="about-copy">
            <p className="eyebrow light">About EPFO</p>
            <h2>Social security for India’s workforce.</h2>
            <p><b>Official:</b> EPFO was established in 1952 and administers provident fund, pension and insurance schemes for workers in the organised sector. Refer to current statutory guidance for applicable rules.</p>
            <a className="button pale" href="https://www.epfo.gov.in/about-us/" target="_blank" rel="noreferrer">Read the official About page <span>↗</span></a>
          </div>
          <div className="about-principles">
            <article><span>01</span><h3>Citizen-first</h3><p>Tasks and outcomes before organisation structure.</p></article>
            <article><span>02</span><h3>Trust by design</h3><p>Source, freshness and destination boundaries stay visible.</p></article>
            <article><span>03</span><h3>Inclusive access</h3><p>Keyboard, zoom, reduced motion and low-bandwidth needs are built in.</p></article>
            <article><span>04</span><h3>Safe to review</h3><p>No account, OTP, identifier, upload or live system action.</p></article>
          </div>
        </section>

        <section id="catalogue" className="catalogue section-shell">
          <div className="section-heading-row">
            <div><p className="eyebrow">Service directory</p><h2>Explore all EPFO resources.</h2></div>
            <p>External links open the current official destination in a new tab.</p>
          </div>
          <div className="catalogue-grid">
            {navigation.map((group) => (
              <article key={group.title}>
                <h3>{group.title}</h3>
                <ul>
                  {group.links.map(([label, href]) => (
                    <li key={label}><a href={href} target={isExternal(href) ? '_blank' : undefined} rel={isExternal(href) ? 'noreferrer' : undefined}>{label}<span aria-hidden="true">{isExternal(href) ? '↗' : '→'}</span></a></li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

      </main>

      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema).replace(/</g, '\\u003c') }} />
    </>
  );
}
