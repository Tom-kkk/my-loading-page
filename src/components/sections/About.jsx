import ClayCard from '../ui/ClayCard';
import { IconUser } from '../icons';
import { about } from '../../data/site';

export default function About() {
  return (
    <section
      id="about"
      className="mb-16 sm:mb-24 scroll-mt-24"
      aria-labelledby="about-heading"
    >
      <h2
        id="about-heading"
        className="font-caveat text-3xl sm:text-4xl font-bold text-slate-900 mb-8"
      >
        个人简介
      </h2>
      <ClayCard theme="sky" className="p-6 sm:p-10">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div
            className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-[3px] border-sky-300 bg-white shadow-clay-inset flex items-center justify-center"
            aria-hidden
          >
            <IconUser className="w-12 h-12 sm:w-14 sm:h-14 text-sky-500" />
          </div>
          <div>
            <p className="text-slate-700 text-base sm:text-lg leading-relaxed mb-4">
              {about.intro}
            </p>
            <p className="text-slate-600 text-sm sm:text-base">{about.skills}</p>
          </div>
        </div>
      </ClayCard>
    </section>
  );
}
