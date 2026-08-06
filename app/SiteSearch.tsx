'use client';

import { usePathname } from 'next/navigation';
import ResumeSearch from './ResumeSearch';

export default function SiteSearch() {
  const pathname = usePathname();

  return pathname === '/' ? <ResumeSearch /> : null;
}
