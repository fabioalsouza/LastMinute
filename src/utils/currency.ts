// Utilitários de Precisão Financeira (Valores sempre em centavos)

/**
 * Formata um valor inteiro em centavos para a moeda brasileira (BRL)
 * Exemplo: 12000 -> "R$ 120,00"
 */
export function formatCentsToBRL(cents: number): string {
  if (isNaN(cents)) return 'R$ 0,00';
  const reais = cents / 100;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(reais);
}

/**
 * Converte uma string digitada pelo usuário em centavos inteiros
 * Exemplo: "120,50" -> 12050
 */
export function parseBRLInputToCents(val: string): number {
  if (!val) return 0;
  const cleaned = val.replace(/[^\d]/g, '');
  return parseInt(cleaned, 10) || 0;
}

/**
 * Calcula o percentual de desconto entre preço normal e promocional
 */
export function calculateDiscountPercent(normalCents: number, promoCents: number): number {
  if (normalCents <= 0 || promoCents >= normalCents) return 0;
  const discount = ((normalCents - promoCents) / normalCents) * 100;
  return Math.round(discount);
}

/**
 * Calcula a economia absoluta em centavos
 */
export function calculateSavingsInCents(normalCents: number, promoCents: number): number {
  return Math.max(0, normalCents - promoCents);
}
