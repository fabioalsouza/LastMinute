import React, { useState } from 'react';
import { useAuth, UserRole } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  defaultRole?: UserRole;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  defaultRole = 'cliente',
  onSuccess,
}) => {
  const {
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    sendPasswordReset,
    useDemoAccount,
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);

  // Form states
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefone, setTelefone] = useState('');

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  // Status states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        if (!email || !password) {
          throw new Error('Informe seu e-mail e senha.');
        }
        await loginWithEmail(email, password);
        onSuccess?.();
        onClose();
      } else if (mode === 'register') {
        if (!nome.trim() || !email || !password) {
          throw new Error('Preencha seu nome, e-mail e uma senha de no mínimo 6 dígitos.');
        }
        await registerWithEmail(nome, email, password, selectedRole, telefone);
        onSuccess?.();
        onClose();
      } else if (mode === 'forgot') {
        if (!email) {
          throw new Error('Informe o e-mail cadastrado para redefinir a senha.');
        }
        await sendPasswordReset(email);
        setSuccessMsg('Enviamos um link de redefinição de senha para seu e-mail!');
      }
    } catch (err: any) {
      console.error('Erro na autenticação:', err);
      let msg = err.message || 'Ocorreu um erro. Verifique seus dados.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'E-mail ou senha incorretos.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'Este e-mail já está cadastrado. Faça login ou use outro.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'A senha precisa ter no mínimo 6 caracteres.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'E-mail inválido.';
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      await loginWithGoogle(selectedRole);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error('Erro no Google Sign-In:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMsg(err.message || 'Falha ao autenticar com o Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (role: UserRole) => {
    useDemoAccount(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md bg-surface border border-outline-variant/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header com Abas */}
        <div className="relative px-6 pt-6 pb-4 border-b border-surface-variant bg-surface-container-lowest">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                <span className="material-symbols-outlined text-[18px]">lock</span>
              </div>
              <span className="font-semibold text-lg text-on-surface">
                {mode === 'login' ? 'Acessar Conta' : mode === 'register' ? 'Criar Nova Conta' : 'Recuperar Senha'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Abas Alternar Login / Cadastro */}
          {mode !== 'forgot' && (
            <div className="grid grid-cols-2 p-1 bg-surface-container-high rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  resetForm();
                }}
                className={`py-2 rounded-lg transition-all ${
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
                className={`py-2 rounded-lg transition-all ${
                  mode === 'register'
                    ? 'bg-surface text-primary shadow-xs font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Cadastre-se
              </button>
            </div>
          )}
        </div>

        {/* Corpo do Formulário */}
        <div className="p-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
          {/* Mensagens de Feedback */}
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

          {/* Seleção do Tipo de Perfil (Aparece no Cadastro ou para orientar o perfil) */}
          {mode === 'register' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface">Tipo de Perfil</label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedRole('cliente')}
                  className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                    selectedRole === 'cliente'
                      ? 'border-primary bg-primary/5 text-primary shadow-xs'
                      : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-outline'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <span className="material-symbols-outlined text-[18px]">person</span>
                    <span>Cliente</span>
                  </div>
                  <span className="text-[11px] leading-tight text-on-surface-variant">
                    Quero reservar vagas com desconto
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('profissional')}
                  className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                    selectedRole === 'profissional'
                      ? 'border-primary bg-primary/5 text-primary shadow-xs'
                      : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-outline'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <span className="material-symbols-outlined text-[18px]">storefront</span>
                    <span>Negócio / Salão</span>
                  </div>
                  <span className="text-[11px] leading-tight text-on-surface-variant">
                    Quero preencher horários ociosos
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Botão de Autenticação com Google */}
          {mode !== 'forgot' && (
            <div>
              <button
                type="button"
                disabled={loading}
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-2.5 h-11 px-4 rounded-xl border border-outline hover:border-primary bg-surface-container-low hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
                <span>Continuar com Google</span>
              </button>

              <div className="flex items-center gap-3 my-3">
                <div className="flex-1 h-[1px] bg-outline-variant"></div>
                <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-medium">
                  ou com e-mail
                </span>
                <div className="flex-1 h-[1px] bg-outline-variant"></div>
              </div>
            </div>
          )}

          {/* Formulário com Email/Senha */}
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder={selectedRole === 'cliente' ? 'Ex: Ana Clara' : 'Ex: João (Barbearia Style)'}
                  className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant focus:border-primary text-xs text-on-surface focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">
                E-mail
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant focus:border-primary text-xs text-on-surface focus:outline-none"
              />
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-on-surface">Senha</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        resetForm();
                      }}
                      className="text-[11px] text-primary hover:underline font-medium"
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
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                  className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant focus:border-primary text-xs text-on-surface focus:outline-none"
                />
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Telefone / WhatsApp (opcional)
                </label>
                <input
                  type="tel"
                  value={telefone}
                  onChange={(e) => setTelefone(formatPhone(e.target.value))}
                  placeholder="(11) 99999-9999"
                  maxLength={15}
                  className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant focus:border-primary text-xs text-on-surface focus:outline-none"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full h-11 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
              ) : mode === 'login' ? (
                'Entrar no LastMinute'
              ) : mode === 'register' ? (
                `Criar Conta como ${selectedRole === 'cliente' ? 'Cliente' : 'Negócio'}`
              ) : (
                'Enviar Link de Recuperação'
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
              className="text-xs text-center text-on-surface-variant hover:text-primary transition-colors font-medium mt-1"
            >
              ← Voltar para o Login
            </button>
          )}

          {/* Atalho Demo / Modo Demonstração Rápido */}
          <div className="pt-3 mt-1 border-t border-surface-variant text-center">
            <span className="text-[11px] text-on-surface-variant block mb-2">
              Quer testar rapidamente sem criar conta?
            </span>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('cliente')}
                className="px-2.5 py-1 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-[11px] font-semibold text-on-surface transition-colors"
              >
                Demo Cliente
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('profissional')}
                className="px-2.5 py-1 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-[11px] font-semibold text-on-surface transition-colors"
              >
                Demo Negócio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
