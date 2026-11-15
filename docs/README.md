# TanawOrbit — Project documentation

**SI disclosure:** These documents and diagrams were drafted with the Figma Make coding assistant. The team must review the final submission for accuracy, attribution, and event-rule compliance. That disclosure stays in the public repository because the challenge asks for it.

TanawOrbit is an educational astronaut-health and mission-health operations prototype by **Tala Pulse**. It uses fictional crew members and synthetic measurements. It is not a medical device, diagnostic system, NASA product, or working spacecraft integration.

Official site: [https://www.tanaw-orbit.app/](https://www.tanaw-orbit.app/)

Space Apps team: [https://www.spaceappschallenge.org/2026/find-a-team/tala-pulse/](https://www.spaceappschallenge.org/2026/find-a-team/tala-pulse/)

Public source: [https://github.com/greeklx/team-talapulse-tanaworbit](https://github.com/greeklx/team-talapulse-tanaworbit)

## What the team should publish

These documents are the shared explanation. Teammates and judges should read the same story, so this folder stays in the public repository.

Publish the running prototype, the synthetic datasets, the credits, and the SI disclosure. Tala means “star,” and Pulse represents health and human life. Tanaw represents observation and perspective, and Orbit establishes the spaceflight context. Together, TanawOrbit can be read as “a clear view of health in orbit.” The longer wording is in [branding.md](branding.md).

Do not publish `docs/privatedocs`. That folder is a local challenge note. It is excluded from Git. Its interpretation describes diagnosis, treatment, and validated spaceflight data. This prototype does not do those things. Do not paste that note into the submission form.

## Start here

New educational features: [Health Toolkit and Tanaw Guide](toolkit-and-guide.md), plus [measurement walkthroughs and source limitations](measurement-guides.md). These are useful extensions, not a verified list of mandatory challenge requirements. Tanaw Guide is scripted, not live AI.

For the selected Tala Pulse team name and the upload-ready cover image, see [Team identity and cover artwork](branding.md).

For public-PIN demo access, tablet layouts, and Exercise & Recovery, see the [console guide](console-guide.md). The previous display shield is removed; the PIN screen is not authentication.

Data references: [dataset guide](../datasets/README.md), [data architecture and conceptual database model](data-architecture.md), and [application logic](logic.md).

| Document                                        | Purpose                                                                                                                   |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| [Submission form answers](submission.md)        | Copy-ready project name, summary, project details, and SI-use disclosure; instructions for the two required public links. |
| [System architecture](architecture.md)          | Mermaid diagrams and an explanation of the system that is actually implemented.                                           |
| [Technology stack](tech-stack.md)               | Languages, libraries, versions, browser APIs, and tools, with a Mermaid stack diagram.                                    |
| [Resources and attribution](resources.md)       | NASA references, photograph sources, fonts, software, licenses, and source-verification notes.                            |
| [Demo preparation](demo.md)                     | A seven-slide presentation draft and an alternative short-video script.                                                   |
| [Submission checklist](submission-checklist.md) | Publishing, SI labeling, branding, permissions, and final submission checks.                                              |
| [Provenance metadata](provenance.json)          | Machine-readable disclosure of SI assistance and synthetic-data provenance.                                               |

## What is ready and what still needs your team

The form text and technical documentation are drafted. **This does not mean the project has been submitted or that award eligibility has been verified.**

Before submitting:

1. The project link is [https://www.tanaw-orbit.app/](https://www.tanaw-orbit.app/). It opens with no account. The apex host `https://tanaw-orbit.app/` serves the same console.
2. Upload a presentation of at most seven slides or a video of at most 30 seconds, then replace `TODO_PUBLIC_DEMO_URL` in [submission.md](submission.md). The live site is not that demonstration file. Draft slides and a short script are in [demo.md](demo.md).
3. Review the challenge requirements, the 2026 event page, the deadline, and the local-event time zone.
4. Review the SI-image watermark requirements and the fictional mission name in the [checklist](submission-checklist.md). Documentation alone does not change the current UI or logo files.
5. Verify image provenance, permissions, and all resource links before making the originality declaration.
6. Have the team owner review and confirm the terms and originality statements personally.

## Mermaid diagrams

GitHub and many Markdown editors render the fenced `mermaid` blocks in these documents. The same diagrams are available as editable Mermaid source:

- [System architecture](diagrams/system-architecture.mmd)
- [Check-in data flow](diagrams/check-in-flow.mmd)
- [Technology stack](diagrams/tech-stack.mmd)

Open a source file in a Mermaid-compatible editor to render or export it. Mermaid is a **documentation tool**, not an application dependency. Public editor: https://mermaid.live/

## Honest scope

- The application runs in a browser using React, TypeScript, Vite, and Tailwind CSS.
- Check-ins use a Record → Review → Complete workflow and replace the selected crew member's latest reading in React memory. Per-crew drafts survive navigation, but refreshing the page resets the demo.
- Example baselines are computed separately per crew from the previous 14 synthetic JSON days. They are not medically validated or learned models.
- Earlier chart points come from 150 synthetic JSON health records (5 crew × 30 days). Physiological waveform shapes remain illustrative; no sensor history is connected.
- Status rules are simple demonstration rules, not validated medical thresholds.
- Mission-context previews change explanations only. The body overview is a schematic, not a scan.
- Routine reminders work only within the open page; no background delivery is guaranteed.
- Tanaw Guide uses fixed answers and limited keyword matching. It cannot diagnose, prescribe, or provide validated emergency support.
- Public demo profiles and PINs are preloaded. No real authentication, database, device integration, machine-learning model, or runtime SI service is implemented. The optional `tanaworbit-api` Worker only republishes the synthetic JSON and does not store check-ins.

The application, logo, team cover, and submission text use **TanawOrbit** and **Tala Pulse**. Cover assets are documented in [branding.md](branding.md). The name does not change the prototype's limits or finish the open checklist items.
