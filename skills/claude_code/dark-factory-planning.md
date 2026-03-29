# Skill: Dark Factory Planning

## Metadata
- **ID:** SKL-CC-010
- **Agents:** claude_code
- **Token Budget:** extended
- **Source:** claude-octopus (adapted)
- **Pillars:** [P2-08]

## Purpose
Define specifications for autonomous Dark Factory pipeline execution. Claude Code creates markdown specifications that the Dark Factory Runner processes through the complete pipeline with configurable autonomy levels.

## STOP Rules
- MUST NOT specify autonomous mode for security-critical features without explicit user consent
- MUST NOT create specifications without acceptance criteria
- MUST NOT bypass human final commit authority regardless of autonomy level
- MUST NOT omit satisfaction thresholds from specifications

## Protocol
1. Receive feature request from user
2. Create Dark Factory specification in markdown format:
   ```markdown
   # Dark Factory Specification: [Feature Name]
   ## Autonomy Level: [supervised | semi_autonomous | autonomous]
   ## Max Cycles: [number, default 5]
   ## Satisfaction Threshold: [0.0-1.0, default 0.8]
   ## Requirements
   - [Requirement 1]
   - [Requirement 2]
   ## Acceptance Criteria
   - [ ] [Criterion 1]
   - [ ] [Criterion 2]
   ## Constraints
   - [Constraint 1]
   ## Provider Preferences (optional)
   - Planning: [provider or "auto"]
   - Implementation: [provider or "auto"]
   - Validation: [provider or "auto"]
   ```
3. Validate specification completeness (requirements, acceptance criteria, constraints)
4. Set autonomy level based on risk assessment:
   - Supervised: New features, security-sensitive, architectural changes
   - Semi-autonomous: Bug fixes, refactoring, test additions
   - Autonomous: Documentation, formatting, dependency updates
5. Launch via `triad dark-factory <spec.md>`

## Checklist
- [ ] Specification includes all mandatory sections
- [ ] Autonomy level appropriate for risk level
- [ ] Satisfaction threshold set (default 0.8)
- [ ] Max cycles limit defined (default 5)
- [ ] Acceptance criteria are testable
- [ ] Human final commit authority preserved

## Handoff
Specification file passed to `DarkFactoryRunner` via CLI. Runner manages pipeline autonomously per specification.
