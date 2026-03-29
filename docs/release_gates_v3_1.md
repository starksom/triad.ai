# Gates de Release v3.1.0

> Status atual: **bloqueado para release** até todos os gates abaixo serem aprovados.

Este documento formaliza os critérios de aceite para `v3.1.0` e define quando a versão pode ser publicada.

## Gate 1 — Definition of Done (DoD) por módulo

Cada módulo só é elegível para GA quando **todos** os critérios do DoD estiverem completos.

### 1) `providers` (Multi-Backend Adapter Layer)
- [ ] Interface unificada (`LLMProvider`, `ProviderResponse`, `ProviderConfig`) implementada e documentada.
- [ ] Adapters suportados: Anthropic, OpenAI, Gemini, Ollama, OpenRouter, Mistral.
- [ ] `ProviderRegistry` com `register/detect/get/listAvailable` validado.
- [ ] Fallback gracioso quando provider está indisponível.
- [ ] Custos por provider/modelo disponíveis para telemetria.

### 2) `multi-model`
- [ ] Estratégias `parallel`, `sequential`, `adversarial` implementadas.
- [ ] `CostTracker` com relatório por provider/tier.
- [ ] Timeout/cancelamento por execução definidos.
- [ ] Resultados normalizados para consumo por consenso/router.

### 3) `consensus`
- [ ] Estratégias `majority_vote`, `weighted_score`, `confidence_ranking`, `adversarial_debate` implementadas.
- [ ] Threshold default de consenso definido em 0.75 e configurável.
- [ ] Registro explícito de respostas dissidentes.
- [ ] Falha segura quando quorum não é atingido.

### 4) `router`
- [ ] Classificação de tarefa (`research/design/implementation/review`) implementada.
- [ ] Regras de roteamento com prioridade por SLA/custo/qualidade.
- [ ] Fallback para roteamento estático `v3.0` quando classificador for inconclusivo.
- [ ] Métricas de acerto de roteamento disponíveis na telemetria.

### 5) `personas`
- [ ] Catálogo mínimo de personas por agente (Claude Code, Codex, Antigravity) definido.
- [ ] Prompt templates versionados e testados.
- [ ] Mapeamento fase -> persona ativo e auditável.
- [ ] Guardrails para evitar instruções conflitantes entre personas.

### 6) `dark-factory`
- [ ] Níveis `supervised`, `semi_autonomous`, `autonomous` implementados.
- [ ] Human-in-the-loop preservado para ações irreversíveis (commit/release).
- [ ] Trilha de auditoria completa por ciclo autônomo.
- [ ] Critérios de rollback automático documentados e testados.

## Gate 2 — Testes obrigatórios

### Cobertura para módulos novos
- [ ] Cobertura de testes automatizados para cada módulo novo **>= 85%** (linhas e branches).
- [ ] Casos felizes + falhas + fallback + timeout por módulo.
- [ ] Testes de integração para fluxos entre `providers` + `multi-model` + `consensus` + `router`.

### Regressão do fluxo v3.0
- [ ] Suite dedicada validando fallback explícito para comportamento `v3.0` quando flags estiverem OFF.
- [ ] Garantia de compatibilidade retroativa para comando/estado principal do pipeline.
- [ ] Nenhuma regressão em testes existentes do state graph e checkpoint/tracing.

## Gate 3 — Telemetria mínima obrigatória

As seguintes métricas devem existir antes do release:

- [ ] **Latência**: p50/p95/p99 por módulo e por provider.
- [ ] **Custo**: custo por execução, por provider, por estratégia e custo acumulado diário.
- [ ] **Taxa de fallback**: percentual de requests que voltam para comportamento `v3.0`.
- [ ] **Taxa de consenso**: percentual de requests com consenso atingido dentro do threshold.

### SLO mínimo para aprovação
- [ ] p95 de latência sem degradação > 20% versus baseline `v3.0`.
- [ ] custo médio sem degradação > 20% sem ganho comprovado de qualidade.
- [ ] taxa de fallback dentro da janela de canário acordada.
- [ ] consenso >= threshold configurado para cenários críticos.

## Gate 4 — Segurança e governança

Checklist mandatório pré-release:

- [ ] Threat model atualizado (novos vetores: prompt injection cross-provider, data exfiltration, privilege misuse).
- [ ] Revisão de segredo/credenciais (sem chaves em código, logs ou fixtures).
- [ ] Verificação de permissões de ferramentas por modo de autonomia.
- [ ] Registro de auditoria habilitado para decisões automáticas e rollbacks.
- [ ] Aprovação formal de segurança + governança com evidências anexadas.

## Gate 5 — Política de versionamento e publicação

A versão **só pode** ser alterada para `3.1.0` quando:

1. Todos os gates (1 a 4) estiverem em estado **APROVADO**.
2. Documentação sincronizada: `docs/roadmap.md`, `docs/architecture.md`, `docs/v3_1_migration_plan.md`, `CHANGELOG.md`.
3. Checklist de release assinado pelos responsáveis técnicos.

### Regra operacional
- Enquanto houver gate pendente, a versão permanece em `3.0.0`.
- O bump para `3.1.0` deve ocorrer no mesmo PR que fecha os gates e sincroniza a documentação.
