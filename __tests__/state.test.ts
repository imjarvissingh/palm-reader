import AsyncStorage from '@react-native-async-storage/async-storage';
import { generatePalmReport } from '@/features/palm/engine';
import { initialState, reducer } from '@/state/AppState';
import { DEFAULT_STATE, loadState, normalizeState, saveState, STORAGE_KEY } from '@/state/persist';
import { profileSign } from '@/state/selectors';

jest.mock('@/features/palm/photoStore', () => ({ deletePhoto: jest.fn(), deleteAllPhotos: jest.fn() }));

const reading = (id: string) => generatePalmReport({ id, createdAt: new Date(), hand: 'left', isDominant: null, answers: { hand_shape: 'fire' } });

describe('persistence', () => {
  beforeEach(() => AsyncStorage.clear());

  it('falls back to defaults for missing or corrupt data', async () => {
    expect(await loadState()).toEqual(DEFAULT_STATE);
    await AsyncStorage.setItem(STORAGE_KEY, '{not json');
    expect(await loadState()).toEqual(DEFAULT_STATE);
  });

  it('round-trips state', async () => {
    const s = { ...DEFAULT_STATE, profile: { name: 'Ana', birthDate: '1990-05-01', signId: null, onboarded: true }, readings: [reading('a')] };
    await saveState(s);
    expect(await loadState()).toEqual(s);
  });

  it('sanitises untrusted stored values', () => {
    const s = normalizeState({
      profile: { name: 'A\u0000na   Maria'.padEnd(80, 'x'), birthDate: '2023-02-30', signId: 'dragon', onboarded: 'yes' },
      favoriteSigns: ['leo', 'nope'],
      readings: [{ id: 1 }, reading('ok')],
      settings: { dailyReminder: true, reminderHour: 99 },
    });
    expect(s.profile.name.startsWith('Ana Maria')).toBe(true);
    expect(s.profile.name.length).toBeLessThanOrEqual(40);
    expect(s.profile.birthDate).toBeNull();
    expect(s.profile.signId).toBeNull();
    expect(s.profile.onboarded).toBe(false);
    expect(s.favoriteSigns).toEqual(['leo']);
    expect(s.readings.map((r) => r.id)).toEqual(['ok']);
    expect(s.settings).toEqual({ dailyReminder: true, reminderHour: 9 });
  });
});

describe('reducer', () => {
  const hydrated = { ...initialState, hydrated: true };

  it('adds, favourites, deletes and clears readings', () => {
    let s = reducer(hydrated, { type: 'addReading', reading: reading('a') });
    s = reducer(s, { type: 'addReading', reading: reading('b') });
    expect(s.readings.map((r) => r.id)).toEqual(['b', 'a']);
    s = reducer(s, { type: 'toggleReadingFavorite', id: 'a' });
    expect(s.readings.find((r) => r.id === 'a')?.favorite).toBe(true);
    s = reducer(s, { type: 'deleteReading', id: 'b' });
    expect(s.readings.map((r) => r.id)).toEqual(['a']);
    s = reducer(s, { type: 'clearReadings' });
    expect(s.readings).toEqual([]);
  });

  it('toggles favourite signs and resets everything', () => {
    let s = reducer(hydrated, { type: 'toggleFavoriteSign', signId: 'leo' });
    expect(s.favoriteSigns).toEqual(['leo']);
    s = reducer(s, { type: 'toggleFavoriteSign', signId: 'leo' });
    expect(s.favoriteSigns).toEqual([]);
    s = reducer(s, { type: 'updateProfile', profile: { name: 'Kim', onboarded: true } });
    expect(reducer(s, { type: 'reset' }).profile).toEqual(DEFAULT_STATE.profile);
  });

  it('derives the sign from birth date unless one was picked', () => {
    expect(profileSign({ name: '', birthDate: '1994-11-03', signId: null, onboarded: true })).toBe('scorpio');
    expect(profileSign({ name: '', birthDate: '1994-11-03', signId: 'libra', onboarded: true })).toBe('libra');
    expect(profileSign({ name: '', birthDate: null, signId: null, onboarded: true })).toBeNull();
  });
});
