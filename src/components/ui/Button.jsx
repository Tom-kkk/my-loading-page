/**
 * 主按钮 / 次按钮，黏土风格边框与 hover
 * variant: 'primary' | 'secondary'
 */
export default function Button({ href, variant = 'primary', children, className = '', icon: Icon, ...props }) {
  const base =
    'inline-flex items-center gap-2 rounded-2xl border-[3px] px-6 py-3 font-medium cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    primary:
      'border-primary bg-primary text-white hover:shadow-clay-hover hover:bg-rose-600 dark:hover:bg-rose-700 focus:ring-primary dark:border-rose-500 dark:bg-rose-600',
    secondary:
      'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:shadow-clay-hover dark:hover:shadow-none hover:border-secondary dark:hover:border-amber-500 hover:text-secondary dark:hover:text-amber-300 focus:ring-secondary dark:focus:ring-offset-slate-800',
  };
  const classes = `${base} ${variants[variant]} ${className}`.trim();

  const content = (
    <>
      {Icon && <Icon className="w-5 h-5 shrink-0" />}
      {children}
    </>
  );

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" className={classes} {...props}>
      {content}
    </button>
  );
}
