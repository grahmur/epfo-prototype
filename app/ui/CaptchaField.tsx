'use client';

import { useState } from 'react';

interface CaptchaFieldProps {
  id?: string;
  label?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function CaptchaField({
  id = 'captcha-field',
  label = 'Security Verification Code',
  required = true,
  value,
  onChange,
  error,
}: CaptchaFieldProps) {
  const [captchaCode, setCaptchaCode] = useState('74829');

  function handleRefresh() {
    const newCode = Math.floor(10000 + Math.random() * 90000).toString();
    setCaptchaCode(newCode);
  }

  return (
    <div className={`epfo-field-group epfo-captcha-field-group ${error ? 'has-error' : ''}`}>
      {label && (
        <label htmlFor={id} className="epfo-field-label">
          {label} {required && <span className="epfo-req-star">*</span>}
        </label>
      )}

      <div className="epfo-captcha-row">
        <input
          id={id}
          type="text"
          maxLength={6}
          className="epfo-text-input epfo-captcha-input"
          placeholder="Enter code"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          aria-invalid={Boolean(error)}
        />

        <div className="epfo-captcha-badge-display">
          <span className="epfo-captcha-chars">{captchaCode}</span>
          <button
            type="button"
            className="epfo-captcha-refresh-btn"
            onClick={handleRefresh}
            title="Generate new security code"
            aria-label="Generate new security code"
          >
            🔄
          </button>
        </div>
      </div>

      <small className="epfo-field-helper">Enter the 5 numbers displayed in the security badge.</small>
      {error && <small className="epfo-field-error">{error}</small>}
    </div>
  );
}
