/**
 * 邮箱弹窗：黏土风格，与 ClayCard / HoverPopover 一致
 * 展示邮箱地址，支持复制、打开邮件客户端、关闭
 */
import { useEffect, useRef, useCallback, useState } from 'react';
import { IconX, IconClipboardCopy, IconEnvelope } from '../icons';

export default function EmailModal({ isOpen, onClose, email }) {
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const closeBtnRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (!email) return;
    navigator.clipboard?.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  }, [email]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) {
      setCopied(false);
      return;
    }
    const previouslyFocused = document.activeElement;
    closeBtnRef.current?.focus();
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [isOpen, handleKeyDown]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="email-modal-title"
      aria-describedby="email-modal-desc"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 transition-opacity duration-200"
      onClick={handleOverlayClick}
    >
      <div
        ref={panelRef}
        className="relative w-full max-w-md rounded-[20px] border-4 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-6 shadow-clay transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          id="email-modal-title"
          className="font-caveat text-2xl sm:text-3xl font-bold text-slate-900 mb-2"
        >
          我的邮箱
        </h3>
        <p id="email-modal-desc" className="text-slate-600 text-sm mb-4">
          复制下方地址或点击「打开邮箱」直接发信
        </p>
        <div className="rounded-xl border-2 border-amber-200/80 bg-white/90 px-4 py-3 mb-5">
          <span className="font-mono text-slate-800 text-base select-all break-all">
            {email}
          </span>
        </div>
        <div className="flex flex-wrap gap-3 justify-end">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-2xl border-[3px] border-slate-300 bg-white text-slate-700 px-4 py-2.5 font-medium cursor-pointer transition-all duration-200 hover:shadow-clay-hover hover:border-amber-400 hover:text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
          >
            <IconClipboardCopy className="w-5 h-5 shrink-0" />
            {copied ? '已复制' : '复制'}
          </button>
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center gap-2 rounded-2xl border-[3px] border-secondary bg-secondary text-white px-4 py-2.5 font-medium cursor-pointer transition-all duration-200 hover:shadow-clay-hover hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
          >
            <IconEnvelope className="w-5 h-5 shrink-0" />
            打开邮箱
          </a>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-2xl border-[3px] border-slate-300 bg-white text-slate-600 p-2.5 cursor-pointer transition-all duration-200 hover:shadow-clay-hover hover:border-slate-400 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            aria-label="关闭弹窗"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
