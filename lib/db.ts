import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('pillar.db');

export const initDb = () => {
  db.execSync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      color_token TEXT,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS workout_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exercise_id INTEGER,
      date TEXT NOT NULL,
      reps INTEGER DEFAULT 0,
      sets INTEGER DEFAULT 0,
      duration_seconds INTEGER DEFAULT 0,
      notes TEXT DEFAULT '',
      perceived_effort INTEGER DEFAULT 5,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS daily_summaries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT UNIQUE,
      total_volume INTEGER DEFAULT 0,
      score REAL DEFAULT 0,
      mood_note TEXT DEFAULT '',
      streak_count INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      type TEXT,
      target_value INTEGER,
      target_unit TEXT,
      cadence TEXT,
      start_date TEXT,
      end_date TEXT,
      is_active INTEGER DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS media_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      type TEXT,
      uri TEXT,
      thumbnail_uri TEXT,
      note TEXT DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS quotes (
      id INTEGER PRIMARY KEY,
      text TEXT,
      author TEXT,
      category TEXT
    );
    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);
};
