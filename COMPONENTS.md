# Catálogo de componentes

Inventário de tudo o que existe nas 3 apps de origem - [`req_portal`](../req_portal), [`coutinhos/access_management_system`](../coutinhos/access_management_system) e [`legal_request_management_platform`](../legal_request_management_platform) - mapeado para a camada FSD certa em `structure`.

**Legenda de estado**
- ✅ **Implementado** - já existe em `structure`, funcional e genérico (sem lógica de negócio).
- 📋 **Catalogado** - identificado e mapeado, ainda por portar. Faz-se sob pedido, partindo deste documento.

Cada linha "Catalogado" tem ficheiro(s) de origem para consultares o comportamento real antes de o generalizar.

---

## 1. Primitivos de UI (`shared/ui`)

| Componente | Origem(ns) | Estado | Notas |
|---|---|---|---|
| Button | `req_portal/components/ui/button.tsx`, `legal/.../ui/button.tsx`, `access_mgmt/.../ui/Button.tsx` | ✅ | Variants: default/secondary/outline/ghost/destructive/link; `isLoading` embutido |
| Badge | `req_portal`, `legal`, `access_mgmt` - todos têm `badge.tsx`/`StatusBadge.tsx` | ✅ | Genérico por `tone`; o mapeamento status→tone é de cada `entities/*` |
| Input | `req_portal/ui/input.tsx`, `legal/ui/Input.tsx` | ✅ | |
| Textarea | `req_portal/ui/textarea.tsx` | ✅ | |
| Label | `req_portal/ui/label.tsx`, `legal/ui/label.tsx` | ✅ | |
| Card | `req_portal/ui/card.tsx`, `legal/ui/card.tsx` | ✅ | |
| Avatar | `req_portal/ui/avatar.tsx`, `legal/ui/avatar.tsx` | ✅ | |
| Dialog | `req_portal/ui/dialog.tsx`, `legal/ui/dialog.tsx` | ✅ | |
| DropdownMenu | `req_portal/ui/dropdown-menu.tsx`, `legal/ui/dropdown-menu.tsx` | ✅ | |
| Select | `req_portal/ui/select.tsx`, `legal/ui/select.tsx` | ✅ | |
| Tabs | `req_portal/ui/tabs.tsx`, `legal/ui/tabs.tsx` | ✅ | |
| Separator | `req_portal/ui/separator.tsx` | ✅ | |
| Skeleton | `req_portal/ui/skeleton.tsx`, `legal/ui/skeleton.tsx`, `access_mgmt/ui/Skeleton.tsx` | ✅ | |
| Tooltip | `req_portal/ui/tooltip.tsx` | ✅ | |
| Table | (implícito nas várias `*ListView`/`*Page` de listagem) | ✅ | Generalizado a partir do padrão repetido de tabelas de listagem |
| Pagination | `req_portal/ui/pagination.tsx`, `legal/ui/Pagination.tsx`, `access_mgmt/ui/Pagination.tsx` | ✅ | |
| Toast / notify | `req_portal` (sonner + react-toastify), `access_mgmt`, `legal` (react-toastify) | ✅ | Padronizado em `react-toastify` (presente nas 3) |
| Drawer | `legal/components/ui/drawer.tsx` | 📋 | Painel lateral deslizante - falta generalizar |
| Modal (genérico) | `legal/components/ui/modal.tsx` | 📋 | Provavelmente redundante com Dialog - avaliar ao portar |
| KpiCard | `legal/components/ui/KpiCard.tsx` | 📋 | Card de métrica (valor + variação) para dashboards |
| ActionMenu | `access_mgmt/components/ui/ActionMenu.tsx` | 📋 | Provavelmente redundante com DropdownMenu - avaliar ao portar |
| Form (react-hook-form wrapper) | `req_portal/components/ui/form.tsx` | 📋 | Requer decidir RHF+Zod como dependência do kit primeiro |

## 2. Layout (`widgets`)

| Componente | Origem(ns) | Estado | Notas |
|---|---|---|---|
| Sidebar | `req_portal/layout/DashboardSidebar.tsx`, `legal/layout/Sidebar.tsx`, `access_mgmt/layout/Sidebar.tsx` | ✅ | `widgets/sidebar` |
| Header | `req_portal/layout/DashboardHeader.tsx`, `legal/layout/Header.tsx`, `access_mgmt/layout/Header.tsx` | ✅ | `widgets/header` |
| MobileNav | `req_portal/layout/MobileNav.tsx`, `legal/layout/MobileNav.tsx` | ✅ (fundido) | Consolidado dentro do próprio `Sidebar` (modo drawer responsivo) em vez de um widget à parte |
| DashboardLayout / AppLayout | `req_portal/layout/DashboardLayout.tsx`, `access_mgmt/layout/AppLayout.tsx` | ✅ | `widgets/page-shell` |
| Navigation | `legal/components/layout/Navigation.tsx` | 📋 | Breadcrumbs/navegação secundária - avaliar sobreposição com Sidebar |
| NotificationBell (dropdown completo) + página de notificações | `access_mgmt/layout/NotificationBell.tsx`, `req_portal` `app/notifications`, `legal` `app/notifications` | ✅ | `Header` (dropdown com as 2 mais recentes) + `pages/notifications` (lista completa com filtros), estado partilhado via `entities/notification` |
| ScopeConsentModal | `req_portal/layout/ScopeConsentModal.tsx`, `legal/layout/ScopeConsentModal.tsx` | ✅ | `features/permissions-consent` (`PermissionsDialog`) - genérico, os estados de consentimento vêm de fora (`scopes` prop) em vez de chamar MSAL directamente |
| TourButton + tour-config | `req_portal/tour/TourButton.tsx` + `lib/tour`, `legal/layout/TourButton.tsx` + `lib/tour` | 📋 | Onboarding guiado (driver.js) - `features/product-tour` |

## 3. Auth, utilizadores e sessão (`entities/user`, `features/auth`)

| Componente | Origem(ns) | Estado | Notas |
|---|---|---|---|
| ProtectedRoute / ProtectedAction | `req_portal/components/auth/*` | 📋 | Guardas de rota/acção por permissão - depende do modelo de roles de cada projecto |
| AuthContext / MsalAuthContext / NextAuthContext | `req_portal/contexts/*`, `legal/contexts/AuthContext.tsx` | 📋 | Ligação MSAL/NextAuth - infra específica, não faz parte do kit genérico |
| SecurityInit / security.ts | `legal/components/SecurityInit.tsx`, `legal/lib/security.ts` | 📋 | Hardening de sessão (CSP, timeouts) |
| ConnectionIssueModal | `legal/components/ConnectionIssueModal.tsx` | 📋 | Estado de erro de ligação ao SharePoint - bom candidato a `features/connection-status` genérico |
| useAuthWatchdog | `hradmin-new` (fora do escopo pedido, referência) | - | Não catalogado - projecto não incluído no pedido |

## 4. Pessoas / organização (`features/people-picker`, `entities/employee`)

| Componente | Origem(ns) | Estado | Notas |
|---|---|---|---|
| PeoplePicker (genérico) | `req_portal/shared/PeoplePicker.tsx`, `legal/ui/PeoplePicker.tsx`, `access_mgmt/workflow/PeoplePicker.tsx` | ✅ | `features/people-picker` - recebe `search` injectado |
| SharePointUserPicker | `access_mgmt/workflow/SharePointUserPicker.tsx` | 📋 | Implementação concreta do `search` do PeoplePicker sobre Graph/SharePoint |
| useGraph / graph hooks | `req_portal/hooks/graph.tsx`, `legal/hooks/graph.ts`, `access_mgmt/hooks/useGraph.ts` | 📋 | `shared/api` - cliente Graph, específico de cada backend |

## 5. Status e fluxo de aprovação (`features/status-selector`, `features/confirm-action`, futuro `features/workflow`)

| Componente | Origem(ns) | Estado | Notas |
|---|---|---|---|
| StatusBadge | `req_portal/shared/StatusBadge.tsx`, `legal/requests/StatusBadge.tsx`, `access_mgmt/ui/StatusBadge.tsx` | ✅ | `Badge` com `tone` - mapeamento status→tone é `entities/request/lib/status.ts` (`RequestStatusBadge`) |
| StatusSelector | `req_portal/shared/StatusSelector.tsx` | ✅ | `features/status-selector` |
| ConfirmDialog / ConfirmActionDialog / ApproveChangeRequestDialog / RejectChangeRequestDialog / StatusTransitionModal (regras de motivo obrigatório/opcional) | `access_mgmt/workflow/ConfirmDialog.tsx`, `req_portal/shared/ConfirmActionDialog.tsx`, `req_portal/changeRequest/{Approve,Reject}ChangeRequestDialog.tsx`, `legal/requests/StatusTransitionModal.tsx` | ✅ | `features/confirm-action` - um único dialog com `reason.required` a decidir a regra (aprovar = comentário opcional, rejeitar/cancelar = motivo obrigatório com erro inline); `extraFields` para campos extra tipo "dias de impacto" |
| Acções de pedido (aprovar/pedir info/rejeitar/cancelar/concluir) por status | `legal/requests/StatusTransitionModal.tsx` (`getActionConfig`) | ✅ | `pages/request-detail/lib/actions.ts` - que acções aparecem e a regra de cada, por status actual |
| AppStatusBadge | `access_mgmt/workflow/AppStatusBadge.tsx` | 📋 | Variante de StatusBadge por aplicação/sistema de acesso |
| StageProgressBar / StageWrapper | `access_mgmt/workflow/StageProgressBar.tsx`, `StageWrapper.tsx` | 📋 | Barra de progresso multi-etapa de um workflow de aprovação |
| ConfigDrivenStage / DynamicField / fieldVisibility / validateStage | `access_mgmt/workflow/*` | 📋 | Motor de formulário dirigido por configuração - feature grande, avaliar isoladamente |
| SendBackModal / SendBackAlertThread | `access_mgmt/workflow/*` | 📋 | Devolver pedido ao requerente com comentário - já coberto pelo `reason` do ConfirmActionDialog; falta só o thread de histórico do "send back" |
| AssignModal / CommentModal / DocumentUploadModal / DeleteRequestModal | `legal/components/requests/*` | 📋 | Especializações de Dialog para acções que ainda não têm equivalente genérico (atribuir responsável, upload) |
| ApproveProjectDialog / RejectProjectDialog / RemoveTeamMemberDialog | `req_portal/components/project/*` | 📋 | Mesma família do ConfirmActionDialog, específicas do domínio "projecto" |

## 6. Dashboards e gráficos (`widgets/dashboard-*`)

| Componente | Origem(ns) | Estado | Notas |
|---|---|---|---|
| DashboardContent / DashboardCharts / CorporateDocsMetrics | `legal/components/dashboard/*`, `access_mgmt/components/dashboard/*` | 📋 | `req_portal` usa Recharts, `legal`/`access_mgmt` usam Nivo - decidir uma lib antes de portar |
| ProjectsChart / GanttChart / SimpleGanttChart / PriorityComparisonChart / ProjectEvolutionChart / StatusDistributionChart | `req_portal/components/charts/*` | 📋 | |
| KpiCard + metrics.ts + palette.ts | `legal/ui/KpiCard.tsx`, `access_mgmt/dashboard/{metrics,palette}.ts` | 📋 | |

## 7. Documentos (`features/document-upload`, `features/export-pdf`)

| Componente | Origem(ns) | Estado | Notas |
|---|---|---|---|
| DocumentList / DocumentUploader / DocumentManagerPage / MandatoryChecklist | `legal/components/documents/*` | 📋 | |
| generateRequestPDF / pdf-generator | `access_mgmt/lib/generateRequestPDF.ts`, `req_portal/lib/pdf-generator.ts` | 📋 | Ambos usam jsPDF - boa base comum |

## 8. Formulários e páginas de domínio (`pages/*`, `entities/*`)

| Componente | Origem(ns) | Estado | Notas |
|---|---|---|---|
| RequestsListView (grelha de cards, não tabela) | `legal/components/requests/RequestsListView.tsx` | ✅ | `pages/requests` - barra de pesquisa + filtro de status em dropdown + botão criar, grelha responsiva, estado vazio, paginação com contagem "a mostrar X–Y de Z" |
| RequestDetailView / RequestDetailPage | `legal/components/requests/RequestDetailView.tsx`, `access_mgmt/pages/RequestDetailPage.tsx` | ✅ | `pages/request-detail` - cartão de cabeçalho (requerente, estatísticas, menu de acções), tabs Detalhes/Histórico/Documentos/Comentários, layout 2+1 colunas |
| entity `request` genérico (tipos + mock + status→tone) | - (extraído do padrão comum às 3) | ✅ | `entities/request` - substitui por uma chamada real a `shared/api` quando ligares o teu backend |
| entity `notification` + estado partilhado | `req_portal`/`legal` `types/notification.ts` | ✅ | `entities/notification` - `NotificationsProvider`/`useNotifications`, consumido pelo Header e por `pages/notifications` |
| ChangeRequestForm / ProjectRequestFormNew | `req_portal/components/forms/*` | 📋 | Formulário de criação - específico do domínio "projecto/pedido de mudança" |
| LegalRequestForm / EditRequestLoader | `legal/components/forms/*` | 📋 | Idem, domínio "pedido legal" |
| AccessRequestForm / AccessPanel | `access_mgmt/components/*` | 📋 | Idem, domínio "pedido de acesso" |
| ProjectsListView / ProjectDetailView / UnifiedProjectDetailPage | `req_portal/components/project/*` | 📋 | Equivalente do que já foi generalizado para "request", mas para "project" |
| StageFillerPage | `access_mgmt/pages/StageFillerPage.tsx` | 📋 | Formulário de preenchimento de uma etapa de workflow - depende do motor `ConfigDrivenStage` (secção 5) |
| ApprovalCenterContent / admin `change-requests` | `legal/components/approval/*`, `req_portal/app/admin/change-requests` | 📋 | Vista agregada de "tudo o que espera a minha aprovação" entre vários tipos de pedido |
| EmployeeListPage / UserInfoPage | `access_mgmt/pages/*` | 📋 | Gestão de utilizadores/colaboradores - `entities/employee` |
| SystemLogsPage / admin `logs` | `access_mgmt/pages/SystemLogsPage.tsx`, `req_portal/app/admin/logs` | 📋 | Auditoria - tabela de eventos com filtros |

## 9. i18n (`shared/i18n`, `features/language-switcher`)

| Componente | Origem(ns) | Estado | Notas |
|---|---|---|---|
| I18nContext | `req_portal/contexts/I18nContext.tsx`, `legal/contexts/I18nContext.tsx` | ✅ | `shared/i18n` - dicionário simples por chaves, sem i18next (2 das 3 apps usam este padrão) |
| LangToggle (botão que roda pt→en→fr) | `legal/components/layout/Header.tsx` (`LangToggle`) | ✅ | `features/language-switcher` - à risca o padrão do legal: um botão só, sem dropdown, mostra o código do idioma actual |

**Sem modo escuro/claro** - nenhuma das 3 apps de origem tem um toggle de tema (só `next-themes` como dependência não usada no `req_portal`); o kit segue um único tema em `app/styles/index.css`.

## 10. Infra (SharePoint / Graph / Auth) - `shared/api`

Não faz parte do UI kit, mas é o "cabo" que liga os componentes acima a dados reais. Catalogado para que saibas onde ligar cada `search`/`onConfirm`/fonte de dados ao adoptar o kit num projecto novo.

| Módulo | Origem(ns) |
|---|---|
| SharePoint client/lists/permissions | `req_portal/lib/sharepoint/*`, `access_mgmt/lib/sharepoint/*`, `legal/services/sharepoint/*` |
| MSAL config/instance | `req_portal/lib/msal/*`, `access_mgmt/auth/*` |
| Jira client/sync | `req_portal/lib/jira/*` |
| Activity log / approval workflow / authorization | `legal/lib/activityLog.ts`, `approvalWorkflow.ts`, `authorization.ts` |

---

## Como pedir para portar algo desta lista

Aponta a linha (ex.: "porta o StageProgressBar") - vou aos ficheiros de origem indicados, generalizo (removo nomes de domínio, states de negócio específicos, chamadas SharePoint/Graph directas) e entrego como `features/*` ou `widgets/*` consistente com o que já está implementado, actualizando este catálogo de 📋 para ✅.
