# 许君山个人简历

使用 Next.js 构建的双语个人简历与工程作品集。

支持中英文持久化切换、响应式布局、深色模式，以及悬停展示的飞书二维码联系方式。

## 在线访问

- <https://xj3.tech>

## 精选项目

- 飞书叶（Feishuye）：基于 Go、飞书长连接、LightRAG 与本地多模态能力的可自行部署 AI Agent。
- KotobaFlow：集 LangGraph 工作流、混合 RAG、长期用户记忆与在线部署于一体的日语学习智能体。
- ArkLab：将指标、轨迹、失败归因和回归集串为闭环的 CLI-first RAG 评测工作台。

## 本地开发

```bash
npm install
npm run dev
```

浏览器打开 <http://localhost:3000>。

## 主要文件

- `app/page.tsx`：简历正文与精选项目。
- `app/OpenSourceProjects.tsx`：可展开的开源与社区项目卡片。
- `app/site.ts`：SEO 元数据与结构化个人信息。
- `public/Xu_Junshan_Resume.pdf`：静态 PDF 简历。

## 验证

```bash
npm run lint
npm run build
```
