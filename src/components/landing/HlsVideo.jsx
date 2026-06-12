import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

export default function HlsVideo({ src, desaturate = false, className = '', videoClassName = '' }) {
  const videoRef = useRef(null)
  const hlsRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !src) return undefined

    const tryPlay = () => {
      const p = video.play()
      if (p && typeof p.then === 'function') p.catch(() => {})
    }

    let cancelled = false

    const setup = async () => {
      const Hls = (await import('hls.js')).default
      if (cancelled) return

      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        })
        hls.loadSource(src)
        hls.attachMedia(video)
        hls.on(Hls.Events.MANIFEST_PARSED, tryPlay)
        hlsRef.current = hls
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src
        video.addEventListener('loadedmetadata', tryPlay, { once: true })
      }
    }

    setup()

    return () => {
      cancelled = true
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
      video.removeEventListener('loadedmetadata', tryPlay)
    }
  }, [src])

  const filterStyle = desaturate ? { filter: 'saturate(0)' } : undefined

  return (
    <video
      ref={videoRef}
      className={cn(videoClassName, className)}
      style={filterStyle}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden
    />
  )
}
