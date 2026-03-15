# Minimal Triad Example

This directory contains a functional, reproducible example of the Triad Pipeline in action.
It is a simple Express API demonstrating the handover between Claude, Codex, and Antigravity.

## Structure
- `docs/CONTEXT_STATE.md`: Currently assigned to Codex for implementation.
- `docs/roadmap.md`: Shows pending task (Add /health endpoint).
- `src/index.js`: The base code.
- `tests/index.test.js`: A failing test that Antigravity will catch.

## How to test the flow
1. Pretend you are **Codex**. Open `src/index.js` and implement the `/health` endpoint so it returns `HTTP 200 { status: 'up' }`.
2. Update `docs/CONTEXT_STATE.md` assigning the phase to `[VALIDATION]` and the assignee to `Antigravity`.
3. Act as **Antigravity**. Run `npm install` and `npm test` in this folder.
4. If it passes, Antigravity (you) will remove the task from `roadmap.md` and update `CHANGELOG.md`.
