import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import type { ZodiacId } from '@/features/horoscope/zodiac';
import type { PalmReport } from '@/features/palm/types';
import { deleteAllPhotos, deletePhoto } from '@/features/palm/photoStore';
import {
  clearState, DEFAULT_STATE, loadState, MAX_READINGS, sanitizeName, saveState,
  type PersistedState, type Profile, type Settings,
} from './persist';

export interface AppState extends PersistedState {
  hydrated: boolean;
}

export type Action =
  | { type: 'hydrate'; state: PersistedState }
  | { type: 'updateProfile'; profile: Partial<Profile> }
  | { type: 'toggleFavoriteSign'; signId: ZodiacId }
  | { type: 'addReading'; reading: PalmReport }
  | { type: 'deleteReading'; id: string }
  | { type: 'toggleReadingFavorite'; id: string }
  | { type: 'clearReadings' }
  | { type: 'updateSettings'; settings: Partial<Settings> }
  | { type: 'reset' };

export const initialState: AppState = { ...DEFAULT_STATE, hydrated: false };

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'hydrate':
      return { ...action.state, hydrated: true };
    case 'updateProfile': {
      const next = { ...state.profile, ...action.profile };
      return { ...state, profile: { ...next, name: sanitizeName(next.name) } };
    }
    case 'toggleFavoriteSign': {
      const has = state.favoriteSigns.includes(action.signId);
      return {
        ...state,
        favoriteSigns: has ? state.favoriteSigns.filter((s) => s !== action.signId) : [...state.favoriteSigns, action.signId],
      };
    }
    case 'addReading':
      return { ...state, readings: [action.reading, ...state.readings.filter((r) => r.id !== action.reading.id)].slice(0, MAX_READINGS) };
    case 'deleteReading':
      return { ...state, readings: state.readings.filter((r) => r.id !== action.id) };
    case 'toggleReadingFavorite':
      return { ...state, readings: state.readings.map((r) => (r.id === action.id ? { ...r, favorite: !r.favorite } : r)) };
    case 'clearReadings':
      return { ...state, readings: [] };
    case 'updateSettings':
      return { ...state, settings: { ...state.settings, ...action.settings } };
    case 'reset':
      return { ...DEFAULT_STATE, hydrated: true };
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  /** Deletes a reading and its locally stored photo. */
  deleteReading: (id: string) => void;
  /** Deletes all readings and every stored palm photo. */
  clearReadings: () => void;
  /** Erases every piece of data the app has stored. */
  eraseAllData: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppStateProvider({ children, initial }: { children: React.ReactNode; initial?: PersistedState }) {
  const [state, dispatch] = useReducer(reducer, initial ? { ...initial, hydrated: true } : initialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if (initial) return;
    let alive = true;
    loadState().then((s) => alive && dispatch({ type: 'hydrate', state: s }));
    return () => {
      alive = false;
    };
  }, [initial]);

  useEffect(() => {
    if (!state.hydrated) return;
    const { hydrated: _h, ...persisted } = state;
    void saveState(persisted);
  }, [state]);

  const deleteReading = useCallback((id: string) => {
    deletePhoto(stateRef.current.readings.find((r) => r.id === id)?.photoUri);
    dispatch({ type: 'deleteReading', id });
  }, []);

  const clearReadings = useCallback(() => {
    deleteAllPhotos();
    dispatch({ type: 'clearReadings' });
  }, []);

  const eraseAllData = useCallback(async () => {
    deleteAllPhotos();
    await clearState();
    dispatch({ type: 'reset' });
  }, []);

  const value = useMemo(() => ({ state, dispatch, deleteReading, clearReadings, eraseAllData }), [state, deleteReading, clearReadings, eraseAllData]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppStateProvider');
  return ctx;
}
