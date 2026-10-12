# Architecture

**Stack:** Expo SDK 57 · React Native 0.86 · React 19.2 · TypeScript (strict, `noUncheckedIndexedAccess`) · Expo Router (file-based, typed routes) · React Context + reducer · AsyncStorage · expo-file-system (private photo storage) · expo-camera / expo-image-picker / expo-image-manipulator · react-native-svg · expo-notifications (local only) · Jest + React Native Testing Library · EAS Build.

**No backend.** Everything is computed on the device; nothing is uploaded. The only network boundary is the optional, consent-gated palm-analysis endpoint (`src/features/palm/analyzer.ts`), disabled unless `EXPO_PUBLIC_PALM_ANALYSIS_URL` is set to an HTTPS URL.

## Dependency graph

```
src/app (routes, UI only)
 ├─ (tabs)/index, horoscope, palm, explore, me
 ├─ onboarding, edit-profile, history, premium, legal/*, learn/*, sign/[id]
 ├─ palm/start → palm/capture → palm/questions → palm/generating → reading/[id]
 └─ tools/compatibility, numerology, moon, dreams, vedic, chinese, tarot
        │ uses
        ▼
src/components (Screen, Card, Button, Text, ui.tsx, PalmDiagram, BirthDateFields, ReadingCard)
        │ uses                         ▲
        ▼                              │ tokens only
src/theme/tokens.ts  ◄─────────────────┘

src/state
 ├─ AppState.tsx (reducer, provider; persists via persist.ts; deletes photos via palm/photoStore)
 ├─ persist.ts   (AsyncStorage + validation of stored data)
 ├─ palmDraft.tsx (in-memory draft for the palm flow)
 └─ selectors.ts (profileSign, greeting)

src/features (pure logic, no React)
 ├─ palm/       types ← questions ← engine ; photoQuality ← photoStore ; analyzer (boundary)
 ├─ horoscope/  zodiac ← content ← generator  (generator → astro/moon, astro/compatibility)
 ├─ astro/      moon, compatibility, numerology, vedic, chinese, tarot, dreams, learn, affirmations
 ├─ notifications/reminder.ts
 └─ premium/entitlements.ts (always free; store-verified entitlement plugs in here)

src/lib (date, random, share, confirm) ← used by features and app
```

Rules kept: routes never contain business logic; `features/*` never import React or `app/*`; no cycles (features → lib only, horoscope ↔ astro is one-way: generator imports moon/compatibility, compatibility imports zodiac).

## Data model (AsyncStorage key `lunara.state.v1`)

```
Profile   { name ≤40, birthDate YYYY-MM-DD|null, signId|null, onboarded }
Settings  { dailyReminder, reminderHour 0–23 }
favoriteSigns ZodiacId[]
readings  PalmReport[] (≤100) { id, createdAt, hand, isDominant, answers, lines[7], themes[4], topTraits, summary, photoUri?, favorite? }
```

Photos: `Paths.document/palms/<readingId>.jpg`, downscaled to 1200px. Deleted with their reading, on clear-history and on erase-all.

## Parts that bite

- Zodiac cusps: conventional ranges plus an `isCusp` flag and a manual override.
- Moon phase: mean synodic month (±1 day), disclosed in UI.
- Vedic: Lahiri ayanamsa approximation; Moon sign/Panchang deliberately not computed.
- Camera: permission undetermined / denied / blocked / unavailable all handled.
- Purchases: none. Entitlement is never derived from a local flag.
