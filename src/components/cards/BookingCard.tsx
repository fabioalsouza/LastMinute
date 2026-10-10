import React from 'react';
import { Reserva, Estabelecimento, Servico, HorarioPublicado } from '../../types';
import { formatCentsToBRL } from '../../utils/currency';
import { formatTime, formatDateBr } from '../../utils/date';
import { StatusBadge } from '../common/StatusBadge';

interface BookingCardProps {
  reserva: Reserva;
  estabelecimento?: Estabelecimento;
  servico?: Servico;
  horario?: HorarioPublicado;
  onViewVoucher: (reserva: Reserva) => void;
  onCancel: (reservaId: string) => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  reserva,
  estabelecimento,
  servico,
  horario,
  onViewVoucher,
  onCancel
}) => {
  const isCanceled = reserva.status.startsWith('cancelada');

  return (
    <div className="rounded-xl bg-surface-container-lowest p-5 border border-outline-variant shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      
      {/* Informações da Reserva */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-primary tabular-nums">
            {reserva.codigoConfirmacao}
          </span>
          <StatusBadge
            type="status"
            label={isCanceled ? 'Cancelada' : 'Confirmada'}
            statusType={reserva.status}
          />
        </div>

        <h4 className="text-base font-semibold text-on-surface">
          {servico?.nome || 'Serviço agendado'}
        </h4>

        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-on-surface-variant">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-primary">storefront</span>
            {estabelecimento?.nome || 'Estabelecimento parceiro'}
          </span>
          {horario && (
            <span className="flex items-center gap-1 font-medium text-on-surface">
              <span className="material-symbols-outlined text-[16px] text-secondary">calendar_today</span>
              {formatDateBr(horario.dataHoraInicio)} às {formatTime(horario.dataHoraInicio)}
            </span>
          )}
          <span>
            {estabelecimento?.endereco.bairro}
          </span>
        </div>
      </div>

      {/* Preço e Botões de Ação */}
      <div className="flex flex-row md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-surface-variant gap-3">
        <div className="text-left md:text-right">
          <span className="text-[11px] text-on-surface-variant block">Valor pago</span>
          <span className="text-base font-bold text-primary tabular-nums">
            {formatCentsToBRL(reserva.precoConfirmadoEmCentavos)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewVoucher(reserva)}
            className="h-9 px-3.5 rounded-lg border border-primary text-primary hover:bg-primary/5 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">receipt_long</span>
            <span>Voucher</span>
          </button>

          {!isCanceled && (
            <button
              onClick={() => onCancel(reserva.id)}
              className="h-9 px-3 rounded-lg border border-error/30 text-error hover:bg-error/5 text-xs font-semibold transition-colors"
              title="Cancelar agendamento"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
