# structure

Projecto-base React + TypeScript, organizado segundo a arquitectura **Feature-Sliced Design (FSD)**.

Não contém funcionalidades nem componentes de negócio — é só o esqueleto (pastas, aliases, configuração de build/lint) para arrancar rapidamente projectos futuros que sigam o mesmo padrão, começando pelo `access_management_system` (Coutinhos) e o `req_portal`.

## Porquê este projecto existe

Analisei o [`req_portal`](../req_portal) (Next.js) e o [`coutinhos/access_management_system`](../coutinhos/access_management_system) (Vite) e ambos são, no fundo, o mesmo tipo de aplicação — um portal de pedidos/aprovações com autenticação Microsoft (MSAL/SharePoint) — mas organizados de forma diferente:

- Pastas `components/` e `pages/` planas, misturando UI genérica (`ui/button.tsx`), UI de domínio (`project/ProjectDetailDialog.tsx`) e páginas inteiras no mesmo nível.
- `hooks/` e `lib/` como "gavetas" únicas onde vive tudo — hooks de auth, de SharePoint, de formulários e de regras de negócio lado a lado.
- Nenhuma fronteira explícita entre "isto é reutilizável em qualquer projecto" (ex.: `StatusBadge`, `PeoplePicker`, cliente HTTP) e "isto é específico deste domínio" (ex.: `ChangeRequestForm`, `useAppApprovals`).

Isto funciona, mas dificulta reaproveitar código entre projectos (ambos reimplementam auth MSAL, i18n, people-picker, PDF export, tabelas de aprovação, etc. do zero) e cresce mal à medida que se acrescentam módulos. FSD resolve isto impondo uma hierarquia de camadas com regras de importação explícitas, para que o que é genérico fique isolado do que é específico de um domínio.

## O que é Feature-Sliced Design

FSD organiza o código em **camadas** (layers), cada uma dividida em **fatias** (slices) por domínio/funcionalidade, e cada fatia dividida em **segmentos** (segments) por tipo técnico.

```
Camada    → Fatia         → Segmento
widgets   → dashboard      → ui/, model/
```

### Camadas (de cima para baixo)

| Camada | Responsabilidade | Exemplos vindos do req_portal / access_management_system |
|---|---|---|
| `app` | Inicialização: providers globais, router, estilos globais, configuração de i18n/tema. | `ClientProviders.tsx`, `AuthContext`, `I18nContext`, `layout.tsx`, `main.tsx` |
| `pages` | Uma página = composição de widgets/features para uma rota. Sem lógica de negócio própria. | `app/requester/page.tsx`, `RequestsPage.tsx`, `ApprovalsPage.tsx`, `SystemLogsPage.tsx` |
| `widgets` | Blocos de UI compostos e independentes de contexto, usados em várias páginas. | `DashboardSidebar`, `DashboardHeader`, `ProjectsChart` + `StatusDistributionChart` juntos num painel |
| `features` | Uma acção do utilizador com valor de negócio próprio (fazer algo). | `ChangeRequestForm` (criar pedido), `ApproveChangeRequestDialog` (aprovar), `PeoplePicker` (escolher pessoa), troca de idioma |
| `entities` | Modelo de negócio + como o mostrar/obter minimamente. Substantivos, não acções. | `user`, `employee`, `project`, `change-request` / `access-request`, `approval`, `notification`, `system-log` |
| `shared` | Código sem conhecimento de negócio, reutilizável em qualquer projecto. | `components/ui/*` (botão, dialog, input…), `lib/utils.ts`, cliente HTTP/axios, config MSAL, i18n, tipos genéricos |

Regra de importação: **uma camada só pode importar de camadas abaixo dela** (`pages` pode usar `widgets`/`features`/`entities`/`shared`, nunca o inverso; `shared` não importa de mais ninguém). Dentro da mesma camada, uma fatia **não importa directamente doutra fatia irmã** (ex.: `entities/project` não deve importar de `entities/user`; se precisar, sobe-se a lógica para `features` ou `widgets`).

### Segmentos (dentro de cada fatia)

| Segmento | Conteúdo |
|---|---|
| `ui/` | Componentes React |
| `model/` | Estado, tipos, stores, hooks de estado |
| `api/` | Chamadas a serviços externos (SharePoint, Graph, REST) |
| `lib/` | Funções auxiliares específicas da fatia |
| `config/` | Constantes e configuração da fatia |

Uma fatia expõe apenas o necessário através de um `index.ts` (API pública) — o resto dos ficheiros não deve ser importado directamente de fora da fatia.

## Estrutura de pastas

```
structure/
├── index.html
├── package.json
├── vite.config.ts            # aliases @app, @pages, @widgets, @features, @entities, @shared
├── tsconfig*.json
├── eslint.config.js
└── src/
    ├── main.tsx               # composition root
    ├── app/
    │   ├── providers/         # providers globais (auth, i18n, tema, query client…)
    │   ├── routes/            # definição de rotas / router
    │   └── styles/            # estilos e tokens globais
    ├── pages/                 # 1 pasta por rota, compõe widgets/features
    ├── widgets/                # blocos de UI compostos e reutilizáveis entre páginas
    ├── features/               # acções do utilizador (criar, aprovar, filtrar, exportar…)
    ├── entities/               # modelos de negócio (user, project, request, approval…)
    └── shared/
        ├── ui/                # design system / componentes puros (equivalente a components/ui)
        ├── api/               # cliente HTTP base, config de endpoints
        ├── config/            # env vars, feature flags
        ├── i18n/              # setup i18next, sem as traduções de domínio
        ├── lib/                # utilitários genéricos (datas, cn/clsx, etc.)
        └── types/              # tipos partilhados sem dono de domínio
```

Cada pasta de camada/segmento tem um `.gitkeep` só para o git a versionar enquanto está vazia — apaga-o assim que lá meteres o primeiro ficheiro real.

## Como usar como base para um novo projecto

1. Copiar esta pasta e renomear (`cp -r structure novo-projecto`).
2. Ajustar `package.json` (`name`) e instalar as dependências específicas do domínio (ver secção seguinte).
3. Modelar as `entities` primeiro (o que já existe nos dois projectos analisados: `user`/`employee`, `project`, `request` — change-request ou access-request —, `approval`, `notification`, `system-log`).
4. Construir `features` sobre essas entidades (criar pedido, aprovar/rejeitar, people-picker, exportar PDF, trocar idioma).
5. Compor `widgets` (sidebar, header, dashboard de gráficos) e por fim `pages`.
6. Ligar tudo em `app/routes` e `app/providers`.

### Dependências a acrescentar consoante o projecto

Não vêm pré-instaladas porque são específicas de domínio, não de estrutura — mas é isto que o `req_portal` e o `access_management_system` já usam e que provavelmente vais voltar a precisar:

- **Auth Microsoft**: `@azure/msal-browser`, `@azure/msal-react` → vive em `shared/config` (instância MSAL) + `features/auth` (login/logout) + `entities/user`.
- **Formulários**: `react-hook-form`, `@hookform/resolvers`, `zod` → validação em `entities/<x>/model`, formulário em `features/<x>-form`.
- **i18n**: `i18next`, `react-i18next` → setup em `shared/i18n`, ficheiros de tradução por fatia ou centralizados, como preferires.
- **UI kit**: Tailwind + Radix (`@radix-ui/*`) ou o que já usas → componentes puros em `shared/ui`.
- **Gráficos**: `recharts` ou `@nivo/*` → `widgets/*-chart` ou `entities/*/ui` conforme o âmbito.
- **PDF**: `jspdf` (+ `jspdf-autotable`) → `features/export-pdf` ou `shared/lib` se for genérico.
- **Notificações toast**: `react-toastify` / `sonner` → `shared/ui` ou `app/providers`.

## Manter as fronteiras (opcional, recomendado)

Para o projecto não voltar a degenerar em pastas planas, considera adicionar mais tarde uma verificação automática das regras de import:

- [`steiger`](https://github.com/feature-sliced/steiger) — linter dedicado a FSD, valida a hierarquia de camadas e a API pública das fatias.
- ou `eslint-plugin-boundaries` configurado manualmente com as mesmas regras.

## Referência

- Documentação oficial: https://feature-sliced.design
