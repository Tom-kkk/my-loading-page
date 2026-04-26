import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import HlsVideo from '@/components/landing/HlsVideo'
import EmailModal from '@/components/ui/EmailModal'
import HoverPopover from '@/components/ui/HoverPopover'
import { IconGitHub } from '@/components/icons'
import { useSiteContent } from '@/contexts/LocaleContext'
import wechatQR from '@/assets/wechat.jpg'

const CTA_HLS =
  'https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8'

export default function CtaFooter() {
  const [emailOpen, setEmailOpen] = useState(false)
  const { contact, ctaFooter, wechat } = useSiteContent()

  return (
    <section id="contact" className="relative overflow-hidden bg-black scroll-mt-24">
      <div className="absolute inset-0 z-0">
        <HlsVideo
          src={CTA_HLS}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[200px] video-fade-top" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[200px] video-fade-bottom" aria-hidden />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-28 lg:px-8 text-center">
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading italic text-white leading-[0.85] mb-6">
          {ctaFooter.heading}
        </h2>
        <p className="text-white/60 font-body font-light text-sm md:text-base max-w-2xl mx-auto mb-10">
          {ctaFooter.sub}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          <button
            type="button"
            onClick={() => setEmailOpen(true)}
            className="liquid-glass-strong relative z-10 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium font-body text-white hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            {ctaFooter.primary}
            <ArrowUpRight className="size-4" strokeWidth={2} />
          </button>
          <a
            href="#projects"
            className="inline-flex items-center rounded-full bg-white text-black px-6 py-3 text-sm font-medium font-body hover:bg-white/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            {ctaFooter.secondary}
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <HoverPopover
            placement="top"
            trigger={
              <span
                tabIndex={0}
                className="liquid-glass rounded-full px-4 py-2 text-xs font-medium font-body text-white/90 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                {wechat.cta}
              </span>
            }
          >
            <div className="liquid-glass rounded-2xl p-3 w-52">
              <img
                src={wechatQR}
                alt={wechat.qrAlt}
                className="w-full h-auto rounded-xl block"
              />
              <p className="text-white/60 text-xs mt-2 text-center font-body">{wechat.hint}</p>
            </div>
          </HoverPopover>
          <a
            href={contact.githubHref}
            target="_blank"
            rel="noreferrer"
            className="liquid-glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium font-body text-white/90 hover:bg-white/5"
          >
            <IconGitHub className="size-4" />
            {contact.githubLabel}
          </a>
        </div>

        <footer className="mt-32 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-end gap-4 text-left w-full">
          <div className="flex gap-6 text-white/40 text-xs font-body">
            <span className="cursor-default">{ctaFooter.privacy}</span>
            <span className="cursor-default">{ctaFooter.terms}</span>
            <a href="#contact" className="hover:text-white/70 transition-colors">
              {ctaFooter.contact}
            </a>
          </div>
        </footer>
      </div>

      <EmailModal
        isOpen={emailOpen}
        onClose={() => setEmailOpen(false)}
        email={contact.email}
      />
    </section>
  )
}
