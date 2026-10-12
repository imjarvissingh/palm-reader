import { router } from 'expo-router';
import React from 'react';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Eyebrow, SectionHeader } from '@/components/ui';
import { ARTICLES } from '@/features/astro/learn';

export default function Learn() {
  return (
    <Screen edgeTop={false} testID="learn">
      {(['palmistry', 'astrology'] as const).map((topic) => (
        <React.Fragment key={topic}>
          <SectionHeader title={topic === 'palmistry' ? 'Palmistry' : 'Astrology'} />
          {ARTICLES.filter((a) => a.topic === topic).map((a) => (
            <Card key={a.id} onPress={() => router.push(`/learn/${a.id}`)} accessibilityLabel={`${a.title}, ${a.minutes} minute read`}>
              <Eyebrow>{`${a.minutes} min read`}</Eyebrow>
              <Text variant="subheading">{a.title}</Text>
              <Text variant="bodySmall" tone="muted" numberOfLines={2}>
                {a.paragraphs[0]}
              </Text>
            </Card>
          ))}
        </React.Fragment>
      ))}
    </Screen>
  );
}
