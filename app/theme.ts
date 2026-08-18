export const LANGUAGE_STORAGE_KEY = 'resume-language';

export const themeInitScript = `
  try {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedLanguage = window.localStorage.getItem('${LANGUAGE_STORAGE_KEY}');
    const browserLanguages = [navigator.language].concat(navigator.languages || []).map((value) => value.toLowerCase());
    let systemLanguage = 'en';
    for (const locale of browserLanguages) {
      if (locale.indexOf('zh') === 0) {
        systemLanguage = 'zh-CN';
        break;
      }
      if (locale.indexOf('en') === 0) {
        systemLanguage = 'en';
        break;
      }
    }
    // Legacy zh-TW is treated as zh-CN.
    const language = storedLanguage === 'zh' || storedLanguage === 'zh-TW' ? 'zh-CN' : storedLanguage === 'en' ? 'en' : systemLanguage;
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.lang = language;
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  } catch (error) {
    document.documentElement.style.colorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
`;
