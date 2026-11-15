# Synthetic JSON fixtures

**SI-generated educational data. No real medical records or credentials.**

This directory contains static, editable JSON files bundled into the frontend through `p-console/src/data.ts`. It is **not a database**. The browser never writes back to these files. The console does not use localStorage, IndexedDB, cookies, or cross-device storage. `tanaworbit-api` can read these same files and cannot update them.

## Files

| File                    | Content                                                                                                     |
| ----------------------- | ----------------------------------------------------------------------------------------------------------- |
| `mission.json`          | One fictional mission: Aster Expedition VII; reference mission day 142 and a fictional 2035 example date.   |
| `crew.json`             | Five fictional profiles, profile-image references, public demo PINs, and a scripted review-request flag.    |
| `health-records.json`   | 150 synthetic records: 30 consecutive mission days for each crew member.                                    |
| `monitoring-rules.json` | A 14-day baseline window and unvalidated demonstration comparison differences.                              |
| `exercise-catalog.json` | Activity IDs, labels, educational context, and NASA reference links. Example minutes are not prescriptions. |
| `exercise-records.json` | 25 synthetic exercise sessions, five per crew member.                                                       |
| `biodata.json`          | One fictional body description per crew member. Not a clinical record.                                      |
| `monitor-parameters.json` | Demonstration fields and bounds for crew, cabin, orbit, and nutrition checks.                             |
| `cabin-conditions.json` | Eight scripted cabin samples through mission day 142.                                                       |
| `orbital-conditions.json` | Eight scripted altitude, velocity, and lighting samples.                                                   |
| `nutrition.json`        | Menu items and 35 example intake rows, seven days for each crew member. Not a diet order.                   |
| `access.json`           | Public demo codes for the admin and tester doors. Not accounts.                                             |

Each file has a `meta` section describing its synthetic origin. No measurement, PIN, medical threshold, exercise duration, or mission detail comes from actual NASA operations.

## Educational knowledge fixtures

- `health-toolkit.json`: six four-step recording walkthroughs; source definitions/scopes; five hazard explanations; four educational contexts; three routine tasks.
- `assistant-faq.json`: seven fixed answer topics, allowed in-app actions, template tokens, a safety limitation response, and an unknown-query fallback. This is not an AI service.

Context previews do not alter health values or thresholds. Walkthroughs explain the app, not how to place a particular sensor or administer care. NASA references support general education; project-authored steps and synthetic rules are not NASA-approved protocols.

`pnpm test:data` also checks the new fixture IDs, references, actions, template fields, and limits through `scripts/verify-toolkit.mjs`. See [the feature guide](../docs/toolkit-and-guide.md).

## Public demonstration PINs

| Profile                  | Public sample PIN |
| ------------------------ | ----------------- |
| Ella Nicole Fabro        | `3801`            |
| Abrey Diane Barcellano   | `4202`            |
| Hannah Faith Lopez       | `4503`            |
| Gary Ken Marasigan       | `4804`            |
| Greek William Legaspi    | `5005`            |

The sign-in screen exposes the selected profile's PIN and provides **Fill demo PIN**. Entering the matching four digits automatically opens the console. This is a navigation demonstration, **not authentication**. Do not replace these with real passwords, PINs, secrets, or personal information.

## Relationships

- `crew.missionId` → `mission.id`
- `health-records.crewId` → `crew.id`
- `health-records.missionId` → `mission.id`
- `exercise-records.crewId` → `crew.id`
- `exercise-records.activityId` → `exercise-catalog.id`
- `exercise-records.missionId` → `mission.id`

IDs must be unique. Each crew member must have one health fixture per mission day across the 30-day window. The current frontend adapter assumes this complete window; validation catches missing or duplicate fixture days.

## Health units

| Field                                   | Unit / meaning                                                  |
| --------------------------------------- | --------------------------------------------------------------- |
| `reading.heart`                         | Beats per minute                                                |
| `reading.systolic`, `reading.diastolic` | mmHg                                                            |
| `reading.sleep`                         | Hours                                                           |
| `reading.fatigue`                       | Fictional self-report, 1 low to 5 high                          |
| `reading.mood`, `reading.notes`         | Fictional descriptive text                                      |
| `temperatureC`                          | Degrees Celsius; display-only fixture                           |
| `respiration`                           | Breaths per minute; display-only fixture                        |
| `recordedAt`                            | Fictional example ISO timestamp, not the actual wall-clock time |

The baseline is a rounded arithmetic mean for each crew member over the prior 14 mission days, excluding the current day. It is a mean of **synthetic examples**, not a learned or validated medical baseline.

Exercise duration is in minutes. `effort` is a simple 1–10 subjective scale, not a clinical assessment. Bar charts show recorded minutes, not “safe” or “unsafe” exercise.

## Temporary interaction behavior

- A health check-in replaces the latest reading in React memory and the current-day chart point. It does not append or modify a JSON fixture.
- An exercise confirmation adds a temporary entry to an in-memory copy of the exercise list.
- Switching profiles or signing out does not write data anywhere. In-memory demo changes remain until refresh.
- Refresh returns to the sign-in screen and reloads the original JSON fixtures.
- CSV export explicitly downloads the latest health summary; it does not create a database or modify these JSON files.

Validate fixture edits with:

```sh
pnpm test:data
```

See [data architecture](../docs/data-architecture.md) and [logic](../docs/logic.md) for implementation details and a conceptual relational model.
