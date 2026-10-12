import { router } from 'expo-router';
import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { ReadingCard } from '@/components/ReadingCard';
import { Screen } from '@/components/Screen';
import { Chip, EmptyState, Row } from '@/components/ui';
import { confirmDestructive } from '@/lib/confirm';
import { useApp } from '@/state/AppState';
import { spacing } from '@/theme/tokens';

export default function History() {
  const { state, dispatch, deleteReading, clearReadings } = useApp();
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  const list = filter === 'all' ? state.readings : state.readings.filter((r) => r.favorite);

  const del = async (id: string) => {
    if (await confirmDestructive('Delete this reading?', 'The reading and its palm photo will be removed from this device.')) deleteReading(id);
  };
  const clearAll = async () => {
    if (await confirmDestructive('Clear all readings?', 'Every reading and stored palm photo will be permanently deleted.', 'Clear all')) clearReadings();
  };

  return (
    <Screen edgeTop={false} testID="history">
      <Row gap={spacing.sm}>
        <Chip label={`All (${state.readings.length})`} selected={filter === 'all'} onPress={() => setFilter('all')} />
        <Chip label="Favourites" selected={filter === 'favorites'} onPress={() => setFilter('favorites')} />
      </Row>
      {list.length === 0 ? (
        <EmptyState
          icon={filter === 'all' ? 'hand-left-outline' : 'star-outline'}
          title={filter === 'all' ? 'No readings yet' : 'No favourites yet'}
          body={filter === 'all' ? 'Your palm readings are saved here on this device.' : 'Tap the star on a reading to keep it here.'}
          action={filter === 'all' ? <Button label="Start a palm reading" onPress={() => router.push('/palm/start')} /> : undefined}
        />
      ) : (
        list.map((r) => <ReadingCard key={r.id} r={r} onDelete={() => void del(r.id)} onFavorite={() => dispatch({ type: 'toggleReadingFavorite', id: r.id })} />)
      )}
      {state.readings.length > 0 ? <Button variant="danger" label="Clear all readings" onPress={clearAll} testID="clear-history" /> : null}
    </Screen>
  );
}
