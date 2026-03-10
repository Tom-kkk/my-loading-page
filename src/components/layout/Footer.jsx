import { footer } from '../../data/site';

export default function Footer() {
  return (
    <footer className="mt-16 py-6 px-4 text-center text-slate-500 dark:text-slate-400 text-sm border-t border-slate-200/80 dark:border-slate-700">
      <p>{footer.text}</p>
    </footer>
  );
}
