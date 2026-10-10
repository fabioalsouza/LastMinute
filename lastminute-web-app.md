# Plano de Implementação: Aplicação Web LastMinute

**Slug:** `lastminute-web-app`  
**Tipo de Projeto:** WEB (SPA)  
**Status:** Planejamento Concluído  
**Data:** 26/09/2026  
**Documento de Design de Referência:** [`DESIGN.md`](./DESIGN.md)  
**Telas Originais Stitch:** [`screens/README.md`](./screens/README.md)

---

## 1. Visão Geral do Produto e Objetivos

O **LastMinute** é um marketplace focado em oportunidades imediatas no setor de beleza e bem-estar (Barbearia, Cabelo, Unhas, Estética, Massagem). Seu propósito central é conectar clientes a horários ociosos com descontos agressivos de última hora, permitindo que estabelecimentos monetizem tempos vagos e que clientes agendem serviços com conveniência e preços exclusivos.

### Princípios Chave de Arquitetura & UX:
1. **Fidelidade ao Design Stitch & Editorial Warm Minimalism:** Preservar a paleta de cores (`#0F766E` Deep Teal, `#10B981` Emerald Green, `#F59E0B` Amber Urgency, `#F8F8F6` Warm Alabaster), tipografia Inter e proporções de layout de alta densidade sem poluição visual.
2. **Backend Serverless com Firebase:** Autenticação via Google Provider, armazenamento em Cloud Firestore e validações e autorizações gerenciadas estritamente por **Firestore Security Rules** (`firestore.rules`).
3. **Modo Demo Out-of-the-Box:** Camada de dados híbrida com repositório unificado. O aplicativo funciona imediatamente com dados mockados em `localStorage` e identificador `isDemo: true`, conectando-se ao Firebase dinamicamente quando as variáveis de ambiente forem configuradas.
4. **Mapa Interativo Funcional (Leaflet):** Busca geoespacial real no raio do usuário (com geolocalização do navegador e cálculo de distância via fórmula de Haversine), filtros por categoria e sincronização bidirecional entre marcadores no mapa e cards da listagem.
5. **Precisão Financeira:** Todos os valores monetários armazenados em **centavos inteiros** (`priceInCents`, `originalPriceInCents`, `discountPriceInCents`) para mitigar erros de ponto flutuante.

---

## 2. Critérios de Sucesso Mensuráveis

- [ ] **10 Telas Funcionais:** Todas as 10 telas do Stitch implementadas como rotas SPA integradas, com navegação fluida e sem reload.
- [ ] **Proporções de Desktop Preservadas:** Layout desktop centralizado em container de 1440px, responsivo sem quebras nem compressão/distorção dos cards e grids.
- [ ] **Mapa Interativo & Geolocalização:** Leaflet renderizando marcadores para cada estabelecimento, cálculo de distância em km a partir da localização do cliente (ou mock Jardins/SP), popup com ação direta de reserva.
- [ ] **Fluxo Ponta-a-Ponta do Cliente:**
  - Explorar ofertas por categoria/geolocalização → Abrir detalhes do serviço → Bloquear horário na tela de confirmação (timer de 15 minutos) → Confirmar reserva → Gerar voucher com código único → Listar em "Minhas Reservas" com opção de cancelamento.
- [ ] **Fluxo Ponta-a-Ponta do Estabelecimento:**
  - Acessar Painel Profissional com KPIs reais (taxa de ocupação, receita recuperada em centavos, vagas publicadas) → Criar nova oferta relâmpago em "Publicar Horário" (com regra de desconto dinâmico) → Visualizar horário ativo em "Horários Publicados" e refletido imediatamente na tela "Explorar" do cliente.
- [ ] **Catálogo de Serviços:** Criação e edição de serviços por categoria, duração em minutos e preço-base em centavos.
- [ ] **Segurança e Regras Firebase:** Arquivo `firestore.rules` completo com validação de schemas, autorização de proprietário para horários e serviços, e proteção contra sobreposição de reservas.

---

## 3. Tech Stack & Decisões Técnicas

| Camada | Tecnologia | Justificativa |
|---|---|---|
| **Build & Core** | Vite + React 19 + TypeScript | Inicialização instantânea, tipagem estrita de ponta a ponta e máxima performance. |
| **Roteamento** | React Router v7 (`react-router-dom`) | Navegação SPA limpa com URLs amigáveis, loaders e rotas aninhadas. |
| **Estilização** | TailwindCSS + Tokens do `DESIGN.md` | Classes utilitárias com as variáveis de cor e espaçamentos do Stitch. |
| **Mapas & Geometria** | Leaflet + React-Leaflet + OpenStreetMap | Mapa interativo leve, customizável com pins e popups sem necessidade de API key paga. |
| **Backend & Dados** | Firebase v10/v11 (Firestore + Auth) + LocalStorage Fallback | Armazenamento de documentos em tempo real, login Google e fallback local automático. |
| **Ícones & Tipografia** | Material Symbols Outlined + Google Font Inter | Conformidade total com os assets visuais exportados pelo Google Stitch. |
| **Formatação & Utilitários** | Intl API nativa (`pt-BR`, `BRL`, datas) | Sem dependências pesadas extras de formatação. |

---

## 4. Modelos de Dados Tipados (TypeScript)

Os modelos devem ser centralizados em `src/types/index.ts`:

```typescript
// Categoria de serviços de bem-estar e beleza
export type ServiceCategory = 'barbearia' | 'cabelo' | 'unhas' | 'estetica' | 'massagem';

// 1. Modelo Estabelecimento (Venue)
export interface Estabelecimento {
  id: string;
  nome: string;
  categoria: ServiceCategory;
  descricao: string;
  endereco: {
    logradouro: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
    complemento?: string;
  };
  latitude: number;
  longitude: number;
  fotos: string[];
  nota: number;
  totalAvaliacoes: number;
  telefone: string;
  isDemo: boolean; // Identificação de demonstração
  ownerId?: string; // UID do Firebase Auth do profissional
  createdAt: string;
}

// 2. Modelo Serviço
export interface Servico {
  id: string;
  estabelecimentoId: string;
  nome: string;
  categoria: ServiceCategory;
  duracaoMinutos: number;
  precoNormalEmCentavos: number; // Ex: R$ 120,00 -> 12000
  descricao?: string;
  ativo: boolean;
  isDemo: boolean;
}

// 3. Modelo Horário Publicado (Slot)
export type HorarioStatus = 'disponivel' | 'bloqueado' | 'reservado' | 'cancelado' | 'expirado';

export interface DescontoAutomaticoConfig {
  ativado: boolean;
  descontoAdicionalPercentual: number; // Ex: +10% se faltar menos de 60 min
  minutosAntesDoInicio: number;
}

export interface HorarioPublicado {
  id: string;
  estabelecimentoId: string;
  servicoId: string;
  profissionalNome: string;
  dataHoraInicio: string; // ISO 8601 string
  dataHoraFim: string; // ISO 8601 string
  precoPromocionalInicialEmCentavos: number; // Preço promocional em centavos
  precoNormalEmCentavos: number; // Referência para cálculo do % de desconto
  descontoAutomatico: DescontoAutomaticoConfig;
  status: HorarioStatus;
  tempoBloqueioAte?: string; // Para reserva em checkout temporário (15 min)
  clienteBloqueioId?: string;
  isDemo: boolean;
  createdAt: string;
}

// 4. Modelo Reserva (Booking)
export type ReservaStatus = 'confirmada' | 'concluida' | 'cancelada_pelo_cliente' | 'cancelada_pelo_estabelecimento';

export interface Reserva {
  id: string;
  codigoConfirmacao: string; // Ex: "LM-84920"
  clienteId: string;
  clienteNome: string;
  clienteEmail: string;
  clienteTelefone: string;
  horarioId: string;
  estabelecimentoId: string;
  servicoId: string;
  precoConfirmadoEmCentavos: number; // Armazenado em centavos
  metodoPagamento: 'pix' | 'cartao_credito' | 'pagamento_no_local';
  dataCriacao: string; // ISO 8601
  status: ReservaStatus;
  isDemo: boolean;
}

// 5. Perfil de Usuário
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  fotoUrl?: string;
  papel: 'cliente' | 'profissional' | 'ambos';
  estabelecimentoId?: string; // Vinculado se for dono de salão
  isDemo: boolean;
}
```

---

## 5. Arquitetura Firebase & Regras de Segurança (`firestore.rules`)

As permissões do sistema são governadas diretamente pelas regras do Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Funções utilitárias de validação
    function isAuthenticated() {
      return request.auth != null;
    }
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    function isVenueOwner(venueId) {
      return isAuthenticated() && (
        request.auth.uid == venueId ||
        request.auth.uid == get(/databases/$(database)/documents/estabelecimentos/$(venueId)).data.ownerId
      );
    }

    // Estabelecimentos: leitura pública, criação/edição pelo dono
    match /estabelecimentos/{venueId} {
      allow read: if true;
      allow create: if isAuthenticated();
      allow update, delete: if isVenueOwner(venueId);
    }

    // Serviços: leitura pública, edição pelo dono do estabelecimento
    match /servicos/{serviceId} {
      allow read: if true;
      allow create: if isAuthenticated() && isVenueOwner(request.resource.data.estabelecimentoId);
      allow update, delete: if isAuthenticated() && isVenueOwner(resource.data.estabelecimentoId);
    }

    // Horários Publicados: leitura pública, publicação pelo dono
    match /horarios/{slotId} {
      allow read: if true;
      allow create: if isAuthenticated() && isVenueOwner(request.resource.data.estabelecimentoId);
      allow update: if isAuthenticated(); // Atualização de status para bloqueio/reserva
      allow delete: if isAuthenticated() && isVenueOwner(resource.data.estabelecimentoId);
    }

    // Reservas: cliente lê e cria a sua; estabelecimento associado pode ler
    match /reservas/{reservaId} {
      allow read: if isAuthenticated() && (
        resource.data.clienteId == request.auth.uid ||
        isVenueOwner(resource.data.estabelecimentoId)
      );
      allow create: if isAuthenticated() && request.resource.data.clienteId == request.auth.uid;
      allow update: if isAuthenticated() && (
        resource.data.clienteId == request.auth.uid ||
        isVenueOwner(resource.data.estabelecimentoId)
      );
    }
  }
}
```

---

## 6. Estrutura de Diretórios Planejada

```
lastminute/
├── DESIGN.md                          # Guia de design e tokens
├── firestore.rules                    # Regras de segurança do Firebase
├── index.html                         # Shell HTML com fontes Inter e Material Symbols
├── package.json                       # Dependências Vite, React, TS, Tailwind, Leaflet
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js                 # Cores e tokens do DESIGN.md
├── src/
│   ├── main.tsx                       # Ponto de entrada React 19
│   ├── App.tsx                        # Roteador central e provedores
│   ├── index.css                      # Tailwind layer + utilitários tipográficos
│   ├── types/
│   │   └── index.ts                   # Modelos tipados (centavos, IDs, enums)
│   ├── services/
│   │   ├── firebase.ts                # Inicialização do Firebase (com mock fallback)
│   │   ├── storageRepository.ts       # Camada de abstração Firestore + LocalStorage
│   │   └── mockData.ts                # Dados demonstrativos (Jardins, Pinheiros, Itaim)
│   ├── context/
│   │   ├── AuthContext.tsx            # Contexto de autenticação (demo user + Google Login)
│   │   └── MarketplaceContext.tsx     # Estado global de horários, reservas e catálogo
│   ├── utils/
│   │   ├── currency.ts                # formatCentsToBRL, percentDiscount
│   │   ├── distance.ts                # haversineDistanceKm, formatDistance
│   │   └── date.ts                    # formatHour, formatFullDate, countdownTimer
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx             # Cabeçalho unificado com troca de modo Cliente/Negócios
│   │   │   ├── Footer.tsx             # Rodapé institucional editorial
│   │   │   ├── UrgencyBanner.tsx      # Timer de janela prioritária persistente
│   │   │   ├── CategoryPills.tsx      # Filtros em pílulas (Barbearia, Cabelo, etc.)
│   │   │   ├── StatusBadge.tsx        # Badges (Disponível, Confirmado, -30% OFF)
│   │   │   ├── InputField.tsx         # Inputs, selects e textareas padronizados
│   │   │   ├── Modal.tsx              # Modal dialog acessível com backdrop blur
│   │   │   └── DataTable.tsx          # Tabelas padronizadas com bordas hairline
│   │   ├── map/
│   │   │   ├── VenueMap.tsx           # Componente Leaflet com markers customizados
│   │   │   └── VenuePopup.tsx         # Cartão do salão dentro do mapa
│   │   └── cards/
│   │       ├── SlotCard.tsx           # Card de oferta com foto, distância, slots e desconto
│   │       └── BookingCard.tsx        # Card de agendamento na lista de reservas
│   └── pages/
│       ├── client/
│       │   ├── ExplorePage.tsx        # 01 - Explorar (Feed de horários)
│       │   ├── MapPage.tsx            # 02 - Mapa interativo completo
│       │   ├── ServiceDetailPage.tsx  # 03 - Detalhes do serviço e estabelecimento
│       │   ├── CheckoutPage.tsx       # 04 - Confirmar reserva com timer
│       │   ├── ConfirmationPage.tsx   # 05 - Reserva confirmada (Voucher digital)
│       │   └── MyBookingsPage.tsx     # 06 - Minhas reservas (histórico e voucher)
│       └── business/
│           ├── DashboardPage.tsx      # 07 - Painel profissional & métricas
│           ├── PublishSlotPage.tsx    # 08 - Publicar horário vago
│           ├── PublishedSlotsPage.tsx # 09 - Gestão de horários publicados
│           └── ServicesCatalogPage.tsx# 10 - Gerenciamento de serviços
```

---

## 7. Mapeamento das 10 Telas do Stitch para Componentes

| # | Tela Stitch | Rota na Aplicação | Responsabilidade & Funcionalidade |
|---|---|---|---|
| **01** | `01 — Explorar` | `/` ou `/explorar` | Feed de vagas, busca textual por bairro/serviço, filtro de categorias, pílulas de horário, timer de urgência, cards com slots em carrossel. |
| **02** | `02 — Mapa` | `/mapa` | Mapa Leaflet com geolocalização do usuário, raio de distância em km, pins dinâmicos dos salões parceiros, sidebar sincronizada com os cards de horário. |
| **03** | `03 — Detalhes do serviço` | `/servico/:slotId` | Detalhes do salão (fotos, endereço, bio do profissional), regras de cancelamento, seleção de horários disponíveis no dia e CTA de checkout. |
| **04** | `04 — Confirmar reserva` | `/checkout/:slotId` | Bloqueio temporário da vaga por 15 min com contagem regressiva ativa, decomposição de preços em centavos (original, economia, total), seleção de pagamento e validação. |
| **05** | `05 — Reserva confirmada` | `/reserva-confirmada/:bookingId` | Voucher de confirmação com código único (ex: `LM-98214`), endereço do local, botão "Como Chegar" (Google Maps) e botão de adicionar à agenda. |
| **06** | `06 — Minhas reservas` | `/minhas-reservas` | Lista de agendamentos futuros e passados, status pill, modal para visualização do voucher e botão funcional para cancelar agendamento. |
| **07** | `07 — Painel profissional` | `/negocios/dashboard` | Dashboard para proprietários: KPIs de receita recuperada no mês, taxa de ocupação, vagas preenchidas vs ociosas, ações rápidas de publicação. |
| **08** | `08 — Publicar horário` | `/negocios/publicar` | Formulário para criar slot relâmpago: seleção de serviço do catálogo, profissional, data/hora inicial, preço promocional em centavos e toggle de desconto automático progressivo. |
| **09** | `09 — Horários publicados` | `/negocios/horarios` | Tabela e visualização de cartões dos horários ativos, preenchidos ou expirados com ações para pausar, deletar ou impulsionar horário. |
| **10** | `10 — Serviços` | `/negocios/servicos` | Gestão de catálogo: lista de serviços por categoria, modal para adicionar/editar serviço com duração e preço normal em centavos. |

---

## 8. Decomposição de Tarefas (Task Breakdown)

### Tarefa 1: Setup do Projeto & Sistema de Tokens
- **ID:** `TASK-01`
- **Agente:** `frontend-specialist`
- **Skills:** `frontend-design`, `clean-code`
- **Prioridade:** P0 (Bloqueador)
- **Dependências:** Nenhuma
- **INPUT:** `DESIGN.md`, especificação de cores e tipografia.
- **OUTPUT:** Projeto Vite + React 19 + TypeScript + Tailwind configurado com paleta exata (`primary: #005c55`, `primary-container: #0f766e`, etc.), fonts Inter e Material Symbols.
- **VERIFY:** `npm run build` executa sem erros; variáveis de cor e fontes carregadas no `index.html`.

### Tarefa 2: Tipagem Completa & Camada de Armazenamento Híbrida (Repository)
- **ID:** `TASK-02`
- **Agente:** `backend-specialist`
- **Skills:** `database-design`, `api-patterns`
- **Prioridade:** P0
- **Dependências:** `TASK-01`
- **INPUT:** Modelos de Estabelecimento, Serviço, HorárioPublicado, Reserva e valores em centavos.
- **OUTPUT:** Arquivos `src/types/index.ts`, `src/services/mockData.ts` (com 5+ estabelecimentos de SP em todas as 5 categorias), `src/services/storageRepository.ts` (CRUD completo com persistência local e adapter preparado para Firestore) e `firestore.rules`.
- **VERIFY:** Teste unitário de cálculo em centavos e leitura do mock repository inicial.

### Tarefa 3: Sistema de Componentes Reutilizáveis
- **ID:** `TASK-03`
- **Agente:** `frontend-specialist`
- **Skills:** `frontend-design`, `frontend-architecture`
- **Prioridade:** P1
- **Dependências:** `TASK-01`, `TASK-02`
- **INPUT:** Telas Stitch 01 a 10.
- **OUTPUT:** Componentes reutilizáveis em `src/components/common/`: `Header` (com switcher Cliente / Negócios e avatar), `UrgencyBanner` (timer regressivo dinâmico), `CategoryPills`, `StatusBadge`, `InputField`, `Modal`, `DataTable`, `SlotCard` e `BookingCard`.
- **VERIFY:** Componentes renderizando estados ativo, inativo, hover e foco sem distorção.

### Tarefa 4: Mapa Interativo Funcional (Leaflet + Geolocalização)
- **ID:** `TASK-04`
- **Agente:** `frontend-specialist`
- **Skills:** `frontend-design`, `frontend-architecture`
- **Prioridade:** P1
- **Dependências:** `TASK-02`, `TASK-03`
- **INPUT:** Coordenadas lat/lng dos estabelecimentos demonstrativos (Jardins, Pinheiros, Itaim Bibi, Vila Madalena, Moema).
- **OUTPUT:** Componente `VenueMap.tsx` e página `MapPage.tsx` com Leaflet: marcadores com ícones de categoria, popup com preview da vaga e botão de agendar, cálculo de distância dinâmica e sincronia com a lista lateral.
- **VERIFY:** Navegação no mapa funcional com zoom, clique no marker centralizando e exibindo popup correto.

### Tarefa 5: Telas do Cliente: Explorar, Detalhes e Checkout com Reserva
- **ID:** `TASK-05`
- **Agente:** `frontend-specialist`
- **Skills:** `frontend-design`, `clean-code`
- **Prioridade:** P1
- **Dependências:** `TASK-03`, `TASK-04`
- **INPUT:** Telas Stitch 01, 03, 04, 05 e 06.
- **OUTPUT:**
  - `ExplorePage.tsx`: Feed de ofertas, busca, filtros de categoria e ordenação por maior desconto/menor distância.
  - `ServiceDetailPage.tsx`: Apresentação rica do salão e horários disponíveis.
  - `CheckoutPage.tsx`: Temporizador de 15 minutos que bloqueia a vaga, formulário de pagamento e confirmação.
  - `ConfirmationPage.tsx`: Voucher com código gerado (ex: `LM-73910`) e botões de ação.
  - `MyBookingsPage.tsx`: Gestão de reservas ativas e passadas com cancelamento funcional.
- **VERIFY:** Fluxo completo de reserva executado de ponta a ponta; horário reservado deixa de aparecer como disponível na tela Explorar.

### Tarefa 6: Telas do Estabelecimento (Para Negócios): Dashboard, Publicação e Serviços
- **ID:** `TASK-06`
- **Agente:** `frontend-specialist`
- **Skills:** `frontend-design`, `clean-code`
- **Prioridade:** P2
- **Dependências:** `TASK-03`, `TASK-05`
- **INPUT:** Telas Stitch 07, 08, 09 e 10.
- **OUTPUT:**
  - `DashboardPage.tsx`: Métricas de receita salva, horários preenchidos e gráfico visual de ocupação.
  - `PublishSlotPage.tsx`: Publicador de horário relâmpago com cálculo automático de porcentagem de desconto a partir dos centavos.
  - `PublishedSlotsPage.tsx`: Tabela de gestão de slots com ações rápidas (pausar/excluir).
  - `ServicesCatalogPage.tsx`: CRUD de serviços oferecidos pelo estabelecimento.
- **VERIFY:** Publicar um novo horário vago reflete instantaneamente no feed da tela Explorar e no Mapa.

### Tarefa 7: Integração Firebase Auth & Firestore Rules
- **ID:** `TASK-07`
- **Agente:** `backend-specialist`
- **Skills:** `vulnerability-scanner`, `api-patterns`
- **Prioridade:** P2
- **Dependências:** `TASK-02`, `TASK-05`, `TASK-06`
- **INPUT:** Arquivo de regras `firestore.rules` e configuração opcional de ambiente (`.env.example`).
- **OUTPUT:** Suporte a Login com Google via Firebase Auth mantendo fallback fluido para o usuário Demo quando sem chaves configuradas. Validação das regras de acesso.
- **VERIFY:** Alternância entre usuário Demo e login autenticado sem quebrar o estado da aplicação.

---

## 9. Fase X: Checklist de Verificação e Validação

- [ ] **TypeScript Strict:** `npx tsc --noEmit` passa sem nenhum erro de tipo.
- [ ] **Build de Produção:** `npm run build` conclui com sucesso gerando bundle otimizado.
- [ ] **Consistência de Preços:** Todos os preços calculados e formatados em centavos sem dízimas (`R$ 80,00` em vez de `79.999999999`).
- [ ] **Interatividade do Mapa:** Leaflet carrega tiles corretamente sem erros de folha de estilo ou marcadores quebrados.
- [ ] **Audit de Acessibilidade & Contraste:** Cores do `DESIGN.md` atendem padrão WCAG AA para contraste de texto e botões.
- [ ] **Responsividade Desktop:** 1440px viewport verificado sem overflow horizontal e mantendo alinhamento editorial.

---

## Próximos Passos Recomendados

1. Revisar este plano e aprovar o escopo detalhado.
2. Iniciar a execução das tarefas através de `/create` ou autorizando o início da `TASK-01`.
