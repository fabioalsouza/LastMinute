import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Estabelecimento,
  Servico,
  HorarioPublicado,
  Reserva,
  OfertaCompleta,
  ServiceCategory
} from '../types';
import { storageRepository } from '../services/storageRepository';
import { Coordinates, DEFAULT_USER_COORDS } from '../utils/distance';

interface MarketplaceContextType {
  ofertas: OfertaCompleta[];
  estabelecimentos: Estabelecimento[];
  servicos: Servico[];
  horarios: HorarioPublicado[];
  reservas: Reserva[];
  selectedCategory: ServiceCategory | 'todos';
  setSelectedCategory: (cat: ServiceCategory | 'todos') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  userCoords: Coordinates;
  requestUserLocation: () => void;
  
  // Ações de Reserva
  criarReserva: (dados: {
    horarioId: string;
    clienteId: string;
    clienteNome: string;
    clienteEmail: string;
    clienteTelefone: string;
    metodoPagamento: 'pix' | 'cartao_credito' | 'pagamento_no_local';
  }) => Reserva;
  cancelarReserva: (reservaId: string) => void;
  
  // Ações de Estabelecimento / Profissional
  publicarHorario: (dados: Omit<HorarioPublicado, 'id' | 'createdAt' | 'status' | 'isDemo'>) => HorarioPublicado;
  excluirHorario: (slotId: string) => void;
  salvarServico: (servico: Omit<Servico, 'id'> & { id?: string }) => Servico;
  excluirServico: (servicoId: string) => void;
  
  // Busca por ID
  getEstabelecimento: (id: string) => Estabelecimento | undefined;
  getServico: (id: string) => Servico | undefined;
  getHorario: (id: string) => HorarioPublicado | undefined;
  getReserva: (id: string) => Reserva | undefined;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [estabelecimentos, setEstabelecimentos] = useState<Estabelecimento[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [horarios, setHorarios] = useState<HorarioPublicado[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'todos'>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userCoords, setUserCoords] = useState<Coordinates>(DEFAULT_USER_COORDS);

  // Recarrega todos os dados do repositório
  const reloadData = useCallback(() => {
    setEstabelecimentos(storageRepository.getEstabelecimentos());
    setServicos(storageRepository.getServicos());
    setHorarios(storageRepository.getHorarios());
    setReservas(storageRepository.getReservas());
  }, []);

  useEffect(() => {
    reloadData();
    const unsubscribe = storageRepository.subscribe(reloadData);
    return () => unsubscribe();
  }, [reloadData]);

  const requestUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Geolocalização não permitida, mantendo Jardins/SP:', error);
        }
      );
    }
  };

  const ofertas = storageRepository.getOfertasCompletas({
    categoria: selectedCategory,
    search: searchQuery,
    userCoords
  });

  const criarReserva = (dados: {
    horarioId: string;
    clienteId: string;
    clienteNome: string;
    clienteEmail: string;
    clienteTelefone: string;
    metodoPagamento: 'pix' | 'cartao_credito' | 'pagamento_no_local';
  }) => {
    return storageRepository.criarReserva(dados);
  };

  const cancelarReserva = (reservaId: string) => {
    storageRepository.cancelarReserva(reservaId);
  };

  const publicarHorario = (dados: Omit<HorarioPublicado, 'id' | 'createdAt' | 'status' | 'isDemo'>) => {
    return storageRepository.publicarHorario(dados);
  };

  const excluirHorario = (slotId: string) => {
    storageRepository.excluirHorario(slotId);
  };

  const salvarServico = (servico: Omit<Servico, 'id'> & { id?: string }) => {
    return storageRepository.salvarServico(servico);
  };

  const excluirServico = (servicoId: string) => {
    storageRepository.excluirServico(servicoId);
  };

  return (
    <MarketplaceContext.Provider
      value={{
        ofertas,
        estabelecimentos,
        servicos,
        horarios,
        reservas,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        userCoords,
        requestUserLocation,
        criarReserva,
        cancelarReserva,
        publicarHorario,
        excluirHorario,
        salvarServico,
        excluirServico,
        getEstabelecimento: (id) => storageRepository.getEstabelecimentoById(id),
        getServico: (id) => storageRepository.getServicoById(id),
        getHorario: (id) => storageRepository.getHorarioById(id),
        getReserva: (id) => storageRepository.getReservaById(id)
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = (): MarketplaceContextType => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace deve ser usado dentro de um MarketplaceProvider');
  }
  return context;
};
