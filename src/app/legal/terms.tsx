import React from 'react';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Eyebrow } from '@/components/ui';

const SECTIONS: { title: string; body: string }[] = [
  { title: 'Entertainment only', body: 'Palm readings, horoscopes, compatibility scores, numerology, dream meanings and Vedic information in Lunara are provided for entertainment and self-reflection. Palmistry and astrology are not sciences and have no proven ability to predict events or describe personality.' },
  { title: 'Not professional advice', body: 'Nothing in Lunara is medical, psychological, financial, legal or relationship advice. Palm lines say nothing about your health or lifespan. If you are worried about your health or wellbeing, please talk to a qualified professional.' },
  { title: 'How readings are made', body: 'Palm reports are written from your answers to the guided questions using fixed interpretation rules. Horoscopes are original text generated from your sign and the date, combined with the calculated moon phase. No artificial intelligence or astronomical ephemeris is used unless the app explicitly says so.' },
  { title: 'Purchases', body: 'This version of Lunara has no paid features and no in-app purchases.' },
  { title: 'Your content', body: 'Your readings belong to you. You are responsible for anything you choose to share from the app.' },
];

export default function Terms() {
  return (
    <Screen edgeTop={false} testID="terms">
      {SECTIONS.map((s) => (
        <React.Fragment key={s.title}>
          <Eyebrow>{s.title}</Eyebrow>
          <Text variant="bodySmall">{s.body}</Text>
        </React.Fragment>
      ))}
    </Screen>
  );
}
