import { useMemo, useState } from 'react';
import { Animated, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '@/constants/theme';
import { PillCard, PremiumButton, Screen } from '@/components/ui';
import { localBackend } from '@/services/localBackend';
import { useAppState } from '@/lib/useAppState';

export default function TodayScreen() {
  const { exercises, todayEntries, streak, totalVolume, score, scoreBucket, quoteIndex, logWorkout } = useAppState();
  const quotes = localBackend.listQuotes();
  const quote = quotes.length ? quotes[quoteIndex % quotes.length] : { text: 'Show up daily.', author: 'Pillar' };
  const [reps, setReps] = useState('20');
  const [sets, setSets] = useState('3');
  const fade = useMemo(() => new Animated.Value(1), [quoteIndex]);
  Animated.sequence([Animated.timing(fade, { toValue: 0.5, duration: 250, useNativeDriver: true }), Animated.timing(fade, { toValue: 1, duration: 250, useNativeDriver: true })]).start();

  return (
    <Screen>
      <Animated.View style={[styles.quotePill, { opacity: fade }]}>
        <Text style={styles.quoteText}>{quote.text}</Text>
        <Text style={styles.quoteAuthor}>— {quote.author}</Text>
      </Animated.View>
      <Text style={styles.title}>Today</Text>
      <Text style={styles.sub}>Streak {streak} days • Volume {totalVolume} • Score {score}</Text>
      <PillCard>
        <Text style={styles.cardLabel}>Quick log</Text>
        <View style={styles.row}><TextInput value={reps} onChangeText={setReps} keyboardType="numeric" style={styles.input} /><TextInput value={sets} onChangeText={setSets} keyboardType="numeric" style={styles.input} /></View>
      </PillCard>
      <FlatList
        data={exercises}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <PillCard>
            <Text style={styles.exercise}>{item.name}</Text>
            <PremiumButton label={`Log ${reps} x ${sets}`} onPress={() => logWorkout(item.id, Number(reps), Number(sets), item.type === 'time' ? Number(reps) * 10 : 0)} />
          </PillCard>
        )}
        ListFooterComponent={<Text style={[styles.sub, { color: scoreBucket === 'green' ? colors.green : scoreBucket === 'yellow' ? colors.yellow : colors.red }]}>Pace vs last week: {scoreBucket.toUpperCase()}</Text>}
      />
      <Text style={styles.sub}>Entries today: {todayEntries.length}</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  quotePill: { backgroundColor: '#1A1B1F', borderRadius: 28, padding: 16, marginBottom: 18 },
  quoteText: { color: '#F7F6F2', fontSize: 15, lineHeight: 21, fontWeight: '600' },
  quoteAuthor: { color: '#B9BDC7', marginTop: 6, fontSize: 12 },
  title: { fontSize: 44, fontWeight: '900', letterSpacing: -1.4, color: '#1A1B1F' },
  sub: { color: '#666A72', marginTop: 4, marginBottom: 12 },
  cardLabel: { fontSize: 17, fontWeight: '700', marginBottom: 8, color: '#252831' },
  row: { flexDirection: 'row', gap: 10 },
  input: { flex: 1, backgroundColor: '#F0ECE3', borderRadius: 14, padding: 12, fontWeight: '700' },
  exercise: { fontSize: 18, marginBottom: 10, fontWeight: '700', color: '#22262D' },
});
