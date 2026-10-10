import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { OfertaCompleta } from '../../types';
import { formatCentsToBRL } from '../../utils/currency';
import { formatTime } from '../../utils/date';
import { formatDistance } from '../../utils/distance';
import { calcularFlashDrop } from '../../utils/flashDrop';

interface SlotCardProps {
  oferta: OfertaCompleta;
}

export const SlotCard: React.FC<SlotCardProps> = ({ oferta }) => {
  const { horario, servico, estabelecimento, distanciaKm } = oferta;

  const [flashState, setFlashState] = useState(() => calcularFlashDrop(horario));

  // Atualiza Flash Drop a cada 60 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setFlashState(calcularFlashDrop(horario));
    }, 60_000);
    return () => clearInterval(interval);
  }, [horario]);

  const { precoAtualEmCentavos, descontoAtualPercent, isFlashActive, minutosRestantes, urgencyLevel } = flashState;

  const urgencyColors = {
    normal: 'bg-primary text-on-primary',
    soon: 'bg-amber-500 text-white',
    critical: 'bg-red-500 text-white animate-pulse',
  };

  return (
    <div className="group rounded-2xl bg-surface-container-lowest p-4 border border-outline-variant shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between">

      <div>
        {/* Photo Container */}
        <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-surface-container mb-3 border border-outline-variant/50">
          <img
            src={estabelecimento.fotos[0]}
            alt={estabelecimento.nome}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Flash Drop Badge or Discount Pill */}
          {isFlashActive ? (
            <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1">
              <div className="px-2.5 py-1 rounded-full bg-red-500 text-white text-xs font-bold shadow-md tabular-nums animate-pulse flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">bolt</span>
                Flash -{descontoAtualPercent}%
              </div>
              {minutosRestantes <= 60 && (
                <div className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-[10px] text-white font-medium">
                  {minutosRestantes < 60
                    ? `${minutosRestantes} min para começar`
                    : `${Math.floor(minutosRestantes / 60)}h restantes`}
                </div>
              )}
            </div>
          ) : (
            <div className={`absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full ${urgencyColors[urgencyLevel]} text-xs font-semibold shadow-md tabular-nums`}>
              -{descontoAtualPercent}%
            </div>
          )}

          {/* Distance Badge */}
          {distanciaKm !== undefined && (
            <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-[11px] font-medium text-on-surface flex items-center gap-1 shadow-sm">
              <span className="material-symbols-outlined text-[14px] text-secondary">near_me</span>
              <span>{formatDistance(distanciaKm)}</span>
            </div>
          )}

          {/* Urgency Overlay when critical */}
          {urgencyLevel === 'critical' && (
            <div className="absolute inset-0 border-2 border-red-500/60 rounded-xl pointer-events-none" />
          )}
        </div>

        {/* Rating & Category */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
            {estabelecimento.categoria}
          </span>
          <div className="flex items-center gap-1 text-xs font-semibold text-on-surface">
            <span className="material-symbols-outlined text-[14px] text-amber-500 fill-1">star</span>
            <span>{estabelecimento.nota.toFixed(1)}</span>
            <span className="text-[11px] text-on-surface-variant font-normal">
              ({estabelecimento.totalAvaliacoes})
            </span>
          </div>
        </div>

        {/* Venue Title & Neighborhood */}
        <h3 className="font-semibold text-base text-on-surface line-clamp-1 leading-snug">
          {estabelecimento.nome}
        </h3>
        <p className="text-xs text-on-surface-variant mb-3 line-clamp-1">
          {estabelecimento.endereco.bairro}, {estabelecimento.endereco.cidade}
        </p>

        {/* Service Name & Duration */}
        <div className="p-2.5 rounded-lg bg-surface-container-low mb-3 border border-surface-variant">
          <div className="flex items-center justify-between gap-1 text-xs">
            <span className="font-medium text-on-surface line-clamp-1">
              {servico.nome}
            </span>
            <span className="text-[11px] text-on-surface-variant whitespace-nowrap">
              {servico.duracaoMinutos} min
            </span>
          </div>
        </div>
      </div>

      {/* Footer: Time & Pricing */}
      <div>
        <div className="flex items-end justify-between pt-2 border-t border-surface-variant gap-2">

          {/* Slot Time */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant text-xs font-semibold text-primary">
            <span className="material-symbols-outlined text-[16px]">schedule</span>
            <span className="tabular-nums">{formatTime(horario.dataHoraInicio)}</span>
          </div>

          {/* Prices */}
          <div className="flex flex-col text-right">
            <span className="text-xs text-outline line-through tabular-nums leading-none mb-0.5">
              {formatCentsToBRL(horario.precoNormalEmCentavos)}
            </span>
            <span className={`text-lg font-bold tabular-nums leading-tight ${isFlashActive ? 'text-red-500' : 'text-primary'}`}>
              {formatCentsToBRL(precoAtualEmCentavos)}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={`/servico/${horario.id}`}
          className={`mt-3 w-full h-10 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm ${
            isFlashActive
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-primary hover:bg-primary-container text-on-primary'
          }`}
        >
          {isFlashActive && <span className="material-symbols-outlined text-[14px]">bolt</span>}
          <span>{isFlashActive ? 'Pegar Flash Drop!' : 'Ver vaga'}</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      </div>

    </div>
  );
};
