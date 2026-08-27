'use client';

import React from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  required?: boolean;
  helperText?: string;
  error?: string;
  mono?: boolean;
  leadingIcon?: string;
  trailingElement?: React.ReactNode;
}

export function TextInput({
  id,
  label,
  required = false,
  helperText,
  error,
  mono = false,
  leadingIcon,
  trailingElement,
  className = '',
  ...inputProps
}: TextInputProps) {
  return (
    <div className={`epfo-field-group ${error ? 'has-error' : ''}`}>
      {label && (
        <label htmlFor={id} className="epfo-field-label">
          {label} {required && <span className="epfo-req-star">*</span>}
        </label>
      )}

      <div className="epfo-input-wrapper">
        {leadingIcon && (
          <span className="epfo-input-leading-icon" aria-hidden="true">
            {leadingIcon}
          </span>
        )}

        <input
          id={id}
          className={`epfo-text-input ${mono ? 'font-mono' : ''} ${leadingIcon ? 'has-leading' : ''} ${
            trailingElement ? 'has-trailing' : ''
          } ${className}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-help` : undefined}
          {...inputProps}
        />

        {trailingElement && <div className="epfo-input-trailing-wrap">{trailingElement}</div>}
      </div>

      {helperText && !error && (
        <small id={`${id}-help`} className="epfo-field-helper">
          {helperText}
        </small>
      )}

      {error && (
        <small id={`${id}-error`} className="epfo-field-error">
          {error}
        </small>
      )}
    </div>
  );
}
