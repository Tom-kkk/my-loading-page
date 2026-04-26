import {
  Navbar,
  Hero,
  StartSection,
  FeaturesChess,
  FeaturesGrid,
  ProjectsLuxury,
  Stats,
  CtaFooter,
} from '@/components/landing'

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <div className="bg-black">
          <StartSection />
          <FeaturesChess />
          <FeaturesGrid />
          <ProjectsLuxury />
          <Stats />
          <CtaFooter />
        </div>
      </div>
    </div>
  )
}
