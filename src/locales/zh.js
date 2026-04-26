/**
 * 简体中文文案
 */
const about = {
  name: 'Amico',
  intro:
    '我是 Amico，一名深耕 AI 应用层的开发者。我擅长利用大语言模型（LLM）构建智能化产品，在 RAG（检索增强生成）设计、Prompt Engineering 以及 AI Agent 开发方面有实战经验。我热衷于探索 AI 与 Web3 的交叉领域，致力于将复杂的 AI 能力转化为流畅的用户体验。',
  skills:
    '核心技术栈：React / Next.js / Tailwind CSS。具备 AI 实战技巧，熟悉 LangChain/LlamaIndex 等 RAG 框架及向量数据库应用；具备跨语言开发能力，能熟练阅读 Python 与 Java 后端代码。',
}

export default {
  navLinks: [
    { href: '#home', label: '首页' },
    { href: '#about', label: '简介' },
    { href: '#projects', label: '项目' },
    { href: '#contact', label: '联系' },
  ],
  navAriaLabel: '主导航',
  navbar: {
    contactCta: '联系我',
    contactShort: '联系',
  },
  ui: { langLabelZh: '中', langLabelEn: 'EN' },
  hero: {
    title: '你好，我是Amico',
    subtitle: 'Aicoding开发者 · 瞎折腾 · 乐于分享',
  },
  heroExtra: {
    badgeInner: '新',
    badgeLine: '开放合作中',
    ctaPrimary: '联系我',
    ctaSecondary: '看看项目',
    partnersIntro: '技术栈与方向',
  },
  techTags: ['AI 开发', 'RAG', 'LLM', 'React', 'Prompt'],
  about,
  startSection: {
    badge: '关于',
    heading: '个人简介',
    cta: '联系我',
  },
  featuresChessSection: {
    badge: '能力展示',
    heading: '个人简介与技术栈。',
    row1: {
      title: '个人简介',
      cta: '看看项目',
      href: '#projects',
    },
    row2: {
      title: '技术栈',
      cta: '欢迎交流',
      href: '#contact',
    },
  },
  featuresGridSection: {
    badge: '技术要点',
    heading: '核心技术栈与能力。',
    items: [
      { key: 'zap', title: '前端工程', body: 'React / Next.js / Tailwind CSS。' },
      { key: 'palette', title: 'AI 与 RAG', body: '熟悉 LangChain/LlamaIndex 等 RAG 框架及向量数据库应用；具备 AI 实战技巧。' },
      { key: 'chart', title: '智能化产品', body: '擅长利用大语言模型（LLM）构建智能化产品，在 Prompt Engineering 以及 AI Agent 开发方面有实战经验。' },
      { key: 'shield', title: '跨语言协作', body: '具备跨语言开发能力，能熟练阅读 Python 与 Java 后端代码。' },
    ],
  },
  projectsSection: { badge: '精选', heading: '个人项目' },
  projects: [
    {
      id: '1',
      title: 'Vue3 AI UI',
      description:
        '类似 Ant Design X 的 AI 驱动企业级组件库，含对话、思考过程、打字动画等 8 个 AI 专属组件，以及虚拟列表等高性能组件，基于 Vue 3.4+，开箱即用。',
      href: 'https://vaiui.zhxnodehub.top/',
      theme: 'rose',
      icon: 'book',
    },
    {
      id: '2',
      title: '个人展示页项目',
      description: 'React + Vite 搭建的个人加载/展示页，黏土风格 UI，部署于 Vercel。',
      href: 'https://github.com/Tom-kkk/my-loading-page',
      theme: 'violet',
      icon: 'image',
    },
    {
      id: '3',
      title: 'QRCode Gen',
      description:
        '基于 Next.js 构建的动态二维码生成与管理平台，支持用户注册登录、创建可随时修改目标链接的动态二维码、扫码跳转追踪及数据统计，后端由 Supabase 驱动。',
      href: 'https://github.com/Tom-kkk/qrcode-gen',
      theme: 'emerald',
      icon: 'bolt',
    },
  ],
  projectCard: { cta: '查看项目' },
  statsSection: {
    items: [
      { value: '', label: '代表项目' },
      { value: 'RAG', label: '与 LLM 实战方向' },
      { value: '全栈', label: '前端为主，可读 Python / Java' },
      { value: '在线', label: '欢迎邮件或 GitHub 交流' },
    ],
  },
  contact: {
    copy: '有想法或合作意向？欢迎发邮件或到社交账号找我。',
    email: 'zhx_2481632.com',
    emailLabel: '发邮件',
    githubHref: 'https://github.com/Tom-kkk',
    githubLabel: 'GitHub',
  },
  ctaFooter: {
    heading: '有想法或合作意向？',
    sub: '欢迎发邮件或到社交账号找我。',
    primary: '发邮件',
    secondary: '查看项目',
    privacy: '隐私',
    terms: '条款',
    contact: '联系',
  },
  wechat: {
    cta: '加微信',
    qrAlt: '微信二维码',
    hint: '扫码加我为好友',
  },
  emailModal: {
    title: '电子邮件',
    desc: '复制地址。或在系统邮件中直接撰写。',
    copy: '复制',
    copied: '已复制',
    openMail: '打开邮箱',
    closeLabel: '关闭弹窗',
  },
}
