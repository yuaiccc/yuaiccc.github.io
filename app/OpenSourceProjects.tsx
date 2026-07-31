'use client';

import { useState } from 'react';
import { useResumeLanguage } from './language';

type Project = {
  id: string;
  name: string;
  href: string;
  summary: string;
  summaryZh: string;
  description: string;
  descriptionZh: string;
  languageLabel: string;
  languageColor: string;
  metaLabel: string;
  metaLabelZh?: string;
  ctaLabel?: string;
  ctaLabelZh?: string;
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
    languageLabel: 'TypeScript',
    languageColor: '#3178c6',
    metaLabel: 'AI Agent Client',
    metaLabelZh: 'AI Agent 客户端',
  },
  {
    id: 'sillytavern',
    name: 'SillyTavern/SillyTavern',
    href: 'https://github.com/SillyTavern/SillyTavern',
    summary: 'LLM Frontend for Power Users.',
    summaryZh: '面向高级用户的 LLM 前端。',
    description:
      'SillyTavern is a feature-rich local LLM frontend for advanced users, with multi-model API support, character cards, and an extensible plugin ecosystem. I have contributed 21 merged pull requests focused on product polish and core experience improvements.',
    descriptionZh:
      'SillyTavern 是面向高级用户的本地 LLM 前端，支持多模型 API、角色卡和可扩展插件生态。我已贡献 21 个合并 PR，主要聚焦产品细节和核心体验改进。',
    languageLabel: 'JavaScript',
    languageColor: '#f1e05a',
    metaLabel: '21 Merged PRs',
    metaLabelZh: '21 个合并 PR',
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

const MergedIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M5 3.254V3.25v.005a.75.75 0 110-.005v.004c0-.016.001-.031.004-.046A1.25 1.25 0 016.25 2h.661a.75.75 0 000-1.5H6.25A2.75 2.75 0 003.5 3.25v.005a.75.75 0 100-.005v.004c.003.015.004.03.004.046A1.25 1.25 0 012.25 4.5h-.5a.75.75 0 000 1.5h.5c.34 0 .651-.137.876-.36l.24.239A2.75 2.75 0 004.75 8v1.5H3.5a.75.75 0 000 1.5h1.25a2.75 2.75 0 002.75-2.75v-1.5a1.25 1.25 0 011.25-1.25h.5a.75.75 0 000-1.5h-.5A2.75 2.75 0 006 6.75V8.25a.75.75 0 110 .005V8.25a.75.75 0 010-.005V8.25a.75.75 0 000-1.5v-3.5zM12.5 3.25v.005a.75.75 0 110-.005v.004c0-.016.001-.031.004-.046A1.25 1.25 0 0113.75 2h.5a.75.75 0 000-1.5h-.5A2.75 2.75 0 0011 3.25v.005a.75.75 0 100-.005v.004c.003.015.004.03.004.046A1.25 1.25 0 019.75 4.5h-.5a.75.75 0 000 1.5h.5c.34 0 .651-.137.876-.36l.24.239A2.75 2.75 0 0012.25 8v1.5h-1.25a.75.75 0 000 1.5h1.25a2.75 2.75 0 002.75-2.75v-1.5a1.25 1.25 0 011.25-1.25h.5a.75.75 0 000-1.5h-.5a2.75 2.75 0 00-2.75 2.75v1.5a.75.75 0 110 .005V8.25a.75.75 0 010-.005V8.25a.75.75 0 000-1.5v-3.5z"
    />
  </svg>
);

export default function OpenSourceProjects() {
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});
  const zh = useResumeLanguage() === 'zh';

  return (
    <section className="animate-fade-in-up delay-100">
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 border-l-[3px] border-blue-500 pl-3 mb-4">{zh ? '开源与社区' : 'Open Source & Community'}</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {PROJECTS.map((project) => {
          const expanded = Boolean(expandedProjects[project.id]);

          return (
            <article
              key={project.id}
              className="group rounded-lg border border-slate-200 bg-slate-50 p-5 transition-[border-color,box-shadow] duration-200 hover:border-slate-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-600"
            >
              <button
                type="button"
                onClick={() =>
                  setExpandedProjects((current) => ({
                    ...current,
                    [project.id]: !current[project.id],
                  }))
                }
                className="w-full text-left cursor-pointer"
                aria-expanded={expanded}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-500 transition-colors flex items-center gap-2 truncate">
                    <RepoIcon />
                    <span className="truncate">{project.name}</span>
                  </h3>
                  <ChevronIcon expanded={expanded} />
                </div>
              </button>

              <div className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-[500px] opacity-100 mb-4' : 'max-h-0 opacity-0 m-0'}`}>
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
                <p className="mb-4 h-10 line-clamp-2 text-sm text-gray-600 dark:text-gray-300 transition-all duration-300">
                  {zh ? project.summaryZh : project.summary}
                </p>
              )}

              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: project.languageColor }} />
                  {project.languageLabel}
                </span>
                <span className="flex items-center gap-1">
                  {project.id === 'sillytavern' ? <MergedIcon /> : '⭐'}
                  {zh ? (project.metaLabelZh ?? project.metaLabel) : project.metaLabel}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
