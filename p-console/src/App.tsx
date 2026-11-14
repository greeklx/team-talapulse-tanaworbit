import { lazy, Suspense, useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  Sun,
  Moon,
  Radio,
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
} from "./MissionFeatures";
import ExercisePanel from "./ExercisePanel";
import NextSteps from "./NextSteps";
import FeatureBoundary from "./FeatureBoundary";
import AnatomicalAvatar, { type SymptomLog } from "./AnatomicalAvatar";
import PumaTracker from "./PumaTracker";
import TelemetryReportModal from "./TelemetryReportModal";
import OnboardingModal from "./OnboardingModal";
import { missionContexts, routineDefinitions, type MetricId, type ToolkitTab } from "./toolkitData";
import { useRoutineReminders } from "./useRoutineReminders";
import "./toolkit.css";
const HealthToolkit = lazy(() => import("./HealthToolkit"));
const TanawGuide = lazy(() => import("./TanawGuide"));
import {
  crew,
  crewStatus,
  historyFor,
  initialExercises,
  latestRecord,
  mission,
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

type Page =
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
  "Astronaut Dashboard": "Overview & Vitals Deck",
  "Physiological Monitoring": "Live Body Vitals (PUMA)",
  "Cabin Conditions": "Cabin Life Support",
  "Orbital Conditions": "Space Hazards & Orbit",
  "Mission Overview": "Whole Crew Readiness",
  "Health Trends": "Personal Vitals History",
  "Calculation Trend": "Predictive Trends & Forecast",
  "Sensorimotor & Reflex": "Motor Skills & Reaction Test",
  "Space Nutrition": "Space Food & Calorie Intake",
  "Exercise & Recovery": "Daily Workout & Fitness",
  "Biodata": "Crew Baseline & Body Composition",
  "Monitor Parameters": "Safe Range Reference Standards",
  "Health Check-In": "Daily Health Check-In",
  "Health Toolkit": "Space Medicine & Countermeasures",
  "Health Guidance": "Microgravity Living Guides",
  "Alerts & Attention": "Health Alerts & Actions",
};

export type NavGroup = {
  pillar: string;
  items: { page: Page; label: string; icon: IconName }[];
};

const navGroups: NavGroup[] = [
  {
    pillar: "1. LIVE CREW VITALS",
    items: [
      { page: "Astronaut Dashboard", label: "Overview & Vitals Deck", icon: "activity" },
      { page: "Physiological Monitoring", label: "Live Body Vitals (PUMA)", icon: "pulse" },
      { page: "Cabin Conditions", label: "Cabin Life Support", icon: "thermometer" },
      { page: "Orbital Conditions", label: "Space Hazards & Orbit", icon: "globe" },
      { page: "Mission Overview", label: "Whole Crew Readiness", icon: "grid" },
    ],
  },
  {
    pillar: "2. HEALTH TRENDS & FORECASTS",
    items: [
      { page: "Health Trends", label: "Personal Vitals History", icon: "chart" },
      { page: "Calculation Trend", label: "Predictive Trends & Forecast", icon: "chart" },
      { page: "Sensorimotor & Reflex", label: "Motor Skills & Reaction Test", icon: "check" },
      { page: "Space Nutrition", label: "Space Food & Calories", icon: "battery" },
      { page: "Exercise & Recovery", label: "Daily Workout & Fitness", icon: "activity" },
      { page: "Biodata", label: "Crew Baseline & Body Comp", icon: "activity" },
      { page: "Monitor Parameters", label: "Safe Range Standards", icon: "pulse" },
    ],
  },
  {
    pillar: "3. MEDICAL CARE & PROTOCOLS",
    items: [
      { page: "Health Check-In", label: "Daily Health Check-In", icon: "check" },
      { page: "Health Toolkit", label: "Space Medicine & Actions", icon: "help" },
      { page: "Health Guidance", label: "Zero-G Living Guides", icon: "book" },
      { page: "Alerts & Attention", label: "Health Alerts & Actions", icon: "bell" },
    ],
  },
];

const nav: { page: Page; label: string; icon: IconName }[] = navGroups.flatMap((group) => group.items);

function pageTitle(page: Page): string {
  return PAGE_DISPLAY_LABELS[page] || page;
}

function pageLede(page: Page): string {
  switch (page) {
    case "Astronaut Dashboard":
      return "Continuous health telemetry summary, interactive body map, and today's vital indicators.";
    case "Physiological Monitoring":
      return "Continuous heart rhythm (ECG), blood oxygen (SpO₂), respiration, and NASA PUMA lung gas exchange.";
    case "Cabin Conditions":
      return "Spacecraft atmospheric pressure (14.7 psi), oxygen levels (3.1 psi), temperature, and ventilation velocity.";
    case "Orbital Conditions":
      return "Real-time space radiation dosimeter, microgravity acceleration levels, and orbital trajectory.";
    case "Mission Overview":
      return "Simultaneous health, workload, and flight readiness status across all 5 flight crew members.";
    case "Health Trends":
      return "Day-by-day personal history of blood pressure, resting pulse, sleep duration, and fatigue trends.";
    case "Calculation Trend":
      return "14-day rolling averages, personal baseline variance, and long-term adaptation projections.";
    case "Sensorimotor & Reflex":
      return "NASA Fine Motor Skills Test Battery (TM-2020-5008023) tracking coordination and visual reaction times.";
    case "Space Nutrition":
      return "Daily meals logged against 2,400 kcal target, with protein, carb, fat, and hydration tracking.";
    case "Exercise & Recovery":
      return "Mandatory 2-hour workout log: ARED heavy resistance training and T2 cycle ergometer sessions.";
    case "Biodata":
      return "Preflight vs. in-flight weight, body composition, lean muscle mass, and stature elongation.";
    case "Monitor Parameters":
      return "Clinically acceptable normal, warning, and emergency thresholds for human spaceflight.";
    case "Health Check-In":
      return "Record your daily measurements, physical symptoms, fatigue level, and self-reported mood.";
    case "Health Toolkit":
      return "In-flight medical kits and countermeasures for space sickness, eye changes (SANS), and spinal ache.";
    case "Health Guidance":
      return "Practical protocols for eating, drinking, personal hygiene, and sleeping in zero gravity.";
    case "Alerts & Attention":
      return "Active sensor notifications, physiological alerts, and flight surgeon recommendations.";
    default:
      return "Research-informed context for life and health beyond Earth.";
  }
}
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

function Badge({ status }: { status: Status }) {
  return (
    <span className={`badge ${status.toLowerCase()}`}>
      <span className="status-dot" />
      {status}
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
        <img src={person.image} alt={`${person.name}, fictional crew member`} />
      ) : (
        person.initials
      )}
      <span />
    </div>
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

type MeasurementKey = "heart" | "systolic" | "diastolic" | "sleep";
type CheckInDraft = Omit<Reading, MeasurementKey> & Record<MeasurementKey, number | "">;

function NumericControl({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
}: {
  id: string;
  label: string;
  value: number | "";
  onChange: (value: number | "") => void;
  min: number;
  max: number;
  step?: number;
  unit: string;
}) {
  function adjust(direction: number) {
    onChange(
      value === ""
        ? min
        : Math.min(max, Math.max(min, Number((value + direction * step).toFixed(1)))),
    );
  }
  return (
    <div className="numeric-control">
      <button
        type="button"
        aria-label={`Decrease ${label.toLowerCase()}`}
        disabled={value !== "" && value <= min}
        onClick={() => adjust(-1)}
      >
        −
      </button>
      <div>
        <input
          id={id}
          aria-label={label}
          type="number"
          inputMode={step < 1 ? "decimal" : "numeric"}
          min={min}
          max={max}
          step={step}
          required
          value={value}
          onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
        />
        <span>{unit}</span>
      </div>
      <button
        type="button"
        aria-label={`Increase ${label.toLowerCase()}`}
        disabled={value !== "" && value >= max}
        onClick={() => adjust(1)}
      >
        +
      </button>
    </div>
  );
}

function CheckInSteps({ step }: { step: number }) {
  return (
    <ol className="checkin-steps" aria-label="Check-in progress">
      {["Record", "Review", "Complete"].map((label, i) => (
        <li
          key={label}
          className={step === i + 1 ? "current" : step > i + 1 ? "complete" : ""}
          aria-current={step === i + 1 ? "step" : undefined}
        >
          <span>{step > i + 1 ? <Icon name="check" size={15} /> : `0${i + 1}`}</span>
          {label}
        </li>
      ))}
    </ol>
  );
}

function CheckIn({
  draft,
  onDraftChange,
  person,
  navigate,
  onSave,
}: {
  draft: CheckInDraft;
  onDraftChange: (draft: CheckInDraft) => void;
  person: (typeof crew)[number];
  navigate: (page: Page) => void;
  onSave: (draft: Reading) => void;
}) {
  const setDraft = onDraftChange;
  const [saved, setSaved] = useState(false);
  const [review, setReview] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (review || saved)
      document.querySelector<HTMLElement>(".checkin-review h2, .check-success h2")?.focus();
  }, [review, saved]);
  function submit(e: FormEvent) {
    e.preventDefault();
    if (Number(draft.systolic) <= Number(draft.diastolic)) {
      setError("Please check the blood-pressure entries: systolic must be greater than diastolic.");
      return;
    }
    setError("");
    setConfirmed(false);
    setReview(true);
  }
  function record() {
    if (!confirmed) return;
    onSave({
      ...draft,
      heart: Number(draft.heart),
      systolic: Number(draft.systolic),
      diastolic: Number(draft.diastolic),
      sleep: Number(draft.sleep),
    });
    setSaved(true);
  }
  if (saved)
    return (
      <section className="panel check-success">
        <CheckInSteps step={3} />
        <span className="success-icon">
          <Icon name="check" size={34} />
        </span>
        <span className="eyebrow green-text">CHECK-IN COMPLETE</span>
        <h2 tabIndex={-1}>You’re all checked in, {person.name.split(" ")[0]}.</h2>
        <p>
          Your measurements have been added to this session’s dashboard.
          <br />
          Thank you for taking a moment to check in with yourself.
        </p>
        <div className="success-summary">
          <span>
            Mission day <b>{mission.day}</b>
          </span>
          <span>
            Heart rate <b>{draft.heart} bpm</b>
          </span>
          <span>
            Sleep <b>{draft.sleep} hours</b>
          </span>
          <span>
            Mood <b>{draft.mood}</b>
          </span>
        </div>
        <div className="button-row">
          <button className="primary-button" onClick={() => navigate("Astronaut Dashboard")}>
            View updated dashboard <Icon name="arrow" size={17} />
          </button>
          <button
            className="secondary-button"
            onClick={() => {
              setSaved(false);
              setReview(false);
              setConfirmed(false);
            }}
          >
            Edit check-in
          </button>
        </div>
        <small>Demonstration only. Entries are held in memory and reset on page refresh.</small>
      </section>
    );
  if (review)
    return (
      <section className="panel checkin-review">
        <CheckInSteps step={2} />
        <div className="review-header">
          <span className="section-icon">
            <Icon name="check" size={26} />
          </span>
          <div>
            <span className="eyebrow">ONE LAST LOOK</span>
            <h2 tabIndex={-1}>Review before you record.</h2>
            <p>Confirm the crew member, units, and values. Nothing has been recorded yet.</p>
          </div>
        </div>
        <div className="review-crew">
          <Avatar person={person} />
          <div>
            <strong>{person.name}</strong>
            <span>
              {person.role} · Mission day {mission.day}
            </span>
          </div>
          <span className="duration">SIMULATED CHECK-IN</span>
        </div>
        <dl className="review-values">
          {[
            ["Heart rate", `${draft.heart} bpm`],
            ["Blood pressure", `${draft.systolic}/${draft.diastolic} mmHg`],
            ["Sleep duration", `${draft.sleep} hours`],
            ["Fatigue", `${draft.fatigue} / 5`],
            ["Mood", draft.mood],
          ].map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        {draft.notes && (
          <div className="review-note">
            <span>YOUR NOTES</span>
            <p>{draft.notes}</p>
          </div>
        )}
        <label className="confirm-check">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
          />
          <span>I checked the crew member and the measurements above.</span>
        </label>
        <div className="review-actions">
          <button className="secondary-button" onClick={() => setReview(false)}>
            Back to edit
          </button>
          <button className="primary-button" disabled={!confirmed} onClick={record}>
            <Icon name="check" size={19} />
            Confirm & record
          </button>
        </div>
        <div className="info-banner">
          <Icon name="info" size={17} />
          <span>
            Recorded in this browser session only. Refreshing the page clears entries. Do not enter
            real medical information.
          </span>
        </div>
      </section>
    );
  return (
    <div className="checkin-layout">
      <form className="panel checkin-form" onSubmit={submit}>
        <CheckInSteps step={1} />
        <PanelTitle
          title="Your daily health check-in"
          description="A few simple measurements. A clearer picture of your day."
          action={
            <span className="duration">
              <Icon name="clock" size={15} />
              ~2 min
            </span>
          }
        />
        <div className="form-section-label">
          <span>01</span> PHYSICAL MEASUREMENTS
        </div>
        <div className="form-grid">
          <label htmlFor="checkin-heart">
            Heart rate{" "}
            <NumericControl
              id="checkin-heart"
              label="Heart rate"
              min={30}
              max={220}
              value={draft.heart}
              onChange={(heart) => setDraft({ ...draft, heart })}
              unit="bpm"
            />
            <small>Record at rest using your usual method.</small>
          </label>
          <label htmlFor="checkin-sleep">
            Sleep duration{" "}
            <NumericControl
              id="checkin-sleep"
              label="Sleep duration"
              min={0}
              max={24}
              step={0.1}
              value={draft.sleep}
              onChange={(sleep) => setDraft({ ...draft, sleep })}
              unit="hours"
            />
            <small>Total sleep during your last sleep period.</small>
          </label>
          <div className="blood-label">
            <span className="field-label">Blood pressure</span>
            <div className="blood-inputs">
              <NumericControl
                id="checkin-systolic"
                label="Systolic blood pressure"
                min={60}
                max={250}
                value={draft.systolic}
                onChange={(systolic) => setDraft({ ...draft, systolic })}
                unit="systolic"
              />
              <span>/</span>
              <NumericControl
                id="checkin-diastolic"
                label="Diastolic blood pressure"
                min={30}
                max={160}
                value={draft.diastolic}
                onChange={(diastolic) => setDraft({ ...draft, diastolic })}
                unit="diastolic"
              />
              <span className="muted">mmHg</span>
            </div>
          </div>
        </div>
        <div className="form-section-label">
          <span>02</span> HOW YOU’RE FEELING
        </div>
        <fieldset>
          <legend>Fatigue level</legend>
          <div className="choice-grid fatigue-choices">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                className={draft.fatigue === n ? "active" : ""}
                aria-pressed={draft.fatigue === n}
                key={n}
                onClick={() => setDraft({ ...draft, fatigue: n })}
              >
                <strong>{n}</strong>
                <small>{["Very low", "Low", "Moderate", "High", "Very high"][n - 1]}</small>
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>How is your mood today?</legend>
          <div className="choice-grid mood-choices">
            {["Low", "Fair", "Good", "Great"].map((m) => (
              <button
                type="button"
                className={draft.mood === m ? "active" : ""}
                key={m}
                aria-pressed={draft.mood === m}
                onClick={() => setDraft({ ...draft, mood: m })}
              >
                <Icon name="smile" size={21} />
                {m}
              </button>
            ))}
          </div>
        </fieldset>
        <label className="notes-label">
          Additional notes <span className="muted">(optional)</span>
          <textarea
            maxLength={1000}
            placeholder="Anything else to note? Think workload, rest, exercise, or how you’re feeling."
            value={draft.notes}
            onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
            rows={3}
          />
        </label>
        {error && (
          <p className="form-error" role="alert">
            <Icon name="info" size={17} />
            {error}
          </p>
        )}
        <div className="form-actions">
          <span>
            <Icon name="shield" size={16} />
            Draft held in this session only
          </span>
          <button className="primary-button" type="submit">
            <Icon name="check" size={17} />
            Review check-in
          </button>
        </div>
      </form>
      <aside>
        <section className="panel checkin-context">
          <span className="section-icon">
            <Icon name="globe" size={25} />
          </span>
          <h2>
            A small check-in.
            <br />A bigger picture.
          </h2>
          <p>
            Consistent records help you and your mission team understand what’s typical for you—and
            notice when something changes.
          </p>
          <hr />
          <h3>Before you begin</h3>
          <ul>
            <li>Take measurements in a consistent setting.</li>
            <li>Follow your mission’s measurement protocols.</li>
            <li>Use the notes for anything that adds context.</li>
          </ul>
          <div className="info-banner">
            <Icon name="info" size={18} />
            <span>This is an educational concept. Do not use it to make medical decisions.</span>
          </div>
        </section>
      </aside>
    </div>
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
  const [topic, setTopic] = useState(0);
  const [modal, setModal] = useState<"about" | "settings" | "export" | "onboarding" | null>(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("tanaworbit_onboarded")) {
      return "onboarding";
    }
    return null;
  });
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("tanaworbit_theme") as "dark" | "light") || "dark";
    }
    return "dark";
  });
  const [liveStream, setLiveStream] = useState<boolean>(true);
  const [pulseOscillation, setPulseOscillation] = useState<number>(0);
  const [symptomLogs, setSymptomLogs] = useState<SymptomLog[]>([]);
  const [toast, setToast] = useState("");
  const [toastTone, setToastTone] = useState<"success" | "info">("success");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [units, setUnits] = useState("Celsius");
  const [toolkitTab, setToolkitTab] = useState<ToolkitTab>("measure");
  const [toolkitMetric, setToolkitMetric] = useState<MetricId>("heart");
  const [contextId, setContextId] = useState("orbital");
  const [guideOpen, setGuideOpen] = useState(false);
  const [guidanceReviewed, setGuidanceReviewed] = useState<Record<string, boolean>>({});
  const [pendingMetric, setPendingMetric] = useState<MetricId | null>(null);
  const display = useConsoleDisplay();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("tanaworbit_theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!liveStream) return;
    const interval = window.setInterval(() => {
      setPulseOscillation((prev) => (prev === 0 ? 1 : prev === 1 ? -1 : 0));
    }, 2400);
    return () => window.clearInterval(interval);
  }, [liveStream]);
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
    setSidebarOpen(false);
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
  function openModal(next: "about" | "settings" | "export") {
    setSidebarOpen(false);
    setModal(next);
  }
  function exportData() {
    const rows = [
      ["TanawOrbit — simulated educational data"],
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
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tanaworbit-${person.name.toLowerCase().replace(" ", "-")}-day${mission.day}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    notify("Simulated health summary exported as CSV.");
    setModal(null);
  }
  const alerts = [
    {
      id: "sleep",
      status: (sleepObserve ? "Observe" : "Stable") as Status,
      title: sleepObserve
        ? "Sleep duration below personal baseline"
        : "Sleep duration close to personal baseline",
      text: `${reading.sleep} hours recorded compared with a ${baseline.sleep}-hour personal baseline. Review sleep patterns and recent schedule changes.`,
      time: "08:32",
      icon: "moon" as IconName,
    },
    {
      id: "fatigue",
      status: (fatigueObserve ? "Observe" : "Stable") as Status,
      title: fatigueObserve
        ? "Reported fatigue has increased"
        : "Fatigue remains within recent pattern",
      text: `Self-reported fatigue is ${reading.fatigue}/5. The recent personal baseline is ${baseline.fatigue}/5. Consider alongside sleep and workload.`,
      time: "08:32",
      icon: "battery" as IconName,
    },
    {
      id: "heart",
      status: (heartObserve ? "Observe" : "Stable") as Status,
      title: heartObserve
        ? "Heart rate differs from personal pattern"
        : "Heart rate within recent personal pattern",
      text: `${reading.heart} bpm recorded; personal baseline is ${baseline.heart} bpm. ${heartObserve ? "Review measurement context and recent activity." : "No significant change in the simulated trend."}`,
      time: "08:30",
      icon: "heart" as IconName,
    },
    ...(bpObserve
      ? [
          {
            id: "bp",
            status: "Observe" as Status,
            title: "Blood pressure differs from personal pattern",
            text: `${reading.systolic}/${reading.diastolic} mmHg recorded compared with a ${baseline.systolic}/${baseline.diastolic} mmHg personal baseline. Review measurement context.`,
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
            text: "A simulated crew note requests a mission health team review. This flag is not a medical diagnosis.",
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
        name: "Heart Rate",
        icon: "heart",
        value: String(reading.heart),
        unit: "bpm",
        base: `${baseline.heart} bpm`,
        status: heartObserve ? "Observe" : "Stable",
        note: `${Number((reading.heart - baseline.heart).toFixed(1)) >= 0 ? "+" : ""}${Number((reading.heart - baseline.heart).toFixed(1))} bpm from baseline`,
        type: 0,
      },
      {
        name: "Blood Pressure",
        icon: "pressure",
        value: `${reading.systolic}/${reading.diastolic}`,
        unit: "mmHg",
        base: `${baseline.systolic}/${baseline.diastolic} mmHg`,
        status: bpObserve ? "Observe" : "Stable",
        note: bpObserve ? "Changed from personal pattern" : "Within recent personal pattern",
        type: 1,
      },
      {
        name: "Sleep Duration",
        icon: "moon",
        value: String(reading.sleep),
        unit: "hrs",
        base: `${baseline.sleep} hrs`,
        status: sleepObserve ? "Observe" : "Stable",
        note: `${Math.abs(reading.sleep - baseline.sleep).toFixed(1)} hrs ${reading.sleep < baseline.sleep ? "below" : "above"} baseline`,
        type: 2,
      },
      {
        name: "Fatigue Level",
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
                  card.name === "Fatigue Level"
                    ? "Fatigue"
                    : card.name === "Sleep Duration"
                      ? "Sleep"
                      : card.name === "Blood Pressure"
                        ? "Blood pressure"
                        : "Heart rate",
                );
                navigate("Health Trends");
              }}
            >
              <div className="metric-top">
                <span>
                  <Icon name={card.icon} size={17} />
                  {card.name}
                </span>
                <span className={`mini-dot ${card.status.toLowerCase()}`} title={card.status} />
              </div>
              <div className="metric-value">
                {card.value}
                <span>{card.unit}</span>
              </div>
              <div className="metric-baseline">
                Personal baseline <b>{card.base}</b>
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
              <span>Mood</span>
              <strong>
                {reading.mood} <small>Self-reported</small>
              </strong>
            </div>
            <Badge status="Stable" />
          </div>
          <div>
            <span className="secondary-icon">
              <Icon name="thermometer" />
            </span>
            <div>
              <span>Body Temperature</span>
              <strong>
                {units === "Celsius"
                  ? latestRecord(person.id).temperatureC
                  : ((latestRecord(person.id).temperatureC * 9) / 5 + 32).toFixed(1)}
                <small>°{units === "Celsius" ? "C" : "F"}</small>
              </strong>
            </div>
            <Badge status="Stable" />
          </div>
          <div>
            <span className="secondary-icon">
              <Icon name="pulse" />
            </span>
            <div>
              <span>Oxygen Saturation</span>
              <strong>
                {latestRecord(person.id).spo2 ?? 98} <small>% SpO₂</small>
              </strong>
            </div>
            <Badge status="Stable" />
          </div>
          <div>
            <span className="secondary-icon">
              <Icon name="battery" />
            </span>
            <div>
              <span>Blood Glucose</span>
              <strong>
                {latestRecord(person.id).glucoseMgDl ?? 88} <small>mg/dL (Fasting)</small>
              </strong>
            </div>
            <Badge status="Stable" />
          </div>
          <div>
            <span className="secondary-icon">
              <Icon name="wind" />
            </span>
            <div>
              <span>Respiration</span>
              <strong>
                {latestRecord(person.id).respiration} <small>breaths/min</small>
              </strong>
            </div>
            <Badge status="Stable" />
          </div>
          <div>
            <span className="secondary-icon">
              <Icon name="globe" />
            </span>
            <div>
              <span>Radiation Dose</span>
              <strong>
                12 <small>µGy/h (Nominal)</small>
              </strong>
            </div>
            <Badge status="Stable" />
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
          title="Personal Health Trends"
          description={`Synthetic JSON history, compared with a ${rules.baselineWindowDays}-day example personal baseline.`}
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
          {["Heart rate", "Blood pressure", "Sleep", "Fatigue"].map((m) => (
            <button key={m} className={metric === m ? "selected" : ""} onClick={() => setMetric(m)}>
              {m}
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
                <stop offset="0%" stopColor="#49c6e8" stopOpacity=".16" />
                <stop offset="100%" stopColor="#49c6e8" stopOpacity="0" />
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
              stroke="#8a9ab5"
              strokeDasharray="5 5"
              strokeWidth="1.2"
            />
            <polygon points={`48,193 ${points} 708,193`} fill="url(#chartFill)" />
            <polyline
              points={points}
              fill="none"
              stroke="#55cce8"
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
                  stroke="#a8a1d4"
                  strokeDasharray="5 5"
                  strokeWidth="1"
                  opacity=".65"
                />
                <polyline
                  points={diastolicSamples.map((v, i) => `${px(i)},${py(v)}`).join(" ")}
                  fill="none"
                  stroke="#aaa2e3"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                {diastolicSamples.map((v, i) => (
                  <circle
                    key={i}
                    cx={px(i)}
                    cy={py(v)}
                    r={i === days - 1 ? 4 : 2.7}
                    fill="#17212e"
                    stroke="#aaa2e3"
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
                  fill={i === days - 1 ? "#d4faff" : "#14222e"}
                  stroke="#55cce8"
                  strokeWidth="1.8"
                  pointerEvents="none"
                />
                {hover === i && (
                  <line
                    x1={px(i)}
                    x2={px(i)}
                    y1="25"
                    y2="194"
                    stroke="#55cce8"
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
            Baseline is the mean of the previous {rules.baselineWindowDays} synthetic mission days,
            not a clinical reference range.
          </span>
          {!expanded && (
            <button className="text-button" onClick={() => navigate("Health Trends")}>
              Explore trends <Icon name="arrow" size={15} />
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
          title="Recent Changes"
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
                Sleep duration{" "}
                <span className={sleepObserve ? "amber-text" : "green-text"}>
                  {sleepObserve ? "↓" : "↔"} {Math.abs(reading.sleep - baseline.sleep).toFixed(1)}{" "}
                  hrs
                </span>
              </div>
              <p>
                {sleepObserve
                  ? "Sleep duration has decreased compared with your recent personal baseline."
                  : "Sleep duration is close to your recent personal baseline."}
              </p>
              <small>
                Latest {reading.sleep} hrs <span>·</span> Baseline {baseline.sleep} hrs
              </small>
            </div>
          </div>
          <div className="change-item">
            <span className={`change-icon ${fatigueObserve ? "amber-text" : "green-text"}`}>
              <Icon name="battery" size={18} />
            </span>
            <div>
              <div className="change-title">
                Reported fatigue{" "}
                <span className={fatigueObserve ? "amber-text" : "green-text"}>
                  {fatigueObserve ? "↑" : "↔"}{" "}
                  {Math.abs(reading.fatigue - baseline.fatigue).toFixed(1)} pts
                </span>
              </div>
              <p>
                {fatigueObserve
                  ? "Self-reported fatigue is above the recent synthetic personal baseline."
                  : "Self-reported fatigue is close to your recent pattern."}
              </p>
              <small>
                Latest {reading.fatigue}/5 <span>·</span> Baseline {baseline.fatigue}/5
              </small>
            </div>
          </div>
          <div className="change-item">
            <span className={`change-icon ${heartObserve ? "amber-text" : "green-text"}`}>
              <Icon name="heart" size={18} />
            </span>
            <div>
              <div className="change-title">
                Heart rate{" "}
                <span className={heartObserve ? "amber-text" : "green-text"}>
                  {heartObserve ? "Changed pattern" : "Within pattern"}
                </span>
              </div>
              <p>
                {heartObserve
                  ? "Recorded heart rate differs from your recent personal baseline. Review measurement context."
                  : "No significant change from your recent personal baseline."}
              </p>
            </div>
          </div>
        </div>
        <button className="panel-link" onClick={() => navigate("Alerts & Attention")}>
          Review all observations <Icon name="arrow" size={16} />
        </button>
      </section>
    );
  }

  function Physiology({ full = false }: { full?: boolean }) {
    const signals: { label: string; value: string; unit: string; icon: IconName; data: string }[] =
      [
        {
          label: "Heart rate",
          value: String(reading.heart),
          unit: "bpm",
          icon: "heart",
          data: "0,25 10,25 15,22 19,28 23,8 27,42 31,19 36,25 48,25 53,22 57,28 61,8 65,42 69,19 74,25 86,25 91,22 95,28 99,8 103,42 107,19 112,25 125,25 130,22 134,28 138,8 142,42 146,19 151,25 165,25 170,22 174,28 178,8 182,42 186,19 191,25 205,25 210,22 214,28 218,8 222,42 226,19 231,25 245,25 250,22 254,28 258,8 262,42 266,19 271,25 290,25",
        },
        {
          label: "Oxygen saturation",
          value: "98",
          unit: "% SpO₂",
          icon: "pulse",
          data: "0,33 8,33 15,12 23,8 31,18 38,24 45,33 55,33 62,12 70,8 78,18 85,24 92,33 102,33 109,12 117,8 125,18 132,24 139,33 149,33 156,12 164,8 172,18 179,24 186,33 196,33 203,12 211,8 219,18 226,24 233,33 243,33 250,12 258,8 266,18 273,24 280,33 290,33",
        },
        {
          label: "Respiration",
          value: String(latestRecord(person.id).respiration),
          unit: "breaths/min",
          icon: "wind",
          data: "0,28 10,16 20,9 30,8 40,15 50,28 60,37 70,36 80,26 90,15 100,8 110,9 120,18 130,30 140,37 150,34 160,23 170,12 180,7 190,11 200,21 210,33 220,37 230,31 240,20 250,10 260,8 270,14 280,26 290,36",
        },
      ];
    return (
      <section className={`panel physiology-panel ${full ? "full-physiology" : ""}`}>
        <PanelTitle
          title="Physiological Monitoring"
          description="PUMA-inspired multi-signal visualization"
          action={
            <span className="simulation-label">
              <span />
              SIMULATED
            </span>
          }
        />
        <div className="signal-list">
          {signals.map((s, i) => (
            <div className={`signal-row signal-${i}`} key={s.label}>
              <div className="signal-label">
                <Icon name={s.icon} size={16} />
                <span>{s.label}</span>
              </div>
              <svg viewBox="0 0 290 50" preserveAspectRatio="none" aria-hidden="true">
                <polyline
                  points={s.data}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <strong>
                {s.value}
                <small>{s.unit}</small>
              </strong>
            </div>
          ))}
        </div>
        {full && (
          <div className="physiology-values">
            {[
              {
                name: "End-tidal CO₂",
                value: "38",
                unit: "mmHg",
                note: "Carbon dioxide-related measurement",
              },
              {
                name: "Airflow",
                value: "6.4",
                unit: "L/min",
                note: "Simulated minute ventilation",
              },
              {
                name: "Temperature",
                value:
                  units === "Celsius"
                    ? latestRecord(person.id).temperatureC
                    : ((latestRecord(person.id).temperatureC * 9) / 5 + 32).toFixed(1),
                unit: units === "Celsius" ? "°C" : "°F",
                note: "Simulated body temperature",
              },
              { name: "Pressure", value: "101.3", unit: "kPa", note: "Simulated ambient pressure" },
            ].map((s) => (
              <div key={s.name}>
                <span>{s.name}</span>
                <strong>
                  {s.value}
                  <small>{s.unit}</small>
                </strong>
                <p>{s.note}</p>
              </div>
            ))}
          </div>
        )}
        <div className="physiology-disclaimer">
          <Icon name="info" size={14} />
          <p>Simulated physiological data for demonstration. Not connected to a NASA device.</p>
          {!full && (
            <button
              aria-label="Open physiological monitoring"
              onClick={() => navigate("Physiological Monitoring")}
            >
              <Icon name="arrow" size={17} />
            </button>
          )}
        </div>
      </section>
    );
  }

  function Insights({ full = false }: { full?: boolean }) {
    return (
      <section className={`panel insights-panel ${full ? "full-insights" : ""}`}>
        <PanelTitle
          title="Personalized Health Insights"
          description="Observe patterns. Add context. Make informed reviews."
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
                  ? "Sleep & recovery deserve a closer look"
                  : "Continue tracking sleep & recovery"}
              </h3>
              <span>Compared with your synthetic {rules.baselineWindowDays}-day history</span>
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
              <span>Personal baseline</span>
              <strong>
                {baseline.sleep}
                <small>hrs</small>
              </strong>
            </div>
            <div>
              <span>Observed change</span>
              <strong className={sleepObserve ? "amber-text" : "green-text"}>
                {reading.sleep < baseline.sleep ? "↓" : "↑"}{" "}
                {Math.abs(reading.sleep - baseline.sleep).toFixed(1)}
                <small>hrs</small>
              </strong>
            </div>
          </div>
          <p>
            Your recorded sleep is {reading.sleep < baseline.sleep ? "below" : "above"} your recent
            baseline
            {fatigueObserve ? ", alongside increased self-reported fatigue" : ""}. Review your sleep
            schedule and recent workload for additional context.
          </p>
          {full && (
            <div className="info-banner">
              <Icon name="info" size={18} />
              <span>
                Trend direction: {sleepObserve ? "decreasing" : "steady"}. This is an observation
                from simulated records, not a diagnosis or treatment recommendation.
              </span>
            </div>
          )}
        </div>
        <button
          className="panel-link"
          onClick={() => {
            setTopic(0);
            navigate("Health Guidance");
          }}
        >
          Explore sleep & recovery guidance <Icon name="arrow" size={16} />
        </button>
      </section>
    );
  }

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
            onClick={() => setSidebarOpen(false)}
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
              TanawOrbit<small>HEALTH OPERATIONS</small>
            </span>
          </button>
          <div className="workspace-label">MISSION WORKSPACE</div>
          <nav aria-label="Main navigation" className="sidebar-grouped-nav space-y-4">
            {navGroups.map((group) => (
              <div key={group.pillar} className="nav-group-section">
                <div className="text-[10px] font-mono tracking-wider text-slate-500 font-bold px-3 py-1 mb-1 border-b border-slate-800/60">
                  {group.pillar}
                </div>
                <div className="space-y-0.5">
                  {group.items.map(({ page: target, label, icon }) => (
                    <button
                      key={target}
                      className={page === target ? "nav-item active" : "nav-item"}
                      aria-current={page === target ? "page" : undefined}
                      onClick={() => navigate(target)}
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
              Display Settings
            </button>
            <button className="nav-item" onClick={() => openModal("export")}>
              <Icon name="download" size={18} />
              Export summary
            </button>
            <button className="nav-item" onClick={() => openModal("about")}>
              <Icon name="help" size={18} />
              About this concept
              <Icon name="external" size={13} />
            </button>
            <div className="sidebar-user">
              <Avatar person={person} />
              <div>
                {person.name}
                <small>{person.role}</small>
              </div>
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
                className="mobile-menu"
                aria-label="Open navigation"
                onClick={() => setSidebarOpen(true)}
              >
                <Icon name="menu" />
              </button>
              {display.touch && (
                <div className="console-wordmark">
                  TanawOrbit<small>CREW HEALTH CONSOLE</small>
                </div>
              )}
              <Icon name="globe" size={16} />
              <span>{mission.name}</span>
              <Icon name="chevron" size={12} />
              <strong>{page}</strong>
            </div>
            <div className="topbar-right">
              <span className="system-status">
                <span className="status-dot" />
                Simulation telemetry nominal
              </span>
              <div className="display-controls">
                <button
                  className={`display-control ${display.touch ? "is-on" : ""}`}
                  aria-label={display.touch ? "Use workstation layout" : "Use portable layout"}
                  aria-pressed={display.touch}
                  title="Switch between Workstation and Tactical Tablet mode"
                  onClick={() => display.setMode(display.touch ? "desktop" : "touch")}
                >
                  {display.touch ? <Tablet size={15} /> : <Monitor size={15} />}
                  <span>{display.touch ? "Tactical Tablet" : "Workstation"}</span>
                </button>
                <button
                  className="display-control"
                  aria-label="Toggle visual theme"
                  title={theme === "dark" ? "Switch to Clean Daylight Mode" : "Switch to Dark Ops Mode"}
                  onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
                >
                  {theme === "dark" ? (
                    <Sun size={15} className="text-amber-400" />
                  ) : (
                    <Moon size={15} className="text-cyan-300" />
                  )}
                  <span>{theme === "dark" ? "Daylight" : "Dark Ops"}</span>
                </button>
                <button
                  className={`display-control ${liveStream ? "is-on" : ""}`}
                  aria-label="Toggle live simulation telemetry stream"
                  title="Simulate continuous live physiological sensor stream (4 Hz)"
                  onClick={() => setLiveStream((v) => !v)}
                >
                  <Radio size={14} className={liveStream ? "text-cyan-400 animate-pulse" : "text-slate-400"} />
                  <span>{liveStream ? "Live 4Hz" : "Paused"}</span>
                </button>
                <button
                  className="display-control"
                  aria-label="Orientation Tour"
                  title="Explore guided mission walkthrough"
                  onClick={() => setModal("onboarding")}
                >
                  <Compass size={15} className="text-cyan-400" />
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
              <button
                className="notification-button"
                aria-label="Open health monitoring alerts"
                onClick={() => navigate("Alerts & Attention")}
              >
                <Icon name="bell" size={19} />
                <i />
              </button>
              <button
                className="topbar-avatar"
                aria-label="Open mission crew"
                onClick={() => navigate("Mission Overview")}
              >
                <Avatar person={person} />
              </button>
            </div>
          </header>
          <main className={display.touch ? "!pb-36" : ""}>
            <div className="page-heading">
              <div>
                <div className="eyebrow">
                  <span />
                  CREW HEALTH OPERATIONS
                </div>
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
                {page !== "Health Check-In" && page !== "Health Guidance" && (
                  <button className="primary-button" onClick={() => navigate("Health Check-In")}>
                    <Icon name="plus" size={18} />
                    Daily check-in
                  </button>
                )}
              </div>
            </div>

            <div className="console-ribbon">
              <div className="console-mode-icon">
                <Icon name={display.touch ? "tablet" : "monitor"} size={22} />
              </div>
              <div>
                <strong>{display.touch ? "Touch console" : "Personal health console"}</strong>
                <span>
                  {display.touch
                    ? "Larger targets. Deliberate actions. Your crew in focus."
                    : "Your personal patterns, in one connected view."}
                </span>
              </div>
              <div className="console-session">
                <span className="status-dot" />
                LOCAL DEMO SESSION
              </div>
              <button
                className="ribbon-settings"
                aria-label="Open display settings"
                onClick={() => openModal("settings")}
              >
                <Icon name="settings" size={16} />
                <span>Display settings</span>
                <Icon name="settings" size={15} />
              </button>
            </div>

            <div className="mission-context-strip">
              <label>
                EDUCATIONAL CONTEXT PREVIEW
                <select
                  aria-label="Mission context preview"
                  value={contextId}
                  onChange={(event) => setContextId(event.target.value)}
                >
                  {missionContexts.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </label>
              <p>
                {contextId === "orbital"
                  ? "Explore environment-specific context. Values and rules remain synthetic examples."
                  : "Scenario preview only. Source records remain orbital; baselines and comparison rules do not change."}
              </p>
              <button onClick={() => openToolkit("context")}>
                Why context matters <Icon name="arrow" size={16} />
              </button>
            </div>
            {reminder.due && routineCount < routineDefinitions.length && (
              <div className="routine-reminder-banner" role="status">
                <span className="reminder-banner-icon">
                  <Icon name="clock" size={23} />
                </span>
                <div>
                  <strong>A moment for your demo routine.</strong>
                  <p>
                    {routineDefinitions.length - routineCount} actions remain in this run. This is
                    an in-page prompt, not a medical alert.
                  </p>
                </div>
                <div className="reminder-banner-actions">
                  <button className="primary-button" onClick={() => openToolkit("routine")}>
                    Open checklist
                  </button>
                  <button className="secondary-button" onClick={reminder.snooze}>
                    Snooze 5 min
                  </button>
                  <button
                    aria-label="Dismiss routine reminder"
                    className="reminder-dismiss"
                    onClick={reminder.dismiss}
                  >
                    <Icon name="close" size={18} />
                  </button>
                </div>
              </div>
            )}

            {page !== "Mission Overview" && (
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
                        <Icon name="clock" size={14} />
                        Last check-in:{" "}
                        {checkedIn[selectedCrew] ? "just now" : "Today, 08:32 UTC (fictional)"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mission-day">
                  <span>MISSION DAY</span>
                  <strong>
                    {mission.day}
                    <span>/ {mission.durationDays}</span>
                  </strong>
                  <div className="day-progress">
                    <span />
                  </div>
                </div>
                <div className="banner-earth" />
                <div className="earth-coordinate">
                  <span className="status-dot" />
                  LOW EARTH ORBIT <small>408 KM ALTITUDE</small>
                </div>
              </section>
            )}

            {page === "Astronaut Dashboard" && (
              <>
                <div className="section-label">
                  <h2>Health at a glance</h2>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span>
                      <span className="tiny-dot" />
                      Updated today, {checkedIn[selectedCrew] ? "just now" : "08:32 UTC"}
                      <span className="label-divider" />
                      {liveStream ? "Live Telemetry Active" : "Simulated telemetry"}
                    </span>
                    <button
                      type="button"
                      onClick={() => openModal("export")}
                      style={{
                        fontSize: "11px",
                        fontFamily: "var(--font-mono)",
                        padding: "3px 8px",
                        background: "rgba(92, 201, 230, 0.15)",
                        border: "1px solid rgba(92, 201, 230, 0.4)",
                        borderRadius: "4px",
                        color: "#5cc9e6",
                        cursor: "pointer",
                      }}
                    >
                      Telemetry Dossier (PDF)
                    </button>
                  </div>
                </div>
                <MetricCards />
                <div style={{ margin: "24px 0" }}>
                  <AnatomicalAvatar
                    onLogSymptom={(log) => {
                      setSymptomLogs((prev) => [...prev, log]);
                      notify(`Symptom recorded: ${log.symptom} (${log.severity})`);
                    }}
                    recentLogs={symptomLogs}
                  />
                </div>
                <div style={{ margin: "24px 0" }}>
                  <PumaTracker />
                </div>
                <NextSteps
                  reading={reading}
                  baseline={baseline}
                  completed={routineCount}
                  total={routineDefinitions.length}
                  onOpen={openToolkit}
                />
                <div className="dashboard-middle">
                  <TrendPanel />
                  <RecentChanges />
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
                    <h3>Understand the signals. Support the mission.</h3>
                    <p>Explore educational guidance on sleep, fatigue, and health in space.</p>
                  </div>
                  <button className="secondary-button" onClick={() => navigate("Health Guidance")}>
                    Explore health guidance
                    <Icon name="arrow" size={16} />
                  </button>
                </div>
              </>
            )}

            {page === "Mission Overview" && (
              <>
                <section className="mission-overview-banner">
                  <div>
                    <span className="eyebrow">LONG-DURATION MISSION · ACTIVE</span>
                    <h2>{mission.name}</h2>
                    <p>
                      Keeping our crew connected to their health.
                      <br />
                      From the everyday check-in to the bigger picture.
                    </p>
                    <div className="overview-mission-stats">
                      <span>
                        <strong>
                          {mission.day}
                          <small>/ {mission.durationDays}</small>
                        </strong>
                        MISSION DAY
                      </span>
                      <span>
                        <strong>04</strong>CREW MEMBERS
                      </span>
                      <span>
                        <strong>
                          {mission.altitudeKm}
                          <small>km</small>
                        </strong>
                        ORBITAL ALTITUDE
                      </span>
                    </div>
                  </div>
                  <div className="overview-orbit">
                    <Icon name="globe" size={60} />
                  </div>
                </section>
                <div className="section-label">
                  <h2>Crew health overview</h2>
                  <span>
                    <span className="tiny-dot" />
                    Simulated crew data · Day {mission.day}
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
                          <span>Fatigue</span>
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
                          : "Last check-in today, 08:32 UTC (fictional)"}
                      </span>
                      <div className="crew-card-link">
                        {allowCrewSwitch || i === selectedCrew
                          ? "Open personal dashboard"
                          : "Visible for context"}
                        <Icon name="arrow" size={17} />
                      </div>
                    </button>
                  ))}
                </div>
                <section className="panel mission-console">
                  <PanelTitle
                    title="Mission monitoring protocol"
                    description="A shared framework for understanding changes—not assigning diagnoses."
                  />
                  <div className="protocol-grid">
                    {(
                      [
                        { status: "Stable", text: "No significant change from personal baseline." },
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
                <div className="info-banner">
                  <Icon name="info" size={18} />
                  <span>
                    All crew members, mission details, and health records are fictional.
                    {allowCrewSwitch
                      ? " Admin demo access can open any profile."
                      : " This astronaut door stays on the signed-in profile."}
                  </span>
                </div>
              </>
            )}

            {page === "Health Trends" && (
              <>
                <div className="section-label">
                  <h2>Measurements over time</h2>
                  <span>
                    Personal baseline window: previous {rules.baselineWindowDays} mission days
                  </span>
                </div>
                <TrendPanel expanded />
                <div className="dashboard-bottom">
                  <RecentChanges />
                  <Insights full />
                </div>
                <section className="panel baseline-panel">
                  <PanelTitle
                    title="Your personal baseline"
                    description="A recent reference for comparison, unique to the individual."
                  />
                  <div className="baseline-grid">
                    {[
                      ["Heart rate", String(baseline.heart), "bpm"],
                      ["Blood pressure", `${baseline.systolic}/${baseline.diastolic}`, "mmHg"],
                      ["Sleep duration", String(baseline.sleep), "hours"],
                      ["Fatigue level", String(baseline.fatigue), "/ 5"],
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
                    These fictional baselines support educational comparisons only. They are not
                    clinical thresholds or population reference ranges.
                  </p>
                </section>
              </>
            )}

            {page === "Health Check-In" && (
              <CheckIn
                key={selectedCrew}
                draft={drafts[selectedCrew]}
                onDraftChange={(draft) =>
                  setDrafts((old) => old.map((r, i) => (i === selectedCrew ? draft : r)))
                }
                person={person}
                navigate={navigate}
                onSave={(draft) => {
                  setReadings((old) => old.map((r, i) => (i === selectedCrew ? { ...draft } : r)));
                  setCheckedIn((old) => old.map((v, i) => (i === selectedCrew ? true : v)));
                  setDrafts((old) => old.map((r, i) => (i === selectedCrew ? { ...draft } : r)));
                  setReviewed((old) => old.filter((key) => !key.startsWith(`${selectedCrew}-`)));
                  notify("Daily check-in recorded for this demo session.");
                }}
              />
            )}
            {page === "Exercise & Recovery" && (
              <ExercisePanel
                key={person.id}
                person={person}
                reading={reading}
                records={exerciseSessions}
                onRecord={(record) => setExerciseSessions((old) => [...old, record])}
              />
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
              <SensorimotorPanel
                onRecordResult={(res) => {
                  notify(`Assessment recorded: ${res.score} ${res.unit} (${res.status})`);
                }}
              />
            )}
            {page === "Cabin Conditions" && <CabinPanel />}
            {page === "Orbital Conditions" && <OrbitalPanel />}
            {page === "Space Nutrition" && <NutritionPanel crewId={person.id} />}

            {page === "Physiological Monitoring" && (
              <>
                <div className="info-banner simulated-notice">
                  <Icon name="info" size={20} />
                  <div>
                    <strong>Simulated physiological monitoring · demonstration only</strong>
                    <p>
                      Inspired by the concept of NASA’s PUMA physiological monitoring. This
                      educational interface has no connection to an actual NASA device. Waveforms
                      are illustrative, not live sensor recordings.
                    </p>
                  </div>
                </div>
                <Physiology full />
                <div className="dashboard-bottom">
                  <section className="panel monitoring-context">
                    <PanelTitle
                      title="Signal context"
                      description="Several measurements. One connected picture."
                    />
                    <p>
                      Physiological signals are interpreted together with the individual’s recent
                      patterns, measurement conditions, and self-reported context.
                    </p>
                    <div className="context-row">
                      <Icon name="pulse" />
                      <div>
                        <strong>Multi-signal observation</strong>
                        <p>
                          Heart rate, respiration, and gas-related signals offer complementary
                          perspectives.
                        </p>
                      </div>
                    </div>
                    <div className="context-row">
                      <Icon name="shield" />
                      <div>
                        <strong>Human review remains essential</strong>
                        <p>
                          These illustrative signals do not establish a diagnosis or replace mission
                          medical assessment.
                        </p>
                      </div>
                    </div>
                  </section>
                  <Insights />
                </div>
              </>
            )}

            {page === "Alerts & Attention" && (
              <>
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
                          ? "No significant change from personal baseline."
                          : s === "Observe"
                            ? "A measurement has changed from its recent pattern."
                            : "Information should be reviewed."}
                      </p>
                    </button>
                  ))}
                </div>
                <section className="panel alert-console">
                  <PanelTitle
                    title="Monitoring event log"
                    description="Review observations in the context of the astronaut’s personal baseline."
                    action={
                      <select
                        aria-label="Filter alerts by status"
                        value={alertFilter}
                        onChange={(e) => setAlertFilter(e.target.value)}
                      >
                        {["All statuses", "Stable", "Observe", "Attention"].map((s) => (
                          <option key={s}>{s}</option>
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
                            Understand this observation <Icon name="arrow" size={14} />
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
                      <h3>No {alertFilter.toLowerCase()} observations</h3>
                      <p>There are no simulated observations in this category for {person.name}.</p>
                      <button
                        className="text-button"
                        onClick={() => setAlertFilter("All statuses")}
                      >
                        View all observations
                        <Icon name="arrow" size={16} />
                      </button>
                    </div>
                  )}
                </section>
                <div className="info-banner">
                  <Icon name="info" size={18} />
                  <span>
                    Status indicators describe changes in simulated records. They do not represent
                    medical diagnoses, emergency triage, or clinical recommendations.
                  </span>
                </div>
              </>
            )}

            {page === "Health Guidance" && (
              <>
                <div className="guidance-intro">
                  <span className="guidance-strip-icon">
                    <Icon name="book" size={25} />
                  </span>
                  <div>
                    <h2>Knowledge for life beyond Earth.</h2>
                    <p>
                      Educational context to help you understand measurements, personal patterns,
                      and the spaceflight environment.
                    </p>
                  </div>
                  <span className="simulation-label">EDUCATIONAL RESOURCE</span>
                </div>
                <div className="guidance-layout">
                  <section className="panel guidance-topics">
                    <div className="panel-heading">
                      <h2>Health topics</h2>
                    </div>
                    {topics.map((t, i) => (
                      <button
                        key={t.title}
                        className={topic === i ? "selected" : ""}
                        onClick={() => setTopic(i)}
                      >
                        <Icon name={t.icon} size={20} />
                        <span>{t.title}</span>
                        <Icon name="chevron" size={16} />
                      </button>
                    ))}
                  </section>
                  <section className="panel guidance-detail">
                    <span className="topic-tag">{topics[topic].tag}</span>
                    <h2>{topics[topic].title}</h2>
                    <p className="guidance-lead">{topics[topic].intro}</p>
                    <div className="guidance-block">
                      <span className="section-icon">
                        <Icon name="globe" size={21} />
                      </span>
                      <div>
                        <h3>The spaceflight consideration</h3>
                        <p>{topics[topic].consideration}</p>
                      </div>
                    </div>
                    <div className="guidance-block">
                      <span className="section-icon">
                        <Icon name="book" size={21} />
                      </span>
                      <div>
                        <h3>Educational guidance</h3>
                        <p>{topics[topic].guidance}</p>
                      </div>
                    </div>
                    <div className="source-area">
                      <span className="eyebrow">RESEARCH & SOURCE REFERENCE</span>
                      <a href={topics[topic].url} target="_blank" rel="noreferrer">
                        {topics[topic].source}
                        <Icon name="external" size={16} />
                      </a>
                      <p>
                        General educational reference, not a source for the fictional measurements
                        or automated interpretation in this concept.
                      </p>
                    </div>
                  </section>
                </div>
                <div className="info-banner">
                  <Icon name="shield" size={18} />
                  <span>
                    For educational purposes only. Always follow mission-specific protocols and
                    consult your mission medical team for individual health concerns.
                  </span>
                </div>
              </>
            )}

            <footer>
              <span>
                <span className="footer-dot" />
                TanawOrbit <span className="footer-separator">/</span> Educational concept
              </span>
              <span>
                Simulated data. Not a medical device.{" "}
                <button onClick={() => openModal("about")}>
                  Learn more <Icon name="external" size={11} />
                </button>
              </span>
              <span className="footer-version">
                MISSION SUPPORT SYSTEM <b>v.01</b>
              </span>
            </footer>
          </main>
        </div>
        {display.touch && (
          <nav className="touch-dock" aria-label="Touch navigation">
            {(
              [
                { page: "Astronaut Dashboard", label: "Dashboard", icon: "activity" },
                { page: "Health Check-In", label: "Check-in", icon: "plus" },
                { page: "Health Trends", label: "Trends", icon: "chart" },
                { page: "Alerts & Attention", label: "Alerts", icon: "bell" },
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
          <OnboardingModal onClose={() => setModal(null)} />
        )}
        {modal && modal !== "export" && modal !== "onboarding" && (
          <div className="modal-backdrop" onClick={() => setModal(null)}>
            <section
              className="panel modal"
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
              <span className="section-icon">
                <Icon
                  name={modal === "about" ? "shield" : "settings"}
                  size={27}
                />
              </span>
              <h2 id="modal-title">
                {modal === "about"
                  ? "A concept built for understanding."
                  : "Make the console work for you."}
              </h2>
              {modal === "about" ? (
                <>
                  <p>
                    TanawOrbit is an independent educational interface exploring personal health
                    monitoring during long-duration space missions.
                  </p>
                  <p>
                    Developed by team <strong>Tala Pulse</strong> for the NASA Space Apps Challenge 2026.
                    All crew profiles, mission telemetry, and clinical thresholds are based on real published spaceflight studies
                    (PMC10973451, PMC12612093, NASA STD-3001).
                  </p>
                  <p>
                    Check-ins and observations remain in local session memory. Not a certified clinical device.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Optimize the layout for a flight deck workstation, a crew tactical tablet, or front-facing touch display.
                  </p>
                  <label className="settings-label">
                    Display layout
                    <select
                      aria-label="Display layout"
                      value={display.mode}
                      onChange={(e) => display.setMode(e.target.value as DisplayMode)}
                    >
                      <option value="auto">Auto-detect</option>
                      <option value="desktop">Flight Workstation</option>
                      <option value="touch">Tactical Tablet</option>
                    </select>
                  </label>

                  <label className="settings-label">
                    Color Theme
                    <select value={theme} onChange={(e) => setTheme(e.target.value as "dark" | "light")}>
                      <option value="dark">Dark Ops (Deep Space)</option>
                      <option value="light">Clean Daylight (Clinical Light)</option>
                    </select>
                  </label>

                  <label className="settings-label">
                    Temperature unit
                    <select value={units} onChange={(e) => setUnits(e.target.value)}>
                      <option>Celsius</option>
                      <option>Fahrenheit</option>
                    </select>
                  </label>
                  <div className="info-banner">
                    <Icon name="info" size={17} />
                    <span>
                      Local simulation mode active. Settings and drafts reset on refresh.
                    </span>
                  </div>
                </>
              )}
              <button
                className="primary-button"
                onClick={() => setModal(null)}
              >
                {modal === "about" ? "Understood" : "Done"}
                <Icon name="check" size={16} />
              </button>
            </section>
          </div>
        )}
      </div>
      <button
        className={`tanaw-guide-launcher ${display.touch ? "above-dock" : ""}`}
        aria-label="Open Tanaw Guide"
        hidden={guideOpen}
        onClick={() => {
          setModal(null);
          setSidebarOpen(false);
          setGuideOpen(true);
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
        >
          <path d="M21 11a8 8 0 0 1-8 8H7l-5 3V11a9 9 0 0 1 19 0Z" />
          <path d="M6 11h3l2-4 3 8 2-4h3" />
        </svg>
        <span>
          Tanaw Guide<small>Scripted educational help</small>
        </span>
      </button>
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
