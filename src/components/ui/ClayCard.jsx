/**
 * 黏土风格卡片容器，支持不同边框/背景主题
 * theme: 'amber' | 'sky' | 'rose' | 'violet' | 'emerald' | 'amber-yellow'
 * as: 'div' | 'article' | 'section'
 */
const themeClasses = {
  amber:
    'border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-slate-800 dark:to-slate-700',
  'amber-yellow':
    'border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-slate-800 dark:to-slate-700',
  sky: 'border-sky-200 dark:border-sky-800 bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700',
  rose: 'border-rose-200 dark:border-rose-800 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-slate-800 dark:to-slate-700',
  violet: 'border-violet-200 dark:border-violet-800 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-slate-800 dark:to-slate-700',
  emerald: 'border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-700',
};

export default function ClayCard({
  theme = 'amber',
  as: Tag = 'div',
  hover = true,
  className = '',
  children,
  ...props
}) {
  const themeClass = themeClasses[theme] ?? themeClasses.amber;
  return (
    <Tag
      className={`rounded-[20px] border-4 ${themeClass} p-6 shadow-clay dark:shadow-none dark:ring-1 dark:ring-slate-600/50 transition-shadow duration-200 ${hover ? 'hover:shadow-clay-hover dark:hover:ring-slate-500 cursor-default' : ''} ${className}`.trim()}
      {...props}
    >
      {children}
    </Tag>
  );
}
