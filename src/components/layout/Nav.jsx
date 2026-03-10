import { navLinks } from '../../data/site';

const brandHref = '#home';

export default function Nav() {
  return (
    <nav className="sticky top-0 z-20 py-4 px-4 sm:px-6 lg:px-8" aria-label="主导航">
      <div className="max-w-6xl mx-auto flex items-center justify-between rounded-2xl border-[3px] border-slate-200 bg-white/90 shadow-clay px-6 py-3">
        <a
          href={brandHref}
          className="font-caveat text-2xl font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg cursor-pointer transition-colors duration-200 hover:text-secondary"
        >
          我的小站
        </a>
        <div className="flex gap-4">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-slate-600 hover:text-primary cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
