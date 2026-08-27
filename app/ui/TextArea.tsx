'use client';

import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label?: string;
  required?: boolean;
  helperText?: string;
  error?: string;
  maxLength?: number;
  currentLength?: number;
}

export function TextArea({
  id,
  label,
  required = false,
  helperText,
  error,
  maxLength,
  currentLength,
  className = '',
  rows = 4,
  ...textareaProps
}: TextAreaProps) {
  return (
    <div className={`epfo-field-group ${error ? 'has-error' : ''}`}>
      {label && (
        <div className="epfo-label-with-meta">
          <label htmlFor={id} className="epfo-field-label">
            {label} {required && <span className="epfo-req-star">*</span>}
          </label>
          {maxLength !== undefined && currentLength !== undefined && (
            <span className="epfo-char-count">
              {currentLength} / {maxLength} characters
            </span>
          )}
        </div>
      )}

      <textarea
        id={id}
        rows={rows}
        className={`epfo-textarea-control ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : helperText ? `${id}-help` : undefined}
        maxLength={maxLength}
        {...textareaProps}
      />

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
