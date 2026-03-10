import { navLinks } from '../../data/site';
import { useTheme } from '../../contexts/ThemeContext';
import { IconSun, IconMoon } from '../icons';

const brandHref = '#home';

export default function Nav() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-20 py-4 px-4 sm:px-6 lg:px-8" aria-label="主导航">
      <div className="max-w-6xl mx-auto flex items-center justify-between rounded-2xl border-[3px] border-slate-200 dark:border-slate-600 bg-white/90 dark:bg-slate-800/95 shadow-clay dark:shadow-none dark:ring-1 dark:ring-slate-700 px-6 py-3">
        <a
          href={brandHref}
          className="font-caveat text-2xl font-semibold text-primary dark:text-rose-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate-800 rounded-lg cursor-pointer transition-colors duration-200 hover:text-secondary dark:hover:text-amber-300"
        >
          我的小站
        </a>
        <div className="flex items-center gap-2 sm:gap-4">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-rose-300 cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate-800 rounded px-2 py-1"
            >
              {label}
            </a>
          ))}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl border-[3px] border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700/80 text-slate-600 dark:text-slate-300 hover:border-primary dark:hover:border-rose-400 hover:text-primary dark:hover:text-rose-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate-800 cursor-pointer transition-colors duration-200"
            aria-label={theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
          >
            {theme === 'dark' ? (
              <IconSun className="w-5 h-5" />
            ) : (
              <IconMoon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
