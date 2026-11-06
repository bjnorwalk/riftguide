# RiftGuide

A League of Legends build-planning prototype built with React and TypeScript.
Choose a champion, role, and matchup to compare item choices. The recommendation
logic scores damage, healing, shields, and other enemy-team threats, then explains
why an item fits the selected game state.

[Open the static demo](https://bjnorwalk.github.io/riftguide/).
Champion and item planning runs in the browser. Account features need the optional
server described below.

## Run locally

Use Node.js 24.

```sh
npm ci
npm run dev
```

Open [localhost:5174](http://127.0.0.1:5174). The app combines local profiles and
guides with Riot Data Dragon. A network connection is needed for uncached static
data. Selections can be shared through the URL, including a cleared enemy team,
and saved plans use localStorage. Links without an `enemies` parameter keep the
default team; `enemies=` represents an explicitly empty team.

## Optional account features

Copy `.env.example` to `.env` and add your Riot API key. Start the proxy in a second
terminal:

```sh
npm run api
```

Vite forwards `/api` requests to port 8787. Match history, timelines, and ladder
sampling need this server and a valid key. The key stays on the server. Cached
account and match data are not included in the repository.

## Checks

```sh
npm run check
```

This runs the tests and production build, and also runs in GitHub Actions.

The build runs TypeScript before bundling the frontend. Tests cover champion data,
recommendation behavior, Riot ID parsing, and shared build URL round trips.
There is no separate lint script.

## Implementation

| Location                            | Responsibility                                        |
| ----------------------------------- | ----------------------------------------------------- |
| `src/recommender.ts`                | Item scoring and recommendation explanations          |
| `src/data/`                         | Profiles, guides, matchup data, and source references |
| `src/dataDragon.ts`                 | Riot static data                                      |
| `src/urlState.ts`, `src/storage.ts` | Shared selections and saved plans                     |
| `server/riotApi.mjs`                | Credentialed Riot API proxy                           |

## Limits

Some tier, win-rate, confidence, and guide values are seeded or estimated.
Source-checked profiles are distinguished from profiles calculated from champion
and role tags. These values are not a comprehensive live statistical sample.

The manual Pages workflow deploys only the frontend. Riot account features need
a separately hosted proxy and do not run on a standalone Pages site.

League of Legends and related content belong to Riot Games. This project is not
endorsed by Riot Games. Data references are kept in `src/data/`.
