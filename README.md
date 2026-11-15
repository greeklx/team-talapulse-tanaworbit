# TanawOrbit

Educational web prototype for astronaut health and mission-health operations, by team **Tala Pulse**.

Official site: [https://www.tanaw-orbit.app/](https://www.tanaw-orbit.app/)

Space Apps team: [Tala Pulse](https://www.spaceappschallenge.org/2026/find-a-team/tala-pulse/)

TanawOrbit uses fictional crew members and synthetic measurements. It is not a medical device, not a diagnostic system, not a NASA product, and not a spacecraft integration. Demo PINs are public sample codes. They are not authentication.

## Name

**Team: Tala Pulse.** Tala means “star,” while Pulse represents health and human life.

**Project: TanawOrbit.** Tanaw represents observation and perspective, while Orbit establishes the spaceflight context.

TanawOrbit combines a Filipino word with an English spaceflight term.

**Tanaw.** In Filipino, tanaw relates to a view or something visible from a distance, the act of looking toward or observing something, and a wider perspective or outlook. In “tanaw sa hinaharap,” it means looking toward the future. This connects to the system’s purpose: helping astronauts observe, understand, and reflect on their health information.

**Orbit.** Orbit is the path of an object around a celestial body. It connects the name to spaceflight, space stations and spacecraft, mission operations, and repeated cycles, similar to recurring health check-ins and routines.

**Combined meaning.** TanawOrbit can be interpreted as “a clear view of health in orbit.”

## What is in this repository

| Path | Role |
| --- | --- |
| `p-console` | Vite, React, and TypeScript console. It bundles the JSON fixtures and keeps check-ins in memory until refresh. |
| `tanaworbit-api` | Read-only Cloudflare Worker. It republishes the same fixtures and rejects writes. |
| `datasets` | Synthetic JSON required to run the console and the Worker. |
| `docs` | Challenge documentation, resource credits, and provenance. |
| `scripts` | Fixture integrity checks. They do not prove clinical validity. |

The astronaut console operates client-side with bundled JSON fixtures. `/tester` calls the read-only Worker to verify fixture integrity and 14-day baseline calculations. The Worker does not store health records or credentials.

## Run it

Node.js 22 and pnpm (e.g. `pnpm@11.20.0`).

```sh
pnpm install
pnpm test:data
pnpm dev
```

The console listens on `http://127.0.0.1:5173`.

| Path | Who |
| --- | --- |
| `/a-login` | Astronaut door. Public sample PIN, then `/Astronaut`. |
| `/b-login` | Backend door for admin (`4400`) and tester (`2200`). |
| `/admin` | Crew, cabin, orbit, and nutrition review. Opens the console for any profile. |
| `/tester` | Asks `tanaworbit-api` to recheck the fixtures and the 14-day mean. |

Start `pnpm dev:api` before opening `/tester`. The tester calls `http://127.0.0.1:8787` and, if that is down, tries the same origin.

```sh
pnpm dev:api
pnpm test
pnpm build
```

`pnpm dev:api` starts the Worker locally with Wrangler. `pnpm build` writes the static console to `p-console/dist`. A build does not publish a public URL.

Deploy the Worker only when you mean to, from `tanaworbit-api`, with your own Cloudflare account:

```sh
pnpm --filter tanaworbit-api exec wrangler deploy
```

No account id, token, or secret is stored in this repository.

## Challenge boundaries

- Numerical values are synthetic. They are not NASA health data and they are not connected to a NASA device.
- Status labels are demonstration rules. Stable is not a health clearance. Attention is a scripted review example.
- Example baselines are arithmetic means of the previous 14 synthetic mission days.
- Tanaw Guide uses fixed answers. It does not call a model, diagnose, or prescribe.
- Do not add NASA logos, mission identifiers, or claims of NASA endorsement.
- Photograph credits, font licenses, and the SI disclosure for the prototype are in [docs/resources.md](docs/resources.md) and [docs/provenance.json](docs/provenance.json).
- The official site is [https://www.tanaw-orbit.app/](https://www.tanaw-orbit.app/). The Space Apps team page is [Tala Pulse](https://www.spaceappschallenge.org/2026/find-a-team/tala-pulse/).
- The team owner still has to confirm the event terms and the originality declaration.

## License

The MIT license in [LICENSE](LICENSE) covers the project source written for TanawOrbit.

It does not cover NASA websites and articles, the Unsplash photographs, or the SIL Open Font License files for DM Sans and IBM Plex Mono. Those notices stay in `p-console/public/fonts`.
