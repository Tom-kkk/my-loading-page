import HlsVideo from '@/components/landing/HlsVideo'
import { useSiteContent } from '@/contexts/LocaleContext'

const STATS_HLS =
  'https://stream.mux.com/NcU3HlHeF7CUL86azTTzpy3Tlb00d6iF3BmCdFslMJYM.m3u8'

export default function Stats() {
  const { statsSection } = useSiteContent()
  return (
    <section className="relative min-h-[420px] overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <HlsVideo
          src={STATS_HLS}
          desaturate
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[200px] video-fade-top" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[200px] video-fade-bottom" aria-hidden />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-24 lg:px-8">
        <div className="liquid-glass rounded-3xl p-12 md:p-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {statsSection.items.map(({ value, label }) => (
              <div key={`${value}-${label}`} className="text-center lg:text-left">
                <p className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white mb-2">
                  {value}
                </p>
                <p className="text-white/60 font-body font-light text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
