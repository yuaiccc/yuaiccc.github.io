'use client';

import { useState, useEffect } from 'react';
import { useResumeLanguage } from './language';

type VisitorInfo = {
  country?: string;
  city?: string;
  browser?: string;
  os?: string;
  isLoadingLocation: boolean;
  error?: boolean;
};

function parseBrowser(userAgent: string) {
  if (/Edg\//.test(userAgent)) {
    return 'Edge';
  }
  if (/Firefox\//.test(userAgent)) {
    return 'Firefox';
  }
  if (/Chrome\//.test(userAgent) && !/Edg\//.test(userAgent)) {
    return 'Chrome';
  }
  if (/Safari\//.test(userAgent) && !/Chrome\//.test(userAgent)) {
    return 'Safari';
  }
  if (/OPR\//.test(userAgent) || /Opera\//.test(userAgent)) {
    return 'Opera';
  }

  return 'Unknown Browser';
}

function parseOS(userAgent: string) {
  if (/Windows NT/.test(userAgent)) {
    return 'Windows';
  }
  if (/Android/.test(userAgent)) {
    return 'Android';
  }
  if (/iPhone|iPad|iPod/.test(userAgent)) {
    return 'iOS';
  }
  if (/Mac OS X|Macintosh/.test(userAgent)) {
    return 'macOS';
  }
  if (/Linux/.test(userAgent)) {
    return 'Linux';
  }

  return 'Unknown OS';
}

export default function VisitorBadge({ className = '' }: { className?: string }) {
  const zh = useResumeLanguage() === 'zh';
  const [info, setInfo] = useState<VisitorInfo>({
    browser: 'Unknown Browser',
    os: 'Unknown OS',
    isLoadingLocation: true,
  });

  useEffect(() => {
    const controller = new AbortController();

    const loadLocation = () => {
      const userAgent = window.navigator.userAgent;
      setInfo((current) => ({
        ...current,
        browser: parseBrowser(userAgent),
        os: parseOS(userAgent),
      }));

      fetch('https://ipapi.co/json/', { signal: controller.signal })
        .then((res) => res.json())
        .then((data) => {
          setInfo((current) => ({
            ...current,
            country: data.country_name,
            city: data.city,
            isLoadingLocation: false,
          }));
        })
        .catch((error: unknown) => {
          if (error instanceof DOMException && error.name === 'AbortError') {
            return;
          }

          setInfo((current) => ({
            ...current,
            isLoadingLocation: false,
            error: true,
          }));
        });
    };

    let idleId = 0;
    let usesIdleCallback = false;

    if (typeof window.requestIdleCallback === 'function') {
      usesIdleCallback = true;
      idleId = window.requestIdleCallback(loadLocation, { timeout: 1200 });
    } else {
      idleId = window.setTimeout(loadLocation, 300);
    }

    return () => {
      controller.abort();

      if (usesIdleCallback && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleId);
      } else {
        window.clearTimeout(idleId);
      }
    };
  }, []);

  const location = info.isLoadingLocation
    ? (zh ? '定位中...' : 'locating you...')
    : info.error || !info.country
    ? (zh ? '地球' : 'Earth')
    : `${info.country}${info.city ? ` ${info.city}` : ''}`;

  return (
    <div className={`flex min-h-9 w-full items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 sm:w-auto sm:justify-start ${className}`}>
      <span className={info.isLoadingLocation ? 'animate-pulse' : ''}>👋</span>
      <span className="min-w-0">{zh ? '你好，来自' : 'Hello from'} <span className="font-bold text-blue-500 dark:text-blue-400">{location}</span>{zh ? '。' : '.'}</span>
      <span className="shrink-0 text-[11px] text-slate-400 dark:text-slate-500">
        ({info.browser || 'Unknown Browser'} / {info.os || 'Unknown OS'})
      </span>
    </div>
  );
}
