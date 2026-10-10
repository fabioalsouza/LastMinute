import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: UserRole;
  requireRealAuth?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRole,
  requireRealAuth = false,
}) => {
  const { activeRole, isRealAuth, loading, openAuthModal } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <span className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  // Se requer autenticação real e não está logado via Firebase
  if (requireRealAuth && !isRealAuth) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Se a rota requer um papel específico e o usuário está no papel oposto
  if (allowedRole && activeRole !== allowedRole) {
    if (allowedRole === 'profissional') {
      return (
        <div className="max-w-xl mx-auto my-16 p-8 text-center bg-surface border border-outline-variant/70 rounded-3xl shadow-lg">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[32px]">storefront</span>
          </div>
          <h2 className="text-xl font-bold text-on-surface mb-2">Área Exclusiva para Negócios</h2>
          <p className="text-sm text-on-surface-variant mb-6">
            Você está atualmente no <strong>Modo Cliente</strong>. Para gerenciar horários, serviços e faturamento da sua empresa, alterne para o modo profissional.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => openAuthModal('register', 'profissional')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold transition-all shadow-xs"
            >
              Criar Conta Negócio
            </button>
            <Navigate to="/" replace />
          </div>
        </div>
      );
    } else {
      return <Navigate to="/negocios/dashboard" replace />;
    }
  }

  return <>{children}</>;
};
