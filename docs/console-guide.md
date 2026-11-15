# Demo access, tablet console, and exercise guide

**SI-assisted documentation. Use fictional data only.** The public PIN entry is a navigation demonstration, not security or authentication.

## Enter the demo

1. Choose one of the five fictional crew profiles on the entry screen: Ella Nicole Fabro, Abrey Diane Barcellano, Hannah Faith Lopez, Gary Ken Marasigan, or Greek William Legaspi.
2. Enter the selected profile's displayed four-digit sample PIN, or select **Fill demo PIN**.
3. The console opens automatically when the four digits match. A mismatch displays an error and clears the input.

The sample codes are the public `demoPin` values in `datasets/crew.json`. They are intentionally public and bundled with the app. Never put real PINs or passwords in these JSON files.

**Sign out of demo** returns to profile entry. Choosing a different crew member in Mission Overview opens the entry screen with that profile selected. This is not protected access control. In-memory demo changes remain until a page refresh; refresh reloads the original fixtures and starts signed out.

## Display layout

Use the header's Desktop / Touch control or **Display Settings**.

- **Auto-detect:** touch layout for a coarse-pointer device or viewport at/below 1180 pixels.
- **Desktop:** sidebar-oriented layout.
- **Touchscreen / tablet:** larger controls and a bottom dock with Dashboard, Check-in, Trends, Alerts, and More.

**More** opens all nine screens, including Exercise & Recovery. The drawer supports keyboard focus containment and Escape. Portrait and landscape adapt to available width. These layouts have not been evaluated on flight hardware or in microgravity.

Fullscreen uses the browser API after a user action. Embedded previews and some mobile browsers can block it; a message explains the limitation. This is not an operating-system kiosk mode.

## Privacy change

The former display shield, inactivity timeout, and two-step reveal are removed. No automatic inactivity lock or secure login has replaced them. The new public-PIN demo screen must not be presented as medical-data protection.

## Health check-in

Use **Record → Review → Complete**. Number inputs have plus/minus controls. Browser constraints and a systolic-greater-than-diastolic consistency check apply; these are not clinical assessments.

Review the crew, values, units, and notes, check the confirmation box, then choose **Confirm & record**. This replaces the latest in-memory reading. Drafts survive navigation per crew but reset on page refresh.

## Health trends

The 7-, 14-, and 30-day charts read static synthetic JSON records. The current-day point reflects the latest in-memory check-in. Example personal baselines are computed from each crew member's previous 14 synthetic days.

Tap a chart point or use Previous/Next measurement. Keyboard users can focus the chart and use arrow keys; End returns to the latest point. None of this establishes clinical accuracy.

## Exercise & Recovery

- Review synthetic recorded minutes, session counts, and subjective effort.
- Select an activity, enter duration (1–180 minutes) and effort (1–10), and optionally add notes.
- Use **Review session → Confirm session** to add a temporary entry.
- Totals, bars, and the log update immediately; navigating away and back retains entries in memory.
- Recovery context shows the current health check-in's sleep and fatigue.

Activity context links to NASA educational resources. The app does not prescribe a workload, calculate calories, approve exercise safety, or connect to a sensor.

## CSV export

**Export summary → Download CSV** downloads the latest health summary after review. On a narrow screen, use **More → Export summary**. PINs, notes, exercise logs, earlier trend points, and review acknowledgements are excluded. Export does not modify JSON files or create a database.

See [logic.md](logic.md), [data-architecture.md](data-architecture.md), and [the dataset guide](../datasets/README.md) for exact behavior.

## Health Toolkit and Tanaw Guide

Open **Health Toolkit** from the sidebar/More menu, use the dashboard next-step cards, or select **Understand this observation** in the alert log. Five sections cover recording walkthroughs, a demo routine, a body overview, mission context, and evidence. The current-run routine is not a medical schedule.

The context selector changes educational explanations only; source mission readings and rules remain unchanged. The bottom-right **Tanaw Guide** opens a fixed-answer, source-linked help dialog, not a live AI chatbot. It becomes a full-screen sheet on phones and can be closed with Escape. No guide conversation is saved or sent to an AI service.

See [the detailed feature guide](toolkit-and-guide.md).
