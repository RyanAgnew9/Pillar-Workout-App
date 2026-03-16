import { DailySummary, Exercise, Goal, MediaEntry, WorkoutEntry } from '@/types/models';

export interface BackendAdapter {
  listExercises(): Exercise[];
  listEntriesByDate(date: string): WorkoutEntry[];
  addWorkoutEntry(entry: Omit<WorkoutEntry, 'id' | 'created_at' | 'updated_at'>): void;
  listDailySummaries(): DailySummary[];
  upsertDailySummary(summary: Omit<DailySummary, 'id'>): void;
  listGoals(): Goal[];
  listMedia(): MediaEntry[];
}

// Placeholder for future Supabase/Firebase adapter.
export class RemoteBackendAdapter implements BackendAdapter {
  listExercises(): Exercise[] { return []; }
  listEntriesByDate(): WorkoutEntry[] { return []; }
  addWorkoutEntry(): void {}
  listDailySummaries(): DailySummary[] { return []; }
  upsertDailySummary(): void {}
  listGoals(): Goal[] { return []; }
  listMedia(): MediaEntry[] { return []; }
}
