import { Directory, File, Paths } from 'expo-file-system';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { Platform } from 'react-native';
import { assessPhoto, type PhotoAssessment } from './photoQuality';

/**
 * Palm photos are stored only in the app's private documents folder on the
 * device. Nothing here uploads anything.
 */

const DIR_NAME = 'palms';

function palmsDir(): Directory {
  return new Directory(Paths.document, DIR_NAME);
}

export interface PreparedPhoto {
  uri: string;
  width: number;
  height: number;
  assessment: PhotoAssessment;
}

/** Downscales the photo, measures it for quality hints, and returns a temporary URI. */
export async function preparePhoto(sourceUri: string): Promise<PreparedPhoto> {
  const ctx = ImageManipulator.manipulate(sourceUri);
  ctx.resize({ width: 1200 });
  const image = await ctx.renderAsync();
  const saved = await image.saveAsync({ format: SaveFormat.JPEG, compress: 0.82 });

  let thumbLength: number | undefined;
  try {
    const thumbCtx = ImageManipulator.manipulate(saved.uri);
    thumbCtx.resize({ width: 64 });
    const thumb = await (await thumbCtx.renderAsync()).saveAsync({ format: SaveFormat.JPEG, compress: 0.7, base64: true });
    thumbLength = thumb.base64?.length;
  } catch {
    thumbLength = undefined;
  }

  return {
    uri: saved.uri,
    width: saved.width,
    height: saved.height,
    assessment: assessPhoto({ width: saved.width, height: saved.height, thumbnailBase64Length: thumbLength }),
  };
}

/** Copies a prepared photo into private storage for a reading. Returns the stored URI. */
export async function persistPhoto(tempUri: string, readingId: string): Promise<string> {
  if (Platform.OS === 'web') return tempUri; // Web preview has no private file system.
  const dir = palmsDir();
  if (!dir.exists) dir.create({ intermediates: true });
  const dest = new File(dir, `${readingId}.jpg`);
  if (dest.exists) dest.delete();
  await new File(tempUri).copy(dest);
  return dest.uri;
}

export function deletePhoto(uri: string | undefined): void {
  if (!uri || Platform.OS === 'web') return;
  try {
    const f = new File(uri);
    // Only ever delete files inside our own folder.
    if (f.uri.startsWith(palmsDir().uri) && f.exists) f.delete();
  } catch {
    // Already gone; nothing to do.
  }
}

export function deleteAllPhotos(): void {
  if (Platform.OS === 'web') return;
  try {
    const dir = palmsDir();
    if (dir.exists) dir.delete();
  } catch {
    // Ignore: nothing stored yet.
  }
}
