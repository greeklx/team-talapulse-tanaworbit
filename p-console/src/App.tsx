import { lazy, Suspense, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  Sun,
  Moon,
  Compass,
  Monitor,
  Tablet,
  Maximize2,
  Minimize2,
  LogOut,
  AlertTriangle,
  FileText,
  Activity,
  HeartPulse,
  Heart,
  Wind,
  Thermometer,
  Orbit,
  Users,
  TrendingUp,
  LineChart,
  Target,
  Utensils,
  Dumbbell,
  UserCheck,
  Sliders,
  ClipboardCheck,
  Stethoscope,
  BookOpen,
  Bell,
  Download,
  Plus,
  Minus,
  X,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { useConsoleDisplay, type DisplayMode } from "./useConsoleDisplay";
import {
  BiodataPanel,
  CabinPanel,
  CalculationTrendPanel,
  MonitorParametersPanel,
  NutritionPanel,
  OrbitalPanel,
  PumaPanel,
  SensorimotorPanel,
  WeekBoard,
} from "./MissionFeatures";
import ExercisePanel from "./ExercisePanel";
import NextSteps from "./NextSteps";
import FeatureBoundary from "./FeatureBoundary";
import AnatomicalAvatar, { type SymptomLog } from "./AnatomicalAvatar";
import PumaTracker from "./PumaTracker";
import TelemetryReportModal from "./TelemetryReportModal";
import OnboardingModal, { type TourStep } from "./OnboardingModal";
import SimulationScenarioModal from "./SimulationScenarioModal";
import LiveWaveformStream from "./LiveWaveformStream";
import ZeroGLivingGuide from "./ZeroGLivingGuide";
import DailyHealthCheckIn, { type CheckInDraft } from "./DailyHealthCheckIn";
import type { CognitionEntry } from "./CognitionBattery";
import Term from "./Term";
import { missionContexts, routineDefinitions, type MetricId, type ToolkitTab } from "./toolkitData";
import { useRoutineReminders } from "./useRoutineReminders";
import "./toolkit.css";
import HealthToolkit from "./HealthToolkit";
const TanawGuide = lazy(() => import("./TanawGuide"));
import {
  biodataFor,
  crew,
  crewStatus,
  historyFor,
  initialExercises,
  bodySampleFor,
  latestRecord,
  mission,
  type BodySample,
  observationFlags,
  personalBaseline,
  rules,
  type ExerciseRecord,
  type Reading,
} from "./data";

type IconName =
  | "grid"
  | "activity"
  | "check"
  | "chart"
  | "pulse"
  | "bell"
  | "book"
  | "settings"
  | "help"
  | "chevron"
  | "arrow"
  | "download"
  | "plus"
  | "clock"
  | "heart"
  | "moon"
  | "battery"
  | "smile"
  | "thermometer"
  | "wind"
  | "pressure"
  | "globe"
  | "shield"
  | "external"
  | "close"
  | "menu"
  | "tablet"
  | "monitor"
  | "expand"
  | "logout"
  | "info";
function Icon({
  name,
  size = 20,
  className = "",
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  const paths: Record<IconName, ReactNode> = {
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
    activity: (
      <>
        <path d="M3 12h4l3-8 4 16 3-8h4" />
      </>
    ),
    check: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="3" />
        <path d="m8 12 3 3 5-6M9 3v3h6V3" />
      </>
    ),
    chart: (
      <>
        <path d="M4 3v17h17M7 14l4-5 4 3 5-7" />
      </>
    ),
    pulse: (
      <>
        <path d="M2 12h5l2-6 4 12 3-8 2 2h4" />
        <path d="M5 5a10 10 0 0 1 14 0M5 19a10 10 0 0 0 14 0" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
      </>
    ),
    book: (
      <>
        <path d="M12 5C8 2 3 4 3 4v15s5-2 9 1c4-3 9-1 9-1V4s-5-2-9 1v15" />
      </>
    ),
    settings: (
      <>
        <path d="m9 3-1 3-3 1-2 3 2 3v4l3 2 3-1 3 2 4-2v-4l3-3-2-4-4-1-2-3Z" />
        <circle cx="12" cy="11" r="3" />
      </>
    ),
    help: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9a2.5 2.5 0 1 1 4 2c-1 .6-1.5 1-1.5 3M12 17h.01" />
      </>
    ),
    chevron: <path d="m9 5 7 7-7 7" />,
    arrow: (
      <>
        <path d="M5 12h14m-5-5 5 5-5 5" />
      </>
    ),
    download: (
      <>
        <path d="M12 3v12m-4-4 4 4 4-4M4 16v5h16v-5" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    heart: (
      <path d="M20.5 5.5a5 5 0 0 0-7 0L12 7l-1.5-1.5a5 5 0 0 0-7 7L12 21l8.5-8.5a5 5 0 0 0 0-7Z" />
    ),
    moon: <path d="M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z" />,
    battery: (
      <>
        <rect x="3" y="7" width="17" height="11" rx="2" />
        <path d="M23 11v3M7 10v5m4-5v5" />
      </>
    ),
    smile: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M8 14s1 3 4 3 4-3 4-3M8 9h.01M16 9h.01" />
      </>
    ),
    thermometer: (
      <>
        <path d="M9 14V5a3 3 0 0 1 6 0v9a5 5 0 1 1-6 0ZM12 7v10" />
      </>
    ),
    wind: (
      <>
        <path d="M3 8h12a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h5a3 3 0 1 1-3 3" />
      </>
    ),
    pressure: (
      <>
        <path d="M5 19a9 9 0 1 1 14 0ZM12 14l4-6M5 12h2M12 4v2M17 12h2" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="4" ry="9" />
        <path d="M3 12h18M5 6h14M5 18h14" />
      </>
    ),
    shield: (
      <>
        <path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    external: (
      <>
        <path d="M14 3h7v7m0-7L10 14M10 4H4v16h16v-6" />
      </>
    ),
    close: <path d="m6 6 12 12M6 18 18 6" />,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    tablet: (
      <>
        <rect x="4" y="2" width="16" height="20" rx="3" />
        <path d="M10 18h4" />
      </>
    ),
    monitor: (
      <>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M12 17v4M8 21h8" />
      </>
    ),
    expand: <path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" />,
    logout: <path d="M9 3H4v18h5M14 8l4 4-4 4M8 12h12" />,
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v6M12 7h.01" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

export type Page =
  | "Mission Overview"
  | "Astronaut Dashboard"
  | "Health Check-In"
  | "Health Trends"
  | "Calculation Trend"
  | "Sensorimotor & Reflex"
  | "Exercise & Recovery"
  | "Physiological Monitoring"
  | "Monitor Parameters"
  | "Biodata"
  | "Cabin Conditions"
  | "Orbital Conditions"
  | "Space Nutrition"
  | "Alerts & Attention"
  | "Health Toolkit"
  | "Health Guidance";
type Status = "Stable" | "Observe" | "Attention";

export const PAGE_HASH_MAP: Record<string, Page> = {
  overview: "Astronaut Dashboard",
  dashboard: "Astronaut Dashboard",
  asutrnout: "Astronaut Dashboard",
  astronaut: "Astronaut Dashboard",
  vitals: "Physiological Monitoring",
  physiological: "Physiological Monitoring",
  puma: "Physiological Monitoring",
  cabin: "Cabin Conditions",
  eclss: "Cabin Conditions",
  orbit: "Orbital Conditions",
  hazards: "Orbital Conditions",
  crew: "Mission Overview",
  readiness: "Mission Overview",
  trends: "Health Trends",
  history: "Health Trends",
  forecast: "Calculation Trend",
  calculation: "Calculation Trend",
  "motor-skills": "Sensorimotor & Reflex",
  sensorimotor: "Sensorimotor & Reflex",
  reflex: "Sensorimotor & Reflex",
  nutrition: "Space Nutrition",
  food: "Space Nutrition",
  exercise: "Exercise & Recovery",
  fitness: "Exercise & Recovery",
  workout: "Exercise & Recovery",
  baseline: "Biodata",
  biodata: "Biodata",
  standards: "Monitor Parameters",
  parameters: "Monitor Parameters",
  "check-in": "Health Check-In",
  checkin: "Health Check-In",
  countermeasures: "Health Toolkit",
  toolkit: "Health Toolkit",
  "living-guide": "Health Guidance",
  guidance: "Health Guidance",
  alerts: "Alerts & Attention",
};

export const PAGE_TO_HASH: Record<Page, string> = {
  "Astronaut Dashboard": "overview",
  "Physiological Monitoring": "vitals",
  "Cabin Conditions": "cabin",
  "Orbital Conditions": "orbit",
  "Mission Overview": "crew",
  "Health Trends": "trends",
  "Calculation Trend": "forecast",
  "Sensorimotor & Reflex": "motor-skills",
  "Space Nutrition": "nutrition",
  "Exercise & Recovery": "exercise",
  "Biodata": "baseline",
  "Monitor Parameters": "standards",
  "Health Check-In": "check-in",
  "Health Toolkit": "countermeasures",
  "Health Guidance": "living-guide",
  "Alerts & Attention": "alerts",
};

export const PAGE_DISPLAY_LABELS: Record<Page, string> = {
  "Astronaut Dashboard": "Today",
  "Physiological Monitoring": "Heart and breathing",
  "Cabin Conditions": "Cabin air",
  "Orbital Conditions": "Orbit",
  "Mission Overview": "Crew Overview",
  "Health Trends": "Recent days",
  "Calculation Trend": "Your average",
  "Sensorimotor & Reflex": "Practice",
  "Space Nutrition": "Nutrition & Hydration",
  "Exercise & Recovery": "Exercise",
  "Biodata": "Body measurements",
  "Monitor Parameters": "Ranges we use",
  "Health Check-In": "Daily Check-In",
  "Health Toolkit": "How to record",
  "Health Guidance": "Living notes",
  "Alerts & Attention": "Flags",
};

export type NavGroup = {
  pillar: string;
  items: { page: Page; label: string; icon: IconName }[];
};

const navGroups: NavGroup[] = [
  {
    pillar: "Today and the crew",
    items: [
      { page: "Astronaut Dashboard", label: "Today", icon: "activity" },
      { page: "Health Check-In", label: "Daily Check-In", icon: "check" },
      { page: "Sensorimotor & Reflex", label: "Practice", icon: "check" },
      { page: "Alerts & Attention", label: "Flags", icon: "bell" },
      { page: "Mission Overview", label: "Crew Overview", icon: "grid" },
    ],
  },
  {
    pillar: "Readings",
    items: [
      { page: "Physiological Monitoring", label: "Heart and breathing", icon: "pulse" },
      { page: "Health Trends", label: "Recent days", icon: "chart" },
      { page: "Calculation Trend", label: "Your average", icon: "chart" },
      { page: "Biodata", label: "Body measurements", icon: "activity" },
    ],
  },
  {
    pillar: "Around the cabin",
    items: [
      { page: "Cabin Conditions", label: "Cabin air", icon: "thermometer" },
      { page: "Orbital Conditions", label: "Orbit", icon: "globe" },
    ],
  },
  {
    pillar: "Notes and routines",
    items: [
      { page: "Exercise & Recovery", label: "Exercise", icon: "activity" },
      { page: "Space Nutrition", label: "Nutrition & Hydration", icon: "battery" },
      { page: "Health Toolkit", label: "How to record", icon: "help" },
      { page: "Health Guidance", label: "Living notes", icon: "book" },
      { page: "Monitor Parameters", label: "Ranges we use", icon: "pulse" },
    ],
  },
];

const nav: { page: Page; label: string; icon: IconName }[] = navGroups.flatMap((group) => group.items);

function pageTitle(page: Page): string {
  return PAGE_DISPLAY_LABELS[page] || page;
}

function menuLabel(target: Page): string {
  return nav.find((item) => item.page === target)?.label || pageTitle(target);
}

function VisitPractice({
  recordDone,
  practiceDone,
  exerciseDone,
  onRecord,
  onPractice,
  onExercise,
}: {
  recordDone: boolean;
  practiceDone: boolean;
  exerciseDone: boolean;
  onRecord: () => void;
  onPractice: () => void;
  onExercise: () => void;
}) {
  const items = [
    {
      done: recordDone,
      title: "Record today",
      detail: recordDone ? "Saved for this visit" : "Write down today's numbers",
      action: "Record",
      onAction: onRecord,
    },
    {
      done: practiceDone,
      title: "Try one practice",
      detail: practiceDone ? "A practice is saved for this visit" : "Open the short cognition practices",
      action: "Open",
      onAction: onPractice,
    },
    {
      done: exerciseDone,
      title: "Log exercise",
      detail: exerciseDone ? "A session is saved for this visit" : "Write down minutes of exercise",
      action: "Log",
      onAction: onExercise,
    },
  ];
  const doneCount = items.filter((item) => item.done).length;
  return (
    <section className="practice-board" aria-labelledby="visit-practice-title">
      <div>
        <h2 id="visit-practice-title">This visit</h2>
        <p>
          {doneCount} of 3 done. These marks stay until you refresh. They are not a health score.
        </p>
      </div>
      <ol className="practice-list">
        {items.map((item, index) => (
          <li key={item.title} className={item.done ? "is-done" : undefined}>
            <span className="practice-mark">{item.done ? "✓" : index + 1}</span>
            <span className="practice-copy">
              <strong>{item.title}</strong>
              <small>{item.detail}</small>
            </span>
            {!item.done && (
              <button type="button" className="secondary-button" onClick={item.onAction}>
                {item.action}
              </button>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

function pageLede(page: Page): string {
  switch (page) {
    case "Astronaut Dashboard":
      return "Heart rate, blood pressure, sleep, and how tired you feel, next to your average from the last 14 days.";
    case "Physiological Monitoring":
      return "Today's heart rate, blood oxygen, and breathing. The lines follow those stored numbers.";
    case "Cabin Conditions":
      return "Stored samples of cabin pressure, oxygen, carbon dioxide, temperature, and noise.";
    case "Orbital Conditions":
      return "Altitude, speed, and lighting for this mission day.";
    case "Mission Overview":
      return "The same daily readings for each person on this mission.";
    case "Health Trends":
      return "Averages from the last seven stored days, then heart rate, blood pressure, sleep, and how tired you felt across recent mission days.";
    case "Calculation Trend":
      return "How today compares with the average of the previous 14 days.";
    case "Sensorimotor & Reflex":
      return "Short cognition practices, plus a tapping test and a reaction-time test. Scores stay in this browser until you refresh.";
    case "Space Nutrition":
      return "Meals logged for this mission day, with energy and water beside them.";
    case "Exercise & Recovery":
      return "Minutes of exercise on this mission, and a place to write down a session.";
    case "Biodata":
      return "Age, height, mass, and a few body notes for this person.";
    case "Monitor Parameters":
      return "Reference ranges stored for this console. Today's flags use the 14-day comparison, not these ranges.";
    case "Health Check-In":
      return "Write down today's numbers for this visit. The notes on this form are not a medical check.";
    case "Health Toolkit":
      return "Steps for writing a number down, in the same order you would do it.";
    case "Health Guidance":
      return "Notes about sleep, air, and living in a cabin. This is not medical advice and not a NASA manual.";
    case "Alerts & Attention":
      return "Readings that differ from your 14-day average, and anything marked for a second look.";
    default:
      return "Health notes for a long mission.";
  }
}

const tourSteps: TourStep<Page>[] = [
  {
    page: "Astronaut Dashboard",
    selector: "[data-tour='today-numbers']",
    tag: "TODAY",
    title: "Today's numbers",
    description:
      "Heart rate, blood pressure, sleep, and how tired you feel, next to the average of the previous 14 days.",
  },
  {
    page: "Astronaut Dashboard",
    selector: "[data-tour='today-compare']",
    tag: "COMPARE",
    title: "Compared with recent days",
    description:
      "Today's numbers sit next to the previous 14 days. Usual, Different, and Flagged are the labels on this page.",
  },
  {
    page: "Astronaut Dashboard",
    selector: "[data-tour='somatic-avatar']",
    tag: "BODY",
    title: "A picture of the body",
    description:
      "Choose head, chest, arms, or legs to read a short note. The picture does not take a measurement and it does not start a treatment.",
  },
  {
    page: "Astronaut Dashboard",
    selector: "[data-tour='puma-tracker']",
    tag: "BREATH",
    title: "Breathing gas example",
    description:
      "One example breath, with oxygen and carbon dioxide. It is not this person's stored day, and it is not a device.",
  },
  {
    page: "Health Check-In",
    selector: "[data-tour='checkin-suite']",
    tag: "RECORD",
    title: "Daily Check-In",
    description:
      "Press Next. Save is on the review step. The check-in stays in this browser until you refresh.",
  },
  {
    page: "Sensorimotor & Reflex",
    selector: "[data-tour='cognition-suite']",
    tag: "PRACTICE",
    title: "Practice",
    description:
      "Short cognition practices, plus a tapping test and a reaction-time test. Scores stay in this browser until you refresh.",
  },
  {
    page: "Exercise & Recovery",
    selector: "[data-tour='exercise-suite']",
    tag: "EXERCISE",
    title: "Exercise",
    description:
      "Minutes already stored for this mission, and a place to write down one session. It stays in this browser until you refresh.",
  },
  {
    page: "Alerts & Attention",
    selector: "[data-tour='alerts-console']",
    tag: "FLAGS",
    title: "Flags",
    description:
      "Readings that differ from the previous 14 days. This page compares numbers. A sudden or severe feeling belongs to the crew's own emergency steps.",
  },
  {
    page: "Health Guidance",
    selector: "[data-tour='zero-g-guide']",
    tag: "NOTES",
    title: "Living notes",
    description:
      "Notes about sleep, air, and living in a cabin. This is not medical advice and not a NASA manual.",
  },
];
const topics = [
  {
    title: "Sleep & circadian rhythm",
    icon: "moon" as IconName,
    tag: "RECOMMENDED FOR YOU",
    intro: "A consistent sleep routine supports alertness, recovery, and day-to-day performance.",
    consideration:
      "In low Earth orbit, a sunrise occurs approximately every 90 minutes. Light exposure and operational schedules can make a consistent sleep–wake cycle more challenging.",
    guidance:
      "Protect your scheduled sleep period, follow mission lighting protocols, and record sleep duration alongside how rested you feel. Discuss persistent changes with your mission medical team.",
    source: "NASA Human Research Program · Behavioral Health and Performance",
    url: "https://www.nasa.gov/hrp/",
  },
  {
    title: "Fatigue & operational readiness",
    icon: "battery" as IconName,
    tag: "PERFORMANCE",
    intro: "Tracking perceived fatigue adds important context to physiological measurements.",
    consideration:
      "Workload, disrupted sleep, and adaptation to microgravity can influence perceived effort and attention.",
    guidance:
      "Use a consistent personal fatigue scale. Record operational context, follow planned rest periods, and flag changes for mission-team review.",
    source: "NASA Human Research Program · Human Factors and Behavioral Performance",
    url: "https://www.nasa.gov/hrp/",
  },
  {
    title: "Cardiovascular adaptation",
    icon: "heart" as IconName,
    tag: "PHYSIOLOGY",
    intro:
      "Heart rate and blood pressure are most useful when viewed in context and compared over time.",
    consideration:
      "Microgravity changes fluid distribution and the demands placed on the cardiovascular system.",
    guidance:
      "Take readings under comparable conditions, document recent exercise, and follow your mission-approved exercise and measurement protocols.",
    source: "NASA · The Human Body in Space",
    url: "https://www.nasa.gov/humans-in-space/the-human-body-in-space/",
  },
  {
    title: "Mental well-being & connection",
    icon: "smile" as IconName,
    tag: "WELL-BEING",
    intro: "A daily mood check-in creates space to notice and communicate changes in well-being.",
    consideration:
      "Isolation, confinement, and distance from home introduce unique challenges on long-duration missions.",
    guidance:
      "Maintain planned crew and family connections, use personal recreation time, and bring concerns to the designated support team.",
    source: "NASA Human Research Program · Isolation and Confinement",
    url: "https://www.nasa.gov/hrp/",
  },
];

const STATUS_LABEL: Record<Status, string> = {
  Stable: "Usual",
  Observe: "Different",
  Attention: "Flagged",
};

function Badge({ status }: { status: Status }) {
  return (
    <span className={`badge ${status.toLowerCase()}`}>
      <span className="status-dot" />
      {STATUS_LABEL[status]}
    </span>
  );
}
function PanelTitle({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="panel-heading">
      <div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}
function Avatar({
  person = crew[0],
  large = false,
}: {
  person?: (typeof crew)[number];
  large?: boolean;
}) {
  return (
    <div className={`avatar ${large ? "large" : ""}`} style={{ backgroundColor: person.color }}>
      {person.image ? (
        <img src={person.image} alt="" />
      ) : (
        person.initials
      )}
      <span />
    </div>
  );
}

function AccountFacts({
  person,
  onOpenBody,
}: {
  person: (typeof crew)[number];
  onOpenBody: () => void;
}) {
  const bio = biodataFor(person.id);
  const facts: [string, string, string?][] = [
    ["Crew ID", person.id.toUpperCase()],
    ["Mission", mission.name],
    ["Sex", bio.sex],
    ["Age", `${bio.ageYears} years`, "Age in years."],
    ["Height", `${bio.statureCm} cm`, "Standing height."],
    ["Mass now", `${bio.massKgInflight} kg`, "Body mass on this mission day."],
    ["Mass on the ground", `${bio.massKgGround} kg`, "Body mass before the mission."],
    [
      "Body mass index now",
      String(bio.bmiInflight),
      "Mass in kilograms divided by height in meters, squared. This mission day.",
    ],
    [
      "Body mass index on the ground",
      String(bio.bmiGround),
      "The same index, using the mass from before the mission.",
    ],
    [
      "Fat-free mass now",
      `${bio.fatFreeMassKgInflight} kg`,
      "Body mass that is not fat: muscle, bone, and water. This mission day.",
    ],
    [
      "Fat-free mass on the ground",
      `${bio.fatFreeMassKgGround} kg`,
      "Fat-free mass before the mission.",
    ],
    ["Fat mass", `${bio.fatMassKgInflight} kg`, "The part of body mass that is fat."],
    ["Blood type", bio.bloodTypeLabel, "The blood-type name stored on this profile."],
    ["Dominant side", bio.dominantSide, "The hand this person uses most."],
    [
      "Training-habitat days",
      String(bio.analogDays),
      "Days this person has spent in a training habitat on Earth.",
    ],
    ["Mission length", bio.missionDurationType, "How this mission is grouped by length."],
  ];
  return (
    <>
      <p className="account-role">{person.role}</p>
      <div className="account-facts">
        {facts.map(([label, value, tip]) => (
          <div key={label}>
            <span>{tip ? <Term tip={tip}>{label}</Term> : label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <button className="primary-button" type="button" onClick={onOpenBody}>
        Body measurements
        <Icon name="arrow" size={16} />
      </button>
    </>
  );
}

function Sparkline({ type = 0, amber = false }: { type?: number; amber?: boolean }) {
  const lines = [
    "0,28 9,25 17,30 27,19 36,24 45,21 53,27 63,17 72,23 81,12 91,21 100,13 110,20 120,15",
    "0,18 10,15 20,19 30,12 40,17 50,15 60,21 70,14 80,18 90,13 100,20 110,14 120,17",
    "0,9 10,13 20,10 30,17 40,14 50,19 60,17 70,26 80,22 90,28 100,25 110,31 120,28",
    "0,31 12,31 12,26 27,26 27,22 42,22 42,26 57,26 57,17 72,17 72,12 87,12 87,17 104,17 104,11 120,11",
  ];
  return (
    <svg
      className={`sparkline ${amber ? "amber-line" : ""}`}
      viewBox="0 0 120 42"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d="M0 29H120" stroke="currentColor" opacity=".12" strokeDasharray="3 4" />
      <polyline
        points={lines[type % lines.length]}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}



export type ConsoleProps = {
  crewId: string;
  allowCrewSwitch: boolean;
  portal: "astronaut" | "admin";
  onSignOut: () => void;
};

function getInitialPage(): Page {
  if (typeof window === "undefined") return "Astronaut Dashboard";
  const hash = window.location.hash.replace(/^#\/?/, "").toLowerCase();
  if (hash && PAGE_HASH_MAP[hash]) {
    return PAGE_HASH_MAP[hash];
  }
  return "Astronaut Dashboard";
}

function App({ crewId, allowCrewSwitch, portal, onSignOut }: ConsoleProps) {
  const [page, setPage] = useState<Page>(getInitialPage);
  const [selectedCrew, setSelectedCrew] = useState(() => {
    const index = crew.findIndex((person) => person.id === crewId);
    return index >= 0 ? index : 0;
  });
  const signedIn = true;
  const [readings, setReadings] = useState<Reading[]>(() =>
    crew.map((person) => ({ ...latestRecord(person.id).reading })),
  );
  const [samples, setSamples] = useState<BodySample[]>(() => crew.map((person) => bodySampleFor(person.id)));
  const [showArrival, setShowArrival] = useState(
    () => typeof localStorage === "undefined" || localStorage.getItem("tanaworbit_arrived") !== "1",
  );
  const [exerciseSessions, setExerciseSessions] = useState<ExerciseRecord[]>(() => [
    ...initialExercises,
  ]);
  const [drafts, setDrafts] = useState<CheckInDraft[]>(() =>
    readings.map((reading) => ({ ...reading })),
  );
  const [checkedIn, setCheckedIn] = useState<boolean[]>(() => crew.map(() => false));
  const [metric, setMetric] = useState("Heart rate");
  const [period, setPeriod] = useState("7 days");
  const [alertFilter, setAlertFilter] = useState("All statuses");
  const [reviewed, setReviewed] = useState<string[]>([]);
  const [keptNotes, setKeptNotes] = useState<Record<string, string>>({});
  const [cognitionLog, setCognitionLog] = useState<Record<string, CognitionEntry[]>>({});
  const [topic, setTopic] = useState(0);
  const [modal, setModal] = useState<"about" | "settings" | "export" | "onboarding" | "account" | "simulation" | null>(null);
  const [tourIndex, setTourIndex] = useState(0);
  const tourReady = useRef(false);
  const [narrow, setNarrow] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 760px)").matches : false,
  );
  const [noticesOpen, setNoticesOpen] = useState(false);
  const [accountNote, setAccountNote] = useState<string | null>(null);
  const [accountNoteSeen, setAccountNoteSeen] = useState(true);
  const noticeRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("tanaworbit_theme") as "dark" | "light") || "dark";
    }
    return "dark";
  });
  const [symptomLogs, setSymptomLogs] = useState<SymptomLog[]>([]);
  const [toast, setToast] = useState("");
  const [toastTone, setToastTone] = useState<"success" | "info">("success");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [units, setUnits] = useState("Celsius");
  const [toolkitTab, setToolkitTab] = useState<ToolkitTab>("measure");
  const [toolkitMetric, setToolkitMetric] = useState<MetricId>("heart");
  const [contextId, setContextId] = useState("orbital");
  const [guideOpen, setGuideOpen] = useState(false);
  const [guideLauncherHidden, setGuideLauncherHidden] = useState(() => {
    try {
      return localStorage.getItem("tanaw_guide_launcher_hidden") === "true";
    } catch {
      return false;
    }
  });
  const [guideLauncherMinimized, setGuideLauncherMinimized] = useState(() => {
    try {
      return localStorage.getItem("tanaw_guide_launcher_minimized") === "true";
    } catch {
      return false;
    }
  });
  const [guidanceReviewed, setGuidanceReviewed] = useState<Record<string, boolean>>({});
  const [pendingMetric, setPendingMetric] = useState<MetricId | null>(null);
  const display = useConsoleDisplay();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("tanaworbit_theme", theme);
  }, [theme]);

  useEffect(() => {
    if (page !== "Health Check-In" || !pendingMetric) return;
    const selectors: Record<MetricId, string> = {
      heart: "#checkin-heart",
      pressure: "#checkin-systolic",
      sleep: "#checkin-sleep",
      fatigue: ".fatigue-choices button[aria-pressed='true']",
      mood: ".mood-choices button[aria-pressed='true']",
      exercise: "",
    };
    const frame = requestAnimationFrame(() => {
      const element = document.querySelector<HTMLElement>(
        selectors[pendingMetric] || "#checkin-heart",
      );
      element?.focus();
      element?.scrollIntoView({ block: "center", behavior: "instant" });
      setPendingMetric(null);
    });
    return () => cancelAnimationFrame(frame);
  }, [page, pendingMetric]);
  useEffect(() => {
    if (!sidebarOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const drawer = document.querySelector<HTMLElement>(".sidebar");
    const controls = () => Array.from(drawer?.querySelectorAll<HTMLElement>("button") ?? []);
    controls()[0]?.focus();
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setSidebarOpen(false);
      if (event.key !== "Tab") return;
      const buttons = controls();
      if (event.shiftKey && document.activeElement === buttons[0]) {
        event.preventDefault();
        buttons[buttons.length - 1]?.focus();
      }
      if (!event.shiftKey && document.activeElement === buttons[buttons.length - 1]) {
        event.preventDefault();
        buttons[0]?.focus();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      previousFocus?.focus();
    };
  }, [sidebarOpen]);
  useEffect(() => {
    if (!modal) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const dialog = document.querySelector<HTMLElement>('[role="dialog"]');
    const focusable = () =>
      Array.from(
        dialog?.querySelectorAll<HTMLElement>(
          'button, select, a[href], input, textarea, [tabindex="0"]',
        ) ?? [],
      );
    focusable()[0]?.focus();
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setModal(null);
      if (event.key !== "Tab") return;
      const elements = focusable();
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      }
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      previousFocus?.focus();
    };
  }, [modal]);
  const person = crew[selectedCrew];
  const reading = readings[selectedCrew];
  const baseline = personalBaseline(person.id);
  const flags = observationFlags(reading, baseline);
  const sleepObserve = flags.sleep;
  const fatigueObserve = flags.fatigue;
  const currentStatus = crewStatus(selectedCrew, reading);
  const heartObserve = flags.heart;
  const bpObserve = flags.pressure;
  const context = missionContexts.find((item) => item.id === contextId)!;
  const routineComplete = {
    checkin: checkedIn[selectedCrew],
    exercise: exerciseSessions.some(
      (item) =>
        item.crewId === person.id &&
        item.missionDay === mission.day &&
        item.source === "manual_demo",
    ),
    guidance: Boolean(guidanceReviewed[person.id]),
  };
  const routineCount = Object.values(routineComplete).filter(Boolean).length;
  const reminder = useRoutineReminders(
    signedIn,
    person.id,
    routineCount === routineDefinitions.length,
  );
  function signOut() {
    setSidebarOpen(false);
    setModal(null);
    setToast("");
    setGuideOpen(false);
    onSignOut();
  }
  function navigate(next: Page) {
    setPage(next);
    if (typeof window !== "undefined") {
      const slug = PAGE_TO_HASH[next] || "overview";
      window.location.hash = slug;
    }
    if (window.innerWidth <= 760) setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, "").toLowerCase();
      if (hash && PAGE_HASH_MAP[hash]) {
        setPage(PAGE_HASH_MAP[hash]);
      }
    };
    window.addEventListener("hashchange", onHashChange);
    if (!window.location.hash) {
      window.location.hash = PAGE_TO_HASH[page] || "overview";
    }
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [page]);

  useEffect(() => {
    const activeEl = document.querySelector(".sidebar-nav .nav-item.active");
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [page]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 760px)");
    const onChange = () => setNarrow(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!noticesOpen) return;
    function onPointer(event: MouseEvent) {
      if (noticeRef.current?.contains(event.target as Node)) return;
      setNoticesOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [noticesOpen]);

  useEffect(() => {
    setAccountNote(null);
    setAccountNoteSeen(true);
  }, [selectedCrew]);

  useEffect(() => {
    if (!tourReady.current) {
      tourReady.current = true;
      return;
    }
  }, [modal]);

  useEffect(() => {
    if (typeof localStorage !== "undefined" && crew[selectedCrew]) {
      localStorage.setItem("tanaworbit_crew_id", crew[selectedCrew].id);
    }
  }, [selectedCrew]);
  function openToolkit(tab: ToolkitTab = "measure", metric?: MetricId) {
    setGuideOpen(false);
    setModal(null);
    setToolkitTab(tab);
    if (metric) setToolkitMetric(metric);
    navigate("Health Toolkit");
  }
  function openRecord(metric: MetricId) {
    setGuideOpen(false);
    if (metric === "exercise") navigate("Exercise & Recovery");
    else {
      setPendingMetric(metric);
      navigate("Health Check-In");
    }
  }
  function notify(message: string, tone: "success" | "info" = "success") {
    setToastTone(tone);
    setToast(message);
    window.setTimeout(() => setToast(""), 4500);
  }
  function dismissArrival() {
    localStorage.setItem("tanaworbit_arrived", "1");
    setShowArrival(false);
  }
  function openModal(next: "about" | "settings" | "export" | "simulation" | "onboarding" | "account") {
    setSidebarOpen(false);
    setNoticesOpen(false);
    setModal(next);
  }
  function openAccount(source?: "profile" | "notice") {
    const bio = biodataFor(person.id);
    const line = `${bio.ageYears} years · ${bio.statureCm} cm · ${bio.massKg} kg · blood type ${bio.bloodTypeLabel}`;
    const fromNotice = source === "notice";
    setAccountNote(`${person.name}. ${line}`);
    setAccountNoteSeen(true);
    setNoticesOpen(false);
    setSidebarOpen(false);
    setModal("account");
  }
  function exportData() {
    const cell = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const rows = [
      ["TanawOrbit health summary"],
      [
        "Crew member",
        "Mission day",
        "Heart rate (bpm)",
        "BP systolic (mmHg)",
        "BP diastolic (mmHg)",
        "Sleep (h)",
        "Fatigue (1–5)",
        "Mood",
      ],
      [
        person.name,
        String(mission.day),
        String(reading.heart),
        String(reading.systolic),
        String(reading.diastolic),
        String(reading.sleep),
        String(reading.fatigue),
        reading.mood,
      ],
    ];
    const practice = cognitionLog[person.id] ?? [];
    if (practice.length) {
      rows.push([]);
      rows.push(["Cognition practice"]);
      rows.push(["Task", "Score", "Unit", "Detail"]);
      for (const entry of practice) {
        rows.push([entry.label, String(entry.score), entry.unit, entry.detail]);
      }
    }
    const blob = new Blob([rows.map((r) => r.map((value) => cell(value)).join(",")).join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tanaworbit-${person.name.toLowerCase().replace(" ", "-")}-day${mission.day}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    notify("Health summary exported as CSV.");
    setModal(null);
  }
  const alerts = [
    {
      id: "sleep",
      status: (sleepObserve ? "Observe" : "Stable") as Status,
      title: sleepObserve
        ? "Sleep is shorter than the 14-day average"
        : "Sleep is close to the 14-day average",
      text: `${reading.sleep} hours today, next to a ${baseline.sleep}-hour average of the previous 14 days.`,
      time: "08:32",
      icon: "moon" as IconName,
    },
    {
      id: "fatigue",
      status: (fatigueObserve ? "Observe" : "Stable") as Status,
      title: fatigueObserve
        ? "How tired is higher than the 14-day average"
        : "How tired is close to the 14-day average",
      text: `How tired is ${reading.fatigue} out of 5 today. The 14-day average is ${baseline.fatigue} out of 5.`,
      time: "08:32",
      icon: "battery" as IconName,
    },
    {
      id: "heart",
      status: (heartObserve ? "Observe" : "Stable") as Status,
      title: heartObserve
        ? "Heart rate is past the mark"
        : "Heart rate is close to the 14-day average",
      text: `${reading.heart} bpm today. The 14-day average is ${baseline.heart} bpm.`,
      time: "08:30",
      icon: "heart" as IconName,
    },
    ...(bpObserve
      ? [
          {
            id: "bp",
            status: "Observe" as Status,
            title: "Blood pressure is past the mark",
            text: `${reading.systolic}/${reading.diastolic} mmHg today. The 14-day average is ${baseline.systolic}/${baseline.diastolic} mmHg.`,
            time: "08:32",
            icon: "pressure" as IconName,
          },
        ]
      : []),
    ...(person.reviewRequested
      ? [
          {
            id: "review",
            status: "Attention" as Status,
            title: "Check-in context requires review",
            text: "A crew note asks the mission health team for a second look.",
            time: "08:20",
            icon: "info" as IconName,
          },
        ]
      : []),
  ];

  function MetricCards() {
    const cards: {
      name: string;
      icon: IconName;
      value: string;
      unit: string;
      base: string;
      status: Status;
      note: string;
      type: number;
    }[] = [
      {
        name: "Heart rate",
        icon: "heart",
        value: String(reading.heart),
        unit: "bpm",
        base: `${baseline.heart} bpm`,
        status: heartObserve ? "Observe" : "Stable",
        note: `${Number((reading.heart - baseline.heart).toFixed(1)) >= 0 ? "+" : ""}${Number((reading.heart - baseline.heart).toFixed(1))} bpm from your average`,
        type: 0,
      },
      {
        name: "Blood pressure",
        icon: "pressure",
        value: `${reading.systolic}/${reading.diastolic}`,
        unit: "mmHg",
        base: `${baseline.systolic}/${baseline.diastolic} mmHg`,
        status: bpObserve ? "Observe" : "Stable",
        note: bpObserve ? "Different from your average" : "Close to your average",
        type: 1,
      },
      {
        name: "Sleep",
        icon: "moon",
        value: String(reading.sleep),
        unit: "hrs",
        base: `${baseline.sleep} hrs`,
        status: sleepObserve ? "Observe" : "Stable",
        note:
          Math.abs(reading.sleep - baseline.sleep) < 0.05
            ? "Matches your 14-day average"
            : `${Math.abs(reading.sleep - baseline.sleep).toFixed(1)} hrs ${reading.sleep < baseline.sleep ? "below" : "above"} your average`,
        type: 2,
      },
      {
        name: "How tired",
        icon: "battery",
        value: String(reading.fatigue),
        unit: "/ 5",
        base: `${baseline.fatigue} / 5`,
        status: fatigueObserve ? "Observe" : "Stable",
        note: "Self-reported · 1 low, 5 high",
        type: 3,
      },
    ];
    return (
      <>
        <div className="metric-grid">
          {cards.map((card) => (
            <button
              className="metric-card"
              key={card.name}
              onClick={() => {
                setMetric(
                  card.name === "How tired"
                    ? "Fatigue"
                    : card.name === "Sleep"
                      ? "Sleep"
                      : card.name === "Blood pressure"
                        ? "Blood pressure"
                        : "Heart rate",
                );
                navigate("Health Trends");
              }}
            >
              <div className="metric-top">
                <span>
                  <Icon name={card.icon} size={17} />
                  <Term>{card.name}</Term>
                </span>
                <span className={`mini-dot ${card.status.toLowerCase()}`} title={card.status} />
              </div>
              <div className="metric-value">
                {card.value}
                <span>{card.unit}</span>
              </div>
              <div className="metric-baseline">
                14-day average <b>{card.base}</b>
              </div>
              <div className="metric-bottom">
                <span className={card.status === "Observe" ? "amber-text" : ""}>{card.note}</span>
                <Sparkline type={card.type} amber={card.status === "Observe"} />
              </div>
            </button>
          ))}
        </div>
        <div className="secondary-metrics">
          <div>
            <span className="secondary-icon">
              <Icon name="smile" />
            </span>
            <div>
              <span>
                <Term>Mood</Term>
              </span>
              <strong>
                {reading.mood} <small>Self-reported</small>
              </strong>
            </div>
            <span className="recorded-note">Self-reported</span>
          </div>
          <div>
            <span className="secondary-icon">
              <Icon name="thermometer" />
            </span>
            <div>
              <span>
                <Term>Temperature</Term>
              </span>
              <strong>
                {units === "Celsius"
                  ? samples[selectedCrew].temperatureC
                  : ((samples[selectedCrew].temperatureC * 9) / 5 + 32).toFixed(1)}
                <small>°{units === "Celsius" ? "C" : "F"}</small>
              </strong>
            </div>
            <span className="recorded-note">Stored sample</span>
          </div>
          <div>
            <span className="secondary-icon">
              <Icon name="pulse" />
            </span>
            <div>
              <span>
                <Term>Blood oxygen</Term>
              </span>
              <strong>
                {samples[selectedCrew].spo2} <small>% SpO₂</small>
              </strong>
            </div>
            <span className="recorded-note">Stored sample</span>
          </div>
          <div>
            <span className="secondary-icon">
              <Icon name="battery" />
            </span>
            <div>
              <span>
                <Term>Blood sugar</Term>
              </span>
              <strong>
                {samples[selectedCrew].glucoseMgDl} <small>mg/dL</small>
              </strong>
            </div>
            <span className="recorded-note">Stored sample</span>
          </div>
          <div>
            <span className="secondary-icon">
              <Icon name="wind" />
            </span>
            <div>
              <span>
                <Term>Breathing</Term>
              </span>
              <strong>
                {samples[selectedCrew].respiration} <small>breaths/min</small>
              </strong>
            </div>
            <span className="recorded-note">Stored sample</span>
          </div>
        </div>
      </>
    );
  }

  function TrendPanel({ expanded = false }: { expanded?: boolean }) {
    const [hover, setHover] = useState<number | null>(null);
    const isSleep = metric === "Sleep";
    const isFatigue = metric === "Fatigue";
    const isBP = metric === "Blood pressure";
    const value = isSleep
      ? reading.sleep
      : isFatigue
        ? reading.fatigue
        : isBP
          ? reading.systolic
          : reading.heart;
    const base = isSleep
      ? baseline.sleep
      : isFatigue
        ? baseline.fatigue
        : isBP
          ? baseline.systolic
          : baseline.heart;
    const unit = isSleep ? "hrs" : isFatigue ? "/ 5" : isBP ? "mmHg" : "bpm";
    const days = period === "7 days" ? 7 : period === "14 days" ? 14 : 30;
    const series = historyFor(person.id, days).map((record) =>
      record.missionDay === mission.day ? reading : record.reading,
    );
    const samples = series.map((record) =>
      isSleep ? record.sleep : isFatigue ? record.fatigue : isBP ? record.systolic : record.heart,
    );
    const diastolicSamples = series.map((record) => record.diastolic);
    const min = Math.max(
      0,
      Math.min(
        isSleep ? 4 : isFatigue ? 0 : isBP ? 60 : 50,
        value - 2,
        ...(isBP ? [reading.diastolic - 5] : []),
      ),
    );
    const max = Math.max(
      isSleep ? 10 : isFatigue ? 5 : isBP ? 140 : 90,
      value + (isFatigue ? 0 : 2),
    );
    const px = (i: number) => 48 + (i / (days - 1)) * 660;
    const py = (v: number) => 193 - ((v - min) / (max - min)) * 160;
    const points = samples.map((v, i) => `${px(i)},${py(v)}`).join(" ");
    const baselineY = py(base);
    return (
      <section className={`panel trend-panel ${expanded ? "expanded" : ""}`}>
        <PanelTitle
          title="Recent days"
          description={`Sample history, next to the average of the previous ${rules.baselineWindowDays} days.`}
          action={
            <select
              aria-label="Trend date range"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option>7 days</option>
              <option>14 days</option>
              <option>30 days</option>
            </select>
          }
        />
        <div className="chart-tabs">
          {(
            [
              ["Heart rate", "Heart rate"],
              ["Blood pressure", "Blood pressure"],
              ["Sleep", "Sleep"],
              ["Fatigue", "How tired"],
            ] as const
          ).map(([id, label]) => (
            <button key={id} className={metric === id ? "selected" : ""} onClick={() => setMetric(id)}>
              {label}
            </button>
          ))}
        </div>
        <div className="chart-meta">
          <div>
            <strong>
              {hover === null ? value : Number(samples[hover].toFixed(1))}
              {isBP && `/${hover === null ? reading.diastolic : diastolicSamples[hover]}`}
              <span>{unit}</span>
            </strong>
            <span className="muted">
              {hover === null
                ? "Latest measurement"
                : `Mission day ${mission.day - days + 1 + hover}`}
            </span>
          </div>
          <div className="chart-legend">
            <span>
              <i className="legend-line cyan" />
              Recorded {isBP ? "systolic" : "measurement"}
            </span>
            {isBP && (
              <span>
                <i className="legend-line purple" />
                Diastolic
              </span>
            )}
            <span>
              <i className="legend-line dashed" />
              Personal baseline
            </span>
          </div>
        </div>
        <div className="chart-wrap">
          <svg
            viewBox="0 0 750 232"
            role="img"
            aria-label={`${metric} trend over ${days} days, latest ${value}${isBP ? `/${reading.diastolic}` : ""} ${unit}, personal baseline ${base}${isBP ? `/${baseline.diastolic}` : ""} ${unit}`}
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                event.preventDefault();
                setHover((index) =>
                  Math.max(
                    0,
                    Math.min(days - 1, (index ?? days - 1) + (event.key === "ArrowLeft" ? -1 : 1)),
                  ),
                );
              }
              if (event.key === "End") {
                event.preventDefault();
                setHover(null);
              }
            }}
            onMouseLeave={() => {
              if (!display.touch) setHover(null);
            }}
          >
            <defs>
              <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity=".18" />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
              </linearGradient>
            </defs>
            {Array.from({ length: 5 }, (_, i) => {
              const y = 33 + i * 40;
              return (
                <g key={i}>
                  <text x="30" y={y + 4} textAnchor="end" className="axis-label">
                    {Number((max - ((max - min) / 4) * i).toFixed(1))}
                  </text>
                  <line x1="48" y1={y} x2="708" y2={y} className="grid-line" />
                </g>
              );
            })}
            <line
              x1="48"
              y1={baselineY}
              x2="708"
              y2={baselineY}
              stroke="var(--subtle)"
              strokeDasharray="5 5"
              strokeWidth="1.2"
            />
            <polygon points={`48,193 ${points} 708,193`} fill="url(#chartFill)" />
            <polyline
              points={points}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2.3"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {isBP && (
              <g pointerEvents="none">
                <line
                  x1="48"
                  y1={py(baseline.diastolic)}
                  x2="708"
                  y2={py(baseline.diastolic)}
                  stroke="var(--amber)"
                  strokeDasharray="5 5"
                  strokeWidth="1"
                  opacity=".65"
                />
                <polyline
                  points={diastolicSamples.map((v, i) => `${px(i)},${py(v)}`).join(" ")}
                  fill="none"
                  stroke="var(--amber)"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                {diastolicSamples.map((v, i) => (
                  <circle
                    key={i}
                    cx={px(i)}
                    cy={py(v)}
                    r={i === days - 1 ? 4 : 2.7}
                    fill="var(--panel)"
                    stroke="var(--amber)"
                    strokeWidth="1.5"
                  />
                ))}
              </g>
            )}
            {samples.map((v, i) => (
              <g key={i}>
                <rect
                  x={px(i) - 330 / days}
                  y="15"
                  width={660 / days}
                  height="185"
                  fill="transparent"
                  onMouseEnter={() => setHover(i)}
                  onPointerDown={() => setHover(i)}
                />
                <circle
                  cx={px(i)}
                  cy={py(v)}
                  r={i === days - 1 || hover === i ? 4 : 2.7}
                  fill={i === days - 1 ? "var(--accent)" : "var(--panel)"}
                  stroke="var(--accent)"
                  strokeWidth="1.8"
                  pointerEvents="none"
                />
                {hover === i && (
                  <line
                    x1={px(i)}
                    x2={px(i)}
                    y1="25"
                    y2="194"
                    stroke="var(--accent)"
                    opacity=".25"
                    pointerEvents="none"
                  />
                )}
              </g>
            ))}
            {Array.from({ length: 7 }, (_, i) => {
              const index = Math.round((i / 6) * (days - 1));
              return (
                <text key={i} x={px(index)} y="221" className="axis-label" textAnchor="middle">
                  Day {mission.day - days + 1 + index}
                </text>
              );
            })}
          </svg>
        </div>
        <div className="chart-selection-controls">
          <span>
            <Icon name="info" size={14} />
            Tap the chart or use the controls to inspect a day.
          </span>
          <div>
            <button
              aria-label="Previous measurement"
              disabled={hover === 0}
              onClick={() => setHover(Math.max(0, (hover ?? days - 1) - 1))}
            >
              <Icon name="chevron" className="reverse-icon" size={16} />
            </button>
            <span>Day {hover === null ? mission.day : mission.day - days + 1 + hover}</span>
            <button
              aria-label="Next measurement"
              disabled={hover === null || hover === days - 1}
              onClick={() => setHover(Math.min(days - 1, (hover ?? days - 1) + 1))}
            >
              <Icon name="chevron" size={16} />
            </button>
          </div>
        </div>
        <div className="chart-footer">
          <Icon name="info" size={14} />
          <span>
            The line is the average of the previous {rules.baselineWindowDays} days.
          </span>
          {!expanded && (
            <button className="text-button" onClick={() => navigate("Health Trends")}>
              See more days <Icon name="arrow" size={15} />
            </button>
          )}
        </div>
      </section>
    );
  }

  function RecentChanges() {
    return (
      <section className="panel changes-panel">
        <PanelTitle
          title="Compared with your average"
          action={
            <span className="count-badge">
              {Number(sleepObserve) +
                Number(fatigueObserve) +
                Number(heartObserve) +
                Number(bpObserve)}
            </span>
          }
        />
        <div className="changes-list">
          <div className="change-item">
            <span className={`change-icon ${sleepObserve ? "amber-text" : "green-text"}`}>
              <Icon name="moon" size={18} />
            </span>
            <div>
              <div className="change-title">
                <Term>Sleep duration</Term>{" "}
                <span className={sleepObserve ? "amber-text" : "green-text"}>
                  {sleepObserve ? "↓" : "↔"} {Math.abs(reading.sleep - baseline.sleep).toFixed(1)}{" "}
                  hrs
                </span>
              </div>
              <p>
                {sleepObserve
                  ? "Shorter than your 14-day average."
                  : "Close to your 14-day average."}
              </p>
              <small>
                Today {reading.sleep} hrs <span>·</span> Average {baseline.sleep} hrs
              </small>
            </div>
          </div>
          <div className="change-item">
            <span className={`change-icon ${fatigueObserve ? "amber-text" : "green-text"}`}>
              <Icon name="battery" size={18} />
            </span>
            <div>
              <div className="change-title">
                <Term>How tired</Term>{" "}
                <span className={fatigueObserve ? "amber-text" : "green-text"}>
                  {fatigueObserve ? "↑" : "↔"}{" "}
                  {Math.abs(reading.fatigue - baseline.fatigue).toFixed(1)} pts
                </span>
              </div>
              <p>
                {fatigueObserve
                  ? "You marked yourself more tired than your average."
                  : "Close to how tired you usually mark yourself."}
              </p>
              <small>
                Today {reading.fatigue}/5 <span>·</span> Average {baseline.fatigue}/5
              </small>
            </div>
          </div>
          <div className="change-item">
            <span className={`change-icon ${heartObserve ? "amber-text" : "green-text"}`}>
              <Icon name="heart" size={18} />
            </span>
            <div>
              <div className="change-title">
                <Term>Heart rate</Term>{" "}
                <span className={heartObserve ? "amber-text" : "green-text"}>
                  {heartObserve ? "Different" : "Usual"}
                </span>
              </div>
              <p>
                {heartObserve
                  ? "Different from your 14-day average."
                  : "Close to your 14-day average."}
              </p>
            </div>
          </div>
        </div>
        <button className="panel-link" onClick={() => navigate("Alerts & Attention")}>
          See the flags <Icon name="arrow" size={16} />
        </button>
      </section>
    );
  }

  function Physiology() {
    return (
      <LiveWaveformStream
        heartRate={reading.heart}
        spo2={samples[selectedCrew].spo2}
        respiration={samples[selectedCrew].respiration}
      />
    );
  }

  function Insights({ full = false }: { full?: boolean }) {
    return (
      <section className={`panel insights-panel ${full ? "full-insights" : ""}`}>
        <PanelTitle
          title="Sleep"
          description="Compared with your average from the last 14 days."
          action={
            <span className="subtle-icon">
              <Icon name="shield" size={18} />
            </span>
          }
        />
        <div className="insight-content">
          <div className="insight-heading">
            <span className="insight-symbol">
              <Icon name="moon" size={19} />
            </span>
            <div>
              <h3>
                {sleepObserve
                  ? "Sleep is shorter than your recent average"
                  : "Sleep is close to your recent average"}
              </h3>
              <span>Last {rules.baselineWindowDays} mission days, not counting today</span>
            </div>
          </div>
          <div className="insight-comparison">
            <div>
              <span>Current sleep</span>
              <strong>
                {reading.sleep}
                <small>hrs</small>
              </strong>
            </div>
            <div>
              <span>14-day average</span>
              <strong>
                {baseline.sleep}
                <small>hrs</small>
              </strong>
            </div>
            <div>
              <span>Difference</span>
              <strong className={sleepObserve ? "amber-text" : "green-text"}>
                {Math.abs(reading.sleep - baseline.sleep) < 0.05
                  ? "↔"
                  : reading.sleep < baseline.sleep
                    ? "↓"
                    : "↑"}{" "}
                {Math.abs(reading.sleep - baseline.sleep).toFixed(1)}
                <small>hrs</small>
              </strong>
            </div>
          </div>
          <p>
            Sleep is{" "}
            {Math.abs(reading.sleep - baseline.sleep) < 0.05
              ? "the same as your average"
              : reading.sleep < baseline.sleep
                ? "shorter than your average"
                : "longer than your average"}
            {fatigueObserve ? ", and you marked yourself more tired" : ""}.
          </p>
        </div>
        <button
          className="panel-link"
          onClick={() => {
            setTopic(0);
            navigate("Health Guidance");
          }}
        >
          Read the sleep note <Icon name="arrow" size={16} />
        </button>
      </section>
    );
  }

  const tourOn = modal === "onboarding";
  const tourHere = tourSteps[tourIndex];
  const tourNext = tourSteps[tourIndex + 1];
  const tourOnStep = Boolean(tourHere && page === tourHere.page);
  const tourTargetPage = tourHere
    ? tourOnStep && tourNext
      ? tourNext.page
      : tourHere.page
    : null;
  const tourPointMenu = tourOn && narrow && !sidebarOpen && !(tourOnStep && !tourNext);

  function finishTour() {
    localStorage.setItem("tanaworbit_onboarded", "1");
    setModal(null);
    setTourIndex(0);
    if (window.innerWidth <= 760) setSidebarOpen(false);
  }

  function pointAtMenu(target: Page) {
    if (window.innerWidth <= 760) setSidebarOpen(true);
    window.setTimeout(() => {
      document
        .querySelector<HTMLElement>(`[data-tour-page="${target}"]`)
        ?.scrollIntoView({ block: "center" });
    }, 60);
  }

  const practiceDone = (cognitionLog[person.id] ?? []).length > 0;
  const exerciseDone = routineComplete.exercise;
  const recordDone = checkedIn[selectedCrew];
  const cue = !recordDone
    ? page === "Health Check-In"
      ? {
          kicker: "Step 1 of 3",
          title: "You are recording today",
          detail: "Press Next. Save is on the review step.",
        }
      : {
          kicker: "Step 1 of 3",
          title: "Next: record today",
          detail: "Write down today's numbers. They stay in this browser until you refresh.",
          action: "Record today",
          go: () => navigate("Health Check-In"),
        }
    : !practiceDone
      ? page === "Sensorimotor & Reflex"
        ? {
            kicker: "Step 2 of 3",
            title: "You are on the practice",
            detail: "Finish any one practice. That marks this step.",
          }
        : {
            kicker: "Step 2 of 3",
            title: "Next: try one practice",
            detail: "Today is recorded. Open the short practices.",
            action: "Try one practice",
            go: () => navigate("Sensorimotor & Reflex"),
          }
      : !exerciseDone
        ? page === "Exercise & Recovery"
          ? {
              kicker: "Step 3 of 3",
              title: "You are logging exercise",
              detail: "Press Review session, then Confirm session.",
            }
          : {
              kicker: "Step 3 of 3",
              title: "Next: log exercise",
              detail: "The practice is done. Write down the minutes.",
              action: "Log exercise",
              go: () => navigate("Exercise & Recovery"),
            }
        : {
            kicker: "Visit complete",
            title: "The three steps are done",
            detail: "The guide explains a word when you are unsure. The answers are written ahead of time.",
            action: "Open the guide",
            go: () => setGuideOpen(true),
          };
  const tourBlocked =
    tourOn && tourHere && tourNext && tourNext.page !== tourHere.page ? menuLabel(tourNext.page) : null;

  return (
    <>
      <div
        className={`app-shell ${display.touch ? "touch-mode" : "desktop-mode"}`}
        inert={guideOpen}
        aria-hidden={guideOpen ? true : undefined}
      >
        {sidebarOpen && (
          <button
            aria-label="Close navigation"
            className="sidebar-overlay"
            onClick={() => {
              if (modal === "onboarding") return;
              setSidebarOpen(false);
            }}
          />
        )}
        <aside
          className={`sidebar ${sidebarOpen ? "is-open" : ""}`}
          role={sidebarOpen ? "dialog" : undefined}
          aria-modal={sidebarOpen ? true : undefined}
          aria-label={sidebarOpen ? "All console screens" : undefined}
        >
          <button
            className="brand"
            onClick={() => navigate("Astronaut Dashboard")}
            aria-label="TanawOrbit home"
          >
            <img className="brand-mark" src="/images/tanaworbit-mark.svg" alt="" />
            <span>
              TanawOrbit<small>Crew health</small>
            </span>
          </button>
          <div className="workspace-label">Pages</div>
          <nav aria-label="Main navigation" className="sidebar-grouped-nav sidebar-nav">
            {navGroups.map((group) => (
              <div key={group.pillar} className="nav-group-section">
                <div className="nav-group-label">{group.pillar}</div>
                <div className="space-y-0.5">
                  {group.items.map(({ page: target, label, icon }) => (
                    <button
                      key={target}
                      data-tour-page={target}
                      className={
                        page === target
                          ? tourOn && tourTargetPage === target && !tourPointMenu
                            ? "nav-item active is-tour-target"
                            : "nav-item active"
                          : tourOn && tourTargetPage === target && !tourPointMenu
                            ? "nav-item is-tour-target"
                            : "nav-item"
                      }
                      aria-current={page === target ? "page" : undefined}
                      onClick={() => {
                        const here = tourSteps[tourIndex];
                        const following = tourSteps[tourIndex + 1];
                        if (
                          modal === "onboarding" &&
                          here &&
                          following &&
                          page === here.page &&
                          target === following.page &&
                          following.page !== here.page
                        ) {
                          setTourIndex(tourIndex + 1);
                        }
                        navigate(target);
                      }}
                    >
                      <Icon name={icon} size={17} />
                      <span>{label || target}</span>
                      {target === "Alerts & Attention" && (
                        <b className="nav-count">
                          {
                            alerts.filter(
                              (a) =>
                                a.status !== "Stable" &&
                                !reviewed.includes(`${selectedCrew}-${a.id}`),
                            ).length
                          }
                        </b>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
          <div className="sidebar-bottom">
            <div className="mission-mini">
              <div className="mini-orbit">
                <Icon name="globe" size={24} />
              </div>
              <span>
                {mission.shortName}
                <small>
                  <span className="status-dot" />
                  Mission in progress
                </small>
              </span>
              <div className="mission-progress">
                <span />
              </div>
              <div className="mission-progress-label">
                <span>
                  Mission day <b>{mission.day}</b>
                </span>
                <span>of {mission.durationDays}</span>
              </div>
            </div>
            <button className="nav-item" onClick={() => openModal("settings")}>
              <Icon name="settings" size={18} />
              Display
            </button>
            <button className="nav-item" onClick={() => openModal("export")}>
              <Icon name="download" size={18} />
              Export summary
            </button>
            <button className="nav-item" onClick={() => openModal("about")}>
              <Icon name="help" size={18} />
              About
              <Icon name="external" size={13} />
            </button>
            <button
              className="nav-item"
              onClick={() => {
                setModal(null);
                setSidebarOpen(false);
                setGuideOpen(true);
              }}
              title="Open Tanaw Guide written answers"
            >
              <Icon name="book" size={18} />
              Tanaw Guide
            </button>
            <button
              type="button"
              className="sidebar-sim-btn"
              onClick={() => openModal("simulation")}
              aria-label="Change mission simulation scenario"
              title="Switch operational simulation scenario"
            >
              <span className="status-dot" />
              <div className="sidebar-sim-text">
                <span className="sidebar-sim-name">{context.title}</span>
                <span className="sidebar-sim-action">Scenario ▾</span>
              </div>
            </button>
            <div className="sidebar-user">
              <button
                className="account-open"
                aria-label={`Open account for ${person.name}`}
                onClick={() => openAccount()}
              >
                <Avatar person={person} />
                <div>
                  {person.name}
                  <small>{person.role}</small>
                </div>
              </button>
              <button aria-label="Switch crew member" onClick={() => navigate("Mission Overview")}>
                <Icon name="chevron" size={16} />
              </button>
            </div>
          </div>
        </aside>
        <div className="main-shell">
          <header className="topbar">
            <div className="breadcrumbs">
              <button
                className={tourPointMenu ? "mobile-menu is-tour-target" : "mobile-menu"}
                data-tour-menu=""
                aria-label="Open navigation"
                onClick={() => setSidebarOpen(true)}
              >
                <Icon name="menu" />
              </button>
              {display.touch && (
                <div className="console-wordmark">
                  TanawOrbit<small>Crew health</small>
                </div>
              )}
              <Icon name="globe" size={16} />
              <span>{mission.name}</span>
              <Icon name="chevron" size={12} />
              <strong>{pageTitle(page)}</strong>
            </div>
            <div className="topbar-right">
              <div className="display-controls">
                <button
                  className={`display-control ${display.touch ? "is-on" : ""}`}
                  aria-label={display.touch ? "Use desk layout" : "Use tablet layout"}
                  aria-pressed={display.touch}
                  title="Switch between desk and tablet layout"
                  onClick={() => display.setMode(display.touch ? "desktop" : "touch")}
                >
                  {display.touch ? <Tablet size={15} /> : <Monitor size={15} />}
                  <span>{display.touch ? "Tablet" : "Desk"}</span>
                </button>
                <button
                  className="display-control"
                  aria-label="Toggle visual theme"
                  title={theme === "dark" ? "Switch to light" : "Switch to dark"}
                  onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
                >
                  {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
                  <span>{theme === "dark" ? "Light" : "Dark"}</span>
                </button>
                <button
                  className="display-control"
                  aria-label="Walk through each page"
                  title="Click each page in order"
                  onClick={() => {
                    dismissArrival();
                    setTourIndex(0);
                    setModal("onboarding");
                    navigate(tourSteps[0].page);
                  }}
                >
                  <Compass size={15} />
                  <span>Tour</span>
                </button>
                <button
                  className="display-control icon-only"
                  aria-label={display.fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                  title={display.fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                  onClick={() => {
                    display
                      .toggleFullscreen()
                      .catch(() =>
                        notify(
                          "Fullscreen is not available here. You can still use the touch layout.",
                          "info",
                        ),
                      );
                  }}
                >
                  {display.fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
                <button className="display-control" aria-label="Sign out of console" onClick={signOut}>
                  <LogOut size={15} />
                  <span>Sign out</span>
                </button>
              </div>
              <div className="notice-wrap" ref={noticeRef}>
                <button
                  className="notification-button"
                  aria-label="Open notifications"
                  aria-expanded={noticesOpen}
                  onClick={() => {
                    setAccountNoteSeen(true);
                    setNoticesOpen((open) => !open);
                  }}
                >
                  <Icon name="bell" size={19} />
                  {(accountNote && !accountNoteSeen) ||
                  alerts.some(
                    (item) =>
                      item.status !== "Stable" && !reviewed.includes(`${selectedCrew}-${item.id}`),
                  ) ? (
                    <i />
                  ) : null}
                </button>
                {noticesOpen && (
                  <div className="notice-panel" role="menu">
                    <h2>Notifications</h2>
                    {accountNote && (
                      <button type="button" onClick={() => openAccount("notice")}>
                        Account
                        <span>{accountNote}</span>
                      </button>
                    )}
                    {alerts
                      .filter(
                        (item) =>
                          item.status !== "Stable" &&
                          !reviewed.includes(`${selectedCrew}-${item.id}`),
                      )
                      .map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => {
                            setNoticesOpen(false);
                            navigate("Alerts & Attention");
                          }}
                        >
                          {item.title}
                          <span>{item.text}</span>
                        </button>
                      ))}
                    {!accountNote &&
                      !alerts.some(
                        (item) =>
                          item.status !== "Stable" &&
                          !reviewed.includes(`${selectedCrew}-${item.id}`),
                      ) && <p>No notifications yet. Open the account to see this crew member.</p>}
                  </div>
                )}
              </div>
              <button
                className="topbar-avatar"
                aria-label={`Open account for ${person.name}`}
                onClick={() => openAccount()}
              >
                <Avatar person={person} />
              </button>
            </div>
          </header>
          <main className={display.touch ? "!pb-36" : ""}>
            <div className="page-heading">
              <div>
                <div className="eyebrow">{mission.name}</div>
                <h1>{pageTitle(page)}</h1>
                <p>{pageLede(page)}</p>
              </div>
              <div className="heading-actions">
                {page !== "Health Check-In" && (
                  <button
                    className="secondary-button export-button"
                    onClick={() => openModal("export")}
                  >
                    <Icon name="download" size={16} />
                    Export summary
                  </button>
                )}

              </div>
            </div>

            {page !== "Astronaut Dashboard" && (
              <section className="next-cue" data-next-cue="" aria-label="What to do next">
                <div>
                  <span>{cue.kicker}</span>
                  <strong>{cue.title}</strong>
                  <p>{cue.detail}</p>
                </div>
                {cue.action && cue.go && (
                  <button type="button" className="primary-button" onClick={cue.go}>
                    {cue.action}
                  </button>
                )}
              </section>
            )}

            {page !== "Mission Overview" && page !== "Health Guidance" && page !== "Health Check-In" && (
              <section className="profile-banner">
                <div className="profile-main">
                  <Avatar person={person} large />
                  <div>
                    <div className="profile-name">
                      <h2>{person.name}</h2>
                      <Badge status={currentStatus} />
                    </div>
                    <p>
                      {person.role}
                      <span className="divider-dot">·</span>Crew ID{" "}
                      <span className="mono">{person.id.toUpperCase()}</span>
                    </p>
                    <div className="profile-meta">
                      <span>
                        <Icon name="globe" size={14} />
                        {mission.name}
                      </span>
                      <span>
                        <span className="status-dot" />
                        {context.id === "orbital"
                          ? `Mission altitude ${mission.altitudeKm} km`
                          : context.id === "transit"
                          ? "Cislunar Transit · Coasting Trajectory"
                          : context.id === "lunar"
                          ? "Lunar South Pole · Artemis Base Camp"
                          : "Planetary Surface · Jezero Outpost"}
                      </span>
                      <span>
                        <Icon name="clock" size={14} />
                        Last check-in:{" "}
                        {checkedIn[selectedCrew] ? "just now" : "Today, 08:32 UTC"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mission-day">
                  <span>Mission day</span>
                  <strong>
                    {mission.day}
                    <span>/ {mission.durationDays}</span>
                  </strong>
                  <div className="day-progress">
                    <span />
                  </div>
                </div>
                <div className="banner-earth" />
              </section>
            )}



            {page === "Astronaut Dashboard" && (
              <>
                <section className="next-cue" data-next-cue="" aria-label="What to do next">
                  <div>
                    <span>{context.title} · {cue.kicker}</span>
                    <strong>{cue.title}</strong>
                    <p>{cue.detail}</p>
                  </div>
                  <div className="next-cue-actions">
                    {cue.action && cue.go && (
                      <button type="button" className="primary-button" onClick={cue.go}>
                        {cue.action}
                      </button>
                    )}
                    <button type="button" className="secondary-button" onClick={() => openModal("simulation")}>
                      <Sliders size={14} />
                      Change setting
                    </button>
                  </div>
                </section>
                <VisitPractice
                  recordDone={recordDone}
                  practiceDone={practiceDone}
                  exerciseDone={exerciseDone}
                  onRecord={() => navigate("Health Check-In")}
                  onPractice={() => navigate("Sensorimotor & Reflex")}
                  onExercise={() => navigate("Exercise & Recovery")}
                />
                <div data-tour="today-numbers">
                  <div className="section-label">
                    <h2>Today's numbers</h2>
                    <span>
                      {checkedIn[selectedCrew] ? "just now" : "Today, 08:32 UTC"}
                    </span>
                  </div>
                  <MetricCards />
                </div>
                <div className="dashboard-middle" data-tour="today-compare">
                  <TrendPanel />
                  <RecentChanges />
                </div>
                <NextSteps reading={reading} baseline={baseline} onOpen={openToolkit} />
                <div style={{ margin: "24px 0" }} data-tour="somatic-avatar">
                  <AnatomicalAvatar
                    onLogSymptom={(log) => {
                      setSymptomLogs((prev) => [...prev, log]);
                      notify(`Symptom recorded: ${log.symptom} (${log.severity})`);
                    }}
                    recentLogs={symptomLogs}
                  />
                </div>
                <div style={{ margin: "24px 0" }} data-tour="puma-tracker">
                  <PumaTracker />
                </div>
                <div className="dashboard-bottom">
                  <Physiology />
                  <Insights />
                </div>
                <div className="guidance-strip">
                  <span className="guidance-strip-icon">
                    <Icon name="book" size={21} />
                  </span>
                  <div>
                    <h3>Notes on sleep and tiredness</h3>
                    <p>Plain explanations. Not medical advice.</p>
                  </div>
                  <button className="secondary-button" onClick={() => navigate("Health Guidance")}>
                    Read the notes
                    <Icon name="arrow" size={16} />
                  </button>
                </div>
              </>
            )}

            {page === "Mission Overview" && (
              <>
                <section className="mission-overview-banner">
                  <div>
                    <span className="eyebrow">{mission.environment}</span>
                    <h2>{mission.name}</h2>
                    <p>Sample readings for each person on this mission.</p>
                    <div className="overview-mission-stats">
                      <span>
                        <strong>
                          {mission.day}
                          <small>/ {mission.durationDays}</small>
                        </strong>
                        Mission day
                      </span>
                      <span>
                        <strong>{crew.length}</strong>Crew
                      </span>
                      <span>
                        <strong>
                          {mission.altitudeKm}
                          <small>km</small>
                        </strong>
                        Mission altitude
                      </span>
                    </div>
                  </div>
                  <div className="overview-orbit">
                    <Icon name="globe" size={60} />
                  </div>
                </section>
                <div className="section-label">
                  <h2>Everyone on this mission</h2>
                  <span>
                    <span className="tiny-dot" />
                    Day {mission.day}
                  </span>
                </div>
                <div className="crew-grid">
                  {crew.map((member, i) => (
                    <button
                      className="panel crew-card"
                      key={member.name}
                      disabled={!allowCrewSwitch && i !== selectedCrew}
                      onClick={() => {
                        if (!allowCrewSwitch && i !== selectedCrew) return;
                        setSelectedCrew(i);
                        navigate("Astronaut Dashboard");
                      }}
                    >
                      <div className="crew-card-top">
                        <Avatar person={member} large />
                        <Badge status={crewStatus(i, readings[i])} />
                      </div>
                      <h2>{member.name}</h2>
                      <p>{member.role}</p>
                      <div className="crew-metrics">
                        <div>
                          <span>Heart rate</span>
                          <strong>
                            {readings[i].heart}
                            <small>bpm</small>
                          </strong>
                        </div>
                        <div>
                          <span>Sleep</span>
                          <strong>
                            {readings[i].sleep}
                            <small>hrs</small>
                          </strong>
                        </div>
                        <div>
                          <span>How tired</span>
                          <strong>
                            {readings[i].fatigue}
                            <small>/5</small>
                          </strong>
                        </div>
                      </div>
                      <span className="crew-check">
                        <Icon name="check" size={15} />
                        {checkedIn[i]
                          ? "Checked in just now"
                          : "Last check-in today, 08:32 UTC"}
                      </span>
                      <div className="crew-card-link">
                        {allowCrewSwitch || i === selectedCrew
                          ? "Open their page"
                          : "Visible for context"}
                        <Icon name="arrow" size={17} />
                      </div>
                    </button>
                  ))}
                </div>
                <section className="panel mission-console">
                  <PanelTitle
                    title="What the labels mean"
                    description="Usual, Different, and Flagged on this page."
                  />
                  <div className="protocol-grid">
                    {(
                      [
                        { status: "Stable", text: "Close to this person's 14-day average." },
                        {
                          status: "Observe",
                          text: "A recorded measurement has changed from its recent pattern.",
                        },
                        {
                          status: "Attention",
                          text: "Information should be reviewed by the mission health team.",
                        },
                      ] as { status: Status; text: string }[]
                    ).map((s) => (
                      <div key={s.status}>
                        <Badge status={s.status} />
                        <p>{s.text}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            {page === "Health Trends" && (
              <>
                <WeekBoard
                  crewId={person.id}
                  name={person.name}
                  today={reading}
                  exercises={exerciseSessions}
                  onOpen={navigate}
                />
                <div className="section-label">
                  <h2>Measurements over time</h2>
                  <span>
                    Average of the previous {rules.baselineWindowDays} days, not counting today
                  </span>
                </div>
                <TrendPanel expanded />
                <div className="dashboard-bottom">
                  <RecentChanges />
                  <Insights full />
                </div>
                <section className="panel baseline-panel">
                  <PanelTitle
                    title="Your 14-day average"
                    description="The average of the previous 14 days, not counting today."
                  />
                  <div className="baseline-grid">
                    {[
                      ["Heart rate", String(baseline.heart), "bpm"],
                      ["Blood pressure", `${baseline.systolic}/${baseline.diastolic}`, "mmHg"],
                      ["Sleep duration", String(baseline.sleep), "hours"],
                      ["How tired", String(baseline.fatigue), "/ 5"],
                    ].map(([name, value, unit]) => (
                      <div key={name}>
                        <span>{name}</span>
                        <strong>
                          {value}
                          <small>{unit}</small>
                        </strong>
                        <p>Previous {rules.baselineWindowDays} mission days</p>
                      </div>
                    ))}
                  </div>
                  <p className="baseline-note">
                    Average of the previous {rules.baselineWindowDays} days for this person.
                  </p>
                </section>
              </>
            )}

            {page === "Health Check-In" && (
              <div data-tour="checkin-suite">
                <DailyHealthCheckIn
                  key={selectedCrew}
                  draft={drafts[selectedCrew]}
                  onDraftChange={(draft) =>
                    setDrafts((old) => old.map((r, i) => (i === selectedCrew ? draft : r)))
                  }
                  person={person}
                  vitals={samples[selectedCrew]}
                  navigate={navigate}
                  onSave={(draft, sample) => {
                    setReadings((old) => old.map((r, i) => (i === selectedCrew ? { ...draft } : r)));
                    setSamples((old) => old.map((item, i) => (i === selectedCrew ? sample : item)));
                    setCheckedIn((old) => old.map((v, i) => (i === selectedCrew ? true : v)));
                    setDrafts((old) => old.map((r, i) => (i === selectedCrew ? { ...draft } : r)));
                    setReviewed((old) => old.filter((key) => !key.startsWith(`${selectedCrew}-`)));
                    notify("Daily check-in recorded.");
                  }}
                />
              </div>
            )}
            {page === "Exercise & Recovery" && (
              <div data-tour="exercise-suite">
                <ExercisePanel
                  key={person.id}
                  person={person}
                  reading={reading}
                  records={exerciseSessions}
                  onRecord={(record) => setExerciseSessions((old) => [...old, record])}
                />
              </div>
            )}
            {page === "Health Toolkit" && (
              <FeatureBoundary
                fallback={
                  <section className="panel toolkit-loading" role="alert">
                    <h2>The toolkit could not be opened.</h2>
                    <p>
                      Your current demo entries remain in memory. This feature may need a connection
                      to load its application files.
                    </p>
                    <button
                      className="secondary-button"
                      onClick={() => navigate("Astronaut Dashboard")}
                    >
                      Return to dashboard
                    </button>
                  </section>
                }
              >
                <Suspense
                  fallback={
                    <div className="panel toolkit-loading" role="status">
                      Opening the educational toolkit…
                    </div>
                  }
                >
                  <HealthToolkit
                    person={person}
                    reading={reading}
                    baseline={baseline}
                    checkedIn={checkedIn[selectedCrew]}
                    exercises={exerciseSessions}
                    tab={toolkitTab}
                    onTab={setToolkitTab}
                    metric={toolkitMetric}
                    onMetric={setToolkitMetric}
                    context={context}
                    complete={routineComplete}
                    onReviewed={(value) =>
                      setGuidanceReviewed((old) => ({ ...old, [person.id]: value }))
                    }
                    reminder={reminder}
                    onRecord={openRecord}
                    onExercise={() => navigate("Exercise & Recovery")}
                    onPhysiology={() => navigate("Physiological Monitoring")}
                  />
                </Suspense>
              </FeatureBoundary>
            )}
            {portal === "admin" && (
              <div className="info-banner">
                <Icon name="info" size={18} />
                <span>
                  Admin demo is viewing the crew console. Check-ins still reset when the page
                  refreshes. This is not an operations account.
                </span>
              </div>
            )}

            {page === "Biodata" && <BiodataPanel crewId={person.id} />}
            {page === "Monitor Parameters" && <MonitorParametersPanel />}
            {page === "Calculation Trend" && (
              <CalculationTrendPanel crewId={person.id} reading={reading} />
            )}
            {page === "Sensorimotor & Reflex" && (
              <div data-tour="cognition-suite">
                <SensorimotorPanel
                  crewId={person.id}
                  crewName={person.name}
                  dominantSide={biodataFor(person.id).dominantSide}
                  cognitionEntries={cognitionLog[person.id] ?? []}
                  onCognition={(score) => {
                    setCognitionLog((old) => ({
                      ...old,
                      [person.id]: [
                        ...(old[person.id] ?? []),
                        { ...score, id: `${person.id}-${score.task}-${Date.now()}` },
                      ],
                    }));
                    notify(`${score.label} recorded. ${score.score} ${score.unit}.`);
                  }}
                  onRecordResult={(res) => {
                    notify(`Assessment recorded: ${res.score} ${res.unit} (${res.status})`);
                  }}
                />
              </div>
            )}
            {page === "Cabin Conditions" && <CabinPanel />}
            {page === "Orbital Conditions" && <OrbitalPanel />}
            {page === "Space Nutrition" && <NutritionPanel crewId={person.id} />}

            {page === "Physiological Monitoring" && (
              <>
                <Physiology />
                <div className="dashboard-bottom">
                  <section className="panel monitoring-context">
                    <PanelTitle
                      title="What belongs on this page"
                      description="Heart rate, blood oxygen, and breathing for this stored day."
                    />
                    <p>
                      The lines follow today's heart rate and breathing. Blood oxygen is the number beside its line.
                    </p>
                    <div className="context-row">
                      <Icon name="pulse" />
                      <div>
                        <strong>Today's stored numbers</strong>
                        <p>
                          Heart rate, breathing, and blood oxygen come from this person's stored day, or from the check-in if you saved one.
                        </p>
                      </div>
                    </div>
                    <div className="context-row">
                      <Icon name="shield" />
                      <div>
                        <strong>Cabin air is a different page</strong>
                        <p>
                          Cabin pressure, oxygen, and carbon dioxide are on Cabin air.
                        </p>
                      </div>
                    </div>
                  </section>
                  <Insights />
                </div>
              </>
            )}

            {page === "Alerts & Attention" && (
              <div data-tour="alerts-console" className="space-y-6">
                <div className="alert-status-grid">
                  {(["Stable", "Observe", "Attention"] as Status[]).map((s) => (
                    <button
                      className={`panel alert-status-card ${alertFilter === s ? "filter-active" : ""}`}
                      key={s}
                      onClick={() => setAlertFilter(alertFilter === s ? "All statuses" : s)}
                    >
                      <Badge status={s} />
                      <strong>
                        {alerts
                          .filter(
                            (a) => a.status === s && !reviewed.includes(`${selectedCrew}-${a.id}`),
                          )
                          .length.toString()
                          .padStart(2, "0")}
                      </strong>
                      <p>
                        {s === "Stable"
                          ? "Close to this person's 14-day average."
                          : s === "Observe"
                            ? "A measurement has changed from its recent pattern."
                            : "Information should be reviewed."}
                      </p>
                    </button>
                  ))}
                </div>
                <section className="panel alert-console">
                  <PanelTitle
                    title="What is marked"
                    description="Marks from today's numbers, next to this person's recent average."
                    action={
                      <select
                        aria-label="Filter alerts by status"
                        value={alertFilter}
                        onChange={(e) => setAlertFilter(e.target.value)}
                      >
                        {(
                          [
                            ["All statuses", "All labels"],
                            ["Stable", "Usual"],
                            ["Observe", "Different"],
                            ["Attention", "Flagged"],
                          ] as const
                        ).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    }
                  />
                  <div className="alert-log-head">
                    <span>OBSERVATION</span>
                    <span>MISSION TIME</span>
                    <span>REVIEW</span>
                  </div>
                  {alerts
                    .filter((a) => alertFilter === "All statuses" || a.status === alertFilter)
                    .map((a) => (
                      <div className="alert-log-row" key={a.id}>
                        <span className={`alert-icon ${a.status.toLowerCase()}`}>
                          <Icon name={a.icon} size={20} />
                        </span>
                        <div className="alert-log-content">
                          <div>
                            <h3>{a.title}</h3>
                            <Badge status={a.status} />
                          </div>
                          <p>{a.text}</p>
                          <button
                            className="alert-next-step"
                            onClick={() =>
                              openToolkit(
                                a.id === "review" ? "evidence" : "measure",
                                a.id === "bp"
                                  ? "pressure"
                                  : a.id === "sleep"
                                    ? "sleep"
                                    : a.id === "fatigue"
                                      ? "fatigue"
                                      : "heart",
                              )
                            }
                          >
                            How this number is kept <Icon name="arrow" size={14} />
                          </button>
                        </div>
                        <span className="log-time">
                          {a.time}
                          <small>UTC · Day {mission.day}</small>
                        </span>
                        <button
                          className={
                            reviewed.includes(`${selectedCrew}-${a.id}`)
                              ? "reviewed-button"
                              : "secondary-button"
                          }
                          disabled={reviewed.includes(`${selectedCrew}-${a.id}`)}
                          onClick={() => {
                            setReviewed((old) => [...old, `${selectedCrew}-${a.id}`]);
                            notify("Observation marked as reviewed for this session.");
                          }}
                        >
                          {reviewed.includes(`${selectedCrew}-${a.id}`) ? (
                            <>
                              <Icon name="check" size={15} />
                              Reviewed
                            </>
                          ) : (
                            "Mark reviewed"
                          )}
                        </button>
                      </div>
                    ))}
                  {alerts.filter((a) => alertFilter === "All statuses" || a.status === alertFilter)
                    .length === 0 && (
                    <div className="empty-state">
                      <Icon name="shield" size={32} />
                      <h3>
                        No {alertFilter === "All statuses" ? "" : `${STATUS_LABEL[alertFilter as Status].toLowerCase()} `}
                        marks
                      </h3>
                      <p>Nothing in this group for {person.name}.</p>
                      <button
                        className="text-button"
                        onClick={() => setAlertFilter("All statuses")}
                      >
                        Show every mark
                        <Icon name="arrow" size={16} />
                      </button>
                    </div>
                  )}
                </section>
                <section className="panel note-keep">
                  <PanelTitle
                    title="Note to keep"
                    description="Write something to remember. It stays in this browser until you refresh. Nothing is sent."
                  />
                  <textarea
                    aria-label="Note to keep"
                    value={keptNotes[person.id] ?? ""}
                    placeholder="A reminder for this person"
                    onChange={(event) =>
                      setKeptNotes((old) => ({ ...old, [person.id]: event.target.value }))
                    }
                  />
                  <p>
                    If something feels sudden or severe, use the crew's own emergency steps. This page
                    only compares today's numbers with this person's recent average.
                  </p>
                </section>
              </div>
            )}

            {page === "Health Guidance" && (
              <div data-tour="zero-g-guide">
                <ZeroGLivingGuide onNavigate={navigate} />
              </div>
            )}

          </main>
        </div>
        {display.touch && (
          <nav className="touch-dock" aria-label="Touch navigation">
            {(
              [
                { page: "Astronaut Dashboard", label: "Today", icon: "activity" },
                { page: "Health Check-In", label: "Record", icon: "plus" },
                { page: "Alerts & Attention", label: "Flags", icon: "bell" },
                { page: "Health Trends", label: "History", icon: "chart" },
              ] as { page: Page; label: string; icon: IconName }[]
            ).map((item) => (
              <button
                key={item.page}
                className={page === item.page ? "selected" : ""}
                aria-current={page === item.page ? "page" : undefined}
                onClick={() => navigate(item.page)}
              >
                <Icon name={item.icon} size={22} />
                <span>{item.label}</span>
                {item.page === "Alerts & Attention" &&
                  alerts.some(
                    (a) => a.status !== "Stable" && !reviewed.includes(`${selectedCrew}-${a.id}`),
                  ) && <i />}
              </button>
            ))}
            <button
              className={
                [
                  "Mission Overview",
                  "Physiological Monitoring",
                  "Health Guidance",
                  "Exercise & Recovery",
                  "Health Toolkit",
                  "Biodata",
                  "Monitor Parameters",
                  "Calculation Trend",
                  "Cabin Conditions",
                  "Orbital Conditions",
                  "Space Nutrition",
                  "Sensorimotor & Reflex",
                ].includes(page)
                  ? "selected"
                  : ""
              }
              onClick={() => setSidebarOpen(true)}
              aria-label="More screens"
              aria-expanded={sidebarOpen}
            >
              <Icon name="grid" size={21} />
              <span>More</span>
            </button>
          </nav>
        )}
        {toast && (
          <div className={`toast ${toastTone}`} role="status">
            <Icon name={toastTone === "success" ? "check" : "info"} size={18} />
            <span>{toast}</span>
            <button aria-label="Dismiss message" onClick={() => setToast("")}>
              <Icon name="close" size={16} />
            </button>
          </div>
        )}
        {modal === "export" && (
          <TelemetryReportModal
            crewMember={person}
            reading={reading}
            baseline={baseline}
            onClose={() => setModal(null)}
            onExportCsv={exportData}
          />
        )}
        {modal === "onboarding" && (
          <OnboardingModal
            steps={tourSteps}
            index={tourIndex}
            page={page}
            onStepChange={(newIdx) => setTourIndex(newIdx)}
            onNavigate={(targetPage) => navigate(targetPage)}
            onClose={finishTour}
            blockedLabel={tourBlocked}
            onPointNext={() => tourNext && pointAtMenu(tourNext.page)}
          />
        )}
        {modal === "simulation" && (
          <SimulationScenarioModal
            currentId={contextId}
            onSelect={(newId) => {
              setContextId(newId);
              const target = missionContexts.find((c) => c.id === newId);
              if (target) {
                notify(`Simulation scenario updated: ${target.title}`);
              }
            }}
            onNavigate={(targetPage) => {
              navigate(targetPage);
              setModal(null);
            }}
            onClose={() => setModal(null)}
          />
        )}
        {modal && modal !== "export" && modal !== "onboarding" && modal !== "simulation" && (
          <div className="modal-backdrop" onClick={() => setModal(null)}>
            <section
              className={modal === "account" ? "panel modal account-modal" : "panel modal"}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                autoFocus
                className="modal-close"
                aria-label="Close dialog"
                onClick={() => setModal(null)}
              >
                <Icon name="close" />
              </button>
              {modal === "account" ? (
                <Avatar person={person} large />
              ) : (
                <span className="section-icon">
                  <Icon name={modal === "about" ? "shield" : "settings"} size={27} />
                </span>
              )}
              <h2 id="modal-title">
                {modal === "account" ? person.name : modal === "about" ? "What this is" : "Display"}
              </h2>
              {modal === "account" ? (
                <AccountFacts person={person} onOpenBody={() => {
                  setModal(null);
                  navigate("Biodata");
                }} />
              ) : modal === "about" ? (
                <>
                  <p>
                    TanawOrbit is a practice page for reading health numbers on a long mission.
                    Made by team <strong>Tala Pulse</strong> for the NASA Space Apps Challenge.
                  </p>
                  <p>What you type stays in this browser until you refresh the page.</p>
                </>
              ) : (
                <>
                  <p>Choose a desk or tablet layout, and a dark or light page.</p>
                  <label className="settings-label">
                    Display layout
                    <select
                      aria-label="Display layout"
                      value={display.mode}
                      onChange={(e) => display.setMode(e.target.value as DisplayMode)}
                    >
                      <option value="auto">Auto-detect</option>
                      <option value="desktop">Desk</option>
                      <option value="touch">Tablet</option>
                    </select>
                  </label>

                  <label className="settings-label">
                    Color Theme
                    <select value={theme} onChange={(e) => setTheme(e.target.value as "dark" | "light")}>
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                    </select>
                  </label>

                  <label className="settings-label">
                    Temperature unit
                    <select value={units} onChange={(e) => setUnits(e.target.value)}>
                      <option>Celsius</option>
                      <option>Fahrenheit</option>
                    </select>
                  </label>

                  <label className="settings-label">
                    Floating Tanaw Guide
                    <select
                      aria-label="Floating Tanaw Guide position and visibility"
                      value={guideLauncherHidden ? "hidden" : guideLauncherMinimized ? "minimized" : "visible"}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "hidden") {
                          setGuideLauncherHidden(true);
                          try {
                            localStorage.setItem("tanaw_guide_launcher_hidden", "true");
                          } catch {}
                        } else if (val === "minimized") {
                          setGuideLauncherHidden(false);
                          setGuideLauncherMinimized(true);
                          try {
                            localStorage.removeItem("tanaw_guide_launcher_hidden");
                            localStorage.setItem("tanaw_guide_launcher_minimized", "true");
                          } catch {}
                        } else {
                          setGuideLauncherHidden(false);
                          setGuideLauncherMinimized(false);
                          try {
                            localStorage.removeItem("tanaw_guide_launcher_hidden");
                            localStorage.removeItem("tanaw_guide_launcher_minimized");
                          } catch {}
                        }
                      }}
                    >
                      <option value="visible">Visible (bottom right)</option>
                      <option value="minimized">Minimized (small bubble)</option>
                      <option value="hidden">Hidden</option>
                    </select>
                  </label>
                  <div className="info-banner">
                    <Icon name="info" size={17} />
                    <span>
                      Settings and drafts reset when you refresh.
                    </span>
                  </div>
                </>
              )}
              {modal !== "account" && (
                <button className="primary-button" onClick={() => setModal(null)}>
                  {modal === "about" ? "Understood" : "Done"}
                  <Icon name="check" size={16} />
                </button>
              )}
            </section>
          </div>
        )}
      </div>
      {showArrival && (
        <div className="modal-backdrop" role="presentation">
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="arrival-title"
          >
            <h2 id="arrival-title">{person.name}</h2>
            <p>
              {mission.name}, day {mission.day} of {mission.durationDays}. Synthetic crew. The numbers
              are stored samples, plus what you type during this visit.
            </p>
            <p>Read today against the previous 14 days.</p>
            <p>Record a check-in. It stays in this browser until you refresh.</p>
            <p>After this, the top of the page names the next click. It is record today, then one practice, then exercise.</p>
            <button className="primary-button" onClick={dismissArrival}>
              Continue
            </button>
          </section>
        </div>
      )}
      {!guideLauncherHidden && (
        <div
          className={`tanaw-guide-launcher ${display.touch ? "above-dock" : ""} ${
            guideLauncherMinimized ? "is-minimized" : ""
          }`}
          hidden={guideOpen}
        >
          <button
            type="button"
            className="tanaw-guide-launcher-main"
            aria-label="Open Tanaw Guide"
            title={guideLauncherMinimized ? "Open Tanaw Guide (click to open)" : "Open Tanaw Guide"}
            onClick={() => {
              setModal(null);
              setSidebarOpen(false);
              setGuideOpen(true);
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <path d="M21 11a8 8 0 0 1-8 8H7l-5 3V11a9 9 0 0 1 19 0Z" />
              <path d="M6 11h3l2-4 3 8 2-4h3" />
            </svg>
            {!guideLauncherMinimized && (
              <span>
                Tanaw Guide<small>Written answers</small>
              </span>
            )}
          </button>
          {!guideLauncherMinimized ? (
            <div className="tanaw-guide-launcher-actions">
              <button
                type="button"
                className="tanaw-guide-action-btn"
                aria-label="Minimize Tanaw Guide launcher"
                title="Minimize launcher"
                onClick={(e) => {
                  e.stopPropagation();
                  setGuideLauncherMinimized(true);
                  try {
                    localStorage.setItem("tanaw_guide_launcher_minimized", "true");
                  } catch {}
                }}
              >
                <Minus size={13} />
              </button>
              <button
                type="button"
                className="tanaw-guide-action-btn"
                aria-label="Hide Tanaw Guide launcher"
                title="Hide launcher"
                onClick={(e) => {
                  e.stopPropagation();
                  setGuideLauncherHidden(true);
                  try {
                    localStorage.setItem("tanaw_guide_launcher_hidden", "true");
                  } catch {}
                  notify(
                    "Tanaw Guide launcher hidden. Open anytime from the sidebar or Display settings.",
                    "info",
                  );
                }}
              >
                <X size={13} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="tanaw-guide-restore-pill"
              aria-label="Expand Tanaw Guide launcher"
              title="Expand launcher"
              onClick={(e) => {
                e.stopPropagation();
                setGuideLauncherMinimized(false);
                try {
                  localStorage.removeItem("tanaw_guide_launcher_minimized");
                } catch {}
              }}
            >
              <Maximize2 size={10} />
            </button>
          )}
        </div>
      )}
      {guideOpen && (
        <FeatureBoundary
          fallback={
            <div className="tanaw-guide-backdrop">
              <section
                className="tanaw-guide-loading"
                role="dialog"
                aria-modal="true"
                aria-label="Tanaw Guide unavailable"
                onKeyDown={(event) => {
                  if (event.key === "Escape") setGuideOpen(false);
                  if (event.key === "Tab") event.preventDefault();
                }}
              >
                <h2>The demo guide could not be opened.</h2>
                <p>
                  Your current demo entries are still in memory. Close this panel to continue using
                  the console.
                </p>
                <button autoFocus className="secondary-button" onClick={() => setGuideOpen(false)}>
                  Close guide
                </button>
              </section>
            </div>
          }
        >
          <Suspense
            fallback={
              <div className="tanaw-guide-backdrop">
                <section
                  className="tanaw-guide-loading"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Opening Tanaw Guide"
                  onKeyDown={(event) => {
                    if (event.key === "Escape") setGuideOpen(false);
                    if (event.key === "Tab") event.preventDefault();
                  }}
                >
                  <p>Opening the scripted demo guide…</p>
                  <button
                    autoFocus
                    className="secondary-button"
                    onClick={() => setGuideOpen(false)}
                  >
                    Close guide
                  </button>
                </section>
              </div>
            }
          >
            <TanawGuide
              key={person.id}
              name={person.name}
              reading={reading}
              baseline={baseline}
              sample={samples[selectedCrew]}
              context={context.title}
              onClose={() => setGuideOpen(false)}
              onAction={(action) => {
                if (action === "exercise") {
                  setGuideOpen(false);
                  navigate("Exercise & Recovery");
                } else openToolkit(action);
              }}
            />
          </Suspense>
        </FeatureBoundary>
      )}
    </>
  );
}

export default App;
