import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';

interface TestResult {
  title: string;
  expected: 'allowed' | 'denied';
  status: 'idle' | 'running' | 'success' | 'failed';
  message: string;
}

export const SecurityRulesTestModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { isRealAuth, firebaseUid, user, loginWithGoogle } = useAuth();
  const [results, setResults] = useState<Record<string, TestResult>>({});

  if (!isOpen) return null;

  const runAllTests = async () => {
    if (!db) {
      alert('Firestore não está inicializado.');
      return;
    }

    const newResults: Record<string, TestResult> = {};

    // Teste 1: Leitura pública de estabelecimentos publicados
    newResults['test1'] = {
      title: '1. Leitura pública de estabelecimentos publicados',
      expected: 'allowed',
      status: 'running',
      message: 'Executando...',
    };
    setResults({ ...newResults });

    try {
      const q = query(collection(db, 'estabelecimentos'), where('publicado', '==', true));
      const snap = await getDocs(q);
      newResults['test1'] = {
        title: '1. Leitura pública de estabelecimentos publicados',
        expected: 'allowed',
        status: 'success',
        message: `PERMITIDO: Consulta executada com sucesso (${snap.docs.length} registros).`,
      };
    } catch (err: any) {
      newResults['test1'] = {
        title: '1. Leitura pública de estabelecimentos publicados',
        expected: 'allowed',
        status: 'failed',
        message: `FALHA INESPERADA: ${err.message}`,
      };
    }
    setResults({ ...newResults });

    // Teste 2: Acesso ao próprio documento em /usuarios/{uid}
    newResults['test2'] = {
      title: '2. Gravação/Leitura no próprio perfil (/usuarios/{meu_uid})',
      expected: isRealAuth ? 'allowed' : 'denied',
      status: 'running',
      message: 'Executando...',
    };
    setResults({ ...newResults });

    if (isRealAuth && firebaseUid) {
      try {
        const myDocRef = doc(db, 'usuarios', firebaseUid);
        await setDoc(
          myDocRef,
          {
            nome: user.nome,
            tipoPerfil: 'cliente',
            atualizadoEm: serverTimestamp(),
          },
          { merge: true }
        );
        const mySnap = await getDoc(myDocRef);
        const dataSalva = mySnap.data();
        newResults['test2'] = {
          title: '2. Gravação/Leitura no próprio perfil (/usuarios/{meu_uid})',
          expected: 'allowed',
          status: 'success',
          message: `PERMITIDO: Dados gravados e lidos com sucesso para "${dataSalva?.nome || user.nome}" (UID ${firebaseUid.slice(0, 8)}...).`,
        };
      } catch (err: any) {
        newResults['test2'] = {
          title: '2. Gravação/Leitura no próprio perfil (/usuarios/{meu_uid})',
          expected: 'allowed',
          status: 'failed',
          message: `FALHA: ${err.code} - ${err.message}`,
        };
      }
    } else {
      newResults['test2'] = {
        title: '2. Gravação/Leitura no próprio perfil (/usuarios/{meu_uid})',
        expected: 'denied',
        status: 'success',
        message: 'INFO: Você não está logado com Google. Faça login para testar seu UID.',
      };
    }
    setResults({ ...newResults });

    // Teste 3: Tentativa de ler perfil de OUTRO usuário (/usuarios/alheio_999)
    newResults['test3'] = {
      title: '3. Proteção de privacidade: ler perfil de OUTRO usuário',
      expected: 'denied',
      status: 'running',
      message: 'Executando tentativa não autorizada...',
    };
    setResults({ ...newResults });

    try {
      const otherRef = doc(db, 'usuarios', 'usuario_alheio_999');
      await getDoc(otherRef);
      newResults['test3'] = {
        title: '3. Proteção de privacidade: ler perfil de OUTRO usuário',
        expected: 'denied',
        status: 'failed',
        message: 'FALHA DE SEGURANÇA: Deveria ter bloqueado o acesso!',
      };
    } catch (err: any) {
      if (err.code === 'permission-denied') {
        newResults['test3'] = {
          title: '3. Proteção de privacidade: ler perfil de OUTRO usuário',
          expected: 'denied',
          status: 'success',
          message: 'BLOQUEADO CORRETAMENTE: Acesso negado com permission-denied.',
        };
      } else {
        newResults['test3'] = {
          title: '3. Proteção de privacidade: ler perfil de OUTRO usuário',
          expected: 'denied',
          status: 'failed',
          message: `ERRO: ${err.message}`,
        };
      }
    }
    setResults({ ...newResults });

    // Teste 4: Tentativa de ler reservas de terceiros
    newResults['test4'] = {
      title: '4. Proteção de reservas de terceiros (/reservas/reserva_alheia)',
      expected: 'denied',
      status: 'running',
      message: 'Executando tentativa de espionagem...',
    };
    setResults({ ...newResults });

    try {
      const resRef = doc(db, 'reservas', 'reserva_alheia_999');
      await getDoc(resRef);
      newResults['test4'] = {
        title: '4. Proteção de reservas de terceiros (/reservas/reserva_alheia)',
        expected: 'denied',
        status: 'failed',
        message: 'FALHA DE SEGURANÇA: Reserva de terceiro lida indevidamente!',
      };
    } catch (err: any) {
      if (err.code === 'permission-denied') {
        newResults['test4'] = {
          title: '4. Proteção de reservas de terceiros (/reservas/reserva_alheia)',
          expected: 'denied',
          status: 'success',
          message: 'BLOQUEADO CORRETAMENTE: Acesso negado com permission-denied.',
        };
      } else {
        newResults['test4'] = {
          title: '4. Proteção de reservas de terceiros (/reservas/reserva_alheia)',
          expected: 'denied',
          status: 'failed',
          message: `ERRO: ${err.message}`,
        };
      }
    }
    setResults({ ...newResults });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface rounded-2xl max-w-xl w-full border border-surface-variant shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-surface-variant flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[24px]">verified_user</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-on-surface">Laboratório de Teste de Regras</h2>
              <p className="text-xs text-on-surface-variant">Cloud Firestore Security Rules em Tempo Real</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-variant text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Status do Usuário Atual */}
          <div className="p-4 rounded-xl bg-surface-container border border-outline-variant">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                  Autenticação Firebase:
                </span>
                <p className="text-sm font-bold text-on-surface mt-0.5">
                  {isRealAuth ? (
                    <span className="text-emerald-500 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Conectado como {user.nome} (Google Auth)
                    </span>
                  ) : (
                    <span className="text-amber-500 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      Não autenticado no Google (Modo Visitante/Demo)
                    </span>
                  )}
                </p>
                {firebaseUid && (
                  <p className="text-[11px] font-mono text-on-surface-variant mt-1">
                    UID: {firebaseUid}
                  </p>
                )}
              </div>

              {!isRealAuth && (
                <button
                  onClick={() => loginWithGoogle()}
                  className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-primary-hover flex items-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">login</span>
                  Entrar com Google
                </button>
              )}
            </div>
          </div>

          {/* Test Cards */}
          <div className="space-y-3">
            {Object.keys(results).length === 0 ? (
              <div className="text-center py-6 text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl mb-2 text-primary opacity-60">
                  security
                </span>
                <p className="text-sm">Clique no botão abaixo para disparar requisições reais ao Firestore.</p>
              </div>
            ) : (
              Object.entries(results).map(([key, res]) => (
                <div
                  key={key}
                  className={`p-3.5 rounded-xl border transition-all ${
                    res.status === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : res.status === 'failed'
                      ? 'bg-rose-500/10 border-rose-500/30'
                      : 'bg-surface-container border-outline-variant'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-on-surface">{res.title}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        res.status === 'success'
                          ? 'bg-emerald-500/20 text-emerald-500'
                          : res.status === 'failed'
                          ? 'bg-rose-500/20 text-rose-500'
                          : 'bg-primary/20 text-primary'
                      }`}
                    >
                      {res.status === 'running' ? 'Testando...' : res.status === 'success' ? 'Passou' : 'Erro'}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1.5">{res.message}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-surface-variant bg-surface-container-low flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-variant"
          >
            Fechar
          </button>
          <button
            onClick={runAllTests}
            className="px-5 py-2 rounded-lg bg-primary text-on-primary text-xs font-bold hover:bg-primary-hover flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">play_arrow</span>
            Executar Bateria de Testes
          </button>
        </div>
      </div>
    </div>
  );
};
