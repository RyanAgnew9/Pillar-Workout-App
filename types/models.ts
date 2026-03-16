export type ExerciseType = 'reps' | 'time' | 'mixed';

export type Exercise = {
  id: number;
  name: string;
  type: ExerciseType;
  color_token: string;
  is_active: number;
  created_at: string;
};

export type WorkoutEntry = {
  id: number;
  exercise_id: number;
  date: string;
  reps: number;
  sets: number;
  duration_seconds: number;
  notes: string;
  perceived_effort: number;
  created_at: string;
  updated_at: string;
};

export type DailySummary = {
  id: number;
  date: string;
  total_volume: number;
  score: number;
  mood_note: string;
  streak_count: number;
};

export type Goal = {
  id: number;
  title: string;
  type: string;
  target_value: number;
  target_unit: string;
  cadence: string;
  start_date: string;
  end_date: string;
  is_active: number;
};

export type MediaEntry = {
  id: number;
  date: string;
  type: 'photo' | 'video';
  uri: string;
  thumbnail_uri: string;
  note: string;
};

export type Quote = {
  id: number;
  text: string;
  author: string;
  category: string;
};
