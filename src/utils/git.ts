/**
 * Git operations for auto-committing state transitions.
 */

import { execSync } from 'node:child_process';

export interface GitCommitOptions {
  message: string;
  files?: string[];
  prefix?: string;
}

/**
 * Auto-commit specified files (or CONTEXT_STATE.md by default).
 */
export function autoCommit(options: GitCommitOptions): string | null {
  const { message, files = ['docs/CONTEXT_STATE.md'], prefix = 'triad:' } = options;

  try {
    // Stage files
    for (const file of files) {
      execSync(`git add "${file}"`, { stdio: 'pipe' });
    }

    // Check if there are staged changes
    const status = execSync('git diff --cached --name-only', { encoding: 'utf-8' }).trim();
    if (!status) return null;

    // Commit
    const fullMessage = `${prefix} ${message}`;
    execSync(`git commit -m "${fullMessage.replace(/"/g, '\\"')}"`, { stdio: 'pipe' });

    return getCurrentSha();
  } catch {
    // Git operations may fail in non-git environments; gracefully degrade
    return null;
  }
}

/**
 * Get current HEAD SHA.
 */
export function getCurrentSha(): string {
  try {
    return execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
  } catch {
    return 'unknown';
  }
}

/**
 * Check if working tree is clean.
 */
export function isClean(): boolean {
  try {
    const output = execSync('git status --porcelain', { encoding: 'utf-8' }).trim();
    return output === '';
  } catch {
    return true;
  }
}
