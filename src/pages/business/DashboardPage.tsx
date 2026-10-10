import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMarketplace } from '../../context/MarketplaceContext';
import { formatCentsToBRL } from '../../utils/currency';
import { formatTime } from '../../utils/date';
import { StatusBadge } from '../../components/common/StatusBadge';

export const DashboardPage: React.FC = () => {
  const { horarios, reservas, servicos, estabelecimentos } = useMarketplace();

  // Estabelecimento de demonstração padrão do usuário profissional
  const myVenue = estabelecimentos[0];

  // Horários do estabelecimento
  const venueSlots = horarios.filter((h) => h.estabelecimentoId === myVenue.id);
  const activeSlots = venueSlots.filter((h) => h.status === 'disponivel');
  const bookedSlots = venueSlots.filter((h) => h.status === 'reservado');

  // Reservas do estabelecimento
  const venueBookings = reservas.filter((r) => r.estabelecimentoId === myVenue.id);

  // Cálculo da receita recuperada em centavos
  const receitaRecuperadaCents = venueBookings.reduce(
    (acc, curr) => acc + curr.precoConfirmadoEmCentavos,
    0
  );

  return (
    <div className="w-full max-w-[1440px] mx-auto px-gutter pt-space-lg pb-space-xl flex flex-col gap-space-lg">
      
      {/* Top Banner & Venue Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary uppercase tracking-wider">
              Painel do Parceiro
            </span>
            <span className="text-xs text-on-surface-variant font-medium">
              {myVenue?.nome}
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-on-surface">
            Visão Geral de Ocupação & Receita
          </h1>
        </div>

        <Link
          to="/negocios/publicar"
          className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold transition-colors shadow-sm self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Publicar Horário Relâmpago</span>
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Receita Recuperada */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Receita Recuperada</span>
            <span className="material-symbols-outlined text-primary text-[22px]">payments</span>
          </div>
          <div>
            <span className="text-2xl font-bold text-primary tabular-nums">
              {formatCentsToBRL(receitaRecuperadaCents || 8500)}
            </span>
            <span className="text-[11px] text-secondary font-medium block mt-1">
              +100% de receita que seria perdida
            </span>
          </div>
        </div>

        {/* KPI 2: Vagas Preenchidas */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Vagas Preenchidas</span>
            <span className="material-symbols-outlined text-secondary text-[22px]">event_available</span>
          </div>
          <div>
            <span className="text-2xl font-bold text-on-surface tabular-nums">
              {bookedSlots.length || 1}
            </span>
            <span className="text-[11px] text-on-surface-variant block mt-1">
              Horários preenchidos hoje
            </span>
          </div>
        </div>

        {/* KPI 3: Vagas Ativas no Feed */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Vagas no Ar</span>
            <span className="material-symbols-outlined text-amber-500 text-[22px]">schedule</span>
          </div>
          <div>
            <span className="text-2xl font-bold text-on-surface tabular-nums">
              {activeSlots.length}
            </span>
            <span className="text-[11px] text-on-surface-variant block mt-1">
              Disponíveis para reserva imediata
            </span>
          </div>
        </div>

        {/* KPI 4: Catálogo de Serviços */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Serviços Cadastrados</span>
            <span className="material-symbols-outlined text-primary text-[22px]">content_cut</span>
          </div>
          <div>
            <span className="text-2xl font-bold text-on-surface tabular-nums">
              {servicos.filter((s) => s.estabelecimentoId === myVenue.id).length || 2}
            </span>
            <span className="text-[11px] text-on-surface-variant block mt-1">
              Prontos para publicação rápida
            </span>
          </div>
        </div>

      </div>

      {/* Split Section: Active Slots Table + Quick Publishing Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Active and Recent Slots (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-variant">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">view_list</span>
              <h2 className="text-base font-semibold text-on-surface">
                Horários Publicados para Hoje
              </h2>
            </div>
            <Link
              to="/negocios/horarios"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>Ver todos</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
          </div>

          {venueSlots.length > 0 ? (
            <div className="divide-y divide-surface-variant">
              {venueSlots.slice(0, 5).map((slot) => {
                const servico = servicos.find((s) => s.id === slot.servicoId);
                return (
                  <div key={slot.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary font-bold text-xs tabular-nums">
                        {formatTime(slot.dataHoraInicio)}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-on-surface">
                          {servico?.nome || 'Serviço'}
                        </h4>
                        <span className="text-xs text-on-surface-variant">
                          Profissional: {slot.profissionalNome}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-xs text-outline line-through tabular-nums block">
                          {formatCentsToBRL(slot.precoNormalEmCentavos)}
                        </span>
                        <span className="text-sm font-bold text-primary tabular-nums">
                          {formatCentsToBRL(slot.precoPromocionalInicialEmCentavos)}
                        </span>
                      </div>
                      <StatusBadge
                        type="status"
                        label={slot.status === 'disponivel' ? 'No Ar' : 'Reservado'}
                        statusType={slot.status}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-on-surface-variant text-xs">
              Nenhum horário publicado ainda hoje.
            </div>
          )}
        </div>

        {/* Right: Shortcuts + Revenue Simulator (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-sm flex flex-col gap-4">
            <h3 className="text-base font-semibold text-on-surface">
              Ações Rápidas
            </h3>
            
            <Link
              to="/negocios/publicar"
              className="p-3.5 rounded-xl border border-outline-variant hover:border-primary bg-surface-container-low hover:bg-surface-container transition-all flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">bolt</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-on-surface">Publicar Vaga Relâmpago</span>
                <span className="text-[11px] text-on-surface-variant">Preencher janela ociosa nas próximas 2 horas</span>
              </div>
            </Link>

            <Link
              to="/negocios/servicos"
              className="p-3.5 rounded-xl border border-outline-variant hover:border-primary bg-surface-container-low hover:bg-surface-container transition-all flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">add_box</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-on-surface">Adicionar Novo Serviço</span>
                <span className="text-[11px] text-on-surface-variant">Atualizar tabela de preços do catálogo</span>
              </div>
            </Link>

            <Link
              to="/negocios/horarios"
              className="p-3.5 rounded-xl border border-outline-variant hover:border-primary bg-surface-container-low hover:bg-surface-container transition-all flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">manage_history</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-on-surface">Gerenciar Vagas Ativas</span>
                <span className="text-[11px] text-on-surface-variant">Pausar, reativar ou excluir horários</span>
              </div>
            </Link>
          </div>

          {/* Revenue Simulator */}
          <RevenueSimulator />
        </div>

      </div>

    </div>
  );
};

// Simulador de Receita Potencial
const RevenueSimulator: React.FC = () => {
  const [vagasPorSemana, setVagasPorSemana] = useState(8);
  const [ticketMedio, setTicketMedio] = useState(150); // R$
  const [taxaPreenchimento, setTaxaPreenchimento] = useState(70); // %

  const vagasPreenchidas = Math.round(vagasPorSemana * (taxaPreenchimento / 100));
  const receitaMensal = Math.round(vagasPreenchidas * ticketMedio * 4.33); // semanas/mês
  const receitaMensalCents = receitaMensal * 100;

  return (
    <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-[20px]">calculate</span>
        <h4 className="text-sm font-semibold text-on-surface">Simulador de Receita</h4>
      </div>

      <p className="text-[11px] text-on-surface-variant leading-relaxed -mt-2">
        Quanto você pode recuperar por mês com o LastMinute?
      </p>

      {/* Slider: Vagas por semana */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-on-surface-variant">Vagas ociosas/semana</span>
          <span className="font-bold text-on-surface">{vagasPorSemana}</span>
        </div>
        <input
          type="range" min={1} max={30} step={1}
          value={vagasPorSemana}
          onChange={(e) => setVagasPorSemana(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-primary bg-surface-variant"
        />
      </div>

      {/* Slider: Ticket Médio */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-on-surface-variant">Ticket médio (R$)</span>
          <span className="font-bold text-on-surface">R$ {ticketMedio}</span>
        </div>
        <input
          type="range" min={30} max={500} step={10}
          value={ticketMedio}
          onChange={(e) => setTicketMedio(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-primary bg-surface-variant"
        />
      </div>

      {/* Slider: Taxa de Preenchimento */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-on-surface-variant">Taxa de preenchimento</span>
          <span className="font-bold text-on-surface">{taxaPreenchimento}%</span>
        </div>
        <input
          type="range" min={10} max={100} step={5}
          value={taxaPreenchimento}
          onChange={(e) => setTaxaPreenchimento(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-primary bg-surface-variant"
        />
      </div>

      {/* Result */}
      <div className="pt-3 border-t border-primary/20 text-center">
        <span className="text-[11px] text-on-surface-variant block mb-1">Receita potencial/mês</span>
        <span className="text-2xl font-bold text-primary tabular-nums">
          {formatCentsToBRL(receitaMensalCents)}
        </span>
        <span className="text-[11px] text-secondary font-medium block mt-0.5">
          {vagasPreenchidas} vagas/semana • {vagasPreenchidas * 4} vagas/mês
        </span>
      </div>
    </div>
  );
};
