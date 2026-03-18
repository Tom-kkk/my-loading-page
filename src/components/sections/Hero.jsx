import { useState, useEffect } from 'react';
import Button from '../ui/Button';
import ClayCard from '../ui/ClayCard';
import { IconBriefcase, IconEnvelope } from '../icons';
import { hero } from '../../data/site';

const techTags = ['AI 开发', 'RAG', 'LLM', 'React', 'Prompt'];

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section
      id="home"
      className="mb-16 sm:mb-24 scroll-mt-24"
      aria-labelledby="hero-heading"
    >
      <ClayCard theme="amber" className="relative overflow-hidden p-8 sm:p-14 text-center" hover={false}>

        {/* 背景装饰色块 */}
        <div aria-hidden className="pointer-events-none absolute -top-8 -right-8 h-52 w-52 rounded-full bg-primary/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-10 -left-10 h-60 w-60 rounded-full bg-secondary/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute top-1/2 right-1/3 h-36 w-36 -translate-y-1/2 rounded-full bg-accent/10 blur-2xl" />

        {/* 浮动装饰小点 */}
        <div aria-hidden className="pointer-events-none absolute left-8 top-8 h-3 w-3 animate-hero-float rounded-full bg-primary/35" />
        <div aria-hidden className="pointer-events-none absolute right-10 top-12 h-2 w-2 animate-hero-float-delay rounded-full bg-secondary/50" />
        <div aria-hidden className="pointer-events-none absolute bottom-10 right-8 h-4 w-4 animate-hero-float rounded-full bg-accent/25" />
        <div aria-hidden className="pointer-events-none absolute bottom-8 left-16 h-2.5 w-2.5 animate-hero-float-delay rounded-full bg-mint/45" />
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-6 h-1.5 w-1.5 animate-hero-float rounded-full bg-primary/20" />

        {/* 状态徽章 */}
        <div
          className={`mb-6 inline-flex items-center gap-2 rounded-full border-2 border-emerald-200 bg-emerald-50 px-4 py-1.5 transition-all duration-700 dark:border-emerald-700/50 dark:bg-emerald-900/30 ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
          }`}
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-mint" />
          <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            开放合作中
          </span>
        </div>

        {/* 主标题（渐变文字） */}
        <h1
          id="hero-heading"
          className={`mb-3 bg-gradient-to-r from-slate-900 via-primary to-secondary bg-clip-text font-caveat text-5xl font-bold text-transparent transition-all duration-700 delay-100 dark:from-slate-50 dark:via-rose-300 dark:to-amber-300 sm:text-6xl md:text-7xl ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}
        >
          {hero.title}
        </h1>

        {/* 副标题 */}
        <p
          className={`mb-7 text-lg text-slate-600 transition-all duration-700 delay-200 dark:text-slate-300 sm:text-xl ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}
        >
          {hero.subtitle}
        </p>

        {/* 技术标签 pill */}
        <div
          className={`mb-8 flex flex-wrap justify-center gap-2 transition-all duration-700 delay-300 ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          {techTags.map((tag) => (
            <span
              key={tag}
              className="rounded-xl border-2 border-amber-200 bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-800 dark:border-amber-700/40 dark:bg-amber-900/20 dark:text-amber-300"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTA 按钮组 */}
        <div
          className={`flex flex-wrap justify-center gap-4 transition-all duration-700 delay-500 ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <Button href="#projects" variant="primary" icon={IconBriefcase}>
            看看项目
          </Button>
          <Button href="#contact" variant="secondary" icon={IconEnvelope}>
            联系我
          </Button>
        </div>

      </ClayCard>
    </section>
  );
}
