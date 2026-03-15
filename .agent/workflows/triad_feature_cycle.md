---
description: Pipeline Triad - Feature Cycle Implementation
---
This workflow guides Antigravity to coordinate building a feature, from reading the roadmap to updating the changelog.

# Flow Steps

1. **Context Reading**:
   - Use the `view_file` tool to analyze the following files:
     - `skills/GLOBAL_SKILLS.md`
     - `docs/CONTEXT_STATE.md`
     - `docs/roadmap.md`
     - `docs/architecture.md`
   - Identify and extract a pending task in `docs/roadmap.md` if the state demands validation.

2. **Delegation and Integration (Codex/Self)**:
   - Once the task is chosen, the implementation will be retrieved (either via Codex diffs or assumed via proprietary code depending on local automation).
   - Apply or validate the implementation in the main codebase.
   
3. **Validation and Gatekeeping**:
   // turbo
   - Execute the project's test suite and static validators for the generated component.
   - Run security scans and logic reviews if necessary before final merge.

4. **Artifact Update**:
   - Make corresponding edits in `docs/roadmap.md` to remove the completed feature.
   - Update `CHANGELOG.md` in the relevant `[Unreleased]` tab.
   - Add relevant notes to `docs/architecture.md`.

5. **Notification and Transition**:
   - Upon completing the feature cycle, notify the `USER` requesting the final audit and release transition.
   - Request validation for semantic version bumping (`MAJOR.MINOR.PATCH`).
