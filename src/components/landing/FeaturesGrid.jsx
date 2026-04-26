import { Zap, Palette, BarChart3, Shield } from 'lucide-react'
import { useSiteContent } from '@/contexts/LocaleContext'

const iconMap = {
  zap: Zap,
  palette: Palette,
  chart: BarChart3,
  shield: Shield,
}

export default function FeaturesGrid() {
  const { badge, heading, items } = useSiteContent().featuresGridSection
  return (
    <section className="bg-black py-24 px-6 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center max-w-3xl mx-auto">
          <div className="liquid-glass mb-6 inline-flex rounded-full px-3.5 py-1 text-xs font-medium text-white font-body">
            {badge}
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9]">
            {heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(({ key, title, body }) => {
            const Icon = iconMap[key] ?? Zap
            return (
              <article key={key} className="liquid-glass rounded-2xl p-6 flex flex-col gap-4">
                <div className="liquid-glass-strong flex size-10 items-center justify-center rounded-full text-white">
                  <Icon className="size-5" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-body font-medium text-white">{title}</h3>
                <p className="text-white/60 font-body font-light text-sm md:text-base leading-relaxed">
                  {body}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
