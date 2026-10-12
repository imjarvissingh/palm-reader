import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Disclaimer, EmptyState, Eyebrow } from '@/components/ui';
import { getArticle } from '@/features/astro/learn';

export default function Article() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const a = getArticle(String(id));
  if (!a) {
    return (
      <Screen edgeTop={false}>
        <EmptyState icon="book-outline" title="Article not found" body="It may have moved." />
      </Screen>
    );
  }
  return (
    <Screen edgeTop={false}>
      <Stack.Screen options={{ title: '' }} />
      <Eyebrow>{`${a.topic} · ${a.minutes} min`}</Eyebrow>
      <Text variant="title" accessibilityRole="header">
        {a.title}
      </Text>
      {a.paragraphs.map((p) => (
        <Text key={p}>{p}</Text>
      ))}
      <Disclaimer compact />
    </Screen>
  );
}
