import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMarketplace } from '../../context/MarketplaceContext';
import { formatCentsToBRL } from '../../utils/currency';
import { formatTime, formatDateBr } from '../../utils/date';

export const ConfirmationPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { getReserva, getEstabelecimento, getServico, getHorario } = useMarketplace();
  const [copied, setCopied] = useState(false);

  const reserva = getReserva(bookingId || '');
  const horario = reserva ? getHorario(reserva.horarioId) : undefined;
  const estabelecimento = reserva ? getEstabelecimento(reserva.estabelecimentoId) : undefined;
  const servico = reserva ? getServico(reserva.servicoId) : undefined;

  if (!reserva || !estabelecimento || !servico) {
    return (
      <div className="max-w-[1440px] mx-auto px-gutter py-16 text-center">
        <h2 className="text-xl font-bold text-on-surface mb-2">Comprovante não localizado</h2>
        <Link to="/" className="text-sm font-semibold text-primary hover:underline">
          Voltar para o início
        </Link>
      </div>
    );
  }

  const { latitude, longitude, nome: venueName, endereco } = estabelecimento;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  const wazeUrl = `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;
  const uberUrl = `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=${latitude}&dropoff[longitude]=${longitude}&dropoff[nickname]=${encodeURIComponent(venueName)}`;

  const copyCode = () => {
    navigator.clipboard.writeText(reserva.codigoConfirmacao).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="w-full max-w-[800px] mx-auto px-gutter pt-space-lg pb-space-xl text-center">

      {/* Top Success Icon */}
      <div className="w-16 h-16 rounded-full bg-secondary-container/50 border border-secondary text-primary mx-auto flex items-center justify-center mb-4 shadow-md">
        <span className="material-symbols-outlined text-[36px]">check_circle</span>
      </div>

      <span className="text-xs font-semibold text-secondary uppercase tracking-widest block mb-1">
        Agendamento Garantido
      </span>
      <h1 className="text-3xl font-bold tracking-tight text-on-surface mb-2">
        Sua vaga está confirmada!
      </h1>
      <p className="text-sm text-on-surface-variant max-w-md mx-auto mb-8">
        Apresente este voucher digital na recepção do salão ao chegar.
      </p>

      {/* Voucher Card */}
      <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-lg overflow-hidden text-left mb-6">

        {/* Voucher Header */}
        <div className="p-6 bg-surface-container-low border-b border-surface-variant flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-on-surface-variant block mb-0.5">Código de Confirmação</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-mono font-bold text-primary tracking-wider">
                {reserva.codigoConfirmacao}
              </span>
              <button
                onClick={copyCode}
                className="p-1 rounded-md text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
                title="Copiar código"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {copied ? 'check' : 'content_copy'}
                </span>
              </button>
            </div>
            {copied && (
              <span className="text-[11px] text-secondary mt-0.5 block">Código copiado!</span>
            )}
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-accent/15 text-primary border border-emerald-accent/30 flex items-center gap-1 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            Ativo no estabelecimento
          </span>
        </div>

        {/* Voucher Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Left: Service Details */}
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-xs text-on-surface-variant block mb-1">Serviço</span>
              <span className="text-base font-semibold text-on-surface">{servico.nome}</span>
              <span className="text-xs text-on-surface-variant block">{servico.duracaoMinutos} min de atendimento</span>
            </div>

            <div>
              <span className="text-xs text-on-surface-variant block mb-1">Profissional</span>
              <span className="text-sm font-semibold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-secondary">badge</span>
                {horario?.profissionalNome || 'Especialista da casa'}
              </span>
            </div>

            <div>
              <span className="text-xs text-on-surface-variant block mb-1">Valor Confirmado</span>
              <span className="text-xl font-bold text-primary tabular-nums">
                {formatCentsToBRL(reserva.precoConfirmadoEmCentavos)}
              </span>
              <span className="text-[11px] text-on-surface-variant block capitalize">
                Pagamento: {reserva.metodoPagamento.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Right: Location */}
          <div className="flex flex-col gap-4 bg-surface-container-low p-4 rounded-xl border border-surface-variant">
            <div>
              <span className="text-xs text-on-surface-variant block mb-1">Estabelecimento</span>
              <span className="text-base font-semibold text-on-surface">{venueName}</span>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                {endereco.logradouro}, {endereco.bairro}<br />
                {endereco.cidade} - {endereco.uf}
              </p>
              <span className="text-xs text-on-surface-variant mt-2 block">
                Telefone: <strong className="text-on-surface">{estabelecimento.telefone}</strong>
              </span>
            </div>

            {horario && (
              <div className="pt-3 border-t border-surface-variant">
                <span className="text-xs text-on-surface-variant block mb-1">Horário Agendado</span>
                <span className="text-sm font-bold text-secondary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  {formatDateBr(horario.dataHoraInicio)} às {formatTime(horario.dataHoraInicio)}
                </span>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex flex-col gap-2 pt-1">
              <p className="text-[11px] text-on-surface-variant font-medium uppercase tracking-wide mb-0.5">
                Como chegar:
              </p>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-full rounded-lg bg-surface-container-lowest border border-outline-variant hover:border-primary text-on-surface text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 4C15.16 4 8 11.16 8 20C8 31.25 22.26 43.49 22.87 44.01C23.22 44.31 23.61 44.5 24 44.5C24.39 44.5 24.78 44.31 25.13 44.01C25.74 43.49 40 31.25 40 20C40 11.16 32.84 4 24 4ZM24 27C20.13 27 17 23.87 17 20C17 16.13 20.13 13 24 13C27.87 13 31 16.13 31 20C31 23.87 27.87 27 24 27Z" fill="#4285F4"/>
                </svg>
                Google Maps
              </a>

              <a
                href={wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-full rounded-lg bg-[#00CEEB]/10 border border-[#00CEEB]/30 hover:bg-[#00CEEB]/20 text-on-surface text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <ellipse cx="16" cy="17" rx="13" ry="12" fill="#00CEEB"/>
                  <path d="M16 5C9.37 5 4 10.37 4 17C4 23.63 9.37 29 16 29C22.63 29 28 23.63 28 17C28 10.37 22.63 5 16 5Z" fill="#00CEEB"/>
                  <circle cx="12" cy="20" r="2" fill="#333"/>
                  <circle cx="20" cy="20" r="2" fill="#333"/>
                  <path d="M12 15 Q16 12 20 15" stroke="#333" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                </svg>
                Waze
              </a>

              <a
                href={uberUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-full rounded-lg bg-black text-white border border-transparent hover:bg-gray-900 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z"/>
                  <path d="M8 8h8v8H8z"/>
                </svg>
                Pedir Uber
              </a>
            </div>

          </div>

        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          to="/minhas-reservas"
          className="w-full sm:w-auto h-12 px-6 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">receipt_long</span>
          <span>Ir para Minhas Reservas</span>
        </Link>

        <Link
          to="/"
          className="w-full sm:w-auto h-12 px-6 rounded-xl border border-outline-variant hover:bg-surface-container text-on-surface text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <span>Buscar mais vagas</span>
        </Link>
      </div>

    </div>
  );
};
