import { IconBook, IconImage, IconBolt, IconArrowTopRight } from '../icons';

const iconMap = {
  book: IconBook,
  image: IconImage,
  bolt: IconBolt,
};

const themeConfig = {
  rose: {
    card: 'border-rose-200 bg-gradient-to-br from-rose-50 to-pink-50',
    iconBox: 'border-rose-300 text-rose-500',
    link: 'text-primary hover:text-rose-600 focus-within:ring-primary',
  },
  violet: {
    card: 'border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50',
    iconBox: 'border-violet-300 text-violet-500',
    link: 'text-accent hover:text-violet-600 focus-within:ring-accent',
  },
  emerald: {
    card: 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50',
    iconBox: 'border-emerald-300 text-emerald-500',
    link: 'text-mint hover:text-emerald-600 focus-within:ring-mint',
  },
};

export default function ProjectCard({ title, description, href, theme, icon }) {
  const Icon = iconMap[icon] ?? IconBook;
  const config = themeConfig[theme] ?? themeConfig.rose;

  return (
    <article
      className={`group rounded-[20px] border-4 ${config.card} p-6 shadow-clay transition-all duration-200 hover:shadow-clay-hover cursor-pointer focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2`}
    >
      <div
        className={`w-12 h-12 rounded-xl border-[3px] bg-white shadow-clay-inset flex items-center justify-center mb-4 ${config.iconBox}`}
        aria-hidden
      >
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-caveat text-xl font-semibold text-slate-900 mb-2">
        {title}
      </h3>
      <p className="text-slate-600 text-sm mb-4">{description}</p>
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
