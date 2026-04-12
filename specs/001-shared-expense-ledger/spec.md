# Feature Specification: FairShareApp Shared Expense Ledger

**Feature Branch**: `001-shared-expense-ledger`  
**Created**: 2026-04-12  
**Status**: Draft  
**Input**: User description: "Projeto FairShareApp: plataforma de gestão de despesas compartilhadas com grupos colaborativos, registro instantâneo de gastos, saldos em tempo real, notificações no grupo e quitação entre membros."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Criar grupo colaborativo (Priority: P1)

Como pessoa que organiza despesas recorrentes com outras pessoas, quero criar um grupo fechado e convidar membros para começar a registrar gastos compartilhados sem depender de planilhas externas.

**Why this priority**: Sem grupo e membros ativos não existe base confiável para cálculo de rateio, visibilidade de saldo ou quitação.

**Independent Test**: Uma pessoa cria um grupo, envia convites por link ou e-mail, pelo menos dois membros entram no grupo e passam a aparecer como participantes ativos aptos para rateio.

**Acceptance Scenarios**:

1. **Given** que uma pessoa autenticada ainda não possui um grupo para dividir despesas, **When** ela cria um grupo com nome identificável, **Then** o sistema cria o grupo e registra essa pessoa como membro ativo.
2. **Given** que um grupo já existe, **When** a pessoa responsável envia convites por link ou e-mail, **Then** os convidados recebem acesso para entrar no grupo e passam a contar como membros ativos após aceitarem o convite.
3. **Given** que a composição do grupo mudou, **When** um membro é ativado ou removido, **Then** o sistema usa a nova lista de membros ativos apenas para despesas registradas a partir dessa mudança.

---

### User Story 2 - Registrar despesa com rateio imediato (Priority: P1)

Como membro de um grupo, quero lançar rapidamente uma despesa com valor e descrição para que o sistema distribua o gasto entre os participantes ativos e atualize quem deve para quem no mesmo momento.

**Why this priority**: Este é o fluxo central do produto e entrega o principal valor de negócio: eliminar fechamento manual e dívida esquecida.

**Independent Test**: Em um grupo com quatro membros ativos, um deles registra uma despesa de R$ 22,00 e o sistema gera três parcelas de R$ 5,50 para os demais membros, atualizando os saldos imediatamente.

**Acceptance Scenarios**:

1. **Given** um grupo com membros ativos, **When** um membro registra uma despesa informando valor e descrição, **Then** o sistema registra o gasto em nome do pagador e divide o valor igualmente entre todos os membros ativos do grupo naquele momento.
2. **Given** uma despesa registrada com sucesso, **When** o rateio é concluído, **Then** o sistema cria as obrigações financeiras dos demais membros para com o pagador e atualiza o saldo líquido de cada participante.
3. **Given** que uma nova despesa foi lançada, **When** o processamento termina, **Then** todos os membros do grupo recebem uma notificação com os detalhes essenciais da movimentação.

---

### User Story 3 - Visualizar saldo e histórico vivo (Priority: P2)

Como membro do grupo, quero visualizar a qualquer momento meu saldo líquido, quem me deve, para quem eu devo e o histórico das movimentações para decidir quando e como quitar valores pendentes.

**Why this priority**: O livro-razão vivo só gera confiança se o estado atual for claro, auditável e fácil de entender sem cálculo manual.

**Independent Test**: Após registrar várias despesas e pelo menos uma quitação, a pessoa abre a visão do grupo e consegue identificar saldo líquido, dívidas em aberto por par de membros e a sequência cronológica das movimentações.

**Acceptance Scenarios**:

1. **Given** que existem despesas e quitações registradas em um grupo, **When** um membro acessa a visão de balanço, **Then** o sistema mostra o saldo líquido individual e a lista de quem deve para quem com os valores em aberto.
2. **Given** que o grupo possui histórico de movimentações, **When** um membro consulta o histórico, **Then** o sistema apresenta despesas e quitações em ordem compreensível com identificação de autor, descrição e valor.
3. **Given** que não há pendências para um membro, **When** ele acessa o balanço, **Then** o sistema informa claramente que não existem valores em aberto.

---

### User Story 4 - Quitar dívida entre membros (Priority: P3)

Como membro que fez um reembolso parcial ou total, quero registrar a quitação para reduzir imediatamente os valores em aberto e manter o livro-razão fiel à situação real do grupo.

**Why this priority**: O produto precisa fechar o ciclo entre gasto e reembolso para preservar a utilidade do saldo vivo ao longo do tempo.

**Independent Test**: Um membro com dívida em aberto registra uma quitação parcial para outro membro e o sistema reduz o valor pendente, recalcula os saldos e adiciona a movimentação ao histórico do grupo.

**Acceptance Scenarios**:

1. **Given** que existe uma dívida em aberto entre dois membros, **When** o devedor registra uma quitação parcial, **Then** o sistema reduz apenas o valor correspondente e mantém o restante como pendência.
2. **Given** que existe uma dívida em aberto entre dois membros, **When** o devedor registra uma quitação total, **Then** o sistema zera a pendência correspondente e atualiza os saldos líquidos dos dois membros.
3. **Given** que uma quitação foi registrada, **When** a movimentação é confirmada, **Then** o sistema adiciona o evento ao histórico do grupo e comunica os membros relevantes.

---

### Edge Cases

- O sistema deve rejeitar despesas ou quitações com valor zero, negativo ou formato inválido sem alterar saldos.
- O sistema deve preservar o divisor usado em uma despesa já registrada, mesmo que a composição do grupo mude depois.
- Se um membro tentar quitar mais do que o valor pendente para outra pessoa, o sistema deve impedir o registro e informar o limite disponível.
- Se uma notificação do grupo não puder ser entregue no momento do registro, a movimentação financeira continua válida e permanece visível no histórico para auditoria.
- Se um grupo ficar temporariamente com apenas um membro ativo, o sistema deve impedir novos rateios compartilhados até que haja participantes suficientes.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: O sistema MUST permitir que uma pessoa autenticada crie um grupo fechado de despesas compartilhadas com nome identificável.
- **FR-002**: O sistema MUST permitir convidar novos membros para o grupo por link ou e-mail e registrar quais participantes estão ativos em cada momento.
- **FR-003**: O sistema MUST considerar apenas os membros ativos do grupo no instante do lançamento para calcular o rateio de uma nova despesa.
- **FR-004**: O sistema MUST permitir que um membro ativo registre uma despesa informando, no mínimo, valor e descrição.
- **FR-005**: O sistema MUST dividir cada despesa igualmente entre todos os membros ativos do grupo no momento do registro.
- **FR-006**: O sistema MUST criar obrigações financeiras individuais para cada participante que não foi o pagador da despesa.
- **FR-007**: O sistema MUST atualizar imediatamente o saldo líquido de todos os membros impactados sempre que uma despesa ou quitação for registrada.
- **FR-008**: O sistema MUST mostrar, para cada membro, o saldo líquido atual e a relação explícita de quem deve para quem dentro do grupo.
- **FR-009**: O sistema MUST manter um histórico cronológico de despesas e quitações acessível aos membros do grupo.
- **FR-010**: O sistema MUST permitir registrar quitações parciais e totais entre membros para reduzir saldos pendentes existentes.
- **FR-011**: O sistema MUST impedir o registro de quitações acima do valor pendente entre as partes envolvidas.
- **FR-012**: O sistema MUST gerar uma notificação para o grupo sempre que uma nova despesa for registrada.
- **FR-013**: O sistema MUST gerar uma notificação para os membros relevantes sempre que uma quitação for registrada.
- **FR-014**: O sistema MUST oferecer um canal de entrada rápida para registrar valor e descrição com o menor número possível de passos.
- **FR-015**: O sistema MUST oferecer uma visão focada em saldos individuais, pendências entre membros e histórico de movimentações.
- **FR-016**: O sistema MUST preservar a rastreabilidade de cada movimentação, incluindo grupo, autor da ação, valor, descrição e momento do registro.

### Key Entities _(include if feature involves data)_

- **Grupo**: comunidade fechada de pessoas que compartilham despesas recorrentes; contém nome, responsável, membros, convites e estado de atividade.
- **Membro**: participante de um grupo com status de atividade, relação com convites e responsabilidade sobre despesas ou quitações que registrou.
- **Despesa**: lançamento financeiro realizado por um membro pagador com valor total, descrição, data de registro e conjunto de parcelas geradas para rateio.
- **Obrigação Financeira**: valor devido de um membro para outro como resultado de uma despesa compartilhada ainda não totalmente quitada.
- **Quitação**: registro de pagamento parcial ou total entre membros para reduzir uma obrigação financeira existente.
- **Movimentação**: item do livro-razão que representa uma despesa ou quitação e alimenta saldo, histórico e notificações.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Em testes com novos usuários, pelo menos 90% conseguem criar um grupo e adicionar ao menos dois membros em até 3 minutos.
- **SC-002**: Em grupos com até 20 membros ativos, pelo menos 95% das despesas registradas aparecem no saldo e no histórico em até 5 segundos após o envio.
- **SC-003**: Em cenários validados de rateio, 100% das despesas registradas produzem soma exata entre valor pago, parcelas devidas e saldo líquido resultante.
- **SC-004**: Pelo menos 90% dos participantes conseguem identificar corretamente quem deve para quem ao consultar a visão de balanço sem recorrer a planilhas externas.
- **SC-005**: Em cenários de quitação parcial e total, 100% dos pagamentos válidos reduzem o saldo pendente correto e ficam visíveis no histórico imediatamente após o registro.

## Assumptions

- Os grupos são compostos apenas por pessoas autenticadas e cada pessoa acessa somente grupos dos quais participa.
- A primeira versão desta funcionalidade utiliza rateio igualitário por padrão para todos os membros ativos; divisões personalizadas ficam fora do escopo atual.
- Cada grupo opera com uma única moeda por vez, apresentada de forma consistente para todos os membros.
- Convites aceitos tornam o membro imediatamente elegível para despesas futuras, sem alterar rateios já registrados antes da entrada.
- O produto oferece dois pontos de contato complementares: um canal conversacional para lançamento rápido e uma interface visual para consulta de saldos e histórico.
