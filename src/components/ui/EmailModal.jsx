/**
 * 邮箱弹窗：深色液态玻璃风格
 */
import { useEffect, useRef, useCallback, useState } from 'react'
import { IconX, IconClipboardCopy, IconEnvelope } from '../icons'
import { useSiteContent } from '@/contexts/LocaleContext'

export default function EmailModal({ isOpen, onClose, email }) {
  const { emailModal: em } = useSiteContent()
  const overlayRef = useRef(null)
  const panelRef = useRef(null)
  const closeBtnRef = useRef(null)
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    if (!email) return
    navigator.clipboard?.writeText(email).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {})
  }, [email])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) {
      setCopied(false)
      return
    }
    const previouslyFocused = document.activeElement
    closeBtnRef.current?.focus()
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
      previouslyFocused?.focus?.()
    }
  }, [isOpen, handleKeyDown])

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose()
  }

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="email-modal-title"
      aria-describedby="email-modal-desc"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity duration-200"
      onClick={handleOverlayClick}
    >
      <div
        ref={panelRef}
        className="liquid-glass-strong relative w-full max-w-md rounded-3xl p-6 sm:p-8 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          id="email-modal-title"
          className="font-heading italic text-2xl sm:text-3xl text-white mb-2"
        >
          {em.title}
        </h3>
        <p id="email-modal-desc" className="text-white/60 font-body text-sm mb-4">
          {em.desc}
        </p>
        <div className="liquid-glass rounded-2xl px-4 py-3 mb-5">
          <span className="font-mono text-white/90 text-base select-all break-all">
            {email}
          </span>
        </div>
        <div className="flex flex-wrap gap-3 justify-end">
          <button
            type="button"
            onClick={handleCopy}
            className="liquid-glass inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium font-body text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <IconClipboardCopy className="w-5 h-5 shrink-0" />
            {copied ? em.copied : em.copy}
          </button>
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center gap-2 rounded-full bg-white text-black px-4 py-2.5 text-sm font-medium font-body hover:bg-white/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <IconEnvelope className="w-5 h-5 shrink-0" />
            {em.openMail}
          </a>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full liquid-glass p-2.5 text-white/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            aria-label={em.closeLabel}
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
