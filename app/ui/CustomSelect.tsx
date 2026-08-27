'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  sublabel?: string;
  badge?: string;
}

interface CustomSelectProps {
  id?: string;
  label?: string;
  required?: boolean;
  options: Array<string | SelectOption>;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
}

export function CustomSelect({
  id,
  label,
  required = false,
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  searchable = true,
  searchPlaceholder = 'Search options...',
  helperText,
  error,
  disabled = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  // Normalize options into SelectOption objects
  const normalizedOptions: SelectOption[] = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  const filteredOptions = normalizedOptions.filter(
    (opt) =>
      opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (opt.sublabel && opt.sublabel.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Handle outside click & escape key
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setSearchQuery('');
      }
    }

    document.addEventListener('pointerdown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  function handleSelect(val: string) {
    onChange(val);
    setIsOpen(false);
    setSearchQuery('');
  }

  function handleTriggerKeyDown(e: React.KeyboardEvent) {
    if (disabled) return;

    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(true);
      setHighlightedIndex(0);
    }
  }

  function handleListKeyDown(e: React.KeyboardEvent) {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
    } else if (e.key === 'Enter' && highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
      e.preventDefault();
      handleSelect(filteredOptions[highlightedIndex].value);
    } else if (e.key === 'Tab') {
      setIsOpen(false);
      setSearchQuery('');
    }
  }

  return (
    <div className={`epfo-custom-select-group ${disabled ? 'disabled' : ''} ${error ? 'has-error' : ''}`} ref={containerRef}>
      {label && (
        <label htmlFor={id} className="epfo-select-label">
          {label} {required && <span className="epfo-req-star">*</span>}
        </label>
      )}

      <div className="epfo-select-wrapper">
        <button
          id={id}
          type="button"
          className={`epfo-select-trigger ${isOpen ? 'open' : ''} ${selectedOption ? 'selected' : 'placeholder'}`}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          onKeyDown={handleTriggerKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          disabled={disabled}
        >
          <span className="epfo-select-value-text">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className="epfo-select-chevron" aria-hidden="true">
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path
                d="M1.5 1.75L6 6.25L10.5 1.75"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>

        {isOpen && (
          <div className="epfo-select-popover" role="presentation">
            {searchable && normalizedOptions.length > 5 && (
              <div className="epfo-select-search-box">
                <span className="search-icon" aria-hidden="true">🔍</span>
                <input
                  ref={searchInputRef}
                  type="text"
                  className="epfo-select-search-input"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setHighlightedIndex(0);
                  }}
                  onKeyDown={handleListKeyDown}
                  aria-label={searchPlaceholder}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="clear-search-btn"
                    onClick={() => setSearchQuery('')}
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}

            <ul
              ref={listboxRef}
              className="epfo-select-options-list"
              role="listbox"
              aria-label={label ?? placeholder}
              onKeyDown={handleListKeyDown}
              tabIndex={-1}
            >
              {filteredOptions.length === 0 ? (
                <li className="epfo-select-no-results">No matching options found</li>
              ) : (
                filteredOptions.map((opt, index) => {
                  const isSelected = opt.value === value;
                  const isHighlighted = index === highlightedIndex;

                  return (
                    <li
                      key={opt.value}
                      className={`epfo-select-option ${isSelected ? 'selected' : ''} ${
                        isHighlighted ? 'highlighted' : ''
                      }`}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(opt.value)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                    >
                      <div className="option-text-wrap">
                        <span className="option-label">{opt.label}</span>
                        {opt.sublabel && <span className="option-sublabel">{opt.sublabel}</span>}
                      </div>
                      {opt.badge && <span className="option-badge">{opt.badge}</span>}
                      {isSelected && (
                        <span className="option-check-icon" aria-hidden="true">
                          ✓
                        </span>
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        )}
      </div>

      {helperText && !error && <small className="epfo-select-helper">{helperText}</small>}
      {error && <small className="epfo-select-error-msg">{error}</small>}
    </div>
  );
}
