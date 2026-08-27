'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import LanguageSelector from '../LanguageSelector';
import { ModernSelect } from './ModernSelect';
import { FileDropzone, type AttachedFile } from '../ui';

type MemberView =
  | 'overview'
  | 'passbook'
  | 'claims'
  | 'track'
  | 'kyc'
  | 'banking'
  | 'schemes'
  | 'history'
  | 'grievances'
  | 'profile';

type NoticeCategory = 'all' | 'action' | 'circulars' | 'updates';

type MemberDashboardProps = {
  onSignOut: () => void;
  initialTranslationLanguage?: string;
};

type RoleDashboardPreviewProps = {
  role: 'employer' | 'pensioner';
  displayName: string;
  onSignOut: () => void;
  initialTranslationLanguage?: string;
};

const viewLabels: Record<MemberView, string> = {
  overview: 'Overview',
  passbook: 'Passbook & Ledger',
  claims: 'Submit Online Claim',
  track: 'Track Claims',
  kyc: 'KYC & Nomination',
  banking: 'Banking Details',
  schemes: 'Schemes',
  history: 'Service History',
  grievances: 'Grievances',
  profile: 'Profile & preferences',
};

const notifications = [
  {
    id: 'DEMO-NOTICE-001',
    category: 'action' as const,
    level: 'Urgent',
    title: 'Verify bank account against UAN',
    body: 'Re-verify your seeded demo bank account number before submitting Form 31/19 claims. Ensure your bank IFSC, branch, and account title match your seeded UIDAI e-KYC record.',
    date: '25 Aug 2026',
    ref: 'EPFO/CIRC/2026/08-VERIFY',
    actionView: 'banking' as const,
    actionLabel: 'Review & Verify Bank Account →',
  },
  {
    id: 'DEMO-NOTICE-002',
    category: 'action' as const,
    level: 'Action required',
    title: 'Transfer pending from previous establishment',
    body: 'Service record DEMO-MID-00202 is eligible for One Member One EPF online transfer into your active account DEMO TECH SOLUTIONS LTD.',
    date: '24 Aug 2026',
    ref: 'EPFO/XFER/MID-00202/2026',
    actionView: 'history' as const,
    actionLabel: 'Initiate Online Transfer →',
  },
  {
    id: 'DEMO-NOTICE-003',
    category: 'circulars' as const,
    level: 'Circular',
    title: 'Statutory interest rate credited @ 8.25%',
    body: 'Annual statutory EPF interest calculation @ 8.25% has been credited to your synthetic member balance for the preceding financial year as approved by the Central Board of Trustees (CBT).',
    date: '22 Aug 2026',
    ref: 'CBT/STATUTORY/INT/8.25/2025-26',
    actionView: 'passbook' as const,
    actionLabel: 'View Interest in Passbook →',
  },
  {
    id: 'DEMO-NOTICE-004',
    category: 'updates' as const,
    level: 'Update',
    title: 'January 2026 contribution posted',
    body: 'Monthly statutory contribution of ₹ 6,840 deposited by DEMO TECH SOLUTIONS LTD (ECR Challan DEMO-ECR-99412). Verification completed by Field Office.',
    date: '20 Aug 2026',
    ref: 'ECR/CHALLAN/DEMO-ECR-99412',
    actionView: 'passbook' as const,
    actionLabel: 'View Monthly Credit →',
  },
  {
    id: 'DEMO-NOTICE-005',
    category: 'action' as const,
    level: 'Important',
    title: 'Aadhaar-linked mobile verification for online claims',
    body: 'Please ensure your Aadhaar-linked mobile number is active to receive high-security OTP authentication for all Form 31, 19, 10C, and 10D settlements. e-Nomination is not mandatory for Form 31 advances.',
    date: '26 Aug 2026',
    ref: 'EPFO/CLAIM/UIDAI-OTP/2026',
    actionView: 'claims' as const,
    actionLabel: 'Open Online Claims →',
  },
];

// Multi-establishment records
const establishments = [
  { id: 'all', name: 'All Establishments (Unified Statement)', mid: 'All MIDs', status: 'Unified' },
  { id: 'DEMO-EST-001', name: 'DEMO TECH SOLUTIONS LTD', mid: 'DEMO-MID-00101', status: 'Active (Current)' },
  { id: 'DEMO-EST-002', name: 'DEMO GLOBAL SERVICES PVT LTD', mid: 'DEMO-MID-00202', status: 'Previous (Transferred)' },
];

// Comprehensive multi-year passbook entries
const passbookData: Record<string, Array<{
  id: string;
  estId: string;
  estName: string;
  wageMonth: string;
  deposited: string;
  basicWage: number;
  employee: number;
  employerEpf: number;
  employerEps: number;
  type: 'credit' | 'debit' | 'interest';
  ecrChallan: string;
  status: string;
}>> = {
  '2025-26': [
    { id: 'DEMO-TX-2601', estId: 'DEMO-EST-001', estName: 'DEMO TECH SOLUTIONS LTD', wageMonth: 'Jan 2026', deposited: '05 Feb 2026', basicWage: 28500, employee: 3420, employerEpf: 2257, employerEps: 1163, type: 'credit', ecrChallan: 'DEMO-ECR-99412', status: 'Credited' },
    { id: 'DEMO-TX-2512', estId: 'DEMO-EST-001', estName: 'DEMO TECH SOLUTIONS LTD', wageMonth: 'Dec 2025', deposited: '06 Jan 2026', basicWage: 28500, employee: 3420, employerEpf: 2257, employerEps: 1163, type: 'credit', ecrChallan: 'DEMO-ECR-98124', status: 'Credited' },
    { id: 'DEMO-TX-2511', estId: 'DEMO-EST-001', estName: 'DEMO TECH SOLUTIONS LTD', wageMonth: 'Nov 2025', deposited: '05 Dec 2025', basicWage: 27500, employee: 3300, employerEpf: 2178, employerEps: 1122, type: 'credit', ecrChallan: 'DEMO-ECR-97210', status: 'Credited' },
    { id: 'DEMO-TX-2510', estId: 'DEMO-EST-001', estName: 'DEMO TECH SOLUTIONS LTD', wageMonth: 'Oct 2025', deposited: '07 Nov 2025', basicWage: 27500, employee: 3300, employerEpf: 2178, employerEps: 1122, type: 'credit', ecrChallan: 'DEMO-ECR-96041', status: 'Credited' },
    { id: 'DEMO-TX-2509', estId: 'DEMO-EST-001', estName: 'DEMO TECH SOLUTIONS LTD', wageMonth: 'Sep 2025', deposited: '06 Oct 2025', basicWage: 26500, employee: 3180, employerEpf: 2099, employerEps: 1081, type: 'credit', ecrChallan: 'DEMO-ECR-94812', status: 'Credited' },
    { id: 'DEMO-TX-2508', estId: 'DEMO-EST-001', estName: 'DEMO TECH SOLUTIONS LTD', wageMonth: 'Aug 2025', deposited: '05 Sep 2025', basicWage: 26500, employee: 3180, employerEpf: 2099, employerEps: 1081, type: 'credit', ecrChallan: 'DEMO-ECR-93902', status: 'Credited' },
    { id: 'DEMO-TX-2507', estId: 'DEMO-EST-001', estName: 'DEMO TECH SOLUTIONS LTD', wageMonth: 'Jul 2025', deposited: '06 Aug 2025', basicWage: 26500, employee: 3180, employerEpf: 2099, employerEps: 1081, type: 'credit', ecrChallan: 'DEMO-ECR-92841', status: 'Credited' },
    { id: 'DEMO-TX-2506', estId: 'DEMO-EST-001', estName: 'DEMO TECH SOLUTIONS LTD', wageMonth: 'Jun 2025', deposited: '05 Jul 2025', basicWage: 26500, employee: 3180, employerEpf: 2099, employerEps: 1081, type: 'credit', ecrChallan: 'DEMO-ECR-91720', status: 'Credited' },
    { id: 'DEMO-TX-2505', estId: 'DEMO-EST-001', estName: 'DEMO TECH SOLUTIONS LTD', wageMonth: 'May 2025', deposited: '06 Jun 2025', basicWage: 26500, employee: 3180, employerEpf: 2099, employerEps: 1081, type: 'credit', ecrChallan: 'DEMO-ECR-90412', status: 'Credited' },
    { id: 'DEMO-TX-2504', estId: 'DEMO-EST-001', estName: 'DEMO TECH SOLUTIONS LTD', wageMonth: 'Apr 2025', deposited: '05 May 2025', basicWage: 26500, employee: 3180, employerEpf: 2099, employerEps: 1081, type: 'credit', ecrChallan: 'DEMO-ECR-89210', status: 'Credited' },
  ],
  '2024-25': [
    { id: 'DEMO-TX-INT-25', estId: 'DEMO-EST-001', estName: 'DEMO TECH SOLUTIONS LTD', wageMonth: 'Annual Interest 2024-25', deposited: '31 Mar 2025', basicWage: 0, employee: 21540, employerEpf: 7880, employerEps: 0, type: 'interest', ecrChallan: 'STATUTORY-INT-8.25%', status: 'Credited' },
    { id: 'DEMO-TX-2503', estId: 'DEMO-EST-001', estName: 'DEMO TECH SOLUTIONS LTD', wageMonth: 'Mar 2025', deposited: '05 Apr 2025', basicWage: 25000, employee: 3000, employerEpf: 1980, employerEps: 1020, type: 'credit', ecrChallan: 'DEMO-ECR-88120', status: 'Credited' },
    { id: 'DEMO-TX-2502', estId: 'DEMO-EST-001', estName: 'DEMO TECH SOLUTIONS LTD', wageMonth: 'Feb 2025', deposited: '05 Mar 2025', basicWage: 25000, employee: 3000, employerEpf: 1980, employerEps: 1020, type: 'credit', ecrChallan: 'DEMO-ECR-87019', status: 'Credited' },
    { id: 'DEMO-TX-2501', estId: 'DEMO-EST-001', estName: 'DEMO TECH SOLUTIONS LTD', wageMonth: 'Jan 2025', deposited: '06 Feb 2025', basicWage: 25000, employee: 3000, employerEpf: 1980, employerEps: 1020, type: 'credit', ecrChallan: 'DEMO-ECR-85942', status: 'Credited' },
    { id: 'DEMO-TX-2412', estId: 'DEMO-EST-001', estName: 'DEMO TECH SOLUTIONS LTD', wageMonth: 'Dec 2024', deposited: '05 Jan 2025', basicWage: 25000, employee: 3000, employerEpf: 1980, employerEps: 1020, type: 'credit', ecrChallan: 'DEMO-ECR-84812', status: 'Credited' },
    { id: 'DEMO-TX-2411', estId: 'DEMO-EST-001', estName: 'DEMO TECH SOLUTIONS LTD', wageMonth: 'Nov 2024', deposited: '06 Dec 2024', basicWage: 25000, employee: 3000, employerEpf: 1980, employerEps: 1020, type: 'credit', ecrChallan: 'DEMO-ECR-83710', status: 'Credited' },
    { id: 'DEMO-TX-2410', estId: 'DEMO-EST-001', estName: 'DEMO TECH SOLUTIONS LTD', wageMonth: 'Oct 2024', deposited: '05 Nov 2024', basicWage: 25000, employee: 3000, employerEpf: 1980, employerEps: 1020, type: 'credit', ecrChallan: 'DEMO-ECR-82601', status: 'Credited' },
  ],
  '2023-24': [
    { id: 'DEMO-TX-INT-24', estId: 'DEMO-EST-002', estName: 'DEMO GLOBAL SERVICES PVT LTD', wageMonth: 'Annual Interest 2023-24', deposited: '31 Mar 2024', basicWage: 0, employee: 18450, employerEpf: 6720, employerEps: 0, type: 'interest', ecrChallan: 'STATUTORY-INT-8.15%', status: 'Credited' },
    { id: 'DEMO-TX-2403', estId: 'DEMO-EST-002', estName: 'DEMO GLOBAL SERVICES PVT LTD', wageMonth: 'Mar 2024', deposited: '06 Apr 2024', basicWage: 24000, employee: 2880, employerEpf: 1881, employerEps: 999, type: 'credit', ecrChallan: 'DEMO-ECR-79812', status: 'Transferred' },
    { id: 'DEMO-TX-2402', estId: 'DEMO-EST-002', estName: 'DEMO GLOBAL SERVICES PVT LTD', wageMonth: 'Feb 2024', deposited: '05 Mar 2024', basicWage: 24000, employee: 2880, employerEpf: 1881, employerEps: 999, type: 'credit', ecrChallan: 'DEMO-ECR-78401', status: 'Transferred' },
    { id: 'DEMO-TX-2401', estId: 'DEMO-EST-002', estName: 'DEMO GLOBAL SERVICES PVT LTD', wageMonth: 'Jan 2024', deposited: '06 Feb 2024', basicWage: 24000, employee: 2880, employerEpf: 1881, employerEps: 999, type: 'credit', ecrChallan: 'DEMO-ECR-77120', status: 'Transferred' },
  ],
};

const claimRows = [
  { id: 'DEMO-CLAIM-003', type: 'PF Advance — Medical (Form 31)', submitted: '18 Oct 2025', amount: '₹ 45,000', status: 'Settled', progress: 100, bankRef: 'DEMO-BANK-001' },
  { id: 'DEMO-CLAIM-002', type: 'Online Transfer Request (Form 13)', submitted: '12 Jul 2025', amount: 'Balance Transfer', status: 'Under review', progress: 62, bankRef: 'N/A (EPF to EPF)' },
  { id: 'DEMO-CLAIM-001', type: 'Final Settlement (Form 19 & 10C)', submitted: '08 Mar 2025', amount: '₹ 20,000', status: 'Action required', progress: 34, bankRef: 'DEMO-BANK-001' },
];

const serviceHistoryRecords = [
  {
    tier: 'primary' as const,
    tierLabel: 'Primary Member ID · Active Employment',
    tierTone: 'emerald',
    tag: 'Active Employer',
    tagTone: 'emerald',
    estCode: 'DL/CPM/DEMO00101',
    tenure: 'Mar 2024 – Present (1 yr 11 mos)',
    uan: 'DEMO-UAN-001',
    mid: 'DEMO-MID-00101',
    estName: 'DEMO TECH SOLUTIONS LTD',
    dojEpf: '18-03-2024',
    dojEps: '18-03-2024',
    doeEpf: 'Active (Currently Employed)',
    doeEps: 'Active (Currently Employed)',
    reasonForLeaving: '— (Active Contributory Service)',
    pfLastTransferred: '— (Active Accumulation Account)',
    pfStatus: 'Open / Contributory',
    pfBalance: '₹ 3,56,650',
    serviceStatus: 'Open',
    serviceBenefit: 'Active Coverage (No Claim Required)',
  },
  {
    tier: 'transfer' as const,
    tierLabel: 'Previous Service · Transfer Eligible',
    tierTone: 'orange',
    tag: 'Due for Transfer (Form 13)',
    tagTone: 'orange',
    estCode: 'MH/BAN/DEMO00202',
    tenure: 'Jan 2017 – Mar 2024 (7 yrs 2 mos)',
    uan: 'DEMO-UAN-001',
    mid: 'DEMO-MID-00202',
    estName: 'DEMO GLOBAL SERVICES PVT LTD',
    dojEpf: '18-01-2017',
    dojEps: '01-12-2021',
    doeEpf: '16-03-2024',
    doeEps: '16-03-2024',
    reasonForLeaving: 'EPF: Cessation (short service) · EPS: Cessation',
    pfLastTransferred: 'Pending Online Transfer to DEMO-MID-00101',
    pfStatus: 'Eligible for Online Transfer',
    pfBalance: '₹ 1,26,000',
    serviceStatus: 'Closed',
    serviceBenefit: 'Transfer Required to avoid duplicate accounts',
  },
  {
    tier: 'settled' as const,
    tierLabel: 'Historical Service · Reconciled',
    tierTone: 'slate',
    tag: 'Settled & Transferred',
    tagTone: 'slate',
    estCode: 'KN/BNG/DEMO00303',
    tenure: 'Jun 2014 – Dec 2016 (2 yrs 6 mos)',
    uan: 'DEMO-UAN-001',
    mid: 'DEMO-MID-00303',
    estName: 'DEMO PIONEER TECH INFRA',
    dojEpf: '10-06-2014',
    dojEps: '10-06-2014',
    doeEpf: '15-12-2016',
    doeEps: '15-12-2016',
    reasonForLeaving: 'EPF: Cessation · Transfer to subsequent employer',
    pfLastTransferred: 'Transferred into DEMO-MID-00202 (ECR Verified)',
    pfStatus: 'Transferred / Settled',
    pfBalance: '₹ 0 (Reconciled)',
    serviceStatus: 'Closed',
    serviceBenefit: 'Transfer Completed (Annexure K Archival)',
  },
];

interface KycRecord {
  id: string;
  type: 'Aadhaar' | 'PAN' | 'Bank' | 'Passport' | 'Voter ID' | 'Driving License';
  docNo: string;
  name: string;
  specifics: string;
  approvingAuthority: string;
  status: 'Verified' | 'Approved' | 'Pending Verification';
  signType: string;
  isDefault?: boolean;
  isActive?: boolean;
}

const initialKycItems: KycRecord[] = [
  {
    id: 'DEMO-KYC-001',
    type: 'Aadhaar',
    docNo: 'XXXX XXXX DEMO-8',
    name: 'DEMO MEMBER 001',
    specifics: 'DOB: 07-08-1991 · Linked Mobile: 9717XXXXXX',
    approvingAuthority: 'UIDAI API (Direct Demographic Verification)',
    status: 'Verified',
    signType: 'UIDAI e-KYC',
    isActive: true,
  },
  {
    id: 'DEMO-KYC-002',
    type: 'PAN',
    docNo: 'DEMO-PAN-001XX',
    name: 'DEMO MEMBER 001',
    specifics: 'DOB: 07-08-1991 · Tax Exemption Active (No TDS)',
    approvingAuthority: 'Income Tax Department (NSDL/ITD API)',
    status: 'Verified',
    signType: 'ITD API Match',
    isActive: true,
  },
  {
    id: 'DEMO-KYC-003',
    type: 'Bank',
    docNo: 'DEMO-ACCOUNT-001',
    name: 'DEMO MEMBER 001',
    specifics: 'DEMO NEO BANK · IFSC: DEMO-IFSC-001 · Savings A/C',
    approvingAuthority: 'Bank Direct API + Employer DSC',
    status: 'Verified',
    signType: 'Core Banking API',
    isDefault: true,
    isActive: true,
  },
  {
    id: 'DEMO-KYC-004',
    type: 'Passport',
    docNo: 'DEMO-PASS-001XX',
    name: 'DEMO MEMBER 001',
    specifics: 'Valid till: 15-12-2034 · Regional Passport Office, Delhi',
    approvingAuthority: 'Employer Digital Signature Certificate (DSC)',
    status: 'Approved',
    signType: 'Employer DSC',
    isActive: true,
  },
];

interface NomineeRecord {
  id: string;
  name: string;
  relation: string;
  share: number;
  aadhaar: string;
  dob?: string;
  guardianName?: string;
  photoUploaded: boolean;
}

const initialNominees: NomineeRecord[] = [
  { id: 'DEMO-NOM-01', name: 'DEMO SPOUSE', relation: 'Spouse', share: 70, aadhaar: 'XXXX-XXXX-DEMO-S', dob: '1993-04-12', photoUploaded: true },
  { id: 'DEMO-NOM-02', name: 'DEMO CHILD', relation: 'Son / Daughter', share: 30, aadhaar: 'XXXX-XXXX-DEMO-C', dob: '2018-09-20', guardianName: 'DEMO SPOUSE', photoUploaded: true },
];

export interface BankAccountItem {
  id: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  accountType: 'savings' | 'current'; // ONLY savings or current accounts (no salary account)
  isPrimary: boolean;
  status: 'Verified' | 'Pending Verification';
  branchName?: string;
}

const initialBankAccounts: BankAccountItem[] = [
  {
    id: 'DEMO-ACC-001',
    bankName: 'DEMO STATE BANK OF INDIA',
    accountNumber: 'DEMO-ACCOUNT-001',
    ifscCode: 'DEMO-IFSC-001',
    accountHolderName: 'DEMO MEMBER 001',
    accountType: 'savings',
    isPrimary: true,
    status: 'Verified',
    branchName: 'NEO BANKING CENTRAL BRANCH',
  },
];

function formatMoney(value: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
}

function StatusPill({ children }: { children: string }) {
  return <span className={`portal-status portal-status-${children.toLowerCase().replaceAll(' ', '-')}`}>{children}</span>;
}

export default function MemberDashboard({ onSignOut, initialTranslationLanguage }: MemberDashboardProps) {
  const [activeView, setActiveView] = useState<MemberView>('overview');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [noticeCategory, setNoticeCategory] = useState<NoticeCategory>('all');
  const [toast, setToast] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [passbookYear, setPassbookYear] = useState('all');
  const [passbookEst, setPassbookEst] = useState('all');
  const [passbookFilter, setPassbookFilter] = useState<'all' | 'credit' | 'debit' | 'interest'>('all');
  const [kycSection, setKycSection] = useState<'kyc' | 'nomination'>('kyc');
  const [kycList, setKycList] = useState<KycRecord[]>(initialKycItems);
  const [nomineeList, setNomineeList] = useState<NomineeRecord[]>(initialNominees);
  const [bankAccounts, setBankAccounts] = useState<BankAccountItem[]>(initialBankAccounts);
  const [addBankModalOpen, setAddBankModalOpen] = useState(false);
  const [editingBankAccount, setEditingBankAccount] = useState<BankAccountItem | null>(null);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [transferAttestation, setTransferAttestation] = useState('present');
  const [addKycModalOpen, setAddKycModalOpen] = useState(false);
  const [editingKyc, setEditingKyc] = useState<KycRecord | null>(null);
  const [nomineeModalOpen, setNomineeModalOpen] = useState(false);
  const [editingNominee, setEditingNominee] = useState<NomineeRecord | null>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [profileName, setProfileName] = useState('DEMO MEMBER 001');
  const [profileNameDraft, setProfileNameDraft] = useState('DEMO MEMBER 001');

  const handleOpenAddBank = () => {
    setEditingBankAccount(null);
    setAddBankModalOpen(true);
  };

  const handleOpenEditBank = (bank: BankAccountItem) => {
    setEditingBankAccount(bank);
    setAddBankModalOpen(true);
  };

  const handleSetPrimaryBank = (id: string) => {
    setBankAccounts((prev) =>
      prev.map((acc) => ({
        ...acc,
        isPrimary: acc.id === id,
      }))
    );
    const target = bankAccounts.find((b) => b.id === id);
    showToast(`Primary settlement bank switched to ${target?.accountNumber || 'selected bank'}.`);
  };

  const handleDeleteBank = (id: string) => {
    if (bankAccounts.length <= 1) return;
    setBankAccounts((prev) => {
      const remaining = prev.filter((b) => b.id !== id);
      if (prev.find((b) => b.id === id)?.isPrimary && remaining.length > 0) {
        remaining[0].isPrimary = true;
      }
      return remaining;
    });
    showToast('Bank account removed from linked settlement destinations.');
  };

  const handleSaveBankAccount = (bank: BankAccountItem) => {
    setBankAccounts((prev) => {
      const idx = prev.findIndex((b) => b.id === bank.id);
      let updated: BankAccountItem[];
      if (idx >= 0) {
        updated = [...prev];
        updated[idx] = bank;
      } else {
        updated = [...prev, bank];
      }

      if (bank.isPrimary) {
        updated = updated.map((b) => ({
          ...b,
          isPrimary: b.id === bank.id,
        }));
      }
      return updated;
    });
    showToast(`Bank account ${bank.accountNumber} saved successfully.`);
  };

  const handleSetDefaultBank = (id: string) => {
    setKycList((prev) =>
      prev.map((item) => {
        if (item.type !== 'Bank') return item;
        return { ...item, isDefault: item.id === id };
      })
    );
    const target = kycList.find((k) => k.id === id);
    showToast(`Simulated primary bank switched to ${target?.docNo || 'selected bank'}.`);
  };

  const handleOpenAddKyc = () => {
    setEditingKyc(null);
    setAddKycModalOpen(true);
  };

  const handleOpenEditKyc = (record: KycRecord) => {
    setEditingKyc(record);
    setAddKycModalOpen(true);
  };

  const handleSaveKycRecord = (record: KycRecord) => {
    setKycList((prev) => {
      let updated = [...prev];
      const existingIndex = updated.findIndex((k) => k.id === record.id);
      if (existingIndex >= 0) {
        if (record.type === 'Bank' && record.isDefault) {
          updated = updated.map((k) => (k.type === 'Bank' ? { ...k, isDefault: false } : k));
        }
        if (record.type === 'Passport' && record.isActive) {
          updated = updated.map((k) => (k.type === 'Passport' ? { ...k, isActive: false } : k));
        }
        updated[existingIndex] = record;
      } else {
        if (record.type === 'Bank' && record.isDefault) {
          updated = updated.map((k) => (k.type === 'Bank' ? { ...k, isDefault: false } : k));
        }
        if (record.type === 'Passport' && record.isActive) {
          updated = updated.map((k) => (k.type === 'Passport' ? { ...k, isActive: false } : k));
        }
        updated.push(record);
      }
      return updated;
    });
    showToast(`Simulated ${record.type} KYC saved.`);
  };

  const handleOpenAddNominee = () => {
    setEditingNominee(null);
    setNomineeModalOpen(true);
  };

  const handleOpenEditNominee = (nom: NomineeRecord) => {
    setEditingNominee(nom);
    setNomineeModalOpen(true);
  };

  const handleDeleteNominee = (id: string) => {
    setNomineeList((prev) => prev.filter((n) => n.id !== id));
    showToast('Nominee removed from digital nomination record.');
  };

  const handleSaveNominee = (nominee: NomineeRecord) => {
    setNomineeList((prev) => {
      const existingIndex = prev.findIndex((n) => n.id === nominee.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = nominee;
        return updated;
      }
      return [...prev, nominee];
    });
    showToast('Nominee record saved with simulated Aadhaar e-Sign.');
  };

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const claimDialog = useRef<HTMLDialogElement>(null);
  const mainArea = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!profileMenuOpen) return;

    function closeProfileMenu(event: PointerEvent) {
      if (!profileMenuRef.current?.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setProfileMenuOpen(false);
      }
    }

    document.addEventListener('pointerdown', closeProfileMenu);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeProfileMenu);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [profileMenuOpen]);

  const filteredNotifications = notifications.filter(
    (notice) => noticeCategory === 'all' || notice.category === noticeCategory,
  );

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const serviceSearch = [
      { label: 'View complete passbook & ledger', view: 'passbook' as const },
      { label: 'Submit online claim (Form 31, 19, 10C)', view: 'claims' as const },
      { label: 'Track submitted claims', view: 'track' as const },
      { label: 'Review KYC & e-Nomination', view: 'kyc' as const },
      { label: 'Update demo banking details', view: 'banking' as const },
      { label: 'Review member service history', view: 'history' as const },
      { label: 'One Member One EPF transfer', view: 'history' as const },
      { label: 'Grievance support (EPFiGMS)', view: 'grievances' as const },
    ];
    return query ? serviceSearch.filter((item) => item.label.toLowerCase().includes(query)) : [];
  }, [searchQuery]);

  function showToast(message: string) {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 4000);
  }

  function openView(view: MemberView) {
    if (view === 'grievances') {
      window.open('/grievance', '_blank', 'noopener,noreferrer');
      setSearchQuery('');
      setNotificationOpen(false);
      setProfileMenuOpen(false);
      return;
    }
    setActiveView(view);
    setSearchQuery('');
    setNotificationOpen(false);
    mainArea.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function saveSyntheticProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextName = profileNameDraft.trim().toUpperCase();
    if (!/^DEMO MEMBER \d{3}$/.test(nextName)) {
      showToast('Use the synthetic display-name format: DEMO MEMBER 001.');
      return;
    }

    setProfileName(nextName);
    setProfileMenuOpen(false);
    showToast('Synthetic profile display name updated for this dashboard session.');
  }

  function toggleProfileMenu() {
    setProfileMenuOpen((open) => !open);
  }

  const profileInitials = profileName.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('');

  function handleClaimSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    claimDialog.current?.showModal();
  }

  return (
    <div className="modern-portal-layout glass-member-portal">
      <div className="portal-workspace-body">
        <aside className="portal-sidebar glass-portal-sidebar" aria-label="Member portal navigation">
          <div className="sidebar-brand-head">
            <div className="sidebar-logo-box">
              <span className="sidebar-logo-icon">EP</span>
              <div className="sidebar-brand-text">
                <strong>EPFO Unified Portal</strong>
                <small>Member services & passbook hub</small>
              </div>
            </div>
          </div>

          <nav className="sidebar-nav-scroll">
            <PortalNavGroup
              heading="Account & ledger"
              activeView={activeView}
              onSelect={openView}
              items={[
                ['overview', 'Overview'],
                ['passbook', 'Passbook & Ledger'],
                ['history', 'Service History'],
              ]}
            />
            <PortalNavGroup
              heading="Claims & verification"
              activeView={activeView}
              onSelect={openView}
              items={[
                ['claims', 'Online Claims'],
                ['track', 'Track Claims'],
                ['kyc', 'KYC & Nomination'],
                ['banking', 'Banking Details'],
              ]}
            />
            <PortalNavGroup
              heading="Services & support"
              activeView={activeView}
              onSelect={openView}
              items={[
                ['schemes', 'Schemes & PMVBRY'],
                ['grievances', 'Grievances & Help'],
              ]}
            />
          </nav>

          <div className="profile-launcher" ref={profileMenuRef}>
            <button
              type="button"
              className="sidebar-member-card glass-account-card"
              aria-expanded={profileMenuOpen}
              aria-haspopup="dialog"
              aria-controls="member-profile-menu"
              onClick={toggleProfileMenu}
            >
              <span className="sm-avatar" aria-hidden="true">{profileInitials}</span>
              <span className="sm-info">
                <strong className="sm-name">{profileName}</strong>
                <span className="sm-uan">UAN: DEMO-UAN-001</span>
              </span>
              <span className="profile-launcher-chevron" aria-hidden="true">⌃</span>
            </button>

            {profileMenuOpen && (
              <div id="member-profile-menu" className="member-profile-menu" role="dialog" aria-modal="false" aria-label="Member profile menu">
                <div className="member-profile-menu-head">
                  <span className="sm-avatar" aria-hidden="true">{profileInitials}</span>
                  <div><strong>{profileName}</strong><small>Member dashboard</small></div>
                </div>
                <button type="button" className="member-profile-menu-action" onClick={() => { openView('profile'); setProfileMenuOpen(false); }}><span>Profile & preferences</span><small>Open profile page</small></button>
                <a href="/grievance" target="_blank" rel="noopener noreferrer" className="member-profile-menu-action" onClick={() => { openView('grievances'); setProfileMenuOpen(false); }}><span>Grievances & Help ↗</span><small>Open portal in new tab</small></a>
                <button type="button" className="member-profile-menu-action danger" onClick={onSignOut}><span>End simulated session</span><small>Return to sign in</small></button>
              </div>
            )}
          </div>
        </aside>

        <div ref={mainArea} className="portal-main-area">
          <header className="portal-top-bar glass-portal-topbar">
            <div className="topbar-title-section">
              <h1 className="topbar-heading">{viewLabels[activeView]}</h1>
            </div>

            <div className="topbar-controls">
              <div className="portal-language-control">
                <LanguageSelector reloadAfterChange initialTranslationLanguage={initialTranslationLanguage} />
              </div>
              <div className="topbar-search portal-search-wrap">
                <span className="search-svg" aria-hidden="true">⌕</span>
                <input
                  type="search"
                  placeholder="Find a service, passbook or claim..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="topbar-search-input"
                  aria-label="Find a member service"
                />
                {searchResults.length > 0 && (
                  <div className="portal-search-results" role="listbox" aria-label="Matching services">
                    {searchResults.map((result) => (
                      <button key={result.view} type="button" onClick={() => openView(result.view)}>
                        <span>{result.label}</span><b>Open →</b>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                className={`topbar-icon-button ${notificationOpen ? 'active' : ''}`}
                aria-label={`${notifications.length} notifications`}
                aria-expanded={notificationOpen}
                aria-controls="member-notification-center"
                onClick={() => setNotificationOpen((open) => !open)}
              >
                <svg className="bell-svg-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span className="notif-badge">{notifications.length}</span>
              </button>
            </div>
          </header>

          {/* Universal Full-Width Statutory Notices Ticker across all dashboard views */}
          <div className="portal-universal-ticker-bar">
            <StatutoryTicker onOpenNotifications={() => setNotificationOpen(true)} />
          </div>

          {notificationOpen && (
            <NotificationDrawer
              notices={filteredNotifications}
              category={noticeCategory}
              onCategoryChange={setNoticeCategory}
              onClose={() => setNotificationOpen(false)}
              onOpenAction={openView}
            />
          )}

          {toast && <div className="portal-toast" role="status" aria-live="polite">{toast}</div>}

          <main className="portal-content-view glass-portal-content">
            {activeView === 'overview' && <OverviewView onOpen={openView} />}
            {activeView === 'passbook' && (
              <FullPassbookView
                year={passbookYear}
                onYearChange={setPassbookYear}
                establishment={passbookEst}
                onEstablishmentChange={setPassbookEst}
                filter={passbookFilter}
                onFilterChange={setPassbookFilter}
                onToast={showToast}
              />
            )}
            {activeView === 'claims' && (
              <OverhauledClaimsView
                onSubmit={handleClaimSubmit}
                onOpenBanking={() => openView('banking')}
                onOpenKyc={() => openView('kyc')}
                onToast={showToast}
              />
            )}
            {activeView === 'track' && <TrackClaimsView onOpenClaim={() => openView('claims')} />}
            {activeView === 'kyc' && (
              <ComprehensiveKycView
                section={kycSection}
                onSectionChange={setKycSection}
                nominees={nomineeList}
                kycList={kycList}
                onSetDefaultBank={handleSetDefaultBank}
                onAddKycClick={handleOpenAddKyc}
                onEditKycClick={handleOpenEditKyc}
                onAddNomineeClick={handleOpenAddNominee}
                onEditNomineeClick={handleOpenEditNominee}
                onDeleteNominee={handleDeleteNominee}
                onToast={showToast}
              />
            )}
            {activeView === 'banking' && (
              <BankingView
                bankAccounts={bankAccounts}
                onAddBankClick={handleOpenAddBank}
                onEditBankClick={handleOpenEditBank}
                onSetPrimaryBank={handleSetPrimaryBank}
                onDeleteBank={handleDeleteBank}
              />
            )}
            {activeView === 'schemes' && <SchemesView onToast={showToast} />}
            {activeView === 'history' && (
              <EnhancedServiceHistoryView
                onOpenPassbook={() => openView('passbook')}
                onOpenClaim={() => openView('claims')}
                onInitiateTransfer={() => setTransferModalOpen(true)}
                onToast={showToast}
              />
            )}
            {activeView === 'grievances' && <GrievanceView />}
            {activeView === 'profile' && <ProfileView profileName={profileName} profileNameDraft={profileNameDraft} onNameChange={setProfileNameDraft} onSubmit={saveSyntheticProfile} />}
            <p className="dashboard-prototype-disclosure notranslate" translate="no">Prototype — synthetic data only.</p>
          </main>
        </div>
      </div>

      {/* Claim Confirmation Dialog */}
      <dialog ref={claimDialog} className="portal-dialog" aria-labelledby="claim-success-heading">
        <form method="dialog">
          <span className="dialog-success-mark" aria-hidden="true">✓</span>
          <p className="panel-eyebrow">Simulation complete</p>
          <h2 id="claim-success-heading">Online Claim Submitted for Prototype Review</h2>
          <p>
            Simulated reference <strong>DEMO-CLAIM-NEW-8841</strong> has been generated.
            No EPFO production system, employer, bank or notification gateway was contacted.
          </p>
          <div className="dialog-next-step">
            <b>Next statutory milestones:</b>
            <span>1. Automated Field Office Allocation → 2. Section Verification → 3. NEFT Dispatch to Seeded Bank.</span>
          </div>
          <button type="submit" className="topbar-action-btn">Close Confirmation</button>
        </form>
      </dialog>

      {/* Online Transfer Modal Simulation */}
      {transferModalOpen && (
        <div className="portal-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="transfer-modal-title">
          <div className="portal-modal-card">
            <div className="panel-heading-row">
              <div>
                <p className="panel-eyebrow">One Member One EPF</p>
                <h2 id="transfer-modal-title">Initiate Online Service Transfer</h2>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setTransferModalOpen(false)}>×</button>
            </div>
            <p className="modal-lead">Transfer past PF balance and eligible pension service from <strong>DEMO GLOBAL SERVICES (DEMO-MID-00202)</strong> to your active account <strong>DEMO TECH SOLUTIONS (DEMO-MID-00101)</strong>.</p>
            <div className="transfer-summary-box">
              <div><small>Source Member ID</small><strong>DEMO-MID-00202</strong><span>DEMO GLOBAL SERVICES</span></div>
              <div className="transfer-arrow-icon">➔</div>
              <div><small>Target Member ID</small><strong>DEMO-MID-00101</strong><span>DEMO TECH SOLUTIONS (Active)</span></div>
            </div>
            <div className="form-grid" style={{ marginTop: '1rem' }}>
              <div className="form-field-group">
                <label>Attestation through</label>
                <ModernSelect
                  value={transferAttestation}
                  onChange={setTransferAttestation}
                  options={[
                    { value: 'present', label: 'Present Employer', sublabel: 'DEMO TECH SOLUTIONS LTD (DEMO-MID-00101)', badge: 'Recommended', badgeTone: 'emerald' },
                    { value: 'previous', label: 'Previous Employer', sublabel: 'DEMO GLOBAL SERVICES (DEMO-MID-00202)', badge: 'Alternative', badgeTone: 'slate' },
                  ]}
                />
              </div>
              <label>Simulated Aadhaar e-Sign<input defaultValue="DEMO-AADHAAR-OTP-CHECKED" readOnly /></label>
            </div>
            <div className="modal-action-row">
              <button type="button" className="form-secondary-action" onClick={() => setTransferModalOpen(false)}>Cancel</button>
              <button
                type="button"
                className="panel-primary-action"
                onClick={() => {
                  setTransferModalOpen(false);
                  showToast('Simulated Form 13 transfer request DEMO-XFER-9912 submitted.');
                }}
              >
                Submit Transfer Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Update / Edit KYC Document Drawer */}
      <AddKycDrawer
        isOpen={addKycModalOpen}
        onClose={() => {
          setAddKycModalOpen(false);
          setEditingKyc(null);
        }}
        existingKyc={kycList}
        editingKyc={editingKyc}
        onSaveKyc={handleSaveKycRecord}
      />

      {/* Add / Edit Nominee Details Drawer */}
      <AddNomineeDrawer
        isOpen={nomineeModalOpen}
        onClose={() => {
          setNomineeModalOpen(false);
          setEditingNominee(null);
        }}
        editingNominee={editingNominee}
        existingNominees={nomineeList}
        onSaveNominee={handleSaveNominee}
      />

      {/* Add / Edit Bank Account Drawer */}
      <AddBankDrawer
        isOpen={addBankModalOpen}
        onClose={() => {
          setAddBankModalOpen(false);
          setEditingBankAccount(null);
        }}
        editingBank={editingBankAccount}
        onSaveBank={handleSaveBankAccount}
      />
    </div>
  );
}

function PortalNavGroup({
  heading,
  items,
  activeView,
  onSelect,
}: {
  heading: string;
  items: Array<[MemberView, string]>;
  activeView: MemberView;
  onSelect: (view: MemberView) => void;
}) {
  return (
    <div className="nav-group-section">
      <span className="nav-group-heading">{heading}</span>
      <ul className="sidebar-menu-list">
        {items.map(([view, label]) => {
          const isExternal = view === 'grievances';
          return (
            <li key={view}>
              {isExternal ? (
                <a
                  href="/grievance"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sidebar-nav-link external-link"
                  onClick={() => onSelect(view)}
                >
                  <PortalNavIcon view={view} />
                  <span>{label}</span>
                  <span className="external-nav-icon" aria-hidden="true" style={{ marginLeft: 'auto', opacity: 0.6 }}>↗</span>
                </a>
              ) : (
                <button
                  type="button"
                  className={`sidebar-nav-link ${activeView === view ? 'active' : ''}`}
                  aria-current={activeView === view ? 'page' : undefined}
                  onClick={() => onSelect(view)}
                >
                  <PortalNavIcon view={view} />
                  <span>{label}</span>
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function PortalNavIcon({ view }: { view: MemberView }) {
  const paths = {
    overview: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    passbook: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z" /><path d="M4 5.5v16" /><path d="M8 7h8M8 11h8" /></>,
    history: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3.5 2" /></>,
    claims: <><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v5h5M9 13l2 2 4-4" /></>,
    track: <><path d="M12 21s6-5.1 6-11A6 6 0 0 0 6 10c0 5.9 6 11 6 11z" /><circle cx="12" cy="10" r="2" /></>,
    kyc: <><path d="M12 3l7 3v5c0 4.7-3 7.8-7 10-4-2.2-7-5.3-7-10V6z" /><path d="M9 11.5l2 2 4-4" /></>,
    banking: <><path d="M3 9l9-5 9 5" /><path d="M5 10h14M5 20h14M7 10v10M12 10v10M17 10v10" /></>,
    schemes: <><path d="M5 5h10l4 4v10H5z" /><path d="M15 5v4h4M9 14h6M12 11v6" /></>,
    grievances: <><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.5 8.5 0 0 1-3.4-.7L4 20l1.3-3.5A7.2 7.2 0 0 1 4 12a8 8 0 0 1 16-.5z" /><path d="M8.5 11.5h7M8.5 15h4" /></>,
    profile: <><circle cx="12" cy="8" r="4" /><path d="M4.5 21a7.5 7.5 0 0 1 15 0" /></>,
  } satisfies Record<MemberView, React.ReactNode>;

  return <svg className="nav-icon-tile" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[view]}</svg>;
}

function NotificationDrawer({
  notices,
  category,
  onCategoryChange,
  onClose,
  onOpenAction,
}: {
  notices: typeof notifications;
  category: NoticeCategory;
  onCategoryChange: (category: NoticeCategory) => void;
  onClose: () => void;
  onOpenAction: (view: MemberView) => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [detailNotice, setDetailNotice] = useState<typeof notifications[0] | null>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (detailNotice) {
          setDetailNotice(null);
        } else {
          onClose();
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [detailNotice, onClose]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div id="member-notification-center" className="drawer-portal-root" role="dialog" aria-modal="true" aria-labelledby="notification-drawer-title">
      <div className="drawer-backdrop" onClick={onClose} aria-hidden="true" />
      <aside className="notification-drawer" aria-label="Member notification center">
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-header-copy">
            <span className="drawer-eyebrow">Member notification center</span>
            <div className="drawer-title-row">
              <h2 id="notification-drawer-title">{detailNotice ? 'Notice Details' : 'Notices & Alerts'}</h2>
              {!detailNotice && <span className="drawer-badge-count">{notices.length} unread</span>}
            </div>
          </div>
          <button type="button" className="drawer-close-btn" aria-label="Close notification center" onClick={onClose}>
            ×
          </button>
        </div>

        {detailNotice ? (
          /* Single Notice Expanded Page / Detail View */
          <div className="drawer-detail-view">
            <button type="button" className="drawer-back-btn" onClick={() => setDetailNotice(null)}>
              ← Back to all notices
            </button>
            <article className={`drawer-detail-card category-${detailNotice.category}`}>
              <div className="compact-meta-row">
                <span className={`compact-level-pill level-${detailNotice.category}`}>{detailNotice.level}</span>
                <span className="compact-date">{detailNotice.date}</span>
              </div>
              <h3 className="drawer-detail-title">{detailNotice.title}</h3>
              <div className="drawer-ref-pill">Reference: <code>{detailNotice.ref}</code></div>
              <p className="drawer-detail-body">{detailNotice.body}</p>

              <div className="drawer-detail-actions">
                <button
                  type="button"
                  className="drawer-primary-action"
                  onClick={() => {
                    onOpenAction(detailNotice.actionView);
                    onClose();
                  }}
                >
                  {detailNotice.actionLabel}
                </button>
                <button
                  type="button"
                  className="drawer-secondary-action"
                  onClick={() => setDetailNotice(null)}
                >
                  Dismiss Detail View
                </button>
              </div>
            </article>
          </div>
        ) : (
          /* List View with Compact Cards & In-Drawer Expand */
          <>
            {/* Category Filter Pills */}
            <div className="drawer-categories-bar" aria-label="Filter notices">
              {(['all', 'action', 'circulars', 'updates'] as NoticeCategory[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`drawer-category-pill ${category === item ? 'active' : ''}`}
                  onClick={() => onCategoryChange(item)}
                >
                  {item === 'all' ? 'All' : item === 'action' ? 'Action required' : item[0].toUpperCase() + item.slice(1)}
                </button>
              ))}
            </div>

            {/* Notification Items List */}
            <div className="drawer-notices-list">
              {notices.length === 0 ? (
                <div className="drawer-empty-state">
                  <span className="empty-bell-icon" aria-hidden="true">🔔</span>
                  <p>No notices in this category</p>
                </div>
              ) : (
                notices.map((notice) => {
                  const isExpanded = expandedId === notice.id;
                  return (
                    <article
                      key={notice.id}
                      className={`compact-notice-card category-${notice.category} ${isExpanded ? 'expanded' : ''}`}
                    >
                      <div
                        className="compact-notice-head"
                        onClick={() => toggleExpand(notice.id)}
                        role="button"
                        tabIndex={0}
                        aria-expanded={isExpanded}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            toggleExpand(notice.id);
                          }
                        }}
                      >
                        <div className="compact-notice-info">
                          <div className="compact-meta-row">
                            <span className={`compact-level-pill level-${notice.category}`}>{notice.level}</span>
                            <span className="compact-date">{notice.date}</span>
                          </div>
                          <h3 className="compact-title">{notice.title}</h3>
                          {!isExpanded && <p className="compact-snippet">{notice.body}</p>}
                        </div>
                        <span className={`compact-expand-icon ${isExpanded ? 'rotated' : ''}`} aria-hidden="true">
                          ⌄
                        </span>
                      </div>

                      {isExpanded && (
                        <div className="compact-expanded-body">
                          <p className="expanded-text">{notice.body}</p>
                          <div className="expanded-meta-tag">
                            <small>Reference:</small> <code>{notice.ref}</code>
                          </div>
                          <div className="expanded-btn-row">
                            <button
                              type="button"
                              className="expanded-action-btn"
                              onClick={() => {
                                onOpenAction(notice.actionView);
                                onClose();
                              }}
                            >
                              {notice.actionLabel}
                            </button>
                            <button
                              type="button"
                              className="expanded-view-page-btn"
                              onClick={() => setDetailNotice(notice)}
                            >
                              Open full notice →
                            </button>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })
              )}
            </div>

            <div className="drawer-footer-boundary">
              <span>Prototype notices only. No live statutory feed is connected.</span>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

function OverviewView({ onOpen }: { onOpen: (view: MemberView) => void }) {
  const latestContributions = passbookData['2025-26'].slice(0, 5);

  return (
    <div className="portal-view-stack">
      <section className="overview-summary-grid" aria-label="EPF accumulation and latest credit">
        <div className="overview-hero-glass">
          <div>
            <p className="panel-eyebrow">Your Total EPF Accumulation</p>
            <h2>₹ 4,82,650</h2>
            <span>Employee: ₹ 3,62,400 · Employer EPF: ₹ 1,20,250 · Pension Fund (EPS): ₹ 1,48,200</span>
          </div>
          <div className="overview-hero-actions">
            <button type="button" onClick={() => onOpen('passbook')}>View Full Passbook & Ledger</button>
            <button type="button" onClick={() => onOpen('claims')}>File Online Claim</button>
          </div>
        </div>
        <MetricCard label="Latest monthly credit" value="₹ 6,840" note="January 2026 · Credited" tone="emerald" />
      </section>

      <section className="portal-kpi-grid portal-kpi-grid--compact" aria-label="Member summary">
        <MetricCard label="Active service duration" value="9 yrs 2 mos" note="DEMO-TECH-SOLUTIONS" tone="blue" />
        <MetricCard label="KYC verification status" value="4 of 4" note="Aadhaar, PAN, Bank, Passport" tone="violet" />
        <MetricCard label="Pending transfers" value="1 eligible" note="From DEMO-GLOBAL-SERVICES" tone="orange" />
      </section>

      <section className="portal-dashboard-grid">
        {/* Passbook Lite Snapshot on Dashboard with Deep Link */}
        <article className="portal-panel activity-panel">
          <div className="panel-heading-row">
            <div>
              <p className="panel-eyebrow">Passbook Lite</p>
              <h2>Last 5 Monthly Contributions</h2>
            </div>
            <button type="button" onClick={() => onOpen('passbook')}>Open Complete Passbook →</button>
          </div>
          <div className="responsive-table-wrap">
            <table className="portal-data-table">
              <thead>
                <tr>
                  <th>Sr No.</th>
                  <th>Wage Month</th>
                  <th>Employee Share</th>
                  <th>Employer EPF (3.67%)</th>
                  <th>Pension EPS (8.33%)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {latestContributions.map((row, idx) => (
                  <tr key={row.id}>
                    <td>{idx + 1}</td>
                    <td><strong>{row.wageMonth}</strong><small>{row.deposited}</small></td>
                    <td><strong>{formatMoney(row.employee)}</strong></td>
                    <td>{formatMoney(row.employerEpf)}</td>
                    <td>{formatMoney(row.employerEps)}</td>
                    <td><StatusPill>{row.status}</StatusPill></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <aside className="portal-panel readiness-panel">
          <div className="panel-heading-row">
            <div><p className="panel-eyebrow">Claim readiness checklist</p><h2>Pre-Claim Status</h2></div>
            <span className="readiness-score">4/4</span>
          </div>
          <ul className="readiness-list">
            <li className="done"><span>✓</span><div><b>Aadhaar Authentication</b><small>Direct UIDAI match verified</small></div></li>
            <li className="done"><span>✓</span><div><b>PAN Linkage</b><small>Approved via Employer DSC (No TDS surcharge)</small></div></li>
            <li className="done"><span>✓</span><div><b>Bank Account Re-verification</b><small>Online verified by core banking API</small></div></li>
            <li className="done"><span>✓</span><div><b>e-Nomination Completed</b><small>2 active nominees allocated (100%)</small></div></li>
          </ul>
          <button type="button" className="panel-primary-action" onClick={() => onOpen('claims')}>Start Claim Filing</button>
        </aside>
      </section>

    </div>
  );
}

function MetricCard({ label, value, note, tone }: { label: string; value: string; note: string; tone: string }) {
  return (
    <article className="kpi-card glass-kpi-card">
      <span className={`metric-dot ${tone}`} aria-hidden="true" />
      <span className="kpi-label">{label}</span>
      <strong className="kpi-val">{value}</strong>
      <small>{note}</small>
    </article>
  );
}

/* =========================================================================
   COMPREHENSIVE FULL PASSBOOK & FINANCIAL LEDGER
   ========================================================================= */
function FullPassbookView({
  year,
  onYearChange,
  establishment,
  onEstablishmentChange,
  filter,
  onFilterChange,
  onToast,
}: {
  year: string;
  onYearChange: (year: string) => void;
  establishment: string;
  onEstablishmentChange: (est: string) => void;
  filter: 'all' | 'credit' | 'debit' | 'interest';
  onFilterChange: (filter: 'all' | 'credit' | 'debit' | 'interest') => void;
  onToast: (message: string) => void;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 12;

  // Gather rows based on year selection
  const allYearRows = useMemo(() => {
    if (year === 'all') {
      return Object.values(passbookData).flat();
    }
    return passbookData[year] || [];
  }, [year]);

  // Filter rows by establishment and transaction type
  const filteredRows = useMemo(() => {
    return allYearRows.filter((r) => {
      const matchEst = establishment === 'all' || r.estId === establishment;
      const matchType = filter === 'all' || r.type === filter;
      return matchEst && matchType;
    });
  }, [allYearRows, establishment, filter]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage) || 1;
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredRows.slice(start, start + rowsPerPage);
  }, [filteredRows, currentPage]);

  const employeeTotal = filteredRows.reduce((sum, row) => sum + row.employee, 0);
  const employerEpfTotal = filteredRows.reduce((sum, row) => sum + row.employerEpf, 0);
  const employerEpsTotal = filteredRows.reduce((sum, row) => sum + row.employerEps, 0);
  const grandTotal = employeeTotal + employerEpfTotal;

  const currentEstLabel = establishments.find((e) => e.id === establishment)?.name ?? 'All Establishments';

  return (
    <div className="portal-view-stack passbook-view-stack">
      {/* Slim & Compact Header & Filter Section */}
      <section className="passbook-filter-card glass-panel-compact">
        <div className="passbook-filter-header">
          <p className="panel-eyebrow">Unified Passbook & Statutory Ledger</p>
          <h2>Contribution Statement & Ledger</h2>
          <span className="passbook-filter-subtitle">
            Showing transactions for <strong>{year === 'all' ? 'All Financial Years (Unified)' : year}</strong> · <strong>{currentEstLabel}</strong>
          </span>
        </div>
        <div className="passbook-filter-controls">
          <div className="passbook-filter-field">
            <span className="passbook-filter-label">Financial Year</span>
            <ModernSelect
              size="compact"
              value={year}
              onChange={(val) => {
                onYearChange(val);
                setCurrentPage(1);
              }}
              options={[
                { value: 'all', label: 'All Financial Years (Unified)', sublabel: 'Consolidated multi-year statement', badge: 'Unified', badgeTone: 'orange' },
                { value: '2025-26', label: 'FY 2025-26 (Current)', sublabel: 'Active year monthly wage credits', badge: 'Active', badgeTone: 'emerald' },
                { value: '2024-25', label: 'FY 2024-25', sublabel: 'Previous financial year ledger & interest', badge: 'Settled', badgeTone: 'slate' },
                { value: '2023-24', label: 'FY 2023-24', sublabel: 'Archived statutory service records', badge: 'Archived', badgeTone: 'slate' },
              ]}
            />
          </div>
          <div className="passbook-filter-field">
            <span className="passbook-filter-label">Establishment / Member ID</span>
            <ModernSelect
              size="compact"
              value={establishment}
              onChange={(val) => {
                onEstablishmentChange(val);
                setCurrentPage(1);
              }}
              options={establishments.map((est) => ({
                value: est.id,
                label: est.name,
                sublabel: est.mid !== 'All MIDs' ? `Member ID: ${est.mid}` : 'Consolidated view across all employers',
                badge: est.status === 'Active (Current)' ? 'Active' : est.status === 'Previous (Transferred)' ? 'Transferred' : 'Unified',
                badgeTone: est.status === 'Active (Current)' ? 'emerald' : est.status === 'Previous (Transferred)' ? 'purple' : 'orange',
              }))}
            />
          </div>
        </div>
      </section>

      {/* Transaction Filter Tabs */}
      <div className="ledger-filter-tabs">
        <button type="button" className={filter === 'all' ? 'active' : ''} onClick={() => { onFilterChange('all'); setCurrentPage(1); }}>
          All Transactions ({allYearRows.filter(r => establishment === 'all' || r.estId === establishment).length})
        </button>
        <button type="button" className={filter === 'credit' ? 'active' : ''} onClick={() => { onFilterChange('credit'); setCurrentPage(1); }}>
          Monthly Wage Credits
        </button>
        <button type="button" className={filter === 'interest' ? 'active' : ''} onClick={() => { onFilterChange('interest'); setCurrentPage(1); }}>
          Annual Statutory Interest
        </button>
        <button type="button" className={filter === 'debit' ? 'active' : ''} onClick={() => { onFilterChange('debit'); setCurrentPage(1); }}>
          Claims / Debits (0)
        </button>
      </div>

      {/* Comprehensive Ledger Table */}
      <section className="portal-panel passbook-ledger-panel">
        <div className="panel-heading-row">
          <div>
            <p className="panel-eyebrow">Transaction Records ({filteredRows.length} total entries)</p>
            <h2>Monthly Contribution & Ledger Breakdown</h2>
          </div>
          <span className="source-freshness">Digitally verified against Field Office ECR Ledger</span>
        </div>

        <div className="responsive-table-wrap">
          <table className="portal-data-table detailed-ledger-table">
            <thead>
              <tr>
                <th>Wage Month</th>
                <th>Establishment</th>
                <th>Gross Wage</th>
                <th>Employee Share (12%)</th>
                <th>Employer EPF (3.67%)</th>
                <th>Pension EPS (8.33%)</th>
                <th>Total Addition</th>
                <th>Deposited On</th>
                <th>ECR Challan Ref</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>
                    No transactions found matching the selected filters.
                  </td>
                </tr>
              ) : (
                paginatedRows.map((row) => (
                  <tr key={row.id} className={row.type === 'interest' ? 'interest-row' : ''}>
                    <td>
                      <strong>{row.wageMonth}</strong>
                      <code>{row.id}</code>
                    </td>
                    <td>
                      <small className="est-cell-name">{row.estName}</small>
                      <code className="est-cell-id">{row.estId}</code>
                    </td>
                    <td>{row.basicWage > 0 ? formatMoney(row.basicWage) : '—'}</td>
                    <td className="text-emerald"><strong>{formatMoney(row.employee)}</strong></td>
                    <td>{formatMoney(row.employerEpf)}</td>
                    <td className="text-pension">{row.employerEps > 0 ? formatMoney(row.employerEps) : '—'}</td>
                    <td><strong>{formatMoney(row.employee + row.employerEpf + row.employerEps)}</strong></td>
                    <td>{row.deposited}</td>
                    <td><span className="ecr-pill">{row.ecrChallan}</span></td>
                    <td><StatusPill>{row.status}</StatusPill></td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr>
                <th colSpan={3}>Summary Totals for Selection ({filteredRows.length} Entries)</th>
                <th className="text-emerald">{formatMoney(employeeTotal)}</th>
                <th>{formatMoney(employerEpfTotal)}</th>
                <th className="text-pension">{formatMoney(employerEpsTotal)}</th>
                <th>{formatMoney(grandTotal + employerEpsTotal)}</th>
                <th colSpan={3}>Accumulation Net Addition</th>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Bottom Pagination & Export Action Bar */}
        <div className="passbook-bottom-bar">
          <div className="passbook-page-info">
            <span>
              Showing {filteredRows.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}–{Math.min(currentPage * rowsPerPage, filteredRows.length)} of {filteredRows.length} records
            </span>
            {totalPages > 1 && (
              <div className="passbook-pagination-controls">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  aria-label="Previous page"
                >
                  ← Prev
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  aria-label="Next page"
                >
                  Next →
                </button>
              </div>
            )}
          </div>

          <div className="passbook-bottom-actions">
            <button
              type="button"
              className="passbook-download-btn"
              onClick={() => onToast('Simulated complete passbook statement PDF downloaded with verified digital stamp.')}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Download Statement (PDF)</span>
            </button>
            <button
              type="button"
              className="passbook-export-btn"
              onClick={() => onToast('Simulated Excel ledger exported (.xlsx).')}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="8" y1="13" x2="16" y2="13" />
                <line x1="8" y1="17" x2="16" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <span>Export Excel</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

/* =========================================================================
   SLIM & CONTINUOUS STATUTORY NOTICES TICKER
   ========================================================================= */
function StatutoryTicker({ onOpenNotifications }: { onOpenNotifications?: () => void }) {
  const tickerItems = [
    { tag: 'Aadhaar Verification', text: 'Please ensure your Aadhaar-linked mobile number is active to receive 2FA OTP for Form 31, 19, 10C & 10D settlements.' },
    { tag: 'Advance Claims', text: 'e-Nomination is not mandatory for submitting Form 31 partial advance withdrawal.' },
    { tag: 'Bank Seed Match', text: 'Re-verify seeded Bank IFSC & Account (DEMO-ACCOUNT-001) prior to online claim submission.' },
    { tag: 'CBT Statutory Rate', text: 'Annual statutory EPF interest calculation @ 8.25% credited to active member accounts.' },
    { tag: 'Fast-Track Settlement', text: 'Medical advances up to ₹ 1,00,000 processed through automated fast-track clearance.' },
  ];

  return (
    <div className="statutory-ticker-container" role="region" aria-label="Important statutory and claim notices ticker">
      <div className="ticker-badge">
        <span className="ticker-pulse-dot" aria-hidden="true" />
        <span>Important Notices</span>
      </div>
      <div className="ticker-marquee-wrapper" tabIndex={0} aria-label="Scrolling notices (hover or focus to pause)">
        <div className="ticker-track">
          {tickerItems.concat(tickerItems).map((item, idx) => (
            <div key={idx} className="ticker-item">
              <span className="ticker-item-tag">{item.tag}:</span>
              <span className="ticker-item-text">{item.text}</span>
              <span className="ticker-item-separator" aria-hidden="true">✦</span>
            </div>
          ))}
        </div>
      </div>
      {onOpenNotifications && (
        <button
          type="button"
          className="ticker-notif-btn"
          onClick={onOpenNotifications}
          title="Open complete notification center"
        >
          <span>All Notices</span>
          <span aria-hidden="true">→</span>
        </button>
      )}
    </div>
  );
}

/* =========================================================================
   OVERHAULED ONLINE CLAIMS (FORM 31, 19, 10C & 10D) WITH BANK VERIFICATION
   ========================================================================= */
function OverhauledClaimsView({
  onSubmit,
  onOpenBanking,
  onOpenKyc,
  onToast,
}: {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onOpenBanking: () => void;
  onOpenKyc: () => void;
  onToast: (message: string) => void;
}) {
  const [bankInput, setBankInput] = useState('');
  const [bankVerified, setBankVerified] = useState(false);
  const [bankError, setBankError] = useState('');
  const [claimType, setClaimType] = useState('FORM-31');
  const [advancePurpose, setAdvancePurpose] = useState('illness');
  const [settlementReason, setSettlementReason] = useState('cessation');
  const [passbookFile, setPassbookFile] = useState<AttachedFile | null>(null);

  function handleVerifyBank() {
    if (bankInput.trim().toUpperCase() === 'DEMO-ACCOUNT-001' || bankInput.trim() === 'DEMO-ACC-001') {
      setBankVerified(true);
      setBankError('');
      onToast('Bank Account Verified Successfully!');
    } else {
      setBankVerified(false);
      setBankError('Account number does not match seeded UAN record (Use: DEMO-ACCOUNT-001).');
    }
  }

  return (
    <div className="portal-view-stack portal-form-layout">
      {/* Left / Main Workflow Column */}
      <div className="claim-workflow-container">
        {/* Step 1: Bank Account Number Re-Verification Gate (NOW ON TOP) */}
        <section className="portal-panel bank-gate-box">
          <div className="panel-heading-row">
            <div>
              <p className="panel-eyebrow">Step 1: Security Verification</p>
              <h2>Confirm Seeded Bank Account Number</h2>
              <p>For your security, re-enter the full bank account number seeded against your UAN (<code>DEMO-ACCOUNT-001</code>).</p>
            </div>
            <button type="button" onClick={onOpenBanking}>Change Seeded Bank →</button>
          </div>

          <div className="bank-verification-form-group">
            <div className="bank-meta-preview">
              <span>Seeded IFSC: <strong>DEMO-IFSC-001</strong></span>
              <span>Branch: <strong>DEMO NEO BANKING CENTRAL BRANCH</strong></span>
            </div>

            <div className="bank-input-row">
              <input
                type="text"
                placeholder="Enter Bank Account Number (e.g. DEMO-ACCOUNT-001)"
                value={bankInput}
                onChange={(e) => {
                  setBankInput(e.target.value);
                  setBankError('');
                }}
                disabled={bankVerified}
                className={bankVerified ? 'input-verified' : bankError ? 'input-error' : ''}
              />
              {!bankVerified ? (
                <button type="button" className="panel-primary-action" onClick={handleVerifyBank}>
                  Check & Verify
                </button>
              ) : (
                <span className="verified-badge">✓ Verified Match</span>
              )}
            </div>

            {bankError && <p className="bank-error-text">{bankError}</p>}
            {bankVerified && (
              <p className="bank-success-text">
                ✓ Bank account verified. NEFT settlement will be routed to DEMO-BANK-001 (DEMO-ACCOUNT-001).
              </p>
            )}
          </div>
        </section>

        {/* Step 2: Claim Application Form (ONLY VISIBLE ONCE BANK IS VERIFIED - NO LOCKED PLACEHOLDER) */}
        {bankVerified && (
          <form className="portal-panel portal-task-form" onSubmit={onSubmit}>
            <div className="panel-heading-row">
              <div>
                <p className="panel-eyebrow">Step 2: Claim Selection & Particulars</p>
                <h2>Select Claim Form & Purpose</h2>
              </div>
              <span className="form-step-badge">✓ Ready to File</span>
            </div>

            <div className="form-grid">
              {/* Field 1: Form Type */}
              <div className="form-field-group">
                <label>I want to apply for</label>
                <ModernSelect
                  value={claimType}
                  onChange={setClaimType}
                  options={[
                    { value: 'FORM-31', label: 'Form 31 (PF Advance Withdrawal)', sublabel: 'Partial withdrawal during ongoing employment service', badge: 'Advance', badgeTone: 'orange' },
                    { value: 'FORM-19', label: 'Form 19 (Final PF Settlement)', sublabel: 'Complete accumulated balance payout upon employment exit', badge: 'Exit Only', badgeTone: 'emerald' },
                    { value: 'FORM-10C', label: 'Form 10C (EPS Pension Certificate)', sublabel: 'Pension withdrawal or service transfer certificate', badge: 'EPS Pool', badgeTone: 'purple' },
                    { value: 'FORM-10D', label: 'Form 10D (Monthly Pension Scheme)', sublabel: 'Lifelong monthly pension for superannuated members', badge: 'Age 58+', badgeTone: 'slate' },
                  ]}
                />
              </div>

              {/* Field 2: Dynamic Category / Purpose */}
              {claimType === 'FORM-31' && (
                <div className="form-field-group">
                  <label>Purpose for Advance</label>
                  <ModernSelect
                    value={advancePurpose}
                    onChange={setAdvancePurpose}
                    options={[
                      { value: 'illness', label: 'Illness / Medical Emergency (Para 68J)', sublabel: 'Immediate medical costs for self or dependent family', badge: 'Emergency', badgeTone: 'emerald' },
                      { value: 'house', label: 'Purchase of House / Flat (Para 68B)', sublabel: 'Acquisition or construction of residential property', badge: 'Housing', badgeTone: 'orange' },
                      { value: 'marriage', label: 'Marriage Expenses (Para 68K)', sublabel: 'Marriage of self, son, daughter, or siblings', badge: 'Family', badgeTone: 'purple' },
                      { value: 'education', label: 'Post-Matriculation Education (Para 68K)', sublabel: 'Higher academic education for children', badge: 'Education', badgeTone: 'purple' },
                      { value: 'special', label: 'Special Calamity Advance (Para 68L)', sublabel: 'Natural disaster or special government relief grant', badge: 'Relief', badgeTone: 'slate' },
                    ]}
                  />
                </div>
              )}

              {claimType === 'FORM-19' && (
                <div className="form-field-group">
                  <label>Settlement Reason / Exit Ground</label>
                  <ModernSelect
                    value={settlementReason}
                    onChange={setSettlementReason}
                    options={[
                      { value: 'cessation', label: 'Cessation of Service / Resignation', sublabel: 'Standard exit with minimum 2 months unemployment', badge: 'Full PF', badgeTone: 'emerald' },
                      { value: 'superannuation', label: 'Superannuation / Retirement', sublabel: 'Reached superannuation age of 58 years', badge: 'Retirement', badgeTone: 'orange' },
                      { value: 'disablement', label: 'Permanent Incapacity / Medical', sublabel: 'Medical inability to work certified by competent doctor', badge: 'Medical', badgeTone: 'purple' },
                    ]}
                  />
                </div>
              )}

              {claimType === 'FORM-10C' && (
                <div className="form-field-group">
                  <label>Pension Scheme Option</label>
                  <ModernSelect
                    value={settlementReason}
                    onChange={setSettlementReason}
                    options={[
                      { value: 'withdrawal', label: 'EPS Withdrawal Benefit (Lump Sum)', sublabel: 'Service under 10 years (lump sum cashout)', badge: 'Lump Sum', badgeTone: 'purple' },
                      { value: 'scheme_cert', label: 'Scheme Certificate (Retain Service)', sublabel: 'Preserve EPS tenure to transfer to next employer', badge: 'Recommended', badgeTone: 'emerald' },
                    ]}
                  />
                </div>
              )}

              {claimType === 'FORM-10D' && (
                <div className="form-field-group">
                  <label>Pension Category</label>
                  <ModernSelect
                    value={settlementReason}
                    onChange={setSettlementReason}
                    options={[
                      { value: 'superannuation', label: 'Superannuation Pension (Age 58+)', sublabel: 'Full monthly lifelong pension with 10+ years tenure', badge: 'Regular', badgeTone: 'emerald' },
                      { value: 'early', label: 'Early Pension (Age 50 – 57)', sublabel: 'Discounted 4% annual rate prior to age 58', badge: 'Early Exit', badgeTone: 'orange' },
                    ]}
                  />
                </div>
              )}

              {/* Field 3: Amount */}
              <div className="form-field-group">
                <label>Amount Required (in ₹)</label>
                <input
                  type="text"
                  required
                  defaultValue={claimType === 'FORM-31' ? '₹ 45,000' : '₹ 3,56,650'}
                />
              </div>

              {/* Field 4: Document Upload (Using Reusable FileDropzone Component) */}
              <div className="form-field-group" style={{ gridColumn: 'span 2' }}>
                <FileDropzone
                  label="Attach Document (Cheque Leaf / Passbook Front Page)"
                  required
                  file={passbookFile}
                  onFileChange={setPassbookFile}
                  helperText="Click to browse files (JPG, PNG or PDF up to 2MB)."
                />
              </div>
            </div>

            {/* Verified NEFT Settlement Destination Summary Card */}
            <div className="claim-destination-preview-card">
              <div className="claim-destination-info">
                <span className="dest-icon">🏦</span>
                <div>
                  <strong>Settlement Destination: DEMO-BANK-001</strong>
                  <p>Account: <code>DEMO-ACCOUNT-001</code> · IFSC: <code>DEMO-IFSC-001</code> · Direct Core Banking NEFT</p>
                </div>
              </div>
              <span className="dest-badge">✓ Direct NEFT Verified</span>
            </div>

            <label className="confirmation-check">
              <input type="checkbox" required />
              <span>I certify that the particulars given above are true and correct. I authorize EPFO to settle the amount directly to my verified demo bank account.</span>
            </label>

            <div className="form-action-row">
              <button type="button" className="form-secondary-action" onClick={onOpenKyc}>Review KYC</button>
              <button
                type="submit"
                className="panel-primary-action"
              >
                Submit simulated claim with demo OTP
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Right Column: Member Verification Details (NOW ON THE RIGHT SIDE, replacing the Checklist) */}
      <aside className="portal-panel claim-identity-panel">
        <div className="panel-heading-row">
          <div>
            <p className="panel-eyebrow">Member Identity & KYC</p>
            <h2>Member Verification Details</h2>
          </div>
          <span className="source-freshness">UAN: DEMO-UAN-001</span>
        </div>

        <div className="claim-details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
          <div><small>Employee Name</small><strong>DEMO MEMBER 001</strong></div>
          <div><small>Father / Husband Name</small><strong>DEMO FATHER MEENA</strong></div>
          <div><small>Date of Birth</small><strong>07-08-1991</strong></div>
          <div><small>Mobile Number</small><strong>9717XXXXXX (Linked)</strong></div>
        </div>

        <div className="claim-kyc-status-row" style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          <div className="kyc-status-chip verified"><span>✓</span> Aadhaar Verified (UIDAI)</div>
          <div className="kyc-status-chip verified"><span>✓</span> PAN Verified (No TDS Surcharge)</div>
          <div className={`kyc-status-chip ${bankVerified ? 'verified' : 'warning'}`}>
            <span>{bankVerified ? '✓' : '!'}</span>
            {bankVerified ? 'Bank Account: Verified' : 'Bank Account: Re-Verification Required'}
          </div>
        </div>

        <div className="claim-turnaround-box" style={{ marginTop: '1.25rem' }}>
          <div className="turnaround-head">
            <span>⚡</span>
            <strong>Direct NEFT Settlement</strong>
          </div>
          <p>Approved claims are dispatched directly to your verified bank account via RBI NEFT gateway within <strong>3 to 5 working days</strong>.</p>
        </div>
      </aside>
    </div>
  );
}

/* =========================================================================
   ADD / UPDATE / EDIT KYC DRAWER (RIGHT-SLIDE DRAWER)
   ========================================================================= */
function AddKycDrawer({
  isOpen,
  onClose,
  existingKyc,
  editingKyc,
  onSaveKyc,
}: {
  isOpen: boolean;
  onClose: () => void;
  existingKyc: KycRecord[];
  editingKyc: KycRecord | null;
  onSaveKyc: (record: KycRecord) => void;
}) {
  if (!isOpen) return null;
  return (
    <AddKycDrawerForm
      key={editingKyc?.id || 'new'}
      existingKyc={existingKyc}
      editingKyc={editingKyc}
      onClose={onClose}
      onSaveKyc={onSaveKyc}
    />
  );
}

function AddKycDrawerForm({
  onClose,
  existingKyc,
  editingKyc,
  onSaveKyc,
}: {
  onClose: () => void;
  existingKyc: KycRecord[];
  editingKyc: KycRecord | null;
  onSaveKyc: (record: KycRecord) => void;
}) {
  const isEditing = !!editingKyc;
  const hasAadhaar = existingKyc.some((k) => k.type === 'Aadhaar' && (!editingKyc || editingKyc.id !== k.id));
  const hasPan = existingKyc.some((k) => k.type === 'PAN' && (!editingKyc || editingKyc.id !== k.id));

  const [docType, setDocType] = useState(
    editingKyc
      ? editingKyc.type === 'Bank'
        ? 'bank'
        : editingKyc.type === 'Passport'
        ? 'passport'
        : editingKyc.type === 'Voter ID'
        ? 'voter'
        : editingKyc.type === 'Driving License'
        ? 'dl'
        : editingKyc.type === 'PAN'
        ? 'pan'
        : 'aadhaar'
      : 'bank'
  );

  // Bank fields
  const [bankName, setBankName] = useState(
    editingKyc && editingKyc.type === 'Bank' ? editingKyc.specifics.split('·')[0].trim() : 'DEMO STATE BANK · CONNAUGHT PLACE BRANCH'
  );
  const [bankAcc, setBankAcc] = useState(editingKyc && editingKyc.type === 'Bank' ? editingKyc.docNo : 'DEMO-ACCOUNT-002');
  const [bankIfsc, setBankIfsc] = useState(
    editingKyc && editingKyc.type === 'Bank' && editingKyc.specifics.includes('IFSC:')
      ? editingKyc.specifics.split('IFSC:')[1].split('·')[0].trim()
      : 'DEMO-IFSC-002'
  );
  const [bankAccType, setBankAccType] = useState('savings');
  const [bankNameOnDoc, setBankNameOnDoc] = useState(editingKyc?.name || 'DEMO MEMBER 001');
  const [bankIsDefault, setBankIsDefault] = useState(editingKyc?.isDefault ?? true);

  // Passport fields
  const [passNo, setPassNo] = useState(editingKyc && editingKyc.type === 'Passport' ? editingKyc.docNo : 'DEMO-PASS-002');
  const [passName, setPassName] = useState(editingKyc?.name || 'DEMO MEMBER 001');
  const [passExpiry, setPassExpiry] = useState('2034-12-15');
  const [passAuthority, setPassAuthority] = useState('Regional Passport Office, Delhi');
  const [passIsActive, setPassIsActive] = useState(editingKyc?.isActive ?? true);

  // Voter ID fields
  const [voterNo, setVoterNo] = useState(editingKyc && editingKyc.type === 'Voter ID' ? editingKyc.docNo : 'DEMO-EPIC-001');
  const [voterName, setVoterName] = useState(editingKyc?.name || 'DEMO MEMBER 001');
  const [voterState, setVoterState] = useState('New Delhi · NCT of Delhi');

  // Driving License fields
  const [dlNo, setDlNo] = useState(editingKyc && editingKyc.type === 'Driving License' ? editingKyc.docNo : 'DEMO-DL-001');
  const [dlName, setDlName] = useState(editingKyc?.name || 'DEMO MEMBER 001');
  const [dlExpiry, setDlExpiry] = useState('2035-08-20');
  const [dlRto, setDlRto] = useState('DL-01 Transport Dept Delhi');

  // PAN fields
  const [panNo, setPanNo] = useState(editingKyc && editingKyc.type === 'PAN' ? editingKyc.docNo : 'DEMO-PAN-002');
  const [panName, setPanName] = useState(editingKyc?.name || 'DEMO MEMBER 001');
  const [panDob, setPanDob] = useState('1991-08-07');

  // Aadhaar fields
  const [aadhaarNo, setAadhaarNo] = useState(editingKyc && editingKyc.type === 'Aadhaar' ? editingKyc.docNo : 'DEMO-AADHAAR-002');
  const [aadhaarName, setAadhaarName] = useState(editingKyc?.name || 'DEMO MEMBER 001');
  const [aadhaarMobile, setAadhaarMobile] = useState('9717XXXXXX');

  const docOptions = [
    { value: 'bank', label: 'Bank Account (Savings / Current)', sublabel: 'Add primary or secondary account for claim disbursements', badge: 'Multiple Allowed', badgeTone: 'emerald' as const },
    { value: 'passport', label: 'Passport (Travel Identity)', sublabel: 'International identity & travel proof (Add or renew)', badge: 'Multiple / Renewal', badgeTone: 'purple' as const },
    { value: 'voter', label: 'Voter ID (Election Photo Identity)', sublabel: 'EPIC election identity proof approved by employer DSC', badge: 'Govt ID', badgeTone: 'slate' as const },
    { value: 'dl', label: 'Driving License', sublabel: 'State transport department issued photo driving license', badge: 'Govt ID', badgeTone: 'slate' as const },
    ...(!hasPan || (isEditing && editingKyc?.type === 'PAN') ? [{ value: 'pan', label: 'PAN Card', sublabel: 'Income Tax Department verified (Prevents TDS surcharge)', badge: 'Single PAN', badgeTone: 'orange' as const }] : []),
    ...(!hasAadhaar || (isEditing && editingKyc?.type === 'Aadhaar') ? [{ value: 'aadhaar', label: 'Aadhaar Card', sublabel: 'UIDAI biometric / OTP demographic identity', badge: 'Single Aadhaar', badgeTone: 'emerald' as const }] : []),
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let newRec: KycRecord;

    if (docType === 'bank') {
      newRec = {
        id: editingKyc?.id || `DEMO-KYC-${Date.now()}`,
        type: 'Bank',
        docNo: bankAcc,
        name: bankNameOnDoc,
        specifics: `${bankName} · IFSC: ${bankIfsc} · ${bankAccType === 'savings' ? 'Savings' : 'Current'} A/C`,
        approvingAuthority: 'Bank Direct API + Employer DSC',
        status: 'Verified',
        signType: 'Core Banking API',
        isDefault: bankIsDefault,
        isActive: true,
      };
    } else if (docType === 'passport') {
      newRec = {
        id: editingKyc?.id || `DEMO-KYC-${Date.now()}`,
        type: 'Passport',
        docNo: passNo,
        name: passName,
        specifics: `Valid till: ${passExpiry} · ${passAuthority}`,
        approvingAuthority: 'Employer Digital Signature Certificate (DSC)',
        status: 'Approved',
        signType: 'Employer DSC',
        isActive: passIsActive,
      };
    } else if (docType === 'voter') {
      newRec = {
        id: editingKyc?.id || `DEMO-KYC-${Date.now()}`,
        type: 'Voter ID',
        docNo: voterNo,
        name: voterName,
        specifics: `Constituency: ${voterState} · Election Commission`,
        approvingAuthority: 'Employer Digital Signature Certificate (DSC)',
        status: 'Approved',
        signType: 'Employer DSC',
        isActive: true,
      };
    } else if (docType === 'dl') {
      newRec = {
        id: editingKyc?.id || `DEMO-KYC-${Date.now()}`,
        type: 'Driving License',
        docNo: dlNo,
        name: dlName,
        specifics: `Valid upto: ${dlExpiry} · ${dlRto}`,
        approvingAuthority: 'Employer Digital Signature Certificate (DSC)',
        status: 'Approved',
        signType: 'Employer DSC',
        isActive: true,
      };
    } else if (docType === 'pan') {
      newRec = {
        id: editingKyc?.id || `DEMO-KYC-${Date.now()}`,
        type: 'PAN',
        docNo: panNo,
        name: panName,
        specifics: `DOB: ${panDob} · Tax Exemption Active`,
        approvingAuthority: 'Income Tax Department (NSDL/ITD API)',
        status: 'Verified',
        signType: 'ITD API Match',
        isActive: true,
      };
    } else {
      newRec = {
        id: editingKyc?.id || `DEMO-KYC-${Date.now()}`,
        type: 'Aadhaar',
        docNo: aadhaarNo,
        name: aadhaarName,
        specifics: `Linked Mobile: ${aadhaarMobile} · UIDAI Direct`,
        approvingAuthority: 'UIDAI API (Direct Demographic Verification)',
        status: 'Verified',
        signType: 'UIDAI e-KYC',
        isActive: true,
      };
    }

    onSaveKyc(newRec);
    onClose();
  };

  return (
    <div className="portal-form-drawer-overlay" role="dialog" aria-modal="true" aria-labelledby="add-kyc-drawer-title">
      <div className="drawer-backdrop" onClick={onClose} />
      <div className="portal-form-drawer">
        <div className="drawer-header">
          <div className="drawer-header-copy">
            <span className="drawer-eyebrow">Document verification</span>
            <h2 id="add-kyc-drawer-title">{isEditing ? `Edit KYC Record · ${editingKyc?.type}` : 'Add / Update KYC Document'}</h2>
          </div>
          <button type="button" className="drawer-close-btn" onClick={onClose} aria-label="Close drawer">×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div className="portal-form-drawer-body">
            {!isEditing && (
              <div className="form-field-group">
                <label>Select Document Type to Seed</label>
                <ModernSelect
                  value={docType}
                  onChange={setDocType}
                  options={docOptions}
                />
              </div>
            )}

            {/* Singleton Policy Informational Note */}
            {(hasAadhaar || hasPan) && !isEditing && (
              <div className="kyc-singleton-notice">
                <span className="notice-dot">ℹ</span>
                <p>
                  <strong>Unique Document Policy:</strong> Aadhaar and PAN are unique singletons per member and are already verified. You can add multiple Bank Accounts or renew Passports and Government photo IDs.
                </p>
              </div>
            )}

            {/* Dynamic Document Specific Fields */}
            {docType === 'bank' && (
              <>
                <div className="form-grid" style={{ marginTop: '0.5rem' }}>
                  <label>
                    Bank Name & Branch
                    <input
                      required
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                    />
                  </label>
                  <label>
                    Bank Account Number
                    <input
                      required
                      value={bankAcc}
                      pattern="DEMO-ACCOUNT-[0-9]{3}"
                      onChange={(e) => setBankAcc(e.target.value)}
                    />
                  </label>
                  <label>
                    Bank IFSC Code
                    <input
                      required
                      value={bankIfsc}
                      pattern="DEMO-IFSC-[0-9]{3}"
                      onChange={(e) => setBankIfsc(e.target.value)}
                    />
                  </label>
                  <label>
                    Account Holder Name
                    <input
                      required
                      value={bankNameOnDoc}
                      onChange={(e) => setBankNameOnDoc(e.target.value)}
                    />
                  </label>
                  <div className="form-field-group" style={{ gridColumn: 'span 2' }}>
                    <label>Account Type</label>
                    <ModernSelect
                      value={bankAccType}
                      onChange={setBankAccType}
                      options={[
                        { value: 'savings', label: 'Savings Account', sublabel: 'Standard personal savings account for NEFT credit', badge: 'Personal', badgeTone: 'emerald' },
                        { value: 'current', label: 'Current Account', sublabel: 'Commercial current account for statutory settlements', badge: 'Commercial', badgeTone: 'slate' },
                      ]}
                    />
                  </div>
                </div>
                <label className="kyc-checkbox-row">
                  <input
                    type="checkbox"
                    checked={bankIsDefault}
                    onChange={(e) => setBankIsDefault(e.target.checked)}
                  />
                  <span>Set as <strong>Primary Default Account</strong> for online claim NEFT disbursements</span>
                </label>
                <div className="kyc-doc-auth-note">
                  <span>🏦 <strong>Verification Mechanism:</strong> Under EPFO statutory rules, bank KYC is verified online via Core Banking API and approved by employer Digital Signature Certificate (DSC).</span>
                </div>
              </>
            )}

            {docType === 'passport' && (
              <>
                <div className="form-grid" style={{ marginTop: '0.5rem' }}>
                  <label>
                    Passport Number
                    <input
                      required
                      value={passNo}
                      pattern="DEMO-PASS-[0-9]{3}"
                      onChange={(e) => setPassNo(e.target.value)}
                    />
                  </label>
                  <label>
                    Name as per Passport
                    <input
                      required
                      value={passName}
                      onChange={(e) => setPassName(e.target.value)}
                    />
                  </label>
                  <label>
                    Date of Expiry
                    <input
                      type="date"
                      required
                      value={passExpiry}
                      onChange={(e) => setPassExpiry(e.target.value)}
                    />
                  </label>
                  <label>
                    Place of Issue / Regional Passport Office
                    <input
                      required
                      value={passAuthority}
                      onChange={(e) => setPassAuthority(e.target.value)}
                    />
                  </label>
                </div>
                <label className="kyc-checkbox-row">
                  <input
                    type="checkbox"
                    checked={passIsActive}
                    onChange={(e) => setPassIsActive(e.target.checked)}
                  />
                  <span>Set as <strong>Current Active Passport</strong> (marks previous passports as renewed)</span>
                </label>
                <div className="kyc-doc-auth-note">
                  <span>🛂 <strong>Verification Mechanism:</strong> Passport details are verified and digitally approved by the employer using Digital Signature Certificate (DSC).</span>
                </div>
              </>
            )}

            {docType === 'voter' && (
              <>
                <div className="form-grid" style={{ marginTop: '0.5rem' }}>
                  <label>
                    Voter ID / EPIC Number
                    <input
                      required
                      value={voterNo}
                      pattern="DEMO-EPIC-[0-9]{3}"
                      onChange={(e) => setVoterNo(e.target.value)}
                    />
                  </label>
                  <label>
                    Name as per Voter ID
                    <input
                      required
                      value={voterName}
                      onChange={(e) => setVoterName(e.target.value)}
                    />
                  </label>
                  <label style={{ gridColumn: 'span 2' }}>
                    State / Assembly Constituency
                    <input
                      required
                      value={voterState}
                      onChange={(e) => setVoterState(e.target.value)}
                    />
                  </label>
                </div>
                <div className="kyc-doc-auth-note">
                  <span>🗳️ <strong>Verification Mechanism:</strong> Election Identity Document is verified and digitally approved by the employer DSC.</span>
                </div>
              </>
            )}

            {docType === 'dl' && (
              <>
                <div className="form-grid" style={{ marginTop: '0.5rem' }}>
                  <label>
                    Driving License Number
                    <input
                      required
                      value={dlNo}
                      pattern="DEMO-DL-[0-9]{3}"
                      onChange={(e) => setDlNo(e.target.value)}
                    />
                  </label>
                  <label>
                    Name as per License
                    <input
                      required
                      value={dlName}
                      onChange={(e) => setDlName(e.target.value)}
                    />
                  </label>
                  <label>
                    License Validity Expiry
                    <input
                      type="date"
                      required
                      value={dlExpiry}
                      onChange={(e) => setDlExpiry(e.target.value)}
                    />
                  </label>
                  <label>
                    Issuing Authority / RTO
                    <input
                      required
                      value={dlRto}
                      onChange={(e) => setDlRto(e.target.value)}
                    />
                  </label>
                </div>
                <div className="kyc-doc-auth-note">
                  <span>🚗 <strong>Verification Mechanism:</strong> Driving License is verified and digitally approved by the employer DSC.</span>
                </div>
              </>
            )}

            {docType === 'pan' && (
              <>
                <div className="form-grid" style={{ marginTop: '0.5rem' }}>
                  <label>
                    Permanent Account Number (PAN)
                    <input
                      required
                      value={panNo}
                      pattern="DEMO-PAN-[0-9]{3}"
                      onChange={(e) => setPanNo(e.target.value)}
                    />
                  </label>
                  <label>
                    Name on PAN Card
                    <input
                      required
                      value={panName}
                      onChange={(e) => setPanName(e.target.value)}
                    />
                  </label>
                  <label style={{ gridColumn: 'span 2' }}>
                    Date of Birth
                    <input
                      type="date"
                      required
                      value={panDob}
                      onChange={(e) => setPanDob(e.target.value)}
                    />
                  </label>
                </div>
                <div className="kyc-doc-auth-note">
                  <span>📑 <strong>Verification Mechanism:</strong> Direct ITD/NSDL government database match ensures tax exemption compliance (Section 192A).</span>
                </div>
              </>
            )}

            {docType === 'aadhaar' && (
              <>
                <div className="form-grid" style={{ marginTop: '0.5rem' }}>
                  <label>
                    Aadhaar Number Ref
                    <input
                      required
                      value={aadhaarNo}
                      pattern="DEMO-AADHAAR-[0-9]{3}"
                      onChange={(e) => setAadhaarNo(e.target.value)}
                    />
                  </label>
                  <label>
                    Name on Aadhaar
                    <input
                      required
                      value={aadhaarName}
                      onChange={(e) => setAadhaarName(e.target.value)}
                    />
                  </label>
                  <label style={{ gridColumn: 'span 2' }}>
                    UIDAI Registered Mobile Number
                    <input
                      required
                      value={aadhaarMobile}
                      onChange={(e) => setAadhaarMobile(e.target.value)}
                    />
                  </label>
                </div>
                <div className="kyc-doc-auth-note">
                  <span>🆔 <strong>Verification Mechanism:</strong> Aadhaar is a unique singleton identity verified directly via UIDAI biometric/OTP API.</span>
                </div>
              </>
            )}
          </div>

          <div className="portal-form-drawer-footer">
            <button type="button" className="form-secondary-action" onClick={onClose}>Cancel</button>
            <button type="submit" className="panel-primary-action">
              {isEditing ? 'Save KYC Updates' : 'Submit KYC for Verification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================================================================
   ADD / EDIT NOMINEE DETAILS DRAWER (RIGHT-SLIDE DRAWER)
   ========================================================================= */
function AddNomineeDrawer({
  isOpen,
  onClose,
  editingNominee,
  existingNominees,
  onSaveNominee,
}: {
  isOpen: boolean;
  onClose: () => void;
  editingNominee: NomineeRecord | null;
  existingNominees: NomineeRecord[];
  onSaveNominee: (nominee: NomineeRecord) => void;
}) {
  if (!isOpen) return null;
  return (
    <AddNomineeDrawerForm
      key={editingNominee?.id || 'new'}
      editingNominee={editingNominee}
      existingNominees={existingNominees}
      onClose={onClose}
      onSaveNominee={onSaveNominee}
    />
  );
}

function AddNomineeDrawerForm({
  onClose,
  editingNominee,
  existingNominees,
  onSaveNominee,
}: {
  onClose: () => void;
  editingNominee: NomineeRecord | null;
  existingNominees: NomineeRecord[];
  onSaveNominee: (nominee: NomineeRecord) => void;
}) {
  const currentTotal = existingNominees
    .filter((n) => !editingNominee || n.id !== editingNominee.id)
    .reduce((sum, n) => sum + n.share, 0);
  const remainingShare = Math.max(0, 100 - currentTotal);

  const [name, setName] = useState(editingNominee?.name || 'DEMO NEW NOMINEE');
  const [relation, setRelation] = useState(editingNominee?.relation || 'Spouse');
  const [aadhaar, setAadhaar] = useState(editingNominee?.aadhaar || 'XXXX-XXXX-DEMO-N');
  const [share, setShare] = useState<number>(editingNominee ? editingNominee.share : remainingShare > 0 ? remainingShare : 50);
  const [dob, setDob] = useState(editingNominee?.dob || '1995-06-15');
  const [guardianName, setGuardianName] = useState(editingNominee?.guardianName || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedNom: NomineeRecord = {
      id: editingNominee?.id || `DEMO-NOM-${Date.now()}`,
      name,
      relation,
      aadhaar,
      share: Number(share),
      dob,
      guardianName: guardianName.trim() ? guardianName : undefined,
      photoUploaded: true,
    };
    onSaveNominee(updatedNom);
    onClose();
  };

  return (
    <div className="portal-form-drawer-overlay" role="dialog" aria-modal="true" aria-labelledby="nominee-drawer-title">
      <div className="drawer-backdrop" onClick={onClose} />
      <div className="portal-form-drawer">
        <div className="drawer-header">
          <div className="drawer-header-copy">
            <span className="drawer-eyebrow">Digital family declaration</span>
            <h2 id="nominee-drawer-title">{editingNominee ? 'Edit Nominee Details' : 'Add New Family Nominee'}</h2>
          </div>
          <button type="button" className="drawer-close-btn" onClick={onClose} aria-label="Close drawer">×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div className="portal-form-drawer-body">
            <div className="nominee-share-guidance-badge">
              <span>Available Unallocated Share: <strong>{remainingShare}%</strong></span>
            </div>

            <div className="form-grid" style={{ marginTop: '0.5rem' }}>
              <label>
                Nominee Full Name
                <input required value={name} onChange={(e) => setName(e.target.value)} />
              </label>

              <div className="form-field-group">
                <label>Relationship with Member</label>
                <ModernSelect
                  value={relation}
                  onChange={setRelation}
                  options={[
                    { value: 'Spouse', label: 'Spouse (Husband / Wife)', sublabel: 'Direct primary family beneficiary', badge: 'Family', badgeTone: 'emerald' },
                    { value: 'Son / Daughter', label: 'Son / Daughter (Child)', sublabel: 'Direct child beneficiary', badge: 'Child', badgeTone: 'purple' },
                    { value: 'Mother', label: 'Mother', sublabel: 'Dependent parent beneficiary', badge: 'Parent', badgeTone: 'orange' },
                    { value: 'Father', label: 'Father', sublabel: 'Dependent parent beneficiary', badge: 'Parent', badgeTone: 'orange' },
                    { value: 'Brother / Sister', label: 'Brother / Sister', sublabel: 'Sibling dependent beneficiary', badge: 'Sibling', badgeTone: 'slate' },
                    { value: 'Dependent Family', label: 'Other Dependent', sublabel: 'Legally authorized dependent', badge: 'Dependent', badgeTone: 'slate' },
                  ]}
                />
              </div>

              <label>
                Date of Birth
                <input type="date" required value={dob} onChange={(e) => setDob(e.target.value)} />
              </label>

              <label>
                Nominee Aadhaar / ID Ref
                <input required value={aadhaar} onChange={(e) => setAadhaar(e.target.value)} />
              </label>

              <label>
                Share Allocation Percentage (%)
                <input
                  type="number"
                  min={1}
                  max={100}
                  required
                  value={share}
                  onChange={(e) => setShare(Number(e.target.value))}
                />
              </label>

              <label>
                Guardian Name (if minor / &lt;18)
                <input
                  placeholder="Optional if nominee is adult"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                />
              </label>
            </div>

            <div className="quick-share-buttons-row">
              <span className="quick-share-label">Quick Share:</span>
              {[25, 30, 50, 70, 100].map((pct) => (
                <button
                  type="button"
                  key={pct}
                  className={`quick-share-btn ${share === pct ? 'active' : ''}`}
                  onClick={() => setShare(pct)}
                >
                  {pct}%
                </button>
              ))}
            </div>

            <div className="kyc-doc-auth-note">
              <span>ℹ <strong>Statutory e-Nomination:</strong> Nominee records require Aadhaar OTP e-Sign verification. Family nomination protects EPF balance & EPS survivor pension payout.</span>
            </div>
          </div>

          <div className="portal-form-drawer-footer">
            <button type="button" className="form-secondary-action" onClick={onClose}>Cancel</button>
            <button type="submit" className="panel-primary-action">
              {editingNominee ? 'Save Nominee Changes' : 'Add Nominee to Declaration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================================================================
   COMPREHENSIVE KYC MANAGEMENT & E-NOMINATION HUB
   ========================================================================= */
function ComprehensiveKycView({
  section,
  onSectionChange,
  nominees,
  kycList,
  onSetDefaultBank,
  onAddKycClick,
  onEditKycClick,
  onAddNomineeClick,
  onEditNomineeClick,
  onDeleteNominee,
  onToast,
}: {
  section: 'kyc' | 'nomination';
  onSectionChange: (sec: 'kyc' | 'nomination') => void;
  nominees: NomineeRecord[];
  kycList: KycRecord[];
  onSetDefaultBank: (id: string) => void;
  onAddKycClick: () => void;
  onEditKycClick: (record: KycRecord) => void;
  onAddNomineeClick: () => void;
  onEditNomineeClick: (nominee: NomineeRecord) => void;
  onDeleteNominee: (id: string) => void;
  onToast: (msg: string) => void;
}) {
  const totalShare = nominees.reduce((acc, n) => acc + n.share, 0);

  return (
    <div className="portal-view-stack">
      {/* Unified Action & Navigation Bar with Toggle & Add New */}
      <div className="kyc-action-bar">
        <div className="segmented-control" aria-label="KYC and nomination section switcher">
          <button
            type="button"
            className={section === 'kyc' ? 'active' : ''}
            onClick={() => onSectionChange('kyc')}
          >
            Currently Active KYC ({kycList.length})
          </button>
          <button
            type="button"
            className={section === 'nomination' ? 'active' : ''}
            onClick={() => onSectionChange('nomination')}
          >
            e-Nomination ({nominees.length} Nominees)
          </button>
        </div>

        {section === 'kyc' ? (
          <button
            type="button"
            className="panel-primary-action"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              minHeight: '38px',
              padding: '0.5rem 1.25rem',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #ea580c, #f43f5e)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.78rem',
              cursor: 'pointer',
              boxShadow: '0 3px 12px rgba(234, 88, 12, 0.3)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
            onClick={onAddKycClick}
          >
            + Add New
          </button>
        ) : (
          <button
            type="button"
            className="panel-primary-action"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              minHeight: '38px',
              padding: '0.5rem 1.25rem',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #ea580c, #f43f5e)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.78rem',
              cursor: 'pointer',
              boxShadow: '0 3px 12px rgba(234, 88, 12, 0.3)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
            onClick={onAddNomineeClick}
          >
            + Add New
          </button>
        )}
      </div>

      {section === 'kyc' ? (
        <>
          {/* Currently Active KYC Table */}
          <section className="portal-panel">
            <div className="panel-heading-row">
              <div>
                <p className="panel-eyebrow">Verified records</p>
                <h2>Currently Active KYC Documents</h2>
              </div>
              <span className="source-freshness">{kycList.length} Documents Seeded</span>
            </div>

            <div className="responsive-table-wrap">
              <table className="portal-data-table">
                <thead>
                  <tr>
                    <th>Document Type</th>
                    <th>Name on Document</th>
                    <th>Document Number</th>
                    <th>Document Specifics</th>
                    <th>Approving / Verifying Authority</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {kycList.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="kyc-doc-type-cell">
                          <span className="kyc-doc-emoji" aria-hidden="true">
                            {item.type === 'Aadhaar' ? '🆔' : item.type === 'PAN' ? '💳' : item.type === 'Bank' ? '🏦' : item.type === 'Passport' ? '🛂' : item.type === 'Voter ID' ? '🗳️' : '🚗'}
                          </span>
                          <div>
                            <strong>{item.type}</strong>
                            {item.isDefault && <span className="kyc-pill-tag emerald">Default Primary</span>}
                            {item.type === 'Passport' && item.isActive && <span className="kyc-pill-tag purple">Active Travel ID</span>}
                          </div>
                        </div>
                      </td>
                      <td>{item.name}</td>
                      <td><code>{item.docNo}</code></td>
                      <td className="kyc-specifics-cell">{item.specifics}</td>
                      <td>
                        <span className="kyc-authority-badge">{item.approvingAuthority}</span>
                      </td>
                      <td>
                        <span className="kyc-status-chip verified">✓ {item.status}</span>
                      </td>
                      <td>
                        <div className="kyc-action-cell">
                          <button
                            type="button"
                            className="btn-edit-action"
                            onClick={() => onEditKycClick(item)}
                            title={`Edit ${item.type} details`}
                          >
                            ✎ Edit
                          </button>
                          {item.type === 'Bank' && !item.isDefault && (
                            <button
                              type="button"
                              className="btn-set-default"
                              onClick={() => onSetDefaultBank(item.id)}
                            >
                              Set Default
                            </button>
                          )}
                          {item.type === 'Bank' && item.isDefault && (
                            <span className="kyc-default-active-tag">Primary</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Pending Approval Section */}
          <section className="portal-panel">
            <div className="panel-heading-row">
              <div>
                <p className="panel-eyebrow">Approval matrix</p>
                <h2>KYC Statutory Verification Process</h2>
              </div>
              <span className="source-freshness">Live Policy Guidelines</span>
            </div>
            <div className="kyc-approval-policy-grid">
              <div className="policy-step-box">
                <span className="policy-icon">🆔</span>
                <strong>Aadhaar Demographic Link</strong>
                <p>Directly verified online by UIDAI via demographic match and OTP. Single record per UAN.</p>
              </div>
              <div className="policy-step-box">
                <span className="policy-icon">💳</span>
                <strong>PAN Tax Record</strong>
                <p>Directly verified online by Income Tax Department (NSDL/ITD API). Eliminates TDS surcharge on settlements.</p>
              </div>
              <div className="policy-step-box">
                <span className="policy-icon">🏦</span>
                <strong>Bank Account Disbursals</strong>
                <p>Verified via Core Banking penny-drop API and approved by Employer DSC for NEFT settlements.</p>
              </div>
              <div className="policy-step-box">
                <span className="policy-icon">🛂</span>
                <strong>Passport & Photo IDs</strong>
                <p>Approved digitally by Establishment Employer via Digital Signature Certificate (DSC).</p>
              </div>
            </div>
          </section>
        </>
      ) : (
        <>
          {/* Existing Nominees List (Promoted to Top) */}
          <section className="portal-panel">
            <div className="panel-heading-row">
              <div>
                <p className="panel-eyebrow">Active nomination declaration</p>
                <h2>Nominees for EPF & EPS ({nominees.length})</h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span className={`share-total-badge ${totalShare === 100 ? 'valid' : 'invalid'}`}>
                  Total Share: {totalShare}% {totalShare === 100 ? '(100% Allocated)' : `(${100 - totalShare}% Unallocated)`}
                </span>
              </div>
            </div>

            {nominees.length === 0 ? (
              <div className="empty-state-notice">
                <p>No family nominees have been declared yet. Click <strong>&ldquo;+ Add Nominee Details&rdquo;</strong> above to register your first nominee.</p>
              </div>
            ) : (
              <div className="responsive-table-wrap">
                <table className="portal-data-table">
                  <thead>
                    <tr>
                      <th>Nominee Name</th>
                      <th>Relationship</th>
                      <th>Aadhaar / ID</th>
                      <th>Date of Birth</th>
                      <th>Share Allocation</th>
                      <th>Photo & e-Sign</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nominees.map((nom) => (
                      <tr key={nom.id}>
                        <td><strong>{nom.name}</strong></td>
                        <td>{nom.relation}</td>
                        <td><code>{nom.aadhaar}</code></td>
                        <td>{nom.dob || '—'}</td>
                        <td><strong>{nom.share}%</strong></td>
                        <td>
                          <span className="kyc-status-chip verified">✓ Aadhaar e-Signed</span>
                        </td>
                        <td>
                          <div className="kyc-action-cell">
                            <button
                              type="button"
                              className="btn-edit-action"
                              onClick={() => onEditNomineeClick(nom)}
                              title={`Edit ${nom.name}`}
                            >
                              ✎ Edit
                            </button>
                            <button
                              type="button"
                              className="btn-delete-action"
                              onClick={() => onDeleteNominee(nom.id)}
                              title={`Remove ${nom.name}`}
                            >
                              🗑 Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="nomination-actions-row">
              <button type="button" className="form-secondary-action" onClick={() => onToast('Simulated e-Nomination PDF summary downloaded.')}>
                Download e-Nomination PDF
              </button>
              <button
                type="button"
                className="panel-primary-action"
                onClick={() => onToast('Simulated Aadhaar e-Sign verification completed.')}
                disabled={totalShare !== 100}
              >
                Perform Digital e-Sign (Aadhaar OTP)
              </button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

/* =========================================================================
   ENHANCED SERVICE HISTORY & LIFECYCLE HUB
   ========================================================================= */
function EnhancedServiceHistoryView({
  onOpenPassbook,
  onOpenClaim,
  onInitiateTransfer,
  onToast,
}: {
  onOpenPassbook: () => void;
  onOpenClaim: () => void;
  onInitiateTransfer: () => void;
  onToast: (msg: string) => void;
}) {
  const [expandedMids, setExpandedMids] = useState<Record<string, boolean>>({
    'DEMO-MID-00101': true,
  });

  const toggleMid = (mid: string) => {
    setExpandedMids((prev) => ({
      ...prev,
      [mid]: !prev[mid],
    }));
  };

  const allExpanded = serviceHistoryRecords.every((r) => expandedMids[r.mid]);

  const toggleAll = () => {
    if (allExpanded) {
      setExpandedMids({});
    } else {
      const allTrue: Record<string, boolean> = {};
      serviceHistoryRecords.forEach((r) => {
        allTrue[r.mid] = true;
      });
      setExpandedMids(allTrue);
    }
  };

  return (
    <div className="portal-view-stack service-history-view-stack">
      {/* Compact Header card with toggle and transfer action */}
      <section className="service-history-header-card glass-panel-compact">
        <div>
          <p className="panel-eyebrow">Aadhaar-Linked Membership Records</p>
          <h2>Member Service History & Establishments</h2>
          <p className="service-header-subtitle">
            Consolidated employment records linked to UAN <strong>DEMO-UAN-001</strong> across <strong>3 establishments</strong>. Click any company tile to expand service specifications.
          </p>
        </div>
        <div className="service-header-actions">
          <button type="button" className="service-toggle-all-btn" onClick={toggleAll}>
            {allExpanded ? 'Collapse All Tiles' : 'Expand All Tiles'}
          </button>
          <button type="button" className="panel-primary-action" onClick={onInitiateTransfer}>
            ⚡ Initiate Transfer (Form 13)
          </button>
        </div>
      </section>

      {/* Interactive Expandable Service Tiles */}
      <div className="service-tiles-container" role="list">
        {serviceHistoryRecords.map((rec, idx) => {
          const isExpanded = !!expandedMids[rec.mid];

          return (
            <article
              key={rec.mid}
              className={`service-tile-card tier-${rec.tierTone} ${isExpanded ? 'is-expanded' : 'is-collapsed'}`}
              role="listitem"
            >
              {/* Clickable Header Tile */}
              <div
                className="service-tile-header"
                onClick={() => toggleMid(rec.mid)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleMid(rec.mid);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-expanded={isExpanded}
                aria-controls={`service-detail-${rec.mid}`}
              >
                <div className="service-tile-meta">
                  <div className="service-tile-title-row">
                    <span className="service-idx-badge">#{idx + 1}</span>
                    <h3>{rec.estName}</h3>
                    <span className={`service-status-pill tone-${rec.tagTone}`}>{rec.tag}</span>
                  </div>

                  <div className="service-tile-substrip">
                    <span>MID: <code>{rec.mid}</code></span>
                    <span className="bullet-sep">·</span>
                    <span>Tenure: <strong>{rec.tenure}</strong></span>
                    <span className="bullet-sep">·</span>
                    <span>Accumulation: <strong>{rec.pfBalance}</strong></span>
                  </div>
                </div>

                <div className="service-tile-action-area">
                  <span className="tile-toggle-text">{isExpanded ? 'Hide Specs' : 'View Specs'}</span>
                  <div className={`tile-chevron-pill ${isExpanded ? 'is-rotated' : ''}`} aria-hidden="true">
                    <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Compact Expanded Details Tray */}
              {isExpanded && (
                <div id={`service-detail-${rec.mid}`} className="service-tile-expanded-body">
                  <div className="service-specs-grid">
                    <div className="service-spec-item">
                      <small>Date of Joining (EPF / EPS)</small>
                      <strong>{rec.dojEpf} · {rec.dojEps}</strong>
                    </div>

                    <div className="service-spec-item">
                      <small>Date of Exit (EPF / EPS)</small>
                      <strong>{rec.doeEpf}</strong>
                    </div>

                    <div className="service-spec-item">
                      <small>Reason for Leaving</small>
                      <strong>{rec.reasonForLeaving}</strong>
                    </div>

                    <div className="service-spec-item">
                      <small>Establishment Code</small>
                      <code>{rec.estCode}</code>
                    </div>

                    <div className="service-spec-item">
                      <small>Transfer / Settlement Trail</small>
                      <strong>{rec.pfLastTransferred}</strong>
                    </div>

                    <div className="service-spec-item">
                      <small>Pension Scheme Benefit</small>
                      <strong>{rec.serviceBenefit}</strong>
                    </div>
                  </div>

                  {/* Compact Bottom Action Bar for Tile */}
                  <div className="service-tile-bottom-bar">
                    <div className="service-status-summary">
                      <span className="spec-indicator">Service: <strong>{rec.serviceStatus}</strong></span>
                      <span className="spec-indicator">PF Status: <strong>{rec.pfStatus}</strong></span>
                    </div>

                    <div className="service-tile-btns">
                      {rec.tier === 'primary' && (
                        <>
                          <button type="button" className="btn-service-compact" onClick={onOpenPassbook}>
                            View Passbook & Ledger →
                          </button>
                          <button type="button" className="btn-service-compact primary" onClick={onOpenClaim}>
                            File Online Advance →
                          </button>
                        </>
                      )}
                      {rec.tier === 'transfer' && (
                        <>
                          <button type="button" className="btn-service-compact transfer-cta" onClick={onInitiateTransfer}>
                            ⚡ Initiate Transfer to Active Account (Form 13)
                          </button>
                          <button type="button" className="btn-service-compact" onClick={() => onToast('Simulated Form 13 transfer summary downloaded.')}>
                            Download Summary
                          </button>
                        </>
                      )}
                      {rec.tier === 'settled' && (
                        <div className="settled-tray-row">
                          <span className="settled-tag">✓ Fully Settled & Reconciled</span>
                          <button type="button" className="btn-service-compact" onClick={() => onToast('Simulated settlement certificate downloaded.')}>
                            Download Certificate
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

function TrackClaimsView({ onOpenClaim }: { onOpenClaim: () => void }) {
  return (
    <div className="portal-view-stack">
      <section className="view-intro-card">
        <div>
          <p className="panel-eyebrow">Synthetic claim records</p>
          <h2>Track Claims & Field Office Processing</h2>
          <p>Real-time simulated tracking showing verification milestones, employer attestation, and NEFT dispatches.</p>
        </div>
        <button type="button" className="panel-primary-action" onClick={onOpenClaim}>
          + Submit New Claim
        </button>
      </section>
      <section className="claim-tracker-grid">
        {claimRows.map((claim) => (
          <article key={claim.id} className="portal-panel claim-tracker-card">
            <div className="claim-tracker-head">
              <div><code>{claim.id}</code><h3>{claim.type}</h3></div>
              <StatusPill>{claim.status}</StatusPill>
            </div>
            <dl>
              <div><dt>Submitted Date</dt><dd>{claim.submitted}</dd></div>
              <div><dt>Claim Amount</dt><dd>{claim.amount}</dd></div>
              <div><dt>Bank Destination</dt><dd>{claim.bankRef}</dd></div>
              <div><dt>Tracking Ref</dt><dd>FO-DELHI-SOUTH-001</dd></div>
            </dl>
            <div className="claim-progress" aria-label={`${claim.progress}% demonstration progress`}>
              <span style={{ width: `${claim.progress}%` }} />
            </div>
            <div className="claim-next-step">
              <b>{claim.status === 'Settled' ? 'Settled: Dispatched via NEFT' : claim.status === 'Under review' ? 'Next: Assistant PF Commissioner (APFC) approval' : 'Next: Re-verify bank destination'}</b>
              <span>Simulated tracking timeline.</span>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

/* =========================================================================
   ADD / EDIT BANK ACCOUNT DRAWER (RIGHT-SLIDE DRAWER)
   ========================================================================= */
function AddBankDrawer({
  isOpen,
  onClose,
  editingBank,
  onSaveBank,
}: {
  isOpen: boolean;
  onClose: () => void;
  editingBank: BankAccountItem | null;
  onSaveBank: (bank: BankAccountItem) => void;
}) {
  if (!isOpen) return null;
  return <AddBankDrawerForm key={editingBank?.id || 'new'} editingBank={editingBank} onClose={onClose} onSaveBank={onSaveBank} />;
}

function AddBankDrawerForm({
  editingBank,
  onClose,
  onSaveBank,
}: {
  editingBank: BankAccountItem | null;
  onClose: () => void;
  onSaveBank: (bank: BankAccountItem) => void;
}) {
  const isEditing = !!editingBank;
  const [bankName, setBankName] = useState(editingBank?.bankName || 'DEMO STATE BANK OF INDIA');
  const [accountHolderName, setAccountHolderName] = useState(editingBank?.accountHolderName || 'DEMO MEMBER 001');
  const [accountNumber, setAccountNumber] = useState(editingBank?.accountNumber || 'DEMO-ACCOUNT-002');
  const [ifscCode, setIfscCode] = useState(editingBank?.ifscCode || 'DEMO-IFSC-002');
  const [accountType, setAccountType] = useState<'savings' | 'current'>(editingBank?.accountType || 'savings');
  const [isPrimary, setIsPrimary] = useState(editingBank?.isPrimary ?? false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedBank: BankAccountItem = {
      id: editingBank?.id || `DEMO-ACC-${Date.now().toString().slice(-4)}`,
      bankName: bankName.trim(),
      accountHolderName: accountHolderName.trim(),
      accountNumber: accountNumber.trim().toUpperCase(),
      ifscCode: ifscCode.trim().toUpperCase(),
      accountType,
      isPrimary,
      status: 'Verified',
      branchName: 'NEO BANKING CENTRAL BRANCH',
    };
    onSaveBank(updatedBank);
    onClose();
  };

  return (
    <div className="portal-form-drawer-overlay" role="dialog" aria-modal="true" aria-labelledby="bank-drawer-title">
      <div className="drawer-backdrop" onClick={onClose} />
      <div className="portal-form-drawer">
        <div className="drawer-header">
          <div className="drawer-header-copy">
            <span className="drawer-eyebrow">Bank account management</span>
            <h2 id="bank-drawer-title">{isEditing ? 'Edit Bank Account Details' : 'Add Bank Account Details'}</h2>
          </div>
          <button type="button" className="drawer-close-btn" onClick={onClose} aria-label="Close drawer">×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div className="portal-form-drawer-body">
            <div className="form-grid" style={{ marginTop: '0.5rem' }}>
              <label>
                Bank Name
                <input
                  required
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g. DEMO STATE BANK OF INDIA"
                />
              </label>

              <label>
                Account Holder Name
                <input
                  required
                  value={accountHolderName}
                  onChange={(e) => setAccountHolderName(e.target.value)}
                  placeholder="e.g. DEMO MEMBER 001"
                />
              </label>

              <label>
                Account Number
                <input
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="e.g. DEMO-ACCOUNT-002"
                />
              </label>

              <label>
                IFSC Code
                <input
                  required
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                  placeholder="e.g. DEMO-IFSC-002"
                />
              </label>

              <div className="form-field-group">
                <label>Account Type</label>
                <ModernSelect
                  value={accountType}
                  onChange={(val) => setAccountType(val as 'savings' | 'current')}
                  options={[
                    { value: 'savings', label: 'Savings Account', sublabel: 'Standard personal savings account for NEFT credit', badge: 'Personal', badgeTone: 'emerald' },
                    { value: 'current', label: 'Current Account', sublabel: 'Commercial current account for statutory settlements', badge: 'Commercial', badgeTone: 'slate' },
                  ]}
                />
              </div>

              <label
                className="confirmation-check"
                style={{
                  gridColumn: 'span 2',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '0.65rem',
                  cursor: 'pointer',
                  marginTop: '0.6rem',
                  background: 'rgba(255, 244, 234, 0.5)',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(234, 88, 12, 0.18)',
                }}
              >
                <input
                  type="checkbox"
                  checked={isPrimary}
                  onChange={(e) => setIsPrimary(e.target.checked)}
                  style={{
                    minHeight: 'auto',
                    width: '18px',
                    height: '18px',
                    margin: 0,
                    cursor: 'pointer',
                    accentColor: '#ea580c',
                    flex: '0 0 18px',
                  }}
                />
                <span style={{ fontSize: '0.74rem', color: '#2b1810', fontWeight: 600, userSelect: 'none' }}>
                  Set this account as the primary destination for NEFT claim disbursements
                </span>
              </label>
            </div>
          </div>

          <div className="portal-form-drawer-footer">
            <button type="button" className="form-secondary-action" onClick={onClose}>Cancel</button>
            <button type="submit" className="panel-primary-action">
              {isEditing ? 'Save Changes' : 'Save Bank Account Details'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================================================================
   BANKING DETAILS VIEW (SLIM MULTI-ACCOUNT MANAGEMENT & MASKED DATA)
   ========================================================================= */
function maskTrailingFive(value: string): string {
  if (!value) return '';
  if (value.length <= 5) return 'XXXXX';
  return `${value.slice(0, -5)}XXXXX`;
}

function BankingView({
  bankAccounts,
  onAddBankClick,
  onEditBankClick,
  onSetPrimaryBank,
  onDeleteBank,
}: {
  bankAccounts: BankAccountItem[];
  onAddBankClick: () => void;
  onEditBankClick: (bank: BankAccountItem) => void;
  onSetPrimaryBank: (id: string) => void;
  onDeleteBank: (id: string) => void;
}) {
  const primaryBank = bankAccounts.find((b) => b.isPrimary) || bankAccounts[0];

  return (
    <div className="portal-view-stack portal-form-layout">
      <div className="claim-workflow-container">
        {/* Header Section */}
        <section className="portal-panel">
          <div className="panel-heading-row" style={{ alignItems: 'center' }}>
            <div>
              <p className="panel-eyebrow">Claim settlement destinations</p>
              <h2>Seeded Bank Account Details ({bankAccounts.length})</h2>
              <p>Manage your linked bank accounts. Online claims and pension settlements are dispatched via NEFT to your primary account.</p>
            </div>
            <button
              type="button"
              className="panel-primary-action"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                minHeight: '38px',
                padding: '0.5rem 1.25rem',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #ea580c, #f43f5e)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.78rem',
                cursor: 'pointer',
                boxShadow: '0 3px 12px rgba(234, 88, 12, 0.3)',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
              onClick={onAddBankClick}
            >
              + Add New
            </button>
          </div>

          {/* List of Slim Bank Account Cards */}
          <div className="bank-accounts-card-list" style={{ display: 'grid', gap: '0.6rem', marginTop: '0.75rem' }}>
            {bankAccounts.map((acc) => (
              <article
                key={acc.id}
                className="slim-bank-account-card"
                style={{
                  border: acc.isPrimary ? '1.5px solid #059669' : '1px solid #ded3c5',
                  background: acc.isPrimary ? '#f0fdf4' : '#ffffff',
                  borderRadius: '10px',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.85rem',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: '200px' }}>
                  <span style={{ fontSize: '1.3rem' }}>🏦</span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <strong style={{ fontSize: '0.82rem', color: '#2b1810' }}>{acc.bankName}</strong>
                      {acc.isPrimary && (
                        <span style={{ background: '#059669', color: '#ffffff', padding: '0.12rem 0.45rem', borderRadius: '12px', fontSize: '0.62rem', fontWeight: 800 }}>
                          Primary
                        </span>
                      )}
                    </div>
                    <small style={{ display: 'block', color: '#63534f', fontSize: '0.68rem' }}>
                      {acc.accountHolderName} · {acc.accountType === 'savings' ? 'Savings A/C' : 'Current A/C'}
                    </small>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.74rem' }}>
                  <div>
                    <span style={{ color: '#8a7a75', fontSize: '0.64rem', display: 'block' }}>A/C Number</span>
                    <code style={{ fontSize: '0.76rem', color: '#85371c', fontWeight: 800 }}>{maskTrailingFive(acc.accountNumber)}</code>
                  </div>
                  <div>
                    <span style={{ color: '#8a7a75', fontSize: '0.64rem', display: 'block' }}>IFSC</span>
                    <code style={{ fontSize: '0.76rem', color: '#85371c', fontWeight: 800 }}>{maskTrailingFive(acc.ifscCode)}</code>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  {!acc.isPrimary && (
                    <button
                      type="button"
                      className="epfo-btn-secondary"
                      style={{ fontSize: '0.68rem', padding: '0.3rem 0.55rem' }}
                      onClick={() => onSetPrimaryBank(acc.id)}
                    >
                      Make Primary
                    </button>
                  )}
                  <button
                    type="button"
                    className="epfo-btn-secondary"
                    style={{ fontSize: '0.68rem', padding: '0.3rem 0.55rem', background: '#ffffff', color: '#2b1810', border: '1px solid #ded3c5' }}
                    onClick={() => onEditBankClick(acc)}
                  >
                    Edit
                  </button>
                  {bankAccounts.length > 1 && (
                    <button
                      type="button"
                      style={{ fontSize: '0.68rem', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, padding: '0.3rem 0.45rem' }}
                      onClick={() => onDeleteBank(acc.id)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {/* Right Column: Primary Destination Summary Card */}
      <aside className="portal-panel bank-destination-card">
        <p className="panel-eyebrow">Currently Seeded Destination</p>
        <h2>{primaryBank ? primaryBank.bankName : 'DEMO-BANK-001'}</h2>
        <strong>{primaryBank ? maskTrailingFive(primaryBank.accountNumber) : 'DEMO-ACCOUNT-XXXXX'}</strong>
        <span>IFSC: {primaryBank ? maskTrailingFive(primaryBank.ifscCode) : 'DEMO-IFSC-XXXXX'} · {primaryBank?.accountType === 'savings' ? 'Savings Account' : 'Current Account'}</span>
        <div className="destination-status">
          <i aria-hidden="true" style={{ background: '#10b981' }} />
          Verified online by Bank (Direct API)
        </div>
      </aside>
    </div>
  );
}

function SchemesView({ onToast }: { onToast: (message: string) => void }) {
  return (
    <div className="portal-view-stack">
      <section className="view-intro-card">
        <div>
          <p className="panel-eyebrow">Statutory schemes</p>
          <h2>EPFO Benefit Schemes & Initiatives</h2>
          <p>Overview of provident fund, pension and employee deposit linked insurance coverage.</p>
        </div>
      </section>
      <section className="service-launcher-grid">
        <button type="button" onClick={() => onToast('Opened PMVBRY scheme guidance preview.')}>
          <span>PM</span><strong>PMVBRY Initiative</strong>
          <p>Pradhan Mantri Vaya Vandana & special central welfare incentives.</p>
          <b>Preview →</b>
        </button>
        <button type="button" onClick={() => onToast('Opened Employees’ Pension Scheme guidance.')}>
          <span>EP</span><strong>Employees’ Pension Scheme (EPS-95)</strong>
          <p>Understand eligible pensionable service, Scheme Certificates and monthly pension calculation.</p>
          <b>Preview →</b>
        </button>
        <button type="button" onClick={() => onToast('Opened EDLI insurance scheme guidance.')}>
          <span>ED</span><strong>EDLI Insurance Scheme</strong>
          <p>Life assurance benefit up to ₹ 7 Lakhs for active member families.</p>
          <b>Preview →</b>
        </button>
      </section>
    </div>
  );
}

function ProfileView({
  profileName,
  profileNameDraft,
  onNameChange,
  onSubmit,
}: {
  profileName: string;
  profileNameDraft: string;
  onNameChange: (name: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="portal-view-stack">
      <section className="view-intro-card">
        <div>
          <p className="panel-eyebrow">Member profile</p>
          <h2>Profile & preferences</h2>
          <p>Manage this local synthetic dashboard profile.</p>
        </div>
        <span className="profile-page-avatar" aria-hidden="true">{profileName.split(' ').slice(0, 2).map((part) => part[0]).join('')}</span>
      </section>
      <form className="portal-panel profile-preferences-form" onSubmit={onSubmit}>
        <div className="safety-callout"><b>Synthetic profile only:</b><span>This change remains in this dashboard session and does not update an EPFO record.</span></div>
        <label htmlFor="synthetic-profile-name">Synthetic display name
          <input id="synthetic-profile-name" value={profileNameDraft} onChange={(event) => onNameChange(event.target.value)} maxLength={15} autoComplete="off" aria-describedby="synthetic-profile-name-hint" />
        </label>
        <small id="synthetic-profile-name-hint">Use DEMO MEMBER followed by a three-digit number.</small>
        <div className="form-action-row"><button type="submit" className="panel-primary-action">Save simulated profile</button></div>
      </form>
    </div>
  );
}

function GrievanceView() {
  return (
    <div className="portal-view-stack">
      <section className="view-intro-card">
        <div>
          <p className="panel-eyebrow">EPFiGMS Redressal</p>
          <h2>Grievance Redressal & Support</h2>
          <p>The EPFiGMS grievance management system opens in a dedicated tab.</p>
        </div>
      </section>
      <div className="portal-panel" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
        <p style={{ margin: '0 0 1.25rem', color: '#63534f', fontSize: '0.92rem' }}>
          Lodge a complaint directly with the Regional Office, track investigation status, or dispatch reminders on the dedicated Grievance Portal.
        </p>
        <a
          href="/grievance"
          target="_blank"
          rel="noopener noreferrer"
          className="panel-primary-action"
          style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          Open Grievance Portal in New Tab ↗
        </a>
      </div>
    </div>
  );
}

export function RoleDashboardPreview({ role, displayName, onSignOut, initialTranslationLanguage }: RoleDashboardPreviewProps) {
  const tasks = role === 'employer'
    ? [['ECR', 'ECR filing workspace'], ['EMP', 'Employee lifecycle'], ['PAY', 'Payment reconciliation'], ['TEAM', 'Authorized team roles']]
    : [['PPO', 'Pension payment status'], ['DLC', 'Digital Life Certificate'], ['PAY', 'Payment history'], ['HELP', 'Pensioner support']];
  return (
    <div className="modern-portal-layout glass-member-portal">
      <main className="role-preview-shell">
        <div className="role-preview-head">
          <div>
            <span className="sidebar-logo-icon">EP</span>
            <p className="panel-eyebrow">{role} portal concept</p>
            <h1>Welcome, {displayName}</h1>
            <p>This role remains a bounded information-architecture preview. No member data is shown.</p>
          </div>
          <div className="role-preview-actions">
            <LanguageSelector reloadAfterChange initialTranslationLanguage={initialTranslationLanguage} />
            <button type="button" onClick={onSignOut}>End simulated session</button>
          </div>
        </div>
        <section className="service-launcher-grid">
          {tasks.map(([icon, title]) => (
            <article key={icon} className="portal-panel">
              <span className="nav-letter-icon">{icon}</span>
              <h2>{title}</h2>
              <p>Proposed synthetic workspace. Production policy, data and authorization remain Unknown.</p>
            </article>
          ))}
        </section>
        <p className="dashboard-prototype-disclosure notranslate" translate="no">Prototype — synthetic data only.</p>
      </main>
    </div>
  );
}
