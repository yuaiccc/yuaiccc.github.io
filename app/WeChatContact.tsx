'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useResumeLanguage } from './language';

const WeChatIcon = () => (
  // Use the official WeChat mark as a local asset so the contact card does
  // not depend on a remote icon font or a hand-drawn approximation.
  // eslint-disable-next-line @next/next/no-img-element
  <img src="/tech/wechat.svg" alt="" className="h-4 w-4" aria-hidden="true" />
);

export default function WeChatContact() {
  const [open, setOpen] = useState(false);
  const zh = useResumeLanguage() !== 'en';

  return (
    <div className="group/contact relative inline-flex justify-start">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="inline-flex items-center justify-start gap-2 transition hover:text-slate-900 dark:hover:text-white"
        aria-expanded={open}
        aria-label={zh ? '显示微信好友二维码' : 'Show WeChat friend QR code'}
      >
        <WeChatIcon />
        <span>{zh ? '微信' : 'WeChat'}</span>
      </button>

      <div
        className={`absolute left-0 top-full z-50 mt-2 w-64 rounded-lg border border-slate-200 bg-white p-2 text-slate-900 shadow-xl transition duration-150 dark:border-slate-700 dark:bg-slate-900 dark:text-white group-hover/contact:visible group-hover/contact:translate-y-0 group-hover/contact:opacity-100 group-focus-within/contact:visible group-focus-within/contact:translate-y-0 group-focus-within/contact:opacity-100 ${open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'}`}
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
