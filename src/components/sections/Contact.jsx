import { useState } from 'react';
import ClayCard from '../ui/ClayCard';
import Button from '../ui/Button';
import { HoverPopover, EmailModal } from '../ui';
import { IconEnvelope, IconGitHub, IconChat } from '../icons';
import { contact } from '../../data/site';
import wechatQR from '../../assets/wechat.jpg';

export default function Contact() {
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  return (
    <section
      id="contact"
      className="scroll-mt-24"
      aria-labelledby="contact-heading"
    >
      <h2
        id="contact-heading"
        className="font-caveat text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-8"
      >
        联系我
      </h2>
      <ClayCard theme="amber-yellow" className="p-8 text-center" hover={false}>
        <p className="text-slate-600 dark:text-slate-300 mb-6">{contact.copy}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            variant="primary"
            icon={IconEnvelope}
            className="!px-5 !py-2.5 !border-secondary !bg-secondary hover:!bg-orange-600 focus:!ring-secondary"
            onClick={() => setEmailModalOpen(true)}
          >
            {contact.emailLabel}
          </Button>
          <HoverPopover
            placement="top"
            trigger={
              <span
                tabIndex={0}
                className="inline-flex items-center gap-2 rounded-2xl border-[3px] border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-5 py-2.5 font-medium cursor-pointer transition-all duration-200 hover:shadow-clay-hover dark:hover:shadow-none hover:border-emerald-400 dark:hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
              >
                <IconChat className="w-5 h-5 shrink-0" />
                加微信
              </span>
            }
          >
            <div className="w-52">
              <img
                src={wechatQR}
                alt="微信二维码，扫码加好友"
                className="w-full h-auto rounded-xl border-2 border-amber-200/80 dark:border-slate-600 block"
              />
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 text-center">
                扫码加我为好友
              </p>
            </div>
          </HoverPopover>
          <a
            href={contact.githubHref}
            className="inline-flex items-center gap-2 rounded-2xl border-[3px] border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-5 py-2.5 font-medium cursor-pointer transition-all duration-200 hover:shadow-clay-hover dark:hover:shadow-none hover:border-sky-400 dark:hover:border-sky-500 hover:text-sky-600 dark:hover:text-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
          >
            <IconGitHub className="w-5 h-5 shrink-0" />
            {contact.githubLabel}
          </a>
        </div>
      </ClayCard>
      <EmailModal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        email={contact.email}
      />
    </section>
  );
}
