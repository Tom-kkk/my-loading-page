import { ArrowUpRight } from 'lucide-react'
import { useSiteContent } from '@/contexts/LocaleContext'
import feature1 from '@/assets/feature-1.gif'
import feature2 from '@/assets/feature-2.gif'

function Row({ reverse, title, body, cta, href, media }) {
  return (
    <div
      className={`flex flex-col gap-10 lg:gap-16 lg:items-center ${
        reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'
      }`}
    >
      <div className="flex-1 space-y-6">
        <h3 className="text-3xl md:text-4xl font-heading italic text-white tracking-tight leading-[0.95]">
          {title}
        </h3>
        <p className="text-white/60 font-body font-light text-sm md:text-base leading-relaxed">
          {body}
        </p>
        <a
          href={href}
          className="liquid-glass-strong relative z-10 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium font-body text-white hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          {cta}
          <ArrowUpRight className="size-4" strokeWidth={2} />
        </a>
      </div>
      <div className="flex-1 w-full">
        <div className="liquid-glass rounded-2xl overflow-hidden">
          <img src={media} alt="" className="w-full h-auto object-cover block" loading="lazy" />
        </div>
      </div>
    </div>
  )
}

export default function FeaturesChess() {
  const { badge, heading, row1, row2 } = useSiteContent().featuresChessSection
  return (
    <section className="bg-black py-24 px-6 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <div className="liquid-glass mb-6 inline-flex rounded-full px-3.5 py-1 text-xs font-medium text-white font-body">
            {badge}
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9]">
            {heading}
          </h2>
        </div>

        <div className="space-y-24">
          <Row
            reverse={false}
            title={row1.title}
            body={row1.body}
            cta={row1.cta}
            href={row1.href}
            media={feature1}
          />
          <Row
            reverse
            title={row2.title}
            body={row2.body}
            cta={row2.cta}
            href={row2.href}
            media={feature2}
          />
        </div>
      </div>
    </section>
  )
}
