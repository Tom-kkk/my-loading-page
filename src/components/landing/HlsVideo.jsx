import { useEffect, useRef } from 'react'
import Hls from 'hls.js'
import { cn } from '@/lib/utils'

export default function HlsVideo({ src, desaturate = false, className = '', videoClassName = '' }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !src) return undefined

    const tryPlay = () => {
      const p = video.play()
      if (p && typeof p.then === 'function') p.catch(() => {})
    }

    let hls
    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      })
      hls.loadSource(src)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, tryPlay)
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src
      video.addEventListener('loadedmetadata', tryPlay, { once: true })
    }

    return () => {
      if (hls) hls.destroy()
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
