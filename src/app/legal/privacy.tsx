import React from 'react';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Eyebrow } from '@/components/ui';

const SECTIONS: { title: string; body: string }[] = [
  { title: 'Summary', body: 'Lunara works without an account. Everything you enter — your name, birth date, sign, palm answers, palm photos, favourites and settings — is stored only on this device. Lunara has no server and does not collect analytics.' },
  { title: 'Palm photos', body: 'Photos are optional. When you take or choose one, a resized copy is saved in the app’s private storage on this device and shown beside your report for reference. Lunara does not analyse the photo. It is never uploaded unless a palm-analysis service has been configured for your build AND you tap “Pre-fill answers from my photo” and confirm the upload prompt.' },
  { title: 'Permissions', body: 'Camera: requested only when you choose to take a palm photo. Photo library: the system picker gives Lunara only the image you select. Notifications: requested only if you turn on the daily reminder, which is scheduled locally on your device.' },
  { title: 'Birth date', body: 'Used to calculate your sun sign, numerology numbers and sidereal Sun position on the device. It is optional; you can pick a sign instead.' },
  { title: 'Sharing', body: 'When you tap Share, Lunara passes text to your device’s share sheet. Nothing is shared automatically.' },
  { title: 'Deleting your data', body: 'Delete a single reading (and its photo) from the reading screen or history. Clear all readings, or erase everything, from Me → Privacy & data. Uninstalling the app also removes all of its data.' },
  { title: 'Children', body: 'Lunara is a general-audience entertainment app and does not knowingly collect personal information from anyone.' },
];

export default function Privacy() {
  return (
    <Screen edgeTop={false} testID="privacy">
      {SECTIONS.map((s) => (
        <React.Fragment key={s.title}>
          <Eyebrow>{s.title}</Eyebrow>
          <Text variant="bodySmall">{s.body}</Text>
        </React.Fragment>
      ))}
    </Screen>
  );
}
