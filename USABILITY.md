# Princípios e regras de usabilidade

As 10 heurísticas de Jakob Nielsen, traduzidas em regras concretas para quem usar este kit - não é teoria solta, cada regra aponta para o componente/token que já a resolve ou que precisas de respeitar ao construir em cima dele.

---

### 1. Visibilidade do estado do sistema

O utilizador deve saber sempre o que está a acontecer, sem adivinhar.

- Toda a acção assíncrona tem estado de carregamento visível: `Button` tem a prop `isLoading` (spinner + `aria-busy`), listas usam `Skeleton` em vez de ecrã vazio a piscar.
- `PeoplePicker` mostra "A pesquisar…" durante o debounce, nunca uma lista vazia ambígua.
- Toda a acção com efeito (aprovar, rejeitar, guardar) termina em `notify.success/error/info` (`shared/ui/toast`) - o utilizador nunca fica sem saber se resultou.
- `Header` mostra sempre o contador de notificações por cima do sino - não obriga a abrir para saber se há algo novo.
- **Regra ao construir features novas**: se uma acção demora mais que ~300ms, tem de ter um estado de loading visível; se muda algo persistente, tem de terminar num toast ou numa mudança visível de UI (não só um `console.log`).

### 2. Correspondência com o mundo real

A linguagem e a ordem devem seguir o que o utilizador já conhece do processo real, não o modelo de dados interno.

- `StatusSelector`/`Badge` usam rótulos de negócio ("Em Aprovação", "Aprovado"), nunca o valor bruto da base de dados (`pending`, `approved`).
- Textos por omissão do kit estão em português (mercado principal das 3 apps de origem); `shared/i18n` existe precisamente para adaptar a outras línguas sem duplicar componentes.
- **Regra**: o mapeamento status→cor (`tone`) e status→rótulo vive em `entities/*` de cada projecto, porque só o domínio sabe qual é a ordem/nome real do processo (ex.: um pedido de acesso e um pedido legal não têm os mesmos estados).

### 3. Controlo e liberdade do utilizador

Tem de haver sempre uma saída - desfazer, cancelar, fechar - sem penalização.

- Nenhuma acção destrutiva ou irreversível acontece num único clique: `ConfirmActionDialog` (`features/confirm-action`) intercepta sempre aprovar/rejeitar/eliminar/remover com um passo de confirmação com "Cancelar" como opção igualmente acessível.
- `Dialog` fecha com Esc, clique fora, ou botão X - sempre as 3 vias, nunca só uma.
- Remover uma pessoa seleccionada no `PeoplePicker` é um clique, sem confirmação extra (não é destrutivo, não precisa de fricção).
- **Regra**: antes de ligar um `onConfirm` a uma chamada de API real, pergunta-te se essa chamada é reversível. Se não for, o `tone="destructive"` do `ConfirmActionDialog` é obrigatório, não opcional.

### 4. Consistência e padrões

O mesmo conceito tem sempre a mesma aparência e o mesmo comportamento, em qualquer sítio da app.

- Um único `Button`, `Badge`, `Dialog`, etc. em `shared/ui` - não um por página. As 3 apps de origem tinham `StatusBadge` reimplementado 3 vezes com cores ligeiramente diferentes; aqui há um só `Badge` com `tone` fixo.
- Os tokens de cor (`--primary`, `--destructive`, `--success`…) em `app/styles/index.css` são a única fonte de verdade - nenhum componente define cor "à mão" fora deles.
- Todas as variantes seguem o mesmo vocabulário: `default | secondary | outline | ghost | destructive` em `Button`; `neutral | primary | success | warning | destructive | info | outline` em `Badge`.
- **Regra**: antes de criar um novo componente, verifica o `COMPONENTS.md` - se já existe algo parecido nas 3 apps de origem, generaliza-o em vez de inventar um padrão novo.

### 5. Prevenção de erros

Mais vale impedir o erro do que mostrar uma boa mensagem depois de ele acontecer.

- `StatusSelector` restringe a um conjunto fixo de opções (`StatusOption[]`) - impossível escrever um status inválido, ao contrário de um campo de texto livre.
- `ConfirmActionDialog` existe para impedir cliques acidentais em acções irreversíveis (ver heurística 3).
- `Button` com `disabled={disabled || isLoading}` impede duplo submit enquanto uma acção já está em curso.
- **Regra**: sempre que uma feature tiver um formulário, valida no cliente antes de submeter (ex.: com Zod, como as 3 apps de origem já fazem) - não confies só na validação do servidor para dar feedback.

### 6. Reconhecimento em vez de memorização

Mostrar opções em vez de obrigar o utilizador a lembrar-se de comandos ou valores.

- `PeoplePicker` é sempre pesquisa+selecção visual - nunca pede para escrever um ID ou email exacto de cor.
- `StatusSelector` mostra as opções possíveis num dropdown, com a cor (`tone`) igual à do `Badge` que mostra esse mesmo status noutro sítio - reconhece-se a cor, não se memoriza o texto.
- `Sidebar` marca sempre a secção activa (`aria-current="page"`) - o utilizador vê onde está sem ter de se lembrar do caminho.
- **Regra**: qualquer campo que hoje seja texto livre mas tenha um conjunto finito de valores válidos (categoria, prioridade, departamento) deve virar um `Select`/`StatusSelector`, não um `Input`.

### 7. Flexibilidade e eficiência de utilização

Atalhos e formas rápidas para quem já conhece o sistema, sem obrigar o iniciante a passar por eles.

- `PeoplePicker` aceita `multiple={false}` para o caso de uma única selecção (ex.: atribuir um responsável) sem forçar sempre o fluxo de múltiplas pessoas.
- `Table`/`Pagination` são compostos separadamente - uma página pode usar só a tabela sem paginação se a lista for curta, sem overhead de um componente "tudo incluído".
- Navegação por teclado funciona em toda a parte (Radix trata disso nos primitivos) - utilizadores avançados não dependem do rato.
- **Regra**: ao construir uma feature de listagem, considera filtros/pesquisa reutilizáveis via URL (query params) para permitir partilhar/guardar uma vista específica - padrão já usado nas 3 apps de origem.

### 8. Design estético e minimalista

Cada ecrã só mostra o que é relevante àquele momento; o resto é ruído.

- `Card`/`CardHeader`/`CardContent` mantêm hierarquia visual consistente (título, descrição, conteúdo) sem decoração extra.
- `TableEmptyState` mostra uma mensagem central simples em vez de uma tabela vazia com cabeçalhos soltos.
- Paleta de cores limitada a tokens semânticos (`primary`, `success`, `warning`, `destructive`, `info`, `neutral`) - não há cores "soltas" por componente.
- **Regra**: antes de acrescentar um badge, ícone ou aviso extra a um ecrã, pergunta-te se remove ambiguidade ou só adiciona ruído visual. Se a resposta for "só para preencher espaço", não entra.

### 9. Ajudar a reconhecer, diagnosticar e recuperar de erros

Erros em linguagem humana, que dizem o que aconteceu e como resolver - nunca um código técnico cru.

- `Input`/`Textarea` têm a prop `invalid` que muda a borda para `destructive` - o erro é visível junto ao campo, não só num toast distante.
- `notify.error` (`shared/ui/toast`) é o canal único para erros de acção - consistente em toda a app, nunca um `alert()` do browser.
- **Regra**: qualquer mensagem de erro ligada a uma feature deve dizer o que falhou e, sempre que possível, o que fazer a seguir (ex.: "Não foi possível guardar - verifica a ligação e tenta novamente", não "Error 500").

### 10. Ajuda e documentação

Idealmente não é preciso, mas quando é, tem de estar onde o utilizador precisa dela.

- `COMPONENTS.md` é a documentação viva de onde cada peça veio e para onde vai - antes de perguntar "isto já existe?", a resposta está lá.
- `pages/kit-showcase` é a "ajuda visual": mostra cada componente a funcionar, para escolheres olhando em vez de imaginando a partir do código.
- `TooltipContent` (`shared/ui/tooltip`) existe para explicações curtas e contextuais junto de ícones/acções ambíguas (ex.: um botão só com ícone).
- **Regra**: qualquer ícone sem texto ao lado (botões `size="icon"`) tem de ter `aria-label` - que serve tanto para leitores de ecrã como de documentação implícita da acção.

---

## Acessibilidade - base transversal a todas as heurísticas

- Foco visível: `:focus-visible` com anel consistente (`--ring`) em `app/styles/index.css`, aplicado a todos os primitivos interactivos.
- Todos os primitivos interactivos (`Dialog`, `DropdownMenu`, `Select`, `Tabs`, `Tooltip`) vêm do Radix UI, que já trata de roles ARIA, gestão de foco e navegação por teclado - não reinventar isto manualmente numa feature nova.
- Contraste dos tokens de cor (claro/escuro) pensado para texto normal sobre fundo - se acrescentares uma cor nova, valida o contraste antes de a usar em texto.
