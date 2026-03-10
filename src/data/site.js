/**
 * 站点数据层：导航、项目、联系信息等，便于维护与复用
 */
export const navLinks = [
  { href: "#about", label: "简介" },
  { href: "#projects", label: "项目" },
  { href: "#contact", label: "联系" },
];

export const hero = {
  title: "你好，我是Amico",
  subtitle: "Aicoding开发者 · 瞎折腾 · 乐于分享",
};

export const about = {
  name: "Amico",
  intro:
    "我是 Amico，一名深耕 AI 应用层的开发者。我擅长利用大语言模型（LLM）构建智能化产品，在 RAG（检索增强生成）设计、Prompt Engineering 以及 AI Agent 开发方面有实战经验。我热衷于探索 AI 与 Web3 的交叉领域，致力于将复杂的 AI 能力转化为流畅的用户体验。",
  skills:
    "核心技术栈：React / Next.js / Tailwind CSS。具备 AI 实战技巧，熟悉 LangChain/LlamaIndex 等 RAG 框架及向量数据库应用；具备跨语言开发能力，能熟练阅读 Python 与 Java 后端代码。",
};

export const projects = [
  {
    id: "1",
    title: "小工具合集",
    description: "日常用的截图、配色、时间戳等小工具，全部开源可复用。",
    href: "#",
    theme: "rose",
    icon: "book",
  },
  {
    id: "2",
    title: "个人博客",
    description: "用 Next.js 搭的博客，记录学习笔记与项目复盘，支持暗色模式。",
    href: "#",
    theme: "violet",
    icon: "image",
  },
  {
    id: "3",
    title: "待办小应用",
    description: "轻量待办 + 番茄钟，本地存储，界面清爽，适合专注工作。",
    href: "#",
    theme: "emerald",
    icon: "bolt",
  },
];

export const contact = {
  copy: "有想法或合作意向？欢迎发邮件或到社交账号找我。",
  email: "zhx_2481632.com",
  emailLabel: "发邮件",
  githubHref: "https://github.com/Tom-kkk",
  githubLabel: "GitHub",
};

export const footer = {
  text: "用黏土与色彩搭建的小站 · 欢迎常来",
};
