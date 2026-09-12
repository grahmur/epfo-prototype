import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteFooter, SiteHeader } from '../SiteChrome';
import BlogExplorer from './BlogExplorer';
import { CMS_SITE_KEY, getPosts, isMuritConfigured, MuritPostSummary } from './muritClient';

export const metadata: Metadata = {
  title: 'Articles & Updates',
  description:
    'Official updates, educational guides, circular explainers, and digital service notifications for employees, employers, and pensioners.',
};

export const revalidate = 60;

// High-quality starter educational articles for EPFO services
// Displayed when no posts have been published in Murit CMS yet.
const sampleStarterPosts: MuritPostSummary[] = [
  {
    id: 'sample-1',
    title: 'Understanding Advance EPF Withdrawal (Form 31): Grounds and Limits',
    slug: 'understanding-form-31-advance',
    excerpt: 'Comprehensive guidance on permissible withdrawal grounds including medical illness, marriage, education, and housing advances.',
    publishedAt: '2026-09-10T10:00:00.000Z',
    categories: [{ name: 'Employees', slug: 'employees' }],
    tags: [{ name: 'Form 31', slug: 'form-31' }, { name: 'Advance', slug: 'advance' }],
    featuredMedia: {
      url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
      alt: 'Financial security and documentation',
    },
  },
  {
    id: 'sample-2',
    title: 'Step-by-Step Guide: Digital Life Certificate (Jeevan Pramaan) Submission',
    slug: 'digital-life-certificate-guide',
    excerpt: 'How pensioners can generate and submit their annual digital life certificates using face authentication from Android smartphones.',
    publishedAt: '2026-09-08T09:30:00.000Z',
    categories: [{ name: 'Pensioners', slug: 'pensioners' }],
    tags: [{ name: 'Jeevan Pramaan', slug: 'jeevan-pramaan' }, { name: 'Face Auth', slug: 'face-auth' }],
    featuredMedia: {
      url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
      alt: 'Digital pensioner services',
    },
  },
  {
    id: 'sample-3',
    title: 'Revamped ECR Compliance: How Employers Avoid Reconciliation Delays',
    slug: 'revamped-ecr-employer-compliance',
    excerpt: 'Key reminders for establishment administrators when generating Electronic Challan cum Return files and verifying member wage sheets.',
    publishedAt: '2026-09-05T14:15:00.000Z',
    categories: [{ name: 'Employers', slug: 'employers' }],
    tags: [{ name: 'ECR', slug: 'ecr' }, { name: 'Challan', slug: 'challan' }],
    featuredMedia: {
      url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      alt: 'Corporate compliance records',
    },
  },
  {
    id: 'sample-4',
    title: 'Seamless UAN and Aadhaar Seeding for Instant Online Claim Settlement',
    slug: 'uan-aadhaar-linking-guide',
    excerpt: 'Demystifying demographic mismatch verification and ensuring your active mobile number receives statutory OTP notifications.',
    publishedAt: '2026-09-01T11:00:00.000Z',
    categories: [{ name: 'Employees', slug: 'employees' }],
    tags: [{ name: 'UAN', slug: 'uan' }, { name: 'KYC', slug: 'kyc' }],
    featuredMedia: {
      url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
      alt: 'Digital identity verification',
    },
  },
  {
    id: 'sample-5',
    title: 'A Clear Primer on EPS 95 Pension Calculations and Service Accrual',
    slug: 'pension-calculation-eps-95',
    excerpt: 'How past service periods, pensionable salary caps, and continuous employment determine monthly pension entitlement.',
    publishedAt: '2026-08-28T08:45:00.000Z',
    categories: [{ name: 'Pensioners', slug: 'pensioners' }],
    tags: [{ name: 'EPS 95', slug: 'eps-95' }, { name: 'Calculations', slug: 'calculations' }],
    featuredMedia: {
      url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
      alt: 'Pension documentation and calculation',
    },
  },
  {
    id: 'sample-6',
    title: 'Why E-Nomination is Crucial: Ensuring Social Security for Nominees',
    slug: 'nomination-efiling-benefits',
    excerpt: 'Submitting digital nomination records with Aadhaar photo e-sign ensures smooth disbursal of accumulated PF and EDLI insurance.',
    publishedAt: '2026-08-22T13:20:00.000Z',
    categories: [{ name: 'Employees', slug: 'employees' }],
    tags: [{ name: 'e-Nomination', slug: 'e-nomination' }, { name: 'EDLI', slug: 'edli' }],
    featuredMedia: {
      url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
      alt: 'Family social security planning',
    },
  },
  {
    id: 'sample-7',
    title: 'How to Transfer PF Balance Seamlessly When Switching Establishments',
    slug: 'transfer-pf-previous-establishment',
    excerpt: 'Using the Unified Member Portal to initiate One Member One EPF Account online transfers without physical paperwork.',
    publishedAt: '2026-08-15T15:00:00.000Z',
    categories: [{ name: 'Employees', slug: 'employees' }],
    tags: [{ name: 'PF Transfer', slug: 'pf-transfer' }, { name: 'Unified Portal', slug: 'unified-portal' }],
    featuredMedia: {
      url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      alt: 'Employment transition and account transfer',
    },
  },
  {
    id: 'sample-8',
    title: 'Navigating EDLI and Death Benefit Claims: Required Documentation',
    slug: 'death-claim-nominee-settlement',
    excerpt: 'Detailed checklist for legal heirs and registered nominees seeking financial assistance under the Employees Deposit Linked Insurance Scheme.',
    publishedAt: '2026-08-08T10:10:00.000Z',
    categories: [{ name: 'Statutory', slug: 'statutory' }],
    tags: [{ name: 'EDLI', slug: 'edli' }, { name: 'Nominee', slug: 'nominee' }],
    featuredMedia: {
      url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
      alt: 'Legal documentation and claims',
    },
  },
  {
    id: 'sample-9',
    title: 'EPFiGMS: Escalation Timelines and Tracking Your Grievance Online',
    slug: 'epfo-grievance-redressal-epfigms',
    excerpt: 'How to file, register, and monitor status updates on the Central Grievance Redressal system with unique registration numbers.',
    publishedAt: '2026-08-01T12:00:00.000Z',
    categories: [{ name: 'Services', slug: 'services' }],
    tags: [{ name: 'EPFiGMS', slug: 'epfigms' }, { name: 'Grievance', slug: 'grievance' }],
    featuredMedia: {
      url: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80',
      alt: 'Citizen support and grievance management',
    },
  },
];

export default async function BlogIndexPage() {
  const configured = isMuritConfigured();
  const remotePosts = await getPosts({ limit: 20 });

  // If Murit CMS has published posts, display them; otherwise provide the 9 starter articles
  const posts = remotePosts.length > 0 ? remotePosts : sampleStarterPosts;

  return (
    <>
      <SiteHeader />
      <main id="main" className="interior-main">
        <section className="interior-hero">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Blog & Updates</span>
          </nav>
          <p className="eyebrow">Newsroom & Publications</p>
          <h1>Articles & Updates</h1>
          <p>
            Stay informed with the latest explainers, statutory circulars, operational guidelines, and digital service updates.
          </p>
        </section>

        <div className="interior-layout" style={{ display: 'block', maxWidth: '1160px', margin: '0 auto', padding: '0 1.5rem 4rem' }}>
          {/* Status strip explaining connection to Murit CMS */}
          <div
            style={{
              padding: '0.85rem 1.25rem',
              backgroundColor: 'var(--cream, #f4eadf)',
              borderRadius: '0.75rem',
              border: '1px solid var(--line, #ded7cc)',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
              fontSize: '0.875rem',
              color: 'var(--ink, #4b312d)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: configured ? '#10b981' : '#f59e0b' }} />
              <span>
                {configured
                  ? `Live Murit CMS Sync Active (Site: ${CMS_SITE_KEY}). Articles update on-demand with zero rebuilds.`
                  : 'Plug-and-play Murit CMS Ready. Showing preview articles. Add CMS_SITE_KEY to stream live posts.'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a
                href="https://murit.space/admin"
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--orange-dark, #b84e11)', fontWeight: 700, textDecoration: 'none' }}
              >
                Open Murit Admin &#8599;
              </a>
              <span style={{ color: 'var(--line, #ded7cc)' }}>|</span>
              <a
                href="https://murit.space/docs"
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--muted, #71635f)', textDecoration: 'none' }}
              >
                API Docs &#8599;
              </a>
            </div>
          </div>

          {/* Interactive Explorer with Category filters, Drawer, and View More button */}
          <BlogExplorer posts={posts} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
