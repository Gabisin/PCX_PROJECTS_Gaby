# structure

Admin dashboard template / SaaS boilerplate em React + TypeScript, organizado segundo a arquitectura **Feature-Sliced Design (FSD)**.

Vem com um **UI kit funcional e genérico** (design system, layout, features transversais) extraído do denominador comum de 3 sistemas reais - pronto a escolher e montar num projecto novo, não só uma pasta vazia com boas intenções.

```
npm install
npm run dev   # abre a app real - grelha de Pedidos em "/", detalhe em "/requests/:id", notificações e vitrine de componentes na sidebar
```

## Porquê este projecto existe

Analisei 3 apps que resolvem o mesmo problema - um portal de pedidos/aprovações com autenticação Microsoft (MSAL/SharePoint) - cada uma reimplementada do zero:

- [`req_portal`](../req_portal) - Next.js
- [`coutinhos/access_management_system`](../coutinhos/access_management_system) - Vite
- [`legal_request_management_platform`](../legal_request_management_platform) - Next.js

Padrão repetido nas 3: pastas `components/`/`pages/` planas, misturando UI genérica (`ui/button.tsx`) com UI de domínio (`RequestDetailView.tsx`) e páginas inteiras no mesmo nível; `hooks/`/`lib/` como gavetas únicas; nenhuma fronteira explícita entre "reutilizável em qualquer projecto" (`StatusBadge`, `PeoplePicker`, cliente HTTP) e "específico deste domínio" (`ChangeRequestForm`, `useAppApprovals`). Resultado: as 3 reimplementam auth MSAL, i18n, people-picker, PDF export e tabelas de aprovação, cada uma à sua maneira.

`structure` resolve isto em duas frentes:
1. **FSD** impõe uma hierarquia de camadas com regras de importação explícitas, separando o genérico do específico.
2. Um **UI kit já construído** em cima dessa estrutura - ver [`COMPONENTS.md`](./COMPONENTS.md) para o inventário completo (o que já está pronto vs. o que falta portar) e [`USABILITY.md`](./USABILITY.md) para as regras de usabilidade que o kit segue.

## O que já vem pronto

Ícones: **lucide-react** em todo o kit (é a lib comum às 3 apps de origem). Estilo: Tailwind v4 + Radix UI (padrão shadcn), também o denominador comum entre as 3.

### Identidade visual - replicada à risca, não reinventada

- **Sidebar** - fundo em gradiente subtil, logo da Africell centrado no topo com borda inferior, item activo com **fundo branco + sombra e o ícone dentro de uma caixa preenchida** na cor de marca - pixel-a-pixel o padrão de `access_management_system/components/layout/Sidebar.tsx` (não o padrão de barra lateral do req_portal/legal).
- **Header** fixo, branco, alinhado a partir do fim da sidebar (`lg:left-64`): título à esquerda, selector de idioma, sino de notificações com dropdown completo (últimas 2 + "ver todas"), separador vertical, menu de conta (avatar + nome + cargo) com entrada **"Permissões MS 365"** e terminando sempre em "Terminar sessão" a vermelho.
- **Selector de idioma** - um único botão que roda pt→en→fr e mostra o código do idioma actual, sem dropdown - o `LangToggle` exacto do `legal_request_management_platform/Header.tsx`.
- **Sem modo escuro/claro** - nenhuma das 3 apps de origem tem; o kit segue um único tema.
- **Logo real da Africell** (`public/africell_logo2.jpeg`) - não um placeholder genérico; troca o ficheiro para reaproveitar o layout com outra marca.
- **Cor de marca**: as 3 apps usam a mesma família magenta (`#b41675` / `#a01775` / `#A1007C`). Centralizei em `#A1007C` como `--primary` em `app/styles/index.css` - é o **único token que precisas de mudar** para re-skinnar todo o kit.
- **Fundo**: página em cinzento muito claro (`slate-50`) com sidebar/header/cards brancos por cima.
- **Breakpoint**: sidebar fixa a partir de `lg` (1024px), com drawer + overlay abaixo disso - o padrão do `access_management_system`.

### Já é uma app navegável, não só uma vitrine

`app/routes/AppRouter.tsx` liga tudo com `react-router-dom` - a sidebar aponta para rotas reais:

| Rota | Página | Reproduz |
|---|---|---|
| `/` | `pages/requests` | `RequestsListView` do legal - **grelha de cards** (não tabela), pesquisa, filtro de status, paginação |
| `/requests/:id` | `pages/request-detail` | `RequestDetailView`/`RequestDetailPage` - cabeçalho com requerente+stats, tabs Detalhes/Histórico/Documentos/Comentários, menu de acções com regras (ver abaixo) |
| `/notifications` | `pages/notifications` | Página de notificações completa do req_portal - filtros todas/não lidas/lidas, marcar (todas) como lida |
| `/kit-showcase` | `pages/kit-showcase` | Vitrine dos primitivos do UI kit isolados |

| Camada | O que tens |
|---|---|
| `shared/ui` | Button, Badge, Input, Textarea, Label, Card, Avatar, Dialog, DropdownMenu, Select, Tabs, Separator, Skeleton, Tooltip, Table, Pagination, Toast |
| `shared/i18n` | Provider + dicionário pt/en/fr, extensível |
| `entities/request` | Tipos, dados mock e mapeamento status→cor de um pedido genérico |
| `entities/notification` | Tipos + estado partilhado (`NotificationsProvider`/`useNotifications`) entre o Header e a página de notificações |
| `widgets` | Sidebar (estilo access_management_system), Header (notificações + conta + permissões), PageShell |
| `features` | LanguageSwitcher (LangToggle), PeoplePicker, StatusSelector, ConfirmActionDialog (aprovar/rejeitar **com regras**: motivo opcional ou obrigatório, validado ao confirmar), PermissionsDialog ("Permissões MS 365") |
| `app/routes` | `AppRouter`, `AppShell` (layout route), `nav.tsx`, `routeTitles.ts` |
| `app/providers` | `AppProviders` (i18n + tooltip + toasts) |

**Regras de aprovar/rejeitar/cancelar** (`pages/request-detail/lib/actions.ts`, generalizado de `StatusTransitionModal`/`Approve|RejectChangeRequestDialog`): que acções aparecem depende do status actual do pedido; aprovar pede um comentário opcional, rejeitar e cancelar exigem motivo - tentar confirmar sem o escrever mostra o erro em vez de deixar o botão simplesmente inerte.

Tudo o resto que existe nas 3 apps (dashboards com gráficos, formulários de criação de pedido, workflow de aprovação multi-etapa configurável, upload de documentos, etc.) está **catalogado mas não portado** - ver [`COMPONENTS.md`](./COMPONENTS.md) para a lista completa com origem de cada componente. Pede para portar o que precisares; o catálogo diz exactamente que ficheiro de origem generalizar.

## O que é Feature-Sliced Design

FSD organiza o código em **camadas** (layers), cada uma dividida em **fatias** (slices) por domínio/funcionalidade, e cada fatia dividida em **segmentos** (segments) por tipo técnico.

```
Camada    → Fatia         → Segmento
widgets   → sidebar        → ui/, model/
```

### Camadas (de cima para baixo)

| Camada | Responsabilidade | Exemplos (das 3 apps de origem → o que existe em `structure`) |
|---|---|---|
| `app` | Inicialização: providers globais, router, estilos globais, tema/i18n. | `ClientProviders`, `AuthContext`, `layout.tsx` → `app/providers/AppProviders`, `app/styles/index.css` |
| `pages` | Uma página = composição de widgets/features para uma rota. Sem lógica de negócio própria. | `RequestsPage`, `ApprovalsPage`, `SystemLogsPage` → `pages/kit-showcase` (vitrine; as páginas de produto ficam por construir) |
| `widgets` | Blocos de UI compostos, usados em várias páginas. | `DashboardSidebar` + `DashboardHeader` + `AppLayout` → `widgets/sidebar`, `widgets/header`, `widgets/page-shell` |
| `features` | Uma acção do utilizador com valor de negócio próprio. | `PeoplePicker`, `ApproveChangeRequestDialog`, troca de idioma/tema → `features/people-picker`, `features/confirm-action`, `features/status-selector`, `features/theme-switcher`, `features/language-switcher` |
| `entities` | Modelo de negócio + como o mostrar/obter minimamente. Substantivos, não acções. | `user`, `employee`, `project`, `request`, `approval`, `notification` → por construir (ver `COMPONENTS.md` secções 3, 5 e 8) |
| `shared` | Código sem conhecimento de negócio, reutilizável em qualquer projecto. | `components/ui/*`, `lib/utils.ts`, i18n → `shared/ui/*`, `shared/lib/cn.ts`, `shared/i18n` |

Regra de importação: **uma camada só pode importar de camadas abaixo dela** (`pages` pode usar `widgets`/`features`/`entities`/`shared`, nunca o inverso; `shared` não importa de mais ninguém). Dentro da mesma camada, uma fatia **não importa directamente doutra fatia irmã** (ex.: `features/status-selector` não importa de `features/people-picker`; se precisares de combinar as duas, isso acontece numa `page` ou num `widget`).

### Segmentos (dentro de cada fatia)

| Segmento | Conteúdo |
|---|---|
| `ui/` | Componentes React |
| `model/` | Estado, tipos, stores, hooks de estado |
| `api/` | Chamadas a serviços externos (SharePoint, Graph, REST) |
| `lib/` | Funções auxiliares específicas da fatia |
| `config/` | Constantes e configuração da fatia |

Uma fatia expõe apenas o necessário através de um `index.ts` (API pública) - importa sempre `@features/people-picker`, nunca `@features/people-picker/ui/PeoplePicker` directamente de fora da fatia.

## Estrutura de pastas

```
structure/
├── COMPONENTS.md              # catálogo: todos os componentes das 3 apps, mapeados a uma camada FSD
├── USABILITY.md                # regras de usabilidade (10 heurísticas de Nielsen aplicadas a este kit)
├── index.html
├── package.json
├── vite.config.ts              # plugins React + Tailwind, aliases @app, @pages, @widgets, @features, @entities, @shared
├── tsconfig*.json
├── eslint.config.js
└── src/
    ├── main.tsx                 # composition root - <AppProviders><AppRouter/></AppProviders>
    ├── app/
    │   ├── config/               # mockData.ts - utilizador e scopes de permissões de demonstração
    │   ├── providers/            # AppProviders (i18n + tooltip + toasts)
    │   ├── routes/                # AppRouter, AppShell (layout route), nav.tsx, routeTitles.ts
    │   └── styles/                 # index.css - tokens de cor e import do Tailwind
    ├── pages/
    │   ├── requests/               # grelha de pedidos (rota "/")
    │   ├── request-detail/          # detalhe + acções com regras (rota "/requests/:id")
    │   ├── notifications/           # página de notificações (rota "/notifications")
    │   └── kit-showcase/            # vitrine dos primitivos do UI kit (rota "/kit-showcase")
    ├── widgets/
    │   ├── sidebar/
    │   ├── header/
    │   └── page-shell/             # sidebar + header + área de conteúdo
    ├── features/
    │   ├── language-switcher/
    │   ├── people-picker/
    │   ├── status-selector/
    │   ├── confirm-action/
    │   └── permissions-consent/    # "Permissões MS 365"
    ├── entities/
    │   ├── request/                # tipos + mock + status→cor de um pedido genérico
    │   └── notification/           # tipos + estado partilhado (NotificationsProvider)
    └── shared/
        ├── ui/                    # Button, Badge, Input, Dialog, Table… (design system)
        ├── api/                    # vazio - cliente HTTP/SharePoint/Graph do teu projecto
        ├── config/                 # vazio - env vars, feature flags
        ├── i18n/                    # I18nProvider + dicionários pt/en/fr
        ├── lib/                     # cn.ts, formatTimeAgo.ts
        └── types/                    # status-option.ts (tipo partilhado por entities e features)
```

Pastas ainda vazias (`shared/api`, `shared/config`) mantêm um `.gitkeep` só para o git as versionar.

## Como usar como base para um novo projecto

1. Copiar esta pasta e renomear (`cp -r structure novo-projecto`).
2. Ajustar `package.json` (`name`), o favicon/título em `index.html`, e trocar `public/africell_logo2.jpeg` pela tua marca (actualiza a referência em `app/routes/AppShell.tsx`).
3. Trocar `entities/request`/`entities/notification` pelas entidades reais do teu domínio (mesma forma: `model/types.ts`, `model/mock.ts` → depois `api/` com a chamada real), e `app/config/mockData.ts` pelo utilizador vindo do teu provedor de auth.
4. Editar `app/routes/nav.tsx` e `AppRouter.tsx` com as tuas rotas; `pages/requests`/`pages/request-detail` já mostram o padrão a seguir (grelha + detalhe com tabs + acções via `ConfirmActionDialog`).
5. Ligar `shared/api` (SharePoint/Graph/REST) e passar as funções reais (`search` do PeoplePicker, `onRequestConsent` do PermissionsDialog, etc.) às features.

### Dependências já incluídas

`@radix-ui/*`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `react-toastify`, `tailwindcss` v4 + `@tailwindcss/vite`, `react-router-dom`.

### Dependências a acrescentar consoante o projecto

- **Auth Microsoft**: `@azure/msal-browser`, `@azure/msal-react` → `shared/config` (instância MSAL) + `features/auth` + `entities/user`.
- **Formulários**: `react-hook-form`, `@hookform/resolvers`, `zod` → validação em `entities/<x>/model`, formulário em `features/<x>-form`.
- **Gráficos**: `recharts` (usado no `req_portal`) ou `@nivo/*` (usado no `access_management_system`/`legal_request_management_platform`) → `widgets/dashboard-*`.
- **PDF**: `jspdf` (+ `jspdf-autotable`) → `features/export-pdf`.

## Manter as fronteiras (opcional, recomendado)

Para o projecto não voltar a degenerar em pastas planas à medida que cresce:

- [`steiger`](https://github.com/feature-sliced/steiger) - linter dedicado a FSD, valida a hierarquia de camadas e a API pública das fatias.
- ou `eslint-plugin-boundaries` configurado manualmente com as mesmas regras.

## Referência

- Documentação oficial FSD: https://feature-sliced.design
- [`COMPONENTS.md`](./COMPONENTS.md) - catálogo completo de componentes
- [`USABILITY.md`](./USABILITY.md) - princípios e regras de usabilidade
