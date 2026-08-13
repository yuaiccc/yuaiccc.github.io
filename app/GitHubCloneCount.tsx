'use client';

import { useEffect, useState } from 'react';
import snapshotFallback from '@/data/github_traffic.json';

type CloneSnapshot = {
  repository: string;
  window_days: number;
  count: number;
  uniques: number;
  clones: Array<{ timestamp: string; count: number; uniques: number }>;
  fetched_at: string;
};

const RAW_SNAPSHOT_URL =
  'https://raw.githubusercontent.com/yuaiccc/yuaiccc.github.io/main/data/github_traffic.json';

const CloneIcon = () => (
  <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M4.5 1.5a2.5 2.5 0 1 0 1.25 4.665v3.67a2.5 2.5 0 1 0 1.5 0v-1.42h1.5a1.75 1.75 0 0 1 1.75 1.75v.33a2.5 2.5 0 1 0 1.5 0v-.33a3.25 3.25 0 0 0-3.25-3.25h-1.5V6.165A2.5 2.5 0 0 0 4.5 1.5Zm0 1.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm2 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm4.5-1.25a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z" />
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

  const label = zh
    ? `近 ${snapshot.window_days} 天唯一用户 Clone ${snapshot.uniques.toLocaleString('zh-CN')}`
    : `${snapshot.uniques.toLocaleString('en-US')} unique clones / ${snapshot.window_days}d`;
  const fetchedAt = new Date(snapshot.fetched_at);

  return (
    <a
      href={`https://github.com/${repository}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200/70 transition-colors hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300 dark:ring-blue-800/60 dark:hover:bg-blue-900/50"
      title={
        zh
          ? `GitHub 最近 ${snapshot.window_days} 天统计；快照更新于 ${fetchedAt.toLocaleString('zh-CN')}`
          : `GitHub ${snapshot.window_days}-day traffic snapshot; updated ${fetchedAt.toLocaleString('en-US')}`
      }
    >
      <CloneIcon />
      <span>{label}</span>
    </a>
  );
}
