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
  focusedKeyword?: string | null;
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
  author?: string | null;
  readingTime?: string | null;
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
    id: 'seo-post-1',
    title: 'How to File Online PF Withdrawal Claims: The Definitive 2026 Checklist',
    slug: 'online-pf-withdrawal-claim-checklist-2026',
    excerpt: 'Complete 2026 checklist for submitting online PF withdrawal claims under Form 19, 10C, and 31. Learn eligibility criteria, required KYC seeding, and avoid common rejection causes.',
    publishedAt: '2026-09-12T09:00:00.000Z',
    modifiedAt: '2026-09-12T11:30:00.000Z',
    author: 'EPFO Digital Services Editorial Desk',
    readingTime: '5 min read',
    categories: [{ name: 'Employees', slug: 'employees' }],
    tags: [
      { name: 'PF Withdrawal', slug: 'pf-withdrawal' },
      { name: 'Form 19', slug: 'form-19' },
      { name: 'KYC Seeding', slug: 'kyc-seeding' },
      { name: 'Online Claims', slug: 'online-claims' },
    ],
    featuredMedia: {
      url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&h=630&q=80',
      alt: 'Financial documentation and digital device displaying EPF online claim filing portal',
      caption: 'Online claim settlement requires seeded Aadhaar, verified active bank account, and correct date of exit.',
      width: 1200,
      height: 630,
    },
    seo: {
      title: 'How to File Online PF Withdrawal Claims: Complete Checklist (2026)',
      description: 'Complete 2026 checklist for submitting online PF withdrawal claims under Form 19, 10C, and 31. Learn eligibility criteria, required KYC seeding, and avoid common rejection causes.',
      focusedKeyword: 'EPF online claim settlement',
      canonicalURL: 'https://epfo-prototype.vercel.app/blog/online-pf-withdrawal-claim-checklist-2026',
      keywords: 'EPF claim, PF withdrawal online, Form 19, Form 10C, Form 31, UAN claim settlement, EPFO online portal, claim rejection reasons',
      socialImage: {
        url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&h=630&q=80',
        alt: 'Financial documentation and digital device displaying EPF online claim filing portal',
        width: 1200,
        height: 630,
      },
    },
    contentHtml: `
      <p class="lead">Filing an online claim under the Employees' Provident Funds Scheme is now entirely paperless for members with verified digital credentials. However, incomplete KYC seeding and mismatched demographic records remain the leading causes for claim delays.</p>

      <h2>Prerequisites for Online Claim Submission</h2>
      <p>Before initiating an online claim under Form 19 (Final PF Settlement), Form 10C (Pension Withdrawal Benefit), or Form 31 (Non-refundable Advance), ensure all statutory prerequisites are met in your unified profile:</p>

      <ul>
        <li><strong>Universal Account Number (UAN):</strong> Must be activated and linked with an active, Aadhaar-registered mobile number to receive authentication OTPs.</li>
        <li><strong>Bank Account Details:</strong> Verified bank account number and IFSC must be digitally approved by your employer and displayed with status "Verified by Bank" under the KYC tab.</li>
        <li><strong>Date of Exit (DOE):</strong> For full withdrawal (Form 19 and 10C), the Date of Exit must be recorded by the employer or marked by the employee after two months of cessation of employment.</li>
        <li><strong>Permanent Account Number (PAN):</strong> Seeded for claims where total service is under 5 continuous years to prevent higher TDS deduction under Section 192A.</li>
      </ul>

      <blockquote>Tip: If you encounter a spelling discrepancy between your Aadhaar and EPFO record, submit an online Joint Declaration through the <a href="/login">EPFO Unified Login portal</a> before submitting a financial claim.</blockquote>

      <h2>Step-by-Step Claim Submission Workflow</h2>
      <ol>
        <li>Sign in to the official <a href="https://unifiedportal-mem.epfindia.gov.in/" target="_blank" rel="noreferrer">Unified Member Portal ↗</a> using your UAN and password.</li>
        <li>Navigate to <strong>Online Services &rarr; Claim (Form-31, 19, 10C &amp; 10D)</strong>.</li>
        <li>Verify the pre-populated member details and re-enter your linked bank account number to authenticate.</li>
        <li>Select the required claim type based on your service status and upload a clear scanned image of a cancelled cheque or passbook first page.</li>
        <li>Request the UIDAI Aadhaar OTP and complete biometric consent to transmit your application to the jurisdictional field office.</li>
      </ol>

      <h2>Common Reasons for Claim Rejection and How to Prevent Them</h2>
      <p>According to the official <a href="https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/11/CitizenCharter.pdf" target="_blank" rel="noreferrer">EPFO Citizen's Charter ↗</a>, claims must be processed within 20 working days. To ensure swift auto-settlement, avoid these frequent oversights:</p>

      <ul>
        <li><strong>Illegible Cheque Leaf:</strong> Uploaded images where the member's name, account number, or IFSC are blurred trigger instant technical rejections.</li>
        <li><strong>Unseeded Member ID:</strong> Always consolidate accounts using the One Member One EPF Account transfer feature before applying for final closure.</li>
        <li><strong>Missing Exit Reason:</strong> Verify that the employer has marked the correct exit reason (Superannuation, Resignation, or Cessation).</li>
      </ul>

      <p>If your claim has been delayed beyond statutory turnaround standards, you can escalate the matter directly through the official <a href="/grievance">EPFO Grievance Redressal mechanism</a> or reach out to your local field office via the <a href="/directory">EPFO Directory</a>.</p>
    `,
  },
  {
    id: 'seo-post-2',
    title: 'Jeevan Pramaan Face Authentication: Annual Life Certificate Guide for EPS Pensioners',
    slug: 'jeevan-pramaan-face-authentication-guide',
    excerpt: 'Detailed guide for EPS 95 pensioners on submitting their annual digital life certificate (Jeevan Pramaan) using smartphone face authentication without visiting bank branches.',
    publishedAt: '2026-09-11T08:30:00.000Z',
    modifiedAt: '2026-09-12T10:00:00.000Z',
    author: 'EPFO Pensioners Welfare Directorate',
    readingTime: '4 min read',
    categories: [{ name: 'Pensioners', slug: 'pensioners' }],
    tags: [
      { name: 'Jeevan Pramaan', slug: 'jeevan-pramaan' },
      { name: 'EPS 95', slug: 'eps-95' },
      { name: 'Face Authentication', slug: 'face-authentication' },
      { name: 'Digital Pension', slug: 'digital-pension' },
    ],
    featuredMedia: {
      url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&h=630&q=80',
      alt: 'Senior citizen using modern smartphone camera for biometric face authentication',
      caption: 'EPS 95 pensioners can submit Digital Life Certificates from home using any standard smartphone camera.',
      width: 1200,
      height: 630,
    },
    seo: {
      title: 'Jeevan Pramaan Face Authentication: Digital Life Certificate Guide (2026)',
      description: 'Detailed guide for EPS 95 pensioners on submitting their annual digital life certificate (Jeevan Pramaan) using smartphone face authentication without visiting bank branches.',
      focusedKeyword: 'Jeevan Pramaan face authentication',
      canonicalURL: 'https://epfo-prototype.vercel.app/blog/jeevan-pramaan-face-authentication-guide',
      keywords: 'Jeevan Pramaan, EPS 95, digital life certificate, face authentication, pensioner PPO, EPFO pension, biometric verification',
      socialImage: {
        url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&h=630&q=80',
        alt: 'Senior citizen using modern smartphone camera for biometric face authentication',
        width: 1200,
        height: 630,
      },
    },
    contentHtml: `
      <p class="lead">Under the Employees' Pension Scheme, 1995, over 7.8 million beneficiaries must submit an annual Proof of Life to maintain uninterrupted monthly disbursements. With the introduction of UIDAI face RD service integration, pensioners can now complete verification from home without visiting bank branches or CSC centres.</p>

      <h2>Technical Requirements for Face Authentication</h2>
      <p>To use the face-authentication feature, you need:</p>
      <ul>
        <li>An Android smartphone (Android version 7.0 Nougat or higher) with a 5MP+ front camera and stable internet access.</li>
        <li>The <strong>AadhaarFaceRD</strong> service app downloaded from the Google Play Store (UIDAI official application).</li>
        <li>The <strong>Jeevan Pramaan</strong> application from the official <a href="https://jeevanpramaan.gov.in/" target="_blank" rel="noreferrer">Jeevan Pramaan Portal ↗</a>.</li>
        <li>Your 12-digit Pension Payment Order (PPO) number, pension disbursing agency name, and linked bank account number.</li>
      </ul>

      <h2>Step-by-Step Mobile Submission Process</h2>
      <ol>
        <li>Open the Jeevan Pramaan app and complete one-time operator authentication using an Aadhaar-linked mobile number.</li>
        <li>Enter pensioner credentials: 12-digit Aadhaar Number, mobile number, Pension Payment Order (PPO) number, sanctioning authority (select "EPFO"), and bank account details.</li>
        <li>Position the pensioner's face inside the highlighted circular frame under natural, even room lighting.</li>
        <li>Follow the screen prompt to blink naturally when the camera detector captures facial landmarks.</li>
        <li>Upon successful match with UIDAI biometric databases, a unique Pramaan ID is displayed on screen and confirmed via SMS.</li>
      </ol>

      <blockquote>Important: A Digital Life Certificate remains valid for exactly 12 continuous months from the day it is generated. There is no need to queue at banks in November if your certificate was issued in April.</blockquote>

      <h2>Verifying Your Life Certificate Status</h2>
      <p>Once submitted, the digital certificate is automatically transmitted to EPFO's central pension servers. You can track confirmation using your PPO number on the <a href="https://mis.epfindia.gov.in/PensionPaymentEnquiry/enquiry.jsp" target="_blank" rel="noreferrer">EPFO Pension Payment Order Enquiry portal ↗</a>.</p>
      <p>For more details on pension entitlement and death benefits under EPS 95, read our overview of <a href="/about-us">EPFO Social Security Schemes</a> or browse our <a href="/#services">Pensioner Services Directory</a>.</p>
    `,
  },
  {
    id: 'seo-post-3',
    title: 'Employer Guide to Revamped ECR Filing & Statutory Compliance 2026',
    slug: 'employer-revamped-ecr-filing-compliance-guide',
    excerpt: 'Actionable guide for establishment managers and HR teams on filing Electronic Challan cum Return (ECR) version 2, member wage ceiling reconciliation, and timely statutory remittances.',
    publishedAt: '2026-09-10T11:00:00.000Z',
    modifiedAt: '2026-09-12T09:15:00.000Z',
    author: 'EPFO Compliance & Inspection Bureau',
    readingTime: '6 min read',
    categories: [{ name: 'Employers', slug: 'employers' }],
    tags: [
      { name: 'ECR', slug: 'ecr' },
      { name: 'Employer Compliance', slug: 'employer-compliance' },
      { name: 'Challan TRRN', slug: 'challan-trrn' },
      { name: 'Statutory Filing', slug: 'statutory-filing' },
    ],
    featuredMedia: {
      url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&h=630&q=80',
      alt: 'Corporate HR compliance team reviewing Electronic Challan cum Return financial spreadsheets',
      caption: 'Monthly remittance of statutory contributions before the 15th protects establishments from interest penalties.',
      width: 1200,
      height: 630,
    },
    seo: {
      title: 'Employer Guide to Revamped ECR Filing & EPF Compliance (2026)',
      description: 'Actionable guide for establishment managers and HR teams on filing Electronic Challan cum Return (ECR) version 2, member wage ceiling reconciliation, and timely statutory remittances.',
      focusedKeyword: 'revamped ECR filing compliance',
      canonicalURL: 'https://epfo-prototype.vercel.app/blog/employer-revamped-ecr-filing-compliance-guide',
      keywords: 'revamped ECR, Electronic Challan cum Return, employer EPF compliance, Section 7Q, EDLI remittance, establishment portal, TRRN tracking',
      socialImage: {
        url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&h=630&q=80',
        alt: 'Corporate HR compliance team reviewing Electronic Challan cum Return financial spreadsheets',
        width: 1200,
        height: 630,
      },
    },
    contentHtml: `
      <p class="lead">Under the Employees' Provident Funds &amp; Miscellaneous Provisions Act, 1952, registered establishments must generate and reconcile monthly Electronic Challan cum Return (ECR) files for all eligible personnel. Adhering to validated text formats and timely electronic banking transfers protects organizations from damages under Section 14B and interest under Section 7Q.</p>

      <h2>ECR File Structure and Pre-Upload Checks</h2>
      <p>The ECR file is an ASCII text format where fields are separated by the pound delimiter (<code>#~#</code>). Before uploading your wage sheet to the portal, verify the following core parameters:</p>

      <ul>
        <li><strong>Active Universal Account Numbers:</strong> Every member must have an allocated, verified UAN. Do not include placeholder or dummy strings in member records.</li>
        <li><strong>Statutory Wage Cap Reconciliation:</strong> Unless a joint option under the proviso to paragraph 11(3) or 11(4) of EPS 1995 is active, pension contributions are capped at the statutory ceiling of ₹15,000.</li>
        <li><strong>Non-Contributory Period (NCP) Tracking:</strong> Accurate calculation of days for which no wages were payable prevents member service break disputes.</li>
        <li><strong>Exit Date Reconciliation:</strong> Record exact date of resignation or separation in the member master before generating the monthly ECR to prevent ghost liability accruals.</li>
      </ul>

      <blockquote>Note: The due date for payment of monthly contributions is the 15th day of the month following the wage month. TRRNs generated on the 15th must have electronic payments completed before midnight to prevent late tags.</blockquote>

      <h2>ECR Generation and Payment Steps</h2>
      <ol>
        <li>Log in to the official <a href="https://unifiedportal-emp.epfindia.gov.in/epfo/" target="_blank" rel="noreferrer">Unified Employer Portal ↗</a> using establishment credentials.</li>
        <li>Select <strong>Payment &rarr; ECR Upload</strong> and choose the applicable wage month and contribution rate (12% or 10%).</li>
        <li>Upload the delimited text file and review the preliminary validation error report.</li>
        <li>Confirm summary amounts: Account 1 (EPF), Account 2 (Admin Charges), Account 10 (EPS), Account 21 (EDLI), and Account 22 (EDLI Admin).</li>
        <li>Generate the Temporary Return Reference Number (TRRN) and proceed with electronic payment via authorized net banking or SBI e-Pay.</li>
      </ol>

      <h2>Multi-Establishment Registrations &amp; Audits</h2>
      <p>Establishments operating multiple branches or contract labor assignments should maintain unified compliance tracking through the Ministry of Labour &amp; Employment's <a href="https://shramsuvidha.gov.in/" target="_blank" rel="noreferrer">Shram Suvidha Portal ↗</a> (LIN unified identifier).</p>
      <p>For assistance with TRRN reversal or inspection compliance notices, refer to our <a href="/locate-epfo-office">EPFO Regional Office Directory</a> or explore the full suite of <a href="/#services">Employer Online Services</a>.</p>
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
      alt: 'Digital identity verification and secure biometric authentication',
      caption: 'Seeding Aadhaar with UAN ensures instant claim verification and prevents identity theft.',
      width: 1200,
      height: 630,
    },
    seo: {
      title: 'Seamless UAN and Aadhaar Seeding Guide (2026)',
      description: 'Demystifying demographic mismatch verification and ensuring your active mobile number receives statutory OTP notifications.',
      focusedKeyword: 'UAN Aadhaar seeding',
      canonicalURL: 'https://epfo-prototype.vercel.app/blog/uan-aadhaar-linking-guide',
      keywords: 'UAN, Aadhaar linking, KYC, demographic verification, EPFO profile',
    },
    contentHtml: `
      <p>Online service delivery in EPFO relies fundamentally on the Universal Account Number (UAN) seeded with Aadhaar and verified bank details. A single mismatch in name spelling, date of birth, or gender can prevent automated online claim settlement.</p>
      <h2>How to Correct Demographic Details</h2>
      <p>If you encounter a mismatch between EPFO records and UIDAI Aadhaar data, submit a Joint Declaration request through the <a href="/login">Member Login Interface</a> under the 'Manage' tab. Your employer must digitally sign the modification using DSC or e-Sign before field office approval.</p>
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
      alt: 'Financial calculator, documents and pension payment records',
      caption: 'Pension entitlement under EPS 1995 is based on pensionable salary and accrued contributory service.',
      width: 1200,
      height: 630,
    },
    seo: {
      title: 'EPS 95 Pension Calculation & Service Accrual Primer',
      description: 'How past service periods, pensionable salary caps, and continuous employment determine monthly pension entitlement.',
      focusedKeyword: 'EPS 95 pension calculation',
      canonicalURL: 'https://epfo-prototype.vercel.app/blog/pension-calculation-eps-95',
      keywords: 'EPS 95, pension calculation, EPFO pension formula, superannuation',
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
      alt: 'Family reviewing financial security and insurance protection documents',
      caption: 'Digital e-nomination with Aadhaar e-sign eliminates delays in claim settlements for legal heirs.',
      width: 1200,
      height: 630,
    },
    seo: {
      title: 'Why E-Nomination is Crucial: Social Security Protection',
      description: 'Submitting digital nomination records with Aadhaar photo e-sign ensures smooth disbursal of accumulated PF and EDLI insurance.',
      focusedKeyword: 'EPFO e-nomination benefits',
      canonicalURL: 'https://epfo-prototype.vercel.app/blog/nomination-efiling-benefits',
      keywords: 'e-Nomination, EDLI insurance, EPFO nominee registration, Aadhaar e-sign',
    },
    contentHtml: `
      <p>Filing an e-Nomination on the <a href="/login">Member Portal</a> secures your accumulated provident fund, pension, and insurance benefits for your dependents. Without a valid nomination, legal heirs must obtain succession certificates, causing unnecessary delays during difficult times.</p>
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
      alt: 'Online account transfer and digital data analytics dashboard',
      caption: 'One Member One EPF Account service enables online account consolidation without employer paper forms.',
      width: 1200,
      height: 630,
    },
    seo: {
      title: 'How to Transfer PF Balance Online When Switching Jobs',
      description: 'Using the Unified Member Portal to initiate One Member One EPF Account online transfers without physical paperwork.',
      focusedKeyword: 'transfer PF balance online',
      canonicalURL: 'https://epfo-prototype.vercel.app/blog/transfer-pf-previous-establishment',
      keywords: 'PF transfer online, One Member One EPF, Unified Portal, UAN transfer',
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
      alt: 'Legal documentation and insurance certificate for death benefit claims',
      caption: 'Under the EDLI Scheme, registered nominees receive up to ₹7 Lakh financial protection upon active employee demise.',
      width: 1200,
      height: 630,
    },
    seo: {
      title: 'EDLI & Death Benefit Claims: Required Documentation Checklist',
      description: 'Detailed checklist for legal heirs and registered nominees seeking financial assistance under the Employees Deposit Linked Insurance Scheme.',
      focusedKeyword: 'EDLI death claim checklist',
      canonicalURL: 'https://epfo-prototype.vercel.app/blog/death-claim-nominee-settlement',
      keywords: 'EDLI scheme, death claim, EPFO insurance benefit, Form 5IF',
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
      alt: 'Citizen grievance assistance and online support service center',
      caption: 'EPFiGMS provides unique registration tokens for tracking grievance escalation across three management tiers.',
      width: 1200,
      height: 630,
    },
    seo: {
      title: 'EPFiGMS: Online Grievance Registration & Tracking Timelines',
      description: 'How to file, register, and monitor status updates on the Central Grievance Redressal system with unique registration numbers.',
      focusedKeyword: 'EPFiGMS grievance tracking',
      canonicalURL: 'https://epfo-prototype.vercel.app/blog/epfo-grievance-redressal-epfigms',
      keywords: 'EPFiGMS, EPFO grievance, track complaint, PF escalation',
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
