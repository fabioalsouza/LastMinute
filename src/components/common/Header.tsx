import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '../../context/AuthContext';
import { SecurityRulesTestModal } from './SecurityRulesTestModal';
import { AuthModal } from './AuthModal';

export const Header: React.FC = () => {
  const {
    user,
    activeRole,
    setRole,
    isRealAuth,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    logout,
  } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isClient = activeRole === 'cliente';

  const clientLinks = [
    { label: 'Explorar', path: '/' },
    { label: 'Mapa', path: '/mapa' },
    { label: 'Minhas reservas', path: '/minhas-reservas' },
  ];

  const businessLinks = [
    { label: 'Painel', path: '/negocios/dashboard' },
    { label: 'Publicar horário', path: '/negocios/publicar' },
    { label: 'Horários publicados', path: '/negocios/horarios' },
    { label: 'Serviços', path: '/negocios/servicos' },
  ];

  const navLinks = isClient ? clientLinks : businessLinks;

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/' || location.pathname === '/explorar';
    return location.pathname.startsWith(path);
  };

  const handleRoleSwitch = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'profissional') {
      navigate('/negocios/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-surface/90 backdrop-blur-md border-b border-surface-variant">
        <div className="h-[72px] max-w-[1440px] mx-auto px-gutter flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-space-md">
            <Link to={isClient ? '/' : '/negocios/dashboard'} className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all">
                <span className="material-symbols-outlined text-[20px]">timelapse</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-semibold text-2xl tracking-tight text-on-surface lowercase">
                  lastminute
                </span>
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                  isClient
                    ? 'bg-primary/10 text-primary'
                    : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                }`}>
                  {isClient ? 'Cliente' : 'Negócio'}
                </span>
              </div>
            </Link>

            {/* Botão Laboratório de Regras */}
            <button
              onClick={() => setIsTestModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all cursor-pointer shadow-xs"
              title="Testar regras do Firestore e conexões Firebase"
            >
              <span className="material-symbols-outlined text-[14px]">security</span>
              <span>Regras Firebase</span>
            </button>
          </div>

          {/* Central Navigation */}
          <nav className="hidden md:flex items-center gap-space-lg">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`py-2 text-sm font-semibold transition-colors border-b-2 ${
                    active
                      ? 'text-primary border-primary'
                      : 'text-on-surface-variant hover:text-on-surface border-transparent'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions & Role Switcher */}
          <div className="flex items-center gap-2.5">
            {/* Switcher Rápido de Visão: Negócios / Cliente */}
            <button
              onClick={() => handleRoleSwitch(isClient ? 'profissional' : 'cliente')}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-surface-container-low border border-outline-variant text-xs font-semibold text-on-surface hover:bg-surface-container-high transition-colors shadow-xs"
              title="Alternar entre visão de cliente e visão de gestão do negócio"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">
                {isClient ? 'storefront' : 'person'}
              </span>
              <span className="hidden sm:inline">{isClient ? 'Painel Negócios' : 'Visão Cliente'}</span>
            </button>

            {/* Autenticação: Botão Entrar ou Dropdown de Perfil */}
            {!isRealAuth ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openAuthModal('login', activeRole)}
                  className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-surface-container-high border border-outline hover:border-primary text-xs font-bold text-on-surface hover:bg-surface-container-highest transition-all shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">login</span>
                  <span>Entrar</span>
                </button>
                <button
                  onClick={() => openAuthModal('register', activeRole)}
                  className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-primary hover:bg-primary-container text-xs font-bold text-on-primary transition-all shadow-xs cursor-pointer"
                >
                  <span>Cadastrar</span>
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-2 rounded-full border border-outline-variant hover:border-outline bg-surface-container-lowest transition-all"
                >
                  <div className="flex flex-col text-right hidden sm:flex">
                    <span className="text-xs font-bold text-on-surface leading-tight max-w-[120px] truncate">
                      {user?.nome || 'Usuário'}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center justify-end gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {activeRole === 'profissional' ? 'Negócio' : 'Cliente'}
                    </span>
                  </div>
                  <img
                    src={user?.fotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
                    alt={user?.nome || 'Perfil'}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20"
                  />
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant pr-1">
                    expand_more
                  </span>
                </button>

                {/* Dropdown Menu do Usuário */}
                {isUserMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-surface border border-outline-variant/80 shadow-xl py-2 z-50 animate-fade-in"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-surface-variant">
                      <p className="text-xs font-bold text-on-surface truncate">{user?.nome}</p>
                      <p className="text-[11px] text-on-surface-variant truncate">{user?.email}</p>
                    </div>

                    <div className="py-1">
                      {isClient ? (
                        <>
                          <Link
                            to="/minhas-reservas"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-on-surface hover:bg-surface-container transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px] text-primary">confirmation_number</span>
                            Minhas Reservas
                          </Link>
                          <button
                            onClick={() => handleRoleSwitch('profissional')}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-on-surface hover:bg-surface-container text-left transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px] text-amber-500">storefront</span>
                            Ir para Painel do Negócio
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/negocios/dashboard"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-on-surface hover:bg-surface-container transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px] text-primary">dashboard</span>
                            Painel de Ocupação
                          </Link>
                          <Link
                            to="/negocios/publicar"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-on-surface hover:bg-surface-container transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px] text-primary">add_circle</span>
                            Publicar Horário
                          </Link>
                          <button
                            onClick={() => handleRoleSwitch('cliente')}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-on-surface hover:bg-surface-container text-left transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px] text-primary">person</span>
                            Modo Cliente
                          </button>
                        </>
                      )}
                    </div>

                    <div className="border-t border-surface-variant pt-1 mt-1">
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 text-left transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        Sair da conta
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Mobile Subnav */}
        <div className="md:hidden flex items-center justify-around bg-surface border-t border-surface-variant px-2 py-2">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-xs font-medium py-1 px-2.5 rounded-md ${
                  active ? 'text-primary font-semibold bg-primary/10' : 'text-on-surface-variant'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </header>

      {/* Modal Interativo de Autenticação */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        defaultRole={activeRole}
      />

      {/* Modal Interativo de Teste de Regras */}
      <SecurityRulesTestModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
      />
    </>
  );
};

