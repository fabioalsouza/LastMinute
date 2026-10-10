// Cálculo de Distância Geoespacial (Fórmula de Haversine)

export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Coordenadas padrão da demonstração (Jardins / Av. Paulista, São Paulo)
export const DEFAULT_USER_COORDS: Coordinates = {
  latitude: -23.561684,
  longitude: -46.655981
};

/**
 * Calcula a distância em quilômetros entre duas coordenadas
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Raio da Terra em km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // 1 casa decimal
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Formata a distância para exibição amigável
 * Ex: 0.8 -> "800 m", 2.3 -> "2.3 km"
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters}m`;
  }
  return `${distanceKm.toFixed(1).replace('.', ',')} km`;
}
