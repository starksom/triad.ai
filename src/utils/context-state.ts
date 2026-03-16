/**
 * Parser and writer for docs/CONTEXT_STATE.md.
 *
 * This is the critical bridge between the state graph engine and the
 * existing markdown-based agent protocol (ADR-002: Markdown as universal data format).
 */

import { readFileSync, writeFileSync } from 'node:fs';
import type { PipelineContext, RejectionEntry, CompletionSignal } from '../state-graph/types.js';

/**
 * Parse CONTEXT_STATE.md into a structured PipelineContext.
 */
export function parseContextState(filePath: string): PipelineContext {
  const content = readFileSync(filePath, 'utf-8');

  const phase = extractPattern(content, />\s*\*\*\[([A-Z_]+)\]\*\*/) ?? 'PLANNING';
  const task = extractPattern(content, /\*\*Task:\*\*\s*(.+)/) ?? 'N/A';
  const storyMatch = content.match(/\*\*Story:\*\*\s*(\d+)\s*of\s*(\d+)/);
  const story = storyMatch
    ? { current: parseInt(storyMatch[1], 10), total: parseInt(storyMatch[2], 10) }
    : { current: 0, total: 0 };
  const assignee = extractPattern(content, /\*\*Current Assignee:\*\*\s*(.+)/) ?? 'Claude Code';
  const retryCount = parseInt(extractPattern(content, /\*\*Retry Count:\*\*\s*(\d+)/) ?? '0', 10);
  const maxRetries = parseInt(extractPattern(content, /\*\*Max Retries:\*\*\s*(\d+)/) ?? '3', 10);
  const handoffMessage = extractPattern(content, /## Handoff Message[^\n]*\n["']?([^"'\n]+)["']?/)
    ?? extractPattern(content, /## Handoff Message[^\n]*\n(.+)/)
    ?? '';
  const completionSignal = (extractPattern(content, />\s*(INCOMPLETE|COMPLETE)/) ?? 'INCOMPLETE') as CompletionSignal;
  const roadmapPillars = extractPattern(content, /\*\*Active Pillar\(s\):\*\*\s*(.+)/) ?? 'N/A';

  const rejectionLog = parseRejections(content);

  return {
    phase: phase.trim(),
    task: task.trim(),
    story,
    assignee: assignee.trim(),
    retryCount,
    maxRetries,
    rejectionLog,
    handoffMessage: handoffMessage.trim().replace(/^["']|["']$/g, ''),
    completionSignal,
    roadmapPillars: roadmapPillars.trim(),
  };
}

/**
 * Write a PipelineContext back to CONTEXT_STATE.md preserving the expected format.
 */
export function writeContextState(filePath: string, ctx: PipelineContext): void {
  const rejectionSection = ctx.rejectionLog.length > 0
    ? ctx.rejectionLog.map(formatRejection).join('\n\n')
    : '*(Empty — no rejections recorded)*';

  const content = `# Context Synchronization Point (Context State)

This file acts as the project's "short-term memory". It serves as the transition baton between **Claude Code**, **Codex**, and **Antigravity**.
No AI agent may initiate its work without reading this file and understanding exactly which phase the development flow is currently in.

---

## Current Phase (Pipeline Status)
> **[${ctx.phase}]**

*(Valid options: \`[PLANNING]\`, \`[DEVELOPMENT]\`, \`[VALIDATION]\`, \`[CONSOLIDATION]\`, \`[RELEASE_AUDIT]\`)*

---

## Current Task / Focus
- **Task:** ${ctx.task}
- **Story:** ${ctx.story.current} of ${ctx.story.total}
- **Current Assignee:** ${ctx.assignee}
- **Retry Count:** ${ctx.retryCount}
- **Max Retries:** ${ctx.maxRetries}

---

## Roadmap Pillar(s)
**Active Pillar(s):** ${ctx.roadmapPillars}
*(Reference: \`TRIAD_MASTER_ROADMAP.md\` Phase 2/3 pillars. Example: \`[P2-04] Graph Workflow Engine\`)*

---

## Handoff Message (From previous assignee)
"${ctx.handoffMessage}"

---

## Rejection Log (if applicable)
${rejectionSection}

<!-- Rejection entry format:
### Rejection #N - [YYYY-MM-DD]
- **Rejector:** Antigravity
- **Category:** [TEST_FAILURE | SECURITY_VIOLATION | UX_VIOLATION | PILLAR_CONFLICT | PR_SIZE_EXCEEDED]
- **Files:** [affected files with line numbers]
- **Error:** [exact error output]
- **Required Fix:** [specific fix instruction]
- **Checklist Failures:** [which items failed]
-->

---

## Completion Signal
> ${ctx.completionSignal}
`;

  writeFileSync(filePath, content, 'utf-8');
}

/**
 * Append a rejection entry to an existing CONTEXT_STATE.md.
 */
export function appendRejection(filePath: string, rejection: RejectionEntry): void {
  const ctx = parseContextState(filePath);
  ctx.rejectionLog.push(rejection);
  writeContextState(filePath, ctx);
}

function extractPattern(content: string, pattern: RegExp): string | null {
  const match = content.match(pattern);
  return match ? match[1] : null;
}

function parseRejections(content: string): RejectionEntry[] {
  const rejections: RejectionEntry[] = [];
  const rejectionPattern = /### Rejection #(\d+)\s*-\s*\[?(\d{4}-\d{2}-\d{2})\]?\s*\n([\s\S]*?)(?=### Rejection #|<!--|---|\n## )/g;

  let match;
  while ((match = rejectionPattern.exec(content)) !== null) {
    const body = match[3];
    rejections.push({
      number: parseInt(match[1], 10),
      date: match[2],
      rejector: extractPattern(body, /\*\*Rejector:\*\*\s*(.+)/) ?? 'Antigravity',
      category: (extractPattern(body, /\*\*Category:\*\*\s*(.+)/) ?? 'TEST_FAILURE') as RejectionEntry['category'],
      files: extractPattern(body, /\*\*Files:\*\*\s*(.+)/) ?? '',
      error: extractPattern(body, /\*\*Error:\*\*\s*(.+)/) ?? '',
      requiredFix: extractPattern(body, /\*\*Required Fix:\*\*\s*(.+)/) ?? '',
      checklistFailures: extractPattern(body, /\*\*Checklist Failures:\*\*\s*(.+)/) ?? '',
    });
  }

  return rejections;
}

function formatRejection(r: RejectionEntry): string {
  return `### Rejection #${r.number} - ${r.date}
- **Rejector:** ${r.rejector}
- **Category:** ${r.category}
- **Files:** ${r.files}
- **Error:** ${r.error}
- **Required Fix:** ${r.requiredFix}
- **Checklist Failures:** ${r.checklistFailures}`;
}
