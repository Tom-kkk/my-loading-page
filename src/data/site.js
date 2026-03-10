/**
 * 站点数据层：导航、项目、联系信息等，便于维护与复用
 */
export const navLinks = [
  { href: '#about', label: '简介' },
  { href: '#projects', label: '项目' },
  { href: '#contact', label: '联系' },
];

export const hero = {
  title: '你好，我是Amico',
  subtitle: '创意开发者 · 爱折腾 · 乐于分享',
};

export const about = {
  name: '小明',
  intro:
    '我是小明，一名喜欢把想法变成产品的开发者。平时写写代码、做做 side project，偶尔画点小图。相信好的产品要有趣、好用，还要有一点点「黏土感」的温暖。',
  skills: '技能：前端开发、UI 设计、小工具开发。喜欢 React、Tailwind，也爱折腾各种新框架。',
};

export const projects = [
  {
    id: '1',
    title: '小工具合集',
    description: '日常用的截图、配色、时间戳等小工具，全部开源可复用。',
    href: '#',
    theme: 'rose',
    icon: 'book',
  },
  {
    id: '2',
    title: '个人博客',
    description: '用 Next.js 搭的博客，记录学习笔记与项目复盘，支持暗色模式。',
    href: '#',
    theme: 'violet',
    icon: 'image',
  },
  {
    id: '3',
    title: '待办小应用',
    description: '轻量待办 + 番茄钟，本地存储，界面清爽，适合专注工作。',
    href: '#',
    theme: 'emerald',
    icon: 'bolt',
  },
];

export const contact = {
  copy: '有想法或合作意向？欢迎发邮件或到社交账号找我。',
  email: 'zhx_2481632.com',
  emailLabel: '发邮件',
  githubHref: 'https://github.com/Tom-kkk',
  githubLabel: 'GitHub',
};

export const footer = {
  text: '用黏土与色彩搭建的小站 · 欢迎常来',
};
