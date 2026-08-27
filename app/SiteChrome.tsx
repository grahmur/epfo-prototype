import LanguageSelector from './LanguageSelector';
import { isExternal, navigation, primaryDestinations } from './siteNavigation';

const navigationCardDetails: Record<string, { icon: string; description: string }> = {
  'About EPFO': { icon: '◎', description: 'Mission, schemes and organisation.' },
  Directory: { icon: '⌖', description: 'Office and contact-reference information.' },
  Services: { icon: '✦', description: 'Find services for your role.' },
  'Grievance redressal': { icon: '!', description: 'Use the official grievance route.' },
  'Shram Suvidha portal': { icon: '▤', description: 'Official employer compliance handoff.' },
  'Pension enquiry': { icon: '₹', description: 'Pension-payment information portal.' },
  'Jeevan Pramaan': { icon: '✓', description: 'Digital life-certificate guidance.' },
  'EPF & MP Act 1952': { icon: '§', description: 'The statutory framework.' },
  'EPF Scheme': { icon: '◫', description: 'Provident-fund scheme information.' },
  'Resources overview': { icon: '▤', description: 'Guidance, records and publications.' },
  Publications: { icon: '◉', description: 'Browse EPFO publications.' },
  Recruitments: { icon: '⌂', description: 'Current recruitment information.' },
  'Tenders/notices': { icon: '≡', description: 'Tenders and public notices.' },
};

function DestinationLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  const external = isExternal(href);

  return <a className={className} href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>{children}</a>;
}

export function SiteHeader() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to main content</a>
      <div className="utility-bar">
        <span className="notranslate" translate="no">Prototype — synthetic data only.</span>
        <div className="utility-actions">
          <nav className="utility-links" aria-label="Support shortcuts">
            <DestinationLink href="/grievance">Grievance redressal <span aria-hidden="true">→</span></DestinationLink>
            <DestinationLink href="/locate-epfo-office">Find an EPFO office <span aria-hidden="true">→</span></DestinationLink>
            <DestinationLink href="/contact-us">Contact us <span aria-hidden="true">→</span></DestinationLink>
            <DestinationLink href="https://www.epfo.gov.in/faq-epfo/">Official FAQs <span aria-hidden="true">↗</span></DestinationLink>
          </nav>
          <LanguageSelector />
        </div>
      </div>
      <header className="site-header">
        <a className="brand" href="/" aria-label="EPFO prototype home">
          <span className="brand-mark" aria-hidden="true">EP</span>
          <span><b>EPFO</b><small>Employees’ Provident Fund Organisation</small></span>
        </a>
        <nav aria-label="Primary navigation">
          {navigation.map((group) => (
            <div key={group.title} className="nav-menu">
              <a className="nav-trigger" href={primaryDestinations[group.title]} aria-haspopup="true">{group.title}<span className="nav-chevron" aria-hidden="true">⌄</span></a>
              <div className="nav-popover">
                <div className="nav-popover-head"><p>{group.title}</p><small>Key services and information</small></div>
                <div className="nav-featured-links">
                  {group.links.slice(0, group.links.length <= 3 ? group.links.length : 2).map(([label, href]) => {
                    const detail = navigationCardDetails[label] ?? { icon: '→', description: `Explore this ${group.title.toLowerCase()} route.` };

                    return <DestinationLink key={label} className="nav-featured-link" href={href}>
                      <span className="nav-featured-icon" aria-hidden="true">{detail.icon}</span>
                      <span className="nav-featured-copy"><strong>{label}</strong><small>{detail.description}</small></span>
                      <span className="nav-featured-arrow" aria-hidden="true">{isExternal(href) ? '↗' : '→'}</span>
                    </DestinationLink>;
                  })}
                </div>
                {group.links.length > 3 && <div className="nav-compact-links">
                  {group.links.slice(2).map(([label, href]) => <DestinationLink key={label} href={href}>{label}<span aria-hidden="true">{isExternal(href) ? '↗' : '→'}</span></DestinationLink>)}
                </div>}
              </div>
            </div>
          ))}
        </nav>
        <div className="header-actions" aria-label="Service access">
          <a className="header-action search-action" href="/#services" aria-label="Search services — simulated navigation" title="Search services"><span className="search-icon" aria-hidden="true" /></a>
        </div>
      </header>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer>
      <div className="footer-brand"><span className="brand-mark" aria-hidden="true">EP</span><div><b>Employees’ Provident Fund Organisation</b><p><span className="notranslate" translate="no">Prototype — synthetic data only.</span> Not an official transactional service.</p></div></div>
      <div className="social" aria-label="Official EPFO social channels">
        <a href="https://x.com/officialepfo" target="_blank" rel="noreferrer">X <span className="sr-only">official EPFO, opens in new tab</span></a>
        <a href="https://www.youtube.com/socialepfo" target="_blank" rel="noreferrer">YouTube <span className="sr-only">official EPFO, opens in new tab</span></a>
        <a href="https://www.instagram.com/social_epfo/" target="_blank" rel="noreferrer">Instagram <span className="sr-only">official EPFO, opens in new tab</span></a>
        <a href="https://www.facebook.com/socialepfo/" target="_blank" rel="noreferrer">Facebook <span className="sr-only">official EPFO, opens in new tab</span></a>
      </div>
      <div className="footer-links">
        <a href="https://www.epfo.gov.in/privacy-policy" target="_blank" rel="noreferrer">Privacy policy ↗</a>
        <a href="https://www.epfo.gov.in/terms-of-use" target="_blank" rel="noreferrer">Terms & conditions ↗</a>
        <a href="https://www.epfo.gov.in/epfo-sitemap/" target="_blank" rel="noreferrer">Official sitemap ↗</a>
      </div>
    </footer>
  );
}
