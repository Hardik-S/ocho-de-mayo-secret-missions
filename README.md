# Secret Missions: Ocho Edition

A mobile-first static party game for an Ocho de Mayo dinner. The host creates a four-player mission set on a laptop, shares a QR/link, and guests privately reveal one general mission plus one secondary mission involving a specific player from a deterministic circular target loop.

## How It Works

- The host enters the event title, subtitle, player names, and settings.
- The app filters and shuffles missions with a deterministic seed.
- Each player receives a unique mission and points to exactly one different player.
- The assignment map is encoded as base64url JSON in `/#/join?g=...`.
- Guests scan the same link, pick or type their name, and see only their mission.
- Each guest's status and best moment persist locally on that device.
- Awards are a manual host ceremony because there is no backend sync.

This architecture was chosen to keep the game fast, private, free to host, and usable on static hosting with no login, database, paid API, or real-time service.

## Editable Content

The main party content lives in:

- `src/data/eventConfig.ts`: event title, subtitle, host defaults, safety copy, award labels, theme tokens, default names.
- `src/data/missions.ts`: mission library, completion conditions, hints, award tags, cat flags, mild-mode flags.

Game behavior is split into small helpers:

- `src/utils/random.ts`: seeded random and shuffle.
- `src/utils/safety.ts`: cat and mild-mode filters.
- `src/utils/assignment.ts`: name normalization, slugging, unique assignments, rerolls, and circular target loop.
- `src/utils/encoding.ts`: base64url encode/decode.
- `src/utils/storage.ts`: localStorage helpers and stable key names.

## Local Storage Keys

The app reserves these keys:

- `ocho.secretMissions.game`
- `ocho.secretMissions.player`
- `ocho.secretMissions.hostDraft`
- `ocho.secretMissions.recentMissionIds`

Do not store API keys, credentials, contact lists, or sensitive data in localStorage. This version only stores local game/session state.

## Local Commands

```bash
npm install
npm run dev
npm test
npm run build
npm run preview
```

## Vercel Deployment

Use the Vite preset.

- Install command: `npm ci`
- Build command: `npm run build`
- Output directory: `dist`

Hash routing keeps static deploys simple because routes such as `/#/host`, `/#/join?g=...`, `/#/mission`, and `/#/awards` all load through `index.html`.

## Safety Principles

Missions should stay kind, subtle, and dinner-party-safe.

- No humiliation, coercion, intoxication pressure, romantic pressure, body contact, or risky dares.
- No messing with food, drinks, belongings, pets, or bodies.
- Cat missions are optional and must not disturb the cat.
- Mild mode removes hard or explicitly non-mild missions.
- If someone guesses the exact mission before completion, the player is caught; vague suspicion does not count.

## Dependencies

Runtime dependencies:

- `react`
- `react-dom`
- `react-qr-code`
- `canvas-confetti`

Dev/test dependencies include TypeScript, Vite, Vitest/jsdom, and `@playwright/test` for browser QA.
