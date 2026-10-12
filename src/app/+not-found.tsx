import { router } from 'expo-router';
import React from 'react';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { EmptyState } from '@/components/ui';

export default function NotFound() {
  return (
    <Screen testID="not-found" edgeTop={false}>
      <EmptyState
        icon="compass-outline"
        title="This page isn't in the stars"
        body="The link may be old or mistyped."
        action={<Button label="Go home" onPress={() => router.replace('/')} />}
      />
    </Screen>
  );
}
