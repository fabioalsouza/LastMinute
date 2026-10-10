import { Timestamp, GeoPoint } from 'firebase/firestore';

/**
 * Constantes de nomes de coleções no Firestore
 */
export const FIRESTORE_COLLECTIONS = {
  USUARIOS: 'usuarios',
  ESTABELECIMENTOS: 'estabelecimentos',
  SERVICOS: 'servicos',
  HORARIOS: 'horarios',
  RESERVAS: 'reservas',
} as const;

/**
 * 1. Coleção 'usuarios'
 */
export type TipoPerfilUsuario = 'cliente' | 'estabelecimento';

export interface UsuarioDoc {
  id?: string;
  nome: string;
  telefone?: string;
  fotoUrl?: string;
  tipoPerfil: TipoPerfilUsuario;
  criadoEm: Timestamp;
  atualizadoEm: Timestamp;
}

/**
 * 2. Coleção 'estabelecimentos'
 */
export interface EnderecoEstabelecimento {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface EstabelecimentoDoc {
  id?: string;
  proprietarioId: string;
  nome: string;
  descricao: string;
  categoria: string;
  telefoneComercial: string;
  endereco: EnderecoEstabelecimento;
  localizacao: GeoPoint;
  geohash: string;
  fotoUrl?: string;
  publicado: boolean;
  criadoEm: Timestamp;
  atualizadoEm: Timestamp;
}

/**
 * 3. Coleção 'servicos'
 */
export interface ServicoDoc {
  id?: string;
  estabelecimentoId: string;
  nome: string;
  descricao: string;
  categoria: string;
  duracaoMinutos: number; // integer
  precoPadraoCentavos: number; // integer
  fotoUrl?: string;
  ativo: boolean;
  criadoEm: Timestamp;
  atualizadoEm: Timestamp;
}

/**
 * 4. Coleção 'horarios'
 */
export type StatusHorario = 'disponivel' | 'reservado' | 'concluido' | 'cancelado' | 'expirado';

export interface HorarioDoc {
  id?: string;
  estabelecimentoId: string;
  servicoId: string;
  profissionalNome?: string;
  inicio: Timestamp;
  fim: Timestamp;
  precoOriginalCentavos: number; // integer
  precoOfertaCentavos: number; // integer
  status: StatusHorario;
  criadoEm: Timestamp;
  atualizadoEm: Timestamp;
}

/**
 * 5. Coleção 'reservas'
 */
export type StatusReserva = 'confirmada' | 'cancelada' | 'concluida';

export interface ReservaDoc {
  id?: string;
  clienteId: string;
  proprietarioId: string;
  estabelecimentoId: string;
  servicoId: string;
  horarioId: string;
  clienteNome: string;
  estabelecimentoNome: string;
  servicoNome: string;
  inicio: Timestamp;
  fim: Timestamp;
  precoConfirmadoCentavos: number; // integer
  status: StatusReserva;
  criadoEm: Timestamp;
  atualizadoEm: Timestamp;
  canceladoEm?: Timestamp;
  canceladoPorId?: string;
}
