# Plano de Migração v3.1

## Objetivo
Este documento define a migração controlada de `v0.1 -> v3.0 -> v3.1` com ativação gradual por `feature flags`, fallback explícito para comportamento `v3.0` e critérios de rollback por módulo.

## Matriz de migração (`v0.1 -> v3.0 -> v3.1`)

| Feature | v0.1 | v3.0 | v3.1 (target) | Status de migração | Impacto | Risco |
|---|---|---|---|---|---|---|
| Multi-provider (`multiProvider`) | Não suportado | Single provider com detecção de tracing | Orquestração multi-backend com seleção por política/custo | Planejado com flag (default OFF) | Alto (expande cobertura de provedores) | Alto (latência, auth, custos) |
| Multi-model (`multiModel`) | Não suportado | Execução single-model por etapa | Execução paralela/serial multi-model por tarefa | Planejado com flag (default OFF) | Alto (qualidade/resiliência) | Alto (custo e coordenação) |
| Consensus engine (`consensus`) | Não suportado | Decisão sem votação formal | Consenso entre respostas/modelos (quorum/pesos) | Planejado com flag (default OFF) | Médio-Alto (qualidade de decisão) | Médio-Alto (falsos consensos) |
| Smart router (`router`) | Não suportado | Roteamento estático pelo fluxo base | Roteamento dinâmico por tipo de tarefa e SLA | Planejado com flag (default OFF) | Médio-Alto (eficiência) | Médio (classificação incorreta) |
| Dark factory mode (`darkFactory`) | Não suportado | Pipeline supervisionado padrão | Execução autônoma orientada a políticas | Planejado com flag (default OFF) | Alto (throughput/autonomia) | Alto (segurança/compliance) |

## Estratégia de ativação progressiva

1. **Baseline v3.0 (flags OFF)**
   - Todos os módulos novos permanecem desativados.
   - A resolução de comportamento retorna explicitamente `v3.0` quando a flag estiver `false`.
2. **Canary por módulo**
   - Ativar uma flag por vez em ambientes de teste.
   - Validar métricas de custo, latência, taxa de falha e qualidade.
3. **Ramp-up gradual**
   - Expandir ativação por coortes/projetos, sempre com trilha de auditoria.
4. **General Availability (GA)**
   - Considerar mudança de default para ON apenas após estabilidade comprovada.

## Critérios de rollback por módulo

### `multiProvider`
- **Rollback imediato se:**
  - falhas de autenticação > 2% por 30 min;
  - aumento de custo > 25% sem ganho de qualidade equivalente;
  - indisponibilidade de provider primário sem failover efetivo.
- **Ação de rollback:** desligar `featureFlags.multiProvider` e voltar ao provider único `v3.0`.

### `multiModel`
- **Rollback imediato se:**
  - latência p95 aumentar > 40% por 1h;
  - custo por execução subir > 30% sem melhoria de resultado;
  - divergência entre modelos gerar instabilidade de saída.
- **Ação de rollback:** desligar `featureFlags.multiModel` e restaurar execução single-model `v3.0`.

### `consensus`
- **Rollback imediato se:**
  - taxa de decisões incorretas pós-consenso aumentar de forma sustentada;
  - quorum não atingido em volume significativo de requests;
  - regressão funcional em fluxos críticos.
- **Ação de rollback:** desligar `featureFlags.consensus` e usar decisão direta `v3.0`.

### `router`
- **Rollback imediato se:**
  - roteamento incorreto causar degradação de SLA/qualidade;
  - aumento de retries/timeouts acima do baseline v3.0;
  - custo médio por tarefa subir sem ganho mensurável.
- **Ação de rollback:** desligar `featureFlags.router` e aplicar roteamento estático `v3.0`.

### `darkFactory`
- **Rollback imediato se:**
  - violações de política/compliance;
  - aumento de incidentes de segurança ou ações irreversíveis indevidas;
  - perda de rastreabilidade/auditoria.
- **Ação de rollback:** desligar `featureFlags.darkFactory` e retornar ao modo supervisionado `v3.0`.

## Governança operacional
- Toda ativação/desativação de flag deve ser registrada em changelog operacional.
- Rollback deve ocorrer por módulo (granular), sem exigir rollback completo da release.
- Sempre preservar compatibilidade de API pública durante a transição.
