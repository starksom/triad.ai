/**
 * SQLite-based checkpoint storage backend.
 * Uses better-sqlite3 (optional dependency).
 * Opt-in via config.checkpoints.backend = "sqlite".
 */

import type { Checkpoint, CheckpointBackend, CheckpointListOptions } from './types.js';

export class SqliteCheckpointBackend implements CheckpointBackend {
  private db: import('better-sqlite3').Database;

  constructor(dbPath: string) {
    // Dynamic import to handle optional dependency
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Database = require('better-sqlite3');
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS checkpoints (
        id TEXT PRIMARY KEY,
        parent_id TEXT,
        timestamp TEXT NOT NULL,
        transition_json TEXT NOT NULL,
        context_json TEXT NOT NULL,
        metadata_json TEXT NOT NULL
      )
    `);
  }

  save(checkpoint: Checkpoint): void {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO checkpoints (id, parent_id, timestamp, transition_json, context_json, metadata_json)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      checkpoint.id,
      checkpoint.parentId,
      checkpoint.timestamp,
      JSON.stringify(checkpoint.transition),
      JSON.stringify(checkpoint.contextState),
      JSON.stringify(checkpoint.metadata)
    );
  }

  list(options?: CheckpointListOptions): Checkpoint[] {
    let query = 'SELECT * FROM checkpoints WHERE 1=1';
    const params: unknown[] = [];

    if (options?.fromDate) {
      query += ' AND timestamp >= ?';
      params.push(options.fromDate);
    }
    if (options?.toDate) {
      query += ' AND timestamp <= ?';
      params.push(options.toDate);
    }

    query += ' ORDER BY timestamp DESC';

    if (options?.limit) {
      query += ' LIMIT ?';
      params.push(options.limit);
    }
    if (options?.offset) {
      query += ' OFFSET ?';
      params.push(options.offset);
    }

    const rows = this.db.prepare(query).all(...params) as Array<{
      id: string;
      parent_id: string | null;
      timestamp: string;
      transition_json: string;
      context_json: string;
      metadata_json: string;
    }>;

    return rows.map(row => ({
      id: row.id,
      parentId: row.parent_id,
      timestamp: row.timestamp,
      transition: JSON.parse(row.transition_json),
      contextState: JSON.parse(row.context_json),
      metadata: JSON.parse(row.metadata_json),
    }));
  }

  get(id: string): Checkpoint | null {
    const row = this.db.prepare('SELECT * FROM checkpoints WHERE id = ?').get(id) as {
      id: string;
      parent_id: string | null;
      timestamp: string;
      transition_json: string;
      context_json: string;
      metadata_json: string;
    } | undefined;

    if (!row) return null;

    return {
      id: row.id,
      parentId: row.parent_id,
      timestamp: row.timestamp,
      transition: JSON.parse(row.transition_json),
      contextState: JSON.parse(row.context_json),
      metadata: JSON.parse(row.metadata_json),
    };
  }

  getLatest(): Checkpoint | null {
    const results = this.list({ limit: 1 });
    return results.length > 0 ? results[0] : null;
  }
}
