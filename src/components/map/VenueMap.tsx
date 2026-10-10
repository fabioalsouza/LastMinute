import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, OverlayView, Circle } from '@react-google-maps/api';
import L from 'leaflet';
import { Estabelecimento, HorarioPublicado } from '../../types';
import { Coordinates } from '../../utils/distance';

interface VenueMapProps {
  userCoords: Coordinates;
  estabelecimentos: Estabelecimento[];
  horarios: HorarioPublicado[];
  selectedVenueId?: string;
  onSelectVenue?: (venue: Estabelecimento) => void;
  radiusKm?: number;
  className?: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '1rem',
};

const defaultMapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
  ],
};

/**
 * Fallback Leaflet Map caso não haja chave do Google Maps configurada
 */
const LeafletFallbackMap: React.FC<VenueMapProps> = ({
  userCoords,
  estabelecimentos,
  horarios,
  selectedVenueId,
  onSelectVenue,
  radiusKm,
  className = 'h-full w-full',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const radiusCircleRef = useRef<L.Circle | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [userCoords.latitude, userCoords.longitude],
        zoom: 14,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &amp; CartoDB',
        maxZoom: 19,
      }).addTo(map);

      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (radiusCircleRef.current) {
      radiusCircleRef.current.remove();
      radiusCircleRef.current = null;
    }

    if (radiusKm && radiusKm > 0) {
      const circle = L.circle([userCoords.latitude, userCoords.longitude], {
        radius: radiusKm * 1000,
        color: '#005c55',
        fillColor: '#005c55',
        fillOpacity: 0.06,
        weight: 1.5,
        dashArray: '6 4',
      });
      circle.addTo(map);
      radiusCircleRef.current = circle;
      map.fitBounds(circle.getBounds(), { padding: [32, 32], animate: true });
    }
  }, [radiusKm, userCoords]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    const userIcon = L.divIcon({
      className: 'user-location-marker',
      html: `
        <div style="position: relative; width: 24px; height: 24px;">
          <div style="position: absolute; inset: 0; background-color: #0f766e; border-radius: 9999px; opacity: 0.35; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: absolute; inset: 4px; background-color: #005c55; border: 2.5px solid white; border-radius: 9999px; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    L.marker([userCoords.latitude, userCoords.longitude], { icon: userIcon })
      .bindPopup(`
        <div style="font-family: Inter, sans-serif; font-size: 12px; padding: 4px;">
          <strong style="color: #005c55; display: block; margin-bottom: 2px;">Sua Localização</strong>
          <span style="color: #6e7977;">Jardins / Cerqueira César, SP</span>
        </div>
      `)
      .addTo(markersLayer);

    estabelecimentos.forEach((venue) => {
      const venueSlots = horarios.filter(
        (h) => h.estabelecimentoId === venue.id && h.status === 'disponivel'
      );
      const isSelected = selectedVenueId === venue.id;

      const markerHtml = `
        <div style="
          background-color: ${isSelected ? '#005c55' : '#ffffff'};
          color: ${isSelected ? '#ffffff' : '#005c55'};
          border: 2px solid #005c55;
          border-radius: 9999px;
          padding: 4px 10px;
          display: flex;
          align-items: center;
          gap: 4px;
          font-family: Inter, sans-serif;
          font-weight: 600;
          font-size: 11px;
          box-shadow: 0 4px 12px rgba(0, 92, 85, 0.2);
          cursor: pointer;
          white-space: nowrap;
          transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
          transition: all 0.2s ease;
        ">
          <span style="font-size: 12px;">★ ${venue.nota.toFixed(1)}</span>
          <span style="background-color: ${isSelected ? '#6cf8bb' : '#005c55'}; color: ${isSelected ? '#002113' : '#ffffff'}; border-radius: 9999px; padding: 1px 5px; font-size: 10px;">
            ${venueSlots.length} ${venueSlots.length === 1 ? 'vaga' : 'vagas'}
          </span>
        </div>
      `;

      const venueIcon = L.divIcon({
        className: 'custom-venue-marker',
        html: markerHtml,
        iconSize: [110, 32],
        iconAnchor: [55, 16],
      });

      const marker = L.marker([venue.latitude, venue.longitude], { icon: venueIcon }).addTo(markersLayer);

      const popupContent = `
        <div style="font-family: Inter, sans-serif; min-width: 200px; padding: 4px;">
          <div style="height: 100px; width: 100%; border-radius: 8px; overflow: hidden; margin-bottom: 8px;">
            <img src="${venue.fotos[0]}" style="width: 100%; height: 100%; object-fit: cover;" alt="${venue.nome}"/>
          </div>
          <span style="font-size: 10px; text-transform: uppercase; font-weight: 600; color: #005c55; letter-spacing: 0.5px;">${venue.categoria}</span>
          <h4 style="margin: 2px 0 4px 0; font-size: 14px; font-weight: 600; color: #1b1b1b;">${venue.nome}</h4>
          <p style="margin: 0 0 6px 0; font-size: 11px; color: #6e7977;">${venue.endereco.logradouro}, ${venue.endereco.bairro}</p>
          <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #e5e2e1; padding-top: 6px;">
            <span style="font-size: 11px; font-weight: 600; color: #00714d;">${venueSlots.length} vagas hoje</span>
            <span style="font-size: 11px; color: #6e7977;">⭐ ${venue.nota.toFixed(1)}</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => {
        if (onSelectVenue) onSelectVenue(venue);
      });

      if (isSelected) {
        marker.openPopup();
        map.panTo([venue.latitude, venue.longitude], { animate: true });
      }
    });
  }, [userCoords, estabelecimentos, horarios, selectedVenueId, onSelectVenue]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([userCoords.latitude, userCoords.longitude], 14);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainerRef} className="h-full w-full rounded-2xl overflow-hidden shadow-inner" />
      <button
        onClick={handleRecenter}
        title="Centralizar na minha localização"
        className="absolute bottom-4 right-4 z-[400] h-10 w-10 rounded-full bg-surface-container-lowest text-primary shadow-lg border border-outline-variant flex items-center justify-center hover:bg-surface-container transition-colors"
      >
        <span className="material-symbols-outlined text-[20px]">my_location</span>
      </button>

      {radiusKm && (
        <div className="absolute top-3 left-3 z-[400] px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md border border-outline-variant text-[11px] font-medium text-on-surface flex items-center gap-1 shadow-sm">
          <span className="material-symbols-outlined text-[13px] text-secondary">radar</span>
          Raio: {radiusKm}km (OpenStreetMap)
        </div>
      )}
    </div>
  );
};

/**
 * Componente Principal VenueMap com suporte a Google Maps e Fallback inteligente
 */
export const VenueMap: React.FC<VenueMapProps> = (props) => {
  const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  // Se não houver chave definida no .env, usa o OpenStreetMap (Leaflet) automaticamente
  if (!googleApiKey || googleApiKey.trim() === '' || googleApiKey === 'sua_chave_aqui') {
    return <LeafletFallbackMap {...props} />;
  }

  return <GoogleVenueMap {...props} apiKey={googleApiKey} />;
};

interface GoogleVenueMapProps extends VenueMapProps {
  apiKey: string;
}

const GoogleVenueMap: React.FC<GoogleVenueMapProps> = ({
  userCoords,
  estabelecimentos,
  horarios,
  selectedVenueId,
  onSelectVenue,
  radiusKm,
  className = 'h-full w-full',
  apiKey,
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [activePopupVenueId, setActivePopupVenueId] = useState<string | null>(selectedVenueId || null);

  const center = {
    lat: userCoords.latitude,
    lng: userCoords.longitude,
  };

  useEffect(() => {
    if (selectedVenueId) {
      setActivePopupVenueId(selectedVenueId);
      const selectedVenue = estabelecimentos.find((v) => v.id === selectedVenueId);
      if (selectedVenue && map) {
        map.panTo({ lat: selectedVenue.latitude, lng: selectedVenue.longitude });
      }
    }
  }, [selectedVenueId, estabelecimentos, map]);

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleRecenter = () => {
    if (map) {
      map.panTo(center);
      map.setZoom(14);
    }
  };

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-error-container/20 border border-error/30 rounded-2xl text-center h-full">
        <span className="material-symbols-outlined text-error text-3xl mb-2">error</span>
        <h4 className="font-semibold text-on-surface">Erro ao carregar o Google Maps</h4>
        <p className="text-xs text-on-surface-variant mt-1 max-w-sm">
          Verifique se a sua chave no arquivo <code>.env</code> está com a Maps JavaScript API ativada no Google Cloud Console.
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full w-full rounded-2xl bg-surface-container-low animate-pulse">
        <div className="flex items-center gap-2 text-primary font-medium text-sm">
          <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
          Carregando Google Maps...
        </div>
      </div>
    );
  }

  const activeVenue = estabelecimentos.find((v) => v.id === activePopupVenueId);
  const activeVenueSlots = activeVenue
    ? horarios.filter((h) => h.estabelecimentoId === activeVenue.id && h.status === 'disponivel')
    : [];

  return (
    <div className={`relative ${className}`}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={14}
        options={defaultMapOptions}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {/* Raio de busca */}
        {radiusKm && radiusKm > 0 && (
          <Circle
            center={center}
            radius={radiusKm * 1000}
            options={{
              strokeColor: '#005c55',
              strokeOpacity: 0.8,
              strokeWeight: 1.5,
              fillColor: '#005c55',
              fillOpacity: 0.06,
            }}
          />
        )}

        {/* Marcador do Usuário */}
        <OverlayView
          position={center}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <div className="relative -top-3 -left-3 pointer-events-none">
            <div className="absolute inset-0 w-6 h-6 bg-primary opacity-35 rounded-full animate-ping" />
            <div className="absolute inset-1 w-4 h-4 bg-primary border-2 border-white rounded-full shadow-md" />
          </div>
        </OverlayView>

        {/* Marcadores dos Estabelecimentos */}
        {estabelecimentos.map((venue) => {
          const venueSlots = horarios.filter(
            (h) => h.estabelecimentoId === venue.id && h.status === 'disponivel'
          );
          const isSelected = selectedVenueId === venue.id || activePopupVenueId === venue.id;

          return (
            <OverlayView
              key={venue.id}
              position={{ lat: venue.latitude, lng: venue.longitude }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <div
                onClick={() => {
                  setActivePopupVenueId(venue.id);
                  if (onSelectVenue) onSelectVenue(venue);
                }}
                className={`cursor-pointer transition-all duration-200 transform -translate-x-1/2 -translate-y-1/2 ${
                  isSelected ? 'scale-110 z-30' : 'scale-100 hover:scale-105 z-10'
                }`}
                style={{
                  backgroundColor: isSelected ? '#005c55' : '#ffffff',
                  color: isSelected ? '#ffffff' : '#005c55',
                  border: '2px solid #005c55',
                  borderRadius: '9999px',
                  padding: '4px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(0, 92, 85, 0.2)',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>★ {venue.nota.toFixed(1)}</span>
                <span
                  style={{
                    backgroundColor: isSelected ? '#6cf8bb' : '#005c55',
                    color: isSelected ? '#002113' : '#ffffff',
                    borderRadius: '9999px',
                    padding: '1px 5px',
                    fontSize: '10px',
                  }}
                >
                  {venueSlots.length} {venueSlots.length === 1 ? 'vaga' : 'vagas'}
                </span>
              </div>
            </OverlayView>
          );
        })}

        {/* Card Flutuante de Detalhes do Estabelecimento Selecionado */}
        {activeVenue && (
          <OverlayView
            position={{ lat: activeVenue.latitude, lng: activeVenue.longitude }}
            mapPaneName={OverlayView.FLOAT_PANE}
          >
            <div
              className="relative -top-[190px] -left-[110px] w-[220px] bg-surface-container-lowest rounded-xl p-3 shadow-xl border border-outline-variant z-50 animate-in fade-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActivePopupVenueId(null)}
                className="absolute top-1.5 right-1.5 text-on-surface-variant hover:text-on-surface bg-surface-container/60 hover:bg-surface-container rounded-full p-0.5 text-xs"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
              <div className="h-20 w-full rounded-lg overflow-hidden mb-2">
                <img
                  src={activeVenue.fotos[0]}
                  alt={activeVenue.nome}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[9px] uppercase font-bold text-primary tracking-wider">
                {activeVenue.categoria}
              </span>
              <h4 className="text-xs font-bold text-on-surface leading-snug line-clamp-1">
                {activeVenue.nome}
              </h4>
              <p className="text-[10px] text-on-surface-variant line-clamp-1 mb-2">
                {activeVenue.endereco.logradouro}, {activeVenue.endereco.bairro}
              </p>
              <div className="flex items-center justify-between pt-1.5 border-t border-outline-variant text-[10px]">
                <span className="font-semibold text-secondary">{activeVenueSlots.length} vagas hoje</span>
                <span className="text-on-surface-variant">⭐ {activeVenue.nota.toFixed(1)}</span>
              </div>
            </div>
          </OverlayView>
        )}
      </GoogleMap>

      {/* Botão de Centralizar */}
      <button
        onClick={handleRecenter}
        title="Centralizar na minha localização"
        className="absolute bottom-4 right-4 z-[400] h-10 w-10 rounded-full bg-surface-container-lowest text-primary shadow-lg border border-outline-variant flex items-center justify-center hover:bg-surface-container transition-colors"
      >
        <span className="material-symbols-outlined text-[20px]">my_location</span>
      </button>

      {/* Badge de Raio */}
      {radiusKm && (
        <div className="absolute top-3 left-3 z-[400] px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md border border-outline-variant text-[11px] font-medium text-on-surface flex items-center gap-1 shadow-sm">
          <span className="material-symbols-outlined text-[13px] text-secondary">radar</span>
          Raio: {radiusKm}km (Google Maps)
        </div>
      )}
    </div>
  );
};
