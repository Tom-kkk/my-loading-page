/**
 * 黏土风格卡片容器，支持不同边框/背景主题
 * theme: 'amber' | 'sky' | 'rose' | 'violet' | 'emerald' | 'amber-yellow'
 * as: 'div' | 'article' | 'section'
 */
const themeClasses = {
  amber:
    'border-amber-200 bg-gradient-to-br from-amber-100 to-orange-100',
  'amber-yellow':
    'border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50',
  sky: 'border-sky-200 bg-gradient-to-br from-sky-50 to-cyan-50',
  rose: 'border-rose-200 bg-gradient-to-br from-rose-50 to-pink-50',
  violet: 'border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50',
  emerald: 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50',
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
      className={`rounded-[20px] border-4 ${themeClass} p-6 shadow-clay transition-shadow duration-200 ${hover ? 'hover:shadow-clay-hover cursor-default' : ''} ${className}`.trim()}
      {...props}
    >
      {children}
    </Tag>
  );
}
