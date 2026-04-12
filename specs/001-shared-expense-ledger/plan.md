# Implementation Plan: FairShareApp Shared Expense Ledger

**Branch**: `master` | **Date**: 2026-04-12 | **Spec**: `specs/001-shared-expense-ledger/spec.md`
**Input**: Feature specification from `specs/001-shared-expense-ledger/spec.md`

## Summary

Analisar o que falta implementar para que o backend entregue os requisitos da feature de despesas compartilhadas descritos na documentação.

Resultado da analise atual: a base de codigo possui estrutura e contratos de nomes, mas ainda esta em estagio de esqueleto para grande parte das regras de negocio, persistencia, seguranca aplicada e testes de comportamento real.

## Technical Context

**Language/Version**: C# on .NET 9
**Primary Dependencies**: ASP.NET Core Web API, EF Core, xUnit
**Storage**: PostgreSQL planejado; no estado atual ha apenas mapeamento de `LedgerEntry`
**Testing**: xUnit (unit/contract/integration/load), majoritariamente placeholders
**Target Platform**: Servico backend HTTP (ASP.NET Core)
**Project Type**: Backend web-service
**Performance Goals**: refletir saldos/historico em ate 5s para grupos de ate 20 membros
**Constraints**: consistencia financeira, trilha imutavel de ledger, idempotencia, isolamento por `GroupId`
**Scale/Scope**: suporte alvo de 10.000 usuarios ativos simultaneos (documentado)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

**Code Clarity Validation**:

- [x] All names (classes, methods, variables) reveal intent and follow domain vocabulary
- [x] No clever/obscure solutions without explicit justification in Complexity Tracking
- [ ] Public interfaces are explicit about behavior and side effects

**SOLID Compliance Validation**:

- [x] Each class/module has single responsibility (one reason to change)
- [ ] Extensions planned without modifying existing tested code
- [x] Dependencies are on abstractions (interfaces), not concrete implementations
- [x] No forced dependencies on unused interface methods

**Test-First Validation**:

- [x] Test plan included in specification before any implementation
- [ ] Tests are written for acceptance criteria before implementation begins
- [ ] Test structure follows AAA (Arrange, Act, Assert) pattern
- [ ] Integration tests planned for external boundaries (API, database, file system)

**Security Validation**:

- [x] No secrets, tokens, or credentials in any committed files
- [ ] All external input validation planned (API requests, file uploads, user input)
- [ ] Infrastructure dependencies (database, external APIs) have security review

**Architecture Validation**:

- [x] Clear separation: Domain -> Application -> Infrastructure -> Interface layers
- [x] Domain/business logic has no infrastructure dependencies
- [x] Shared types defined in `packages/shared/types` to prevent duplication

### Post-Design Constitution Re-Check: FAIL

- Testes automatizados atuais validam apenas placeholders (`Assert.True(true)`), sem garantir comportamento dos cenarios da spec.
- Servicos de leitura/projecao retornam listas vazias e nao exercem regras financeiras reais.
- Endpoints aceitam payloads, mas varias operacoes nao persistem/nao recalculam estado de negocio completo.

## Project Structure

### Documentation (this feature)

```text
specs/001-shared-expense-ledger/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   `-- openapi.yaml
`-- tasks.md
```

### Source Code (repository root)

```text
backend/
|-- src/
|   |-- Domain/
|   |-- Application/
|   |-- Infrastructure/
|   `-- Interface/Api/
`-- tests/
    |-- unit/
    |-- integration/
    |-- contract/
    `-- load/

packages/
`-- shared/
    |-- api-client/
    `-- types/
```

**Structure Decision**: Manter modular monolith backend com separacao de camadas. Consolidar regras de negocio e persistencia real antes de expandir para frontend/mobile.

## Gap Analysis (Documentacao vs Implementacao)

### Evidencias diretas no codigo

- `backend/tests/integration/**` e `backend/tests/contract/**` usam cenarios placeholder com `Assert.True(true)`.
- `backend/src/Application/Services/LedgerQueryService.cs` retorna colecoes vazias para saldo e historico.
- `backend/src/Application/Services/BalanceProjectionUpdater.cs` contem implementacao placeholder.
- `backend/src/Infrastructure/Persistence/FairShareDbContext.cs` mapeia apenas `LedgerEntry` (demais entidades da spec nao estao no modelo EF).

### Requisitos funcionais com maior lacuna

- **FR-002 a FR-005 (convites/papeis/permissoes)**: entidades existem, mas faltam fluxos completos de persistencia e autorizacao por papel aplicados ponta a ponta.
- **FR-006 (autorizacao por participante do grupo)**: middlewares/controle existem por estrutura, sem bateria real de testes de integracao exercitando bloqueios efetivos.
- **FR-013 a FR-015 (saldo e historico vivo)**: atualmente nao ha query real de saldo/historico; retorno vazio invalida criterio funcional.
- **FR-016 a FR-019 (quitacao/correcao/exclusao com recalculo)**: validacao pontual existe, mas sem recomputacao completa, persistencia transacional e verificacao de consistencia observavel.
- **FR-020 a FR-022 (notificacoes e preferencias)**: endpoints/servicos existem, mas sem pipeline de entrega confiavel e sem persistencia robusta de preferencias.
- **FR-027 (auditoria completa)**: servico de auditoria existe, mas cobertura de eventos criticos e rastreabilidade completa ainda nao esta demonstrada por testes reais.
- **FR-028 e FR-029 (guardrails de membros/owner transfer)**: regras nao aparecem fechadas no agregado e sem validacao de fluxo completo.

### Requisitos nao funcionais com maior risco

- **NFR-001 e NFR-006**: sem implementacao de projecao real e sem carga representativa, metas de latencia/escala nao foram provadas.
- **NFR-002**: sem teste transacional fim a fim para falhas intermediarias, consistencia apos erro permanece em risco.
- **NFR-003**: autorizacao formalmente definida, mas sem evidencia forte de enforcement em todos os endpoints.

## Fase 2: Plano de fechamento de lacunas

1. Implementar persistencia EF completa (Group, Member, Invite, Expense, ExpenseParticipant, Settlement, AuditLog, NotificationPreference) com migracoes.
2. Substituir testes placeholder por testes reais HTTP + banco de dados para todos os cenarios independentes da spec.
3. Implementar leitura real de saldos/historico em `LedgerQueryService` e repositorios de projecao.
4. Implementar fluxo transacional completo de despesa, quitacao, edicao e exclusao com recalculo e trilha de auditoria.
5. Consolidar RBAC por grupo e isolamento por `GroupId` com testes negativos/positivos.
6. Implementar preferencia e entrega de notificacao desacoplada de operacao financeira, com retentativa/erro nao bloqueante.
7. Validar SLO de 5s com teste de carga real baseado em ambiente com PostgreSQL.

## Complexity Tracking

| Violation                                             | Why Needed | Simpler Alternative Rejected Because |
| ----------------------------------------------------- | ---------- | ------------------------------------ |
| Nenhuma excecao de arquitetura proposta nesta analise | N/A        | N/A                                  |
