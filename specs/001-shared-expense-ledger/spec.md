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
2. **Given** que um grupo já existe, **When** a pessoa responsável envia convites por link ou e-mail, **Then** o sistema gera convites rastreáveis, com validade definida, que só permitem a entrada de pessoas convidadas.
3. **Given** que existe um convite pendente, **When** o responsável revoga o convite ou a validade expira, **Then** o convite deixa de permitir entrada no grupo e permanece registrado para auditoria.
4. **Given** que a composição do grupo mudou, **When** um membro é ativado ou removido, **Then** o sistema usa a nova lista de membros ativos apenas para despesas registradas a partir dessa mudança.

---

### User Story 2 - Registrar despesa com rateio imediato (Priority: P1)

Como membro de um grupo, quero lançar rapidamente uma despesa com valor e descrição para que o sistema distribua o gasto entre os participantes ativos e atualize quem deve para quem no mesmo momento.

**Why this priority**: Este é o fluxo central do produto e entrega o principal valor de negócio: eliminar fechamento manual e dívida esquecida.

**Independent Test**: Em um grupo com quatro membros ativos, um deles registra uma despesa de R$ 22,00 e o sistema gera três parcelas de R$ 5,50 para os demais membros, atualizando os saldos imediatamente.

**Acceptance Scenarios**:

1. **Given** um grupo com membros ativos, **When** um membro registra uma despesa informando valor e descrição, **Then** o sistema registra o gasto em nome do pagador e divide o valor igualmente entre todos os membros ativos do grupo naquele momento.
2. **Given** uma despesa registrada com sucesso, **When** o rateio é concluído, **Then** o sistema cria as obrigações financeiras dos demais membros para com o pagador e atualiza o saldo líquido de cada participante.
3. **Given** que o pagador decide excluir membros específicos do rateio daquela despesa, **When** o lançamento é confirmado, **Then** o sistema aplica o rateio apenas aos participantes selecionados e registra quem ficou fora da divisão.
4. **Given** que uma nova despesa foi lançada, **When** o processamento termina, **Then** todos os membros do grupo recebem uma notificação com os detalhes essenciais da movimentação pelo canal configurado para cada pessoa.

---

### User Story 3 - Visualizar saldo e histórico vivo (Priority: P2)

Como membro do grupo, quero visualizar a qualquer momento meu saldo líquido, quem me deve, para quem eu devo e o histórico das movimentações para decidir quando e como quitar valores pendentes.

**Why this priority**: O livro-razão vivo só gera confiança se o estado atual for claro, auditável e fácil de entender sem cálculo manual.

**Independent Test**: Após registrar várias despesas e pelo menos uma quitação, a pessoa abre a visão do grupo e consegue identificar saldo líquido, dívidas em aberto por par de membros e a sequência cronológica das movimentações.

**Acceptance Scenarios**:

1. **Given** que existem despesas e quitações registradas em um grupo, **When** um membro acessa a visão de balanço, **Then** o sistema mostra o saldo líquido individual e a lista de quem deve para quem com os valores em aberto.
2. **Given** que o grupo possui histórico de movimentações, **When** um membro consulta o histórico, **Then** o sistema apresenta despesas e quitações em ordem cronológica inversa com identificação de autor, descrição, valor e tipo da movimentação.
3. **Given** que não há pendências para um membro, **When** ele acessa o balanço, **Then** o sistema informa claramente que não existem valores em aberto.

---

### User Story 4 - Quitar dívida entre membros (Priority: P3)

Como membro que fez um reembolso parcial ou total, quero registrar a quitação para reduzir imediatamente os valores em aberto e manter o livro-razão fiel à situação real do grupo.

**Why this priority**: O produto precisa fechar o ciclo entre gasto e reembolso para preservar a utilidade do saldo vivo ao longo do tempo.

**Independent Test**: Um membro com dívida em aberto registra uma quitação parcial para outro membro e o sistema reduz o valor pendente, recalcula os saldos e adiciona a movimentação ao histórico do grupo.

**Acceptance Scenarios**:

1. **Given** que existe uma dívida em aberto entre dois membros, **When** o devedor registra uma quitação parcial, **Then** o sistema reduz apenas o valor correspondente e mantém o restante como pendência.
2. **Given** que existe uma dívida em aberto entre dois membros, **When** o devedor registra uma quitação total, **Then** o sistema zera a pendência correspondente e atualiza os saldos líquidos dos dois membros.
3. **Given** que uma quitação foi registrada, **When** a movimentação é confirmada, **Then** o sistema adiciona o evento ao histórico do grupo e comunica ao menos o pagador, o recebedor e qualquer pessoa configurada para acompanhar o grupo.
4. **Given** que ainda não houve quitação vinculada a uma despesa registrada incorretamente, **When** o autor corrige ou exclui essa despesa, **Then** o sistema recalcula os saldos impactados e preserva o histórico da alteração.

---

### Edge Cases

- O sistema deve rejeitar despesas ou quitações com valor zero, negativo ou formato inválido sem alterar saldos.
- O sistema deve preservar o divisor usado em uma despesa já registrada, mesmo que a composição do grupo mude depois.
- Se um membro tentar quitar mais do que o valor pendente para outra pessoa, o sistema deve impedir o registro e informar o limite disponível.
- Se uma notificação do grupo não puder ser entregue no momento do registro, a movimentação financeira continua válida e permanece visível no histórico para auditoria.
- Se um grupo ficar temporariamente com apenas um membro ativo, o sistema deve impedir novos rateios compartilhados até que haja participantes suficientes.
- Se o responsável atual de um grupo sair dele, o sistema deve exigir a transferência da responsabilidade para outro membro ativo antes de concluir a saída.
- Se um convite for enviado para alguém que já faz parte do grupo, o sistema deve impedir duplicidade e informar que a pessoa já participa daquele grupo.
- Se ocorrer falha durante o registro de uma despesa, quitação, edição ou exclusão, o sistema deve evitar atualização parcial de saldos e permitir nova tentativa segura.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: O sistema MUST permitir que uma pessoa autenticada crie um grupo fechado de despesas compartilhadas com nome identificável.
- **FR-002**: O sistema MUST permitir convidar novos membros para o grupo por link ou e-mail e registrar quais participantes estão ativos em cada momento.
- **FR-003**: O sistema MUST gerar convites com validade definida e permitir a revogação de convites pendentes antes da aceitação.
- **FR-004**: O sistema MUST impedir o ingresso no grupo por meio de convites revogados, expirados ou já consumidos.
- **FR-005**: O sistema MUST definir papéis no grupo, incluindo ao menos responsável e membro, com permissões explícitas para convidar, remover participantes e administrar configurações do grupo.
- **FR-006**: O sistema MUST exigir autenticação para acesso aos dados financeiros de um grupo e restringir a visualização e as ações aos participantes autorizados.
- **FR-007**: O sistema MUST permitir que o responsável do grupo defina a moeda padrão usada nas despesas daquele grupo.
- **FR-008**: O sistema MUST considerar apenas os membros ativos do grupo no instante do lançamento para calcular o rateio de uma nova despesa.
- **FR-009**: O sistema MUST permitir que um membro ativo registre uma despesa informando, no mínimo, valor e descrição.
- **FR-010**: O sistema MUST dividir cada despesa igualmente entre todos os membros ativos do grupo no momento do registro, salvo quando o pagador excluir participantes específicos daquele lançamento.
- **FR-011**: O sistema MUST permitir que o pagador exclua membros específicos do rateio de uma despesa antes da confirmação do lançamento.
- **FR-012**: O sistema MUST criar obrigações financeiras individuais para cada participante incluído na divisão e que não foi o pagador da despesa.
- **FR-013**: O sistema MUST atualizar imediatamente o saldo líquido de todos os membros impactados sempre que uma despesa, quitação, edição ou exclusão válida for registrada.
- **FR-014**: O sistema MUST mostrar, para cada membro, o saldo líquido atual e a relação explícita de quem deve para quem dentro do grupo.
- **FR-015**: O sistema MUST manter um histórico cronológico inverso de despesas, quitações, edições e exclusões acessível aos membros do grupo.
- **FR-016**: O sistema MUST permitir registrar quitações parciais e totais entre membros para reduzir saldos pendentes existentes.
- **FR-017**: O sistema MUST impedir o registro de quitações acima do valor pendente entre as partes envolvidas.
- **FR-018**: O sistema MUST permitir que o autor de uma despesa edite valor e descrição antes que exista qualquer quitação vinculada a ela, recalculando os saldos impactados.
- **FR-019**: O sistema MUST permitir que o autor de uma despesa exclua o lançamento antes que exista qualquer quitação vinculada a ela, revertendo os saldos impactados e preservando a rastreabilidade da ação.
- **FR-020**: O sistema MUST gerar uma notificação para o grupo sempre que uma nova despesa for registrada.
- **FR-021**: O sistema MUST gerar uma notificação para os membros diretamente afetados sempre que uma quitação, edição ou exclusão alterar valores pendentes.
- **FR-022**: O sistema MUST permitir que cada usuário defina seus canais preferenciais de notificação dentre as opções oferecidas pelo produto.
- **FR-023**: O sistema MUST oferecer um canal de entrada rápida para registrar valor e descrição com o menor número possível de passos.
- **FR-024**: O sistema MUST oferecer uma visão focada em saldos individuais, pendências entre membros e histórico de movimentações.
- **FR-025**: O sistema MUST validar entradas obrigatórias e rejeitar valores inválidos sem alterar saldos ou criar registros incompletos.
- **FR-026**: O sistema MUST preservar o divisor e os participantes considerados em cada despesa mesmo que a composição do grupo mude depois.
- **FR-027**: O sistema MUST manter um log de auditoria das movimentações financeiras e das alterações críticas, incluindo grupo, autor da ação, valor, descrição, participantes afetados, data e hora.
- **FR-028**: O sistema MUST impedir novos rateios compartilhados enquanto o grupo tiver menos de dois membros ativos elegíveis.
- **FR-029**: O sistema MUST exigir a transferência de responsabilidade do grupo antes que o responsável atual possa sair do grupo.

### Non-Functional Requirements

- **NFR-001**: O sistema MUST refletir no saldo e no histórico as despesas e quitações válidas em até 5 segundos para grupos com até 20 membros ativos em condições normais de uso.
- **NFR-002**: O sistema MUST manter consistência financeira, impedindo atualizações parciais que deixem saldos e histórico em desacordo após falhas ou interrupções.
- **NFR-003**: O sistema MUST proteger os dados financeiros do grupo contra acesso não autorizado, permitindo acesso apenas às pessoas com vínculo válido ao grupo.
- **NFR-004**: O sistema MUST manter disponibilidade mensal mínima de 99,9% para consulta de saldos e registro de movimentações, exceto em janelas programadas comunicadas aos usuários.
- **NFR-005**: O sistema MUST permitir que novos usuários completem as tarefas principais de criar grupo e registrar primeira despesa em até 5 minutos sem treinamento prévio.
- **NFR-006**: O sistema MUST suportar crescimento para pelo menos 10.000 usuários ativos simultâneos sem comprometer os critérios de sucesso definidos para registro e consulta.

### Key Entities _(include if feature involves data)_

- **Grupo**: comunidade fechada de pessoas que compartilham despesas recorrentes; contém identificador, nome, moeda padrão, responsável atual, lista de membros, convites emitidos e estado operacional do grupo.
- **Membro**: participante de um grupo com papel, status de atividade, estado do convite associado e permissões para registrar ou administrar movimentações daquele grupo.
- **Convite**: autorização rastreável para ingresso no grupo, com destinatário, canal de envio, validade, estado atual e vínculo com quem o emitiu.
- **Despesa**: lançamento financeiro realizado por um membro pagador com valor total, descrição, data de registro, participantes incluídos no rateio e eventuais alterações posteriores.
- **Obrigação Financeira**: valor devido de um membro para outro como resultado de uma despesa compartilhada ainda não totalmente quitada, com saldo remanescente e histórico de liquidação.
- **Quitação**: registro de pagamento parcial ou total entre membros para reduzir uma obrigação financeira existente, com remetente, destinatário, valor e momento do registro.
- **Movimentação**: item do livro-razão que representa despesa, quitação, edição ou exclusão e alimenta saldo, histórico, notificações e auditoria.
- **Preferência de Notificação**: configuração individual que determina por quais canais a pessoa deseja receber avisos de despesas, quitações e alterações relevantes.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Em testes com novos usuários, pelo menos 90% conseguem criar um grupo e adicionar ao menos dois membros em até 3 minutos.
- **SC-002**: Em grupos com até 20 membros ativos, pelo menos 95% das despesas registradas aparecem no saldo e no histórico em até 5 segundos após o envio.
- **SC-003**: Em cenários validados de rateio, 100% das despesas registradas produzem soma exata entre valor pago, parcelas devidas e saldo líquido resultante.
- **SC-004**: Pelo menos 90% dos participantes conseguem identificar corretamente quem deve para quem ao consultar a visão de balanço sem recorrer a planilhas externas.
- **SC-005**: Em cenários de quitação parcial e total, 100% dos pagamentos válidos reduzem o saldo pendente correto e ficam visíveis no histórico imediatamente após o registro.
- **SC-006**: Pelo menos 95% dos convites emitidos com dados válidos são aceitos com sucesso ou revogados sem gerar acessos indevidos ao grupo.
- **SC-007**: Em testes de autorização, 100% das tentativas de acesso a dados financeiros por pessoas sem vínculo válido ao grupo são bloqueadas.
- **SC-008**: Pelo menos 95% das correções de despesa feitas antes de qualquer quitação recalculam os saldos corretos sem exigir intervenção manual.

## Assumptions

- Os grupos são compostos apenas por pessoas autenticadas e cada pessoa acessa somente grupos dos quais participa.
- A primeira versão desta funcionalidade utiliza rateio igualitário por padrão, mas permite excluir participantes específicos de uma despesa; divisões com percentuais ou cotas diferentes ficam fora do escopo atual.
- Cada grupo opera com uma única moeda por vez, definida pelo responsável e apresentada de forma consistente para todos os membros.
- Convites aceitos tornam o membro imediatamente elegível para despesas futuras, sem alterar rateios já registrados antes da entrada.
- O produto oferece dois pontos de contato complementares: um canal conversacional para lançamento rápido e uma interface visual para consulta de saldos e histórico.
- O ciclo completo de cadastro, login e recuperação de conta é uma capacidade da plataforma e não precisa ser detalhado além das exigências de autenticação e autorização deste recurso.
- A primeira entrega cobre notificações nos canais suportados pelo produto, sem exigir preferências avançadas por evento além da seleção de canais disponíveis.
