// Modelos Tipados do LastMinute

export type ServiceCategory = 'barbearia' | 'cabelo' | 'unhas' | 'estetica' | 'massagem';

export interface Endereco {
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  complemento?: string;
}

// 1. Modelo Estabelecimento
export interface Estabelecimento {
  id: string;
  nome: string;
  categoria: ServiceCategory;
  descricao: string;
  endereco: Endereco;
  latitude: number;
  longitude: number;
  fotos: string[];
  nota: number;
  totalAvaliacoes: number;
  telefone: string;
  isDemo: boolean;
  ownerId?: string;
  createdAt: string;
}

// 2. Modelo Serviço
export interface Servico {
  id: string;
  estabelecimentoId: string;
  nome: string;
  categoria: ServiceCategory;
  duracaoMinutos: number;
  precoNormalEmCentavos: number; // Armazenado em centavos (ex: 12000 = R$ 120,00)
  descricao?: string;
  ativo: boolean;
  isDemo: boolean;
}

// 3. Modelo Horário Publicado
export type HorarioStatus = 'disponivel' | 'bloqueado' | 'reservado' | 'cancelado' | 'expirado';

export interface DescontoAutomaticoConfig {
  ativado: boolean;
  descontoAdicionalPercentual: number; // Ex: +10% se faltar menos de X minutos
  minutosAntesDoInicio: number;
}

export interface HorarioPublicado {
  id: string;
  estabelecimentoId: string;
  servicoId: string;
  profissionalNome: string;
  dataHoraInicio: string; // ISO 8601
  dataHoraFim: string; // ISO 8601
  precoPromocionalInicialEmCentavos: number; // Em centavos
  precoNormalEmCentavos: number; // Em centavos
  descontoAutomatico: DescontoAutomaticoConfig;
  status: HorarioStatus;
  tempoBloqueioAte?: string;
  clienteBloqueioId?: string;
  isDemo: boolean;
  createdAt: string;
}

// 4. Modelo Reserva
export type ReservaStatus = 'confirmada' | 'concluida' | 'cancelada_pelo_cliente' | 'cancelada_pelo_estabelecimento';

export interface Reserva {
  id: string;
  codigoConfirmacao: string; // Ex: "LM-84920"
  clienteId: string;
  clienteNome: string;
  clienteEmail: string;
  clienteTelefone: string;
  horarioId: string;
  estabelecimentoId: string;
  servicoId: string;
  precoConfirmadoEmCentavos: number; // Em centavos
  metodoPagamento: 'pix' | 'cartao_credito' | 'pagamento_no_local';
  dataCriacao: string; // ISO 8601
  status: ReservaStatus;
  isDemo: boolean;
}

// 5. Perfil de Usuário
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  fotoUrl?: string;
  telefone?: string;
  papel: 'cliente' | 'profissional' | 'ambos';
  estabelecimentoId?: string;
  isDemo: boolean;
}

// Interface combinada para exibição rica de oferta
export interface OfertaCompleta {
  horario: HorarioPublicado;
  servico: Servico;
  estabelecimento: Estabelecimento;
  descontoPercentual: number;
  economiaEmCentavos: number;
  distanciaKm?: number;
}

export * from './firestoreSchema';
