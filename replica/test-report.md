# Test report

## Automated (Jest + React Native Testing Library) — `npm test`

79 tests in 4 suites (`__tests__/`), all passing:

- **logic.test.ts** — zodiac boundaries for all 12 signs incl. Capricorn year wrap, Feb 29, cusp flag, every day of a leap year; date parsing/validation (impossible dates, future dates, short years); ISO week keys; horoscope determinism, variation across signs/dates, completeness for 12 signs × 4 periods, no unfilled placeholders; compatibility symmetry and bounds; numerology incl. master numbers and accents; moon phases vs. known 2024 new/full moons; Vedic rashi; dreams search; Chinese zodiac incl. Lunar New Year caveat; tarot; affirmations.
- **palm.test.ts** — 7 lines + 4 themes; different palms → different readings; strength ordering; name/sign personalisation; all-skipped and "not sure" handling; share text excludes photo path; conditional questions; stale-answer sanitising; photo quality checks; analysis endpoint must be HTTPS; untrusted server output filtered; server errors surfaced.
- **state.test.ts** — AsyncStorage round trip; corrupt JSON fallback; sanitising untrusted stored values; reducer add/favourite/delete/clear/reset; sign derivation.
- **screens.test.tsx** — launch redirect (first run vs returning); onboarding validation + sign + completion; camera permission blocked and askable; history empty state, delete one, clear all, cancelled delete; report not-found and seven-line render; horoscope period/sign switching.

## Click-through (Playwright, web export, 390×844)

Onboarding (name + DOB) → Home → Start reading → right hand → no photo → all 8 questionnaire steps → report → history → horoscope → compatibility → moon → numerology → Vedic → dreams → explore → me → sign → palm tab → learn → privacy → Plus → reload (state persisted, onboarding skipped). **0 console errors.**

Not covered automatically: real camera capture and photo library on devices, notifications, Android hardware back, haptics. These need a device or simulator (see README).

## Bugs found and fixed during the build

| id | sev | bug | fix |
| --- | --- | --- | --- |
| B1 | S3 | Decorative stars rendered between letters and read like typos | Stars confined to the side margins |
| B2 | S3 | Web tab bar clipped labels | Web-only tab bar height |
| B3 | S2 | Lint: refs read during render (could skip updates) | Moved ref writes into effects; Animated value via state |
| B4 | S2 | `expo-asset` missing as a direct dependency (icon fonts) | Installed with `expo install` |

Open S1/S2 bugs: none known.
