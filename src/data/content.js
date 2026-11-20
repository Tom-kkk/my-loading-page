export const themes = {
  about: { cloth: "#1a274f", seal: "#ff5d6c" },
  projects: { cloth: "#6d2a55", seal: "#ffd56a" },
  craft: { cloth: "#0f6e62", seal: "#7ee0c6" },
  contact: { cloth: "#a15b22", seal: "#ffe08a" },
};

const shared = {
  name: "Amico",
  email: "321455764@qq.com",
  github: "https://github.com/Tom-kkk",
};

export const locales = {
  en: {
    site: {
      ...shared,
      tagline: "An AI developer who likes to tinker and share.",
      hint: "Move the cursor onto a book or an ornament, and it leans out. Click a book to open the page.",
      badge: "Open to collaborate",
      place: "Shantou, Guangdong",
    },
    ui: {
      pageTitle: "Amico",
      loading: "Placing the books on the night shelf",
      closeLabel: "Close this page",
      stackHeading: "Core stack",
      contactLead: "Have an idea, or want to work together? Email me, or find me on GitHub and WeChat. I am in Shantou, Guangdong.",
      wechatAlt: "WeChat QR code. Scan it to add Amico.",
      wechatCaption: "Scan to add me on WeChat",
      switchText: "中文",
      switchLabel: "Switch to Chinese",
    },
    about: {
      lead: "I am Amico, a developer focused on applied AI. I use large language models to build products, and I have shipped work in retrieval-augmented generation, prompt design, and AI agents. I like the overlap of AI and Web3, and I care about turning complicated capability into a smooth experience.",
      stack: "React, Next.js, and Tailwind CSS. I use LangChain, LlamaIndex, and vector databases in practice, and I can read Python and Java backend code.",
      tags: ["AI development", "RAG", "LLM", "React", "Prompt"],
    },
    projects: [
      {
        title: "Vue3 AI UI",
        tech: "Vue 3.4+ · AI component library",
        body: "An enterprise component library in the spirit of Ant Design X. It includes eight AI components, such as conversation, reasoning, and typing animation, plus high-performance pieces like a virtual list.",
        href: "https://vaiui.zhxnodehub.top/",
        cta: "Open the site",
      },
      {
        title: "Personal site",
        tech: "React · Vite · Vercel",
        body: "A personal loading and showcase page built with React and Vite. The interface uses a clay style, and it is deployed on Vercel.",
        href: "https://github.com/Tom-kkk/my-loading-page",
        cta: "View on GitHub",
      },
      {
        title: "QRCode Gen",
        tech: "Next.js · Supabase",
        body: "A platform for creating and managing dynamic QR codes. You can sign in, change the target link later, follow each scan, and read the statistics.",
        href: "https://github.com/Tom-kkk/qrcode-gen",
        cta: "View on GitHub",
      },
    ],
    skills: [
      { title: "Frontend engineering", body: "React, Next.js, and Tailwind CSS." },
      { title: "AI and RAG", body: "I use LangChain, LlamaIndex, and vector databases in real products." },
      { title: "Intelligent products", body: "I ship products with large language models, including prompt design and AI agents." },
      { title: "Working across languages", body: "I am a frontend developer, and I can read Python and Java backend code well enough to finish a feature with the backend team." },
    ],
    books: [
      { id: "about", title: "About", kicker: "Who I am", eyebrow: "Chapter 1 · About", heading: "Hello, I am Amico" },
      { id: "projects", title: "Work", kicker: "Selected work", eyebrow: "Chapter 2 · Work", heading: "Three pieces I am glad to show" },
      { id: "craft", title: "Craft", kicker: "What I do well", eyebrow: "Chapter 3 · Craft", heading: "Complicated capability, made easy to use" },
      { id: "contact", title: "Hello", kicker: "Say hello", eyebrow: "Chapter 4 · Hello", heading: "If you have an idea, come say hello" },
    ],
  },
  zh: {
    site: {
      ...shared,
      tagline: "Aicoding 开发者 · 瞎折腾 · 乐于分享",
      hint: "把光标移到书或饰品上，它们会探出来。点一下书就能翻开。",
      badge: "开放合作中",
      place: "广东汕头",
    },
    ui: {
      pageTitle: "Amico 的书架",
      loading: "正在把书摆上夜色里的架子",
      closeLabel: "合上这一页",
      stackHeading: "核心技术栈",
      contactLead: "有想法或合作意向？欢迎发邮件，或到 GitHub、微信找我。我在广东汕头。",
      wechatAlt: "微信二维码，扫码加 Amico 为好友",
      wechatCaption: "扫码加我为好友",
      switchText: "English",
      switchLabel: "切换到英语",
    },
    about: {
      lead: "我是 Amico，一名深耕 AI 应用层的开发者。我擅长利用大语言模型（LLM）构建智能化产品，在 RAG（检索增强生成）设计、Prompt Engineering 以及 AI Agent 开发方面有实战经验。我热衷于探索 AI 与 Web3 的交叉领域，致力于将复杂的 AI 能力转化为流畅的用户体验。",
      stack: "React / Next.js / Tailwind CSS。具备 AI 实战技巧，熟悉 LangChain / LlamaIndex 等 RAG 框架及向量数据库应用；具备跨语言开发能力，能熟练阅读 Python 与 Java 后端代码。",
      tags: ["AI 开发", "RAG", "LLM", "React", "Prompt"],
    },
    projects: [
      {
        title: "Vue3 AI UI",
        tech: "Vue 3.4+ · AI 组件库",
        body: "类似 Ant Design X 的 AI 驱动企业级组件库，含对话、思考过程、打字动画等 8 个 AI 专属组件，以及虚拟列表等高性能组件，开箱即用。",
        href: "https://vaiui.zhxnodehub.top/",
        cta: "打开站点",
      },
      {
        title: "个人展示页",
        tech: "React · Vite · Vercel",
        body: "用 React 和 Vite 搭的个人加载与展示页，黏土风格界面，已经部署在 Vercel。",
        href: "https://github.com/Tom-kkk/my-loading-page",
        cta: "查看 GitHub",
      },
      {
        title: "QRCode Gen",
        tech: "Next.js · Supabase",
        body: "动态二维码生成与管理平台，支持注册登录、随时改目标链接、扫码跳转追踪和数据统计。",
        href: "https://github.com/Tom-kkk/qrcode-gen",
        cta: "查看 GitHub",
      },
    ],
    skills: [
      { title: "前端工程", body: "React / Next.js / Tailwind CSS。" },
      { title: "AI 与 RAG", body: "熟悉 LangChain、LlamaIndex 等 RAG 框架，以及向量数据库的实际用法。" },
      { title: "智能化产品", body: "用大语言模型做产品，Prompt Engineering 和 AI Agent 都有落地经验。" },
      { title: "跨语言协作", body: "前端为主，能熟练读 Python 和 Java 的后端代码，方便和后端一起把功能做完。" },
    ],
    books: [
      { id: "about", title: "简介", kicker: "关于我", eyebrow: "第一章 · ABOUT", heading: "你好，我是 Amico" },
      { id: "projects", title: "项目", kicker: "做过的事", eyebrow: "第二章 · WORK", heading: "三件拿得出手的作品" },
      { id: "craft", title: "能力", kicker: "拿手的", eyebrow: "第三章 · CRAFT", heading: "把复杂能力做成顺手的产品" },
      { id: "contact", title: "联系", kicker: "来找我", eyebrow: "第四章 · HELLO", heading: "有想法，就来打个招呼" },
    ],
  },
};

const STORAGE_KEY = "amico-shelf-lang";

export function readLocale() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "zh" || saved === "en") return saved;
  } catch {
    /* 浏览器禁止读取本地存储时，使用默认英语。 */
  }
  return "en";
}

export function storeLocale(locale) {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    /* 无法写入时，本次访问仍然可以切换。 */
  }
}
