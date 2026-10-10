import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMarketplace } from '../../context/MarketplaceContext';
import { formatCentsToBRL } from '../../utils/currency';
import { formatTime, formatDateBr } from '../../utils/date';
import { StatusBadge } from '../../components/common/StatusBadge';

export const PublishedSlotsPage: React.FC = () => {
  const { horarios, servicos, estabelecimentos, excluirHorario } = useMarketplace();
  const myVenue = estabelecimentos[0];

  const [filter, setFilter] = useState<'todos' | 'disponivel' | 'reservado'>('todos');

  const mySlots = horarios.filter((h) => h.estabelecimentoId === myVenue.id);
  const filteredSlots = mySlots.filter((h) => (filter === 'todos' ? true : h.status === filter));

  const handleDelete = (slotId: string) => {
    if (confirm('Tem certeza de que deseja remover esta vaga publicada?')) {
      excluirHorario(slotId);
    }
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-gutter pt-space-lg pb-space-xl flex flex-col gap-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-on-surface-variant font-medium">
              {myVenue?.nome}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-on-surface">
            Gestão de Horários Publicados
          </h1>
          <p className="text-sm text-on-surface-variant">
            Gerencie todas as vagas relâmpago ativas e monitoramento de preenchimento.
          </p>
        </div>

        <Link
          to="/negocios/publicar"
          className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-colors shadow-sm self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Publicar Novo Horário</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-surface-variant pb-2">
        <button
          onClick={() => setFilter('todos')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'todos' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          Todos ({mySlots.length})
        </button>
        <button
          onClick={() => setFilter('disponivel')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'disponivel' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          Disponíveis no Feed ({mySlots.filter((s) => s.status === 'disponivel').length})
        </button>
        <button
          onClick={() => setFilter('reservado')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'reservado' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          Preenchidos ({mySlots.filter((s) => s.status === 'reservado').length})
        </button>
      </div>

      {/* Table Shell (Level 1 Elevation) */}
      <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container-low border-b border-surface-variant text-on-surface-variant uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Horário & Data</th>
                <th className="py-3.5 px-4">Serviço</th>
                <th className="py-3.5 px-4">Profissional</th>
                <th className="py-3.5 px-4">Preço Tabela</th>
                <th className="py-3.5 px-4">Preço Promocional</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-variant">
              {filteredSlots.length > 0 ? (
                filteredSlots.map((slot) => {
                  const servico = servicos.find((s) => s.id === slot.servicoId);
                  return (
                    <tr key={slot.id} className="hover:bg-surface-container transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-on-surface tabular-nums">
                        {formatTime(slot.dataHoraInicio)}
                        <span className="text-[11px] text-on-surface-variant block font-normal">
                          {formatDateBr(slot.dataHoraInicio)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-on-surface">
                        {servico?.nome || 'Serviço'}
                      </td>
                      <td className="py-3.5 px-4 text-on-surface-variant">
                        {slot.profissionalNome}
                      </td>
                      <td className="py-3.5 px-4 text-outline line-through tabular-nums">
                        {formatCentsToBRL(slot.precoNormalEmCentavos)}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-primary tabular-nums">
                        {formatCentsToBRL(slot.precoPromocionalInicialEmCentavos)}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge
                          type="status"
                          label={slot.status === 'disponivel' ? 'No Ar' : 'Reservado'}
                          statusType={slot.status}
                        />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDelete(slot.id)}
                          className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-error/10 transition-colors"
                          title="Excluir vaga"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-on-surface-variant">
                    Nenhum horário encontrado nesta categoria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
