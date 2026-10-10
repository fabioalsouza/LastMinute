import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth, UserRole } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const roleParam = (searchParams.get('tipo') as UserRole) || 'cliente';
  const redirectTo = searchParams.get('redirect') || '/';

  const {
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    sendPasswordReset,
    useDemoAccount,
    isRealAuth,
    user,
    activeRole,
    logout,
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>(roleParam);

  // Form states
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefone, setTelefone] = useState('');

  const formatPhone = (value: string) => {
    // Remove tudo que não é dígito
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  // Status
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const resetForm = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleSuccessRedirect = (roleToRedirect: UserRole) => {
    if (roleToRedirect === 'profissional') {
      navigate(redirectTo.startsWith('/negocios') ? redirectTo : '/negocios/dashboard');
    } else {
      navigate(redirectTo !== '/login' ? redirectTo : '/');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        if (!email || !password) throw new Error('Preencha seu e-mail e senha.');
        await loginWithEmail(email, password);
        handleSuccessRedirect(activeRole);
      } else if (mode === 'register') {
        if (!nome.trim() || !email || !password) {
          throw new Error('Preencha seu nome, e-mail e uma senha de no mínimo 6 dígitos.');
        }
        await registerWithEmail(nome, email, password, selectedRole, telefone);
        handleSuccessRedirect(selectedRole);
      } else if (mode === 'forgot') {
        if (!email) throw new Error('Informe o e-mail para recuperação.');
        await sendPasswordReset(email);
        setSuccessMsg('Enviamos instruções de redefinição de senha para o seu e-mail.');
      }
    } catch (err: any) {
      console.error('Erro de autenticação:', err);
      let msg = err.message || 'Erro ao realizar login.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'E-mail ou senha incorretos.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'Este e-mail já está cadastrado. Tente entrar.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'A senha precisa ter pelo menos 6 dígitos.';
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      await loginWithGoogle(selectedRole);
      handleSuccessRedirect(selectedRole);
    } catch (err: any) {
      console.error('Erro Google:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMsg(err.message || 'Falha ao autenticar com o Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (role: UserRole) => {
    useDemoAccount(role);
    handleSuccessRedirect(role);
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-gutter py-12">
      <div className="w-full max-w-lg bg-surface border border-outline-variant/80 rounded-3xl p-6 sm:p-10 shadow-xl flex flex-col gap-6">
        
        {/* Brand header */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[28px]">timelapse</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface">
            {mode === 'login' ? 'Bem-vindo de volta' : mode === 'register' ? 'Crie sua conta no LastMinute' : 'Redefinir sua senha'}
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-sm">
            {mode === 'login'
              ? 'Acesse para gerenciar suas reservas ou vagas relâmpago do seu estabelecimento.'
              : mode === 'register'
              ? 'Conecte-se às melhores vagas com desconto imediato ou publique horários ociosos.'
              : 'Digite seu e-mail cadastrado para receber o link de recuperação.'}
          </p>
        </div>

        {/* Já conectado com Firebase info */}
        {isRealAuth && user && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={user.fotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
                alt={user.nome}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/30"
              />
              <div>
                <p className="text-xs font-bold text-on-surface">Conectado como {user.nome}</p>
                <p className="text-[11px] text-on-surface-variant">{user.email} • Perfil: {activeRole === 'profissional' ? 'Negócio' : 'Cliente'}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="text-xs font-semibold text-rose-500 hover:underline"
            >
              Sair
            </button>
          </div>
        )}

        {/* Mode switcher tabs */}
        {mode !== 'forgot' && (
          <div className="grid grid-cols-2 p-1.5 bg-surface-container-high rounded-2xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                resetForm();
              }}
              className={`py-2.5 rounded-xl transition-all ${
                mode === 'login'
                  ? 'bg-surface text-primary shadow-xs font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                resetForm();
              }}
              className={`py-2.5 rounded-xl transition-all ${
                mode === 'register'
                  ? 'bg-surface text-primary shadow-xs font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Cadastre-se
            </button>
          </div>
        )}

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-medium flex items-start gap-2">
            <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-medium flex items-start gap-2">
            <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">check_circle</span>
            <span>{successMsg}</span>
          </div>
        )}

        {/* Seleção do Perfil (no Cadastro) */}
        {mode === 'register' && (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-on-surface">Selecione seu perfil de uso:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole('cliente')}
                className={`p-3.5 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                  selectedRole === 'cliente'
                    ? 'border-primary bg-primary/5 text-primary ring-2 ring-primary/20'
                    : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-outline'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs">
                  <span className="material-symbols-outlined text-[20px]">person</span>
                  <span>Conta Cliente</span>
                </div>
                <span className="text-[11px] text-on-surface-variant">
                  Para buscar serviços, agendar e aproveitar descontos relâmpago.
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('profissional')}
                className={`p-3.5 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                  selectedRole === 'profissional'
                    ? 'border-primary bg-primary/5 text-primary ring-2 ring-primary/20'
                    : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-outline'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs">
                  <span className="material-symbols-outlined text-[20px]">storefront</span>
                  <span>Conta Negócio</span>
                </div>
                <span className="text-[11px] text-on-surface-variant">
                  Para barbearias, salões e clínicas publicarem horários ociosos.
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Google Sign In */}
        {mode !== 'forgot' && (
          <div className="flex flex-col gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-3 h-12 px-4 rounded-xl border border-outline hover:border-primary bg-surface-container-low hover:bg-surface-container-high text-xs font-bold text-on-surface transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.675-5.17 3.675-9.15z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.28v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.28C.46 8.23 0 10.06 0 12s.46 3.77 1.28 5.39l3.99-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.28 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
                />
              </svg>
              <span>Continuar com o Google</span>
            </button>

            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-[1px] bg-outline-variant"></div>
              <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-medium">
                ou com seu e-mail
              </span>
              <div className="flex-1 h-[1px] bg-outline-variant"></div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder={selectedRole === 'cliente' ? 'Ex: Carolina Santos' : 'Ex: Barbearia Elegance'}
                className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low border border-outline-variant focus:border-primary text-xs text-on-surface focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              E-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@exemplo.com"
              className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low border border-outline-variant focus:border-primary text-xs text-on-surface focus:outline-none"
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-on-surface">Senha</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      resetForm();
                    }}
                    className="text-[11px] text-primary hover:underline font-semibold"
                  >
                    Esqueceu a senha?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo de 6 caracteres"
                minLength={6}
                className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low border border-outline-variant focus:border-primary text-xs text-on-surface focus:outline-none"
              />
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Telefone / WhatsApp (opcional)
              </label>
              <input
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(formatPhone(e.target.value))}
                placeholder="(11) 98765-4321"
                maxLength={15}
                className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low border border-outline-variant focus:border-primary text-xs text-on-surface focus:outline-none"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
            ) : mode === 'login' ? (
              'Entrar'
            ) : mode === 'register' ? (
              `Cadastrar como ${selectedRole === 'cliente' ? 'Cliente' : 'Negócio'}`
            ) : (
              'Enviar e-mail de recuperação'
            )}
          </button>
        </form>

        {mode === 'forgot' && (
          <button
            type="button"
            onClick={() => {
              setMode('login');
              resetForm();
            }}
            className="text-xs text-center text-on-surface-variant hover:text-primary transition-colors font-medium"
          >
            ← Voltar para o Login
          </button>
        )}

        {/* Quick Demo Footer */}
        <div className="pt-4 border-t border-surface-variant flex flex-col items-center gap-2 text-center">
          <span className="text-[11px] text-on-surface-variant">
            Quer navegar com contas de demonstração prontas?
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuickDemo('cliente')}
              className="px-3 py-1.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-xs font-semibold text-on-surface transition-colors"
            >
              Demo Cliente
            </button>
            <button
              onClick={() => handleQuickDemo('profissional')}
              className="px-3 py-1.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-xs font-semibold text-on-surface transition-colors"
            >
              Demo Negócio
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
