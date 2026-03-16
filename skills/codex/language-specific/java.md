# Skill: Java Language Patterns

## Metadata
- **ID:** SKL-CODEX-012
- **Agents:** codex
- **Token Budget:** extended
- **Source:** everything-claude-code
- **Pillars:** N/A

## Purpose
Apply Spring patterns, dependency injection, Maven/Gradle conventions, and modern Java idioms for production services.

## STOP Rules
- MUST NOT use field injection; use constructor injection.
- MUST NOT suppress or swallow exceptions without logging.
- MUST NOT validate its own Java code as production-ready.
- MUST NOT update docs/roadmap.md or CHANGELOG.md.
- MUST NOT determine versioning.

## Protocol

### Spring Patterns
1. Use constructor injection with `@RequiredArgsConstructor` or explicit constructor.
2. Define service boundaries: `@Controller` -> `@Service` -> `@Repository`.
3. Use `@Transactional` at service layer; specify `readOnly` where applicable.
4. Configure profiles for environment-specific beans: `@Profile("dev")`.

### Dependency Injection
1. Inject interfaces, not concrete implementations.
2. Use `@Qualifier` only when multiple implementations exist.
3. Avoid `@Autowired` on fields; prefer constructor parameters.
4. Register custom beans via `@Configuration` classes.

### Build & Dependencies
1. Use Maven wrapper (`mvnw`) or Gradle wrapper (`gradlew`).
2. Pin dependency versions; use BOM for Spring dependencies.
3. Run `./mvnw verify` or `./gradlew build` before committing.
4. Separate compile, runtime, and test dependencies.

### Modern Java
1. Use records for immutable data carriers (Java 16+).
2. Use `Optional` for nullable return types; never for parameters.
3. Use `Stream` API for collection transformations.
4. Apply sealed classes/interfaces for restricted hierarchies (Java 17+).

### Example (max 10 lines)
```java
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }
}
```

## Checklist
- [ ] Constructor injection used throughout
- [ ] Service layer boundaries defined
- [ ] Build wrapper configured and passes
- [ ] Dependencies version-pinned
- [ ] Modern Java features applied
- [ ] No field injection or swallowed exceptions

## Handoff
Set Phase to `[VALIDATION]` and Assignee to `Antigravity` in CONTEXT_STATE.md.
