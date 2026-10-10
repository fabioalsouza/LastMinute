import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useAuth } from '../../context/AuthContext';
import { BookingCard } from '../../components/cards/BookingCard';
import { Modal } from '../../components/common/Modal';
import { Reserva } from '../../types';
import { formatCentsToBRL } from '../../utils/currency';
import { formatTime, formatDateBr } from '../../utils/date';
import { Link } from 'react-router-dom';

export const MyBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const {
    reservas,
    cancelarReserva,
    getEstabelecimento,
    getServico,
    getHorario
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'ativas' | 'historico'>('ativas');
  const [selectedVoucher, setSelectedVoucher] = useState<Reserva | null>(null);

  // Filtra reservas do usuário logado
  const userBookings = reservas.filter((r) => r.clienteId === user.id);

  const ativas = userBookings.filter((r) => r.status === 'confirmada');
  const historico = userBookings.filter((r) => r.status !== 'confirmada');

  const displayedList = activeTab === 'ativas' ? ativas : historico;

  const handleCancel = (reservaId: string) => {
    if (confirm('Tem certeza de que deseja cancelar esta reserva?')) {
      cancelarReserva(reservaId);
    }
  };

  const voucherVenue = selectedVoucher ? getEstabelecimento(selectedVoucher.estabelecimentoId) : null;
  const voucherService = selectedVoucher ? getServico(selectedVoucher.servicoId) : null;
  const voucherSlot = selectedVoucher ? getHorario(selectedVoucher.horarioId) : null;

  return (
    <div className="w-full max-w-[1440px] mx-auto px-gutter pt-space-lg pb-space-xl">
      
      {/* Page Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-on-surface">
            Minhas Reservas
          </h1>
          <p className="text-sm text-on-surface-variant">
            Acompanhe seus horários agendados e consulte seus comprovantes digitais.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-colors shadow-sm self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Buscar novo horário</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-surface-variant mb-6">
        <button
          onClick={() => setActiveTab('ativas')}
          className={`py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'ativas'
              ? 'text-primary border-primary'
              : 'text-on-surface-variant hover:text-on-surface border-transparent'
          }`}
        >
          <span>Agendamentos Ativos</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">
            {ativas.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('historico')}
          className={`py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'historico'
              ? 'text-primary border-primary'
              : 'text-on-surface-variant hover:text-on-surface border-transparent'
          }`}
        >
          <span>Histórico & Canceladas</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-surface-container text-on-surface-variant">
            {historico.length}
          </span>
        </button>
      </div>

      {/* Bookings List */}
      {displayedList.length > 0 ? (
        <div className="flex flex-col gap-4">
          {displayedList.map((reserva) => (
            <BookingCard
              key={reserva.id}
              reserva={reserva}
              estabelecimento={getEstabelecimento(reserva.estabelecimentoId)}
              servico={getServico(reserva.servicoId)}
              horario={getHorario(reserva.horarioId)}
              onViewVoucher={(r) => setSelectedVoucher(r)}
              onCancel={handleCancel}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 rounded-2xl bg-surface-container-lowest border border-outline-variant text-center my-6">
          <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-outline mx-auto mb-3">
            <span className="material-symbols-outlined text-2xl">event_busy</span>
          </div>
          <h3 className="text-base font-semibold text-on-surface mb-1">
            Nenhuma reserva {activeTab === 'ativas' ? 'ativa no momento' : 'no histórico'}
          </h3>
          <p className="text-xs text-on-surface-variant max-w-sm mx-auto mb-4">
            Aproveite as ofertas de última hora com até 50% de desconto hoje em salões renomados.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 h-10 px-5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-colors shadow-sm"
          >
            <span>Explorar Vagas Agora</span>
          </Link>
        </div>
      )}

      {/* Voucher Modal */}
      {selectedVoucher && voucherVenue && voucherService && (
        <Modal
          isOpen={Boolean(selectedVoucher)}
          onClose={() => setSelectedVoucher(null)}
          title="Voucher Digital LastMinute"
          maxWidth="max-w-md"
        >
          <div className="flex flex-col gap-4 text-left">
            <div className="p-4 rounded-xl bg-surface-container-low border border-surface-variant flex items-center justify-between">
              <div>
                <span className="text-[11px] text-on-surface-variant block">Código de Confirmação</span>
                <span className="text-xl font-mono font-bold text-primary">
                  {selectedVoucher.codigoConfirmacao}
                </span>
              </div>
              <span className="text-xs font-semibold text-emerald-accent px-2 py-0.5 rounded-full bg-emerald-accent/10 border border-emerald-accent/20">
                Confirmada
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-on-surface-variant block">Serviço:</span>
                <span className="font-semibold text-on-surface text-sm">{voucherService.nome}</span>
              </div>
              <div>
                <span className="text-on-surface-variant block">Estabelecimento:</span>
                <span className="font-semibold text-on-surface">{voucherVenue.nome}</span>
                <p className="text-on-surface-variant mt-0.5">
                  {voucherVenue.endereco.logradouro}, {voucherVenue.endereco.bairro}
                </p>
              </div>
              {voucherSlot && (
                <div>
                  <span className="text-on-surface-variant block">Horário agendado:</span>
                  <span className="font-semibold text-secondary">
                    {formatDateBr(voucherSlot.dataHoraInicio)} às {formatTime(voucherSlot.dataHoraInicio)}
                  </span>
                </div>
              )}
              <div className="pt-2 border-t border-surface-variant flex items-center justify-between text-sm">
                <span className="font-semibold text-on-surface">Valor pago:</span>
                <span className="font-bold text-primary text-base tabular-nums">
                  {formatCentsToBRL(selectedVoucher.precoConfirmadoEmCentavos)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${voucherVenue.latitude},${voucherVenue.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-10 rounded-lg bg-primary text-on-primary text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">directions</span>
                <span>Como Chegar</span>
              </a>
              <button
                onClick={() => setSelectedVoucher(null)}
                className="h-10 px-4 rounded-lg border border-outline-variant text-xs font-semibold hover:bg-surface-container"
              >
                Fechar
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
