# Skill: Smart Routing

## Metadata
- **ID:** SKL-CC-009
- **Agents:** claude_code
- **Token Budget:** standard
- **Source:** claude-octopus (adapted)
- **Pillars:** [P2-02], [P2-13]

## Purpose
Classify incoming tasks by intent and route them to optimal provider+strategy combinations. Maps to claude-octopus's Probe/Grasp/Tangle/Ink taxonomy while preserving Triad's 3-agent model.

## STOP Rules
- MUST NOT route tasks to unavailable providers
- MUST NOT override user-specified provider preferences
- MUST NOT route security-sensitive tasks to economy-tier providers

## Protocol
1. Receive task description from user or pipeline
2. Classify task into category using `TaskClassifier`:
   - **Research** (Probe): Exploratory queries, technology evaluation, competitive analysis
   - **Design** (Grasp): Architecture decisions, API design, schema definition
   - **Implementation** (Tangle): Code generation, test writing, refactoring
   - **Review** (Ink): Code review, security audit, performance analysis
3. Select execution strategy based on classification:
   - Research: Parallel execution across available providers
   - Design: Sequential execution (chain insights)
   - Implementation: Single best-fit provider
   - Review: Adversarial execution with consensus gate
4. Select provider subset based on availability, cost tier, and domain expertise
5. Construct `MultiModelRequest` and delegate to `MultiModelExecutor`

## Checklist
- [ ] Task classified to correct category
- [ ] Strategy matches classification
- [ ] Selected providers are available and within budget
- [ ] Security-sensitive tasks routed to premium tier
- [ ] Classification logged for routing analytics

## Handoff
Routed request passed to `MultiModelExecutor`. Classification logged to observability traces.
