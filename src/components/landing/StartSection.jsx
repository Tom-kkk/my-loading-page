import HlsVideo from '@/components/landing/HlsVideo'
import { useSiteContent } from '@/contexts/LocaleContext'

const START_HLS =
  'https://stream.mux.com/9JXDljEVWYwWu01PUkAemafDugK89o01BR6zqJ3aS9u00A.m3u8'

export default function StartSection() {
  const startSection = useSiteContent().startSection

  return (
    <section id="about" className="relative min-h-[500px] overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <HlsVideo
          src={START_HLS}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[200px] video-fade-top" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[200px] video-fade-bottom" aria-hidden />

      <div className="relative z-10 mx-auto flex min-h-[500px] max-w-3xl flex-col items-center justify-center px-6 py-24 text-center">
        <div className="liquid-glass mb-6 rounded-full px-3.5 py-1 text-xs font-medium text-white font-body">
          {startSection.badge}
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9] mb-6">
          {startSection.heading}
        </h2>
        <p className="text-white/60 font-body font-light text-sm md:text-base max-w-2xl mb-10">
          {startSection.sub}
        </p>
        <a
          href="#contact"
          className="liquid-glass-strong relative z-10 inline-flex items-center rounded-full px-6 py-3 text-sm font-medium font-body text-white hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          {startSection.cta}
        </a>
      </div>
    </section>
  )
}
