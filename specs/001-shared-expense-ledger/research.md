# Research: FairShareApp Shared Expense Ledger

## Context

This research consolidates decisions for the implementation plan using:

- Business specification in specs/001-shared-expense-ledger/spec.md
- Technical guidance in .docs/Especificação Técnica.md
- Constitutional constraints in .specify/memory/constitution.md

## Decision 1: Ledger imutável como fonte de verdade

- Decision: Modelar toda movimentação financeira como entradas imutáveis de ledger, sem atualização direta de saldo.
- Rationale: Maximiza auditabilidade, evita deriva de saldo e reduz risco de inconsistência em operações concorrentes.
- Alternatives considered:
  - Saldo materializado com updates diretos: mais simples no curto prazo, porém arriscado para reconciliação.
  - Híbrido com correções manuais: aumenta custo operacional e fragiliza rastreabilidade.

## Decision 2: Escritas ACID + idempotência por RequestId

- Decision: Operações de despesa, quitação, edição e exclusão lógica executam em transação única com chave de idempotência.
- Rationale: Garante consistência forte para invariantes financeiros e evita duplicidade em retries de cliente ou webhook.
- Alternatives considered:
  - Eventual consistency total também em escrita: reduz bloqueio, mas aumenta risco de estados intermediários incorretos.
  - Lock pessimista amplo: reduz conflitos, porém piora throughput e latência.

## Decision 3: CQRS leve com projeções de leitura

- Decision: Separar escrita de ledger da leitura de saldos/histórico via projeções atualizadas em até 5 segundos.
- Rationale: Equilibra consistência financeira e performance de consulta em grupos com múltiplos membros.
- Alternatives considered:
  - Cálculo de saldo em tempo real a cada leitura: simples, mas caro em escala.
  - Projeções síncronas estritas para tudo: mais previsível, porém maior latência de escrita.

## Decision 4: Convites com ciclo de vida explícito

- Decision: Convites têm estados (Pending, Accepted, Revoked, Expired), validade e rastreabilidade.
- Rationale: Fecha lacunas de segurança/controle de acesso identificadas na análise da spec.
- Alternatives considered:
  - Link permanente sem expiração: experiência simples, mas alto risco de abuso.
  - Convite apenas por admin manual: reduz risco, porém piora onboarding.

## Decision 5: Controle de acesso por papel no grupo

- Decision: Implementar RBAC por grupo (Owner/Admin/Member) para ações de convite, gestão e alterações críticas.
- Rationale: Permite governança clara sem acoplar regras de autorização à camada de interface.
- Alternatives considered:
  - Permissão binária (membro/não membro): insuficiente para operações administrativas.
  - ACL por ação sem papéis: flexível, mas complexo para MVP.

## Decision 6: Notificações desacopladas por eventos

- Decision: Emitir eventos de domínio e processar notificações por pipeline assíncrono (Webhook/Queue/Processor).
- Rationale: Evita que falha de canal bloqueie operações financeiras e mantém rastreabilidade.
- Alternatives considered:
  - Notificação síncrona no request: simples, mas aumenta latência e risco de timeout.
  - Polling no cliente para tudo: reduz acoplamento, mas piora experiência em tempo real.

## Decision 7: Modelo de tenancy inicial por GroupId

- Decision: Adotar shared database com isolamento lógico por GroupId e preparar evolução para schema/database dedicado.
- Rationale: Minimiza custo de entrada e mantém caminho de crescimento para planos Pro/Enterprise.
- Alternatives considered:
  - Banco por tenant no MVP: custo e complexidade iniciais altos.
  - Sem isolamento explícito por tenant: risco de vazamento de dados.

## Decision 8: Observabilidade orientada a operações financeiras

- Decision: Instrumentar logs estruturados, métricas de latência de escrita/projeção e tracing com correlation ID.
- Rationale: Facilita diagnóstico de inconsistência financeira, retries e atrasos de projeção.
- Alternatives considered:
  - Logs básicos sem métricas: insuficiente para SLO e troubleshooting.
  - Observabilidade total desde o início para todos os fluxos: alto esforço para MVP.
