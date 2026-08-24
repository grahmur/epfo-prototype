import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteFooter, SiteHeader } from '../SiteChrome';
import { isExternal } from '../siteNavigation';

type PageLink = {
  label: string;
  href: string;
  description?: string;
};

type PageSection = {
  heading: string;
  paragraphs?: readonly string[];
  bullets?: readonly string[];
  links?: readonly PageLink[];
};

type PageDefinition = {
  area: string;
  title: string;
  intro: string;
  sourceUrl: string;
  sections: readonly PageSection[];
};

const pages = {
  'about-us': {
    area: 'About',
    title: 'About EPFO',
    intro: 'Leading social security in India through provident fund, pension and insurance services for the organised workforce.',
    sourceUrl: 'https://www.epfo.gov.in/about-us/',
    sections: [
      {
        heading: 'Nationwide reach. Member-centric service.',
        paragraphs: [
          'The Employees’ Provident Fund Organisation (EPFO), established in 1952, administers provident fund, pension and insurance schemes for workers in the organised sector.',
          'EPFO continues to expand digital access to contributions, claims, account services, grievance resolution and Digital Life Certificates.',
        ],
      },
      {
        heading: 'Three flagship schemes',
        links: [
          { label: 'Employees’ Provident Funds Scheme, 1952', href: 'https://www.epfo.gov.in/epf-scheme/', description: 'Provident fund savings and contribution framework.' },
          { label: 'Employees’ Pension Scheme, 1995', href: 'https://www.epfo.gov.in/pension-scheme-eps/', description: 'Pension benefits for eligible members and families.' },
          { label: 'Employees’ Deposit Linked Insurance Scheme, 1976', href: 'https://www.epfo.gov.in/insurance-scheme-edli/', description: 'Insurance protection linked to EPF membership.' },
        ],
      },
      {
        heading: 'Core service principles',
        bullets: [
          'Citizen-centric access to provident fund, pension and insurance services.',
          'Transparency and accountability through clear information and processes.',
          'Efficiency and innovation through digital-first service delivery.',
          'Inclusive access for employees, employers, pensioners and international workers.',
        ],
      },
      {
        heading: 'Our journey',
        bullets: [
          '1952 — Employees’ Provident Funds Scheme introduced.',
          '1971 — Family pension protection introduced.',
          '1976 — Deposit-linked insurance benefits introduced.',
          '1995 — Employees’ Pension Scheme introduced.',
          '2014 — Universal Account Number launched.',
          '2019 — EPF & MP Act extended to Jammu & Kashmir and Ladakh.',
        ],
      },
    ],
  },
  directory: {
    area: 'About',
    title: 'EPFO Directory',
    intro: 'Find the organisational route that can help with an office, service or escalation.',
    sourceUrl: 'https://www.epfo.gov.in/directory/',
    sections: [
      {
        heading: 'Start with the right route',
        links: [
          { label: 'Locate an EPFO office', href: '/locate-epfo-office', description: 'Browse the office-locator guidance by state and regional office.' },
          { label: 'Contact EPFO', href: '/contact-us', description: 'Use the helpline, grievance and support routes.' },
          { label: 'Grievance redressal', href: 'https://epfigms.gov.in/', description: 'Open the official EPFiGMS portal in a new tab.' },
        ],
      },
      {
        heading: 'Head Office',
        paragraphs: [
          'Employees’ Provident Fund Organisation, Ministry of Labour & Employment, Plate A, Ground Floor, Office Block-II, East Kidwai Nagar, New Delhi — 110023.',
        ],
      },
      {
        heading: 'Directory structure',
        bullets: ['Head Office', 'Zonal Offices', 'Regional Offices', 'District Offices'],
      },
    ],
  },
  rti: {
    area: 'About',
    title: 'Right to Information',
    intro: 'Access the Right to Information framework, guidance and official filing service.',
    sourceUrl: 'https://www.epfo.gov.in/rti-epfo/',
    sections: [
      {
        heading: 'RTI Act, 2005',
        paragraphs: [
          'The Right to Information Act, 2005 provides a practical regime for citizens to secure access to information under the control of public authorities and promotes transparency and accountability.',
        ],
      },
      {
        heading: 'Information and guidance',
        links: [
          { label: 'A brief on the RTI Act', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/07/RIAct-1.pdf', description: 'Official PDF document.' },
          { label: 'RTI Information Handbook', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/07/RTI_InformationHandbook-1.pdf', description: 'Official PDF document.' },
          { label: 'Guide to Information Seekers', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/07/RTI_1-1.pdf', description: 'Official PDF document.' },
          { label: 'Guidelines for filing vigilance complaints', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/07/Vig_Guidelines_filingofcomplaints_01082023-1.pdf', description: 'Official PDF document.' },
        ],
      },
      {
        heading: 'File an RTI request',
        links: [{ label: 'RTI Online', href: 'https://rtionline.gov.in/', description: 'Official Government of India filing service.' }],
      },
    ],
  },
  'locate-epfo-office': {
    area: 'About',
    title: 'Locate an EPFO Office',
    intro: 'Choose the right office route before travelling or sharing information.',
    sourceUrl: 'https://www.epfo.gov.in/locate-epfo-office/',
    sections: [
      {
        heading: 'Find the responsible office',
        paragraphs: ['The current official locator is organised by State and Zonal or Regional Office. This prototype keeps office discovery within the redesigned site and avoids collecting personal identifiers.'],
        links: [
          { label: 'Browse the EPFO directory', href: '/directory', description: 'See the office hierarchy and Head Office details.' },
          { label: 'Contact support', href: '/contact-us', description: 'Use grievance and helpline routes when the responsible office is unclear.' },
        ],
      },
      {
        heading: 'Before visiting',
        bullets: ['Confirm the office jurisdiction for your establishment or member record.', 'Check the latest official working-day and appointment guidance.', 'Do not share a UAN, Aadhaar number, bank detail, password or OTP through an unverified contact.'],
      },
    ],
  },
  'central-board-of-trustees': {
    area: 'About',
    title: 'Central Board of Trustees',
    intro: 'The statutory board responsible for administering the EPF, EPS and EDLI schemes and funds.',
    sourceUrl: 'https://www.epfo.gov.in/cbt/',
    sections: [
      {
        heading: 'About the Board',
        paragraphs: ['The Central Board of Trustees, EPF is a statutory body established by the Central Government under Section 5A of the EPF & MP Act, 1952. Its work is supported by an Executive Committee, Regional Committees and specialised sub-committees.'],
      },
      {
        heading: 'Key functions',
        bullets: ['Administer EPF, EPS and EDLI schemes and funds.', 'Oversee investments and recommend interest rates for PF members.', 'Maintain accounts and submit audited reports to Government.', 'Review exempted establishments and pension implementation.', 'Guide technology reforms and administrative modernisation.', 'Approve offices, staffing and delegated powers.'],
      },
      {
        heading: 'Recent meeting documents',
        links: [
          { label: '238th CBT — Agenda Book', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/12/Agenda_Book_238th_CBT.pdf', description: 'Official PDF document.' },
          { label: '238th CBT — Draft Minutes', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/12/Draft_Minutes_of_238th_CBT.pdf', description: 'Official PDF document.' },
          { label: '237th CBT — Agenda Book', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/12/Agenda_Book_237th_CBT.pdf', description: 'Official PDF document.' },
          { label: '237th CBT — Draft Minutes', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/12/Draft_Minutes_of_237th_CBT.pdf', description: 'Official PDF document.' },
        ],
      },
    ],
  },
  'contact-us': {
    area: 'Support',
    title: 'Contact Us',
    intro: 'Choose a verified support route for grievances, pending cases and general assistance.',
    sourceUrl: 'https://www.epfo.gov.in/contact-us/',
    sections: [
      {
        heading: 'Grievance redressal',
        paragraphs: ['PF members, EPS pensioners, employers and other users can register and track grievances through the official EPFiGMS portal.'],
        links: [{ label: 'Open EPFiGMS', href: 'https://epfigms.gov.in/', description: 'Official grievance-management portal.' }],
      },
      {
        heading: 'Already registered a grievance?',
        paragraphs: ['If a registered grievance remains pending for more than 15 days, the current public guidance provides an escalation route using the registered grievance number.'],
        links: [{ label: 'Email the Customer Service Division', href: 'mailto:rc.csd@epfindia.gov.in', description: 'Include only the registered grievance number; never send a password or OTP.' }],
      },
      {
        heading: 'Other ways to reach EPFO',
        links: [
          { label: 'Helpline 14470', href: 'tel:14470', description: 'Official EPFO helpdesk number.' },
          { label: 'Find an EPFO office', href: '/locate-epfo-office', description: 'Use the internal office-discovery page.' },
        ],
      },
      {
        heading: 'Head Office',
        paragraphs: ['Office Block, Tower 2, Block B, East Kidwai Nagar, New Delhi, Delhi 110023.'],
      },
    ],
  },
  resources: {
    area: 'Resources',
    title: 'Resources',
    intro: 'Browse current EPFO publications, reports, manuals, media and official document collections without leaving the redesigned navigation.',
    sourceUrl: 'https://www.epfo.gov.in/',
    sections: [
      {
        heading: 'Public information',
        links: [
          { label: 'Publications', href: '/publications', description: 'Newsletters, outreach publications and service stories.' },
          { label: 'Press releases', href: '/press-releases', description: 'Official announcements and media statements.' },
          { label: 'Study reports', href: '/study-reports', description: 'Legal, policy and research documents.' },
          { label: 'Media centre', href: '/media-centre', description: 'Official visual explainers and campaign material.' },
        ],
      },
      {
        heading: 'Reports and reference',
        links: [
          { label: 'Annual reports', href: '/annual-reports', description: 'Yearly organisational reports.' },
          { label: 'Annual accounts', href: '/annual-accounts', description: 'Consolidated annual account documents.' },
          { label: 'Manuals & guidelines', href: '/manuals-and-guidelines', description: 'Procurement, administration and service manuals.' },
          { label: 'Data hub', href: '/data-hub', description: 'Provisional monthly payroll estimates.' },
          { label: 'Archives', href: '/archives', description: 'Earlier schemes, FAQs and notices.' },
          { label: 'For office use', href: '/office-use', description: 'Institutional reference routes.' },
        ],
      },
    ],
  },
  publications: {
    area: 'Resources',
    title: 'Publications',
    intro: 'Selected current publications linked directly to their official files.',
    sourceUrl: 'https://www.epfo.gov.in/publications/',
    sections: [{ heading: 'Featured publications', links: [
      { label: 'Ek Sakratmak Pehal', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/09/EK_SAKRATMAK_PEHAL.pdf', description: 'Official PDF publication.' },
      { label: 'Ek Sakratmak Pehal — RO Shimla', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/09/Shimla_25_Hindi.pdf', description: 'Official PDF publication.' },
      { label: 'Quarterly Newsletter — Foundation Day', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/08/Quarterly-Newsletter-Foundation-Day-compressed-1.pdf', description: 'Official PDF newsletter.' },
      { label: 'EPFO Newsletter — April to June 2025', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/08/Newsletter_April_June_2025_EPFO.pdf', description: 'Official PDF newsletter.' },
      { label: 'EPFO Newsletter — January to March 2025', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/08/Newsletter_January_Mar_2025_EPFO-1.pdf', description: 'Official PDF newsletter.' },
    ] }],
  },
  'press-releases': {
    area: 'Resources',
    title: 'Press Releases',
    intro: 'Official press material, presented as direct document links.',
    sourceUrl: 'https://www.epfo.gov.in/press-release/',
    sections: [{ heading: 'Press release documents', links: [
      { label: 'Secretary (L&E) chairs 112th EPFO Executive Committee meeting', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/09/SecretaryLE_Chairs112thEPFO_ECMeeting.pdf', description: 'Official PDF press release.' },
      { label: 'Interaction with newly inducted APFCs of EPFO', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/09/DrMansukhMandaviya_InteractsWithNewlyInductedAPFCofEPFO.pdf', description: 'Official PDF press release.' },
      { label: 'EPFO settles over 5 crore claims in FY 2024–25', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/09/06022025_EPFOAchievesSettlingOver_5CroreClaims_FY-202425.pdf', description: 'Official PDF press release.' },
      { label: 'EPFO simplifies the transfer-claim process', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/10/25042025_EPFOSimplifiesTransferClaim-Process.pdf', description: 'Official PDF press release.' },
    ] }],
  },
  'study-reports': {
    area: 'Resources',
    title: 'Study Reports',
    intro: 'Current legal and policy study documents published by EPFO.',
    sourceUrl: 'https://www.epfo.gov.in/study-reports/',
    sections: [{ heading: 'Reports', links: [
      { label: 'Adyatan Compendium', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/08/Adyatan_Compendim_PDF_15112024-1.pdf', description: 'Official PDF report.' },
      { label: '50 landmark judgments on the EPF & MP Act', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/08/50_Lanmark_judgments_on_the_EPF_MP_Act-1.pdf', description: 'Official PDF report.' },
      { label: 'Legal Framework Document', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/08/Legal_Framework_Document-1-1.pdf', description: 'Official PDF report.' },
      { label: 'Deliberations and Recommendations Document', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/08/Deliberations_Recommendations_Doc-1-1.pdf', description: 'Official PDF report.' },
    ] }],
  },
  'annual-reports': {
    area: 'Resources',
    title: 'Annual Reports',
    intro: 'EPFO annual reports, linked directly to the official PDF files.',
    sourceUrl: 'https://www.epfo.gov.in/annual-reports/',
    sections: [{ heading: 'Recent annual reports', links: [
      { label: 'Annual Report 2023–24', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/08/71.pdf', description: 'Official PDF report.' },
      { label: 'Annual Report 2022–23', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/08/70.pdf', description: 'Official PDF report.' },
      { label: 'Annual Report 2021–22', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/08/69.pdf', description: 'Official PDF report.' },
      { label: 'Annual Report 2020–21', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/08/68.pdf', description: 'Official PDF report.' },
      { label: 'Annual Report 2019–20', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/08/67.pdf', description: 'Official PDF report.' },
    ] }],
  },
  'annual-accounts': {
    area: 'Resources',
    title: 'Annual Accounts',
    intro: 'Consolidated annual account documents published by EPFO.',
    sourceUrl: 'https://www.epfo.gov.in/annual-accounts/',
    sections: [{ heading: 'Recent annual accounts', links: [
      { label: 'Consolidated Annual Accounts 2022–23', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/08/Consolidated_Annual_Accounts-2022-23.pdf', description: 'Official PDF accounts.' },
      { label: 'Consolidated Annual Accounts 2021–22', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/08/Consolidated_Annual_Accounts-2021-22.pdf', description: 'Official PDF accounts.' },
      { label: 'Annual Accounts 2020–21', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/08/Account_Report_2020-21.pdf', description: 'Official PDF accounts.' },
      { label: 'Consolidated Annual Accounts 2019–20', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/08/Consolidated_Annual_Accounts-2019-20.pdf', description: 'Official PDF accounts.' },
    ] }],
  },
  'media-centre': {
    area: 'Resources',
    title: 'Media Centre',
    intro: 'Official visual explainers and public-information assets.',
    sourceUrl: 'https://www.epfo.gov.in/media-centre/',
    sections: [{ heading: 'Featured media', links: [
      { label: 'Do not lose interest on EPF', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/09/5.jpg', description: 'Official image.' },
      { label: 'Rejoinee? Activate UAN using UMANG', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/09/3.jpg', description: 'Official image.' },
      { label: 'e-Nomination', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/09/3-enomination-1.jpg', description: 'Official image.' },
      { label: 'EPF Transfer', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/09/9-EPF-Transfer.jpg', description: 'Official image.' },
      { label: 'EPF services on DigiLocker', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/09/11-EPF-Services-on-Digilocker.jpg', description: 'Official image.' },
    ] }],
  },
  'manuals-and-guidelines': {
    area: 'Resources',
    title: 'Manuals & Guidelines',
    intro: 'Official procurement, administration and service-reference documents.',
    sourceUrl: 'https://www.epfo.gov.in/manuals-and-guidelines/',
    sections: [{ heading: 'Featured manuals', links: [
      { label: 'Manual for Procurement of Works', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/08/Manual_for_Procurement_of_Works.pdf', description: 'Official PDF manual.' },
      { label: 'Manual for Procurement of Consultancy & Other Services', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/08/Manual_for_Procurement_of_Consultancy__Other_Services.pdf', description: 'Official PDF manual.' },
      { label: 'Manual for Procurement of Goods', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/08/Manual_for_Procurement_of_Goods.pdf', description: 'Official PDF manual.' },
      { label: 'Quarter Allotment Rules — English', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/08/Quarter_Allotment_Rules_English.pdf', description: 'Official PDF document.' },
      { label: 'Delegation of Administrative and Financial Powers', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/08/Delegation_AdmnFinPowers-1-1.pdf', description: 'Official PDF document.' },
    ] }],
  },
  'data-hub': {
    area: 'Resources',
    title: 'Data Hub',
    intro: 'Provisional monthly estimates of payroll published by EPFO.',
    sourceUrl: 'https://www.epfo.gov.in/data-hub/',
    sections: [{ heading: 'Monthly payroll estimates', links: [
      { label: 'September 2025', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/10/September-2025.pdf', description: 'Official PDF data release.' },
      { label: 'August 2025', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/10/August-2025.pdf', description: 'Official PDF data release.' },
      { label: 'July 2025', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/10/July-2025.pdf', description: 'Official PDF data release.' },
      { label: 'June 2025', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/10/June-2025.pdf', description: 'Official PDF data release.' },
      { label: 'May 2025', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/10/May-2025.pdf', description: 'Official PDF data release.' },
    ] }],
  },
  'office-use': {
    area: 'Resources',
    title: 'For Office Use',
    intro: 'Institutional contact and reference routes published through EPFO Corner.',
    sourceUrl: 'https://www.epfo.gov.in/epfo-corner/',
    sections: [
      { heading: 'EPFO Corner', paragraphs: ['The current public EPFO Corner contains institutional contact listings and office references. Individual contact entries are not reproduced in this prototype because their ownership, update process and intended audience remain Unknown.'] },
      { heading: 'Related internal routes', links: [
        { label: 'EPFO Directory', href: '/directory', description: 'Browse public organisational routes.' },
        { label: 'Contact Us', href: '/contact-us', description: 'Use verified public support channels.' },
      ] },
    ],
  },
  archives: {
    area: 'Resources',
    title: 'Archives',
    intro: 'Earlier scheme documents, FAQs and public guidance retained for reference.',
    sourceUrl: 'https://www.epfo.gov.in/archives/',
    sections: [{ heading: 'Featured archived documents', links: [
      { label: 'ABRY beneficiaries', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/11/ABRY_Beneficiaries_Upload.pdf', description: 'Official archived PDF.' },
      { label: 'ABRY Scheme Guidelines — amended 2 July 2021', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/11/ABRY_Scheme_Guidelines_Amended_on_02_07_2021.pdf', description: 'Official archived PDF.' },
      { label: 'ABRY Scheme brochure', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/11/Brochure_ABRY_Scheme_Eng_25112021.pdf', description: 'Official archived PDF.' },
      { label: 'ABRY frequently asked questions', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/11/FAQ_ABRY.pdf', description: 'Official archived PDF.' },
    ] }],
  },
  recruitments: {
    area: 'Opportunities',
    title: 'Recruitments',
    intro: 'Recruitment information and notices published by EPFO.',
    sourceUrl: 'https://www.epfo.gov.in/recruitments/',
    sections: [
      { heading: 'Current notices', paragraphs: ['No recruitment document was listed on the current public page at the recorded inspection time. This page remains ready for stakeholder-approved notices and direct official document links.'] },
      { heading: 'Safety note', bullets: ['Verify every recruitment notice against an official EPFO or Government of India domain.', 'Never pay a fee or share credentials through an unverified message or website.'] },
    ],
  },
  'tenders-notices': {
    area: 'Opportunities',
    title: 'Tenders & Notices',
    intro: 'Current procurement and public-notice documents linked to their official files.',
    sourceUrl: 'https://www.epfo.gov.in/tender-notices/',
    sections: [{ heading: 'Published documents', links: [
      { label: 'GeM bidding document', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/07/GeM-Bidding-8071100_merged-1.pdf', description: 'Official PDF notice.' },
      { label: 'RFP — Study on Exit Policy and ISR', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/07/RFP_ForConductingStudyOn_ExitPolicyAndISR.pdf', description: 'Official PDF notice.' },
      { label: 'RO Tambaram — DEO on contract basis', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/07/RO_Tambaram_DEOContractBasis.pdf', description: 'Official PDF notice.' },
      { label: 'RFP — Selection of Portfolio Managers', href: 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/07/RFP_SelectionOfPortfolioManagers_27062025-1.pdf', description: 'Official PDF notice.' },
    ] }],
  },
} satisfies Record<string, PageDefinition>;

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = pages[slug as keyof typeof pages];

  return page ? { title: page.title, description: page.intro } : {};
}

export default async function PublicContentPage({ params }: PageProps) {
  const { slug } = await params;
  const page = pages[slug as keyof typeof pages];

  if (!page) notFound();

  return (
    <>
      <SiteHeader />
      <main id="main" className="interior-main">
        <section className="interior-hero">
          <nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span>{page.area}</span></nav>
          <p className="eyebrow">{page.area}</p>
          <h1>{page.title}</h1>
          <p>{page.intro}</p>
        </section>
        <div className="interior-layout">
          <aside className="page-index" aria-label="On this page">
            <b>On this page</b>
            {page.sections.map((section, index) => <a href={`#section-${index + 1}`} key={section.heading}>{section.heading}</a>)}
          </aside>
          <div className="interior-content">
            {page.sections.map((section, index) => (
              <section id={`section-${index + 1}`} className="content-section" key={section.heading}>
                <p className="section-number">{String(index + 1).padStart(2, '0')}</p>
                <h2>{section.heading}</h2>
                {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
                {section.links && <div className="content-link-grid">{section.links.map((link) => {
                  const external = isExternal(link.href) || link.href.startsWith('mailto:') || link.href.startsWith('tel:');
                  return <a href={link.href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} key={link.label}><span><b>{link.label}</b>{link.description && <small>{link.description}</small>}</span><i aria-hidden="true">{external ? '↗' : '→'}</i></a>;
                })}</div>}
              </section>
            ))}
            <p className="source-note"><b>Official source:</b> content and document destinations checked against the current public EPFO page on 24 August 2026. <a href={page.sourceUrl} target="_blank" rel="noreferrer">View current official page ↗</a></p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
