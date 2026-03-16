import { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/constants/theme';

export const Screen = ({ children }: PropsWithChildren) => <View style={styles.screen}>{children}</View>;

export const PillCard = ({ children }: PropsWithChildren) => <View style={styles.card}>{children}</View>;

export const H1 = ({ children }: PropsWithChildren) => <Text style={styles.h1}>{children}</Text>;

export const Muted = ({ children }: PropsWithChildren) => <Text style={styles.muted}>{children}</Text>;

export const PremiumButton = ({ label, onPress }: { label: string; onPress: () => void }) => (
  <Pressable onPress={onPress} style={styles.button}>
    <Text style={styles.buttonText}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing.md, paddingTop: spacing.xl },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    marginBottom: spacing.md,
  },
  h1: { color: colors.charcoal, fontSize: 38, fontWeight: '800', letterSpacing: -1 },
  muted: { color: colors.muted, fontSize: 14 },
  button: { backgroundColor: colors.graphite, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 16, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
