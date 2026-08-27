'use client';

export interface RadioOption {
  value: string;
  label: string;
  sublabel?: string;
  icon?: string;
}

interface RadioPillsProps {
  name: string;
  label?: string;
  required?: boolean;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  layout?: 'grid' | 'inline';
  helperText?: string;
  error?: string;
}

export function RadioPills({
  name,
  label,
  required = false,
  options,
  value,
  onChange,
  layout = 'grid',
  helperText,
  error,
}: RadioPillsProps) {
  return (
    <div className={`epfo-field-group epfo-radio-pills-group ${error ? 'has-error' : ''}`}>
      {label && (
        <span className="epfo-field-label">
          {label} {required && <span className="epfo-req-star">*</span>}
        </span>
      )}

      <div className={`epfo-pills-container layout-${layout}`}>
        {options.map((opt) => {
          const isSelected = opt.value === value;

          return (
            <label
              key={opt.value}
              className={`epfo-radio-pill ${isSelected ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={isSelected}
                onChange={() => onChange(opt.value)}
                className="epfo-visually-hidden"
              />
              {opt.icon && <span className="epfo-pill-icon">{opt.icon}</span>}
              <div className="epfo-pill-text-wrap">
                <span className="epfo-pill-main-label">{opt.label}</span>
                {opt.sublabel && <span className="epfo-pill-sub-label">{opt.sublabel}</span>}
              </div>
            </label>
          );
        })}
      </div>

      {helperText && !error && <small className="epfo-field-helper">{helperText}</small>}
      {error && <small className="epfo-field-error">{error}</small>}
    </div>
  );
}
