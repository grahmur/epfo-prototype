'use client';

import React, { useState } from 'react';
import {
  CustomSelect,
  TextInput,
  TextArea,
  RadioPills,
  CaptchaField,
  FileDropzone,
  type AttachedFile,
} from '../ui';

export interface GrievanceData {
  regNo: string;
  category: string;
  office: string;
  regDate: string;
  status: 'Registered' | 'Forwarded to Regional Office' | 'Under Scrutiny' | 'Resolved' | 'Reminder Dispatched';
  summary: string;
  claimId?: string;
  resolutionAtr?: string;
}

const SAMPLE_GRIEVANCE_RECORDS: Record<string, GrievanceData> = {
  'EPFIGMS-DL-2026-00492': {
    regNo: 'EPFIGMS-DL-2026-00492',
    category: 'Non-Transfer of PF Accumulations (Form 13 Delay)',
    office: 'Regional Office, Delhi South (Wazirpur)',
    regDate: '12 Aug 2026',
    status: 'Resolved',
    summary: 'Transfer of PF accumulation from previous establishment DEMO GLOBAL SERVICES (DEMO-MID-00202) to current establishment DEMO TECH SOLUTIONS (DEMO-MID-00101) pending past 20 days.',
    claimId: 'DEMO-CLM-2026-9812',
    resolutionAtr: 'Form 13 transfer claim scrutinized and verified. Past service ledger credit of ₹45,280 transferred to active Member ID DEMO-MID-00101 on 20 Aug 2026. Electronic passbook has been updated.',
  },
  'EPFIGMS-MH-2026-00188': {
    regNo: 'EPFIGMS-MH-2026-00188',
    category: 'Delay in Online Advance Settlement (Form 31)',
    office: 'Regional Office, Bandra (Mumbai)',
    regDate: '22 Aug 2026',
    status: 'Under Scrutiny',
    summary: 'Form 31 emergency advance submitted for medical treatment is under field inquiry regarding bank IFSC match.',
    claimId: 'DEMO-CLM-2026-4419',
    resolutionAtr: 'Verification with clearing house gateway in progress. Dealing Assistant has requested IFSC confirmation.',
  },
  'EPFIGMS-KA-2026-00914': {
    regNo: 'EPFIGMS-KA-2026-00914',
    category: 'Non-Reflection of Annual Interest (8.25%) in Passbook',
    office: 'Regional Office, Bengaluru Central',
    regDate: '24 Aug 2026',
    status: 'Forwarded to Regional Office',
    summary: 'Annual statutory interest of 8.25% approved by Central Board of Trustees for FY 2024-25 not reflecting in electronic ledger.',
  },
};

const MEMBER_CATEGORIES = [
  'Final PF Settlement / Withdrawal Delay (Form 19)',
  'Pension Settlement / Scheme Certificate Delay (Form 10C / 10D)',
  'PF Advance / Partial Withdrawal Delay (Form 31)',
  'Transfer of PF Accumulations to New Account (Form 13)',
  'Non-Credit / Non-Reflection of 8.25% CBT Annual Interest',
  'Passbook Ledger Entry Discrepancy / Missing Month',
  'KYC / Joint Declaration / Aadhaar / Bank / Name Correction Delay',
  'Non-Remittance of Deducted PF by Employer',
  'Death Claim Settlement Delay (Form 20 / 5IF / EDLI)',
  'Other Member Issues',
];

const PENSIONER_CATEGORIES = [
  'Monthly Pension Non-Credit / Payment Stoppage',
  'Digital Life Certificate (Jeevan Pramaan) Update Issue',
  'Fixation / Revision of Pension / PPO Issuance Delay',
  'Higher Pension Option Query (EPS-95)',
  'Arrears of Pension Calculation / Payment Issue',
  'Other Pensioner Issues',
];

const EMPLOYER_CATEGORIES = [
  'ECR / Electronic Challan Submission / Payment Failure',
  'Online Registration of Establishment (OLRE) Delay',
  'DSC / Digital Signature Registration / Approval Issue',
  'Damages / Interest (Section 14B / 7Q) Calculation Query',
  'Other Employer Issues',
];

const OTHER_CATEGORIES = [
  'General Public / Citizen Information Request',
  'Vigilance / Misconduct Complaint',
  'Legal Heir / Unregistered Nominee Claim Query',
  'Other Inquiries',
];

const REGIONAL_OFFICES = [
  'Regional Office, Delhi South (Wazirpur)',
  'Regional Office, Delhi Central (Kidwai Nagar)',
  'Regional Office, Delhi North (Wazirpur)',
  'Regional Office, Bandra (Mumbai, MH)',
  'Regional Office, Thane (MH)',
  'Regional Office, Pune (MH)',
  'Regional Office, Bengaluru Central (KA)',
  'Regional Office, Bengaluru South (KA)',
  'Regional Office, Hyderabad (TS)',
  'Regional Office, Chennai Central (TN)',
  'Regional Office, Kolkata (WB)',
  'Regional Office, Ahmedabad (GJ)',
  'Regional Office, Jaipur (RJ)',
  'Regional Office, Chandigarh (PB & HR)',
  'Regional Office, Lucknow (UP)',
  'Regional Office, Kanpur (UP)',
];

export function GrievancePortal() {
  // Main view mode: 'register' | 'track'
  const [activeTab, setActiveTab] = useState<'register' | 'track'>('register');

  // Form State
  const [role, setRole] = useState<string>('member');
  const [hasClaimId, setHasClaimId] = useState<string>('yes');
  const [uan, setUan] = useState('DEMO-UAN-001');
  const [claimId, setClaimId] = useState('DEMO-CLM-2026-9812');
  const [claimDate, setClaimDate] = useState('2026-08-10');
  const [isCovidClaim, setIsCovidClaim] = useState<string>('no');
  const [ppoNumber, setPpoNumber] = useState('DEMO-PPO-554109');
  const [estCode, setEstCode] = useState('DEMO-EST-001');
  const [citizenName, setCitizenName] = useState('Suresh Kumar Verma');
  const [mobileNumber, setMobileNumber] = useState('9876543210');
  const [selectedOffice, setSelectedOffice] = useState('Regional Office, Delhi South (Wazirpur)');
  const [category, setCategory] = useState(MEMBER_CATEGORIES[0]);
  const [description, setDescription] = useState(
    'My Form 13 transfer request from DEMO GLOBAL SERVICES to DEMO TECH SOLUTIONS has been pending past 20 days. Kindly expedite reconciliation.'
  );
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const [captchaValue, setCaptchaValue] = useState('74829');

  // Acknowledgment State
  const [submittedReceipt, setSubmittedReceipt] = useState<{
    regNo: string;
    date: string;
    role: string;
    category: string;
    office: string;
  } | null>(null);

  // Status Tracking State
  const [trackQuery, setTrackQuery] = useState('EPFIGMS-DL-2026-00492');
  const [trackResult, setTrackResult] = useState<GrievanceData | null>(
    SAMPLE_GRIEVANCE_RECORDS['EPFIGMS-DL-2026-00492']
  );
  const [trackError, setTrackError] = useState('');

  // Reminder State inside tracking
  const [reminderSent, setReminderSent] = useState(false);
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [reminderNote, setReminderNote] = useState(
    'Requesting expedited update as claim is delayed beyond statutory SLA.'
  );

  // Feedback State
  const [userRating, setUserRating] = useState<number>(5);
  const [feedbackDone, setFeedbackDone] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  function triggerToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  }

  function handleRegisterSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newRegNo = `EPFIGMS-DL-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    setSubmittedReceipt({
      regNo: newRegNo,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      role: role === 'member' ? 'PF Member' : role === 'pensioner' ? 'EPS Pensioner' : role === 'employer' ? 'Employer' : 'Citizen / Other',
      category,
      office: selectedOffice,
    });
    triggerToast('Grievance registered successfully!');
  }

  function handleTrackSearch(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const q = trackQuery.trim().toUpperCase();
    if (SAMPLE_GRIEVANCE_RECORDS[q]) {
      setTrackResult(SAMPLE_GRIEVANCE_RECORDS[q]);
      setTrackError('');
      setReminderSent(false);
      setShowReminderForm(false);
    } else {
      setTrackResult(null);
      setTrackError('No grievance record found for this number. Try sample: EPFIGMS-DL-2026-00492');
    }
  }

  function handleSendReminder(e: React.FormEvent) {
    e.preventDefault();
    setReminderSent(true);
    setShowReminderForm(false);
    triggerToast('Escalation reminder dispatched to Regional Office.');
  }

  const categoryOptions =
    role === 'member'
      ? MEMBER_CATEGORIES
      : role === 'pensioner'
      ? PENSIONER_CATEGORIES
      : role === 'employer'
      ? EMPLOYER_CATEGORIES
      : OTHER_CATEGORIES;

  return (
    <div className="epfo-simple-grievance-container">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="sg-toast-banner" role="status">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mode Switcher Tabs */}
      <div className="sg-mode-bar">
        <button
          type="button"
          className={`sg-mode-tab ${activeTab === 'register' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('register');
            setSubmittedReceipt(null);
          }}
        >
          ✍️ Register New Grievance
        </button>
        <button
          type="button"
          className={`sg-mode-tab ${activeTab === 'track' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('track');
            if (!trackResult) {
              setTrackResult(SAMPLE_GRIEVANCE_RECORDS['EPFIGMS-DL-2026-00492']);
            }
          }}
        >
          🔍 Track Grievance Status & Reminders
        </button>
      </div>

      {/* =========================================================================
          TAB 1: REGISTER GRIEVANCE (POWERED BY REUSABLE UI COMPONENTS)
         ========================================================================= */}
      {activeTab === 'register' && (
        <div className="sg-card">
          {submittedReceipt ? (
            /* Simple Clean Acknowledgment Receipt */
            <div className="sg-acknowledgment-box">
              <div className="sg-ack-header">
                <span className="sg-ack-check">✓</span>
                <h2>Grievance Registered Successfully</h2>
                <p>An official acknowledgment has been recorded with the Regional Office.</p>
              </div>

              <div className="sg-ack-details">
                <div className="sg-ack-row">
                  <span className="sg-k">Registration Number</span>
                  <strong className="sg-v font-mono sg-highlight">{submittedReceipt.regNo}</strong>
                </div>
                <div className="sg-ack-row">
                  <span className="sg-k">Date of Registration</span>
                  <span className="sg-v">{submittedReceipt.date}</span>
                </div>
                <div className="sg-ack-row">
                  <span className="sg-k">Complainant Role</span>
                  <span className="sg-v">{submittedReceipt.role}</span>
                </div>
                <div className="sg-ack-row">
                  <span className="sg-k">Regional Office</span>
                  <span className="sg-v">{submittedReceipt.office}</span>
                </div>
                <div className="sg-ack-row">
                  <span className="sg-k">Category</span>
                  <span className="sg-v">{submittedReceipt.category}</span>
                </div>
                <div className="sg-ack-row">
                  <span className="sg-k">Resolution SLA Target</span>
                  <strong className="sg-v sg-sla-text">15 to 30 Working Days</strong>
                </div>
              </div>

              <div className="sg-ack-actions">
                <button
                  type="button"
                  className="epfo-btn-primary"
                  onClick={() => {
                    setTrackQuery(submittedReceipt.regNo);
                    setActiveTab('track');
                  }}
                >
                  Track Live Status →
                </button>
                <button
                  type="button"
                  className="epfo-btn-secondary"
                  onClick={() => window.print()}
                >
                  🖨️ Print Receipt
                </button>
                <button
                  type="button"
                  className="epfo-btn-outline"
                  onClick={() => setSubmittedReceipt(null)}
                >
                  + Lodge Another Grievance
                </button>
              </div>
            </div>
          ) : (
            /* Simple Direct Form */
            <form onSubmit={handleRegisterSubmit} className="sg-form">
              {/* 1. Complainant Role */}
              <div className="sg-form-section-header">
                <h3>1. Select Complainant Role</h3>
                <p>Select who is lodging this grievance to load role-specific fields.</p>
              </div>

              <RadioPills
                name="complainant_role"
                options={[
                  { value: 'member', label: 'PF Member', sublabel: 'Employee with UAN', icon: '👤' },
                  { value: 'pensioner', label: 'EPS Pensioner', sublabel: 'Pensioner with PPO', icon: '🎖️' },
                  { value: 'employer', label: 'Employer', sublabel: 'Establishment / Company', icon: '🏢' },
                  { value: 'other', label: 'Others', sublabel: 'Citizen / Legal Heir', icon: '👥' },
                ]}
                value={role}
                onChange={(val) => {
                  setRole(val);
                  setCategory(
                    val === 'member'
                      ? MEMBER_CATEGORIES[0]
                      : val === 'pensioner'
                      ? PENSIONER_CATEGORIES[0]
                      : val === 'employer'
                      ? EMPLOYER_CATEGORIES[0]
                      : OTHER_CATEGORIES[0]
                  );
                }}
              />

              {/* 2. Identity & Claim Details */}
              <div className="sg-form-section-header">
                <h3>2. Identity & Claim Details</h3>
              </div>

              {/* PF Member Specific */}
              {role === 'member' && (
                <div className="sg-fields-stack">
                  <RadioPills
                    name="has_claim_id"
                    label="Do you have an existing Claim ID regarding this grievance?"
                    required
                    options={[
                      { value: 'yes', label: 'Yes, I have a Claim ID' },
                      { value: 'no', label: 'No, this is an account / KYC / ledger inquiry' },
                    ]}
                    value={hasClaimId}
                    onChange={setHasClaimId}
                    layout="inline"
                  />

                  <div className="sg-grid-2">
                    <TextInput
                      id="uan-field"
                      label="Universal Account Number (UAN)"
                      required
                      mono
                      value={uan}
                      onChange={(e) => setUan(e.target.value)}
                      placeholder="e.g. DEMO-UAN-001"
                      helperText="Synthetic demo fixture: DEMO-UAN-001"
                    />

                    {hasClaimId === 'yes' && (
                      <>
                        <TextInput
                          id="claim-id-field"
                          label="Claim ID"
                          required
                          mono
                          value={claimId}
                          onChange={(e) => setClaimId(e.target.value)}
                          placeholder="e.g. DEMO-CLM-2026-9812"
                        />

                        <TextInput
                          id="claim-date-field"
                          label="Claim Date"
                          required
                          type="date"
                          value={claimDate}
                          onChange={(e) => setClaimDate(e.target.value)}
                        />

                        <RadioPills
                          name="is_covid_claim"
                          label="COVID-19 Advance Claim?"
                          options={[
                            { value: 'yes', label: 'Yes' },
                            { value: 'no', label: 'No' },
                          ]}
                          value={isCovidClaim}
                          onChange={setIsCovidClaim}
                          layout="inline"
                        />
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Pensioner Specific */}
              {role === 'pensioner' && (
                <div className="sg-grid-2">
                  <TextInput
                    id="ppo-field"
                    label="Pension Payment Order (PPO) Number"
                    required
                    mono
                    value={ppoNumber}
                    onChange={(e) => setPpoNumber(e.target.value)}
                    placeholder="e.g. DEMO-PPO-554109"
                  />
                  <TextInput
                    id="pensioner-mobile-field"
                    label="Registered Mobile Number"
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="10-digit mobile number"
                  />
                </div>
              )}

              {/* Employer Specific */}
              {role === 'employer' && (
                <div className="sg-grid-2">
                  <TextInput
                    id="est-code-field"
                    label="Establishment Code Number"
                    required
                    mono
                    value={estCode}
                    onChange={(e) => setEstCode(e.target.value)}
                    placeholder="e.g. DEMO-EST-001"
                  />
                  <TextInput
                    id="employer-mobile-field"
                    label="Authorised Contact Number"
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                  />
                </div>
              )}

              {/* Citizen / Others Specific */}
              {role === 'other' && (
                <div className="sg-grid-2">
                  <TextInput
                    id="citizen-name-field"
                    label="Full Name"
                    required
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                  />
                  <TextInput
                    id="citizen-mobile-field"
                    label="Mobile Number"
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                  />
                </div>
              )}

              {/* 3. Grievance Particulars & Dropdowns */}
              <div className="sg-form-section-header">
                <h3>3. Grievance Particulars & Supporting Document</h3>
              </div>

              <div className="sg-grid-2">
                <CustomSelect
                  id="regional-office-select"
                  label="Regional Office Pertaining to Grievance"
                  required
                  options={REGIONAL_OFFICES}
                  value={selectedOffice}
                  onChange={setSelectedOffice}
                  searchable
                  searchPlaceholder="Search regional office (e.g. Delhi, Bandra, Bengaluru)..."
                />

                <CustomSelect
                  id="grievance-category-select"
                  label="Grievance Category / Scheme Head"
                  required
                  options={categoryOptions}
                  value={category}
                  onChange={setCategory}
                  searchable
                  searchPlaceholder="Search grievance category (e.g. Form 19, Form 13)..."
                />
              </div>

              {/* Description */}
              <TextArea
                id="grievance-desc-field"
                label="Grievance Description / Narrative"
                required
                rows={4}
                maxLength={3000}
                currentLength={description.length}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your issue clearly (e.g. claim date, delay reasons, passbook discrepancy)..."
              />

              {/* Supporting Document Dropzone */}
              <FileDropzone
                label="Attach Supporting Document (PDF or JPG, up to 2MB)"
                file={attachedFile}
                onFileChange={setAttachedFile}
                helperText="Click to browse files (JPG, PNG or PDF up to 2MB)."
              />

              {/* Captcha Security Verification */}
              <CaptchaField
                id="security-captcha"
                label="Security Verification Code"
                required
                value={captchaValue}
                onChange={setCaptchaValue}
              />

              {/* Submit Button */}
              <div className="sg-submit-row">
                <button type="submit" className="epfo-btn-primary">
                  <span>Register Grievance →</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 2: TRACK STATUS & SEND REMINDERS
         ========================================================================= */}
      {activeTab === 'track' && (
        <div className="sg-card">
          <div className="sg-form-section-header">
            <h3>Track Grievance Status</h3>
            <p>Enter your registration number to view the investigation status or dispatch an escalation reminder.</p>
          </div>

          <form onSubmit={handleTrackSearch} className="sg-track-search-form">
            <div className="sg-search-input-wrap">
              <TextInput
                id="track-query-field"
                mono
                value={trackQuery}
                onChange={(e) => setTrackQuery(e.target.value)}
                placeholder="Enter Grievance Number (e.g. EPFIGMS-DL-2026-00492)..."
                required
              />
              <button type="submit" className="epfo-btn-primary">
                Check Status
              </button>
            </div>

            <div className="sg-quick-samples-row">
              <span className="sg-samples-label">Sample test numbers:</span>
              {Object.keys(SAMPLE_GRIEVANCE_RECORDS).map((k) => (
                <button
                  key={k}
                  type="button"
                  className={`sg-sample-chip ${trackQuery === k ? 'active' : ''}`}
                  onClick={() => {
                    setTrackQuery(k);
                    setTrackResult(SAMPLE_GRIEVANCE_RECORDS[k]);
                    setTrackError('');
                    setReminderSent(false);
                    setShowReminderForm(false);
                  }}
                >
                  {k}
                </button>
              ))}
            </div>
          </form>

          {trackError && (
            <div className="sg-error-banner">
              <span>⚠️</span>
              <p>{trackError}</p>
            </div>
          )}

          {/* Status Result Card */}
          {trackResult && (
            <div className="sg-track-result-box">
              <div className="sg-result-header">
                <div>
                  <span className="sg-k">GRIEVANCE REGISTRATION NUMBER</span>
                  <h3 className="font-mono">{trackResult.regNo}</h3>
                </div>
                <span className={`sg-status-badge status-${trackResult.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {trackResult.status}
                </span>
              </div>

              <div className="sg-result-grid">
                <div>
                  <span className="sg-k">Registration Date</span>
                  <span className="sg-v">{trackResult.regDate}</span>
                </div>
                <div>
                  <span className="sg-k">Dealing Regional Office</span>
                  <span className="sg-v">{trackResult.office}</span>
                </div>
                <div>
                  <span className="sg-k">Grievance Category</span>
                  <span className="sg-v">{trackResult.category}</span>
                </div>
                {trackResult.claimId && (
                  <div>
                    <span className="sg-k">Associated Claim ID</span>
                    <span className="sg-v font-mono">{trackResult.claimId}</span>
                  </div>
                )}
              </div>

              <div className="sg-result-summary">
                <span className="sg-k">Complaint Summary</span>
                <p>{trackResult.summary}</p>
              </div>

              {/* Action Taken Report */}
              {trackResult.resolutionAtr && (
                <div className="sg-atr-box">
                  <strong>Action Taken Report (ATR) / Resolution Remarks:</strong>
                  <p>{trackResult.resolutionAtr}</p>
                </div>
              )}

              {/* Reminder Section */}
              {trackResult.status !== 'Resolved' && (
                <div className="sg-reminder-action-box">
                  {reminderSent ? (
                    <div className="sg-reminder-sent-banner">
                      <span>✓</span>
                      <span>Escalation reminder dispatched to Regional Office Nodal Officer.</span>
                    </div>
                  ) : showReminderForm ? (
                    <form onSubmit={handleSendReminder} className="sg-reminder-inline-form">
                      <TextArea
                        id="reminder-note-field"
                        label="Escalation Reason for Delayed Case"
                        required
                        rows={2}
                        value={reminderNote}
                        onChange={(e) => setReminderNote(e.target.value)}
                      />
                      <div className="sg-reminder-btn-row">
                        <button type="button" className="epfo-btn-outline" onClick={() => setShowReminderForm(false)}>
                          Cancel
                        </button>
                        <button type="submit" className="epfo-btn-primary">
                          ⚡ Dispatch Escalation Reminder
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="sg-reminder-prompt">
                      <span>Has your case been pending past 15 working days?</span>
                      <button
                        type="button"
                        className="epfo-btn-secondary"
                        onClick={() => setShowReminderForm(true)}
                      >
                        ⚡ Send Escalation Reminder
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Citizen Rating */}
              {trackResult.status === 'Resolved' && (
                <div className="sg-rating-section">
                  <span className="sg-k">Citizen Satisfaction Rating</span>
                  {feedbackDone ? (
                    <p className="sg-feedback-done">✓ Thank you for rating the grievance resolution.</p>
                  ) : (
                    <div className="sg-stars-row">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          className={`sg-star-btn ${userRating >= s ? 'active' : ''}`}
                          onClick={() => {
                            setUserRating(s);
                            setFeedbackDone(true);
                            triggerToast('Rating submitted. Thank you!');
                          }}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
