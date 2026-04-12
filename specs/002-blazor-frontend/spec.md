# Feature Specification: Frontend de Gestão de Despesas Compartilhadas

**Feature Branch**: `master`  
**Created**: 2026-04-12  
**Status**: Draft  
**Input**: User description: "Implementar um frontend integrado ao produto atual e cobrir todas as funcionalidades requeridas na documentação"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Operar grupos e membros (Priority: P1)

Como pessoa responsável por um grupo de despesas, quero criar grupos, convidar membros e administrar quem participa para iniciar o controle financeiro colaborativo sem depender de processos externos.

**Why this priority**: Sem gestão de grupo e membros não existe base válida para rateio, saldo e quitação.

**Independent Test**: Uma pessoa autenticada cria um grupo, envia convites e confirma a entrada de membros; também revoga um convite pendente e remove um membro com permissão apropriada.

**Acceptance Scenarios**:

1. **Given** uma pessoa autenticada sem grupo ativo, **When** ela cria um novo grupo com nome e moeda, **Then** o grupo é exibido como ativo e ela aparece como responsável.
2. **Given** um grupo ativo, **When** o responsável envia convites por link ou e-mail, **Then** os convites aparecem com status rastreável e validade.
3. **Given** um convite pendente, **When** o responsável revoga o convite, **Then** o convite deixa de permitir entrada e continua visível no histórico de convites.
4. **Given** um membro sem permissão administrativa, **When** ele tenta remover outro membro, **Then** a ação é bloqueada e a interface informa falta de permissão.

---

### User Story 2 - Registrar despesas com entrada rápida (Priority: P1)

Como membro ativo de um grupo, quero registrar uma despesa em poucos passos para que a divisão entre participantes e os saldos do grupo sejam atualizados imediatamente.

**Why this priority**: Este é o fluxo principal de valor do produto; sem ele o frontend não entrega o propósito central de controle de gastos compartilhados.

**Independent Test**: Em grupo com quatro membros ativos, um membro registra despesa com valor e descrição; o sistema mostra os participantes incluídos/excluídos e atualiza saldos e obrigações sem recarregar manualmente a aplicação.

**Acceptance Scenarios**:

1. **Given** um grupo com ao menos dois membros ativos, **When** um membro registra nova despesa com valor e descrição válidos, **Then** a movimentação aparece na visão de histórico e impacta o balanço do grupo.
2. **Given** o formulário de despesa, **When** o pagador exclui participantes específicos antes de confirmar, **Then** a divisão considera apenas os participantes incluídos.
3. **Given** uma despesa sem quitações vinculadas, **When** o autor edita valor ou descrição, **Then** a movimentação é atualizada e os impactos financeiros são recalculados.
4. **Given** uma despesa sem quitações vinculadas, **When** o autor exclui a despesa, **Then** a movimentação é cancelada com rastreabilidade da alteração.

---

### User Story 3 - Acompanhar saldos e histórico vivo (Priority: P2)

Como participante do grupo, quero visualizar saldo líquido, pendências entre membros e histórico cronológico para decidir quando quitar valores em aberto.

**Why this priority**: Transparência contínua é essencial para confiança no produto e redução de conflitos entre participantes.

**Independent Test**: Após registrar despesas e quitações, qualquer membro autorizado acessa o painel do grupo e identifica corretamente saldo, dívidas e sequência cronológica de movimentações.

**Acceptance Scenarios**:

1. **Given** um grupo com movimentações registradas, **When** um membro abre o painel de balanço, **Then** ele visualiza saldo líquido individual e relação de quem deve para quem.
2. **Given** histórico de movimentações no grupo, **When** um membro acessa o histórico, **Then** despesas, quitações e alterações aparecem em ordem cronológica inversa.
3. **Given** um grupo sem pendências para o membro atual, **When** ele acessa o balanço, **Then** a interface mostra claramente ausência de valores em aberto.

---

### User Story 4 - Registrar quitações e preferências de notificação (Priority: P3)

Como membro com pendências financeiras, quero registrar quitações parciais ou totais e ajustar preferências de notificação para manter minha situação financeira atualizada e receber alertas relevantes.

**Why this priority**: Fecha o ciclo operacional do produto e melhora engajamento com avisos direcionados.

**Independent Test**: Um devedor registra quitação parcial e total em momentos diferentes e, em seguida, ajusta canais de notificação; o sistema confirma os dois tipos de quitação e mantém as preferências salvas.

**Acceptance Scenarios**:

1. **Given** uma dívida em aberto entre dois membros, **When** o devedor registra quitação parcial, **Then** o saldo pendente é reduzido sem zerar a obrigação total.
2. **Given** uma dívida em aberto, **When** o devedor registra quitação total válida, **Then** a obrigação correspondente é zerada.
3. **Given** preferências de notificação disponíveis, **When** o usuário altera seus canais ativos, **Then** as preferências ficam persistidas para próximas movimentações.

### Edge Cases

- Tentativa de registrar despesa ou quitação com valor zero, negativo ou formato inválido deve ser rejeitada sem alterar saldo exibido.
- Tentativa de quitar valor maior que o pendente deve ser bloqueada com mensagem clara do limite permitido.
- Falha de atualização de notificações não pode impedir registro de despesa ou quitação já confirmada.
- Convite expirado, revogado ou já utilizado não deve permitir ingresso no grupo.
- Grupo com menos de dois membros elegíveis deve impedir novo rateio compartilhado.
- Saída do responsável atual sem transferência prévia de responsabilidade deve ser bloqueada.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: O sistema MUST permitir autenticação e acesso de usuários às funcionalidades financeiras apenas quando houver vínculo válido com o grupo.
- **FR-002**: O sistema MUST permitir criação de grupo com nome identificável e moeda padrão.
- **FR-003**: O sistema MUST permitir listagem dos grupos do usuário autenticado e acesso ao detalhe de cada grupo autorizado.
- **FR-004**: O sistema MUST permitir emissão, listagem e revogação de convites de grupo com estado rastreável.
- **FR-005**: O sistema MUST permitir aceite de convite válido e rejeitar convites expirados, revogados ou já consumidos.
- **FR-006**: O sistema MUST exibir membros do grupo com papel e estado de participação.
- **FR-007**: O sistema MUST restringir ações administrativas (como remover membro) conforme permissões de papel.
- **FR-008**: O sistema MUST permitir registro de despesa com valor, descrição e participantes considerados no rateio.
- **FR-009**: O sistema MUST permitir excluir participantes específicos antes da confirmação da despesa.
- **FR-010**: O sistema MUST refletir imediatamente no frontend os impactos de despesa válida em saldos e pendências.
- **FR-011**: O sistema MUST permitir edição de despesa somente quando não houver quitação vinculada.
- **FR-012**: O sistema MUST permitir exclusão de despesa somente quando não houver quitação vinculada, mantendo rastreabilidade.
- **FR-013**: O sistema MUST permitir registro de quitação parcial ou total entre membros com validação de limite pendente.
- **FR-014**: O sistema MUST apresentar saldo líquido individual e relação explícita de obrigações entre membros do grupo.
- **FR-015**: O sistema MUST apresentar histórico cronológico inverso de despesas, quitações, edições e exclusões.
- **FR-016**: O sistema MUST permitir atualização das preferências de notificação por usuário.
- **FR-017**: O sistema MUST oferecer fluxo de entrada rápida para registro de nova despesa com o menor número possível de passos.
- **FR-018**: O sistema MUST impedir atualizações parciais na visualização de dados após falha, exibindo estado consistente ao usuário.
- **FR-019**: O sistema MUST manter trilha visível de ações críticas para auditoria funcional por membros autorizados.
- **FR-020**: O sistema MUST ser disponibilizado como interface web integrada ao mesmo produto operacional do backend existente, sem exigir experiência separada para o usuário final.

### Key Entities _(include if feature involves data)_

- **Grupo**: unidade colaborativa de despesas com nome, moeda, responsável, membros e convites associados.
- **Membro**: participante do grupo com papel, estado de atividade e permissões de ação.
- **Convite**: autorização de entrada no grupo com destinatário, canal, validade e status.
- **Despesa**: lançamento financeiro com pagador, valor, descrição, participantes e estado de alteração.
- **Quitação**: pagamento parcial ou total entre membros para reduzir pendência existente.
- **Saldo do Membro**: visão do valor líquido atual de cada participante dentro de um grupo.
- **Obrigação**: pendência entre pares de membros indicando valor ainda devido.
- **Movimentação**: registro cronológico de eventos financeiros e alterações críticas.
- **Preferência de Notificação**: configuração individual de canais de aviso para eventos relevantes.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Pelo menos 90% dos usuários de primeira viagem conseguem criar grupo e registrar a primeira despesa em até 5 minutos.
- **SC-002**: Em grupos com até 20 membros ativos, pelo menos 95% das movimentações confirmadas ficam visíveis no painel de saldo e histórico em até 5 segundos.
- **SC-003**: Em testes de aceite de negócio, 100% das quitações válidas reduzem corretamente o pendente exibido entre as partes.
- **SC-004**: Pelo menos 90% dos usuários conseguem identificar corretamente quem deve para quem ao consultar o painel do grupo.
- **SC-005**: Menos de 2% das tentativas de operação válida resultam em abandono do fluxo por mensagens de erro pouco claras.

## Assumptions

- O backend já disponibiliza contratos funcionais para autenticação, grupos, convites, despesas, quitações, histórico e preferências.
- Usuários acessarão a interface web com conectividade estável durante operações financeiras.
- A primeira entrega cobre os fluxos essenciais de operação diária de grupos e não inclui canais avançados de atendimento fora da própria interface.
- A gestão de permissões de papel é fornecida pelo domínio existente e consumida pela interface para controle de ações.
- O frontend será entregue como parte do mesmo produto operacional já utilizado pelos usuários do backend, preservando uma experiência unificada.
