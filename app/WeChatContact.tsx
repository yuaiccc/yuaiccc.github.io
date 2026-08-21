'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useResumeLanguage } from './language';

const WeChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-[#07c160]" aria-hidden="true">
    <path d="M12.3 4C7.7 4 4 6.9 4 10.5c0 2 1.1 3.8 3 5l-.7 2.5 2.6-1.4c.7.2 1.5.3 2.3.3 4.6 0 8.3-2.9 8.3-6.5S16.9 4 12.3 4Zm-3 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm5.8 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
    <path d="M15.4 12.2c-3.7 0-6.7 2.2-6.7 5 0 1.3.7 2.5 1.8 3.4l-.4 1.5 1.8-.9c.5.1 1 .2 1.5.2 3.7 0 6.7-2.2 6.7-5s-3-4.2-4.7-4.2Zm-2.2 4.2a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6Zm4 0a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6Z" />
  </svg>
);

export default function WeChatContact() {
  const [open, setOpen] = useState(false);
  const zh = useResumeLanguage() !== 'en';

  return (
    <div className="group/contact relative inline-flex justify-center md:justify-end">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="inline-flex items-center justify-center gap-2 transition hover:text-slate-900 md:justify-end dark:hover:text-white"
        aria-expanded={open}
        aria-label={zh ? '显示微信好友二维码' : 'Show WeChat friend QR code'}
      >
        <WeChatIcon />
        <span>{zh ? '微信' : 'WeChat'}</span>
      </button>

      <div
        className={`absolute left-1/2 top-full z-50 mt-2 w-64 -translate-x-1/2 rounded-lg border border-slate-200 bg-white p-2 text-slate-900 shadow-xl transition duration-150 dark:border-slate-700 dark:bg-slate-900 dark:text-white md:left-auto md:right-0 md:translate-x-0 group-hover/contact:visible group-hover/contact:translate-y-0 group-hover/contact:opacity-100 group-focus-within/contact:visible group-focus-within/contact:translate-y-0 group-focus-within/contact:opacity-100 ${open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'}`}
        role="tooltip"
      >
        <Image
          src="/wechat-qr.png"
          alt={zh ? '许君山的微信好友二维码' : 'Xu Junshan WeChat friend QR code'}
          width={1096}
          height={1114}
          className="h-auto w-full rounded-md"
        />
      </div>
    </div>
  );
}
