# Security notes (2026-10-12)

- **Secrets:** none in the repo. `.env*` ignored except `.env.example`. No API keys are needed.
- **Network:** none by default. The optional analysis endpoint must be `https://`, is consent-gated,
  times out after 30 s, and its response is filtered to known question/option ids.
- **Storage:** AsyncStorage JSON is validated on load (`normalizeState`); names are length-limited and
  stripped of control characters. Photos live in the app sandbox and are deleted with their reading.
- **Permissions:** camera (on demand), photo picker (system picker), notifications (on demand).
  Android blocks RECORD_AUDIO and location.
- **Monetisation:** no purchase code; no client-side unlock flag.
- **Logging:** the app does not log user data.

## `npm audit --omit=dev`

64 advisories (48 high, 16 moderate, 0 critical), all from five root packages with no patched
release available on npm today:

| package | severity | reaches us via | ships in app bundle? |
| --- | --- | --- | --- |
| node-forge ≤1.4.0 | high | @expo/cli code signing | no (CLI) |
| braces ≤3.0.3 | high | micromatch (Metro, Jest) | no (build/test) |
| sprintf-js ≤1.1.3 | moderate | js-yaml via jest-expo | no (test) |
| uuid <11.1.1 | moderate | xcode via @expo/config-plugins | no (prebuild) |
| decode-uri-component ≤0.4.2 | moderate | query-string via expo-router | yes — DoS on malformed URLs only; deep links are local to the app |

CI fails on any **critical** advisory and should be tightened once Expo ships patched dependencies.
