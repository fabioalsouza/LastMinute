import React from 'react';
import { HorarioStatus, ReservaStatus } from '../../types';

interface StatusBadgeProps {
  type: 'discount' | 'status' | 'category' | 'demo';
  label: string;
  statusType?: HorarioStatus | ReservaStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, label, statusType }) => {
  if (type === 'discount') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-accent/15 text-primary border border-emerald-accent/30 tabular-nums">
        {label}
      </span>
    );
  }

  if (type === 'demo') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-urgency/15 text-tertiary border border-amber-urgency/30">
        Demo
      </span>
    );
  }

  if (type === 'category') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-surface-container-high text-on-surface-variant border border-outline-variant uppercase tracking-wider">
        {label}
      </span>
    );
  }

  // Status de agendamento ou horário
  let style = 'bg-surface-container-high text-on-surface-variant border-outline-variant';

  if (statusType === 'disponivel' || statusType === 'confirmada') {
    style = 'bg-secondary-container/40 text-on-secondary-container border-secondary/30';
  } else if (statusType === 'bloqueado') {
    style = 'bg-tertiary-fixed/40 text-on-tertiary-fixed border-tertiary/30';
  } else if (statusType === 'reservado' || statusType === 'concluida') {
    style = 'bg-primary/10 text-primary border-primary/20';
  } else if (
    statusType === 'cancelada_pelo_cliente' ||
    statusType === 'cancelada_pelo_estabelecimento' ||
    statusType === 'cancelado' ||
    statusType === 'expirado'
  ) {
    style = 'bg-error-container/40 text-on-error-container border-error/30';
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      <span>{label}</span>
    </span>
  );
};
