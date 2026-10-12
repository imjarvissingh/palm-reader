import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { inputStyle } from '@/components/BirthDateFields';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Disclaimer, Eyebrow } from '@/components/ui';
import { drawCard, type TarotCard } from '@/features/astro/tarot';
import { colors, gradients, radius, spacing } from '@/theme/tokens';

const ANSWER_TONE = { Yes: 'success', No: 'danger', Maybe: 'gold' } as const;

export default function Tarot() {
  const [question, setQuestion] = useState('');
  const [card, setCard] = useState<TarotCard | null>(null);

  return (
    <Screen edgeTop={false} testID="tarot">
      <Text tone="muted" variant="bodySmall">
        Hold a yes-or-no question in mind, then draw one card from the 22 Major Arcana.
      </Text>
      <TextInput
        accessibilityLabel="Your question (optional)"
        value={question}
        onChangeText={(t) => setQuestion(t.slice(0, 120))}
        placeholder="Your question (optional)"
        placeholderTextColor={colors.textSubtle}
        style={inputStyle}
      />
      <Button testID="tarot-draw" label={card ? 'Draw again' : 'Draw a card'} onPress={() => setCard(drawCard())} />
      {card ? (
        <View style={styles.card} accessibilityLiveRegion="polite" accessible accessibilityLabel={`${card.name}. Answer: ${card.answer}. ${card.meaning}`}>
          <LinearGradient colors={gradients.hero} style={StyleSheet.absoluteFill} />
          <View style={styles.inner}>
            <Eyebrow>{`Major Arcana ${card.id}`}</Eyebrow>
            <Text variant="title" center>
              {card.name}
            </Text>
            <Text variant="display" tone={ANSWER_TONE[card.answer]} center>
              {card.answer}
            </Text>
            <Text center>{card.meaning}</Text>
            {question ? (
              <Text variant="caption" tone="muted" center>
                “{question}”
              </Text>
            ) : null}
          </View>
        </View>
      ) : null}
      <Disclaimer compact />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.xl, overflow: 'hidden', borderWidth: 1, borderColor: colors.gold },
  inner: { padding: spacing.xxl, gap: spacing.md, alignItems: 'center' },
});
