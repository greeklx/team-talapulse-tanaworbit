# NASA Space Apps submission — Copy-ready draft

**Preparation note — do not paste this note into a form field:** This draft describes the existing prototype, not a production medical platform. Review the [submission checklist](submission-checklist.md) before publishing. SI-assisted text; team review required.

## Project Summary

### Project Name

TanawOrbit: Astronaut Health & Mission Operations

### Summary

Copy the following paragraph into the Summary field:

> TanawOrbit is an educational web prototype that explores how astronauts and mission teams could understand personal health changes during long-duration spaceflight. It brings fictional crew profiles, daily health check-ins, baseline comparisons, trend charts, and reviewable observations into one mission-control-style dashboard. Users can explore heart rate, blood pressure, sleep, fatigue, mood, temperature, and respiration, then connect observable changes with plain-language guidance. A PUMA-inspired panel illustrates multi-signal physiological monitoring using clearly labeled synthetic data, without connecting to a NASA device. NASA human-research resources provide educational context for the challenges of living and working in space. Our approach emphasizes a transparent workflow: monitor, compare, notice change, understand context, and review guidance. The prototype demonstrates a human-centered interface, not a diagnostic tool. A Health Toolkit adds recording walkthroughs, in-page routine reminders, an interactive body schematic, and source labels. A scripted guide explains the demo without diagnosing or prescribing. It is designed to make complex information easier to interpret while keeping uncertainty, data provenance, and human review visible.

Length: **163 words / 1,271 characters** for the paragraph alone, within the suggested 50–200 words and the 1,500-character limit. Count it again if you edit it.

## Project Links

### Project Demonstration

**Team action required:** Upload one public demonstration, then replace the token below.

```text
TODO_PUBLIC_DEMO_URL
```

Use the [seven-slide demo draft or short-video script](demo.md). The token above is not a valid submission link. The official site is the project link, not this demonstration file. Do not submit the challenge briefing video as the team demo.

- Presentation: no more than seven slides, including the title and introduction.
- Video: no more than 30 seconds.
- Open the uploaded artifact in a signed-out browser window. It must not require permission, registration, a password, or an account.
- A private editing link or a local preview address is not a substitute.

### Project

```text
https://www.tanaw-orbit.app/
```

Public source repository:

```text
https://github.com/greeklx/team-talapulse-tanaworbit
```

Space Apps team page:

```text
https://www.spaceappschallenge.org/2026/find-a-team/tala-pulse/
```

Open the site signed out before pasting it into the form. Confirm that it loads without an account.

## Project Information

### Project Details

Copy the following sections into the Project Details editor:

#### What we developed

TanawOrbit is an interactive educational prototype for astronaut health monitoring and mission-health operations. It explores a practical question: how can a crew member understand a changing measurement in the context of their own recent pattern, rather than seeing an isolated number?

The team name Tala Pulse uses tala, “star,” and pulse for health and human life. TanawOrbit joins tanaw, a Filipino word for a view, the act of looking, and a wider outlook, with orbit, the spaceflight path and the rhythm of repeated check-ins. The name can be read as “a clear view of health in orbit.”

The crew console includes Mission Overview, Astronaut Dashboard, Biodata, Daily Health Check-In, Personal Health Trends, Calculation Trend, Exercise & Recovery, Physiological Monitoring, Monitor Parameters, Cabin Conditions, Orbital Conditions, Space Nutrition, Health Monitoring Alerts, Health Toolkit, and Astronaut Health Guidance. An astronaut enters at `/a-login` with a public sample PIN and stays on that fictional profile. Admin and tester enter at `/b-login`. Admin can open any profile. Tester asks the read-only API to recheck the synthetic fixtures. Cabin, orbit, and nutrition figures do not change health thresholds. They are not prescriptions or live telemetry. Users can review measurements, enter a daily check-in, compare trends, acknowledge observations, explore educational guidance, and export a CSV summary.

An additional touchscreen layout supports handheld tablets and front-facing displays with larger controls, a bottom navigation dock, fullscreen where the browser permits it, touch/keyboard trend inspection, and review-before-recording check-ins. Drafts remain in memory while navigating. A profile-entry screen auto-continues when a public sample PIN matches the chosen fictional crew member; it is explicitly a demo, not authentication or medical-record security. The previous inactivity shield is removed. CSV downloads also require confirmation.

#### How it works

The console runs in the browser and does not require the Worker. A separate read-only Worker can republish the same synthetic JSON. It does not accept check-ins. A check-in collects heart rate, systolic and diastolic blood pressure, sleep duration, fatigue level, mood, and optional notes. Saving replaces that crew member's latest reading in temporary React state and updates the dashboard, latest chart point, and derived observations. Entries reset on page refresh; the prototype does not maintain a persistent health record.

Trend controls offer 7-, 14-, and 30-day illustrative views of heart rate, blood pressure, sleep, and fatigue. Solid measurement lines and dashed example-baseline lines make the comparison explicit. Earlier points are read from 150 synthetic JSON records across 5 crew members. Reference values are arithmetic means of each crew member’s previous 14 synthetic mission days, not medically validated baselines. Exercise & Recovery reads 25 example sessions and supports review-before-confirming temporary activity entries. The browser never writes to the fixture files.

Green Stable, amber Observe, and red Attention labels support a review workflow. These labels are not diagnoses or clinical risk scores. Observe flags use simple demonstration rules, while one fictional crew member has a scripted Attention flag to illustrate a human-review scenario. Marking an observation reviewed changes its session review state; it does not provide medical clearance.

#### NASA resources and physiological-monitoring inspiration

NASA's Human Research Program and The Human Body in Space provide educational context for sleep disruption, fatigue, isolation, and adaptation to microgravity. Our documentation also cites NASA's PUMA Technology Monitors Pilots and Patients article to explain the multi-signal-monitoring inspiration.

The PUMA-inspired screen displays illustrative heart rate, oxygen saturation, respiration, end-tidal carbon dioxide, airflow, temperature, and pressure. It is not a reproduction of PUMA's sensor specification: for example, the prototype's oxygen-saturation display is not PUMA's oxygen partial-pressure measurement. The waveforms are static illustrations. No NASA device, telemetry feed, astronaut medical record, or clinical dataset is connected.

#### Educational toolkit and next steps

The Health Toolkit connects observations to data-entry walkthroughs and source limitations, tracks a current-run routine, and provides a body schematic grouping existing values. Orbital, transit, lunar, and Mars previews change educational context, not physiological thresholds or source records. Routine reminders are in-page demonstration timers, not guaranteed background or medical scheduling. Tanaw Guide uses fixed FAQ answers and limited keyword matching, not a live AI model. It does not diagnose emergencies or recommend medication, and it is not a substitute for approved mission protocols or qualified care.

#### Benefits and intended impact

The intended benefit is clearer communication: monitoring leads to comparison, observable change, contextual explanation, and guidance review. Crew-level cards provide an overview, while individual dashboards keep attention on the person behind a measurement. The educational guidance pairs explanations with spaceflight considerations and source links.

This is a design and interaction proof of concept. We have not demonstrated clinical accuracy, improved health outcomes, reduced workload, or operational readiness. Future work would require user research, medical and human-factors review, representative datasets, validated comparison methods, and appropriate security and privacy controls before any real-world use.

#### Tools, creativity, and design considerations

We used React 19, TypeScript, Vite 8, Tailwind CSS 4, custom SVG visualizations, browser form controls, and browser-based CSV downloads. Figma Make's SI coding assistant helped create and refine the interface, application code, synthetic examples, vector logo, and documentation. No SI model runs inside the application. No dedicated hardware is required for the demonstration.

The creative contribution is the connected, transparent workflow rather than a diagnostic algorithm: a simple check-in becomes a baseline comparison, an understandable observation, and a relevant educational resource. The dark operational layout uses restrained blue and cyan, readable measurement units, explicit status text, keyboard-accessible dialogs, and responsive layouts. We considered cognitive load, traceability, the difference between observation and diagnosis, and the risks of presenting simulated information as real.

### Use of Super Intelligence (SI)

The form's selectable option labels were not included in the supplied screenshots. Select the actual options that correspond to **SI-assisted code, text/documentation, synthetic example data, and vector graphics/design**, if those categories are offered. Do **not** select “I did not use SI.”

If the form includes a descriptive field, use:

> We used the Figma Make SI coding assistant to help generate and revise React/TypeScript code, CSS, SVG charts and icons, interface copy, synthetic crew measurements and example comparison rules, the original TanawOrbit vector logo, and project documentation and Mermaid diagrams. SI use occurred during development; the app does not call a chatbot or model at runtime. Photographs were sourced from Unsplash, not generated with SI. No SI-generated audio or video has been created for this submission draft. The team must review the output and its references before submission. Code and synthetic-data provenance are documented in docs/provenance.json and the project documentation. Generated graphic labeling and NASA-branding checks are listed as unresolved pre-submission actions.

If your team uses additional tools after this draft, add their names and purposes. Do not claim that watermark requirements have been satisfied until the submitted images and other required visual artifacts actually include the appropriate visible SI-generated label.

### NASA Data

Create these resource entries using the full URLs. These are **NASA resources used for educational context and documentation**, not health-data feeds. See [resources.md](resources.md) for the distinction.

| Link Text                                                         | Link URL                                                                      |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| NASA — 5 Hazards of Human Spaceflight                             | https://www.nasa.gov/hrp/hazards/                                             |
| NASA Human Research Program — spaceflight health research context | https://www.nasa.gov/hrp/                                                     |
| NASA — The Human Body in Space                                    | https://www.nasa.gov/humans-in-space/the-human-body-in-space/                 |
| NASA — PUMA Technology Monitors Pilots and Patients               | https://www.nasa.gov/technology/puma-technology-monitors-pilots-and-patients/ |

The HRP, Human Body in Space, and five-hazards URLs are linked in the application. The PUMA article was reviewed and cited while preparing this documentation; the app's panel is only conceptually inspired by PUMA. No claim is made that NASA supplied the example numbers, baseline rules, or waveforms.

### Space Agency Partner & Other Data

Use the full link-entry list in [resources.md](resources.md#other-resources--form-link-entries). It includes the actual photographs, fonts, development software, SI tool, and documentation tooling.

No space-agency-partner dataset or additional external health dataset is currently implemented. Do not list proposed integrations as if they were used.

## Project Submission Verification

These declarations must be completed by your team, not by the assistant:

### Agree to Terms and Conditions

Read the current official Project Submission Guide, Participant Terms and Conditions, and Privacy Policy for your event. Confirm the checkbox only after you understand and accept them.

### Confirm All Work is Original

Review the source/resource inventory, permitted use of third-party material, SI disclosures, and the branding checklist. The project includes external software, fonts, and photographs; originality does not mean that those materials were created by your team. Confirm only if the declaration accurately describes your submission and all external resources are credited.

### Save and submit

1. Coordinate with the team owner and use the form's editing lock if multiple members are editing.
2. Paste the reviewed text, add the demonstration URL, confirm `https://www.tanaw-orbit.app/`, and add the resource entries.
3. Use **Save Progress** while editing.
4. Recheck all URLs in a signed-out window and verify demo duration or slide count.
5. Confirm the event year and local deadline on the official event page; do not rely solely on the pasted “Sunday, November 15” text.
6. Click **Submit for Judging** before the applicable deadline, then verify that the page displays a submission confirmation. Saving alone is not submission.
