import { Alert, Share } from 'react-native';

/** Opens the native share sheet with plain text. Never throws. */
export async function shareText(message: string, title?: string): Promise<void> {
  try {
    await Share.share({ message, title });
  } catch {
    Alert.alert('Sharing unavailable', 'Your device could not open the share sheet.');
  }
}
