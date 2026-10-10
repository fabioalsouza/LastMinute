import { Estabelecimento, Servico, HorarioPublicado, Reserva, Usuario } from '../types';

export const DEMO_USER: Usuario = {
  id: 'usr_lucas_ribeiro',
  nome: 'Lucas Ribeiro',
  email: 'lucas.ribeiro@exemplo.com.br',
  fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
  telefone: '(11) 98765-4321',
  papel: 'ambos',
  estabelecimentoId: 'est_01_jardins_barber',
  isDemo: true,
};

export const INITIAL_ESTABELECIMENTOS: Estabelecimento[] = [
  {
    id: 'est_01_jardins_barber',
    nome: 'Barbearia República dos Jardins',
    categoria: 'barbearia',
    descricao: 'Especializada em cortes masculinos clássicos e modernos, barba na toalha quente e cuidados com navalha.',
    endereco: {
      logradouro: 'Rua Oscar Freire, 1128',
      bairro: 'Jardins',
      cidade: 'São Paulo',
      uf: 'SP',
      cep: '01426-001',
      complemento: 'Sala 04'
    },
    latitude: -23.5638,
    longitude: -46.6672,
    fotos: [
      'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800'
    ],
    nota: 4.9,
    totalAvaliacoes: 312,
    telefone: '(11) 3088-9922',
    isDemo: true,
    ownerId: 'usr_lucas_ribeiro',
    createdAt: new Date().toISOString()
  },
  {
    id: 'est_02_itaim_cabelo',
    nome: 'Atelier Capilar & Spa Itaim',
    categoria: 'cabelo',
    descricao: 'Cortes exclusivos, hidratações profundas e mechas com produtos orgânicos importados.',
    endereco: {
      logradouro: 'Rua Joaquim Floriano, 834',
      bairro: 'Itaim Bibi',
      cidade: 'São Paulo',
      uf: 'SP',
      cep: '04534-003'
    },
    latitude: -23.5842,
    longitude: -46.6791,
    fotos: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800'
    ],
    nota: 4.8,
    totalAvaliacoes: 420,
    telefone: '(11) 3168-1200',
    isDemo: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'est_03_pinheiros_unhas',
    nome: 'Lumière Nail & Care Lounge',
    categoria: 'unhas',
    descricao: 'Esmaltação em gel premium, manicure russa e spa completo para mãos e pés.',
    endereco: {
      logradouro: 'Rua dos Pinheiros, 540',
      bairro: 'Pinheiros',
      cidade: 'São Paulo',
      uf: 'SP',
      cep: '05422-001'
    },
    latitude: -23.5654,
    longitude: -46.6859,
    fotos: [
      'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=800'
    ],
    nota: 4.9,
    totalAvaliacoes: 215,
    telefone: '(11) 3062-4411',
    isDemo: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'est_04_moema_massagem',
    nome: 'Zenith Spa Urbano & Terapias',
    categoria: 'massagem',
    descricao: 'Massagem relaxante profunda, shiatsu e drenagem linfática em salas climatizadas com aromaterapia.',
    endereco: {
      logradouro: 'Av. Moema, 310',
      bairro: 'Moema',
      cidade: 'São Paulo',
      uf: 'SP',
      cep: '04077-020'
    },
    latitude: -23.6015,
    longitude: -46.6635,
    fotos: [
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800'
    ],
    nota: 5.0,
    totalAvaliacoes: 189,
    telefone: '(11) 5051-7788',
    isDemo: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'est_05_vila_madalena_estetica',
    nome: 'Clínica Dermatocare Vila Madá',
    categoria: 'estetica',
    descricao: 'Procedimentos faciais não invasivos, limpeza de pele ultrassônica e revitalização com LED.',
    endereco: {
      logradouro: 'Rua Fradique Coutinho, 980',
      bairro: 'Vila Madalena',
      cidade: 'São Paulo',
      uf: 'SP',
      cep: '05416-001'
    },
    latitude: -23.5570,
    longitude: -46.6912,
    fotos: [
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1512290900672-1f486d38e244?auto=format&fit=crop&q=80&w=800'
    ],
    nota: 4.7,
    totalAvaliacoes: 98,
    telefone: '(11) 3814-5500',
    isDemo: true,
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_SERVICOS: Servico[] = [
  // Serviços Barbearia
  {
    id: 'srv_barber_01',
    estabelecimentoId: 'est_01_jardins_barber',
    nome: 'Corte Tradicional na Tesoura & Styling',
    categoria: 'barbearia',
    duracaoMinutos: 45,
    precoNormalEmCentavos: 13000, // R$ 130,00
    descricao: 'Lavagem com xampu esfoliante, corte personalizado com tesoura e acabamento impecável.',
    ativo: true,
    isDemo: true
  },
  {
    id: 'srv_barber_02',
    estabelecimentoId: 'est_01_jardins_barber',
    nome: 'Barba Terapia com Toalha Quente',
    categoria: 'barbearia',
    duracaoMinutos: 35,
    precoNormalEmCentavos: 9000, // R$ 90,00
    descricao: 'Modelagem com navalha descartável, óleos essenciais e toalha aromatizada a vapor.',
    ativo: true,
    isDemo: true
  },
  // Serviços Cabelo
  {
    id: 'srv_cabelo_01',
    estabelecimentoId: 'est_02_itaim_cabelo',
    nome: 'Corte Conceito & Escova Modelada',
    categoria: 'cabelo',
    duracaoMinutos: 60,
    precoNormalEmCentavos: 24000, // R$ 240,00
    descricao: 'Diagnóstico dos fios, corte de alinhamento e finalização com proteção térmica.',
    ativo: true,
    isDemo: true
  },
  {
    id: 'srv_cabelo_02',
    estabelecimentoId: 'est_02_itaim_cabelo',
    nome: 'Tratamento Reconstrutor Kérastase',
    categoria: 'cabelo',
    duracaoMinutos: 50,
    precoNormalEmCentavos: 28000, // R$ 280,00
    descricao: 'Ritual de infusão lipídica para reparação profunda de fios ressecados ou danificados.',
    ativo: true,
    isDemo: true
  },
  // Serviços Unhas
  {
    id: 'srv_unhas_01',
    estabelecimentoId: 'est_03_pinheiros_unhas',
    nome: 'Manicure e Pedicure com Esmaltação em Gel',
    categoria: 'unhas',
    duracaoMinutos: 75,
    precoNormalEmCentavos: 16000, // R$ 160,00
    descricao: 'Cutilagem russa segura, esmaltação que dura até 21 dias e massagem relaxante.',
    ativo: true,
    isDemo: true
  },
  // Serviços Massagem
  {
    id: 'srv_massagem_01',
    estabelecimentoId: 'est_04_moema_massagem',
    nome: 'Massagem Relaxante com Óleos Essenciais',
    categoria: 'massagem',
    duracaoMinutos: 60,
    precoNormalEmCentavos: 21000, // R$ 210,00
    descricao: 'Manobras suaves e envolventes para liberação de tensões musculares e bem-estar total.',
    ativo: true,
    isDemo: true
  },
  // Serviços Estética
  {
    id: 'srv_estetica_01',
    estabelecimentoId: 'est_05_vila_madalena_estetica',
    nome: 'Limpeza de Pele Profunda + Peeling de Diamante',
    categoria: 'estetica',
    duracaoMinutos: 70,
    precoNormalEmCentavos: 23000, // R$ 230,00
    descricao: 'Extração indolor com vácuo, máscara calmante e máscara de LED regeneradora.',
    ativo: true,
    isDemo: true
  }
];

// Gera horários para hoje com timestamps dinâmicos
function getTodayIso(hour: number, minute: number): string {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

export const INITIAL_HORARIOS: HorarioPublicado[] = [
  {
    id: 'slot_01_barber',
    estabelecimentoId: 'est_01_jardins_barber',
    servicoId: 'srv_barber_01',
    profissionalNome: 'Matheus Costa',
    dataHoraInicio: getTodayIso(14, 30),
    dataHoraFim: getTodayIso(15, 15),
    precoPromocionalInicialEmCentavos: 8500, // R$ 85,00 (de R$ 130,00 = -35%)
    precoNormalEmCentavos: 13000,
    descontoAutomatico: {
      ativado: true,
      descontoAdicionalPercentual: 10,
      minutosAntesDoInicio: 45
    },
    status: 'disponivel',
    isDemo: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'slot_02_barber',
    estabelecimentoId: 'est_01_jardins_barber',
    servicoId: 'srv_barber_02',
    profissionalNome: 'Lucas Santana',
    dataHoraInicio: getTodayIso(16, 0),
    dataHoraFim: getTodayIso(16, 35),
    precoPromocionalInicialEmCentavos: 5500, // R$ 55,00 (de R$ 90,00 = -39%)
    precoNormalEmCentavos: 9000,
    descontoAutomatico: {
      ativado: false,
      descontoAdicionalPercentual: 0,
      minutosAntesDoInicio: 0
    },
    status: 'disponivel',
    isDemo: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'slot_03_cabelo',
    estabelecimentoId: 'est_02_itaim_cabelo',
    servicoId: 'srv_cabelo_01',
    profissionalNome: 'Juliana Vieira',
    dataHoraInicio: getTodayIso(15, 0),
    dataHoraFim: getTodayIso(16, 0),
    precoPromocionalInicialEmCentavos: 14900, // R$ 149,00 (de R$ 240,00 = -38%)
    precoNormalEmCentavos: 24000,
    descontoAutomatico: {
      ativado: true,
      descontoAdicionalPercentual: 15,
      minutosAntesDoInicio: 60
    },
    status: 'disponivel',
    isDemo: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'slot_04_unhas',
    estabelecimentoId: 'est_03_pinheiros_unhas',
    servicoId: 'srv_unhas_01',
    profissionalNome: 'Bianca Ramos',
    dataHoraInicio: getTodayIso(15, 30),
    dataHoraFim: getTodayIso(16, 45),
    precoPromocionalInicialEmCentavos: 9900, // R$ 99,00 (de R$ 160,00 = -38%)
    precoNormalEmCentavos: 16000,
    descontoAutomatico: {
      ativado: true,
      descontoAdicionalPercentual: 10,
      minutosAntesDoInicio: 30
    },
    status: 'disponivel',
    isDemo: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'slot_05_massagem',
    estabelecimentoId: 'est_04_moema_massagem',
    servicoId: 'srv_massagem_01',
    profissionalNome: 'Paula Tanaka',
    dataHoraInicio: getTodayIso(17, 0),
    dataHoraFim: getTodayIso(18, 0),
    precoPromocionalInicialEmCentavos: 12900, // R$ 129,00 (de R$ 210,00 = -39%)
    precoNormalEmCentavos: 21000,
    descontoAutomatico: {
      ativado: false,
      descontoAdicionalPercentual: 0,
      minutosAntesDoInicio: 0
    },
    status: 'disponivel',
    isDemo: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'slot_06_estetica',
    estabelecimentoId: 'est_05_vila_madalena_estetica',
    servicoId: 'srv_estetica_01',
    profissionalNome: 'Dra. Camila Duarte',
    dataHoraInicio: getTodayIso(16, 30),
    dataHoraFim: getTodayIso(17, 40),
    precoPromocionalInicialEmCentavos: 13900, // R$ 139,00 (de R$ 230,00 = -40%)
    precoNormalEmCentavos: 23000,
    descontoAutomatico: {
      ativado: true,
      descontoAdicionalPercentual: 10,
      minutosAntesDoInicio: 60
    },
    status: 'disponivel',
    isDemo: true,
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_RESERVAS: Reserva[] = [
  {
    id: 'res_demo_01',
    codigoConfirmacao: 'LM-84920',
    clienteId: 'usr_lucas_ribeiro',
    clienteNome: 'Lucas Ribeiro',
    clienteEmail: 'lucas.ribeiro@exemplo.com.br',
    clienteTelefone: '(11) 98765-4321',
    horarioId: 'slot_01_barber',
    estabelecimentoId: 'est_01_jardins_barber',
    servicoId: 'srv_barber_01',
    precoConfirmadoEmCentavos: 8500,
    metodoPagamento: 'pix',
    dataCriacao: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'confirmada',
    isDemo: true
  }
];
