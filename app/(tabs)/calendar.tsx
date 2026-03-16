import { StyleSheet, Text, View } from 'react-native';
import { PillCard, Screen } from '@/components/ui';
import { scoreToBucket } from '@/constants/scoring';
import { colors } from '@/constants/theme';
import { useAppState } from '@/lib/useAppState';

const tone = (bucket: string) => ({ green: colors.green, yellow: colors.yellow, red: colors.red }[bucket] ?? '#C8C9CC');

export default function CalendarScreen() {
  const { dailySummaries } = useAppState();
  const days = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const date = d.toISOString().slice(0, 10);
    const found = dailySummaries.find((s) => s.date === date);
    return { date, score: found?.score ?? 0 };
  });

  const best = [...days].sort((a, b) => b.score - a.score)[0];
  const weakest = [...days].sort((a, b) => a.score - b.score)[0];

  return (
    <Screen>
      <Text style={styles.title}>Calendar</Text>
      <View style={styles.grid}>
        {days.map((d) => {
          const bucket = d.score === 0 ? 'neutral' : scoreToBucket(d.score);
          return <View key={d.date} style={[styles.day, { backgroundColor: bucket === 'neutral' ? '#D8D4CC' : tone(bucket) }]} />;
        })}
      </View>
      <PillCard><Text style={styles.summary}>Best day: {best?.date} ({Math.round(best?.score || 0)})</Text></PillCard>
      <PillCard><Text style={styles.summary}>Weakest day: {weakest?.date} ({Math.round(weakest?.score || 0)})</Text></PillCard>
      <PillCard><Text style={styles.summary}>Most consistent week: Week 2 • Longest streak in month: 6 days</Text></PillCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 42, fontWeight: '900', letterSpacing: -1.1, color: '#1A1B1F', marginBottom: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  day: { width: '12.2%', aspectRatio: 1, borderRadius: 10 },
  summary: { fontWeight: '700', color: '#242831' },
});
