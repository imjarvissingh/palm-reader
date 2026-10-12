# Lunara — Palm Readings & Daily Stars

A cross-platform (iOS + Android) palmistry and horoscope app built with Expo and React Native.
Guided palm readings of all seven major lines, daily/weekly/monthly horoscopes for all twelve
signs, compatibility, numerology, a moon calendar, dream meanings, Vedic and Chinese zodiac
basics, and yes/no tarot. No account, no ads, no server: everything stays on the device.

> Palmistry and astrology are presented as **entertainment and self-reflection**, not science
> or advice. The app never claims to analyse a palm photo: readings come from the user's answers.

## What it does

| Area | Features |
| --- | --- |
| Onboarding | 4 steps: brand intro, features, optional name + birth date (sign auto-calculated, cusp aware, or pick manually), privacy summary. Guest only. |
| Palm reading | Choose hand and dominance → optional photo (camera with palm-shaped guide, or library, or reuse last photo) → preview with size/clarity checks → 8-step questionnaire with line diagrams → report |
| Report | Summary + top traits, 7 expandable lines (Life, Heart, Head, Fate, Success, Marriage, Travel) with strength bars, 4 themes (personality, relationships, career, growth), illustrative overlay on the photo, share, favourite, delete |
| Horoscope | Today / Tomorrow / Week / Month for 12 signs; love, career, growth, well-being; mood, lucky number/colour, best match; real moon phase on daily readings; favourite signs; share |
| Explore | Zodiac & love compatibility, numerology (life path, expression, personal year), moon calendar, 40 dream symbols, Vedic sidereal Sun + nakshatra, Chinese zodiac, yes/no tarot, 8 learning articles, sign pages |
| Me | Edit details, history (favourites filter), daily local reminder, privacy, terms, clear history, erase all data |

## Tech stack

Expo SDK 57 · React Native 0.86 · React 19.2 · TypeScript strict · Expo Router (typed routes) ·
React Context + reducer · AsyncStorage · expo-file-system · expo-camera · expo-image-picker ·
expo-image-manipulator · react-native-svg · expo-notifications (local only) · Jest + React Native
Testing Library · ESLint (eslint-config-expo) · GitHub Actions · EAS Build.

Architecture, dependency graph and data model: [`replica/architecture.md`](replica/architecture.md).

## Prerequisites

- Node.js 20+ (CI uses 22) and npm
- For a phone: **Expo Go** for SDK 57 (every native module Lunara uses ships in Expo Go), or a
  development build (below). Permission strings and icons from `app.json` only apply to real builds.
- For local native builds: Xcode 16+ (macOS) and/or Android Studio with an emulator
- For cloud builds: an Expo account and `npx eas-cli@latest`

## Install and run

```bash
git clone https://github.com/imjarvissingh/palm-reader.git
cd palm-reader
npm ci
npx expo start            # press i (iOS simulator), a (Android emulator), or scan the QR code
```

### Android

```bash
npx expo run:android                          # local dev build on an emulator/device
# or in the cloud:
npx eas-cli@latest build --profile development --platform android
npx eas-cli@latest build --profile preview --platform android     # installable APK
```

### iPhone

```bash
npx expo run:ios                              # local dev build on the iOS simulator (macOS)
# or in the cloud:
npx eas-cli@latest build --profile development --platform ios     # simulator build
npx eas-cli@latest build --profile production --platform ios      # needs Apple Developer account
```

First EAS run: `npx eas-cli@latest login` then `npx eas-cli@latest init` (writes `extra.eas.projectId`
into `app.json`). Bundle identifier / package: `com.lunara.palmstars` — change it before publishing.

## Environment configuration

None required. Optional settings are in [`.env.example`](.env.example) (copy to `.env`):

- `EXPO_PUBLIC_PALM_ANALYSIS_URL` — HTTPS endpoint of *your own* palm-analysis backend. When set,
  the questionnaire offers to upload the photo **after an explicit consent prompt** to pre-fill
  answers the user then reviews. Model/API keys must live on that server; `EXPO_PUBLIC_*` values are
  bundled into the app. Contract: [`src/features/palm/analyzer.ts`](src/features/palm/analyzer.ts).

## Testing and checks

```bash
npm run typecheck     # tsc --noEmit (strict)
npm run lint          # expo lint
npm test              # 79 Jest + RNTL tests
npm run export:check  # Hermes bundles for Android and iOS
npm run validate      # typecheck + lint + tests
```

CI (`.github/workflows/ci.yml`) runs typecheck, lint, tests, the Android/iOS bundle export and
`npm audit` (fails on critical) on every push and pull request. Details: [`replica/test-report.md`](replica/test-report.md).

## Build profiles (`eas.json`)

| profile | output |
| --- | --- |
| development | dev client; iOS simulator build; Android internal |
| preview | internal distribution; Android **APK** |
| production | store builds; Android **AAB**, auto-incremented build numbers |

## Features requiring external services (not included)

- **In-app purchases.** None configured; every feature is free. `src/features/premium/entitlements.ts`
  always returns not-premium and documents where a store-verified entitlement (StoreKit / Play
  Billing via RevenueCat or expo-iap, validated server-side) must plug in. No purchase is simulated.
- **Computer-vision palm analysis.** Not bundled. Optional backend boundary described above.
- **AI astrology chat, Panchang, Moon sign/ascendant.** Need a hosted model or an ephemeris plus birth
  time and place; out of scope.
- **Push notifications.** Only an on-device daily reminder is used; no push token is requested.

## Security and privacy

- No accounts, analytics, ads or network calls in the default build.
- Personal data (name, birth date, readings, settings) is stored in AsyncStorage on the device and
  validated when loaded. Palm photos are downscaled and kept in the app's private documents folder.
- Delete one reading (removes its photo), clear history, or erase all data from the Me tab.
- Permissions are requested only when needed: camera when taking a palm photo, notifications when
  turning on the reminder. Microphone and location are explicitly blocked on Android.
- No secrets in the repo; `.env*` files are git-ignored.
- `npm audit`: remaining high/moderate advisories are in Expo CLI, Metro and Jest tooling with no
  patched upstream release (node-forge, braces, sprintf-js, uuid, decode-uri-component); see
  [`replica/security.md`](replica/security.md).
- Privacy and terms screens: `src/app/legal/`.

## Project layout

```
src/app/          routes (Expo Router): tabs, onboarding, palm flow, reading, tools, legal
src/components/   UI primitives (Screen, Card, Button, PalmDiagram, …)
src/features/     pure logic: palm engine, horoscope generator, astro tools
src/state/        app state, persistence, palm draft
src/theme/        design tokens
__tests__/        Jest + RNTL tests
replica/          replica-skill outputs: recon, features matrix, parity, architecture, brand
.claude/skills/   replica-skill pack (MIT), installed project-locally
scripts/          icon generator
```

## Credits

Built using the [replica-skill](https://github.com/Jakeschincariol/replica-skill) workflow
(MIT, upstream commit `77c9436`). Cormorant Garamond font: SIL Open Font License. Icons: Ionicons (MIT).
