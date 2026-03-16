# Skill: Core Web Vitals
## Metadata
- **ID:** SKL-AG-003
- **Agents:** antigravity
- **Token Budget:** standard
- **Source:** web-quality-skills
- **Pillars:** P2-UX
## Purpose
Measure and enforce Core Web Vitals thresholds: LCP<2.5s, INP<200ms, CLS<0.1.
## STOP Rules
- NEVER write or modify source code
- NEVER adjust thresholds without User approval
- NEVER approve metrics exceeding "Good" range
## Protocol
1. Run web-vitals measurement tool against target build/URL
2. Capture LCP (Largest Contentful Paint) in milliseconds
3. Capture INP (Interaction to Next Paint) in milliseconds
4. Capture CLS (Cumulative Layout Shift) as decimal
5. Apply thresholds: LCP<2500ms, INP<200ms, CLS<0.1
6. Classify each metric: Good (pass) / Needs Improvement / Poor
7. If all metrics Good: APPROVE
8. If any metric exceeds Good: REJECT via SKL-AG-009

```
Example output:
| Metric | Value  | Threshold | Status |
|--------|--------|-----------|--------|
| LCP    | 1800ms | <2500ms   | PASS   |
| INP    | 150ms  | <200ms    | PASS   |
| CLS    | 0.05   | <0.1      | PASS   |
```
## Checklist
- [ ] LCP measured and < 2500ms
- [ ] INP measured and < 200ms
- [ ] CLS measured and < 0.1
- [ ] All metrics in "Good" range
- [ ] Results table generated
## Handoff
Return metric table to SKL-AG-001 or SKL-AG-002. On REJECT: invoke SKL-AG-009 with failing metric details.
