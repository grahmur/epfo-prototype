'use client';

import React, { useState, useRef, useEffect, useId } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  sublabel?: string;
  badge?: string;
  badgeTone?: 'orange' | 'emerald' | 'purple' | 'slate' | 'blue';
  disabled?: boolean;
}

export interface ModernSelectProps {
  id?: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  size?: 'default' | 'compact' | 'large';
}

export function ModernSelect({
  id,
  value,
  options,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  className = '',
  ariaLabel,
  size = 'default',
}: ModernSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const generatedId = useId();
  const selectId = id || `modern-select-${generatedId}`;

  const selectedOption = options.find((opt) => opt.value === value);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const [openUpward, setOpenUpward] = useState(false);

  const checkPlacement = () => {
    if (triggerRef.current && typeof window !== 'undefined') {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUpward(spaceBelow < 280 && rect.top > 260);
    }
  };

  const openDropdown = () => {
    if (disabled) return;
    checkPlacement();
    const idx = options.findIndex((opt) => opt.value === value);
    setHighlightedIndex(idx >= 0 ? idx : 0);
    setIsOpen(true);
  };

  const toggleDropdown = () => {
    if (disabled) return;
    if (!isOpen) {
      openDropdown();
    } else {
      setIsOpen(false);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openDropdown();
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
      case 'Tab':
        setIsOpen(false);
        triggerRef.current?.focus();
        break;

      case 'ArrowDown': {
        e.preventDefault();
        const nextIdx = (highlightedIndex + 1) % options.length;
        setHighlightedIndex(nextIdx);
        break;
      }

      case 'ArrowUp': {
        e.preventDefault();
        const prevIdx = (highlightedIndex - 1 + options.length) % options.length;
        setHighlightedIndex(prevIdx);
        break;
      }

      case 'Enter':
      case ' ': {
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < options.length) {
          const opt = options[highlightedIndex];
          if (!opt.disabled) {
            onChange(opt.value);
            setIsOpen(false);
            triggerRef.current?.focus();
          }
        }
        break;
      }

      default:
        break;
    }
  };

  const handleSelectOption = (opt: SelectOption) => {
    if (opt.disabled) return;
    onChange(opt.value);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div
      ref={containerRef}
      className={`modern-select-container modern-select--${size} ${isOpen ? 'is-open' : ''} ${disabled ? 'is-disabled' : ''} ${className}`}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        id={selectId}
        type="button"
        className="modern-select-trigger"
        onClick={toggleDropdown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel || placeholder}
      >
        <div className="modern-select-trigger-content">
          {selectedOption ? (
            <>
              <span className="modern-select-label">{selectedOption.label}</span>
              {selectedOption.badge && (
                <span className={`modern-select-badge tone-${selectedOption.badgeTone || 'orange'}`}>
                  {selectedOption.badge}
                </span>
              )}
            </>
          ) : (
            <span className="modern-select-placeholder">{placeholder}</span>
          )}
        </div>

        <svg
          className={`modern-select-chevron ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          width="16"
          height="16"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Modern Frosted Dropdown Popover */}
      {isOpen && (
        <ul
          ref={listboxRef}
          className={`modern-select-popover ${openUpward ? 'is-upward' : ''}`}
          role="listbox"
          aria-labelledby={selectId}
          tabIndex={-1}
        >
          {options.map((opt, index) => {
            const isSelected = opt.value === value;
            const isHighlighted = index === highlightedIndex;

            return (
              <li
                key={opt.value}
                id={`${selectId}-opt-${index}`}
                role="option"
                aria-selected={isSelected}
                aria-disabled={opt.disabled}
                className={`modern-select-option ${isSelected ? 'is-selected' : ''} ${isHighlighted ? 'is-highlighted' : ''} ${opt.disabled ? 'is-disabled' : ''}`}
                onClick={() => handleSelectOption(opt)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <div className="modern-option-text">
                  <div className="modern-option-primary">
                    <span className="modern-option-label">{opt.label}</span>
                    {opt.badge && (
                      <span className={`modern-select-badge tone-${opt.badgeTone || 'orange'}`}>
                        {opt.badge}
                      </span>
                    )}
                  </div>
                  {opt.sublabel && <small className="modern-option-sublabel">{opt.sublabel}</small>}
                </div>

                {isSelected && (
                  <svg
                    className="modern-select-check-icon"
                    viewBox="0 0 20 20"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="4 11 8 15 16 6" />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
