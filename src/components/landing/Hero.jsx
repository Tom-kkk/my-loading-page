import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { ArrowUpRight, Play } from 'lucide-react'

const MotionP = motion.p
const MotionDiv = motion.div
import BlurText from '@/components/landing/BlurText'
import { useLocale } from '@/contexts/LocaleContext'

const HERO_MP4 =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4'

export default function Hero() {
  const { locale, site } = useLocale()
  const { hero, heroExtra, techTags } = site
  const videoRef = useRef(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return undefined
    const tryPlay = () => {
      const p = v.play()
      if (p && typeof p.then === 'function') p.catch(() => {})
    }
    tryPlay()
    v.addEventListener('canplay', tryPlay, { once: true })
    return () => v.removeEventListener('canplay', tryPlay)
  }, [])

  return (
    <section
      id="home"
      className="relative overflow-visible bg-black text-white"
      style={{ height: '1000px' }}
      aria-labelledby="hero-heading"
    >
      <video
        ref={videoRef}
        className="absolute left-0 w-full min-h-[min(50vw,28rem)] h-auto object-contain z-0 pointer-events-none"
        style={{ top: '20%' }}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/images/hero_bg.jpeg"
        aria-hidden
      >
        <source src={HERO_MP4} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/5 z-0 pointer-events-none" aria-hidden />
      <div
        className="absolute bottom-0 left-0 right-0 z-0 h-[300px] pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, black)',
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center px-6 text-center lg:px-8" style={{ paddingTop: '150px' }}>
        <div className="liquid-glass inline-flex items-center rounded-full px-1 py-1 gap-2 mb-8">
          <span className="bg-white text-black rounded-full px-3 py-1 text-xs font-semibold font-body">
            {heroExtra.badgeInner}
          </span>
          <span className="pr-2 text-xs font-medium text-white font-body">
            {heroExtra.badgeLine}
          </span>
        </div>

        <h1
          id="hero-heading"
          key={locale}
          className="text-6xl md:text-7xl lg:text-[5.5rem] font-heading italic text-foreground leading-[0.8] max-w-2xl tracking-[-4px] mb-6"
        >
          <BlurText text={hero.title} splitBy="char" staggerDelay={0.1} />
        </h1>

        <MotionP
          className="max-w-xl text-sm md:text-base text-white font-body font-light leading-tight mb-10"
          initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
          whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ delay: 0.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {hero.subtitle}
        </MotionP>

        <MotionDiv
          className="flex flex-wrap items-center justify-center gap-4"
          initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
          whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 1.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <a
            href="#contact"
            className="liquid-glass-strong relative z-10 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium font-body text-white hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            {heroExtra.ctaPrimary}
            <ArrowUpRight className="size-4" strokeWidth={2} />
          </a>
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium font-body text-white/90 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            <Play className="size-4 fill-white text-black" aria-hidden />
            {heroExtra.ctaSecondary}
          </a>
        </MotionDiv>

        <div className="mt-auto flex w-full flex-col items-center gap-8 pb-8 pt-16">
          <div className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white font-body">
            {heroExtra.partnersIntro}
          </div>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 md:gap-x-16">
            {techTags.map((name) => (
              <span
                key={name}
                className="text-2xl md:text-3xl font-heading italic text-white"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
