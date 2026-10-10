import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useAuth } from '../../context/AuthContext';
import { formatCentsToBRL, calculateDiscountPercent, calculateSavingsInCents } from '../../utils/currency';
import { formatTime, formatDateBr } from '../../utils/date';
import { InputField } from '../../components/common/InputField';
import { UrgencyBanner } from '../../components/common/UrgencyBanner';

export const CheckoutPage: React.FC = () => {
  const { slotId } = useParams<{ slotId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getHorario, getEstabelecimento, getServico, criarReserva } = useMarketplace();

  const horario = getHorario(slotId || '');
  const estabelecimento = horario ? getEstabelecimento(horario.estabelecimentoId) : undefined;
  const servico = horario ? getServico(horario.servicoId) : undefined;

  const [nome, setNome] = useState(user.nome);
  const [email, setEmail] = useState(user.email);
  const [telefone, setTelefone] = useState(user.telefone || '(11) 98765-4321');
  const [metodoPagamento, setMetodoPagamento] = useState<'pix' | 'cartao_credito' | 'pagamento_no_local'>('pix');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!horario || !estabelecimento || !servico) {
    return (
      <div className="max-w-[1440px] mx-auto px-gutter py-16 text-center">
        <h2 className="text-xl font-bold text-on-surface mb-2">Horário expirado ou indisponível</h2>
        <Link to="/" className="text-sm font-semibold text-primary hover:underline">
          Voltar para a página inicial
        </Link>
      </div>
    );
  }

  const discountPercent = calculateDiscountPercent(
    horario.precoNormalEmCentavos,
    horario.precoPromocionalInicialEmCentavos
  );
  const savingsCents = calculateSavingsInCents(
    horario.precoNormalEmCentavos,
    horario.precoPromocionalInicialEmCentavos
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !email.trim() || !telefone.trim()) {
      setErrorMsg('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const novaReserva = criarReserva({
        horarioId: horario.id,
        clienteId: user.id,
        clienteNome: nome,
        clienteEmail: email,
        clienteTelefone: telefone,
        metodoPagamento
      });

      navigate(`/reserva-confirmada/${novaReserva.id}`);
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'Erro ao processar reserva');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-gutter pt-space-md pb-space-xl">
      
      {/* Top Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-on-surface-variant mb-6">
        <Link to="/" className="hover:text-primary transition-colors">Explorar</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <Link to={`/servico/${horario.id}`} className="hover:text-primary transition-colors">Detalhes</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-on-surface font-medium">Finalizar Reserva</span>
      </nav>

      {/* Micro-Urgency Countdown Banner */}
      <div className="mb-6">
        <UrgencyBanner
          label="Vaga Segura"
          prefix="Garantindo seu preço promocional por"
          initialSeconds={900}
        />
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Client Data and Payment Selection (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Section 1: Client Information */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-3 border-b border-surface-variant">
              <span className="material-symbols-outlined text-primary text-[20px]">person</span>
              <h2 className="text-base font-semibold text-on-surface">
                1. Seus dados de contato
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                icon="person_outline"
              />
              <InputField
                label="Telefone (WhatsApp)"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                required
                icon="phone"
                hint="Para envio do comprovante e lembretes"
              />
            </div>

            <InputField
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon="mail"
            />
          </div>

          {/* Section 2: Payment Method */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-3 border-b border-surface-variant">
              <span className="material-symbols-outlined text-primary text-[20px]">payments</span>
              <h2 className="text-base font-semibold text-on-surface">
                2. Forma de pagamento
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* PIX */}
              <div
                onClick={() => setMetodoPagamento('pix')}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  metodoPagamento === 'pix'
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-outline-variant bg-surface hover:border-primary/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm text-on-surface">PIX Instantâneo</span>
                  <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    metodoPagamento === 'pix' ? 'border-primary bg-primary text-on-primary' : 'border-outline'
                  }`}>
                    {metodoPagamento === 'pix' && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                  </span>
                </div>
                <span className="text-xs text-on-surface-variant">Confirmação imediata</span>
              </div>

              {/* Cartão de Crédito */}
              <div
                onClick={() => setMetodoPagamento('cartao_credito')}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  metodoPagamento === 'cartao_credito'
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-outline-variant bg-surface hover:border-primary/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm text-on-surface">Cartão de Crédito</span>
                  <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    metodoPagamento === 'cartao_credito' ? 'border-primary bg-primary text-on-primary' : 'border-outline'
                  }`}>
                    {metodoPagamento === 'cartao_credito' && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                  </span>
                </div>
                <span className="text-xs text-on-surface-variant">Em até 3x sem juros</span>
              </div>

              {/* Pagamento no Local */}
              <div
                onClick={() => setMetodoPagamento('pagamento_no_local')}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  metodoPagamento === 'pagamento_no_local'
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-outline-variant bg-surface hover:border-primary/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm text-on-surface">No Estabelecimento</span>
                  <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    metodoPagamento === 'pagamento_no_local' ? 'border-primary bg-primary text-on-primary' : 'border-outline'
                  }`}>
                    {metodoPagamento === 'pagamento_no_local' && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                  </span>
                </div>
                <span className="text-xs text-on-surface-variant">Pague ao ser atendido</span>
              </div>

            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-error-container/30 border border-error/20 text-error text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">error</span>
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

        </div>

        {/* Right Summary Column (4 cols) */}
        <div className="lg:col-span-4 sticky top-24 flex flex-col gap-4">
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-lg flex flex-col gap-5">
            
            <h3 className="text-base font-semibold text-on-surface pb-3 border-b border-surface-variant">
              Resumo da Reserva
            </h3>

            {/* Service & Venue Preview */}
            <div className="flex gap-3 items-center">
              <img
                src={estabelecimento.fotos[0]}
                alt={estabelecimento.nome}
                className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-on-surface line-clamp-1">{servico.nome}</span>
                <span className="text-xs text-on-surface-variant">{estabelecimento.nome}</span>
                <span className="text-[11px] text-primary font-medium">
                  {formatDateBr(horario.dataHoraInicio)} às {formatTime(horario.dataHoraInicio)}
                </span>
              </div>
            </div>

            {/* Detailed Pricing */}
            <div className="flex flex-col gap-2 pt-3 border-t border-surface-variant text-xs">
              <div className="flex items-center justify-between text-on-surface-variant">
                <span>Valor tabela balcão:</span>
                <span className="line-through tabular-nums">{formatCentsToBRL(horario.precoNormalEmCentavos)}</span>
              </div>
              <div className="flex items-center justify-between text-secondary font-medium">
                <span>Desconto LastMinute ({discountPercent}%):</span>
                <span className="tabular-nums">- {formatCentsToBRL(savingsCents)}</span>
              </div>
              <div className="flex items-center justify-between text-on-surface-variant">
                <span>Taxa de serviço:</span>
                <span className="font-semibold text-emerald-accent">Grátis</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-surface-variant text-base font-bold text-on-surface">
                <span>Total a pagar:</span>
                <span className="text-xl text-primary tabular-nums">
                  {formatCentsToBRL(horario.precoPromocionalInicialEmCentavos)}
                </span>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>{isSubmitting ? 'Processando...' : 'Confirmar Reserva Garantida'}</span>
            </button>

            <p className="text-[11px] text-on-surface-variant text-center">
              Ao confirmar, sua vaga fica reservada imediatamente na agenda do profissional.
            </p>

          </div>
        </div>

      </form>

    </div>
  );
};
