import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMarketplace } from '../../context/MarketplaceContext';
import { formatCentsToBRL, parseBRLInputToCents, calculateDiscountPercent } from '../../utils/currency';
import { InputField } from '../../components/common/InputField';

const TEMPLATES = [
  { label: '🔥 Urgente', discount: 50, timeAhead: 15, description: '50% OFF • Preencha em 15 min' },
  { label: '⚡ Flash', discount: 35, timeAhead: 45, description: '35% OFF • Meia hora de antecedência' },
  { label: '🎯 Padrão', discount: 30, timeAhead: 90, description: '30% OFF • Publicação normal' },
  { label: '💡 Suave', discount: 20, timeAhead: 120, description: '20% OFF • 2 horas de antecedência' },
] as const;

export const PublishSlotPage: React.FC = () => {
  const navigate = useNavigate();
  const { servicos, estabelecimentos, publicarHorario } = useMarketplace();

  const myVenue = estabelecimentos[0];
  const myServices = servicos.filter((s) => s.estabelecimentoId === myVenue.id);

  const [selectedServiceId, setSelectedServiceId] = useState(myServices[0]?.id || '');
  const [profissionalNome, setProfissionalNome] = useState('Matheus Costa');
  
  // Horário sugerido para daqui a 45 minutos
  const defaultTime = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() + 45);
    return d.toTimeString().slice(0, 5);
  };
  const [horaInicio, setHoraInicio] = useState(defaultTime());
  
  const selectedService = myServices.find((s) => s.id === selectedServiceId) || myServices[0];
  const normalPriceCents = selectedService?.precoNormalEmCentavos || 10000;

  // Preço promocional padrão com 35% de desconto
  const defaultPromoCents = Math.round(normalPriceCents * 0.65);
  const [precoPromocionalStr, setPrecoPromocionalStr] = useState(
    (defaultPromoCents / 100).toFixed(2).replace('.', ',')
  );

  const promoPriceCents = parseBRLInputToCents(precoPromocionalStr);
  const discountPercent = calculateDiscountPercent(normalPriceCents, promoPriceCents);

  // Configuração de Desconto Automático
  const [autoDiscountActive, setAutoDiscountActive] = useState(true);
  const [autoDiscountPercent, setAutoDiscountPercent] = useState(10);
  const [autoDiscountMinutes, setAutoDiscountMinutes] = useState(45);

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedServiceId(id);
    const srv = myServices.find((s) => s.id === id);
    if (srv) {
      const newPromo = Math.round(srv.precoNormalEmCentavos * 0.65);
      setPrecoPromocionalStr((newPromo / 100).toFixed(2).replace('.', ','));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || promoPriceCents <= 0) {
      alert('Por favor, defina um preço promocional válido.');
      return;
    }

    const [h, m] = horaInicio.split(':');
    const start = new Date();
    start.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);

    const end = new Date(start.getTime() + (selectedService.duracaoMinutos || 45) * 60000);

    publicarHorario({
      estabelecimentoId: myVenue.id,
      servicoId: selectedService.id,
      profissionalNome,
      dataHoraInicio: start.toISOString(),
      dataHoraFim: end.toISOString(),
      precoNormalEmCentavos: normalPriceCents,
      precoPromocionalInicialEmCentavos: promoPriceCents,
      descontoAutomatico: {
        ativado: autoDiscountActive,
        descontoAdicionalPercentual: autoDiscountPercent,
        minutosAntesDoInicio: autoDiscountMinutes
      }
    });

    navigate('/negocios/horarios');
  };

  return (
    <div className="w-full max-w-[800px] mx-auto px-gutter pt-space-lg pb-space-xl">
      
      {/* Top Header */}
      <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-4">
        <Link to="/negocios/dashboard" className="hover:text-primary transition-colors">Painel</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-on-surface font-medium">Publicar Horário</span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-on-surface">
            Publicar Horário Relâmpago
          </h1>
          <p className="text-sm text-on-surface-variant">
            Transforme uma vaga vazia em receita imediata.
          </p>
        </div>
      </div>

      {/* Quick Templates Section */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
          ⚡ Templates rápidos — clique para preencher automaticamente
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TEMPLATES.map((t) => {
            const promoCents = Math.round(normalPriceCents * (1 - t.discount / 100));
            const isActive =
              Math.abs(promoPriceCents - promoCents) < 100 &&
              horaInicio ===
                (() => {
                  const d = new Date();
                  d.setMinutes(d.getMinutes() + t.timeAhead);
                  return d.toTimeString().slice(0, 5);
                })();
            return (
              <button
                key={t.label}
                type="button"
                onClick={() => {
                  const promoValue = Math.round(normalPriceCents * (1 - t.discount / 100));
                  setPrecoPromocionalStr((promoValue / 100).toFixed(2).replace('.', ','));
                  const d = new Date();
                  d.setMinutes(d.getMinutes() + t.timeAhead);
                  setHoraInicio(d.toTimeString().slice(0, 5));
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isActive
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/15'
                    : 'border-outline-variant bg-surface-container-lowest hover:border-primary/40 hover:bg-surface-container-low'
                }`}
              >
                <span className="text-sm font-bold text-on-surface block">{t.label}</span>
                <span className="text-[11px] text-on-surface-variant">{t.description}</span>
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-md flex flex-col gap-6">
        
        {/* Service Selector */}
        <div className="flex flex-col gap-1.5 text-left">
          <label className="text-xs font-semibold text-on-surface">
            1. Selecione o serviço do seu catálogo
          </label>
          <select
            value={selectedServiceId}
            onChange={handleServiceChange}
            className="h-12 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3.5 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15 transition-all"
          >
            {myServices.map((srv) => (
              <option key={srv.id} value={srv.id}>
                {srv.nome} — {srv.duracaoMinutos} min — Tabela: {formatCentsToBRL(srv.precoNormalEmCentavos)}
              </option>
            ))}
          </select>
        </div>

        {/* Professional & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="Profissional responsável"
            value={profissionalNome}
            onChange={(e) => setProfissionalNome(e.target.value)}
            required
            icon="badge"
          />
          <InputField
            label="Horário de início (Hoje)"
            type="time"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)}
            required
            icon="schedule"
          />
        </div>

        {/* Pricing Strategy */}
        <div className="p-4 rounded-xl bg-surface-container-low border border-surface-variant flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-on-surface uppercase tracking-wider">
              Definição de Preço Promocional
            </span>
            <span className="text-xs text-on-surface-variant">
              Tabela: <strong className="line-through">{formatCentsToBRL(normalPriceCents)}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <InputField
              label="Preço promocional relâmpago (R$)"
              value={precoPromocionalStr}
              onChange={(e) => setPrecoPromocionalStr(e.target.value)}
              placeholder="85,00"
              required
              hint="Armazenado em centavos para exatidão"
            />

            <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-surface-container-lowest border border-outline-variant text-center">
              <span className="text-[11px] text-on-surface-variant">Desconto resultante</span>
              <span className="text-2xl font-bold text-primary tabular-nums">
                -{discountPercent}% OFF
              </span>
              <span className="text-[11px] text-secondary font-medium">
                Economia para o cliente: {formatCentsToBRL(normalPriceCents - promoPriceCents)}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Progressive Discount Rule */}
        <div className="p-4 rounded-xl border border-outline-variant bg-surface flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">trending_down</span>
              <span className="text-xs font-semibold text-on-surface">
                Desconto automático progressivo
              </span>
            </div>
            <input
              type="checkbox"
              checked={autoDiscountActive}
              onChange={(e) => setAutoDiscountActive(e.target.checked)}
              className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
            />
          </div>

          <p className="text-xs text-on-surface-variant leading-relaxed">
            Se faltar pouco tempo para o início e o horário ainda estiver vago, o sistema aumenta o desconto automaticamente para acelerar a conversão.
          </p>

          {autoDiscountActive && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-surface-variant">
              <InputField
                label="Desconto extra (%)"
                type="number"
                value={autoDiscountPercent}
                onChange={(e) => setAutoDiscountPercent(Number(e.target.value))}
                min={5}
                max={40}
              />
              <InputField
                label="Minutos antes do início"
                type="number"
                value={autoDiscountMinutes}
                onChange={(e) => setAutoDiscountMinutes(Number(e.target.value))}
                min={15}
                max={120}
              />
            </div>
          )}
        </div>

        {/* CTA Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            to="/negocios/dashboard"
            className="h-11 px-5 rounded-lg border border-outline-variant hover:bg-surface-container text-xs font-semibold transition-colors flex items-center"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            className="h-11 px-6 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">publish</span>
            <span>Publicar Horário no Feed</span>
          </button>
        </div>

      </form>

    </div>
  );
};
