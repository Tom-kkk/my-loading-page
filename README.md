# My Loading Page

个人展示/加载页，黏土风格 UI，基于 React + Vite 搭建，适合作为个人主页或博客入口页。

## 技术栈

- **React 19** + **Vite 6**
- **Tailwind CSS 4** 样式
- 数据与文案集中在 `src/data/site.js`，方便维护与二次定制

## 功能概览

- **简介**：个人介绍与技能说明
- **项目**：展示作品/项目卡片，支持多主题色与图标
- **联系**：邮件弹窗、GitHub 等社交链接
- **主题**：支持亮/暗切换（ThemeContext）

## 本地运行

```bash
# 安装依赖
npm install

# 开发
npm run dev

# 构建
npm run build

# 预览构建结果
npm run preview
```

## 自定义内容

修改 `src/data/site.js` 即可更新导航、英雄区文案、简介、项目列表、联系方式和页脚文字，无需改组件代码。

## 部署

可部署至 Vercel、Netlify 等平台；构建产物在 `dist` 目录。
