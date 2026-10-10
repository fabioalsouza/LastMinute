import React, { createContext, useContext, useState, useEffect } from 'react';
import { Usuario } from '../types';
import { DEMO_USER } from '../services/mockData';
import { auth, googleProvider, isFirebaseConfigured } from '../services/firebase';
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as fbSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { salvarUsuario, obterUsuario } from '../services/firestoreService';

export type UserRole = 'cliente' | 'profissional';

interface AuthContextType {
  user: Usuario;
  activeRole: UserRole;
  isAuthenticated: boolean;
  isRealAuth: boolean;
  isFirebaseActive: boolean;
  firebaseUid: string | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  authModalConfig: {
    mode: 'login' | 'register';
    role: UserRole;
  };
  openAuthModal: (initialMode?: 'login' | 'register', defaultRole?: UserRole) => void;
  closeAuthModal: () => void;
  toggleRole: () => void;
  setRole: (role: UserRole) => void;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (
    nome: string,
    email: string,
    pass: string,
    role: UserRole,
    telefone?: string
  ) => Promise<void>;
  loginWithGoogle: (chosenRole?: UserRole) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  useDemoAccount: (role?: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario>(DEMO_USER);
  const [activeRole, setActiveRole] = useState<UserRole>('cliente');
  const [isFirebaseActive] = useState<boolean>(isFirebaseConfigured);
  const [isRealAuth, setIsRealAuth] = useState<boolean>(false);
  const [firebaseUid, setFirebaseUid] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalConfig, setAuthModalConfig] = useState<{
    mode: 'login' | 'register';
    role: UserRole;
  }>({ mode: 'login', role: 'cliente' });

  // Captura resultado de redirect do Google (quando popup é bloqueado)
  useEffect(() => {
    if (auth && isFirebaseConfigured) {
      getRedirectResult(auth).then(async (result) => {
        if (result?.user) {
          const fbUser = result.user;
          const pendingRole = sessionStorage.getItem('pendingGoogleRole') as UserRole | null;
          sessionStorage.removeItem('pendingGoogleRole');

          let perfilDoc = await obterUsuario(fbUser.uid).catch(() => null);
          const roleToApply = pendingRole || (perfilDoc?.tipoPerfil === 'estabelecimento' ? 'profissional' : 'cliente');

          if (!perfilDoc) {
            await salvarUsuario(fbUser.uid, {
              nome: fbUser.displayName || 'Usuário Google',
              fotoUrl: fbUser.photoURL || undefined,
              telefone: fbUser.phoneNumber || undefined,
              tipoPerfil: roleToApply === 'profissional' ? 'estabelecimento' : 'cliente',
            }).catch(() => {});
          }
          setActiveRole(roleToApply);
        }
      }).catch((err) => {
        console.warn('getRedirectResult error:', err);
      });
    }
  }, []);

  // Ouvinte de estado de autenticação do Firebase
  useEffect(() => {
    if (auth && isFirebaseConfigured) {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          setIsRealAuth(true);
          setFirebaseUid(fbUser.uid);

          try {
            let perfilDoc = await obterUsuario(fbUser.uid);
            const userRole: UserRole =
              perfilDoc?.tipoPerfil === 'estabelecimento' ? 'profissional' : 'cliente';

            const userObj: Usuario = {
              id: fbUser.uid,
              nome: perfilDoc?.nome || fbUser.displayName || fbUser.email?.split('@')[0] || 'Usuário',
              email: fbUser.email || '',
              fotoUrl: perfilDoc?.fotoUrl || fbUser.photoURL || undefined,
              telefone: perfilDoc?.telefone || fbUser.phoneNumber || undefined,
              papel: userRole,
              isDemo: false,
            };

            setUser(userObj);
            setActiveRole(userRole);
          } catch (err) {
            console.warn('Erro ao sincronizar perfil do Firestore:', err);
            setUser({
              id: fbUser.uid,
              nome: fbUser.displayName || fbUser.email?.split('@')[0] || 'Usuário',
              email: fbUser.email || '',
              fotoUrl: fbUser.photoURL || undefined,
              papel: 'cliente',
              isDemo: false,
            });
            setActiveRole('cliente');
          }
        } else {
          // Quando não autenticado no Firebase, manter estado demo ou null
          setIsRealAuth(false);
          setFirebaseUid(null);
          // Manter o DEMO_USER para que a aplicação nunca quebre em navegação exploratória
          setUser(DEMO_USER);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const openAuthModal = (mode: 'login' | 'register' = 'login', defaultRole: UserRole = 'cliente') => {
    setAuthModalConfig({ mode, role: defaultRole });
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const toggleRole = () => {
    const nextRole = activeRole === 'cliente' ? 'profissional' : 'cliente';
    setActiveRole(nextRole);
    if (isRealAuth && firebaseUid && user) {
      salvarUsuario(firebaseUid, {
        nome: user.nome,
        fotoUrl: user.fotoUrl,
        telefone: user.telefone,
        tipoPerfil: nextRole === 'profissional' ? 'estabelecimento' : 'cliente',
      }).catch((e) => console.warn('Erro ao atualizar papel no Firestore:', e));
    }
  };

  const setRole = (role: UserRole) => {
    setActiveRole(role);
    if (isRealAuth && firebaseUid && user) {
      salvarUsuario(firebaseUid, {
        nome: user.nome,
        fotoUrl: user.fotoUrl,
        telefone: user.telefone,
        tipoPerfil: role === 'profissional' ? 'estabelecimento' : 'cliente',
      }).catch((e) => console.warn('Erro ao atualizar papel no Firestore:', e));
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    if (!auth) throw new Error('Firebase não está inicializado.');
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    const fbUser = cred.user;

    // Carrega dados de perfil
    const perfilDoc = await obterUsuario(fbUser.uid);
    if (perfilDoc?.tipoPerfil) {
      setActiveRole(perfilDoc.tipoPerfil === 'estabelecimento' ? 'profissional' : 'cliente');
    }
  };

  const registerWithEmail = async (
    nome: string,
    email: string,
    pass: string,
    role: UserRole,
    telefone?: string
  ) => {
    if (!auth) throw new Error('Firebase não está inicializado.');
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    const fbUser = cred.user;

    await updateProfile(fbUser, { displayName: nome });

    // Salva perfil inicial no Firestore com o tipo escolhido
    await salvarUsuario(fbUser.uid, {
      nome,
      telefone: telefone || '',
      tipoPerfil: role === 'profissional' ? 'estabelecimento' : 'cliente',
    });

    setActiveRole(role);
  };

  const loginWithGoogle = async (chosenRole?: UserRole) => {
    if (!auth || !googleProvider) {
      throw new Error('Firebase Auth não configurado.');
    }

    try {
      // Tenta popup primeiro
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;

      let perfilDoc = await obterUsuario(fbUser.uid);
      const roleToApply = chosenRole || (perfilDoc?.tipoPerfil === 'estabelecimento' ? 'profissional' : 'cliente');

      if (!perfilDoc) {
        await salvarUsuario(fbUser.uid, {
          nome: fbUser.displayName || 'Usuário Google',
          fotoUrl: fbUser.photoURL || undefined,
          telefone: fbUser.phoneNumber || undefined,
          tipoPerfil: roleToApply === 'profissional' ? 'estabelecimento' : 'cliente',
        });
      }

      setActiveRole(roleToApply);
    } catch (err: any) {
      // Se popup foi bloqueado, usa redirect como fallback
      if (
        err.code === 'auth/popup-blocked' ||
        err.code === 'auth/popup-closed-by-user' ||
        err.code === 'auth/cancelled-popup-request'
      ) {
        if (chosenRole) sessionStorage.setItem('pendingGoogleRole', chosenRole);
        await signInWithRedirect(auth, googleProvider);
        return; // página vai recarregar
      }
      throw err;
    }
  };

  const sendPasswordReset = async (email: string) => {
    if (!auth) throw new Error('Firebase Auth não configurado.');
    await sendPasswordResetEmail(auth, email);
  };

  const logout = async () => {
    if (auth && isFirebaseConfigured) {
      await fbSignOut(auth);
    }
    setIsRealAuth(false);
    setFirebaseUid(null);
    setUser(DEMO_USER);
    setActiveRole('cliente');
  };

  const useDemoAccount = (role: UserRole = 'cliente') => {
    setIsRealAuth(false);
    setFirebaseUid(null);
    setUser(DEMO_USER);
    setActiveRole(role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activeRole,
        isAuthenticated: isRealAuth || Boolean(user),
        isRealAuth,
        isFirebaseActive,
        firebaseUid,
        loading,
        isAuthModalOpen,
        authModalConfig,
        openAuthModal,
        closeAuthModal,
        toggleRole,
        setRole,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        sendPasswordReset,
        logout,
        useDemoAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
