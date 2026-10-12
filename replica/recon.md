# Recon map: "Palm Reading & Daily Horoscope" (iOS)

Scope: palm reading core loop + horoscope + recent astrology add-ons
For: an original, privacy-first iOS + Android app (Lunara)
Date: 2026-10-12

## Sources

| # | source | URL | notes |
| --- | --- | --- | --- |
| 1 | App Store listing (IN) | https://apps.apple.com/in/app/palm-reading-daily-horoscope/id490879483 | Description, version history 9.5–11.9, IAP list, 4 visible reviews. Read once via a web fetch. |
| 2 | iTunes lookup / reviews RSS | itunes.apple.com | **Blocked** by the sandbox network policy; not used. |

Screenshots were not stored or reused (`replica/screens/` intentionally absent).

## Confirmed from the listing

- Seven lines: Life, Head, Heart, Success, Fate, Travel, Marriage, each tied to a life area (love, vitality, personality, marriage, career, destiny, travel).
- Flow: "follow on-screen instructions, answer questions about your palm, receive a detailed reading" — i.e. a **questionnaire-driven** reading, not image analysis.
- Entertainment-only disclaimer.
- Monthly/yearly auto-renewing subscriptions plus many one-off report unlocks; contains ads.
- Version notes: Horoscope tab with numerology + Chinese zodiac, Yes/No tarot, dark mode (9.6); fortune cookie + affirmations (9.7); AI astrology chat + articles (10.4–10.7); Vedic astrology, quiz, Panchang (11.0–11.5); Dream meaning + Moon calendar (11.8).

## Assumed (not verifiable without the app)

Onboarding contents, exact screen order, horoscope periods (today/tomorrow/week/month), zodiac picker style. Built per the brief, marked `unknown` in `features.csv`.

## Core loop

Pick a hand → (photo) → answer questions about each line → read a seven-line report.

## Screens (Lunara)

| ID | screen | route | states |
| --- | --- | --- | --- |
| S01 | Onboarding (4 steps) | `/onboarding` | name/DOB optional, invalid date, cusp, manual sign |
| S02 | Today (home) | `/(tabs)` | with/without sign, no readings |
| S03 | Horoscope | `/(tabs)/horoscope` | 12 signs × 4 periods, favourite |
| S04 | Palm hub | `/(tabs)/palm` | no readings / list |
| S05 | Explore | `/(tabs)/explore` | — |
| S06 | Me / settings | `/(tabs)/me` | reminder on/off/denied/unsupported |
| S07 | Palm start (hand + photo source) | `/palm/start` | reuse last photo |
| S08 | Capture + preview | `/palm/capture` | permission undetermined/denied/blocked, no camera, quality warnings |
| S09 | Questionnaire (8 steps) | `/palm/questions` | conditional questions, optional photo pre-fill |
| S10 | Composing | `/palm/generating` | failure |
| S11 | Report | `/reading/[id]` | with/without photo, skipped lines, not found |
| S12 | History | `/history` | empty, favourites, delete, clear |
| S13–S19 | Compatibility, Numerology, Moon, Dreams, Vedic, Chinese, Tarot | `/tools/*` | missing birth date |
| S20 | Sign detail | `/sign/[id]` | unknown id |
| S21 | Learn list/article | `/learn`, `/learn/[id]` | not found |
| S22 | Privacy, Terms, Plus, Edit profile | `/legal/*`, `/premium`, `/edit-profile` | — |

## Flows

```
F01 First reading
    S01 (4 taps) -> S02 -> S07 (hand) -> S09 (8 steps) -> S10 -> S11
    edge: no photo, camera denied, low-quality photo, all questions skipped
F02 Daily horoscope   S02 -> S03 -> change period/sign -> share
F03 Delete data       S06 -> clear history / erase all -> S01
```

## Cannot be cloned

Their copy, illustrations, brand and IAP catalogue; AI chat (needs a hosted model); Panchang (needs an ephemeris and birth place).
