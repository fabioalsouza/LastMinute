import {
  Estabelecimento,
  Servico,
  HorarioPublicado,
  Reserva,
  OfertaCompleta,
  ServiceCategory
} from '../types';
import {
  INITIAL_ESTABELECIMENTOS,
  INITIAL_SERVICOS,
  INITIAL_HORARIOS,
  INITIAL_RESERVAS
} from './mockData';
import { calculateDiscountPercent, calculateSavingsInCents } from '../utils/currency';
import { calculateHaversineDistanceKm, DEFAULT_USER_COORDS } from '../utils/distance';

const STORAGE_KEYS = {
  ESTABELECIMENTOS: 'lastminute_estabelecimentos',
  SERVICOS: 'lastminute_servicos',
  HORARIOS: 'lastminute_horarios',
  RESERVAS: 'lastminute_reservas',
};

class StorageRepository {
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.initDefaults();
  }

  private initDefaults(): void {
    if (!localStorage.getItem(STORAGE_KEYS.ESTABELECIMENTOS)) {
      localStorage.setItem(STORAGE_KEYS.ESTABELECIMENTOS, JSON.stringify(INITIAL_ESTABELECIMENTOS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SERVICOS)) {
      localStorage.setItem(STORAGE_KEYS.SERVICOS, JSON.stringify(INITIAL_SERVICOS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.HORARIOS)) {
      localStorage.setItem(STORAGE_KEYS.HORARIOS, JSON.stringify(INITIAL_HORARIOS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.RESERVAS)) {
      localStorage.setItem(STORAGE_KEYS.RESERVAS, JSON.stringify(INITIAL_RESERVAS));
    }
  }

  public subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }

  // --- ESTABELECIMENTOS ---
  public getEstabelecimentos(): Estabelecimento[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ESTABELECIMENTOS);
      return data ? JSON.parse(data) : INITIAL_ESTABELECIMENTOS;
    } catch {
      return INITIAL_ESTABELECIMENTOS;
    }
  }

  public getEstabelecimentoById(id: string): Estabelecimento | undefined {
    return this.getEstabelecimentos().find((e) => e.id === id);
  }

  // --- SERVIÇOS ---
  public getServicos(estabelecimentoId?: string): Servico[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SERVICOS);
      const servicos: Servico[] = data ? JSON.parse(data) : INITIAL_SERVICOS;
      if (estabelecimentoId) {
        return servicos.filter((s) => s.estabelecimentoId === estabelecimentoId);
      }
      return servicos;
    } catch {
      return INITIAL_SERVICOS;
    }
  }

  public getServicoById(id: string): Servico | undefined {
    return this.getServicos().find((s) => s.id === id);
  }

  public salvarServico(servico: Omit<Servico, 'id'> & { id?: string }): Servico {
    const servicos = this.getServicos();
    let saved: Servico;

    if (servico.id) {
      servicos.forEach((s, idx) => {
        if (s.id === servico.id) {
          servicos[idx] = { ...s, ...servico } as Servico;
          saved = servicos[idx];
        }
      });
      saved = saved! || (servico as Servico);
    } else {
      saved = {
        ...servico,
        id: `srv_${Date.now()}`,
        ativo: true,
        isDemo: true
      };
      servicos.push(saved);
    }

    localStorage.setItem(STORAGE_KEYS.SERVICOS, JSON.stringify(servicos));
    this.notify();
    return saved;
  }

  public excluirServico(servicoId: string): void {
    const servicos = this.getServicos().filter((s) => s.id !== servicoId);
    localStorage.setItem(STORAGE_KEYS.SERVICOS, JSON.stringify(servicos));
    this.notify();
  }

  // --- HORÁRIOS PUBLICADOS ---
  public getHorarios(): HorarioPublicado[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HORARIOS);
      return data ? JSON.parse(data) : INITIAL_HORARIOS;
    } catch {
      return INITIAL_HORARIOS;
    }
  }

  public getHorarioById(id: string): HorarioPublicado | undefined {
    return this.getHorarios().find((h) => h.id === id);
  }

  public publicarHorario(
    dados: Omit<HorarioPublicado, 'id' | 'createdAt' | 'status' | 'isDemo'>
  ): HorarioPublicado {
    const horarios = this.getHorarios();
    const novoHorario: HorarioPublicado = {
      ...dados,
      id: `slot_${Date.now()}`,
      status: 'disponivel',
      isDemo: true,
      createdAt: new Date().toISOString()
    };
    horarios.unshift(novoHorario);
    localStorage.setItem(STORAGE_KEYS.HORARIOS, JSON.stringify(horarios));
    this.notify();
    return novoHorario;
  }

  public atualizarStatusHorario(horarioId: string, status: HorarioPublicado['status']): void {
    const horarios = this.getHorarios();
    const idx = horarios.findIndex((h) => h.id === horarioId);
    if (idx !== -1) {
      horarios[idx].status = status;
      localStorage.setItem(STORAGE_KEYS.HORARIOS, JSON.stringify(horarios));
      this.notify();
    }
  }

  public excluirHorario(horarioId: string): void {
    const horarios = this.getHorarios().filter((h) => h.id !== horarioId);
    localStorage.setItem(STORAGE_KEYS.HORARIOS, JSON.stringify(horarios));
    this.notify();
  }

  // --- RESERVAS ---
  public getReservas(clienteId?: string): Reserva[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RESERVAS);
      const reservas: Reserva[] = data ? JSON.parse(data) : INITIAL_RESERVAS;
      if (clienteId) {
        return reservas.filter((r) => r.clienteId === clienteId);
      }
      return reservas;
    } catch {
      return INITIAL_RESERVAS;
    }
  }

  public getReservaById(id: string): Reserva | undefined {
    return this.getReservas().find((r) => r.id === id || r.codigoConfirmacao === id);
  }

  public criarReserva(dados: {
    horarioId: string;
    clienteId: string;
    clienteNome: string;
    clienteEmail: string;
    clienteTelefone: string;
    metodoPagamento: 'pix' | 'cartao_credito' | 'pagamento_no_local';
  }): Reserva {
    const horario = this.getHorarioById(dados.horarioId);
    if (!horario) throw new Error('Horário não encontrado');

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const codigoConfirmacao = `LM-${randomSuffix}`;

    const novaReserva: Reserva = {
      id: `res_${Date.now()}`,
      codigoConfirmacao,
      clienteId: dados.clienteId,
      clienteNome: dados.clienteNome,
      clienteEmail: dados.clienteEmail,
      clienteTelefone: dados.clienteTelefone,
      horarioId: horario.id,
      estabelecimentoId: horario.estabelecimentoId,
      servicoId: horario.servicoId,
      precoConfirmadoEmCentavos: horario.precoPromocionalInicialEmCentavos,
      metodoPagamento: dados.metodoPagamento,
      dataCriacao: new Date().toISOString(),
      status: 'confirmada',
      isDemo: true
    };

    const reservas = this.getReservas();
    reservas.unshift(novaReserva);
    localStorage.setItem(STORAGE_KEYS.RESERVAS, JSON.stringify(reservas));

    // Atualiza status do horário para reservado localmente
    this.atualizarStatusHorario(horario.id, 'reservado');
    this.notify();

    // Sincroniza com Firebase Firestore se autenticado e inicializado
    import('./firestoreService').then(({ criarReserva: fbCriarReserva }) => {
      fbCriarReserva({
        clienteId: dados.clienteId,
        proprietarioId: horario.estabelecimentoId || 'demo_owner',
        estabelecimentoId: horario.estabelecimentoId,
        servicoId: horario.servicoId,
        horarioId: horario.id,
        clienteNome: dados.clienteNome,
        estabelecimentoNome: this.getEstabelecimentoById(horario.estabelecimentoId)?.nome || 'Estabelecimento',
        servicoNome: this.getServicoById(horario.servicoId)?.nome || 'Serviço',
        inicio: new Date(horario.dataHoraInicio) as any,
        fim: new Date(horario.dataHoraFim) as any,
        precoConfirmadoCentavos: horario.precoPromocionalInicialEmCentavos,
        status: 'confirmada',
      }).catch((e) => console.log('Sincronização Firestore (opcional em modo offline):', e.message));
    }).catch(() => {});

    return novaReserva;
  }

  public cancelarReserva(reservaId: string): void {
    const reservas = this.getReservas();
    const idx = reservas.findIndex((r) => r.id === reservaId);
    if (idx !== -1) {
      reservas[idx].status = 'cancelada_pelo_cliente';
      localStorage.setItem(STORAGE_KEYS.RESERVAS, JSON.stringify(reservas));
      
      // Libera horário de volta
      this.atualizarStatusHorario(reservas[idx].horarioId, 'disponivel');
      this.notify();
    }
  }

  // --- QUERY AGREGADA (OFERTAS COMPLETAS) ---
  public getOfertasCompletas(filters?: {
    categoria?: ServiceCategory | 'todos';
    search?: string;
    maxDistanceKm?: number;
    userCoords?: { latitude: number; longitude: number };
  }): OfertaCompleta[] {
    const horarios = this.getHorarios().filter((h) => h.status === 'disponivel');
    const estabelecimentos = this.getEstabelecimentos();
    const servicos = this.getServicos();
    const userCoords = filters?.userCoords || DEFAULT_USER_COORDS;

    const ofertas: OfertaCompleta[] = [];

    for (const horario of horarios) {
      const estabelecimento = estabelecimentos.find((e) => e.id === horario.estabelecimentoId);
      const servico = servicos.find((s) => s.id === horario.servicoId);

      if (!estabelecimento || !servico) continue;

      // Filtro de categoria
      if (filters?.categoria && filters.categoria !== 'todos') {
        if (estabelecimento.categoria !== filters.categoria && servico.categoria !== filters.categoria) {
          continue;
        }
      }

      // Filtro de busca textual
      if (filters?.search && filters.search.trim().length > 0) {
        const query = filters.search.toLowerCase();
        const matchName = servico.nome.toLowerCase().includes(query);
        const matchEstablishment = estabelecimento.nome.toLowerCase().includes(query);
        const matchNeighborhood = estabelecimento.endereco.bairro.toLowerCase().includes(query);
        if (!matchName && !matchEstablishment && !matchNeighborhood) {
          continue;
        }
      }

      const distancia = calculateHaversineDistanceKm(
        userCoords.latitude,
        userCoords.longitude,
        estabelecimento.latitude,
        estabelecimento.longitude
      );

      if (filters?.maxDistanceKm && distancia > filters.maxDistanceKm) {
        continue;
      }

      const desconto = calculateDiscountPercent(
        horario.precoNormalEmCentavos,
        horario.precoPromocionalInicialEmCentavos
      );
      const economia = calculateSavingsInCents(
        horario.precoNormalEmCentavos,
        horario.precoPromocionalInicialEmCentavos
      );

      ofertas.push({
        horario,
        servico,
        estabelecimento,
        descontoPercentual: desconto,
        economiaEmCentavos: economia,
        distanciaKm: distancia
      });
    }

    return ofertas;
  }
}

export const storageRepository = new StorageRepository();
