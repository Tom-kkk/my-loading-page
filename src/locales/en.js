/**
 * English copy
 */
const about = {
  name: 'Amico',
  intro:
    "I'm Amico, a developer focused on the AI application layer. I build intelligent products with large language models, with hands-on experience in RAG, prompt engineering, and AI agent development. I'm drawn to the intersection of AI and Web3, and to turning complex AI capabilities into smooth user experiences.",
  skills:
    'Core stack: React / Next.js / Tailwind CSS. Strong in AI practice: LangChain / LlamaIndex, vector databases, and RAG. Cross-language: comfortable reading Python and Java backends.',
}

export default {
  navLinks: [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#projects', label: 'Projects' },
    { href: '#contact', label: 'Contact' },
  ],
  navAriaLabel: 'Main navigation',
  navbar: {
    contactCta: 'Contact me',
    contactShort: 'Contact',
  },
  ui: { langLabelZh: '中', langLabelEn: 'EN' },
  hero: {
    title: "Hi, I'm Amico",
    subtitle: 'Aicoding dev · tinkerer · love to share',
  },
  heroExtra: {
    badgeInner: 'New',
    badgeLine: 'Open to collaboration',
    ctaPrimary: 'Contact me',
    ctaSecondary: 'View projects',
    partnersIntro: 'Stack & focus',
  },
  techTags: ['AI', 'RAG', 'LLM', 'React', 'Prompt'],
  about,
  startSection: {
    badge: 'About',
    heading: 'Bio',
    cta: 'Contact me',
  },
  featuresChessSection: {
    badge: 'Highlights',
    heading: 'Bio & technical stack',
    row1: {
      title: 'Bio',
      cta: 'View projects',
      href: '#projects',
    },
    row2: {
      title: 'Stack',
      cta: "Let's talk",
      href: '#contact',
    },
  },
  featuresGridSection: {
    badge: 'Focus areas',
    heading: 'Core stack and capabilities',
    items: [
      { key: 'zap', title: 'Frontend', body: 'React / Next.js / Tailwind CSS.' },
      { key: 'palette', title: 'AI & RAG', body: 'LangChain / LlamaIndex, vector DBs, and practical RAG patterns.' },
      { key: 'chart', title: 'AI products', body: 'Building with LLMs, prompt design, and AI agent experience.' },
      { key: 'shield', title: 'Cross-language', body: 'Comfortable reading Python and Java backend code.' },
    ],
  },
  projectsSection: { badge: 'Selected', heading: 'Projects' },
  projects: [
    {
      id: '1',
      title: 'Vue3 AI UI',
      description:
        'An AI-focused enterprise component library inspired by Ant Design X, with chat, thinking, typing, and 8+ AI components plus virtual list and more, built on Vue 3.4+.',
      href: 'https://vaiui.zhxnodehub.top/',
      theme: 'rose',
      icon: 'book',
    },
    {
      id: '2',
      title: 'Portfolio (this site)',
      description: 'A React + Vite loading/showcase page with a claymorphism-style UI, deployed on Vercel.',
      href: 'https://github.com/Tom-kkk/my-loading-page',
      theme: 'violet',
      icon: 'image',
    },
    {
      id: '3',
      title: 'QRCode Gen',
      description:
        'A dynamic QR code platform on Next.js: sign-in, editable target URLs, scan tracking, and analytics, backed by Supabase.',
      href: 'https://github.com/Tom-kkk/qrcode-gen',
      theme: 'emerald',
      icon: 'bolt',
    },
  ],
  projectCard: { cta: 'View project' },
  statsSection: {
    items: [
      { value: '', label: 'Featured projects' },
      { value: 'RAG', label: 'LLM & RAG focus' },
      { value: 'Full stack', label: 'Frontend-first; reads Python & Java' },
      { value: 'Online', label: 'Open via email or GitHub' },
    ],
  },
  contact: {
    copy: 'Ideas or collaboration? Email me or reach out on social.',
    email: '321455764@qq.com',
    emailLabel: 'Email',
    githubHref: 'https://github.com/Tom-kkk',
    githubLabel: 'GitHub',
  },
  ctaFooter: {
    heading: 'Ideas or collaboration?',
    sub: 'Email me or reach out on social.',
    primary: 'Email',
    secondary: 'View projects',
    privacy: 'Privacy',
    terms: 'Terms',
    contact: 'Contact',
  },
  wechat: {
    cta: 'WeChat',
    qrAlt: 'WeChat QR code',
    hint: 'Scan to connect',
  },
  emailModal: {
    title: 'Email',
    desc: 'Copy the address, or open your mail app to compose.',
    copy: 'Copy',
    copied: 'Copied',
    openMail: 'Open mail',
    closeLabel: 'Close dialog',
  },
}
