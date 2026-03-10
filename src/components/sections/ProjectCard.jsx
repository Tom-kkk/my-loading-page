import { IconBook, IconImage, IconBolt, IconArrowTopRight } from '../icons';

const iconMap = {
  book: IconBook,
  image: IconImage,
  bolt: IconBolt,
};

const themeConfig = {
  rose: {
    card: 'border-rose-200 dark:border-rose-800 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-slate-800 dark:to-slate-700 shadow-clay dark:shadow-none dark:ring-1 dark:ring-slate-600/50',
    iconBox: 'border-rose-300 dark:border-rose-700 text-rose-500 dark:text-rose-400',
    link: 'text-primary dark:text-rose-300 hover:text-rose-600 dark:hover:text-rose-200 focus-within:ring-primary',
  },
  violet: {
    card: 'border-violet-200 dark:border-violet-800 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 shadow-clay dark:shadow-none dark:ring-1 dark:ring-slate-600/50',
    iconBox: 'border-violet-300 dark:border-violet-700 text-violet-500 dark:text-violet-400',
    link: 'text-accent dark:text-violet-300 hover:text-violet-600 dark:hover:text-violet-200 focus-within:ring-accent',
  },
  emerald: {
    card: 'border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-700 shadow-clay dark:shadow-none dark:ring-1 dark:ring-slate-600/50',
    iconBox: 'border-emerald-300 dark:border-emerald-700 text-emerald-500 dark:text-emerald-400',
    link: 'text-mint dark:text-emerald-300 hover:text-emerald-600 dark:hover:text-emerald-200 focus-within:ring-mint',
  },
};

export default function ProjectCard({ title, description, href, theme, icon }) {
  const Icon = iconMap[icon] ?? IconBook;
  const config = themeConfig[theme] ?? themeConfig.rose;

  return (
    <article
      className={`group rounded-[20px] border-4 ${config.card} p-6 transition-all duration-200 hover:shadow-clay-hover dark:hover:ring-slate-500 cursor-pointer focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-800`}
    >
      <div
        className={`w-12 h-12 rounded-xl border-[3px] bg-white dark:bg-slate-700 shadow-clay-inset dark:shadow-none flex items-center justify-center mb-4 ${config.iconBox}`}
        aria-hidden
      >
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-caveat text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">{description}</p>
      <a
        href={href}
        className={`inline-flex items-center gap-1 font-medium text-sm transition-colors duration-200 focus:outline-none focus:underline cursor-pointer ${config.link}`}
      >
        查看项目
        <IconArrowTopRight className="w-4 h-4 shrink-0" />
      </a>
    </article>
  );
}
