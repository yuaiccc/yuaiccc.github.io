'use client';

import { useSyncExternalStore } from 'react';
import { LANGUAGE_STORAGE_KEY } from './theme';

export type ResumeLanguage = 'en' | 'zh';

const LANGUAGE_CHANGE_EVENT = 'resume-language-change';

const getSystemLanguage = (): ResumeLanguage => {
  const candidates = [navigator.language, ...(navigator.languages ?? [])].map((value) => value.toLowerCase());

  for (const locale of candidates) {
    if (locale.startsWith('zh')) return 'zh';
    if (locale.startsWith('en')) return 'en';
  }

  return 'en';
};

const subscribeToLanguage = (onStoreChange: () => void) => {
  window.addEventListener(LANGUAGE_CHANGE_EVENT, onStoreChange);
  window.addEventListener('storage', onStoreChange);

  return () => {
    window.removeEventListener(LANGUAGE_CHANGE_EVENT, onStoreChange);
    window.removeEventListener('storage', onStoreChange);
  };
};

const getLanguageSnapshot = (): ResumeLanguage => {
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored === 'en' || stored === 'zh') return stored;
  // Legacy zh-TW users fall back to Simplified Chinese now that the toggle
  // only offers EN / 简.
  if (stored === 'zh-TW') return 'zh';
  return getSystemLanguage();
};

const getServerLanguageSnapshot = (): ResumeLanguage => 'en';

export const useResumeLanguage = () =>
  useSyncExternalStore(subscribeToLanguage, getLanguageSnapshot, getServerLanguageSnapshot);

export const setResumeLanguage = (language: ResumeLanguage) => {
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN';
  window.dispatchEvent(new Event(LANGUAGE_CHANGE_EVENT));
};
