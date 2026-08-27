'use client';

import { useEffect, useRef, useState } from 'react';

interface LanguageOption {
  code: string;
  native: string;
  english: string;
  sub?: string;
  badge?: string;
}

const featuredLanguages: LanguageOption[] = [
  { code: 'en', native: 'English', english: 'English', sub: 'Default statutory language', badge: 'EN' },
  { code: 'hi', native: 'हिन्दी', english: 'Hindi', sub: 'राजभाषा / Official language', badge: 'हिं' },
];

const regionalLanguages: LanguageOption[] = [
  { code: 'bn', native: 'বাংলা', english: 'Bengali' },
  { code: 'mr', native: 'मराठी', english: 'Marathi' },
  { code: 'te', native: 'తెలుగు', english: 'Telugu' },
  { code: 'ta', native: 'தமிழ்', english: 'Tamil' },
  { code: 'gu', native: 'ગુજરાતી', english: 'Gujarati' },
  { code: 'ur', native: 'اردو', english: 'Urdu' },
  { code: 'kn', native: 'ಕನ್ನಡ', english: 'Kannada' },
  { code: 'or', native: 'ଓଡ଼ିଆ', english: 'Odia' },
  { code: 'ml', native: 'മലയാളം', english: 'Malayalam' },
  { code: 'pa', native: 'ਪੰਜਾਬੀ', english: 'Punjabi' },
  { code: 'as', native: 'অসমীয়া', english: 'Assamese' },
  { code: 'mai', native: 'मैथिली', english: 'Maithili' },
  { code: 'sat', native: 'संताली', english: 'Santali' },
  { code: 'ks', native: 'کٲشُر', english: 'Kashmiri' },
  { code: 'ne', native: 'नेपाली', english: 'Nepali' },
  { code: 'sd', native: 'سنڌي', english: 'Sindhi' },
  { code: 'doi', native: 'डोगरी', english: 'Dogri' },
  { code: 'mni-Mtei', native: 'Manipuri', english: 'Manipuri' },
  { code: 'brx', native: 'बड़ो', english: 'Bodo' },
  { code: 'sa', native: 'संस्कृतम्', english: 'Sanskrit' },
  { code: 'gom', native: 'कोंकणी', english: 'Konkani' },
];

const allLanguages = [...featuredLanguages, ...regionalLanguages];
const languageCodes = allLanguages.map((lang) => lang.code).join(',');
const rightToLeft = new Set(['ur', 'ks', 'sd']);

type LanguageSelectorProps = {
  reloadAfterChange?: boolean;
  initialTranslationLanguage?: string;
};

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement: new (options: Record<string, unknown>, elementId: string) => void;
      };
    };
  }
}

function savedLanguage() {
  if (typeof document === 'undefined') return 'en';
  const code = document.cookie.match(/(?:^|; )googtrans=\/en\/([^;]+)/)?.[1] ?? 'en';
  return allLanguages.some((lang) => lang.code === code) ? code : 'en';
}

function applyDocumentLanguage(code: string) {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = code;
  document.documentElement.dir = rightToLeft.has(code) ? 'rtl' : 'ltr';
  document.dispatchEvent(new Event('epfo-language-change'));
}

function setLanguageCookie(code: string) {
  if (typeof document === 'undefined') return;
  if (code === 'en') {
    document.cookie = 'googtrans=; Max-Age=0; path=/; SameSite=Lax';
  } else {
    document.cookie = `googtrans=/en/${code}; path=/; SameSite=Lax`;
  }
}

function languageLabel(code: string) {
  const language = allLanguages.find((item) => item.code === code);
  return language ? `${language.native} (${language.english})` : code;
}

function translatedMarkupPresent() {
  return document.documentElement.classList.contains('translated-ltr')
    || document.documentElement.classList.contains('translated-rtl')
    || Boolean(document.querySelector('font'));
}

export default function LanguageSelector({ reloadAfterChange = false, initialTranslationLanguage }: LanguageSelectorProps) {
  const initialLanguage = initialTranslationLanguage && allLanguages.some((language) => language.code === initialTranslationLanguage)
    ? initialTranslationLanguage
    : 'en';
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(initialLanguage);
  const [isTranslating, setIsTranslating] = useState(reloadAfterChange && initialLanguage !== 'en');
  const [targetLangName, setTargetLangName] = useState(languageLabel(initialLanguage));
  const containerRef = useRef<HTMLDivElement>(null);
  const pendingLanguageRef = useRef(initialLanguage);

  useEffect(() => {
    const saved = savedLanguage();
    const syncLanguageTimer = window.setTimeout(() => setCurrentLang(saved), 0);
    pendingLanguageRef.current = saved;
    applyDocumentLanguage(saved);

    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement || document.querySelector('#google_translate_element select')) return;

      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: languageCodes,
        autoDisplay: false,
      }, 'google_translate_element');

      if (pendingLanguageRef.current !== 'en') {
        window.setTimeout(() => {
          const engineSelect = document.querySelector<HTMLSelectElement>('#google_translate_element select');
          if (!engineSelect) return;
          engineSelect.value = pendingLanguageRef.current;
          engineSelect.dispatchEvent(new Event('change'));
        }, 0);
      }
    };

    if (window.google?.translate?.TranslateElement) {
      window.googleTranslateElementInit();
    } else if (saved !== 'en' && !document.querySelector('script[data-epfo-translate]')) {
      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.dataset.epfoTranslate = 'true';
      document.body.appendChild(script);
    }

    return () => window.clearTimeout(syncLanguageTimer);
  }, []);

  useEffect(() => {
    if (!isTranslating) return;

    const observer = new MutationObserver(() => {
      if (translatedMarkupPresent()) setIsTranslating(false);
    });
    const timeout = window.setTimeout(() => {
      setIsTranslating(false);
      observer.disconnect();
    }, 3200);

    if (translatedMarkupPresent()) {
      window.setTimeout(() => setIsTranslating(false), 0);
    } else {
      observer.observe(document.documentElement, { attributes: true, childList: true, subtree: true });
    }

    return () => {
      window.clearTimeout(timeout);
      observer.disconnect();
    };
  }, [isTranslating]);

  // Handle outside click & escape key
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('pointerdown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  function changeLanguage(code: string) {
    if (code === currentLang) {
      setIsOpen(false);
      return;
    }

    setCurrentLang(code);
    setIsOpen(false);
    pendingLanguageRef.current = code;
    setLanguageCookie(code);
    applyDocumentLanguage(code);
    setIsTranslating(true);
    setTargetLangName(languageLabel(code));

    if (reloadAfterChange) {
      window.setTimeout(() => window.location.reload(), 160);
      return;
    }

    const triggerEngine = () => {
      const engineSelect = document.querySelector<HTMLSelectElement>('#google_translate_element select');
      if (engineSelect) {
        engineSelect.value = code;
        engineSelect.dispatchEvent(new Event('change'));
      } else {
        window.setTimeout(() => {
          const retrySelect = document.querySelector<HTMLSelectElement>('#google_translate_element select');
          if (retrySelect) {
            retrySelect.value = code;
            retrySelect.dispatchEvent(new Event('change'));
          }
        }, 400);
      }
    };

    if (window.google?.translate?.TranslateElement) {
      window.googleTranslateElementInit?.();
      triggerEngine();
    } else if (!document.querySelector('script[data-epfo-translate]')) {
      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.dataset.epfoTranslate = 'true';
      document.body.appendChild(script);
    }
  }

  const activeLangObj = allLanguages.find((l) => l.code === currentLang) ?? featuredLanguages[0];

  return (
    <div className="language-selector notranslate" translate="no" ref={containerRef}>
      <button
        type="button"
        className={`lang-trigger ${isTranslating ? 'translating' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={`Current language: ${activeLangObj.english}. Open language selection menu.`}
        title="Change website language"
      >
        {isTranslating ? (
          <span className="lang-spinner" aria-hidden="true" />
        ) : (
          <span className="lang-trigger-icon" aria-hidden="true">文A</span>
        )}
        <span className="lang-trigger-text">
          {isTranslating ? 'Translating...' : activeLangObj.native}
        </span>
        <span className={`lang-trigger-chevron ${isOpen ? 'open' : ''}`} aria-hidden="true">⌄</span>
      </button>

      {isOpen && (
        <div className="lang-popover" role="dialog" aria-modal="false" aria-label="Website Language Selection">
          <div className="lang-popover-head">
            <div>
              <p className="lang-popover-title">SELECT LANGUAGE</p>
              <small className="lang-popover-subtitle">Automatic page translation</small>
            </div>
            <button
              type="button"
              className="lang-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close language selector"
            >
              ✕
            </button>
          </div>

          {/* Primary Featured Languages: English & Hindi */}
          <div className="lang-featured-grid">
            {featuredLanguages.map((lang) => {
              const isSelected = currentLang === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  className={`lang-featured-card ${isSelected ? 'active' : ''}`}
                  onClick={() => changeLanguage(lang.code)}
                >
                  <span className="lang-featured-badge" aria-hidden="true">{lang.badge}</span>
                  <div className="lang-featured-copy">
                    <strong>{lang.native} {lang.native !== lang.english ? `(${lang.english})` : ''}</strong>
                    <small>{lang.sub}</small>
                  </div>
                  {isSelected && <span className="lang-check" aria-hidden="true">✓</span>}
                </button>
              );
            })}
          </div>

          {/* Other Regional Constitutional Languages */}
          <div className="lang-regional-section">
            <span className="lang-regional-heading">OTHER CONSTITUTIONAL LANGUAGES</span>
            <div className="lang-compact-grid">
              {regionalLanguages.map((lang) => {
                const isSelected = currentLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    className={`lang-compact-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => changeLanguage(lang.code)}
                  >
                    <span className="lang-compact-native">{lang.native}</span>
                    <span className="lang-compact-english">{lang.english}</span>
                    {isSelected && <span className="lang-compact-check" aria-hidden="true">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lang-popover-footer">
            <small>Powered by automated translation engine for regional accessibility.</small>
          </div>
        </div>
      )}

      {isTranslating && (
        <div className="translation-toast" role="status" aria-live="polite">
          <div className="translation-toast-content">
            <span className="translation-toast-spinner" aria-hidden="true" />
            <div>
              <strong>Translating page...</strong>
              <small>{targetLangName}</small>
            </div>
          </div>
          <div className="translation-toast-bar" aria-hidden="true" />
        </div>
      )}

      <div id="google_translate_element" className="translation-engine" aria-hidden="true" />
    </div>
  );
}
