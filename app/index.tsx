import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { starterExercises } from '@/data/quotes';
import { db, initDb } from '@/lib/db';

const slides = ['Choose your core exercises', 'Set your primary goal', 'Configure reminders & theme', 'Pillar is ready'];

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    initDb();
    const done = db.getFirstSync<{ value: string }>('SELECT value FROM app_meta WHERE key = ?', ['onboarding_done'])?.value;
    if (done === 'true') router.replace('/(tabs)/today');
  }, []);

  const finish = () => {
    db.runSync('INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?)', ['onboarding_done', 'true']);
    router.replace('/(tabs)/today');
  };

  return (
    <View style={styles.screen}>
      <View style={styles.pillHeader}><Text style={styles.pillText}>PILLAR</Text></View>
      <Text style={styles.kicker}>Premium Daily Training</Text>
      <Text style={styles.title}>{slides[step]}</Text>
      <Text style={styles.detail}>
        {step === 0 && starterExercises.slice(0, 9).join(' • ')}
        {step === 1 && '50 push-ups/day • 30-day consistency • 1,000 monthly reps'}
        {step === 2 && '08:00 reminder • Warm Light theme • Weekly progress check'}
        {step === 3 && 'Luxurious tracking for reps, sets, streaks, calendar score, and media timeline.'}
      </Text>
      <Pressable onPress={() => (step === slides.length - 1 ? finish() : setStep((s) => s + 1))} style={styles.cta}>
        <Text style={styles.ctaText}>{step === slides.length - 1 ? 'Enter Pillar' : 'Continue'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F3F1EC', padding: 24, justifyContent: 'center' },
  pillHeader: { alignSelf: 'center', backgroundColor: '#1A1B1F', borderRadius: 999, paddingVertical: 8, paddingHorizontal: 18, marginBottom: 18 },
  pillText: { color: '#fff', fontWeight: '800', letterSpacing: 2 },
  kicker: { textTransform: 'uppercase', letterSpacing: 1.2, color: '#6B6D73', fontSize: 12, marginBottom: 10 },
  title: { fontSize: 40, color: '#1A1B1F', fontWeight: '800', lineHeight: 44, letterSpacing: -1.2, marginBottom: 16 },
  detail: { color: '#2A2D33', fontSize: 16, lineHeight: 24 },
  cta: { marginTop: 36, backgroundColor: '#1A1B1F', borderRadius: 20, paddingVertical: 16, alignItems: 'center' },
  ctaText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
