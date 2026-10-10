import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useMarketplace } from '../../context/MarketplaceContext';
import { formatCentsToBRL, calculateDiscountPercent, calculateSavingsInCents } from '../../utils/currency';
import { formatTime, formatDateBr } from '../../utils/date';
import { UrgencyBanner } from '../../components/common/UrgencyBanner';

export const ServiceDetailPage: React.FC = () => {
  const { slotId } = useParams<{ slotId: string }>();
  const navigate = useNavigate();
  const { getHorario, getEstabelecimento, getServico, horarios } = useMarketplace();

  const currentHorario = getHorario(slotId || '');
  const estabelecimento = currentHorario ? getEstabelecimento(currentHorario.estabelecimentoId) : undefined;
  const servico = currentHorario ? getServico(currentHorario.servicoId) : undefined;

  const [selectedSlotId, setSelectedSlotId] = useState<string>(slotId || '');

  if (!currentHorario || !estabelecimento || !servico) {
    return (
      <div className="max-w-[1440px] mx-auto px-gutter py-16 text-center">
        <h2 className="text-xl font-bold text-on-surface mb-2">Vaga não encontrada</h2>
        <p className="text-sm text-on-surface-variant mb-6">
          O horário selecionado pode ter sido reservado ou expirado.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:bg-primary-container transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Voltar para Explorar
        </Link>
      </div>
    );
  }

  // Outros horários vagos no mesmo salão hoje
  const siblingSlots = horarios.filter(
    (h) => h.estabelecimentoId === estabelecimento.id && h.status === 'disponivel'
  );

  const activeHorario = getHorario(selectedSlotId) || currentHorario;
  const activeServico = getServico(activeHorario.servicoId) || servico;

  const discountPercent = calculateDiscountPercent(
    activeHorario.precoNormalEmCentavos,
    activeHorario.precoPromocionalInicialEmCentavos
  );
  const savingsCents = calculateSavingsInCents(
    activeHorario.precoNormalEmCentavos,
    activeHorario.precoPromocionalInicialEmCentavos
  );

  return (
    <div className="w-full max-w-[1440px] mx-auto px-gutter pt-space-md pb-space-xl">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-on-surface-variant mb-4">
        <Link to="/" className="hover:text-primary transition-colors">Explorar</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="capitalize">{estabelecimento.categoria}</span>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-on-surface font-medium truncate max-w-xs">{activeServico.nome}</span>
      </nav>

      {/* Main Grid: Content (8 cols) + Sticky Booking Card (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Gallery & Service Narrative */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Header */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary uppercase tracking-wider">
                {estabelecimento.categoria}
              </span>
              <div className="flex items-center gap-1 text-xs font-semibold text-on-surface">
                <span className="material-symbols-outlined text-[16px] text-amber-500 fill-1">star</span>
                <span>{estabelecimento.nota.toFixed(1)}</span>
                <span className="text-on-surface-variant font-normal">
                  ({estabelecimento.totalAvaliacoes} avaliações no local)
                </span>
              </div>
            </div>

            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-on-surface">
              {activeServico.nome}
            </h1>

            <p className="text-sm text-on-surface-variant flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-primary">storefront</span>
              <strong className="text-on-surface font-semibold">{estabelecimento.nome}</strong>
              <span>— {estabelecimento.endereco.logradouro}, {estabelecimento.endereco.bairro}</span>
            </p>
          </div>

          {/* Photo Gallery */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-2xl overflow-hidden">
            <div className="sm:col-span-2 aspect-[16/10] overflow-hidden rounded-xl bg-surface-container">
              <img
                src={estabelecimento.fotos[0]}
                alt={estabelecimento.nome}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-3">
              <div className="aspect-[16/10] overflow-hidden rounded-xl bg-surface-container">
                <img
                  src={estabelecimento.fotos[1] || estabelecimento.fotos[0]}
                  alt="Ambiente"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-[16/10] overflow-hidden rounded-xl bg-surface-container flex items-center justify-center bg-surface-container-high p-4 text-center">
                <span className="text-xs font-medium text-on-surface-variant">
                  Ambiente esterilizado e climatizado com café cortesia
                </span>
              </div>
            </div>
          </div>

          {/* Service Description */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-sm flex flex-col gap-4">
            <h3 className="text-base font-semibold text-on-surface">
              Sobre o procedimento
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {activeServico.descricao || estabelecimento.descricao}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-surface-variant text-xs">
              <div>
                <span className="text-on-surface-variant block mb-1">Duração estimada</span>
                <span className="font-semibold text-on-surface flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-primary">timer</span>
                  {activeServico.duracaoMinutos} minutos
                </span>
              </div>
              <div>
                <span className="text-on-surface-variant block mb-1">Profissional</span>
                <span className="font-semibold text-on-surface flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-secondary">badge</span>
                  {activeHorario.profissionalNome}
                </span>
              </div>
              <div>
                <span className="text-on-surface-variant block mb-1">Cancelamento</span>
                <span className="font-semibold text-emerald-accent">
                  Grátis até 1h antes
                </span>
              </div>
            </div>
          </div>

          {/* Horários Vagos no Salão */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-on-surface">
                Escolha o horário de hoje
              </h3>
              <span className="text-xs text-secondary font-medium">
                Vagas confirmadas em tempo real
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {siblingSlots.map((slot) => {
                const isSelected = slot.id === selectedSlotId;
                const slotDiscount = calculateDiscountPercent(
                  slot.precoNormalEmCentavos,
                  slot.precoPromocionalInicialEmCentavos
                );
                return (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                        : 'border-outline-variant bg-surface hover:border-primary/40'
                    }`}
                  >
                    <span className="text-sm font-bold text-on-surface tabular-nums">
                      {formatTime(slot.dataHoraInicio)}
                    </span>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-surface-variant">
                      <span className="text-xs font-semibold text-primary tabular-nums">
                        {formatCentsToBRL(slot.precoPromocionalInicialEmCentavos)}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-accent">
                        -{slotDiscount}%
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Sticky Card: Summary & Checkout CTA */}
        <div className="lg:col-span-4 sticky top-24 flex flex-col gap-4">
          <UrgencyBanner label="Vaga Temporária" prefix="Segurando preço por" />

          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-lg flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-surface-variant">
              <div>
                <span className="text-xs text-on-surface-variant block">Data e hora</span>
                <span className="text-sm font-semibold text-on-surface">
                  {formatDateBr(activeHorario.dataHoraInicio)} às {formatTime(activeHorario.dataHoraInicio)}
                </span>
              </div>
              <span className="px-2 py-1 rounded-full bg-secondary-container/40 text-on-secondary-container text-xs font-bold tabular-nums">
                -{discountPercent}% OFF
              </span>
            </div>

            {/* Price Breakdown */}
            <div className="flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between text-on-surface-variant">
                <span>Preço regular no balcão:</span>
                <span className="line-through tabular-nums">{formatCentsToBRL(activeHorario.precoNormalEmCentavos)}</span>
              </div>
              <div className="flex items-center justify-between text-secondary font-medium">
                <span>Desconto LastMinute exclusivo:</span>
                <span className="tabular-nums">- {formatCentsToBRL(savingsCents)}</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-surface-variant text-base font-bold text-on-surface">
                <span>Total a pagar:</span>
                <span className="text-xl text-primary tabular-nums">
                  {formatCentsToBRL(activeHorario.precoPromocionalInicialEmCentavos)}
                </span>
              </div>
            </div>

            {/* Guarantee Note */}
            <div className="p-3 rounded-lg bg-surface-container-low text-xs text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
              <span>Garantia de atendimento sem fila de espera.</span>
            </div>

            {/* Checkout Action */}
            <button
              onClick={() => navigate(`/checkout/${activeHorario.id}`)}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <span>Continuar para Reserva</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
