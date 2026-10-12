# Replica workflow outputs

Lunara was built with the [replica-skill](https://github.com/Jakeschincariol/replica-skill) pack
(MIT), installed project-locally in `.claude/skills/` from upstream commit
`77c9436fb3d18c3d58169efb8caf4fe906b0dc51` (2026-10-03). The skills are web-oriented; this
project applied them to an Expo / React Native app.

| skill | output here | how it was adapted |
| --- | --- | --- |
| replica-recon | `recon.md`, `features.csv` | App Store listing + version history only (Apple lookup API blocked from the build sandbox) |
| replica-architect | `architecture.md` | No server: local-first Expo app, so no SQL schema; data model is typed JSON in AsyncStorage |
| replica-design | `design/tokens.json` | Tokens mirror `src/theme/tokens.ts`; `contrast.py` → 17 pairs, 0 AA failures |
| replica-build | `src/` | Screen by screen, vertical slice first |
| replica-test | `test-report.md` | Jest + RNTL instead of Playwright e2e; plus a Playwright click-through of the web export |
| replica-diff | `parity.md` | `parity.py features.csv`; no layout diff (no reference screenshots stored) |
| replica-entrepreneur | `fixes.md` | Four public App Store reviews only; sample is thin and labelled so |
| replica-brand | `brand.md`, `brand.json` | `sweep.py` → clean |
| replica-backend / launch / deploy | not used | No backend, store accounts or web deploy in scope |

Re-run the checks:

```bash
python3 .claude/skills/replica-design/contrast.py replica/design/tokens.json
python3 .claude/skills/replica-diff/parity.py replica/features.csv
python3 .claude/skills/replica-brand/sweep.py . --config replica/brand.json
```
