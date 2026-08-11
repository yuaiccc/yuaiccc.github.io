export const LANGUAGE_STORAGE_KEY = 'resume-language';

export const themeInitScript = `
  try {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const language = window.localStorage.getItem('${LANGUAGE_STORAGE_KEY}') === 'zh' ? 'zh-CN' : 'en';
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.lang = language;
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  } catch (error) {
    document.documentElement.style.colorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
`;
