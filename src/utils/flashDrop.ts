// Flash Drop: Desconto dinâmico baseado no tempo restante até o horário

import { HorarioPublicado } from '../types';

export interface FlashDropState {
  precoAtualEmCentavos: number;
  descontoAtualPercent: number;
  isFlashActive: boolean;       // Ativado somente nos últimos N minutos
  minutosRestantes: number;
  urgencyLevel: 'normal' | 'soon' | 'critical'; // > 60min, 30-60min, < 30min
}

/**
 * Calcula o preço atual com Flash Drop aplicado, se DescontoAutomatico estiver ativo.
 * Regra: Se faltar menos de `minutosAntesDoInicio` mins, aplica descontoAdicional.
 */
export function calcularFlashDrop(horario: HorarioPublicado): FlashDropState {
  const now = Date.now();
  const start = new Date(horario.dataHoraInicio).getTime();
  const minutosRestantes = Math.max(0, Math.floor((start - now) / 60000));

  const config = horario.descontoAutomatico;

  let precoAtualEmCentavos = horario.precoPromocionalInicialEmCentavos;
  let isFlashActive = false;

  if (config.ativado && minutosRestantes <= config.minutosAntesDoInicio && minutosRestantes > 0) {
    const fator = 1 - config.descontoAdicionalPercentual / 100;
    precoAtualEmCentavos = Math.round(horario.precoPromocionalInicialEmCentavos * fator);
    isFlashActive = true;
  }

  const descontoAtualPercent = Math.round(
    ((horario.precoNormalEmCentavos - precoAtualEmCentavos) / horario.precoNormalEmCentavos) * 100
  );

  let urgencyLevel: FlashDropState['urgencyLevel'] = 'normal';
  if (minutosRestantes <= 30) urgencyLevel = 'critical';
  else if (minutosRestantes <= 60) urgencyLevel = 'soon';

  return { precoAtualEmCentavos, descontoAtualPercent, isFlashActive, minutosRestantes, urgencyLevel };
}
