import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'

const MotionSpan = motion.span

/**
 * @param {'word' | 'char'} splitBy
 * @param {'bottom'} direction
 */
export default function BlurText({
  text,
  splitBy = 'word',
  className = '',
  staggerDelay = 0.2,
  stepDuration = 0.35,
  rootMargin = '0px',
  threshold = 0.2,
}) {
  const containerRef = useRef(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return undefined

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true)
          obs.disconnect()
        }
      },
      { rootMargin, threshold },
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [rootMargin, threshold])

  const elements =
    splitBy === 'char'
      ? Array.from(text)
      : text.split(/(\s+)/).filter((t) => t.length > 0)

  const isWord = splitBy === 'word'

  return (
    <span ref={containerRef} className={className} aria-label={text}>
      {elements.map((chunk, index) => {
        const key = `${splitBy}-${index}-${chunk}`
        const isSpace = isWord && /^\s+$/.test(chunk)
        if (isSpace) {
          return <span key={key}>{chunk}</span>
        }

        return (
          <MotionSpan
            key={key}
            className="inline-block"
            initial={
              active
                ? false
                : { filter: 'blur(10px)', opacity: 0, y: 50 }
            }
            animate={
              active
                ? {
                    filter: ['blur(10px)', 'blur(5px)', 'blur(0px)'],
                    opacity: [0, 0.5, 1],
                    y: [50, -5, 0],
                  }
                : { filter: 'blur(10px)', opacity: 0, y: 50 }
            }
            transition={{
              duration: stepDuration * 3,
              times: [0, 0.45, 1],
              delay: index * staggerDelay,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {chunk}
          </MotionSpan>
        )
      })}
    </span>
  )
}
