import LanguageSelector from './LanguageSelector';
import Link from 'next/link';
import { isExternal, navigation, primaryDestinations } from './siteNavigation';

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
          <LanguageSelector />
          <nav className="utility-links" aria-label="Support shortcuts">
            <DestinationLink href="https://epfigms.gov.in/">Grievance redressal <span aria-hidden="true">↗</span></DestinationLink>
            <DestinationLink href="/locate-epfo-office">Find an EPFO office <span aria-hidden="true">→</span></DestinationLink>
            <DestinationLink href="/contact-us">Contact us <span aria-hidden="true">→</span></DestinationLink>
            <DestinationLink href="https://www.epfo.gov.in/faq-epfo/">Official FAQs <span aria-hidden="true">↗</span></DestinationLink>
          </nav>
        </div>
      </div>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="EPFO prototype home">
          <span className="brand-mark" aria-hidden="true">EP</span>
          <span><b>EPFO</b><small>Employees’ Provident Fund Organisation</small></span>
        </Link>
        <nav aria-label="Primary navigation">
          {navigation.map((group) => (
            <div key={group.title} className="nav-menu">
              <a className="nav-trigger" href={primaryDestinations[group.title]} aria-haspopup="true">{group.title}<span className="nav-chevron" aria-hidden="true">⌄</span></a>
              <div className={`nav-popover ${group.links.length <= 3 ? 'nav-popover-featured' : 'nav-popover-expanded'}`}>
                <div className="nav-popover-head"><p>{group.title}</p><small>Explore {group.title.toLowerCase()} routes</small></div>
                <div className="nav-featured-links">
                  {group.links.slice(0, group.links.length <= 3 ? group.links.length : 2).map(([label, href], index) => (
                    <DestinationLink key={label} className="nav-featured-link" href={href}><small>{index === 0 ? 'Start here' : 'Featured route'}</small><strong>{label}</strong><span aria-hidden="true">{isExternal(href) ? '↗' : '→'}</span></DestinationLink>
                  ))}
                </div>
                {group.links.length > 3 && <div className="nav-compact-links">
                  {group.links.slice(2).map(([label, href]) => <DestinationLink key={label} href={href}>{label}<span aria-hidden="true">{isExternal(href) ? '↗' : '→'}</span></DestinationLink>)}
                </div>}
              </div>
            </div>
          ))}
        </nav>
        <div className="header-actions" aria-label="Service access">
          <Link className="header-action search-action" href="/#services" aria-label="Search services — simulated navigation" title="Search services"><span className="search-icon" aria-hidden="true" /></Link>
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
