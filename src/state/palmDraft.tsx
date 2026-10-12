import React, { createContext, useContext, useMemo, useState } from 'react';
import type { Hand, PalmAnswers } from '@/features/palm/types';

/** In-memory state for a palm reading in progress. Not persisted. */
export interface PalmDraft {
  hand: Hand | null;
  isDominant: boolean | null;
  /** Temporary URI of the prepared photo, if the user added one. */
  photoUri: string | null;
  photoWarnings: string[];
  answers: PalmAnswers;
  photoAssisted: boolean;
}

export const EMPTY_DRAFT: PalmDraft = {
  hand: null, isDominant: null, photoUri: null, photoWarnings: [], answers: {}, photoAssisted: false,
};

interface DraftContextValue {
  draft: PalmDraft;
  update: (patch: Partial<PalmDraft>) => void;
  reset: () => void;
}

const DraftContext = createContext<DraftContextValue | null>(null);

export function PalmDraftProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<PalmDraft>(EMPTY_DRAFT);
  const value = useMemo<DraftContextValue>(
    () => ({
      draft,
      update: (patch) => setDraft((d) => ({ ...d, ...patch })),
      reset: () => setDraft(EMPTY_DRAFT),
    }),
    [draft],
  );
  return <DraftContext.Provider value={value}>{children}</DraftContext.Provider>;
}

export function usePalmDraft(): DraftContextValue {
  const ctx = useContext(DraftContext);
  if (!ctx) throw new Error('usePalmDraft must be used inside PalmDraftProvider');
  return ctx;
}
