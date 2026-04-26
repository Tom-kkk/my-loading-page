import { ArrowUpRight } from 'lucide-react'
import logoImg from '@/assets/logo.jpg'
import { cn } from '@/lib/utils'
import { useLocale } from '@/contexts/LocaleContext'

export default function Navbar() {
  const { locale, setLocale, site } = useLocale()
  const { navLinks, navAriaLabel, navbar, ui } = site

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-8 lg:px-16 py-3 pointer-events-none">
      <div className="pointer-events-auto flex items-center justify-between gap-4">
        <a href="#home" className="shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40">
          <img src={logoImg} alt="" className="h-12 w-12 rounded-full object-cover ring-1 ring-white/20" />
        </a>

        <div className="hidden md:flex flex-1 items-center justify-end gap-2 min-w-0">
          <nav className="flex items-center" aria-label={navAriaLabel}>
            <div className="liquid-glass flex items-center rounded-full px-1.5 py-1 gap-0.5">
              {navLinks.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="px-3 py-2 text-sm font-medium text-foreground/90 font-body rounded-full hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                >
                  {label}
                </a>
              ))}
              <a
                href="#contact"
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium font-body',
                  'bg-white text-black hover:bg-white/90 transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black',
                )}
              >
                {navbar.contactCta}
                <ArrowUpRight className="size-4" strokeWidth={2} />
              </a>
            </div>
          </nav>
          <div
            className="flex shrink-0 items-center gap-0.5 rounded-full p-0.5 liquid-glass"
            role="group"
            aria-label="Language"
          >
            <button
              type="button"
              onClick={() => setLocale('zh')}
              className={cn(
                'rounded-full px-2.5 py-1.5 text-xs font-medium font-body transition-colors',
                locale === 'zh' ? 'bg-white text-black' : 'text-white/75 hover:text-white',
              )}
            >
              {ui.langLabelZh}
            </button>
            <button
              type="button"
              onClick={() => setLocale('en')}
              className={cn(
                'rounded-full px-2.5 py-1.5 text-xs font-medium font-body transition-colors',
                locale === 'en' ? 'bg-white text-black' : 'text-white/75 hover:text-white',
              )}
            >
              {ui.langLabelEn}
            </button>
          </div>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <div
            className="flex items-center gap-0.5 rounded-full p-0.5 liquid-glass"
            role="group"
            aria-label="Language"
          >
            <button
              type="button"
              onClick={() => setLocale('zh')}
              className={cn(
                'rounded-full px-2 py-1 text-xs font-medium font-body',
                locale === 'zh' ? 'bg-white text-black' : 'text-white/75',
              )}
            >
              {ui.langLabelZh}
            </button>
            <button
              type="button"
              onClick={() => setLocale('en')}
              className={cn(
                'rounded-full px-2 py-1 text-xs font-medium font-body',
                locale === 'en' ? 'bg-white text-black' : 'text-white/75',
              )}
            >
              {ui.langLabelEn}
            </button>
          </div>
          <a
            href="#contact"
            className="inline-flex items-center gap-1 rounded-full bg-white text-black px-3.5 py-1.5 text-sm font-medium font-body"
          >
            {navbar.contactShort}
            <ArrowUpRight className="size-4" />
          </a>
        </div>
      </div>
    </header>
  )
}
