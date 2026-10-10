import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  FIRESTORE_COLLECTIONS,
  UsuarioDoc,
  EstabelecimentoDoc,
  ServicoDoc,
  HorarioDoc,
  ReservaDoc,
} from '../types/firestoreSchema';

/**
 * Utilitário para verificar disponibilidade do Firestore
 */
function ensureFirestore() {
  if (!db) {
    throw new Error('Cloud Firestore não está inicializado ou configurado.');
  }
  return db;
}

// =============================================================================
// 1. Coleção: usuarios
// =============================================================================

/** Remove campos com valor `undefined` para evitar erros do Firestore */
function sanitizeForFirestore<T extends Record<string, unknown>>(data: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined)
  ) as Partial<T>;
}

export async function salvarUsuario(
  uid: string,
  dados: Omit<UsuarioDoc, 'criadoEm' | 'atualizadoEm'>
): Promise<void> {
  const database = ensureFirestore();
  const userRef = doc(database, FIRESTORE_COLLECTIONS.USUARIOS, uid);
  const snap = await getDoc(userRef);
  const dadosSanitizados = sanitizeForFirestore(dados as Record<string, unknown>);

  if (!snap.exists()) {
    await setDoc(userRef, {
      ...dadosSanitizados,
      criadoEm: serverTimestamp(),
      atualizadoEm: serverTimestamp(),
    });
  } else {
    await updateDoc(userRef, {
      ...dadosSanitizados,
      atualizadoEm: serverTimestamp(),
    });
  }
}


export async function obterUsuario(uid: string): Promise<UsuarioDoc | null> {
  const database = ensureFirestore();
  const userRef = doc(database, FIRESTORE_COLLECTIONS.USUARIOS, uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<UsuarioDoc, 'id'>) };
}

// =============================================================================
// 2. Coleção: estabelecimentos
// =============================================================================

export async function criarEstabelecimento(
  dados: Omit<EstabelecimentoDoc, 'criadoEm' | 'atualizadoEm'>
): Promise<string> {
  const database = ensureFirestore();
  const colRef = collection(database, FIRESTORE_COLLECTIONS.ESTABELECIMENTOS);
  const docRef = await addDoc(colRef, {
    ...dados,
    criadoEm: serverTimestamp(),
    atualizadoEm: serverTimestamp(),
  });
  return docRef.id;
}

export async function obterEstabelecimento(id: string): Promise<EstabelecimentoDoc | null> {
  const database = ensureFirestore();
  const docRef = doc(database, FIRESTORE_COLLECTIONS.ESTABELECIMENTOS, id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<EstabelecimentoDoc, 'id'>) };
}

export async function listarEstabelecimentosPublicados(): Promise<EstabelecimentoDoc[]> {
  const database = ensureFirestore();
  const colRef = collection(database, FIRESTORE_COLLECTIONS.ESTABELECIMENTOS);
  const q = query(colRef, where('publicado', '==', true));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<EstabelecimentoDoc, 'id'>) }));
}

export async function listarEstabelecimentosDoProprietario(
  proprietarioId: string
): Promise<EstabelecimentoDoc[]> {
  const database = ensureFirestore();
  const colRef = collection(database, FIRESTORE_COLLECTIONS.ESTABELECIMENTOS);
  const q = query(colRef, where('proprietarioId', '==', proprietarioId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<EstabelecimentoDoc, 'id'>) }));
}

// =============================================================================
// 3. Coleção: servicos
// =============================================================================

export async function criarServico(
  dados: Omit<ServicoDoc, 'criadoEm' | 'atualizadoEm'>
): Promise<string> {
  const database = ensureFirestore();
  const colRef = collection(database, FIRESTORE_COLLECTIONS.SERVICOS);
  const docRef = await addDoc(colRef, {
    ...dados,
    criadoEm: serverTimestamp(),
    atualizadoEm: serverTimestamp(),
  });
  return docRef.id;
}

export async function listarServicosAtivosDoEstabelecimento(
  estabelecimentoId: string
): Promise<ServicoDoc[]> {
  const database = ensureFirestore();
  const colRef = collection(database, FIRESTORE_COLLECTIONS.SERVICOS);
  const q = query(
    colRef,
    where('estabelecimentoId', '==', estabelecimentoId),
    where('ativo', '==', true)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ServicoDoc, 'id'>) }));
}

export async function listarTodosServicosDoEstabelecimento(
  estabelecimentoId: string
): Promise<ServicoDoc[]> {
  const database = ensureFirestore();
  const colRef = collection(database, FIRESTORE_COLLECTIONS.SERVICOS);
  const q = query(colRef, where('estabelecimentoId', '==', estabelecimentoId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ServicoDoc, 'id'>) }));
}

// =============================================================================
// 4. Coleção: horarios
// =============================================================================

export async function criarHorario(
  dados: Omit<HorarioDoc, 'criadoEm' | 'atualizadoEm'>
): Promise<string> {
  const database = ensureFirestore();
  const colRef = collection(database, FIRESTORE_COLLECTIONS.HORARIOS);
  const docRef = await addDoc(colRef, {
    ...dados,
    criadoEm: serverTimestamp(),
    atualizadoEm: serverTimestamp(),
  });
  return docRef.id;
}

export async function listarHorariosDisponiveis(
  estabelecimentoId?: string
): Promise<HorarioDoc[]> {
  const database = ensureFirestore();
  const colRef = collection(database, FIRESTORE_COLLECTIONS.HORARIOS);
  const q = estabelecimentoId
    ? query(
        colRef,
        where('estabelecimentoId', '==', estabelecimentoId),
        where('status', '==', 'disponivel')
      )
    : query(colRef, where('status', '==', 'disponivel'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<HorarioDoc, 'id'>) }));
}

export async function listarHorariosDoEstabelecimento(
  estabelecimentoId: string
): Promise<HorarioDoc[]> {
  const database = ensureFirestore();
  const colRef = collection(database, FIRESTORE_COLLECTIONS.HORARIOS);
  const q = query(colRef, where('estabelecimentoId', '==', estabelecimentoId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<HorarioDoc, 'id'>) }));
}

export async function atualizarStatusHorario(
  horarioId: string,
  novoStatus: HorarioDoc['status']
): Promise<void> {
  const database = ensureFirestore();
  const docRef = doc(database, FIRESTORE_COLLECTIONS.HORARIOS, horarioId);
  await updateDoc(docRef, {
    status: novoStatus,
    atualizadoEm: serverTimestamp(),
  });
}

// =============================================================================
// 5. Coleção: reservas
// =============================================================================

export async function criarReserva(
  dados: Omit<ReservaDoc, 'criadoEm' | 'atualizadoEm'>
): Promise<string> {
  const database = ensureFirestore();
  const colRef = collection(database, FIRESTORE_COLLECTIONS.RESERVAS);
  const docRef = await addDoc(colRef, {
    ...dados,
    status: 'confirmada',
    criadoEm: serverTimestamp(),
    atualizadoEm: serverTimestamp(),
  });

  // Atualiza horário para reservado
  await atualizarStatusHorario(dados.horarioId, 'reservado');

  return docRef.id;
}

export async function listarReservasDoCliente(clienteId: string): Promise<ReservaDoc[]> {
  const database = ensureFirestore();
  const colRef = collection(database, FIRESTORE_COLLECTIONS.RESERVAS);
  const q = query(colRef, where('clienteId', '==', clienteId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ReservaDoc, 'id'>) }));
}

export async function listarReservasDoProprietario(
  proprietarioId: string
): Promise<ReservaDoc[]> {
  const database = ensureFirestore();
  const colRef = collection(database, FIRESTORE_COLLECTIONS.RESERVAS);
  const q = query(colRef, where('proprietarioId', '==', proprietarioId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ReservaDoc, 'id'>) }));
}

export async function cancelarReserva(
  reservaId: string,
  canceladoPorId: string,
  horarioId: string
): Promise<void> {
  const database = ensureFirestore();
  const docRef = doc(database, FIRESTORE_COLLECTIONS.RESERVAS, reservaId);
  await updateDoc(docRef, {
    status: 'cancelada',
    canceladoEm: serverTimestamp(),
    canceladoPorId,
    atualizadoEm: serverTimestamp(),
  });

  // Libera novamente o horário se necessário
  await atualizarStatusHorario(horarioId, 'disponivel');
}
