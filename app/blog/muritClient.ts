export type MuritCategory = {
  name: string;
  slug: string;
};

export type MuritTag = {
  name: string;
  slug: string;
};

export type MuritMedia = {
  url: string;
  alt?: string | null;
  caption?: string | null;
  width?: number | null;
  height?: number | null;
};

export type MuritSeo = {
  title?: string | null;
  description?: string | null;
  socialImage?: {
    url?: string | null;
    alt?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
  canonicalURL?: string | null;
  keywords?: string | null;
};

export type MuritPostSummary = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  publishedAt: string;
  modifiedAt?: string | null;
  featuredMedia?: MuritMedia | null;
  categories?: MuritCategory[] | null;
  tags?: MuritTag[] | null;
  seo?: MuritSeo | null;
};

export type MuritPostDetail = MuritPostSummary & {
  contentHtml: string;
};

export type MuritPostsResponse = {
  data: MuritPostSummary[];
  meta?: {
    limit: number;
    nextCursor?: string | null;
  };
};

export type MuritSinglePostResponse = {
  data: MuritPostDetail;
};

export const CMS_BASE_URL = (
  process.env.CMS_BASE_URL ||
  process.env.NEXT_PUBLIC_CMS_BASE_URL ||
  'https://murit.space'
).replace(/\/+$/, '');

export const CMS_SITE_KEY =
  process.env.CMS_SITE_KEY ||
  process.env.NEXT_PUBLIC_CMS_SITE_KEY ||
  '';

/**
 * Checks whether Murit CMS is configured with a valid site key.
 */
export function isMuritConfigured(): boolean {
  return Boolean(CMS_SITE_KEY && CMS_SITE_KEY.trim().length > 0);
}

export const SAMPLE_POSTS: MuritPostDetail[] = [
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
    contentHtml: `
      <p>Under the Employees' Provident Funds Scheme, 1952, members have the provision to avail non-refundable advances (commonly referred to as partial withdrawals) under Form 31 for specific life milestones and contingencies.</p>
      <h2>Common Permissible Grounds</h2>
      <ul>
        <li><strong>Illness / Medical Emergency:</strong> For self or dependent treatment involving major surgery or prolonged hospitalisation. No minimum service period is required.</li>
        <li><strong>Marriage of Self, Son, Daughter, or Sibling:</strong> Requires completion of 7 years of contributory service. Up to 50% of the employee share with interest can be withdrawn.</li>
        <li><strong>Post-Matriculation Education of Children:</strong> Requires completion of 7 years of service, allowing up to 50% of employee contributions.</li>
        <li><strong>Purchase or Construction of House:</strong> Requires completion of 5 years of service under paragraph 68B of the Scheme.</li>
      </ul>
      <h2>Online Filing Checklist</h2>
      <p>Before submitting Form 31 through the Unified Member Portal, ensure that:</p>
      <ol>
        <li>Your Universal Account Number (UAN) is active.</li>
        <li>Aadhaar is linked and verified against your active mobile number.</li>
        <li>Bank account details along with IFSC are digitally approved and verified.</li>
      </ol>
      <blockquote>Note: EPF advances do not attract income tax deductions and are directly deposited into the member's verified bank account via NEFT.</blockquote>
    `,
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
    contentHtml: `
      <p>EPS 1995 pensioners are required to submit an annual Digital Life Certificate (Jeevan Pramaan) to ensure uninterrupted disbursement of their monthly pension. The biometric face-authentication facility eliminates the need to visit bank branches or EPFO offices in person.</p>
      <h2>Prerequisites for Smartphone Submission</h2>
      <ul>
        <li>An Android smartphone with camera (5MP or higher) and internet connection.</li>
        <li>Aadhaar Face RD Service App (UIDAI) installed from the Google Play Store.</li>
        <li>Jeevan Pramaan Face Application installed on the handset.</li>
        <li>Pension Payment Order (PPO) number, pension disbursing agency name, and bank account number.</li>
      </ul>
      <h2>Submission Steps</h2>
      <ol>
        <li>Open the Jeevan Pramaan App and complete one-time operator authentication using your Aadhaar.</li>
        <li>Enter the pensioner's details: 12-digit Aadhaar, PPO Number, Agency, and Mobile Number.</li>
        <li>Align the pensioner's face in the camera frame with adequate lighting. Blink when prompted by the UIDAI software.</li>
        <li>Upon successful biometric match, a Pramaan ID reference is generated and sent via SMS.</li>
      </ol>
      <blockquote>A Digital Life Certificate remains valid for exactly 12 months from the date of submission.</blockquote>
    `,
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
    contentHtml: `
      <p>The Electronic Challan cum Return (ECR) mechanism streamlines monthly EPF, EPS, and EDLI remittance by employers. Accurate file formatting and member master reconciliation protect establishments from interest penalties under Section 7Q and damages under Section 14B.</p>
      <h2>Key Best Practices for Filing</h2>
      <ul>
        <li><strong>Ensure Active UAN for Every Employee:</strong> Do not upload blank or unseeded UAN entries in the text-delimited ECR file.</li>
        <li><strong>Validate Wage Ceilings:</strong> Ensure statutory wage components adhere to the ₹15,000 statutory limit unless the employee and employer have opted for joint declarations.</li>
        <li><strong>Reconcile Non-Contributory Period (NCP) Days:</strong> Accurate calculation of NCP days prevents discrepancies in pension service accruals.</li>
      </ul>
      <blockquote>Monthly statutory dues must be remitted by the 15th of each month for the preceding wage period.</blockquote>
    `,
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
    contentHtml: `
      <p>Online service delivery in EPFO relies fundamentally on the Universal Account Number (UAN) seeded with Aadhaar and verified bank details. A single mismatch in name spelling, date of birth, or gender can prevent automated online claim settlement.</p>
      <h2>How to Correct Demographic Details</h2>
      <p>If you encounter a mismatch between EPFO records and UIDAI Aadhaar data, submit a Joint Declaration request through the Member Interface under the 'Manage' tab. Your employer must digitally sign the modification using DSC or e-Sign before field office approval.</p>
    `,
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
    contentHtml: `
      <p>Monthly pension under the Employees' Pension Scheme, 1995 is computed using the formula:</p>
      <pre><code>Monthly Pension = (Pensionable Salary × Pensionable Service) / 70</code></pre>
      <p>Pensionable service includes contributory service rendered after 15 November 1995. Members who have completed at least 20 years of contributory service receive a bonus of 2 additional years.</p>
    `,
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
    contentHtml: `
      <p>Filing an e-Nomination on the Member Portal secures your accumulated provident fund, pension, and insurance benefits for your dependents. Without a valid nomination, legal heirs must obtain succession certificates, causing unnecessary delays during difficult times.</p>
    `,
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
    contentHtml: `
      <p>When changing employers, your PF balance from the previous establishment should be consolidated into your current active Member ID. Use the 'One Member – One EPF Account' transfer feature under the 'Online Services' menu.</p>
    `,
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
    contentHtml: `
      <p>Under the EDLI Scheme, insurance benefits of up to ₹7,00,000 are payable to the registered nominee or family members in the event of an active employee's demise. No employee contribution is required for EDLI coverage.</p>
    `,
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
    contentHtml: `
      <p>EPFiGMS (EPF Internet Grievance Management System) is the dedicated portal for redressal of member, pensioner, and employer complaints. Grievances are typically resolved within 20 working days with multiple escalation levels.</p>
    `,
  },
];

/**
 * Fetch a list of published posts from Murit CMS.
 * Falls back to starter sample posts if Murit has 0 posts.
 */
export async function getPosts(options?: {
  limit?: number;
  category?: string;
  tag?: string;
}): Promise<MuritPostSummary[]> {
  const limit = options?.limit ?? 12;

  if (!isMuritConfigured()) {
    return SAMPLE_POSTS.slice(0, limit);
  }

  const query = new URLSearchParams();
  query.set('limit', String(limit));
  if (options?.category) query.set('category', options.category);
  if (options?.tag) query.set('tag', options.tag);

  const endpoint = `${CMS_BASE_URL}/api/content/v1/sites/${CMS_SITE_KEY}/posts?${query.toString()}`;

  try {
    const res = await fetch(endpoint, {
      next: { revalidate: 60 },
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      return SAMPLE_POSTS.slice(0, limit);
    }

    const json = (await res.json()) as MuritPostsResponse;
    const posts = json?.data ?? [];
    return posts.length > 0 ? posts : SAMPLE_POSTS.slice(0, limit);
  } catch (error) {
    console.warn('[Murit CMS] Network error fetching posts:', error);
    return SAMPLE_POSTS.slice(0, limit);
  }
}

/**
 * Fetch a single post by its slug.
 * Checks live Murit CMS first, then checks sample posts.
 */
export async function getPostBySlug(slug: string): Promise<MuritPostDetail | null> {
  if (!slug) return null;

  if (isMuritConfigured()) {
    const endpoint = `${CMS_BASE_URL}/api/content/v1/sites/${CMS_SITE_KEY}/posts/${encodeURIComponent(slug)}`;
    try {
      const res = await fetch(endpoint, {
        next: { revalidate: 60 },
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        const json = (await res.json()) as MuritSinglePostResponse;
        if (json?.data) return json.data;
      }
    } catch (error) {
      console.warn(`[Murit CMS] Network error fetching post ${slug}:`, error);
    }
  }

  // Fallback to sample posts
  const sample = SAMPLE_POSTS.find((p) => p.slug === slug);
  return sample ?? null;
}
