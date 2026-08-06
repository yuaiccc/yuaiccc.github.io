'use client';

import { useEffect } from 'react';

const GISCUS_CONFIG = {
  repo: 'yuaiccc/yuaiccc.github.io',
  repoId: 'R_kgDORgwUTA',
  category: 'General',
  categoryId: 'DIC_kwDORgwUTM4DCxSD',
};

export default function GiscusComments() {
  useEffect(() => {
    if (!GISCUS_CONFIG.repoId || !GISCUS_CONFIG.categoryId) {
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-repo', GISCUS_CONFIG.repo);
    script.setAttribute('data-repo-id', GISCUS_CONFIG.repoId);
    script.setAttribute('data-category', GISCUS_CONFIG.category);
    script.setAttribute('data-category-id', GISCUS_CONFIG.categoryId);
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', 'preferred_color_scheme');
    script.setAttribute('data-lang', 'zh-CN');
    script.setAttribute('data-loading', 'lazy');

    const container = document.getElementById('giscus-comments');
    container?.appendChild(script);

    return () => script.remove();
  }, []);

  if (!GISCUS_CONFIG.repoId || !GISCUS_CONFIG.categoryId) {
    return null;
  }

  return <section id="giscus-comments" className="mt-12 border-t border-slate-200 pt-8 dark:border-slate-700" aria-label="Comments" />;
}
