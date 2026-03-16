import { quotes, starterExercises } from '@/data/quotes';
import { db } from '@/lib/db';
import { BackendAdapter } from '@/services/backend';
import { DailySummary, Exercise, Goal, MediaEntry, WorkoutEntry } from '@/types/models';

const today = () => new Date().toISOString().slice(0, 10);

export class LocalBackendAdapter implements BackendAdapter {
  seed() {
    const count = db.getFirstSync<{ count: number }>('SELECT COUNT(*) as count FROM exercises')?.count ?? 0;
    if (count === 0) {
      starterExercises.forEach((name) => {
        db.runSync('INSERT INTO exercises (name, type, color_token) VALUES (?, ?, ?)', [name, name === 'Plank' || name === 'Jump rope' ? 'time' : 'reps', 'graphite']);
      });
      quotes.forEach((q) => {
        db.runSync('INSERT OR REPLACE INTO quotes (id, text, author, category) VALUES (?, ?, ?, ?)', [q.id, q.text, q.author, q.category]);
      });
      db.runSync('INSERT INTO goals (title, type, target_value, target_unit, cadence, start_date, end_date, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, 1)', [
        '50 push-ups per day', 'volume', 50, 'reps', 'daily', today(), today(),
      ]);
    }
  }

  listExercises(): Exercise[] {
    return db.getAllSync<Exercise>('SELECT * FROM exercises WHERE is_active = 1 ORDER BY id');
  }

  listEntriesByDate(date: string): WorkoutEntry[] {
    return db.getAllSync<WorkoutEntry>('SELECT * FROM workout_entries WHERE date = ? ORDER BY created_at DESC', [date]);
  }

  addWorkoutEntry(entry: Omit<WorkoutEntry, 'id' | 'created_at' | 'updated_at'>): void {
    db.runSync(
      'INSERT INTO workout_entries (exercise_id, date, reps, sets, duration_seconds, notes, perceived_effort) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [entry.exercise_id, entry.date, entry.reps, entry.sets, entry.duration_seconds, entry.notes, entry.perceived_effort],
    );
  }

  listDailySummaries(): DailySummary[] {
    return db.getAllSync<DailySummary>('SELECT * FROM daily_summaries ORDER BY date DESC');
  }

  upsertDailySummary(summary: Omit<DailySummary, 'id'>): void {
    db.runSync(
      'INSERT INTO daily_summaries (date, total_volume, score, mood_note, streak_count) VALUES (?, ?, ?, ?, ?) ON CONFLICT(date) DO UPDATE SET total_volume=excluded.total_volume, score=excluded.score, mood_note=excluded.mood_note, streak_count=excluded.streak_count',
      [summary.date, summary.total_volume, summary.score, summary.mood_note, summary.streak_count],
    );
  }

  listGoals(): Goal[] {
    return db.getAllSync<Goal>('SELECT * FROM goals WHERE is_active = 1');
  }

  listMedia(): MediaEntry[] {
    return db.getAllSync<MediaEntry>('SELECT * FROM media_entries ORDER BY date DESC');
  }

  addMedia(entry: Omit<MediaEntry, 'id'>) {
    db.runSync('INSERT INTO media_entries (date, type, uri, thumbnail_uri, note) VALUES (?, ?, ?, ?, ?)', [entry.date, entry.type, entry.uri, entry.thumbnail_uri, entry.note]);
  }

  listQuotes() {
    return db.getAllSync<{ id: number; text: string; author: string }>('SELECT id, text, author FROM quotes ORDER BY id');
  }
}

export const localBackend = new LocalBackendAdapter();
