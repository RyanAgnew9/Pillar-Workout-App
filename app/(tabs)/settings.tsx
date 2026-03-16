import { ScrollView, StyleSheet, Text } from 'react-native';
import { PillCard, Screen } from '@/components/ui';
import { localBackend } from '@/services/localBackend';

export default function SettingsScreen() {
  const goals = localBackend.listGoals();
  const history = localBackend.listDailySummaries().slice(0, 5);

  return (
    <Screen>
      <Text style={styles.title}>Settings</Text>
      <ScrollView>
        <PillCard><Text style={styles.item}>Theme: Warm Light</Text><Text style={styles.sub}>Reminder: 8:00 daily</Text></PillCard>
        <PillCard><Text style={styles.item}>Goals</Text>{goals.map((g) => <Text key={g.id} style={styles.sub}>• {g.title}</Text>)}</PillCard>
        <PillCard><Text style={styles.item}>History (recent days)</Text>{history.map((h) => <Text key={h.id} style={styles.sub}>{h.date} • volume {h.total_volume} • score {Math.round(h.score)}</Text>)}</PillCard>
        <PillCard><Text style={styles.item}>Export data</Text><Text style={styles.sub}>CSV/JSON placeholder</Text></PillCard>
        <PillCard><Text style={styles.item}>Future sync</Text><Text style={styles.sub}>Supabase/Firebase adapter placeholder enabled</Text></PillCard>
        <PillCard><Text style={styles.item}>Billing</Text><Text style={styles.sub}>Premium placeholder (RevenueCat integration later)</Text></PillCard>
        <PillCard><Text style={styles.item}>Widget section</Text><Text style={styles.sub}>Architected for dev-build widget extension later</Text></PillCard>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 42, fontWeight: '900', color: '#1A1B1F', letterSpacing: -1.2, marginBottom: 12 },
  item: { fontSize: 18, fontWeight: '800', color: '#20242C', marginBottom: 6 },
  sub: { color: '#666A72', marginBottom: 4 },
});
