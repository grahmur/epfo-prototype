'use client';

import { useEffect, useRef } from 'react';

const languages = [
  ['en', 'English'],
  ['hi', 'Hindi (हिन्दी)'],
  ['bn', 'Bengali (বাংলা)'],
  ['mr', 'Marathi (मराठी)'],
  ['te', 'Telugu (తెలుగు)'],
  ['ta', 'Tamil (தமிழ்)'],
  ['gu', 'Gujarati (ગુજરાતી)'],
  ['ur', 'Urdu (اردو)'],
  ['kn', 'Kannada (ಕನ್ನಡ)'],
  ['or', 'Odia (ଓଡ଼ିଆ)'],
  ['ml', 'Malayalam (മലയാളം)'],
  ['pa', 'Punjabi (ਪੰਜਾਬੀ)'],
  ['as', 'Assamese (অসমীয়া)'],
  ['mai', 'Maithili (मैथिली)'],
  ['sat', 'Santali (संताली)'],
  ['ks', 'Kashmiri (کٲشُر)'],
  ['ne', 'Nepali (नेपाली)'],
  ['sd', 'Sindhi (سنڌي)'],
  ['doi', 'Dogri (डोगरी)'],
  ['mni-Mtei', 'Manipuri (মণিপুরী)'],
  ['brx', 'Bodo (बड़ो)'],
  ['sa', 'Sanskrit (संस्कृत)'],
  ['gom', 'Goan Konkani (गोवा कोंकणी)'],
] as const;

const languageCodes = languages.map(([code]) => code).join(',');
const rightToLeft = new Set(['ur', 'ks', 'sd']);

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
  const code = document.cookie.match(/(?:^|; )googtrans=\/en\/([^;]+)/)?.[1] ?? 'en';
  return languages.some(([candidate]) => candidate === code) ? code : 'en';
}

function applyDocumentLanguage(code: string) {
  document.documentElement.lang = code;
  document.documentElement.dir = rightToLeft.has(code) ? 'rtl' : 'ltr';
}

export default function LanguageSelector() {
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    const currentLanguage = savedLanguage();
    if (selectRef.current) selectRef.current.value = currentLanguage;
    applyDocumentLanguage(currentLanguage);
    if (currentLanguage === 'en') return;

    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement || document.querySelector('#google_translate_element select')) return;

      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: languageCodes,
        autoDisplay: false,
      }, 'google_translate_element');

      window.setTimeout(() => {
        const engineSelect = document.querySelector<HTMLSelectElement>('#google_translate_element select');
        if (!engineSelect) return;
        engineSelect.value = currentLanguage;
        engineSelect.dispatchEvent(new Event('change'));
      }, 0);
    };

    if (window.google?.translate?.TranslateElement) {
      window.googleTranslateElementInit();
      return;
    }

    if (!document.querySelector('script[data-epfo-translate]')) {
      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.dataset.epfoTranslate = 'true';
      document.body.appendChild(script);
    }
  }, []);

  function changeLanguage(code: string) {
    if (code === 'en') {
      document.cookie = 'googtrans=; Max-Age=0; path=/; SameSite=Lax';
      window.location.reload();
      return;
    }

    document.cookie = `googtrans=/en/${code}; path=/; SameSite=Lax`;
    if (selectRef.current) selectRef.current.value = code;
    applyDocumentLanguage(code);

    const engineSelect = document.querySelector<HTMLSelectElement>('#google_translate_element select');
    if (!engineSelect) {
      window.location.reload();
      return;
    }

    engineSelect.value = code;
    engineSelect.dispatchEvent(new Event('change'));
  }

  return (
    <div className="language-selector notranslate" translate="no">
      <span aria-hidden="true">文</span>
      <label className="sr-only" htmlFor="website-language">Website language (automatic translation)</label>
      <select
        id="website-language"
        aria-label="Website language — automatic translation"
        title="Automatic page translation"
        ref={selectRef}
        defaultValue="en"
        onChange={(event) => changeLanguage(event.target.value)}
      >
        {languages.map(([code, label]) => <option key={code} value={code}>{label}</option>)}
      </select>
      <div id="google_translate_element" className="translation-engine" aria-hidden="true" />
    </div>
  );
}
