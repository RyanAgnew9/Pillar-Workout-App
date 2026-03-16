import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { scoreToBucket } from '@/constants/scoring';
import { initDb } from '@/lib/db';
import { localBackend } from '@/services/localBackend';
import { Exercise, WorkoutEntry } from '@/types/models';

type AppStateValue = {
  exercises: Exercise[];
  todayEntries: WorkoutEntry[];
  dailySummaries: { id: number; date: string; total_volume: number; score: number; mood_note: string; streak_count: number }[];
  streak: number;
  totalVolume: number;
  score: number;
  scoreBucket: 'green' | 'yellow' | 'red';
  quoteIndex: number;
  quotes: { id: number; text: string; author: string }[];
  logWorkout: (exercise_id: number, reps: number, sets: number, duration_seconds?: number, notes?: string) => void;
  refresh: () => void;
};

const AppStateContext = createContext<AppStateValue | null>(null);

const today = () => new Date().toISOString().slice(0, 10);

export const AppStateProvider = ({ children }: PropsWithChildren) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [todayEntries, setTodayEntries] = useState<WorkoutEntry[]>([]);
  const [dailySummaries, setDailySummaries] = useState(localBackend.listDailySummaries());
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quotes, setQuotes] = useState<{ id: number; text: string; author: string }[]>([]);

  const date = today();

  const refresh = () => {
    setExercises(localBackend.listExercises());
    setTodayEntries(localBackend.listEntriesByDate(date));
    setDailySummaries(localBackend.listDailySummaries());
    setQuotes(localBackend.listQuotes());
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

  const totalVolume = useMemo(
    () => todayEntries.reduce((sum, entry) => sum + entry.reps * Math.max(entry.sets, 1) + Math.floor(entry.duration_seconds / 10), 0),
    [todayEntries],
  );

  const score = useMemo(() => Math.min(100, Math.floor(totalVolume * 0.6 + Math.min(40, todayEntries.length * 8))), [todayEntries.length, totalVolume]);

  useEffect(() => {
    if (!exercises.length) return;
    localBackend.upsertDailySummary({
      date,
      total_volume: totalVolume,
      score,
      mood_note: score > 70 ? 'Excellent day' : score > 45 ? 'Solid day' : 'Light day',
      streak_count: streak,
    });
    setDailySummaries(localBackend.listDailySummaries());
  }, [date, exercises.length, score, streak, totalVolume]);

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

  const value: AppStateValue = {
    exercises,
    todayEntries,
    dailySummaries,
    streak,
    totalVolume,
    score,
    scoreBucket: scoreToBucket(score),
    quoteIndex,
    quotes,
    logWorkout,
    refresh,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export const useAppState = () => {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return ctx;
};
