import ClayCard from '../ui/ClayCard';
import Button from '../ui/Button';
import { HoverPopover } from '../ui';
import { IconEnvelope, IconGitHub, IconChat } from '../icons';
import { contact } from '../../data/site';
import wechatQR from '../../assets/wechat.jpg';

export default function Contact() {
  return (
    <section
      id="contact"
      className="scroll-mt-24"
      aria-labelledby="contact-heading"
    >
      <h2
        id="contact-heading"
        className="font-caveat text-3xl sm:text-4xl font-bold text-slate-900 mb-8"
      >
        联系我
      </h2>
      <ClayCard theme="amber-yellow" className="p-8 text-center" hover={false}>
        <p className="text-slate-600 mb-6">{contact.copy}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            href={`mailto:${contact.email}`}
            variant="primary"
            icon={IconEnvelope}
            className="!px-5 !py-2.5 !border-secondary !bg-secondary hover:!bg-orange-600 focus:!ring-secondary"
          >
            {contact.emailLabel}
          </Button>
          <HoverPopover
            placement="top"
            trigger={
              <span
                tabIndex={0}
                className="inline-flex items-center gap-2 rounded-2xl border-[3px] border-slate-300 bg-white text-slate-700 px-5 py-2.5 font-medium cursor-pointer transition-all duration-200 hover:shadow-clay-hover hover:border-emerald-400 hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
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
                className="w-full h-auto rounded-xl border-2 border-amber-200/80 block"
              />
              <p className="text-slate-600 text-sm mt-2 text-center">
                扫码加我为好友
              </p>
            </div>
          </HoverPopover>
          <a
            href={contact.githubHref}
            className="inline-flex items-center gap-2 rounded-2xl border-[3px] border-slate-300 bg-white text-slate-700 px-5 py-2.5 font-medium cursor-pointer transition-all duration-200 hover:shadow-clay-hover hover:border-sky-400 hover:text-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
          >
            <IconGitHub className="w-5 h-5 shrink-0" />
            {contact.githubLabel}
          </a>
        </div>
      </ClayCard>
    </section>
  );
}
