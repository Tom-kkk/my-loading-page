import ClayCard from '../ui/ClayCard';
import { about } from '../../data/site';
import logoImg from '../../assets/logo.jpg';

export default function About() {
  return (
    <section
      id="about"
      className="mb-16 sm:mb-24 scroll-mt-24"
      aria-labelledby="about-heading"
    >
      <h2
        id="about-heading"
        className="font-caveat text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-8"
      >
        个人简介
      </h2>
      <ClayCard theme="sky" className="p-6 sm:p-10">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div
            className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-[3px] border-sky-300 dark:border-sky-600 bg-white dark:bg-slate-700 shadow-clay-inset dark:shadow-none overflow-hidden"
            aria-hidden
          >
            <img
              src={logoImg}
              alt="个人头像"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-slate-700 dark:text-slate-200 text-base sm:text-lg leading-relaxed mb-4">
              {about.intro}
            </p>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">{about.skills}</p>
          </div>
        </div>
      </ClayCard>
    </section>
  );
}
