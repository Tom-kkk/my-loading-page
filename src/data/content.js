export const themes = {
  about: { cloth: "#141d38", seal: "#e06d6d" },
  projects: { cloth: "#4d1d33", seal: "#f0c975" },
  craft: { cloth: "#103b39", seal: "#7fd4b8" },
  contact: { cloth: "#59321b", seal: "#f0d28c" },
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
      tagline: "AI Product Delivery · FDE · Agent & AI Infra",
      hint: "Hover a book or ornament to wake it. Click a book to read, or tap the lamp & moon.",
      badge: "Open to collaborate",
      place: "Shantou, Guangdong",
    },
    ui: {
      pageTitle: "Amico · FDE & AI Builder",
      loading: "Placing the books on the night shelf",
      closeLabel: "Close this page",
      stackHeading: "Stack & Agentic Workflow",
      contactLead: "Looking for an FDE or an AI product builder to ship fast? Email me, or find me on GitHub and WeChat. Based in Shantou, Guangdong.",
      wechatAlt: "WeChat QR code. Scan it to add Amico.",
      wechatCaption: "Scan to add me on WeChat",
      replyHint: "Usually replies within 24 hours",
      aboutMeta: "FDE · AI PRODUCT DELIVERY · AGENT & AI INFRA",
      switchText: "中文",
      switchLabel: "Switch to Chinese",
      prevChapter: "Prev",
      nextChapter: "Next",
      copyEmail: "Copy email",
      copiedEmail: "Copied",
      lampOn: "Lamp on",
      lampOff: "Moonlit",
      lampLabel: "Toggle desk lamp",
      cursorRead: "Read",
      cursorLampOn: "Turn lamp on",
      cursorLampOff: "Turn lamp off",
      cursorMoon: "Make a wish",
      cursorRocket: "Launch rocket",
      cursorCatWake: "Wake the cat",
      cursorCatBack: "Back to shelf",
      cursorOwl: "Hoot the owl",
      cursorRose: "Bloom the rose",
      cursorTap: "Tap",
      soundOn: "Sound",
      soundOff: "Muted",
      soundLabel: "Toggle sound effects",
      fullscreenEnter: "Enter fullscreen",
      fullscreenExit: "Exit fullscreen",
      allReadToast: "All four volumes explored — a meteor shower for you",
      rotateTitle: "Rotate to landscape",
      rotateBody: "Turn your phone sideways to explore the full night shelf and all its hidden details.",
      rotateSkip: "Continue in portrait",
      portraitSwipeHint: "← Swipe left or right to explore →",
      wxTitle: "Open in Browser",
      wxBody: "WeChat cannot display the 3D night shelf in fullscreen. Open this page in your system browser for the full experience.",
      wxStep1: "Tap ··· in the top-right corner",
      wxStep2Ios: "Choose \"Open in Default Browser\"",
      wxStep2Android: "Choose \"Open in Browser\"",
      wxCopyLink: "Copy link",
      wxCopied: "Link copied",
      loadingTips: [
        "Tip: Click the desk lamp on the top shelf to switch between warm light and moonlight.",
        "Tip: Tap the little black cat or rocket for a hidden 3D surprise.",
        "Tip: Click the moon for a shooting star, or the rose for falling petals.",
        "Tip: Explore all four volumes to unlock a night-sky meteor shower.",
      ],
    },
    about: {
      lead: "I am Amico, an AI Product Builder and Forward Deployed Engineer (FDE). I focus on turning Agent architectures and AI Infra into real, shipped products—leveraging agentic coding workflows like Codex and Antigravity to compress idea-to-production delivery from weeks into days.",
      stack: "Agent & AI Infra (Tool Calling, RAG, MCP, context engineering & evals) · Agentic Coding (Codex, Antigravity, automated workflows) · Full-Stack Delivery (React, Next.js, Vue 3, Three.js, Supabase, with cross-language collaboration in Python & Java).",
      tags: ["FDE", "AI Product Delivery", "Agent & AI Infra", "Codex / Antigravity", "Full-Stack"],
    },
    projects: [
      {
        title: "Amico Night Shelf",
        tech: "Agentic Coding · Three.js · GLSL Shader",
        body: "An interactive 3D night-sky study shipped rapidly with Antigravity & Codex. 100% original procedural 3D ornaments, gold-foil hardcovers, custom GLSL star & comet shaders, and instant zero-asset-bloat loading.",
        href: "https://github.com/Tom-kkk/my-loading-page",
        cta: "View on GitHub",
      },
      {
        title: "Vue3 AI UI",
        tech: "AI UI Infra · Vue 3.4+ · Streaming",
        body: "An enterprise AI interaction infrastructure library inspired by Ant Design X. Ships 8 production-ready Agent UI primitives—streaming chat, reasoning traces, typing animation, and high-throughput virtual lists.",
        href: "https://vaiui.zhxnodehub.top/",
        cta: "Open live site",
      },
      {
        title: "QRCode Gen",
        tech: "Full-Stack SaaS · Next.js · Supabase",
        body: "An end-to-end dynamic QR code SaaS platform built for rapid commercial delivery—covering auth, real-time destination routing, scan tracking, and analytics.",
        href: "https://github.com/Tom-kkk/qrcode-gen",
        cta: "View on GitHub",
      },
    ],
    skills: [
      { title: "0→1 AI Product Delivery", body: "Outcome-driven FDE mindset: breaking ambiguous requirements into working prototypes and production launches at high velocity." },
      { title: "Agent & AI Infra", body: "Hands-on with Agent orchestration, Tool Calling, RAG retrieval, MCP protocols, and streaming interaction infrastructure." },
      { title: "Agentic Coding Workflows", body: "Power user of Codex, Antigravity, and multi-agent engineering workflows to multiply delivery speed without sacrificing craft." },
      { title: "Full-Stack & Product Craft", body: "Strong frontend engineering paired with Python/Java backend collaboration and edge deployment—turning complex AI into effortless UX." },
    ],
    books: [
      { id: "about", title: "About", kicker: "FDE · AI Builder", eyebrow: "Chapter 1 · About", heading: "Hello, I am Amico" },
      { id: "projects", title: "Work", kicker: "Shipped work", eyebrow: "Chapter 2 · Work", heading: "Three products shipped end-to-end" },
      { id: "craft", title: "Craft", kicker: "How I deliver", eyebrow: "Chapter 3 · Craft", heading: "From AI Infra to shipped products" },
      { id: "contact", title: "Hello", kicker: "Work together", eyebrow: "Chapter 4 · Hello", heading: "Have an AI product to ship?" },
    ],
  },
  zh: {
    site: {
      ...shared,
      tagline: "AI 产品交付者 · FDE · Agent & AI Infra",
      hint: "悬停书本或摆件会探出。点书翻阅，点台灯开关暖光，点月亮唤流星。",
      badge: "开放合作中",
      place: "广东汕头",
    },
    ui: {
      pageTitle: "Amico · AI 产品交付者",
      loading: "正在把书摆上夜色里的架子",
      closeLabel: "合上这一页",
      stackHeading: "技术底座与 Agentic 工作流",
      contactLead: "需要 FDE 驻场推进或 AI 产品快速交付？欢迎发邮件，或到 GitHub、微信找我。坐标广东汕头。",
      wechatAlt: "微信二维码，扫码加 Amico 为好友",
      wechatCaption: "扫码加我为好友",
      replyHint: "通常 24 小时内回复，欢迎交流 AI 交付与 Agent",
      aboutMeta: "FDE · AI 产品交付 · AGENT & AI INFRA",
      switchText: "English",
      switchLabel: "切换到英语",
      prevChapter: "上一章",
      nextChapter: "下一章",
      copyEmail: "复制邮箱",
      copiedEmail: "已复制",
      lampOn: "暖灯",
      lampOff: "月色",
      lampLabel: "切换台灯暖光",
      cursorRead: "翻阅",
      cursorLampOn: "打开暖灯",
      cursorLampOff: "关掉暖灯",
      cursorMoon: "唤流星",
      cursorRocket: "发射火箭",
      cursorCatWake: "唤醒黑猫",
      cursorCatBack: "跳回上层",
      cursorOwl: "逗猫头鹰",
      cursorRose: "绽放玫瑰",
      cursorTap: "轻点",
      soundOn: "音效",
      soundOff: "静音",
      soundLabel: "切换魔法音效",
      fullscreenEnter: "进入全屏",
      fullscreenExit: "退出全屏",
      allReadToast: "已翻阅全部四卷 · 夜空流星雨为你而落",
      rotateTitle: "请横屏浏览书架",
      rotateBody: "将手机横过来，即可完整欣赏星空书架与所有隐藏彩蛋。",
      rotateSkip: "仍要竖屏查看",
      portraitSwipeHint: "← 左右滑动浏览完整书架 →",
      wxTitle: "请在浏览器中打开",
      wxBody: "微信内无法全屏体验 3D 星空书架，建议跳转至系统浏览器获得完整效果。",
      wxStep1: "点击右上角 ··· 菜单",
      wxStep2Ios: "选择「在默认浏览器中打开」",
      wxStep2Android: "选择「在浏览器中打开」",
      wxCopyLink: "复制网页链接",
      wxCopied: "已复制链接",
      loadingTips: [
        "小贴士：点击上层台灯，可以在暖灯书房与静谧月色之间切换。",
        "小贴士：点一下小黑猫或小火箭，会有意想不到的 3D 互动彩蛋。",
        "小贴士：点月亮可召唤彗星流星，点玫瑰会飘落 3D 玫瑰花瓣雨。",
        "小贴士：翻阅完架上全部四卷，夜空会为你放一场庆祝流星雨。",
      ],
    },
    about: {
      lead: "我是 Amico，一名聚焦 AI 产品交付的 FDE（Forward Deployed Engineer）。我关注的不只是模型能力本身，而是如何把 Agent 架构与 AI Infra 真正落进业务闭环；深度使用 Codex、Antigravity 等 Agentic Coding 工具链，能在极短周期内完成从需求拆解到生产级上线的全链路交付。",
      stack: "Agent / AI Infra（Tool Calling、RAG、MCP、上下文工程与评测）· Agentic Coding（Codex / Antigravity / 自动化交付流）· 全栈工程（React / Next.js / Vue 3 / Three.js / Supabase，可顺畅协作 Python 与 Java 后端）。",
      tags: ["FDE", "AI 产品交付", "Agent & AI Infra", "Codex / Antigravity", "全栈交付"],
    },
    projects: [
      {
        title: "Amico 星空书架",
        tech: "Agentic Coding · Three.js · GLSL Shader",
        body: "借助 Antigravity 与 Codex 多轮协同极速交付的 3D 交互式个人书房。100% 原创程序化 3D 摆件与烫金精装书、GLSL 星空彗星着色器，零外部模型依赖实现全端秒开。",
        href: "https://github.com/Tom-kkk/my-loading-page",
        cta: "查看 GitHub",
      },
      {
        title: "Vue3 AI UI",
        tech: "AI UI Infra · Vue 3.4+ · 流式交互",
        body: "面向 Agent 与大模型产品的企业级交互底座组件库（对标 Ant Design X），内置流式对话、思考链（Reasoning）、打字机渲染及高性能虚拟列表等 8 类高频组件。",
        href: "https://vaiui.zhxnodehub.top/",
        cta: "打开线上站点",
      },
      {
        title: "QRCode Gen",
        tech: "全栈 SaaS · Next.js · Supabase",
        body: "端到端独立交付的动态二维码 SaaS 平台，覆盖鉴权登录、实时目标路由改写与扫码数据统计，验证全栈快速商业化闭环能力。",
        href: "https://github.com/Tom-kkk/qrcode-gen",
        cta: "查看 GitHub",
      },
    ],
    skills: [
      { title: "0→1 AI 产品极速交付", body: "以业务闭环与上线结果为导向，擅长将模糊想法快速拆解为可交互原型与生产级产品。" },
      { title: "Agent 与 AI Infra 实践", body: "深入理解 Agent 编排、Tool Calling、RAG 检索、MCP 协议与流式交互底座，让模型稳定落地。" },
      { title: "Agentic Coding 工作流", body: "熟练驾驭 Codex、Antigravity 等多 Agent 研发工具，通过上下文工程与 Skill 编排成倍压缩交付周期。" },
      { title: "全栈与高质感体验封装", body: "前端工程扎实，能跨语言协作 Python / Java 后端与边缘部署，把复杂 AI 能力打磨成顺手的产品体验。" },
    ],
    books: [
      { id: "about", title: "简介", kicker: "FDE · AI 交付", eyebrow: "第一章 · ABOUT", heading: "你好，我是 Amico" },
      { id: "projects", title: "作品", kicker: "已交付项目", eyebrow: "第二章 · WORK", heading: "三件端到端交付的作品" },
      { id: "craft", title: "能力", kicker: "交付方法论", eyebrow: "第三章 · CRAFT", heading: "从 AI Infra 到真正落地的产品" },
      { id: "contact", title: "联系", kicker: "合作交流", eyebrow: "第四章 · HELLO", heading: "有 AI 产品想法，聊聊怎么快速交付" },
    ],
  },
};

const STORAGE_KEY = "amico-shelf-lang";

export function isMobileBrowser() {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod|Mobile|HarmonyOS|OpenHarmony/i.test(navigator.userAgent || "");
}

export function browserLocale() {
  if (typeof navigator === "undefined") return "en";
  const lang = navigator.language || navigator.languages?.[0] || "";
  return /^zh/i.test(lang) ? "zh" : "en";
}

export function readLocale() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "zh" || saved === "en") return saved;
  } catch {
    /* 浏览器禁止读取本地存储时，默认英文。 */
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
