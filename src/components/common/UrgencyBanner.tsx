import React, { useState, useEffect } from 'react';
import { formatCountdown } from '../../utils/date';

interface UrgencyBannerProps {
  initialSeconds?: number;
  label?: string;
  prefix?: string;
}

export const UrgencyBanner: React.FC<UrgencyBannerProps> = ({
  initialSeconds = 872, // 14 min 32 seg
  label = 'Janela prioritária',
  prefix = 'Segurando vagas ativas por'
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-space-sm px-space-md py-space-sm rounded-lg bg-tertiary-fixed/30 text-on-tertiary-fixed shadow-sm border border-tertiary-fixed/40">
      <div className="relative flex items-center justify-center">
        <span className="material-symbols-outlined text-tertiary text-xl">schedule</span>
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-urgency animate-ping"></span>
      </div>
      <div className="flex flex-col text-left">
        <span className="text-[11px] font-semibold text-tertiary uppercase tracking-wider">
          {label}
        </span>
        <span className="text-xs font-medium text-on-tertiary-fixed tabular-nums">
          {prefix} <strong className="font-semibold">{formatCountdown(seconds)} min</strong>
        </span>
      </div>
    </div>
  );
};
