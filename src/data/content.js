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
      tagline: "An AI developer who likes to tinker and share.",
      hint: "Hover a book or ornament to wake it. Click a book to read, or tap the lamp & moon.",
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
      replyHint: "Usually replies within 24 hours",
      aboutMeta: "SHANTOU · AI DEVELOPER · LLM / RAG / AGENT",
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
      hint: "悬停书本或摆件会探出。点书翻阅，点台灯开关暖光，点月亮唤流星。",
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
      replyHint: "通常 24 小时内回复，欢迎交流 AI 与前端",
      aboutMeta: "广东汕头 · AI 应用开发 · LLM / RAG / AGENT",
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

export function isMobileBrowser() {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod|Mobile|HarmonyOS|OpenHarmony/i.test(navigator.userAgent || "");
}

export function readLocale() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "zh" || saved === "en") return saved;
  } catch {
    /* 浏览器禁止读取本地存储时，按设备规则判断。 */
  }
  // 电脑浏览器默认英文；手机浏览器根据系统/浏览器语言自动匹配中文或英文
  if (isMobileBrowser()) {
    const lang = navigator.language || navigator.languages?.[0] || "";
    return /^zh/i.test(lang) ? "zh" : "en";
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
