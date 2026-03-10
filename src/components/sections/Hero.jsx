import Button from '../ui/Button';
import ClayCard from '../ui/ClayCard';
import { IconBriefcase, IconEnvelope } from '../icons';
import { hero } from '../../data/site';

export default function Hero() {
  return (
    <section
      id="home"
      className="mb-16 sm:mb-24 scroll-mt-24"
      aria-labelledby="hero-heading"
    >
      <ClayCard theme="amber" className="p-8 sm:p-12 text-center" hover={false}>
        <h1
          id="hero-heading"
          className="font-caveat text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-2"
        >
          {hero.title}
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-6">{hero.subtitle}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button href="#projects" variant="primary" icon={IconBriefcase}>
            看看项目
          </Button>
          <Button href="#contact" variant="secondary" icon={IconEnvelope}>
            联系我
          </Button>
        </div>
      </ClayCard>
    </section>
  );
}
