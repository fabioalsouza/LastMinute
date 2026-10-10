import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Servico, ServiceCategory } from '../../types';
import { formatCentsToBRL, parseBRLInputToCents } from '../../utils/currency';
import { Modal } from '../../components/common/Modal';
import { InputField } from '../../components/common/InputField';

export const ServicesCatalogPage: React.FC = () => {
  const { servicos, estabelecimentos, salvarServico, excluirServico } = useMarketplace();
  const myVenue = estabelecimentos[0];

  const myServices = servicos.filter((s) => s.estabelecimentoId === myVenue.id);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Servico | null>(null);

  // Form State
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState<ServiceCategory>('barbearia');
  const [duracaoMinutos, setDuracaoMinutos] = useState(45);
  const [precoStr, setPrecoStr] = useState('120,00');
  const [descricao, setDescricao] = useState('');

  const openNewServiceModal = () => {
    setEditingService(null);
    setNome('');
    setCategoria('barbearia');
    setDuracaoMinutos(45);
    setPrecoStr('120,00');
    setDescricao('');
    setIsModalOpen(true);
  };

  const openEditModal = (s: Servico) => {
    setEditingService(s);
    setNome(s.nome);
    setCategoria(s.categoria);
    setDuracaoMinutos(s.duracaoMinutos);
    setPrecoStr((s.precoNormalEmCentavos / 100).toFixed(2).replace('.', ','));
    setDescricao(s.descricao || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cents = parseBRLInputToCents(precoStr);
    if (!nome.trim() || cents <= 0) {
      alert('Preencha um nome e preço válidos');
      return;
    }

    salvarServico({
      id: editingService?.id,
      estabelecimentoId: myVenue.id,
      nome,
      categoria,
      duracaoMinutos: Number(duracaoMinutos),
      precoNormalEmCentavos: cents,
      descricao,
      ativo: true,
      isDemo: true
    });

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza de que deseja remover este serviço do catálogo?')) {
      excluirServico(id);
    }
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-gutter pt-space-lg pb-space-xl flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-on-surface-variant font-medium">
              {myVenue?.nome}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-on-surface">
            Catálogo de Serviços
          </h1>
          <p className="text-sm text-on-surface-variant">
            Cadastre os serviços oferecidos e seus preços-base de balcão para publicação de ofertas.
          </p>
        </div>

        <button
          onClick={openNewServiceModal}
          className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-colors shadow-sm self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Adicionar Serviço</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {myServices.map((srv) => (
          <div
            key={srv.id}
            className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary uppercase tracking-wider">
                  {srv.categoria}
                </span>
                <span className="text-xs text-on-surface-variant font-medium">
                  {srv.duracaoMinutos} min
                </span>
              </div>
              <h3 className="text-base font-semibold text-on-surface mb-1">
                {srv.nome}
              </h3>
              <p className="text-xs text-on-surface-variant line-clamp-2 mb-4">
                {srv.descricao || 'Sem descrição cadastrada'}
              </p>
            </div>

            <div className="pt-3 border-t border-surface-variant flex items-center justify-between">
              <div>
                <span className="text-[11px] text-on-surface-variant block">Preço de balcão</span>
                <span className="text-base font-bold text-on-surface tabular-nums">
                  {formatCentsToBRL(srv.precoNormalEmCentavos)}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(srv)}
                  className="p-1.5 rounded-lg text-outline hover:text-primary hover:bg-primary/5 transition-colors"
                  title="Editar serviço"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
                <button
                  onClick={() => handleDelete(srv.id)}
                  className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-error/10 transition-colors"
                  title="Excluir serviço"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit Service */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? 'Editar Serviço' : 'Novo Serviço'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          <InputField
            label="Nome do serviço"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Corte Degrade & Barba Terapia"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface">Categoria</label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value as ServiceCategory)}
                className="h-12 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 text-sm"
              >
                <option value="barbearia">Barbearia</option>
                <option value="cabelo">Cabelo</option>
                <option value="unhas">Unhas</option>
                <option value="estetica">Estética</option>
                <option value="massagem">Massagem</option>
              </select>
            </div>

            <InputField
              label="Duração (minutos)"
              type="number"
              value={duracaoMinutos}
              onChange={(e) => setDuracaoMinutos(Number(e.target.value))}
              min={15}
              max={240}
              required
            />
          </div>

          <InputField
            label="Preço normal de tabela (R$)"
            value={precoStr}
            onChange={(e) => setPrecoStr(e.target.value)}
            placeholder="120,00"
            required
            hint="Armazenado em centavos (ex: 12000)"
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface">Descrição do serviço</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
              placeholder="Detalhes sobre o procedimento e benefícios..."
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-3 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-variant">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="h-10 px-4 rounded-lg border border-outline-variant text-xs font-semibold hover:bg-surface-container"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="h-10 px-5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold"
            >
              Salvar Serviço
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
