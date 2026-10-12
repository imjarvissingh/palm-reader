import AsyncStorage from '@react-native-async-storage/async-storage';
import { isZodiacId, type ZodiacId } from '@/features/horoscope/zodiac';
import type { PalmReport } from '@/features/palm/types';
import { parseISODate } from '@/lib/date';

export const STORAGE_KEY = 'lunara.state.v1';

export interface Profile {
  name: string;
  /** YYYY-MM-DD or null if not shared. */
  birthDate: string | null;
  signId: ZodiacId | null;
  onboarded: boolean;
}

export interface Settings {
  dailyReminder: boolean;
  reminderHour: number;
}

export interface PersistedState {
  profile: Profile;
  favoriteSigns: ZodiacId[];
  readings: PalmReport[];
  settings: Settings;
}

export const DEFAULT_STATE: PersistedState = {
  profile: { name: '', birthDate: null, signId: null, onboarded: false },
  favoriteSigns: [],
  readings: [],
  settings: { dailyReminder: false, reminderHour: 9 },
};

const MAX_NAME = 40;
export const MAX_READINGS = 100;

export function sanitizeName(name: unknown): string {
  if (typeof name !== 'string') return '';
  // Strip control characters and collapse whitespace.
  // eslint-disable-next-line no-control-regex
  return name.replace(/[\u0000-\u001f\u007f]/g, '').replace(/\s+/g, ' ').trim().slice(0, MAX_NAME);
}

function isReport(r: unknown): r is PalmReport {
  if (!r || typeof r !== 'object') return false;
  const x = r as Partial<PalmReport>;
  return typeof x.id === 'string' && typeof x.createdAt === 'string' && Array.isArray(x.lines) && typeof x.summary === 'string' && (x.hand === 'left' || x.hand === 'right');
}

/** Validates data loaded from storage; anything malformed falls back to defaults. */
export function normalizeState(raw: unknown): PersistedState {
  if (!raw || typeof raw !== 'object') return DEFAULT_STATE;
  const r = raw as Partial<PersistedState>;
  const p: Partial<Profile> = r.profile ?? {};
  const birth = typeof p.birthDate === 'string' && parseISODate(p.birthDate) ? p.birthDate : null;
  const hour = r.settings?.reminderHour;
  return {
    profile: {
      name: sanitizeName(p.name),
      birthDate: birth,
      signId: isZodiacId(p.signId) ? p.signId : null,
      onboarded: p.onboarded === true,
    },
    favoriteSigns: Array.isArray(r.favoriteSigns) ? r.favoriteSigns.filter(isZodiacId) : [],
    readings: Array.isArray(r.readings) ? r.readings.filter(isReport).slice(0, MAX_READINGS) : [],
    settings: {
      dailyReminder: r.settings?.dailyReminder === true,
      reminderHour: typeof hour === 'number' && Number.isInteger(hour) && hour >= 0 && hour <= 23 ? hour : 9,
    },
  };
}

export async function loadState(): Promise<PersistedState> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? normalizeState(JSON.parse(json)) : DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
  }
}

export async function saveState(state: PersistedState): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable: keep running in memory.
  }
}

export async function clearState(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
