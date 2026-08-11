'use client';

import { useEffect, useState } from 'react';

const formatRelativeTime = (date: Date, zh: boolean) => {
  const elapsedDays = Math.max(0, Math.floor((Date.now() - date.getTime()) / 86_400_000));

  if (zh) {
    if (elapsedDays === 0) return '今天更新';
    if (elapsedDays === 1) return '昨天更新';
    if (elapsedDays < 30) return `${elapsedDays} 天前更新`;
    if (elapsedDays < 365) return `${Math.floor(elapsedDays / 30)} 个月前更新`;
    return `${Math.floor(elapsedDays / 365)} 年前更新`;
  }

  if (elapsedDays === 0) return 'Updated today';
  if (elapsedDays === 1) return 'Updated yesterday';
  if (elapsedDays < 30) return `Updated ${elapsedDays} days ago`;
  if (elapsedDays < 365) return `Updated ${Math.floor(elapsedDays / 30)} months ago`;
  return `Updated ${Math.floor(elapsedDays / 365)} years ago`;
};

export default function RepositoryActivity({ repository, zh }: { repository: string; zh: boolean }) {
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setUpdatedAt(null);

    fetch(`https://api.github.com/repos/${repository}/commits?per_page=1`, {
      cache: 'no-store',
      headers: { Accept: 'application/vnd.github+json' },
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((commits: Array<{ commit?: { committer?: { date?: string } } }> | null) => {
        const dateString = commits?.[0]?.commit?.committer?.date;
        const date = dateString ? new Date(dateString) : null;
        setUpdatedAt(date && !Number.isNaN(date.getTime()) ? date : null);
      })
      .catch(() => {
        setUpdatedAt(null);
      });

    return () => controller.abort();
  }, [repository]);

  if (!updatedAt) return null;

  return (
    <span
      className="inline-flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500"
      title={zh ? `最后一次提交：${updatedAt.toLocaleString('zh-CN')}` : `Last commit: ${updatedAt.toLocaleString('en-US')}`}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      {formatRelativeTime(updatedAt, zh)}
    </span>
  );
}
