/**
 * 悬浮展示组件：鼠标悬停或聚焦时显示内容，与页面黏土风格一致
 * 用于联系区微信二维码等悬浮展示场景
 */
import { useState, useRef, useId, cloneElement, isValidElement } from 'react';

const HIDE_DELAY_MS = 150;

export default function HoverPopover({
  trigger,
  children,
  placement = 'top',
  className = '',
}) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef(null);
  const id = useId();
  const panelId = `hover-popover-${id.replace(/:/g, '')}`;

  const show = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setVisible(true);
  };

  const hide = () => {
    timeoutRef.current = setTimeout(() => setVisible(false), HIDE_DELAY_MS);
  };

  const cancelHide = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const placementClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-3',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-3',
    left: 'right-full top-1/2 -translate-y-1/2 mr-3',
    right: 'left-full top-1/2 -translate-y-1/2 ml-3',
  };

  const triggerEl =
    isValidElement(trigger)
      ? cloneElement(trigger, {
          onFocus: show,
          onBlur: hide,
          'aria-expanded': visible,
          'aria-haspopup': 'true',
          'aria-describedby': visible ? panelId : undefined,
        })
      : trigger;

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <div className="inline-flex cursor-pointer">{triggerEl}</div>
      <div
        id={panelId}
        role="tooltip"
        className={`absolute z-50 rounded-[20px] border-4 border-amber-200 dark:border-slate-600 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-slate-800 dark:to-slate-700 p-4 shadow-clay dark:shadow-none dark:ring-1 dark:ring-slate-600 transition-all duration-200 ${placementClasses[placement]} ${visible ? 'pointer-events-auto opacity-100 scale-100' : 'pointer-events-none opacity-0 scale-95'}`}
        onMouseEnter={cancelHide}
        onMouseLeave={hide}
      >
        {children}
      </div>
    </div>
  );
}
