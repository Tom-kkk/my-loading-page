/**
 * 主按钮 / 次按钮，黏土风格边框与 hover
 * variant: 'primary' | 'secondary'
 */
export default function Button({ href, variant = 'primary', children, className = '', icon: Icon, ...props }) {
  const base =
    'inline-flex items-center gap-2 rounded-2xl border-[3px] px-6 py-3 font-medium cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    primary:
      'border-primary bg-primary text-white hover:shadow-clay-hover hover:bg-rose-600 focus:ring-primary',
    secondary:
      'border-slate-300 bg-white text-slate-700 hover:shadow-clay-hover hover:border-secondary hover:text-secondary focus:ring-secondary',
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
