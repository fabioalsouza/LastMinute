import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { SlotCard } from '../../components/cards/SlotCard';
import { CategoryPills } from '../../components/common/CategoryPills';
import { UrgencyBanner } from '../../components/common/UrgencyBanner';

export const ExplorePage: React.FC = () => {
  const {
    ofertas,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    requestUserLocation
  } = useMarketplace();

  const [dateFilter, setDateFilter] = useState<'hoje' | 'todos'>('hoje');

  return (
    <div className="w-full max-w-[1440px] mx-auto px-gutter pt-space-lg pb-space-xl flex flex-col gap-space-lg">
      
      {/* Top Editorial Header & Quick Stat Bar */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md pt-2">
        <div className="flex flex-col gap-space-xs">
          <div className="inline-flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-ping"></span>
            <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
              Disponibilidade Imediata • Jardins & Arredores (SP)
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-on-surface">
            Um horário livre. Uma boa escolha.
          </h1>
          <p className="text-base text-on-surface-variant max-w-2xl">
            Encontre horários vagos de última hora perto de você, com descontos exclusivos de até 50%.
          </p>
        </div>

        {/* Live Urgency Countdown Banner */}
        <UrgencyBanner />
      </div>

      {/* Segmented Unified Search & Filter Shell (Level 1 Elevation) */}
      <div className="p-2 rounded-2xl bg-surface-container-lowest shadow-md border border-outline-variant/60 flex flex-col lg:flex-row items-stretch lg:items-center gap-2">
        
        {/* Search Input */}
        <div className="flex-1 flex items-center gap-2 px-3.5 py-2.5 bg-surface-container-low rounded-xl">
          <span className="material-symbols-outlined text-outline text-[20px]">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Corte de cabelo, barba, manicure, massagem..."
            className="w-full bg-transparent text-sm text-on-surface placeholder:text-outline focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-outline hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        <div className="h-8 w-px bg-surface-variant hidden lg:block"></div>

        {/* Time Selector */}
        <div
          onClick={() => setDateFilter((prev) => (prev === 'hoje' ? 'todos' : 'hoje'))}
          className="flex items-center gap-2.5 px-3.5 py-2 bg-surface-container-low rounded-xl cursor-pointer hover:bg-surface-container transition-colors"
        >
          <span className="material-symbols-outlined text-primary text-[20px]">calendar_today</span>
          <div className="flex flex-col text-left">
            <span className="text-[11px] text-on-surface-variant">Dia e horário</span>
            <span className="text-xs font-semibold text-on-surface">
              {dateFilter === 'hoje' ? 'Hoje (Próximas horas)' : 'Todos os dias'}
            </span>
          </div>
          <span className="material-symbols-outlined text-outline text-[18px] ml-1">expand_more</span>
        </div>

        <div className="h-8 w-px bg-surface-variant hidden lg:block"></div>

        {/* Geo Anchor */}
        <div
          onClick={requestUserLocation}
          className="flex items-center gap-2.5 px-3.5 py-2 bg-surface-container-low rounded-xl cursor-pointer hover:bg-surface-container transition-colors"
          title="Clique para atualizar localização atual"
        >
          <span className="material-symbols-outlined text-secondary text-[20px]">location_on</span>
          <div className="flex flex-col text-left">
            <span className="text-[11px] text-on-surface-variant">Região</span>
            <span className="text-xs font-semibold text-on-surface truncate max-w-[170px]">
              Jardins / Pinheiros, SP
            </span>
          </div>
          <span className="material-symbols-outlined text-outline text-[18px] ml-1">my_location</span>
        </div>

      </div>

      {/* Category Pills Bar */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-on-surface uppercase tracking-wider">
            Categorias
          </span>
          <span className="text-xs text-on-surface-variant">
            {ofertas.length} {ofertas.length === 1 ? 'vaga encontrada' : 'vagas encontradas'}
          </span>
        </div>
        <CategoryPills
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      {/* Offers Grid */}
      {ofertas.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {ofertas.map((oferta) => (
            <SlotCard key={oferta.horario.id} oferta={oferta} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 rounded-2xl bg-surface-container-lowest border border-outline-variant text-center my-6">
          <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-outline mb-3">
            <span className="material-symbols-outlined text-2xl">search_off</span>
          </div>
          <h3 className="text-base font-semibold text-on-surface mb-1">
            Nenhuma vaga encontrada com estes filtros
          </h3>
          <p className="text-xs text-on-surface-variant max-w-sm mb-4">
            Tente remover os termos de busca ou selecionar outra categoria para ver vagas imediatas.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('todos');
            }}
            className="h-9 px-4 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-colors"
          >
            Limpar filtros
          </button>
        </div>
      )}

    </div>
  );
};
