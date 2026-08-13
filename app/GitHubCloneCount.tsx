'use client';

import { useEffect, useState } from 'react';
import snapshotFallback from '@/data/github_traffic.json';

type CloneSnapshot = {
  repository: string;
  window_days: number;
  count: number;
  uniques: number;
  cumulative_count?: number;
  cumulative_since?: string;
  counted_through?: string;
  clones: Array<{ timestamp: string; count: number; uniques: number }>;
  fetched_at: string;
};

const RAW_SNAPSHOT_URL =
  'https://raw.githubusercontent.com/yuaiccc/yuaiccc.github.io/main/data/github_traffic.json';

const CloneIcon = () => (
  <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M3.5 0A2.5 2.5 0 0 0 1 2.5v9A2.5 2.5 0 0 0 3.5 14h2.75a.75.75 0 0 0 0-1.5H3.5a1 1 0 0 1 0-2h2.75a.75.75 0 0 0 0-1.5H3.5c-.356 0-.694.074-1 .208V2.5a1 1 0 0 1 1-1h8v2.75a.75.75 0 0 0 1.5 0V.75a.75.75 0 0 0-.75-.75H3.5Z" />
    <path d="M8 8.058C8 7.023 8.75 6 9.887 6h5.363a.75.75 0 0 1 .75.75v8.5a.75.75 0 0 1-.75.75h-5A2.25 2.25 0 0 1 8 13.75Zm6.5 3.442v-4H9.887c-.07 0-.156.086-.238.125a.663.663 0 0 0-.149.433v3.57c.235-.083.487-.128.75-.128Zm-5 2.25c0 .414.336.75.75.75h4.25V13h-4.25a.75.75 0 0 0-.75.75Z" />
  </svg>
);

export default function GitHubCloneCount({ repository, zh }: { repository: string; zh: boolean }) {
  const [snapshot, setSnapshot] = useState<CloneSnapshot>(snapshotFallback as CloneSnapshot);

  useEffect(() => {
    const controller = new AbortController();
    const url = `${RAW_SNAPSHOT_URL}?t=${Date.now()}`;

    fetch(url, { cache: 'no-store', signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: CloneSnapshot | null) => {
        if (data?.repository === repository && typeof data.uniques === 'number') {
          setSnapshot(data);
        }
      })
      .catch(() => {
        // Keep the last committed snapshot when the public raw file is unavailable.
      });

    return () => controller.abort();
  }, [repository]);

  const cumulativeCount = snapshot.cumulative_count ?? snapshot.count;
  const label = zh
    ? `累计 Clone ${cumulativeCount.toLocaleString('zh-CN')} 次`
    : `${cumulativeCount.toLocaleString('en-US')} total clone events`;
  const fetchedAt = new Date(snapshot.fetched_at);
  const cumulativeSince = snapshot.cumulative_since ? new Date(snapshot.cumulative_since) : null;

  return (
    <a
      href={`https://github.com/${repository}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200/70 transition-colors hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300 dark:ring-blue-800/60 dark:hover:bg-blue-900/50"
      title={
        zh
          ? `历史累计 Clone 次数；从 ${cumulativeSince?.toLocaleDateString('zh-CN') ?? '当前快照'} 开始记录，最近一次更新于 ${fetchedAt.toLocaleString('zh-CN')}`
          : `Historical clone-event total tracked since ${cumulativeSince?.toLocaleDateString('en-US') ?? 'the current snapshot'}; last updated ${fetchedAt.toLocaleString('en-US')}`
      }
    >
      <CloneIcon />
      <span>{label}</span>
    </a>
  );
}
