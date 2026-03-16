import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text } from 'react-native';
import { PillCard, PremiumButton, Screen } from '@/components/ui';
import { localBackend } from '@/services/localBackend';

export default function MediaScreen() {
  const [items, setItems] = useState(localBackend.listMedia());

  const pick = async (type: 'photo' | 'video') => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: type === 'photo' ? ['images'] : ['videos'],
      quality: 0.8,
    });
    if (!res.canceled) {
      const asset = res.assets[0];
      localBackend.addMedia({ date: new Date().toISOString().slice(0, 10), type, uri: asset.uri, thumbnail_uri: asset.uri, note: '' });
      setItems(localBackend.listMedia());
    }
  };

  return (
    <Screen>
      <Text style={styles.title}>Media</Text>
      <PillCard>
        <PremiumButton label="Import Progress Photo" onPress={() => pick('photo')} />
        <Text style={styles.gap} />
        <PremiumButton label="Import Form Video" onPress={() => pick('video')} />
      </PillCard>
      <ScrollView>
        {items.map((m) => (
          <PillCard key={m.id}>
            <Text style={styles.meta}>{m.date} • {m.type}</Text>
            <Image source={{ uri: m.thumbnail_uri }} style={styles.image} />
          </PillCard>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 42, fontWeight: '900', color: '#1A1B1F', letterSpacing: -1.2, marginBottom: 12 },
  gap: { height: 10 },
  meta: { fontWeight: '700', color: '#333843', marginBottom: 10 },
  image: { width: '100%', height: 180, borderRadius: 16, backgroundColor: '#E5E0D6' },
});
