# triad.ai — Master Product Roadmap

This document consolidates the **Strategic Foundation**, the **Competitive Parity Requirements**, and the **Strategic Differentiation** goals for the `triad.ai` framework. It serves as the definitive guide for steering the project toward becoming a leading multi-agent orchestration framework.

---

## Phase 1: Strategic Foundation (Completed)
Establishing the bare minimum requirements for the project to be adopted, reproduced, and understood by external developers.

- [x] **Strict Role Separation:** Defined distinct capabilities (Claude as Planner, Codex as Implementer, Antigravity as Gatekeeper).
- [x] **Shared Document Memory:** Established `CONTEXT_STATE.md` as the transactional token.
- [x] **Minimal Example:** Deployed an end-to-end reproducible example (`examples/minimal-project`).
- [x] **Core CLI Scaffolding:** Initialized `triad-cli` for initializing and reading states.
- [x] **Mandatory Human Control:** Ensured commit decisions remain with the human user.

### v3.0 Architecture Additions (Completed)
- [x] **4. Graph Workflow Engine:** Executable JSON graph replacing linear pipelines (`src/state-graph`).
- [x] **9. Extended CLI Interface:** Node.js Commander CLI (`triad` and `create-triad`).
- [x] **10. Observability & Tracing:** Langfuse integration and local JSON fallback (`src/tracing`).
- [x] **11. Execution Replay:** Deterministic replay via checkpoint restoration.
- [x] **17. Developer Experience (SDKs):** `npx create-triad` scaffolder and npm distribution.
- [x] **18. State Monitoring Dashboard:** Express+WebSocket UI (`src/dashboard`).
- [x] **19. Persistent Cross-Session Memory:** File and SQLite checkpoint system (`src/checkpoints`).

---

## Phase 2: Competitive Parity (Active Development)
To eliminate gaps compared to modern frameworks (CrewAI, LangGraph, Ruflo), `triad.ai` must implement the following remaining technical pillars:

### 1. Agent Execution Engine
Provide a formal programmatic abstraction for agents (`name`, `role`, `model`, `provider`, `instructions`, `skills[]`, `run()`). Fully support specialized types: **Generator**, **Critic**, **Verifier**, and **Arbiter**. Include a **Persona System** with 11 role-specific persona definitions (JSON) mapped to Triad's 3-agent model, inspired by claude-octopus's 32 specialized personas (business-analyst, backend-architect, security-auditor, tdd-orchestrator, code-reviewer, etc.).

### 2. Multi-Model Simultaneous Execution
Enable querying multiple models at the exact same time for the same task (e.g., `models=["gpt-4o", "claude-3.5", "llama-3"]`), generating comparative arrays of responses and scores. Support three execution strategies inspired by claude-octopus: **Parallel** (all providers simultaneously for research/discovery), **Sequential** (chain outputs for scoping/design), and **Adversarial** (providers challenge each other for review/validation). Include per-provider cost tracking with tier-aware reporting.

### 3. Consensus Engine
Implement configurable strategies to define single sources of truth from multi-model outputs, inspired by claude-octopus's 75% consensus quality gate:
- **Majority Vote**: Simple agreement counting (default threshold: 75%).
- **Weighted Score**: Trust-based provider weighting with configurable weights.
- **Confidence Ranking**: Self-reported confidence scoring from each provider.
- **Adversarial Debate**: Multi-round debate until convergence is reached.
Consensus is optional per-phase, configurable via `CONTEXT_STATE.md` or CLI flags.

### 4. Smart Router (NEW — Octopus-Inspired)
Classify incoming tasks into categories (**research**, **design**, **implementation**, **review**) and route to optimal provider+strategy combinations. Maps to claude-octopus's Probe/Grasp/Tangle/Ink taxonomy while preserving Triad's 3-agent model. Routing decisions consider provider availability, cost tier, and historical performance scores.

### 5. Official Tool Framework (Registry)
Agents must access external tools reliably via a formal `Tool` object (`name`, `permissions`, `execute()`). Core integrations required: `web_search`, `code_executor`, `filesystem`, `database`, `rag`.

### 6. Layered Structured Memory
Evolve `CONTEXT_STATE.md` to support deeper cognitive layers:
- **Short-term**: Session context.
- **Vector Memory**: RAG-based knowledge.
- **Long-term**: Historical interactions.
- **Episodic**: Previous decision rationales.

### 7. Execution Isolation (Sandboxing)
Prevent agents from causing destructive cross-contamination. Isolate work streams via **Git Worktrees**, temporary subdirectories, or **Docker Containers**.

### 8. Automated Retry & Self-Healing / Dark Factory Mode
If Antigravity (validation) fails, the pipeline must automatically loop back to Codex (implementation) passing the strict failure logs without requiring manual prompt engineering until the test suite passes. Extended with **Dark Factory Mode** (inspired by claude-octopus): autonomous end-to-end pipeline execution from a markdown specification. Three autonomy levels — **Supervised** (approve each phase), **Semi-autonomous** (intervene on failures only), **Autonomous** (full pipeline without interruption). Includes satisfaction scoring and holdout testing. Human retains final commit authority.

### 12. Automated Benchmark Engine
Provide built-in commands to evaluate the local agents against standard academic datasets. Target support for: **HumanEval** (Code), **SWE-bench** (SE), **GAIA** (Reasoning), and **MMLU** (Knowledge).

### 13. Multi-Backend LLM Adapters
Abstract API calls behind a registry-based `src/providers/` layer to natively support Anthropic (Claude), OpenAI (GPT/Codex), Google Gemini, Mistral, Ollama (local models), and OpenRouter (multi-model gateway). Inspired by claude-octopus's 8-provider orchestration with zero-config bootstrap. Features: auto-detection of installed providers via environment variables and CLI availability, cost-tiered model strategy (`premium` | `standard` | `economy`), and graceful degradation (system works with Claude alone; additional providers enhance capabilities progressively).

### 14. Security & Governance 
Implement iron-clad administrative controls for enterprise adoption:
- Granular tool execution permissions.
- Hardened prompt-injection defense layers.
- Strict token-budget limits.

### 15. Formally Decoupled Human-in-the-loop (HITL)
Standardize the API so external applications can pause workflows elegantly (e.g., waiting for an external HTTP webhook to approve a destructive action).

### 16. CI/CD Native Compatibility
Publish official adapters/actions for **GitHub Actions** and **GitLab CI** enabling PRs to trigger automated Triad validation before allowing merges.

---

## Phase 3: Strategic Differentiation
Once competitive parity is reached, `triad.ai` will distance itself from the market focusing strictly on **BMAD methodologies**, absolute adherence to **Web Quality and Light Themes**, and operating natively as a **Shift-Left Security** enforcer using **Snyk heuristics** in the loop.
