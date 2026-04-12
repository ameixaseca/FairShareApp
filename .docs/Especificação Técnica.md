# 📄 FairShareApp — Especificação Técnica Consolidada (v4)

---

# 1. Visão Arquitetural

## 1.1 Estilo

- **Modular Monolith (inicial)**
- Evolução planejada para **Microservices por domínio**

## 1.2 Princípios

- **Ledger como fonte de verdade**
- **Consistência forte em escrita**
- **Consistência eventual em leitura**
- **CQRS leve**
- **Event-driven interno**
- **Multi-tenancy nativo**

---

# 2. Domínios (Bounded Contexts)

| Domínio             | Responsabilidade           |
| ------------------- | -------------------------- |
| Identity & Access   | Autenticação e autorização |
| Group Management    | Grupos, membros e convites |
| Expense Management  | Registro de despesas       |
| Ledger & Settlement | Obrigações e quitações     |
| Notification        | Telegram e eventos         |
| Billing             | Planos e limites           |

---

# 3. Modelo de Dados (Domínio)

## 3.1 Entidades principais

```csharp
class Group {
    Guid Id;
    string Name;
    string Currency;
    Guid OwnerId;
    DateTime CreatedAt;
}

class Member {
    Guid Id;
    Guid GroupId;
    Guid UserId;
    string Role; // Admin | Member
    bool IsActive;
}

class Expense {
    Guid Id;
    Guid GroupId;
    Guid PaidBy;
    decimal Amount;
    string Description;
    DateTime CreatedAt;
}

class ExpenseSplit {
    Guid Id;
    Guid ExpenseId;
    Guid UserId;
    decimal Amount;
}
```

---

# 4. Ledger Financeiro (Fonte de Verdade)

## 4.1 Estrutura

```csharp
class LedgerEntry {
    Guid Id;
    Guid GroupId;
    Guid FromUserId;
    Guid ToUserId;
    decimal Amount;
    string Type; // Expense | Settlement
    Guid ReferenceId;
    DateTime CreatedAt;
}
```

## 4.2 Regras obrigatórias

- Não existe atualização de saldo
- Não existe deleção física
- Toda alteração gera novo evento
- Saldo é sempre derivado

## 4.3 Cálculo de saldo

```sql
SELECT
  user_id,
  SUM(credits - debits) AS balance
FROM ledger
```

---

# 5. Fluxos Transacionais

## 5.1 Registro de despesa

### Entrada

- Valor
- Descrição
- Participantes

### Processamento (transação única)

1. Criar `Expense`
2. Criar `ExpenseSplits`
3. Gerar `LedgerEntries`

### Exemplo

Grupo com 4 membros, despesa de 100:

```
B → A (25)
C → A (25)
D → A (25)
```

---

## 5.2 Registro de quitação

### Entrada

- Devedor
- Credor
- Valor

### Processamento

```
B → A (valor pago)
```

---

## 5.3 Regras de consistência

- Transação ACID obrigatória
- Idempotência por `RequestId`
- Retry automático em conflito

---

# 6. Read Model (Projeções)

## 6.1 Estrutura

```csharp
class BalanceProjection {
    Guid GroupId;
    Guid UserId;
    decimal Balance;
}
```

## 6.2 Atualização

- Via eventos (ideal)
- Ou síncrona (MVP)

## 6.3 SLA

- Atualização em até **5 segundos**

---

# 7. Multi-Tenancy

## 7.1 Estratégia

| Nível      | Modelo              |
| ---------- | ------------------- |
| Default    | Shared DB + GroupId |
| Pro        | Schema por tenant   |
| Enterprise | Database isolado    |

---

## 7.2 Isolamento

### EF Core

```csharp
.HasQueryFilter(e => e.GroupId == tenantId)
```

### PostgreSQL RLS

```sql
USING (group_id = current_setting('app.current_group')::uuid)
```

---

# 8. Concorrência

## 8.1 Estratégias

- Optimistic Concurrency (RowVersion)
- Retry automático
- Idempotência

## 8.2 Garantias

- Sem duplicidade de lançamentos
- Sem inconsistência de saldo

---

# 9. API Design

## 9.1 Endpoints

```http
POST   /groups
POST   /groups/{id}/invites
POST   /expenses
POST   /settlements
GET    /groups/{id}/balance
GET    /groups/{id}/ledger
GET    /groups/{id}/history
```

## 9.2 Padrão de resposta

```json
{
  "data": {},
  "errors": [],
  "traceId": ""
}
```

---

# 10. Integração com Telegram

## 10.1 Arquitetura

```
Webhook → Queue → Processor → Domain
```

## 10.2 Garantias

- Idempotência por `TelegramMessageId`
- Retry com backoff
- Processamento assíncrono

---

# 11. Observabilidade

## 11.1 Logs

- Todas operações financeiras

```json
{
  "event": "ExpenseCreated",
  "groupId": "...",
  "amount": 100
}
```

## 11.2 Métricas

- `ledger_write_latency`
- `balance_projection_delay`
- `error_rate`
- `idempotency_hits`

## 11.3 Tracing

- OpenTelemetry
- CorrelationId obrigatório

---

# 12. Cache

## 12.1 Estratégia

- Cache Aside

## 12.2 O que cachear

- Saldo
- Membros

## 12.3 Invalidação

- Evento de:
  - ExpenseCreated
  - SettlementCreated

---

# 13. Segurança

## 13.1 Autenticação

- JWT + Refresh Token
- Login via Telegram

## 13.2 Autorização

- RBAC:
  - Admin
  - Member

## 13.3 Proteções

- Rate limiting por tenant
- Validação de entrada
- Proteção contra replay

---

# 14. Billing (SaaS)

## 14.1 Planos

| Plano      | Limite              |
| ---------- | ------------------- |
| Free       | 1 grupo / 5 membros |
| Pro        | ilimitado           |
| Enterprise | isolamento dedicado |

## 14.2 Controle

- Middleware de validação de plano
- Enforcement em tempo de execução

---

# 15. Consistência e Garantias

| Requisito               | Implementação |
| ----------------------- | ------------- |
| Consistência financeira | Ledger        |
| Auditoria               | Imutabilidade |
| Sem atualização parcial | Transações    |
| Performance             | Projeções     |
| Escalabilidade          | CQRS + cache  |

---

# 16. Infraestrutura

## 16.1 Stack

- .NET (API)
- PostgreSQL
- Redis
- Azure (App Service + Monitor)

## 16.2 CI/CD

- GitHub Actions:
  - Build
  - Test
  - Migration
  - Deploy

---

# 17. Testes

## 17.1 Tipos

- Unitários (domínio)
- Integração (API + DB)
- Contract tests
- Load tests

## 17.2 Testes críticos

- Consistência financeira
- Concorrência
- Idempotência

---

# 18. Roadmap Técnico

## Fase 1 (MVP)

- Ledger
- API
- Telegram
- Saldo básico

## Fase 2

- Cache
- Observabilidade

## Fase 3

- Billing
- Multi-tenancy avançado

## Fase 4

- Microservices

---

# 19. Decisões Arquiteturais Finais

| Área             | Decisão                         |
| ---------------- | ------------------------------- |
| Fonte de verdade | Ledger                          |
| Consistência     | Forte (write) + eventual (read) |
| Escala           | Modular → Microservices         |
| Multi-tenancy    | Filter + RLS                    |
| Integração       | Webhook + Queue                 |

---

# 20. Resultado Final

Esta versão resolve:

- Ambiguidade de saldo → substituído por ledger
- Risco de inconsistência → eliminado via transação
- Falta de auditabilidade → resolvido com imutabilidade
- Escalabilidade SaaS → suportada desde o início
