import { StyleSheet, Text, View } from 'react-native';
import { PillCard, Screen } from '@/components/ui';
import { useAppState } from '@/lib/useAppState';

export default function ProgressScreen() {
  const { dailySummaries } = useAppState();
  const totals30 = dailySummaries.slice(0, 30).reduce((s, d) => s + d.total_volume, 0);
  const best = dailySummaries.reduce((p, c) => (c.score > p.score ? c : p), dailySummaries[0] || { score: 0, date: 'n/a' });
  const worst = dailySummaries.reduce((p, c) => (c.score < p.score ? c : p), dailySummaries[0] || { score: 0, date: 'n/a' });

  return (
    <Screen>
      <Text style={styles.title}>Progress</Text>
      <PillCard><Text style={styles.big}>{Math.round(totals30)}</Text><Text style={styles.label}>Monthly total volume</Text></PillCard>
      <View style={styles.row}>
        <PillCard><Text style={styles.metric}>7-day trend</Text><Text style={styles.label}>+12%</Text></PillCard>
        <PillCard><Text style={styles.metric}>30-day trend</Text><Text style={styles.label}>+28%</Text></PillCard>
      </View>
      <PillCard><Text style={styles.metric}>Best day: {best.date}</Text><Text style={styles.label}>Score {Math.round(best.score)}</Text></PillCard>
      <PillCard><Text style={styles.metric}>Worst day: {worst.date}</Text><Text style={styles.label}>Recovery insight: misses happen on Sundays</Text></PillCard>
      <PillCard><Text style={styles.metric}>Premium Insight</Text><Text style={styles.lock}>Locked • advanced exercise-specific charts</Text></PillCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 42, fontWeight: '900', color: '#1A1B1F', letterSpacing: -1.2, marginBottom: 12 },
  big: { fontSize: 52, fontWeight: '900', color: '#1A1B1F' },
  label: { color: '#6A6D75', fontWeight: '600' },
  row: { flexDirection: 'row', gap: 8 },
  metric: { fontSize: 18, fontWeight: '800', color: '#1F232B' },
  lock: { color: '#9A8D58', fontWeight: '700', marginTop: 6 },
});
