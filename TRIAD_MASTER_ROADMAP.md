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
Provide a formal programmatic abstraction for agents (`name`, `role`, `model`, `instructions`, `run()`). Fully support specialized types: **Generator**, **Critic**, **Verifier**, and **Arbiter**.

### 2. Multi-Model Simultaneous Execution
Enable querying multiple models at the exact same time for the same task (e.g., `models=["gpt-4o", "claude-3.5", "llama-3"]`), generating comparative arrays of responses and scores.

### 3. Consensus Engine
Implement configurable strategies to define single sources of truth from multi-model outputs:
- **Majority Vote**: Simple consensus.
- **Weighted Score**: Trust-based scoring.
- **Confidence Ranking**.
- **Adversarial Debate**: LLMs explicitly debate until a conclusion is reached.

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

### 8. Automated Retry & Self-Healing
If Antigravity (validation) fails, the pipeline must automatically loop back to Codex (implementation) passing the strict failure logs without requiring manual prompt engineering until the test suite passes.

### 12. Automated Benchmark Engine
Provide built-in commands to evaluate the local agents against standard academic datasets. Target support for: **HumanEval** (Code), **SWE-bench** (SE), **GAIA** (Reasoning), and **MMLU** (Knowledge).

### 13. Multi-Backend LLM Adapters
Abstract API calls behind a `model_adapters/` layer to natively support OpenAI, Anthropic, Google Gemini, Mistral, and local models (e.g., Llama via Ollama). 

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
