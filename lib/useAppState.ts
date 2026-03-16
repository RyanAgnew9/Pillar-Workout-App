import { useEffect, useMemo, useState } from 'react';
import { scoreToBucket } from '@/constants/scoring';
import { initDb } from '@/lib/db';
import { localBackend } from '@/services/localBackend';
import { Exercise, WorkoutEntry } from '@/types/models';

export const useAppState = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [todayEntries, setTodayEntries] = useState<WorkoutEntry[]>([]);
  const [dailySummaries, setDailySummaries] = useState(localBackend.listDailySummaries());
  const [quoteIndex, setQuoteIndex] = useState(0);

  const date = new Date().toISOString().slice(0, 10);

  const refresh = () => {
    setExercises(localBackend.listExercises());
    setTodayEntries(localBackend.listEntriesByDate(date));
    setDailySummaries(localBackend.listDailySummaries());
  };

  useEffect(() => {
    initDb();
    localBackend.seed();
    refresh();
  }, []);

  useEffect(() => {
    const handle = setInterval(() => setQuoteIndex((n) => n + 1), 6000);
    return () => clearInterval(handle);
  }, []);

  const streak = useMemo(() => {
    const sorted = [...dailySummaries].sort((a, b) => (a.date < b.date ? 1 : -1));
    let count = 0;
    for (const s of sorted) {
      if (s.total_volume > 0) count += 1;
      else break;
    }
    return count;
  }, [dailySummaries]);

  const totalVolume = todayEntries.reduce((sum, entry) => sum + entry.reps * Math.max(entry.sets, 1) + Math.floor(entry.duration_seconds / 10), 0);

  const score = Math.min(100, Math.floor(totalVolume * 0.6 + Math.min(40, todayEntries.length * 8)));

  const updateSummary = () => {
    localBackend.upsertDailySummary({
      date,
      total_volume: totalVolume,
      score,
      mood_note: score > 70 ? 'Excellent day' : score > 45 ? 'Solid day' : 'Light day',
      streak_count: streak,
    });
    refresh();
  };

  useEffect(() => {
    if (exercises.length) updateSummary();
  }, [todayEntries.length]);

  const logWorkout = (exercise_id: number, reps: number, sets: number, duration_seconds = 0, notes = '') => {
    localBackend.addWorkoutEntry({
      exercise_id,
      date,
      reps,
      sets,
      duration_seconds,
      notes,
      perceived_effort: 7,
    });
    refresh();
  };

  return {
    exercises,
    todayEntries,
    dailySummaries,
    streak,
    totalVolume,
    score,
    scoreBucket: scoreToBucket(score),
    quoteIndex,
    logWorkout,
    refresh,
  };
};
