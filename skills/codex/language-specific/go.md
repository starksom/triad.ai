# Skill: Go Language Patterns

## Metadata
- **ID:** SKL-CODEX-010
- **Agents:** codex
- **Token Budget:** extended
- **Source:** everything-claude-code
- **Pillars:** N/A

## Purpose
Apply Go idioms, error handling conventions, concurrency patterns, and struct embedding for production-grade Go code.

## STOP Rules
- MUST NOT ignore returned errors; handle or propagate explicitly.
- MUST NOT use `panic` for control flow in library code.
- MUST NOT validate its own Go code as production-ready.
- MUST NOT update docs/roadmap.md or CHANGELOG.md.

## Protocol

### Error Handling
1. Return errors as the last return value.
2. Wrap errors with `fmt.Errorf("context: %w", err)` for traceability.
3. Use sentinel errors or custom error types for domain errors.
4. Check errors immediately after the call; no deferred error checks.

### Concurrency
1. Use goroutines with `sync.WaitGroup` for fan-out patterns.
2. Communicate via channels; avoid shared memory.
3. Use `context.Context` for cancellation and timeout propagation.
4. Apply `sync.Mutex` only when channel-based design is impractical.
5. Always close channels from the sender side.

### Struct & Interface Patterns
1. Use struct embedding for composition, not inheritance simulation.
2. Define small interfaces at the consumer side (accept interfaces, return structs).
3. Use pointer receivers for methods that mutate state.
4. Use value receivers for immutable operations.

### Project Structure
1. Follow `cmd/`, `internal/`, `pkg/` layout.
2. Keep `main.go` minimal; delegate to `internal/` packages.
3. Use `go mod tidy` before committing.

### Example (max 10 lines)
```go
func (s *Service) GetUser(ctx context.Context, id string) (*User, error) {
    user, err := s.repo.FindByID(ctx, id)
    if err != nil {
        return nil, fmt.Errorf("GetUser(%s): %w", id, err)
    }
    return user, nil
}
```

## Checklist
- [ ] All errors handled or propagated
- [ ] Context passed through call chain
- [ ] Channels used for goroutine communication
- [ ] Interfaces defined at consumer
- [ ] `go mod tidy` run before commit
- [ ] No `panic` in library code

## Handoff
Set Phase to `[VALIDATION]` and Assignee to `Antigravity` in CONTEXT_STATE.md.
