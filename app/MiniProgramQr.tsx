'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useResumeLanguage } from './language';

type Props = {
  /** Path under /public, e.g. '/sparse-qr.jpg' */
  src: string;
  /** Alt text for the QR image; also used as the button label. */
  label: string;
  labelEn: string;
  /** Optional subline shown under the QR, e.g. "微信扫码体验". */
  hint?: string;
  hintEn?: string;
};

/**
 * "扫码体验" badge that opens a WeChat mini-program QR in a hover/focus
 * tooltip. Mirrors the interaction pattern of FeishuContact so the two
 * feel consistent.
 */
export default function MiniProgramQr({ src, label, labelEn, hint, hintEn }: Props) {
  const [open, setOpen] = useState(false);
  const zh = useResumeLanguage() !== 'en';

  return (
    <div className="group/qr relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-0.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400"
        aria-expanded={open}
        aria-label={zh ? `扫码体验${label}` : `Scan to try ${labelEn}`}
      >
        {/* WeChat-style glyph */}
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
          <path d="M8.69 2C4.46 2 1 4.83 1 8.34c0 1.97 1.06 3.74 2.73 4.94L3 15.5l2.55-1.36c.82.2 1.46.36 2.27.36.18 0 .36 0 .55-.02-.12-.4-.18-.82-.18-1.25 0-3.17 2.91-5.73 6.55-5.73.18 0 .36 0 .55.02C14.55 4.42 11.91 2 8.69 2Zm-2.55 3.82c.55 0 .91.36.91.9 0 .55-.36.91-.91.91-.55 0-1.09-.36-1.09-.91 0-.54.54-.9 1.09-.9Zm4.91 0c.55 0 .91.36.91.9 0 .55-.36.91-.91.91-.55 0-1.09-.36-1.09-.91 0-.54.54-.9 1.09-.9Z" />
          <path d="M23 13.23c0-2.91-2.91-5.27-6.18-5.27-3.46 0-6.18 2.36-6.18 5.27s2.72 5.27 6.18 5.27c.73 0 1.45-.18 2.18-.36L21 19.5l-.55-1.64C22.09 16.86 23 15.23 23 13.23Zm-8.18-1.09c-.36 0-.73-.36-.73-.73 0-.36.37-.73.73-.73.55 0 .91.37.91.73 0 .37-.36.73-.91.73Zm4 0c-.36 0-.73-.36-.73-.73 0-.36.37-.73.73-.73.55 0 .91.37.91.73 0 .37-.36.73-.91.73Z" />
        </svg>
        <span>{zh ? '扫码体验' : 'Try it'}</span>
      </button>

      <div
        className={`absolute left-1/2 top-full z-50 mt-2 w-60 -translate-x-1/2 rounded-lg border border-slate-200 bg-white p-2 text-slate-900 shadow-xl transition duration-150 dark:border-slate-700 dark:bg-slate-900 dark:text-white md:left-auto md:right-0 md:translate-x-0 group-hover/qr:visible group-hover/qr:translate-y-0 group-hover/qr:opacity-100 group-focus-within/qr:visible group-focus-within/qr:translate-y-0 group-focus-within/qr:opacity-100 ${open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'}`}
        role="tooltip"
      >
        <Image
          src={src}
          alt={zh ? `${label} 小程序码` : `${labelEn} mini-program QR code`}
          width={430}
          height={430}
          className="h-auto w-full rounded-md"
        />
        {(hint || hintEn) && (
          <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
            {zh ? hint : hintEn}
          </p>
        )}
      </div>
    </div>
  );
}
