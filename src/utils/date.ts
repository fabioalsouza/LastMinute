// Utilitários de Data, Hora e Temporizadores

export function formatTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '14:30';
  }
}

export function formatDateBr(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
    });
  } catch {
    return 'Hoje';
  }
}

export function formatFullDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return '';
  }
}

/**
 * Retorna segundos restantes até a data alvo ou 0 se expirou
 */
export function getRemainingSeconds(targetIso: string): number {
  const target = new Date(targetIso).getTime();
  const now = new Date().getTime();
  const diffSec = Math.floor((target - now) / 1000);
  return Math.max(0, diffSec);
}

/**
 * Formata segundos restantes em MM:SS
 * Ex: 872 -> "14:32 min"
 */
export function formatCountdown(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
