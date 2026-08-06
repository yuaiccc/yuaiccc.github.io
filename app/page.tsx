'use client';

import Image from 'next/image';
import Link from 'next/link';
import FeishuContact from './FeishuContact';
import LanguageToggle from './LanguageToggle';
import OpenSourceProjects from './OpenSourceProjects';
import ScrollProgress from './ScrollProgress';
import { useResumeLanguage } from './language';
import { PERSON_SCHEMA } from './site';
import ThemeToggle from './ThemeToggle';
import VisitorBadge from './VisitorBadge';

type IconProps = { className?: string };

type TechItem = {
  name: string;
  icon: string;
  invertDark?: boolean;
};

type TechGroup = {
  title: string;
  items: TechItem[];
};

const INLINE_TECH: Record<string, TechItem> = {
  LangGraph: { name: 'LangGraph', icon: 'https://cdn.simpleicons.org/langchain/1C3C3C', invertDark: true },
  Node: { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg' },
  PostgreSQL: { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg' },
  SQLite: { name: 'sqlite-vec', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sqlite/sqlite-original.svg' },
  Go: { name: 'Go', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original-wordmark.svg' },
  Python: { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg' },
  RAGAS: { name: 'RAGAS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg' },
  React: { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg' },
  Vue: { name: 'Vue', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg' },
  Express: { name: 'Express', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg', invertDark: true },
  Render: { name: 'Render', icon: '/tech/render.svg' },
  Supabase: { name: 'Supabase', icon: '/tech/supabase.svg' },
  Cloudflare: { name: 'Cloudflare', icon: '/tech/cloudflare.svg' },
  OKX: { name: 'OKX', icon: '/tech/okx.svg', invertDark: true },
  Spring: { name: 'Spring Boot', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg' },
  Feishu: { name: 'Feishu', icon: '/feishu-icon.png' },
  OceanBase: { name: 'OceanBase', icon: '/oceanbase-icon.png' },
  MySQL: { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg' },
  Redis: { name: 'Redis', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg' },
  RabbitMQ: { name: 'RabbitMQ', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rabbitmq/rabbitmq-original.svg' },
  Vercel: { name: 'Vercel', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg', invertDark: true },
  GitHub: { name: 'GitHub', icon: 'https://cdn.simpleicons.org/github/181717', invertDark: true },
  Linux: { name: 'Linux', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg' },
  Nginx: { name: 'Nginx', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nginx/nginx-original.svg' },
};

const TECH_GROUPS: TechGroup[] = [
  {
    title: 'AI & ML',
    items: [
      { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg' },
      { name: 'PyTorch', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pytorch/pytorch-original.svg' },
      { name: 'Hugging Face', icon: '/tech/huggingface.svg' },
      { name: 'LangChain / LangGraph', icon: 'https://cdn.simpleicons.org/langchain/1C3C3C', invertDark: true },
      { name: 'Claude Code', icon: '/tech/claude.svg' },
      { name: 'OpenAI Codex', icon: '/tech/openai.svg', invertDark: true },
      { name: 'Dify', icon: 'https://cdn.simpleicons.org/dify/000000', invertDark: true },
    ],
  },
  {
    title: 'Frontend',
    items: [
      { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg' },
      { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg' },
      { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg', invertDark: true },
      { name: 'Vue', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg' },
      { name: 'Tailwind CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg' },
    ],
  },
  {
    title: 'Backend & Data',
    items: [
      { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg' },
      { name: 'Spring', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg' },
      { name: 'Go', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original-wordmark.svg' },
      { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg' },
      { name: 'Express', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg', invertDark: true },
      { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg' },
      { name: 'SQLite', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sqlite/sqlite-original.svg' },
      { name: 'Redis', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg' },
      { name: 'RabbitMQ', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rabbitmq/rabbitmq-original.svg' },
    ],
  },
  {
    title: 'DevOps & Tools',
    items: [
      { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg' },
      { name: 'Linux', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg' },
      { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg' },
      { name: 'Vercel', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg', invertDark: true },
    ],
  },
];

const TechBadge = ({ name, icon, invertDark }: TechItem) => (
  <li className="group/list-item">
    <span className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 transition-colors duration-200 hover:border-blue-200 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-800 dark:hover:bg-slate-800/80">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={icon} 
        alt={name} 
        className={`w-5 h-5 ${invertDark ? 'dark:invert' : ''}`}
      />
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{name}</span>
    </span>
  </li>
);

const InlineTech = ({ tech, label }: { tech: keyof typeof INLINE_TECH; label?: string }) => {
  const item = INLINE_TECH[tech];
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap font-semibold text-slate-900 dark:text-slate-200">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.icon}
        alt=""
        className={`inline-block h-3.5 w-3.5 object-contain ${item.invertDark ? 'dark:invert' : ''}`}
        aria-hidden="true"
      />
      <span>{label || item.name}</span>
    </span>
  );
};

const MailIcon = ({ className = 'w-4 h-4' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
    <rect x="3.25" y="5.25" width="17.5" height="13.5" rx="2.5" />
    <path d="M4 7.5L12 13.25L20 7.5" />
  </svg>
);

const GithubIcon = ({ className = 'w-4 h-4' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 2C6.48 2 2 6.6 2 12.26c0 4.53 2.87 8.37 6.84 9.72.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.72-2.78.62-3.37-1.37-3.37-1.37-.46-1.2-1.12-1.52-1.12-1.52-.91-.64.07-.63.07-.63 1.01.08 1.55 1.07 1.55 1.07.9 1.6 2.36 1.13 2.93.86.09-.67.35-1.13.64-1.39-2.22-.26-4.56-1.15-4.56-5.13 0-1.13.39-2.06 1.03-2.78-.11-.26-.45-1.31.1-2.73 0 0 .84-.28 2.75 1.06A9.2 9.2 0 0 1 12 7.25c.83 0 1.67.12 2.45.36 1.9-1.34 2.74-1.06 2.74-1.06.56 1.42.22 2.47.11 2.73.64.72 1.03 1.65 1.03 2.78 0 3.99-2.34 4.86-4.57 5.12.36.32.69.95.69 1.92 0 1.39-.01 2.5-.01 2.84 0 .27.18.6.69.49A10.28 10.28 0 0 0 22 12.26C22 6.6 17.52 2 12 2Z" />
  </svg>
);

const XIcon = ({ className = 'w-4 h-4' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
  </svg>
);

const FLAG_BASE = 'h-3.5 w-auto rounded-[2px] shadow-[0_0_0_0.5px_rgba(0,0,0,0.15)] inline-block align-[-2px]';

const GbFlag = ({ className = FLAG_BASE }: IconProps) => (
  <svg viewBox="0 0 30 20" className={className} aria-label="United Kingdom" role="img">
    <rect width="30" height="20" fill="#012169" />
    <path d="M0,0 L30,20 M30,0 L0,20" stroke="#ffffff" strokeWidth="3" />
    <path d="M0,0 L30,20 M30,0 L0,20" stroke="#C8102E" strokeWidth="1.4" />
    <rect x="13" width="4" height="20" fill="#ffffff" />
    <rect y="8" width="30" height="4" fill="#ffffff" />
    <rect x="14" width="2" height="20" fill="#C8102E" />
    <rect y="9" width="30" height="2" fill="#C8102E" />
  </svg>
);

const JpFlag = ({ className = FLAG_BASE }: IconProps) => (
  <svg viewBox="0 0 30 20" className={className} aria-label="Japan" role="img">
    <rect width="30" height="20" fill="#ffffff" />
    <circle cx="15" cy="10" r="6" fill="#bc002d" />
  </svg>
);

const CnFlag = ({ className = FLAG_BASE }: IconProps) => (
  <svg viewBox="0 0 30 20" className={className} aria-label="China" role="img">
    <rect width="30" height="20" fill="#de2910" />
    <polygon points="5,2 5.9,4.7 8.8,4.7 6.45,6.4 7.35,9.1 5,7.45 2.65,9.1 3.55,6.4 1.2,4.7 4.1,4.7" fill="#ffde00" />
    <polygon points="10.5,2.5 10.75,3.25 11.55,3.25 10.9,3.72 11.15,4.48 10.5,4.02 9.85,4.48 10.1,3.72 9.45,3.25 10.25,3.25" fill="#ffde00" />
    <polygon points="12.4,5 12.65,5.75 13.45,5.75 12.8,6.22 13.05,6.98 12.4,6.52 11.75,6.98 12,6.22 11.35,5.75 12.15,5.75" fill="#ffde00" />
    <polygon points="12.1,8 12.35,8.75 13.15,8.75 12.5,9.22 12.75,9.98 12.1,9.52 11.45,9.98 11.7,9.22 11.05,8.75 11.85,8.75" fill="#ffde00" />
    <polygon points="10,10 10.25,10.75 11.05,10.75 10.4,11.22 10.65,11.98 10,11.52 9.35,11.98 9.6,11.22 8.95,10.75 9.75,10.75" fill="#ffde00" />
  </svg>
);

const EducationSection = ({ zh }: { zh: boolean }) => (
  <section className="animate-fade-in-up delay-400">
    <h2 className="mb-4 border-l-[3px] border-blue-500 pl-3 text-xl font-bold text-slate-800 dark:text-slate-100">{zh ? '教育经历' : 'Education'}</h2>
    <div className="divide-y divide-slate-200 dark:divide-slate-700">
      <div className="px-1 py-5 sm:px-5">
        <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-md bg-slate-900 px-2 py-1 ring-1 ring-slate-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/hdu-logo.svg" alt="Hangzhou Dianzi University logo" className="h-5 w-auto" />
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {zh ? '杭州电子科技大学' : 'Hangzhou Dianzi University'}
              <span className="mt-0.5 block text-sm font-medium text-slate-500 dark:text-slate-400">{zh ? 'Hangzhou Dianzi University（HDU）' : '杭州电子科技大学（HDU）'}</span>
            </h3>
          </div>
          <span className="self-start whitespace-nowrap rounded bg-gray-100 px-2 py-1 font-mono text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">{zh ? '2026.09 -（预计）' : 'Sep 2026 - (expected)'}</span>
        </div>
        <p className="mb-2 text-gray-700 dark:text-gray-300">{zh ? '硕士研究生（拟入学）' : 'Postgraduate (Incoming)'}</p>
      </div>

      <div className="px-1 py-5 sm:px-5">
        <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-md bg-slate-900 px-2 py-1 ring-1 ring-slate-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/ncwu-logo.png" alt="NCWU logo" className="h-5 w-auto" />
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {zh ? '华北水利水电大学' : 'North China University of Water Resources and Electric Power'}
              <span className="mt-0.5 block text-sm font-medium text-slate-500 dark:text-slate-400">{zh ? 'North China University of Water Resources and Electric Power（NCWU）' : '华北水利水电大学（NCWU）'}</span>
            </h3>
          </div>
          <span className="self-start whitespace-nowrap rounded bg-gray-100 px-2 py-1 font-mono text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">{zh ? '2022.09 - 2026.06' : 'Sep 2022 - Jun 2026'}</span>
        </div>
        <p className="mb-2 text-gray-700 dark:text-gray-300">{zh ? '人工智能工学学士' : 'B.Eng. in Artificial Intelligence'} / <span className="font-medium text-blue-500">{zh ? '专业前 30%' : 'Top 30% in major'}</span></p>
        <p className="inline-block rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
          {zh ? '学业优秀奖学金' : 'Academic Excellence Scholarship'}
        </p>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          <span className="font-medium">{zh ? '核心课程：' : 'Core coursework:'}</span> {zh ? '操作系统、数据结构、线性代数、自然语言处理、深度学习、计算机网络、软件工程' : 'Operating Systems, Data Structures, Linear Algebra, Natural Language Processing, Deep Learning, Computer Networks, and Software Engineering'}
        </p>
      </div>
    </div>
  </section>
);

export default function Resume() {
  const language = useResumeLanguage();
  const zh = language === 'zh';

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }}
      />
      <ScrollProgress />
      <div className="min-h-screen bg-slate-50 px-3 py-4 font-sans text-gray-800 transition-colors duration-300 dark:bg-slate-950 dark:text-gray-100 sm:px-6 sm:py-8 lg:px-8">
        <div className="resume-card relative mx-auto max-w-4xl overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200 transition-colors duration-300 dark:bg-gray-900 dark:ring-slate-800">
          {/* === 头部信息 === */}
          <header className="border-b border-slate-100 bg-white p-5 text-slate-900 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 dark:text-white sm:p-6 md:p-8">
            <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
              <div className="flex flex-col items-center gap-5 md:flex-row">
                <div className="relative aspect-[1290/1733] w-20 flex-shrink-0 overflow-hidden rounded-lg shadow-sm ring-1 ring-slate-200 dark:ring-white/10 sm:w-24">
                  <Image
                    src="/profile.jpg"
                    alt="Xu Junshan"
                    fill
                    sizes="(max-width: 768px) 80px, 96px"
                    className="object-cover object-top"
                    priority
                  />
                </div>
                <div className="text-center md:text-left">
                  <h1
                    title="许君山"
                    className="cursor-help text-4xl font-semibold text-slate-950 dark:text-white"
                  >
                    Xu Junshan
                    <span lang="zh-CN" className="sr-only">（许君山）</span>
                  </h1>
                </div>
              </div>
              <div className="w-full rounded-lg border border-blue-200 bg-blue-50/70 p-3.5 text-center shadow-sm ring-1 ring-blue-100/70 sm:w-auto sm:min-w-64 md:text-right dark:border-blue-900/70 dark:bg-blue-950/25 dark:ring-blue-950/50">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Contact</p>
                <div className="flex flex-col gap-2 text-sm text-slate-600 dark:text-gray-300">
                <a
                  href="mailto:yuaiccc@aliyun.com"
                  className="inline-flex items-center justify-center gap-2 transition hover:text-slate-900 md:justify-end dark:hover:text-white"
                >
                  <MailIcon />
                  <span>yuaiccc@aliyun.com</span>
                </a>
                <a
                  href="https://github.com/yuaiccc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 transition hover:text-slate-900 md:justify-end dark:hover:text-white"
                >
                  <GithubIcon />
                  <span>github.com/yuaiccc</span>
                </a>
                <a
                  href="https://x.com/Hakikeioak"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 transition hover:text-slate-900 md:justify-end dark:hover:text-white"
                >
                  <XIcon />
                  <span>x.com/Hakikeioak</span>
                </a>
                <FeishuContact />
                </div>
              </div>
            </div>
          </header>

          <div className="space-y-8 p-5 sm:p-8 md:p-10">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <LanguageToggle />
              <ThemeToggle />
              <VisitorBadge />
              <Link
                href="/blog/"
                className="inline-flex h-9 items-center border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition-colors hover:border-blue-200 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-blue-800 dark:hover:text-blue-400"
              >
                Blog
              </Link>
            </div>

            <section className="animate-fade-in-up delay-100">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 border-l-[3px] border-blue-500 pl-3 mb-4">{zh ? '项目' : 'Projects'}</h2>

              <div className="group mb-4 rounded-lg border border-slate-200 bg-white p-4 transition-[border-color,box-shadow] duration-200 hover:border-slate-300 hover:shadow-sm dark:border-slate-700 dark:bg-gray-900 dark:hover:border-slate-600 sm:p-5">
                <div className="flex flex-col sm:flex-row justify-between sm:items-baseline mb-2 gap-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-500 transition-colors flex items-center gap-2 flex-wrap">
                    <span>{zh ? '飞书叶 — 本地优先的飞书 AI Agent' : 'Feishuye — Local-First Feishu AI Agent'}</span>
                    <a
                      href="https://github.com/yuaiccc/feishu-companion-bot"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-2 py-0.5 rounded-md transition-colors"
                      aria-label={zh ? '在 GitHub 查看飞书叶' : 'View Feishuye on GitHub'}
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>yuaiccc/feishu-companion-bot</span>
                    </a>
                  </h3>
                  <span className="mt-2 self-start whitespace-nowrap rounded bg-gray-100 px-2 py-1 font-mono text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400 sm:mt-0">{zh ? '2026.06 - 至今' : 'Jun 2026 - Present'}</span>
                </div>
                <p className="text-sm text-blue-500 font-medium mb-3 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <InlineTech tech="Feishu" />
                  <span aria-hidden="true">+</span>
                  <InlineTech tech="Go" />
                </p>
                <ul className="list-disc list-outside ml-5 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li>{zh ? <><span className="font-bold text-slate-800 dark:text-slate-100">智能体运行时：</span>基于飞书 WebSocket 长连接和 CardKit 流式 API 构建 <span className="font-semibold text-slate-900 dark:text-slate-200">Go</span> 服务；普通对话走快速路径，复杂请求由上下文 Planner 按需编排记忆、文档、GitHub、搜索和本机工具。</> : <><span className="font-bold text-slate-800 dark:text-slate-100">Agent runtime:</span> Built a <span className="font-semibold text-slate-900 dark:text-slate-200">Go</span> service over Feishu&apos;s persistent WebSocket channel and CardKit streaming API; a fast path handles ordinary chat while a context Planner orchestrates memory, documents, GitHub, search, and local tools for complex requests.</>}</li>
                  <li>{zh ? <><span className="font-bold text-slate-800 dark:text-slate-100">分层记忆与 RAG：</span>将短期会话、本地 JSON 长期事实、聊天与图片归档分层管理；接入 LightRAG 构建独立的文档图谱/向量检索链路，并对上下文进行预算控制与隐私脱敏。</> : <><span className="font-bold text-slate-800 dark:text-slate-100">Layered memory and RAG:</span> Separated short-term session state, local JSON long-term facts, and chat/image archives; integrated LightRAG for an independent document graph and vector-retrieval path with context-budget controls and privacy redaction.</>}</li>
                  <li>{zh ? <><span className="font-bold text-slate-800 dark:text-slate-100">多模态与可见性：</span>集成 Apple Vision 本地 OCR、飞书 OCR 降级和本地视觉模型；基于 SHA-256 内容寻址媒体库实现消息幂等、权限隔离、资产修复与图片记忆召回，并在 macOS 菜单栏展示 Agent 阶段状态。</> : <><span className="font-bold text-slate-800 dark:text-slate-100">Multimodal and observable:</span> Integrated local Apple Vision OCR, Feishu OCR fallback, and local vision models; a SHA-256 content-addressed media vault provides message idempotency, permission isolation, repair tooling, image-memory recall, and macOS menu-bar agent-status visibility.</>}</li>
                  <li>{zh ? <><span className="font-bold text-slate-800 dark:text-slate-100">可靠性：</span>为长驻 Agent 设计时效与成员校验、后台记忆整理、分阶段延迟日志、健康检查与降级路径；LightRAG、CardKit、OCR 或外部 Agent 不可用时回退到本地能力。</> : <><span className="font-bold text-slate-800 dark:text-slate-100">Reliability:</span> Added event-age and membership checks, background memory consolidation, phased latency logs, health checks, and graceful degradation; unavailable LightRAG, CardKit, OCR, or external-agent services fall back to local paths.</>}</li>
                </ul>
              </div>

              <div className="group mb-4 rounded-lg border border-slate-200 bg-white p-4 transition-[border-color,box-shadow] duration-200 hover:border-slate-300 hover:shadow-sm dark:border-slate-700 dark:bg-gray-900 dark:hover:border-slate-600 sm:p-5">
                <div className="flex flex-col sm:flex-row justify-between sm:items-baseline mb-2 gap-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-500 transition-colors flex items-center gap-2 flex-wrap">
                    <span>{zh ? 'KotobaFlow — 日语学习智能体' : 'KotobaFlow — Agentic Japanese Learning System'}</span>
                    <a
                      href="https://japanese-verb-master.onrender.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 px-2.5 py-0.5 rounded-md transition-colors"
                      aria-label={zh ? '打开 KotobaFlow 在线演示' : 'Open KotobaFlow live demo'}
                    >
                      <span aria-hidden="true">↗</span>
                      <span>{zh ? '在线演示' : 'Live Demo'}</span>
                    </a>
                    <a
                      href="https://github.com/yuaiccc/japanese-verb-master"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-2 py-0.5 rounded-md transition-colors"
                      aria-label={zh ? '在 GitHub 查看 KotobaFlow' : 'View KotobaFlow on GitHub'}
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>yuaiccc/japanese-verb-master</span>
                    </a>
                    <a
                      href="https://github.com/yuaiccc/japanese-verb-master/releases/tag/v1.3.0"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 px-2 py-0.5 rounded-md transition-colors"
                      aria-label="View KotobaFlow v1.3.0 release"
                    >
                      <span>v1.3.0</span>
                    </a>
                  </h3>
                  <span className="mt-2 self-start whitespace-nowrap rounded bg-gray-100 px-2 py-1 font-mono text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400 sm:mt-0">{zh ? '2026.05 - 至今' : 'May 2026 - Present'}</span>
                </div>
                <p className="text-sm text-blue-500 font-medium mb-3 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>{zh ? '个人项目' : 'Independent Project'}</span>
                  <span aria-hidden="true">|</span>
                  <InlineTech tech="LangGraph" />
                  <span aria-hidden="true">+</span>
                  <InlineTech tech="Node" />
                  <span aria-hidden="true">+</span>
                  <InlineTech tech="PostgreSQL" />
                  <span aria-hidden="true">+</span>
                  <InlineTech tech="SQLite" />
                </p>
                <ul className="list-disc list-outside ml-5 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li>{zh ? <><span className="font-bold text-slate-800 dark:text-slate-100">混合 RAG：</span>通过 <span className="font-semibold text-slate-900 dark:text-slate-200">RRF</span> 融合向量与 BM25 检索，并加入查询改写和 LLM 重排；达到 <span className="font-bold text-blue-600 dark:text-blue-400">MRR 0.977</span>、<span className="font-bold text-blue-600 dark:text-blue-400">NDCG@10 0.979</span> 与 <span className="font-bold text-blue-600 dark:text-blue-400">recall@1 63/65</span>。</> : <><span className="font-bold text-slate-800 dark:text-slate-100">Hybrid RAG:</span> Combined vector and BM25 retrieval through <span className="font-semibold text-slate-900 dark:text-slate-200">RRF</span>, query rewriting, and LLM reranking; achieved <span className="font-bold text-blue-600 dark:text-blue-400">MRR 0.977</span>, <span className="font-bold text-blue-600 dark:text-blue-400">NDCG@10 0.979</span>, and <span className="font-bold text-blue-600 dark:text-blue-400">recall@1 63/65</span>.</>}</li>
                  <li>{zh ? <><span className="font-bold text-slate-800 dark:text-slate-100">评测体系：</span>构建 recall@k、MRR、NDCG、faithfulness 与 hallucination 回归集；使用距离过滤与 LLM gatekeeper 将离题幻觉率 <span className="font-bold text-blue-600 dark:text-blue-400">从 10.7% 降至 0%</span>。</> : <><span className="font-bold text-slate-800 dark:text-slate-100">Evaluation:</span> Built recall@k / MRR / NDCG / faithfulness / hallucination regression suites; a distance filter plus LLM gatekeeper reduced off-topic hallucination <span className="font-bold text-blue-600 dark:text-blue-400">from 10.7% to 0%</span>.</>}</li>
                  <li>{zh ? <><span className="font-bold text-slate-800 dark:text-slate-100">智能体运行时：</span>实现 <InlineTech tech="LangGraph" /> <span className="font-semibold text-slate-900 dark:text-slate-200">Planner → Researcher → Tutor → Memory Manager</span> StateGraph，支持 SSE 轨迹、运行与任务历史持久化、长期用户记忆，以及工具、Token 和超时沙箱策略。</> : <><span className="font-bold text-slate-800 dark:text-slate-100">Agent runtime:</span> Implemented a <InlineTech tech="LangGraph" /> <span className="font-semibold text-slate-900 dark:text-slate-200">Planner → Researcher → Tutor → Memory Manager</span> StateGraph with SSE traces, persisted run/task history, durable user memory, and sandbox policies for tools, tokens, and timeouts.</>}</li>
                  <li>{zh ? <><span className="font-bold text-slate-800 dark:text-slate-100">生产工程：</span>在 <InlineTech tech="Render" /> 部署同源 <InlineTech tech="Vue" /> + <InlineTech tech="Express" /> 服务，使用 <InlineTech tech="Supabase" label="Supabase PostgreSQL" /> 隔离游客与账号数据，接入 <InlineTech tech="Cloudflare" label="Turnstile" />、限流、浏览器侧 LLM BYOK、服务端验证的 <InlineTech tech="OKX" /> 支付，并通过 <span className="font-semibold text-slate-900 dark:text-slate-200">112 项测试</span>。</> : <><span className="font-bold text-slate-800 dark:text-slate-100">Production engineering:</span> Deployed a same-origin <InlineTech tech="Vue" /> + <InlineTech tech="Express" /> service on <InlineTech tech="Render" /> with <InlineTech tech="Supabase" label="Supabase PostgreSQL" />, isolated guest/account data, <InlineTech tech="Cloudflare" label="Turnstile" /> and rate limits, browser-side LLM BYOK, server-verified <InlineTech tech="OKX" /> payments, and <span className="font-semibold text-slate-900 dark:text-slate-200">112 passing tests</span>.</>}</li>
                </ul>
              </div>

              <div className="group rounded-lg border border-slate-200 bg-white p-4 transition-[border-color,box-shadow] duration-200 hover:border-slate-300 hover:shadow-sm dark:border-slate-700 dark:bg-gray-900 dark:hover:border-slate-600 sm:p-5">
                <div className="flex flex-col sm:flex-row justify-between sm:items-baseline mb-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-500 transition-colors flex items-center gap-2 flex-wrap">
                    <span>{zh ? 'LaboRBench — 中文劳动争议推理评测工具' : 'LaboRBench — Chinese Labor-Dispute Reasoning Evaluation'}</span>
                    <a href="https://github.com/yuaiccc/laborbench-research" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-2 py-0.5 rounded-md transition-colors" aria-label={zh ? '在 GitHub 查看 LaboRBench' : 'View LaboRBench on GitHub'}>
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>yuaiccc/laborbench-research</span>
                    </a>
                  </h3>
                  <span className="mt-2 self-start whitespace-nowrap rounded bg-gray-100 px-2 py-1 font-mono text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400 sm:mt-0">{zh ? '2026.07 - 至今' : 'Jul 2026 - Present'}</span>
                </div>
                <p className="text-sm text-blue-500 font-medium mb-3 flex flex-wrap items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  {zh ? '研究项目' : 'Research Project'} | <InlineTech tech="Python" /> + LLM Evaluation + Reproducible Research
                </p>
                <ul className="list-disc list-outside ml-5 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li>{zh ? <><span className="font-bold text-slate-800 dark:text-slate-100">数据与证据：</span>面向中文劳动争议判决构建来源可追溯的 claim 级标注；发布去标识化标注与 source offsets，原始裁判文书仅保留在本地忽略目录。</> : <><span className="font-bold text-slate-800 dark:text-slate-100">Data and provenance:</span> Built source-grounded, claim-level annotations for Chinese labor-dispute judgments, releasing de-identified labels and source offsets while keeping judgment text in ignored local directories.</>}</li>
                  <li>{zh ? <><span className="font-bold text-slate-800 dark:text-slate-100">评测边界：</span>将前瞻预测与结果泄漏分离，记录每条银标注的来源、分歧、模型调用与冻结数据哈希；明确其衡量的是与已公开裁判结果的对应性，而非裁判正确性。</> : <><span className="font-bold text-slate-800 dark:text-slate-100">Evaluation boundary:</span> Separates prospective prediction from outcome leakage and records every silver-label source, disagreement, model call, and frozen dataset hash; it measures correspondence to published judgments rather than legal correctness.</>}</li>
                  <li>{zh ? <><span className="font-bold text-slate-800 dark:text-slate-100">可复现实验：</span>实现 collection、annotation、adjudication、evaluation、statistics 与 paper-building CLI；运行可恢复，失败请求独立写入 JSONL，支持质量 notebook 与 release validation。</> : <><span className="font-bold text-slate-800 dark:text-slate-100">Reproducible experiments:</span> Implemented collection, annotation, adjudication, evaluation, statistics, and paper-building CLIs; runs are resumable, failed requests are isolated to JSONL, and the repository includes a quality notebook and release validation.</>}</li>
                </ul>
              </div>
            </section>

            <EducationSection zh={zh} />

            <OpenSourceProjects />

            <section className="animate-fade-in-up delay-300">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 border-l-[3px] border-blue-500 pl-3 mb-4">{zh ? '技术栈' : 'Tech Stack'}</h2>
              <div className="space-y-4 rounded-lg border border-gray-200 bg-slate-50 p-5 dark:border-gray-800 dark:bg-slate-900">
                {TECH_GROUPS.map((group) => (
                  <div key={group.title} className="space-y-3">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-[0.14em] font-mono">
                      {zh ? ({ Frontend: '前端', 'Backend & Data': '后端与数据', 'DevOps & Tools': 'DevOps 与工具' }[group.title] ?? group.title) : group.title}
                    </h3>
                    <ul className="flex flex-wrap gap-3" aria-label={group.title}>
                      {group.items.map((item) => (
                        <TechBadge key={item.name} {...item} />
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section className="animate-fade-in-up delay-400">
              <h2 className="mb-4 border-l-[3px] border-blue-500 pl-3 text-xl font-bold text-slate-800 dark:text-slate-100">{zh ? '语言能力' : 'Languages'}</h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-700 dark:text-gray-300">
                <span><CnFlag /> <span className="font-bold text-slate-900 dark:text-slate-100">{zh ? '普通话' : 'Mandarin Chinese'}</span>{zh ? '：母语。' : ': native.'}</span>
                <span><GbFlag /> <span className="font-bold text-slate-900 dark:text-slate-100">{zh ? '英语 CET-6' : 'English CET-6'}</span>{zh ? '：可用于日常协作和技术讨论。' : ': comfortable using English in day-to-day collaboration and technical discussions.'}</span>
                <span><JpFlag /> <span className="font-bold text-slate-900 dark:text-slate-100">日本語 JLPT N3</span>：基礎的な技術資料を読み、日本向けの開発環境に適応できます。</span>
              </div>
            </section>

            <footer className="mt-8 border-t border-gray-200 pt-6 pb-2 text-center text-sm text-gray-400 dark:border-gray-700">
              <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                <span>© 2026 Xu Junshan (许君山)</span>
                <span aria-hidden="true">|</span>
                <span>Last updated: Jul. 2026.</span>
                <span aria-hidden="true">|</span>
                <a
                  href="https://visitor-badge.laobi.icu/badge?page_id=xj3.tech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 transition hover:text-slate-600 dark:hover:text-slate-300"
                  aria-label="Visitor number"
                >
                  <span>Visitor number:</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://visitor-badge.laobi.icu/badge?page_id=xj3.tech" alt="Visit counter" className="h-5 w-auto" />
                </a>
              </p>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}
