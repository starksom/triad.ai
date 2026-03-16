# Skill: Python Language Patterns

## Metadata
- **ID:** SKL-CODEX-011
- **Agents:** codex
- **Token Budget:** extended
- **Source:** everything-claude-code
- **Pillars:** N/A

## Purpose
Apply Python best practices: type hints, async patterns, virtual environment management, and idiomatic Python for production code.

## STOP Rules
- MUST NOT use `requirements.txt` without pinned versions.
- MUST NOT skip type hints on public function signatures.
- MUST NOT use bare `except:` clauses.
- MUST NOT validate its own Python code as production-ready.
- MUST NOT update docs/roadmap.md or CHANGELOG.md.

## Protocol

### Typing
1. Add type hints to all public function signatures.
2. Use `Optional`, `Union`, `TypeAlias`, `TypeVar` from `typing`.
3. Use `Pydantic` or `dataclasses` for structured data models.
4. Run `mypy --strict` or `pyright` before committing.

### Async Patterns
1. Use `async/await` for I/O-bound operations.
2. Use `asyncio.gather()` for concurrent async tasks.
3. Avoid mixing sync and async code in the same call chain.
4. Use `aiohttp` or `httpx.AsyncClient` for async HTTP.

### Virtual Environments
1. Use `venv` or `poetry` for dependency isolation.
2. Pin all dependency versions in `pyproject.toml` or `requirements.txt`.
3. Include `python-version` in CI config.
4. Never install packages globally.

### Code Quality
1. Follow PEP 8; enforce with `ruff` or `black` + `isort`.
2. Use context managers (`with`) for resource management.
3. Prefer list comprehensions over `map`/`filter` for readability.
4. Use `logging` module over `print` statements.

### Example (max 10 lines)
```python
from dataclasses import dataclass

@dataclass(frozen=True)
class User:
    id: str
    name: str
    email: str

async def get_user(user_id: str) -> User | None:
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"/users/{user_id}")
        return User(**resp.json()) if resp.status_code == 200 else None
```

## Checklist
- [ ] Type hints on all public functions
- [ ] Async used for I/O-bound operations
- [ ] Dependencies pinned with versions
- [ ] Virtual environment configured
- [ ] Linter/formatter passes (ruff/black)
- [ ] No bare except clauses

## Handoff
Set Phase to `[VALIDATION]` and Assignee to `Antigravity` in CONTEXT_STATE.md.
