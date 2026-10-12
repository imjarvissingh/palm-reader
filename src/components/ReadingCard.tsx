import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Card } from '@/components/Card';
import { Text } from '@/components/Text';
import { Row } from '@/components/ui';
import { traitLabel } from '@/features/palm/engine';
import type { PalmReport } from '@/features/palm/types';
import { formatLongDate } from '@/lib/date';
import { colors, radius } from '@/theme/tokens';

export function ReadingCard({ r, onDelete, onFavorite }: { r: PalmReport; onDelete: () => void; onFavorite: () => void }) {
  return (
    <Card onPress={() => router.push(`/reading/${r.id}`)} accessibilityLabel={`${r.hand} hand reading from ${formatLongDate(new Date(r.createdAt))}`} testID={`history-${r.id}`}>
      <Row>
        {r.photoUri ? (
          <Image source={{ uri: r.photoUri }} style={styles.thumb} accessibilityIgnoresInvertColors />
        ) : (
          <View style={[styles.thumb, styles.thumbEmpty]}>
            <Ionicons name="hand-left-outline" size={24} color={colors.gold} />
          </View>
        )}
        <View style={{ flex: 1, gap: 2 }}>
          <Text variant="subheading">{r.hand === 'left' ? 'Left' : 'Right'} hand</Text>
          <Text variant="caption" tone="muted">
            {formatLongDate(new Date(r.createdAt))}
          </Text>
          <Text variant="caption" tone="gold" numberOfLines={1}>
            {r.topTraits.map(traitLabel).join(' · ') || 'Few details recorded'}
          </Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel={r.favorite ? 'Remove from favourites' : 'Add to favourites'} onPress={onFavorite} style={styles.iconBtn}>
          <Ionicons name={r.favorite ? 'star' : 'star-outline'} size={20} color={colors.gold} />
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Delete reading" onPress={onDelete} style={styles.iconBtn} testID={`delete-${r.id}`}>
          <Ionicons name="trash-outline" size={20} color={colors.danger} />
        </Pressable>
      </Row>
    </Card>
  );
}

const styles = StyleSheet.create({
  thumb: { width: 52, height: 52, borderRadius: radius.md },
  thumbEmpty: { backgroundColor: 'rgba(232,199,122,0.1)', alignItems: 'center', justifyContent: 'center' },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
});
