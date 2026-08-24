export type NavigationLink = readonly [label: string, href: string];

export type NavigationGroup = {
  title: string;
  links: readonly NavigationLink[];
};

export const navigation: readonly NavigationGroup[] = [
  {
    title: 'About',
    links: [
      ['About EPFO', '/about-us'],
      ['Directory', '/directory'],
      ["Citizen's Charter", 'https://pmvbry-cdn.epfindia.gov.in/wp-content/uploads/2025/11/CitizenCharter.pdf'],
      ['RTI Act', '/rti'],
      ['Locate EPFO office', '/locate-epfo-office'],
      ['Central Board of Trustees', '/central-board-of-trustees'],
      ['Contact us', '/contact-us'],
    ],
  },
  {
    title: 'Employee',
    links: [
      ['Services', '/#services'],
      ['Grievance redressal', 'https://epfigms.gov.in/'],
      ['UMANG app', 'https://web.umang.gov.in/landing/department/epfo.html'],
      ['Employee documents', 'https://www.epfo.gov.in/employee-documents/'],
      ['International workers', 'https://www.epfo.gov.in/international-workers/'],
    ],
  },
  {
    title: 'Employer',
    links: [
      ['Services', '/#services'],
      ['Shram Suvidha portal', 'https://www.epfo.gov.in/shram-suvidha-portal/'],
      ['Exempted establishments', 'https://www.epfo.gov.in/exempted-establishments'],
      ['Employer documents', 'https://www.epfo.gov.in/employer-documents/'],
      ['Revamped ECR', 'https://www.epfo.gov.in/revamped-ecr/'],
    ],
  },
  {
    title: 'Pensioner',
    links: [
      ['Pension enquiry', 'https://mis.epfindia.gov.in/PensionPaymentEnquiry/enquiry.jsp'],
      ['Services', '/#services'],
      ['Jeevan Pramaan', 'https://www.epfo.gov.in/jeevan-pramaan/'],
    ],
  },
  {
    title: 'Legal Framework',
    links: [
      ['EPF & MP Act 1952', 'https://www.epfo.gov.in/epf-mp-act-1952'],
      ['EPF Scheme', 'https://www.epfo.gov.in/epf-scheme/'],
      ['Pension Scheme (EPS)', 'https://www.epfo.gov.in/pension-scheme-eps/'],
      ['Insurance Scheme (EDLI)', 'https://www.epfo.gov.in/insurance-scheme-edli/'],
      ['PMVBRY Scheme', 'https://pmvbry.epfindia.gov.in/'],
      ['Employees’ Enrolment Campaign', 'https://www.epfo.gov.in/employees-enrolment-campaign-2025/'],
      ['Circulars', 'https://www.epfo.gov.in/circulars/'],
    ],
  },
  {
    title: 'Resources',
    links: [
      ['Resources overview', '/resources'],
      ['Publications', '/publications'],
      ['Press releases', '/press-releases'],
      ['Study reports', '/study-reports'],
      ['Annual reports', '/annual-reports'],
      ['Annual accounts', '/annual-accounts'],
      ['Media centre', '/media-centre'],
      ['Manuals & guidelines', '/manuals-and-guidelines'],
      ['Data hub', '/data-hub'],
      ['For office use', '/office-use'],
      ['Archives', '/archives'],
    ],
  },
  {
    title: 'Opportunities',
    links: [
      ['Recruitments', '/recruitments'],
      ['Tenders / notices', '/tenders-notices'],
    ],
  },
];

export const primaryDestinations: Record<string, string> = {
  About: '/about-us',
  Employee: '/#services',
  Employer: '/#services',
  Pensioner: '/#services',
  'Legal Framework': '/#catalogue',
  Resources: '/resources',
  Opportunities: '/recruitments',
};

export const isExternal = (href: string) => /^https?:\/\//.test(href);
