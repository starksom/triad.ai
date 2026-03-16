/**
 * Generic markdown section parser for AGENTS.md and progress.txt.
 */

import { readFileSync, appendFileSync, existsSync } from 'node:fs';

export interface AgentEntry {
  timestamp: string;
  agent: string;
  phase: string;
  decided: string;
  pillar: string;
  files: string;
}

export interface ProgressEntry {
  timestamp: string;
  phase: string;
  action: string;
  agent: string;
}

/**
 * Parse docs/AGENTS.md into structured entries.
 */
export function parseAgentsLog(filePath: string): AgentEntry[] {
  if (!existsSync(filePath)) return [];

  const content = readFileSync(filePath, 'utf-8');
  const entries: AgentEntry[] = [];
  const entryPattern = /## \[(\d{4}-\d{2}-\d{2}[^\]]*)\]\s+\[?(\w[\w\s]*)\]?\s*-\s*\[?(\w+)\]?\s*\n([\s\S]*?)(?=\n## |\n---|\Z)/g;

  let match;
  while ((match = entryPattern.exec(content)) !== null) {
    const body = match[4];
    entries.push({
      timestamp: match[1].trim(),
      agent: match[2].trim(),
      phase: match[3].trim(),
      decided: extractField(body, 'Decided') ?? '',
      pillar: extractField(body, 'Pillar') ?? '',
      files: extractField(body, 'Files') ?? '',
    });
  }

  return entries;
}

/**
 * Append an entry to docs/AGENTS.md.
 */
export function appendAgentEntry(filePath: string, entry: AgentEntry): void {
  const block = `\n## [${entry.timestamp}] ${entry.agent} - ${entry.phase}\n- Decided: ${entry.decided}\n- Pillar: ${entry.pillar}\n- Files: ${entry.files}\n`;
  appendFileSync(filePath, block, 'utf-8');
}

/**
 * Parse docs/progress.txt into structured entries.
 */
export function parseProgressLog(filePath: string): ProgressEntry[] {
  if (!existsSync(filePath)) return [];

  const content = readFileSync(filePath, 'utf-8');
  const entries: ProgressEntry[] = [];

  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const match = trimmed.match(/\[(\d{4}-\d{2}-\d{2}[^\]]*)\]\s+(\w+)\s+(.+?)\s*-\s*(.+)/);
    if (match) {
      entries.push({
        timestamp: match[1],
        phase: match[2],
        action: match[3].trim(),
        agent: match[4].trim(),
      });
    }
  }

  return entries;
}

/**
 * Append an entry to docs/progress.txt.
 */
export function appendProgressEntry(filePath: string, entry: ProgressEntry): void {
  const line = `[${entry.timestamp}] ${entry.phase} ${entry.action} - ${entry.agent}\n`;
  appendFileSync(filePath, line, 'utf-8');
}

function extractField(body: string, field: string): string | null {
  const match = body.match(new RegExp(`-\\s*${field}:\\s*(.+)`, 'i'));
  return match ? match[1].trim() : null;
}
