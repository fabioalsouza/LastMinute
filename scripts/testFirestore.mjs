import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyADWNA7sn0hwfXNsmzE5WOswmV64XMsDiI",
  authDomain: "last-minute-b076c.firebaseapp.com",
  projectId: "last-minute-b076c",
  storageBucket: "last-minute-b076c.firebasestorage.app",
  messagingSenderId: "885499499101",
  appId: "1:885499499101:web:718a77f061cf894161f3b4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function runTests() {
  console.log('🧪 Iniciando testes de regras do Cloud Firestore...\n');

  // Teste 1: Leitura anônima de estabelecimentos publicados (Permitido)
  try {
    const qPub = query(collection(db, 'estabelecimentos'), where('publicado', '==', true));
    const snapPub = await getDocs(qPub);
    console.log(`✅ [TESTE 1] Consulta pública a estabelecimentos publicados: SUCESSO (${snapPub.docs.length} encontrados)`);
  } catch (err) {
    console.error('❌ [TESTE 1] Falhou:', err.message);
  }

  // Teste 2: Leitura anônima de usuários privados (Deve ser BLOQUEADO)
  try {
    const snapUser = await getDoc(doc(db, 'usuarios', 'usuario_aleatorio_123'));
    if (snapUser.exists()) {
      console.log('⚠️ [TESTE 2] Usuário encontrado (não deveria ser legível anonimamente)');
    } else {
      console.log('❌ [TESTE 2] Documento não encontrado mas não retornou erro de permissão');
    }
  } catch (err) {
    if (err.code === 'permission-denied') {
      console.log('✅ [TESTE 2] Leitura não-autenticada em /usuarios BLOQUEADA com sucesso (permission-denied)');
    } else {
      console.log('⚠️ [TESTE 2] Erro inesperado:', err.code, err.message);
    }
  }

  // Teste 3: Leitura anônima de reservas privadas (Deve ser BLOQUEADO)
  try {
    const snapReserva = await getDoc(doc(db, 'reservas', 'reserva_aleatoria_123'));
    if (snapReserva.exists()) {
      console.log('⚠️ [TESTE 3] Reserva lida (não deveria ser legível anonimamente)');
    } else {
      console.log('❌ [TESTE 3] Documento não encontrado mas não retornou erro de permissão');
    }
  } catch (err) {
    if (err.code === 'permission-denied') {
      console.log('✅ [TESTE 3] Leitura não-autenticada em /reservas BLOQUEADA com sucesso (permission-denied)');
    } else {
      console.log('⚠️ [TESTE 3] Erro inesperado:', err.code, err.message);
    }
  }

  console.log('\n🎉 Testes básicos de segurança concluídos.');
  process.exit(0);
}

runTests();
