---
description: Pipeline Triad - Feature Cycle Implementation
---
This workflow guides Antigravity to coordinate building a feature, from reading the roadmap to updating the changelog.

# Flow Steps

1. **Context Reading**:
   - Use the `view_file` tool to analyze the following files:
     - `skills/GLOBAL_SKILLS.md`
     - `docs/CONTEXT_STATE.md`
     - `TRIAD_MASTER_ROADMAP.md`
     - `docs/roadmap.md`
     - `docs/architecture.md`
   - Identify and extract a pending task in `docs/roadmap.md` if the state demands validation.
   - Note which `TRIAD_MASTER_ROADMAP.md` Phase 2/3 pillars are relevant to the current task.

2. **Delegation and Integration (Codex/Self)**:
   - Once the task is chosen, the implementation will be retrieved (either via Codex diffs or assumed via proprietary code depending on local automation).
   - Apply or validate the implementation in the main codebase.

3. **Validation and Gatekeeping**:
   - Execute the project's test suite and static validators for the generated component.
   - Run security scans and logic reviews if necessary before final merge.
   - Verify implementation does not conflict with active strategic pillars in `TRIAD_MASTER_ROADMAP.md`.

4. **Artifact Update**:
   - Make corresponding edits in `docs/roadmap.md` to remove the completed feature.
   - Update `CHANGELOG.md` in the relevant `[Unreleased]` tab.
   - Add relevant notes to `docs/architecture.md`, including which roadmap pillar(s) were advanced.
   - Update `Roadmap Pillar(s)` field in `docs/CONTEXT_STATE.md` if applicable.

5. **Notification and Transition**:
   - Upon completing the feature cycle, notify the `USER` requesting the final audit and release transition.
   - Request validation for semantic version bumping (`MAJOR.MINOR.PATCH`).
   - Include a summary of which strategic pillars were impacted in the transition report.
