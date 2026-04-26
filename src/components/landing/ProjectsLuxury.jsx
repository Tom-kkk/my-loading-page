import { ArrowUpRight } from 'lucide-react'
import { useSiteContent } from '@/contexts/LocaleContext'

export default function ProjectsLuxury() {
  const { projects, projectsSection, projectCard } = useSiteContent()
  const { badge, heading } = projectsSection
  return (
    <section id="projects" className="bg-black py-24 px-6 lg:px-16 scroll-mt-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center max-w-3xl mx-auto">
          <div className="liquid-glass mb-6 inline-flex rounded-full px-3.5 py-1 text-xs font-medium text-white font-body">
            {badge}
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9]">
            {heading}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <article key={p.id} className="liquid-glass rounded-2xl p-6 flex flex-col h-full">
              <h3 className="text-xl font-heading italic text-white mb-3 leading-snug">
                {p.title}
              </h3>
              <p className="text-white/60 font-body font-light text-sm md:text-base leading-relaxed flex-1 mb-6">
                {p.description}
              </p>
              <a
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className="liquid-glass-strong relative z-10 inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-medium font-body text-white hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                {projectCard.cta}
                <ArrowUpRight className="size-4" strokeWidth={2} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
