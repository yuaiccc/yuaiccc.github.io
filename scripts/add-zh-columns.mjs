#!/usr/bin/env node
/**
 * One-off: read data/resume_knowledge.csv (7-col en), append 4 zh columns
 * (title_zh, period_zh, tech_zh, content_zh), write back an 11-col CSV.
 *
 * The zh strings below are hand-authored. Sources:
 *   • proj-* rows and edu-* / lang-* rows: pulled from app/page.tsx zh branches
 *   • oss-sillytavern: pulled from app/OpenSourceProjects.tsx descriptionZh
 *   • the rest: hand-translated from the existing English content
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CSV_PATH = resolve(__dirname, '..', 'data', 'resume_knowledge.csv');

// ------- zh translations, keyed by id -------
const ZH = {
  'proj-japanese-verb': {
    title:   'KotobaFlow — LangGraph 智能体 + 本地 RAG',
    period:  '2026.05 - 至今',
    tech:    'LangGraph + Node.js + PostgreSQL + sqlite-vec',
    content: '基于 LangGraph 的独立日语学习智能体，具备混合检索能力。通过 RRF 融合向量与 BM25 检索，并加入查询改写和 LLM 重排，达到 MRR 0.977、NDCG@10 0.979 与 recall@1 63/65。构建 recall@k / MRR / NDCG / faithfulness / hallucination 回归评测集；用距离过滤加 LLM gatekeeper 将离题幻觉率从 10.7% 降至 0%。实现 LangGraph Planner → Researcher → Tutor → Memory Manager StateGraph，支持 SSE 轨迹、运行与任务历史持久化、长期用户记忆，以及工具、Token 和超时沙箱策略。在 Render 部署同源 Vue + Express 服务，使用 Supabase PostgreSQL 隔离游客与账号数据，接入 Cloudflare Turnstile 与限流、浏览器侧 LLM BYOK、服务端验证的 OKX 支付，后端通过 112 项测试。',
  },
  'proj-feishu-companion': {
    title:   '飞书叶 — 以记忆为核心的 LLM 智能助手',
    period:  '2026.06 - 至今',
    tech:    'Go + React + OceanBase / MySQL + 飞书开放平台',
    content: '基于 Go 的飞书伴随型智能体框架，具备 LLM 回复、长短期记忆、人物档案、安全过滤、图片记忆抽取和本地工具适配等能力。双存储记忆层：非结构化记忆 + 开放式谓词知识关系（GraphRAG），支持多轮指代消解、关系冲突处理与多模态图片记忆抽取；由 OceanBase / MySQL 兼容存储承载。将 React + Vite SPA 内嵌进单一 Go 二进制，作为运维控制台管理功能开关、上手引导、数据库健康、连接池状态与心情/好感度趋势监控。',
  },
  'proj-scene-text': {
    title:   '多语种场景文字识别系统',
    period:  '2025.12 - 至今',
    tech:    'Python + PyTorch + Linux',
    content: '独立负责的多语种场景文字识别端到端项目。清洗并整理 113 万行语料库，修复开源工具的渲染 bug，生成 10 万余条高质量合成训练样本。将大规模小图转换为 LMDB 数据集，将 batch size 提升至 768，把验证时间从数小时压缩到数分钟。验证准确率达到 98.3%，解决了繁体中文与日文字符重叠的识别难题。',
  },
  'oss-japanese-verb': {
    title:   'yuaiccc/japanese-verb-master',
    period:  '',
    tech:    'TypeScript',
    content: '生产环境部署的日语学习 Agentic RAG 系统，v1.3.0 已上线 Render。LangGraph 工作流（Planner → Researcher → Tutor → Memory Manager）通过 RRF 融合与 LLM 重排组合向量与 BM25 检索（MRR 0.977、recall@1 63/65）。双重弃答闸门将离题幻觉率降至 0%。使用 Supabase PostgreSQL 隔离游客与账号数据、Cloudflare Turnstile 与限流、浏览器侧 LLM BYOK，以及服务端验证的 OKX 支付。后端由 112 项测试覆盖。',
  },
  'oss-feishu-companion': {
    title:   'yuaiccc/feishu-companion-bot',
    period:  '',
    tech:    'Go',
    content: '基于 Go 的飞书伴随型智能体框架，具备 LLM 回复、记忆、安全过滤、图片记忆抽取和由 OceanBase / MySQL 兼容存储承载的 GraphRAG 关系层。将 Vite + React 控制台内嵌进 Go 二进制，用于上手引导、模块开关、数据库健康检查和心情/好感度趋势监控。',
  },
  'oss-sillytavern': {
    title:   'SillyTavern/SillyTavern',
    period:  '',
    tech:    'JavaScript',
    content: 'SillyTavern 是面向高级用户的本地 LLM 前端，支持多模型 API、角色卡与可扩展插件生态。我已贡献 21 个合并 PR，主要聚焦产品细节和核心体验改进。',
  },
  'exp-hualan': {
    title:   'Java 后端实习生 — 河南华兰信息科技集团',
    period:  '2024.09 - 2025.02',
    tech:    'Java + Spring + MySQL + Linux + Postman + Swagger',
    content: '参与企业系统的 RESTful API 开发与接入。使用 Postman 完成接口自动化测试与参数校验，并维护 Swagger API 文档。通过 Linux 服务器日志排查后端故障，编写 SQL 校验数据一致性并清理脏数据。',
  },
  'exp-huashui': {
    title:   '华水青工部干事 — 团委青年工作办公室',
    period:  '2023.09 - 2024.06',
    tech:    'Python + Excel',
    content: '汇总 22 所学校的班级考勤数据。使用 Python 自动化清洗、Excel 完成分析，产出核心数据看板。',
  },
  'edu-hdu': {
    title:   '杭州电子科技大学（HDU）— 拟入学硕士研究生',
    period:  '2026.09 -（预计）',
    tech:    '',
    content: '杭州电子科技大学（HDU）拟入学硕士研究生，2026 秋季入学。',
  },
  'edu-ncwu': {
    title:   '华北水利水电大学（NCWU）— 人工智能工学学士',
    period:  '2022.09 - 2026.06',
    tech:    '',
    content: '人工智能工学学士，GPA 3.16，获学业优秀奖学金。核心课程涵盖操作系统、数据结构、线性代数、自然语言处理、深度学习、计算机网络与软件工程。',
  },
  'cap-llm-agents': {
    title:   'LLM 与智能体系统',
    period:  '',
    tech:    'LangGraph + RAG',
    content: '使用 LangGraph 编排与本地 RAG（混合检索、重排、RAGAS 风格评测）构建 Agentic 应用。研读过 OpenClaw、DeerFlow、Claude Code、Hermes 源码，理解多智能体编排、任务调度与上下文管理的工程取舍。',
  },
  'cap-java-backend': {
    title:   'Java 后端基础',
    period:  '',
    tech:    'Spring + MyBatis + JUC + JVM',
    content: '以 Spring Boot 与 MyBatis 构建生产级 API，遵循 MVC 与 RESTful 约定。运用 HashMap 内部实现、JUC 并发工具类与 JVM 知识排查并发和性能问题。',
  },
  'cap-data-middleware': {
    title:   '数据与中间件',
    period:  '',
    tech:    'MySQL + Redis + RabbitMQ',
    content: '通过索引优化和事务设计调优 MySQL 查询；使用 Redis 缓存热点路径数据；接入 RabbitMQ 完成异步任务解耦。',
  },
  'cap-devops': {
    title:   'DevOps 与交付',
    period:  '',
    tech:    'Git + Linux + Docker + Nginx + Vercel + GitHub Actions',
    content: '通过 Vercel CI/CD 和 GitHub Actions 交付项目；管理 Linux 服务器、配置 Nginx 做反向代理与静态托管；使用 Claude Code、Codex 等 AI 原生工具加速交付。',
  },
  'lang-en': {
    title:   '英语 — CET-6',
    period:  '',
    tech:    '',
    content: '英语六级。可用于日常协作和技术讨论。',
  },
  'lang-ja': {
    title:   '日语 — JLPT N3',
    period:  '',
    tech:    '',
    content: '日语 JLPT N3。能够阅读基础技术资料并适应对日开发语境。',
  },
};

// ------- CSV I/O -------
function parseCsv(text) {
  const rows = [];
  let field = '';
  let row = [];
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else { inQuotes = false; }
      } else { field += c; }
    } else {
      if (c === '"') { inQuotes = true; }
      else if (c === ',') { row.push(field); field = ''; }
      else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
      else if (c === '\r') { /* skip */ }
      else { field += c; }
    }
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  // drop trailing empty row(s)
  while (rows.length && rows[rows.length - 1].length === 1 && rows[rows.length - 1][0] === '') rows.pop();
  return rows;
}

function csvField(v) {
  if (v == null) return '';
  const s = String(v);
  if (/[",\r\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

// ------- transform -------
const raw = readFileSync(CSV_PATH, 'utf8');
const rows = parseCsv(raw);
const header = rows[0];
if (header.length !== 7) {
  throw new Error(`unexpected column count ${header.length}, expected 7 (already extended?)`);
}
const newHeader = [...header, 'title_zh', 'period_zh', 'tech_zh', 'content_zh'];
const idIdx = header.indexOf('id');

const outRows = [newHeader];
for (let i = 1; i < rows.length; i++) {
  const row = rows[i];
  const id = row[idIdx];
  const zh = ZH[id];
  if (!zh) throw new Error(`no zh translation for id "${id}"`);
  outRows.push([...row, zh.title, zh.period, zh.tech, zh.content]);
}

const out = outRows.map((r) => r.map(csvField).join(',')).join('\n') + '\n';
writeFileSync(CSV_PATH, out, 'utf8');

console.log(`extended ${outRows.length - 1} rows → ${outRows[0].length} columns`);
console.log(`wrote ${CSV_PATH}`);
