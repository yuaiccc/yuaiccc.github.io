'use client';

import { useEffect, useState } from 'react';
import { useResumeLanguage } from './language';

type ProjectId = 'cindy';

type Project = {
  id: ProjectId;
  name: string;
  href: string;
  summary: string;
  summaryZh: string;
  description: string;
  descriptionZh: string;
  ctaLabel?: string;
  ctaLabelZh?: string;
  showTapTapBrand?: boolean;
  downloadHref?: string;
};

const PROJECT_REPOSITORIES: Record<ProjectId, string> = {
  cindy: 'makecindy/cindy',
};

const CACHED_PROJECT_METRICS: Record<ProjectId, { stars: number; mergedPullRequests: number }> = {
  // Updated when this page is published. These values remain visible when a
  // visitor cannot reach GitHub, then the client refreshes them when it can.
  cindy: { stars: 1985, mergedPullRequests: 10 },
};

const repositoryStarsUrl = (repository: string) => `https://github.com/${repository}/stargazers`;

const mergedPullRequestsUrl = (repository: string) =>
  `https://github.com/${repository}/pulls?q=${encodeURIComponent('is:pr author:yuaiccc is:merged')}`;

const useRepositoryStarCounts = () => {
  const [counts, setCounts] = useState<Partial<Record<ProjectId, number>>>(() =>
    Object.fromEntries(
      (Object.keys(PROJECT_REPOSITORIES) as ProjectId[]).map((id) => [id, CACHED_PROJECT_METRICS[id].stars]),
    ),
  );

  useEffect(() => {
    const controller = new AbortController();

    const loadCounts = async () => {
      const entries = await Promise.all(
        (Object.entries(PROJECT_REPOSITORIES) as [ProjectId, string][]).map(async ([id, repository]) => {
          try {
            const response = await fetch(`https://api.github.com/repos/${repository}`, {
              cache: 'no-store',
              headers: { Accept: 'application/vnd.github+json' },
              signal: controller.signal,
            });

            if (!response.ok) return [id, null] as const;
            const result = (await response.json()) as { stargazers_count?: number };
            return [id, typeof result.stargazers_count === 'number' ? result.stargazers_count : null] as const;
          } catch (error) {
            if (!(error instanceof DOMException && error.name === 'AbortError')) {
              console.warn(`Unable to load star count for ${repository}`, error);
            }
            return [id, null] as const;
          }
        }),
      );

      const availableCounts = Object.fromEntries(
        entries.filter((entry): entry is readonly [ProjectId, number] => entry[1] !== null),
      );
      setCounts((current) => ({ ...current, ...availableCounts }));
    };

    void loadCounts();
    return () => controller.abort();
  }, []);

  return counts;
};

const useMergedPullRequestCounts = () => {
  const [counts, setCounts] = useState<Partial<Record<ProjectId, number>>>(() =>
    Object.fromEntries(
      (Object.keys(PROJECT_REPOSITORIES) as ProjectId[]).map((id) => [
        id,
        CACHED_PROJECT_METRICS[id].mergedPullRequests,
      ]),
    ),
  );

  useEffect(() => {
    const controller = new AbortController();

    const loadCounts = async () => {
      const entries = await Promise.all(
        (Object.entries(PROJECT_REPOSITORIES) as [ProjectId, string][]).map(async ([id, repository]) => {
          try {
            const query = `repo:${repository} type:pr author:yuaiccc is:merged`;
            const response = await fetch(
              `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=1`,
              {
                cache: 'no-store',
                headers: { Accept: 'application/vnd.github+json' },
                signal: controller.signal,
              },
            );

            if (!response.ok) return [id, null] as const;
            const result = (await response.json()) as { total_count?: number };
            return [id, typeof result.total_count === 'number' ? result.total_count : null] as const;
          } catch (error) {
            if (!(error instanceof DOMException && error.name === 'AbortError')) {
              console.warn(`Unable to load merged PR count for ${repository}`, error);
            }
            return [id, null] as const;
          }
        }),
      );

      const availableCounts = Object.fromEntries(
        entries.filter((entry): entry is readonly [ProjectId, number] => entry[1] !== null),
      );
      setCounts((current) => ({ ...current, ...availableCounts }));
    };

    void loadCounts();
    return () => controller.abort();
  }, []);

  return counts;
};

const PROJECTS: Project[] = [
  {
    id: 'cindy',
    name: 'yuaiccc/cindy',
    href: 'https://github.com/yuaiccc/cindy',
    summary: 'An open-source AI agent client that brings coding harnesses, models, tools, memory, and automation into one workspace.',
    summaryZh: '将 Coding Harness、模型、工具、记忆与自动化整合到同一工作区的开源 AI Agent 客户端。',
    description:
      'Cindy is an open-source desktop and mobile AI agent client. It supports Claude Code and Codex harnesses, allowing models and harnesses to switch during a task while the workspace, memory, skills, and tools stay continuous. The client is organized as a pnpm monorepo with Electron desktop and Expo mobile apps.',
    descriptionZh:
      'Cindy 是一个开源的桌面与移动端 AI Agent 客户端，支持 Claude Code 和 Codex Harness；任务中可切换模型与 Harness，同时保持工作区、记忆、Skills 和工具连续。客户端采用 pnpm monorepo，包含 Electron 桌面端与 Expo 移动端。',
    showTapTapBrand: true,
    downloadHref: 'https://cindy.app/download/',
  },
];

const RepoIcon = () => (
  <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"
    />
  </svg>
);

const TapTapLogo = () => (
  // The official site favicon keeps the affiliation visual without adding promotional copy.
  // eslint-disable-next-line @next/next/no-img-element
  <img src="https://www.taptap.cn/favicon.ico" alt="" className="h-4 w-4" />
);

const ChevronIcon = ({ expanded }: { expanded: boolean }) => (
  <svg
    className={`w-4 h-4 text-gray-400 transform transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v12m0 0 4-4m-4 4-4-4m-5 7h18" />
  </svg>
);

const MergedIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M5.45 5.154A4.25 4.25 0 0 0 9.25 7.5h1.378a2.251 2.251 0 1 1 0 1.5H9.25A5.734 5.734 0 0 1 5 7.123v3.505a2.25 2.25 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.95-.218ZM4.25 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm8.5-4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM5 3.25a.75.75 0 1 0 0 .005V3.25Z" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.194a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.77-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.528-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.097-.45a.75.75 0 0 1-.564-.41L8 2.694Z" />
  </svg>
);

const RepositoryStars = ({ projectId, count, zh }: { projectId: ProjectId; count?: number; zh: boolean }) => {
  const repository = PROJECT_REPOSITORIES[projectId];
  const countLabel = count === undefined
    ? 'Star'
    : zh ? `${count.toLocaleString('zh-CN')} Star` : `${count.toLocaleString('en-US')} stars`;

  return (
    <a
      href={repositoryStarsUrl(repository)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 rounded-full bg-[#fff8c5] px-2 py-1 font-medium text-[#9a6700] ring-1 ring-[#d4a72c]/20 transition-colors hover:bg-[#fdf1a9] dark:bg-[#4d3b00]/50 dark:text-[#eac54f] dark:ring-[#eac54f]/20 dark:hover:bg-[#5f4a00]/60"
      title={zh ? 'GitHub 实时 Star 数据' : 'Live star data from GitHub'}
    >
      <StarIcon />
      {countLabel}
    </a>
  );
};

const MergedPullRequests = ({ projectId, count, zh }: { projectId: ProjectId; count?: number; zh: boolean }) => {
  const repository = PROJECT_REPOSITORIES[projectId];
  const countLabel = count === undefined
    ? zh ? '合并 PR' : 'Merged PRs'
    : zh ? `${count} 个合并 PR` : `${count} merged PR${count === 1 ? '' : 's'}`;

  return (
    <a
      href={mergedPullRequestsUrl(repository)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 rounded-full bg-[#f5f0ff] px-2 py-1 font-medium text-[#8250df] ring-1 ring-[#8250df]/15 transition-colors hover:bg-[#ede3ff] dark:bg-[#3b1f50]/70 dark:text-[#d2a8ff] dark:ring-[#d2a8ff]/20 dark:hover:bg-[#4b2864]/80"
      title={zh ? 'GitHub 实时合并数据' : 'Live merged data from GitHub'}
    >
      <MergedIcon />
      {countLabel}
    </a>
  );
};

export default function OpenSourceProjects() {
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});
  const zh = useResumeLanguage() === 'zh';
  const repositoryStarCounts = useRepositoryStarCounts();
  const mergedPullRequestCounts = useMergedPullRequestCounts();

  return (
      <div className="mb-4 grid gap-4">
        {PROJECTS.map((project) => {
          const expanded = Boolean(expandedProjects[project.id]);

          return (
            <article
              key={project.id}
              className="group rounded-lg border border-slate-200 bg-slate-50 p-5 transition-[border-color,box-shadow] duration-200 hover:border-slate-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-600"
            >
              <div className="mb-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedProjects((current) => ({
                      ...current,
                      [project.id]: !current[project.id],
                    }))
                  }
                  className="min-w-0 cursor-pointer text-left"
                  aria-expanded={expanded}
                >
                  <div className="flex items-center gap-1">
                    <h3 className="flex items-center gap-2 truncate font-bold text-slate-900 transition-colors group-hover:text-blue-500 dark:text-slate-100">
                      <RepoIcon />
                      {project.showTapTapBrand ? (
                        <span className="flex items-center gap-1.5 truncate">
                          <TapTapLogo />
                          <span className="truncate">TapTap / Cindy</span>
                        </span>
                      ) : (
                        <span className="truncate">{project.name}</span>
                      )}
                    </h3>
                    <ChevronIcon expanded={expanded} />
                  </div>
                </button>
                <div className="flex flex-shrink-0 items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <RepositoryStars
                    projectId={project.id}
                    count={repositoryStarCounts[project.id]}
                    zh={zh}
                  />
                  <MergedPullRequests
                    projectId={project.id}
                    count={mergedPullRequestCounts[project.id]}
                    zh={zh}
                  />
                  {project.downloadHref && (
                    <a
                      href={project.downloadHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-full bg-blue-500 px-2 py-1 font-medium text-white transition-colors hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
                    >
                      <DownloadIcon />
                      {zh ? '下载' : 'Download'}
                    </a>
                  )}
                </div>
              </div>

              <div className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 m-0'}`}>
                <p className="border-t border-slate-200 pt-3 text-sm leading-relaxed text-gray-700 dark:border-slate-700 dark:text-gray-300">
                  {zh ? project.descriptionZh : project.description}
                </p>
                <div className="mt-3 text-right">
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 font-medium px-2 py-1 rounded bg-blue-50 dark:bg-blue-900/30 transition-colors"
                  >
                    {zh ? (project.ctaLabelZh ?? '在 GitHub 查看') : (project.ctaLabel ?? 'View on GitHub')} <ExternalLinkIcon />
                  </a>
                </div>
              </div>

              {!expanded && (
                <p className="h-10 line-clamp-2 text-sm text-gray-600 dark:text-gray-300 transition-all duration-300">
                  {zh ? project.summaryZh : project.summary}
                </p>
              )}
            </article>
          );
        })}
      </div>
  );
}
