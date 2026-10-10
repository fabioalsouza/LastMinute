import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { VenueMap } from '../../components/map/VenueMap';
import { CategoryPills } from '../../components/common/CategoryPills';
import { Estabelecimento } from '../../types';
import { formatDistance } from '../../utils/distance';
import { calculateHaversineDistanceKm } from '../../utils/distance';
import { Link } from 'react-router-dom';
import { formatCentsToBRL } from '../../utils/currency';

const RADIUS_OPTIONS = [1, 2, 5, 10, 20] as const;
type RadiusOption = typeof RADIUS_OPTIONS[number];

export const MapPage: React.FC = () => {
  const {
    estabelecimentos,
    horarios,
    servicos,
    userCoords,
    selectedCategory,
    setSelectedCategory
  } = useMarketplace();

  const [selectedVenue, setSelectedVenue] = useState<Estabelecimento | null>(
    estabelecimentos[0] || null
  );
  const [radiusKm, setRadiusKm] = useState<RadiusOption>(5);

  // Filtra estabelecimentos por categoria e raio
  const filteredVenues = estabelecimentos.filter((venue) => {
    if (selectedCategory !== 'todos' && venue.categoria !== selectedCategory) return false;

    const dist = calculateHaversineDistanceKm(
      userCoords.latitude,
      userCoords.longitude,
      venue.latitude,
      venue.longitude
    );
    return dist <= radiusKm;
  });

  return (
    <div className="w-full max-w-[1440px] mx-auto px-gutter pt-space-md pb-space-lg flex flex-col h-[calc(100vh-72px)] min-h-[640px]">

      {/* Top Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[24px]">explore</span>
          <h1 className="text-xl font-bold tracking-tight text-on-surface">
            Mapa de Oportunidades Próximas
          </h1>
        </div>

        {/* Filters Row: Category + Radius */}
        <div className="flex flex-wrap items-center gap-3">
          <CategoryPills
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />

          {/* Radius Filter Pill Group */}
          <div className="flex items-center gap-1 bg-surface-container-low border border-outline-variant rounded-full px-2 py-1">
            <span className="material-symbols-outlined text-[16px] text-secondary mr-0.5">radar</span>
            {RADIUS_OPTIONS.map((km) => (
              <button
                key={km}
                onClick={() => setRadiusKm(km)}
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all ${
                  radiusKm === km
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                {km}km
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Split View */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-sm">

        {/* Sidebar */}
        <div className="lg:col-span-5 flex flex-col h-full border-r border-surface-variant overflow-hidden">
          <div className="p-3.5 border-b border-surface-variant bg-surface-container-low flex items-center justify-between">
            <span className="text-xs font-semibold text-on-surface uppercase tracking-wider">
              {filteredVenues.length} {filteredVenues.length === 1 ? 'Local Disponível' : 'Locais Disponíveis'}
            </span>
            <span className="text-[11px] text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px] text-secondary">radar</span>
              Raio: {radiusKm} km
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {filteredVenues.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 gap-2 text-center">
                <span className="material-symbols-outlined text-[36px] text-outline">search_off</span>
                <p className="text-sm text-on-surface-variant">Nenhum local encontrado em {radiusKm}km.</p>
                <button
                  onClick={() => setRadiusKm(20)}
                  className="text-xs text-primary font-semibold hover:underline"
                >
                  Ampliar raio para 20km
                </button>
              </div>
            ) : (
              filteredVenues.map((venue) => {
                const distanceKm = calculateHaversineDistanceKm(
                  userCoords.latitude,
                  userCoords.longitude,
                  venue.latitude,
                  venue.longitude
                );

                const venueSlots = horarios.filter(
                  (h) => h.estabelecimentoId === venue.id && h.status === 'disponivel'
                );

                const isSelected = selectedVenue?.id === venue.id;

                return (
                  <div
                    key={venue.id}
                    onClick={() => setSelectedVenue(venue)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex gap-3 ${
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-outline-variant bg-surface-container-lowest hover:border-primary/30 hover:bg-surface-container-low'
                    }`}
                  >
                    <img
                      src={venue.fotos[0]}
                      alt={venue.nome}
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                            {venue.categoria}
                          </span>
                          <div className="flex items-center gap-0.5 text-xs font-semibold text-on-surface">
                            <span className="material-symbols-outlined text-[14px] text-amber-500 fill-1">star</span>
                            <span>{venue.nota.toFixed(1)}</span>
                          </div>
                        </div>
                        <h3 className="text-sm font-semibold text-on-surface line-clamp-1">
                          {venue.nome}
                        </h3>
                        <p className="text-xs text-on-surface-variant line-clamp-1">
                          {venue.endereco.logradouro} • {formatDistance(distanceKm)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-surface-variant mt-2">
                        <span className="text-xs font-semibold text-on-secondary-container bg-secondary-container/30 px-2 py-0.5 rounded-full">
                          {venueSlots.length} {venueSlots.length === 1 ? 'vaga' : 'vagas'}
                        </span>
                        {venueSlots.length > 0 && (
                          <Link
                            to={`/servico/${venueSlots[0].id}`}
                            className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Ver oferta
                            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Slot Preview Footer */}
          {selectedVenue && (
            <div className="p-3 bg-surface-container border-t border-surface-variant">
              <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block mb-2">
                Horários vagos em {selectedVenue.nome}:
              </span>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {horarios
                  .filter((h) => h.estabelecimentoId === selectedVenue.id && h.status === 'disponivel')
                  .map((slot) => {
                    const servico = servicos.find((s) => s.id === slot.servicoId);
                    return (
                      <Link
                        key={slot.id}
                        to={`/servico/${slot.id}`}
                        className="px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-primary/30 text-xs text-on-surface hover:bg-primary hover:text-on-primary transition-all flex flex-col flex-shrink-0"
                      >
                        <span className="font-semibold text-primary group-hover:text-on-primary">
                          {formatCentsToBRL(slot.precoPromocionalInicialEmCentavos)}
                        </span>
                        <span className="text-[10px] text-on-surface-variant">
                          {servico?.nome.slice(0, 18)}...
                        </span>
                      </Link>
                    );
                  })}
              </div>
            </div>
          )}
        </div>

        {/* Map Area */}
        <div className="lg:col-span-7 h-full w-full">
          <VenueMap
            userCoords={userCoords}
            estabelecimentos={filteredVenues}
            horarios={horarios}
            selectedVenueId={selectedVenue?.id}
            onSelectVenue={(v) => setSelectedVenue(v)}
            radiusKm={radiusKm}
            className="h-full w-full"
          />
        </div>

      </div>

    </div>
  );
};
