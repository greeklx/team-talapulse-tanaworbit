import { useState, useMemo } from "react";
import {
  Heart,
  Activity,
  Moon,
  Zap,
  Check,
  CheckSquare,
  AlertTriangle,
  Shield,
  Sliders,
  User,
  Clock,
  ArrowRight,
  ChevronRight,
  Copy,
  RotateCcw,
  Stethoscope,
  Eye,
  Frown,
  Laugh,
  Meh,
  Smile,
  Compass,
  Sparkles,
  Thermometer,
  Wind,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { personalBaseline, mission, crew, type BodySample, type Reading } from "./data";
import type { Page } from "./App";

export type MeasurementKey = "heart" | "systolic" | "diastolic" | "sleep";
export type CheckInDraft = Omit<Reading, MeasurementKey> & Record<MeasurementKey, number | "">;

export default function DailyHealthCheckIn({
  draft,
  onDraftChange,
  person,
  vitals,
  navigate,
  onSave,
}: {
  draft: CheckInDraft;
  onDraftChange: (draft: CheckInDraft) => void;
  person: (typeof crew)[number];
  vitals: BodySample;
  navigate: (page: Page) => void;
  onSave: (draft: Reading, vitals: BodySample) => void;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [syncToast, setSyncToast] = useState(false);
  const [error, setError] = useState("");

  // Additional In-Flight Spaceflight Symptoms (HRP clinical standards)
  const [sasRating, setSasRating] = useState<number>(0); // 0=Adapted, 1=Mild, 2=Moderate, 3=Severe
  const [cephaladShift, setCephaladShift] = useState<number>(1); // 0=None, 1=Mild Puffiness, 2=Head Fullness, 3=Severe
  const [sansVisualBlur, setSansVisualBlur] = useState<boolean>(false);
  const [coreTemp, setCoreTemp] = useState<number>(vitals.temperatureC);
  const [spo2, setSpo2] = useState<number>(vitals.spo2);
  const [glucose, setGlucose] = useState<number>(vitals.glucoseMgDl);
  const [respiration, setRespiration] = useState<number>(vitals.respiration);
  const [sleepQuality, setSleepQuality] = useState<"Sound" | "Fragmented" | "Restless">("Sound");

  const baseline = useMemo(() => {
    try {
      const b = personalBaseline(person.id);
      return {
        ...b,
        heart: Math.round(b.heart),
        systolic: Math.round(b.systolic),
        diastolic: Math.round(b.diastolic),
        sleep: +Number(b.sleep).toFixed(1),
      };
    } catch {
      return {
        heart: 71,
        systolic: 111,
        diastolic: 72,
        sleep: 7.2,
        fatigue: 2,
        mood: "Good",
        notes: "",
      } as Reading;
    }
  }, [person.id]);

  // Real-time delta calculations
  const hrVal = Math.round(Number(draft.heart) || baseline.heart);
  const sysVal = Math.round(Number(draft.systolic) || baseline.systolic);
  const diaVal = Math.round(Number(draft.diastolic) || baseline.diastolic);
  const sleepVal = +Number(draft.sleep || baseline.sleep).toFixed(1);

  const hrDelta = Math.round(hrVal - baseline.heart);
  const sysDelta = Math.round(sysVal - baseline.systolic);
  const diaDelta = Math.round(diaVal - baseline.diastolic);
  const sleepDelta = +(sleepVal - baseline.sleep).toFixed(1);

  // Form notes and demonstration reference indicators
  const clinicalAdvisories = useMemo(() => {
    const list: { type: "nominal" | "warning" | "alert"; text: string; action: string }[] = [];

    if (sansVisualBlur || cephaladShift >= 2) {
      list.push({
        type: "alert",
        text: "This form has a note about vision or a full feeling in the head.",
        action: "This note stays on the form. It is not a medical finding, and it is not the same check as the flags on Today.",
      });
    }

    if (sleepVal < 6.0) {
      const sleepSign = sleepDelta >= 0 ? `+${sleepDelta}` : `${sleepDelta}`;
      list.push({
        type: "warning",
        text: `Sleep on this form is ${sleepVal} hrs, under 6 hours. Compared with the 14-day average, that is ${sleepSign} hrs.`,
        action: "The flags on Today mark sleep only when it is more than 1 hour under the 14-day average.",
      });
    }

    if (hrVal > 95 || hrDelta > 18) {
      const hrSign = hrDelta >= 0 ? `+${hrDelta}` : `${hrDelta}`;
      list.push({
        type: "warning",
        text: `Heart rate on this form is ${hrVal} bpm (${hrSign} bpm from the 14-day average).`,
        action: "The flags on Today mark heart rate when it differs by more than 10 bpm.",
      });
    }

    if (sysVal >= 135 || diaVal >= 88) {
      list.push({
        type: "warning",
        text: `Blood pressure on this form is ${sysVal}/${diaVal} mmHg. This form adds a note at 135 or higher, or 88 or higher.`,
        action: "The flags on Today mark blood pressure when it differs by more than 10 mmHg from the 14-day average.",
      });
    }

    if (coreTemp >= 37.4) {
      list.push({
        type: "alert",
        text: `Temperature on this form is ${coreTemp}°C. This form adds a note at 37.4°C or higher.`,
        action: "This is not a fever diagnosis.",
      });
    }

    if (list.length === 0) {
      list.push({
        type: "nominal",
        text: "No extra note from this form. This is not a duty clearance, and it is not the same check as the flags on Today.",
        action: "The flags on Today use the 14-day comparison.",
      });
    }

    return list;
  }, [sansVisualBlur, cephaladShift, sleepVal, sleepDelta, hrVal, hrDelta, sysVal, diaVal, coreTemp]);

  // Fill sample reading for demonstration
  function fillSampleReading() {
    onDraftChange({
      ...draft,
      heart: baseline.heart,
      systolic: 120,
      diastolic: 73,
      sleep: baseline.sleep,
      fatigue: 2,
      mood: "Good",
    });
    setCoreTemp(36.6);
    setSpo2(98);
    setSasRating(0);
    setCephaladShift(1);
    setSansVisualBlur(false);
    setSleepQuality("Sound");
    setSyncToast(true);
    setTimeout(() => setSyncToast(false), 3000);
  }

  function handleNextStep() {
    if (step === 1) {
      if (Number(draft.systolic) <= Number(draft.diastolic)) {
        setError("Systolic pressure must be greater than diastolic pressure.");
        return;
      }
      setError("");
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  }

  function handleSaveCheckIn() {
    // Format full clinical note with in-flight symptoms for medical record
    const symptomsSummary = [
      `Balance and stomach: ${["Steady", "Mild unease", "Nausea", "Strong nausea"][sasRating]}`,
      `Full feeling in the head: ${["None", "Mild", "Full", "Heavy"][cephaladShift]}`,
      sansVisualBlur ? "Near vision blur: yes" : "Near vision blur: no",
      `Core Temp: ${coreTemp}°C`,
      `SpO2: ${spo2}%`,
      `Sleep Quality: ${sleepQuality}`,
    ].join(" · ");

    const combinedNotes = draft.notes
      ? `${draft.notes}\n[In-Flight Screen: ${symptomsSummary}]`
      : `[In-Flight Screen: ${symptomsSummary}]`;

    onSave(
      {
        ...draft,
        heart: hrVal,
        systolic: sysVal,
        diastolic: diaVal,
        sleep: sleepVal,
        notes: combinedNotes,
      },
      {
        temperatureC: coreTemp,
        spo2,
        glucoseMgDl: glucose,
        respiration,
      },
    );
    setSaved(true);
  }

  function copyFlightBriefing() {
    const text = `TanawOrbit check-in note
Mission: ${mission.name} · Day ${mission.day} of ${mission.durationDays}
Person: ${person.name} (${person.id.toUpperCase()}) · ${person.role}
Saved in this browser. This is not a medical record.

Numbers:
- Heart rate: ${hrVal} bpm (14-day average ${baseline.heart} bpm, ${hrDelta >= 0 ? "+" : ""}${hrDelta} bpm)
- Blood pressure: ${sysVal}/${diaVal} mmHg
- Sleep: ${sleepVal} hrs (${sleepQuality})
- Temperature: ${coreTemp}°C · Blood oxygen: ${spo2}%

How you feel:
- Balance and stomach: ${["Steady", "Mild unease", "Nausea", "Strong nausea"][sasRating]}
- Full feeling in the head: ${["None", "Mild", "Full", "Heavy"][cephaladShift]}
- Near vision blur: ${sansVisualBlur ? "Yes" : "No"}
- How tired: ${draft.fatigue}/5 · Mood: ${draft.mood}

Notes from this form:
${clinicalAdvisories.map((a) => `${a.text} ${a.action}`).join("\n")}

Your note: ${draft.notes || "None."}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  if (saved) {
    return (
      <div className="daily-checkin-container max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
        {/* Success Header Card */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-emerald-50 via-white to-slate-50 dark:from-emerald-950/80 dark:via-slate-900 dark:to-slate-950 border border-emerald-300 dark:border-emerald-500/40 shadow-xl relative overflow-hidden">
          <div className="absolute -right-12 -top-12 size-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-3 mb-4">
            <span className="size-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-400/40 grid place-items-center text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 size={24} />
            </span>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-semibold block">
                Saved for this visit
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Daily Check-In Recorded for {person.name.split(" ")[0]}
              </h2>
            </div>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            Saved in this browser until you refresh. This is not sent to a medical team.
          </p>

          {/* Quick Metrics Badge Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-800/80">
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 block mb-0.5">Heart Rate</span>
              <div className="text-lg font-mono font-bold text-slate-900 dark:text-white">
                {hrVal} <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">bpm</span>
              </div>
              <span className="text-[10px] font-mono text-sky-600 dark:text-cyan-400 font-medium">
                {hrDelta >= 0 ? `+${hrDelta}` : hrDelta} vs 14-day average
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 block mb-0.5">Blood Pressure</span>
              <div className="text-lg font-mono font-bold text-slate-900 dark:text-white">
                {sysVal}/{diaVal} <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">mmHg</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                {sysDelta >= 0 ? `+${sysDelta}` : sysDelta}/{diaDelta >= 0 ? `+${diaDelta}` : diaDelta} mmHg vs 14-day average
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 block mb-0.5">Sleep Duration</span>
              <div className="text-lg font-mono font-bold text-slate-900 dark:text-white">
                {sleepVal} <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">hrs</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                {sleepQuality}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 block mb-0.5">How tired</span>
              <div className="text-lg font-mono font-bold text-slate-900 dark:text-white">
                {draft.fatigue}<span className="text-xs text-slate-500 dark:text-slate-400 font-normal"> / 5</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                1 low, 5 high
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              type="button"
              onClick={() => navigate("Astronaut Dashboard")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs font-mono transition shadow-md active:scale-98 cursor-pointer"
            >
              <span>Back to Today</span>
              <ArrowRight size={15} />
            </button>

            <button
              type="button"
              onClick={() => navigate("Physiological Monitoring")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-mono transition active:scale-98 cursor-pointer"
            >
              <Activity size={15} className="text-sky-600 dark:text-cyan-400" />
              <span>Heart and breathing</span>
            </button>

            <button
              type="button"
              onClick={copyFlightBriefing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono transition cursor-pointer ml-auto"
            >
              {copied ? <Check size={14} className="text-emerald-500 dark:text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? "Copied" : "Copy this note"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSaved(false);
                setStep(1);
              }}
              className="text-xs font-mono text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition underline underline-offset-4 cursor-pointer"
            >
              Modify Entry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="daily-checkin-container max-w-5xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Flight Operations Toolbar & Wearable Sync */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-sky-50 dark:bg-cyan-950/80 border border-sky-300 dark:border-cyan-500/40 text-sky-800 dark:text-cyan-300 font-mono text-xs flex items-center gap-1.5 font-semibold">
            <Stethoscope size={13} className="text-sky-600 dark:text-cyan-400" />
            This visit
          </span>
          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 font-mono text-xs">
            AST-EX-VII · FD {mission.day}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 font-mono text-xs">
            CREW ID: {person.id.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fillSampleReading}
            className="secondary-button"
            title="Fill the form with a sample. This does not read a wearable."
          >
            <Zap size={14} className="text-sky-600 dark:text-cyan-400 group-hover:scale-110 transition" />
            <span>Fill a sample reading</span>
          </button>
        </div>
      </div>

      {syncToast && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/50 text-emerald-800 dark:text-emerald-200 text-xs font-mono flex items-center gap-2 animate-fade-in shadow-sm">
          <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
          <span>Filled with a sample for {person.name}. This did not come from a wearable.</span>
        </div>
      )}

      {/* High-Tech Stepper */}
      <div className="grid grid-cols-3 gap-2 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 text-xs font-mono">
        <button
          type="button"
          onClick={() => setStep(1)}
          className={`py-2 px-3 rounded-lg text-center font-medium transition cursor-pointer flex items-center justify-center gap-2 ${
            step === 1
              ? "bg-white dark:bg-cyan-950 border border-sky-400 dark:border-cyan-500/50 text-sky-900 dark:text-cyan-200 shadow-sm font-semibold"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-850"
          }`}
        >
          <span className="size-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 grid place-items-center text-[10px] font-bold">1</span>
          <span className="hidden sm:inline">Today's numbers</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (Number(draft.systolic) <= Number(draft.diastolic)) {
              setError("Systolic pressure must be greater than diastolic pressure.");
              return;
            }
            setError("");
            setStep(2);
          }}
          className={`py-2 px-3 rounded-lg text-center font-medium transition cursor-pointer flex items-center justify-center gap-2 ${
            step === 2
              ? "bg-white dark:bg-cyan-950 border border-sky-400 dark:border-cyan-500/50 text-sky-900 dark:text-cyan-200 shadow-sm font-semibold"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-850"
          }`}
        >
          <span className="size-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 grid place-items-center text-[10px] font-bold">2</span>
          <span className="hidden sm:inline">How you feel</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (Number(draft.systolic) <= Number(draft.diastolic)) {
              setError("Systolic pressure must be greater than diastolic pressure.");
              return;
            }
            setError("");
            setStep(3);
          }}
          className={`py-2 px-3 rounded-lg text-center font-medium transition cursor-pointer flex items-center justify-center gap-2 ${
            step === 3
              ? "bg-white dark:bg-cyan-950 border border-sky-400 dark:border-cyan-500/50 text-sky-900 dark:text-cyan-200 shadow-sm font-semibold"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-850"
          }`}
        >
          <span className="size-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 grid place-items-center text-[10px] font-bold">3</span>
          <span className="hidden sm:inline">Review</span>
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-500/50 text-rose-800 dark:text-rose-200 text-xs font-mono flex items-center gap-2" role="alert">
          <AlertTriangle size={16} className="text-rose-600 dark:text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: Biometric Vitals */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Heart Rate Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="checkin-heart-input" className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2">
                  <Heart size={16} className="text-rose-500" />
                  Heart rate
                </label>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  14-day average: <b className="text-slate-800 dark:text-slate-200">{baseline.heart} bpm</b>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onDraftChange({ ...draft, heart: Math.max(35, (Number(draft.heart) || baseline.heart) - 1) })}
                  className="size-11 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-lg grid place-items-center transition cursor-pointer active:scale-95"
                  aria-label="Decrease heart rate"
                >
                  −
                </button>
                <div className="flex-1 relative">
                  <input
                    id="checkin-heart-input"
                    type="number"
                    inputMode="numeric"
                    min={35}
                    max={220}
                    value={draft.heart}
                    onChange={(e) => onDraftChange({ ...draft, heart: e.target.value === "" ? "" : Number(e.target.value) })}
                    className="w-full text-center py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-2xl font-bold font-mono text-slate-900 dark:text-white outline-none focus:border-sky-500 dark:focus:border-cyan-500 focus:ring-1 focus:ring-sky-500 dark:focus:ring-cyan-500"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 dark:text-slate-500 pointer-events-none">
                    bpm
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onDraftChange({ ...draft, heart: Math.min(220, (Number(draft.heart) || baseline.heart) + 1) })}
                  className="size-11 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-lg grid place-items-center transition cursor-pointer active:scale-95"
                  aria-label="Increase heart rate"
                >
                  +
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono pt-1">
                <span className={Math.abs(hrDelta) <= 8 ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-amber-600 dark:text-amber-400 font-medium"}>
                  {hrDelta === 0 ? "±0 bpm vs 14-day average" : hrDelta > 0 ? `+${hrDelta} bpm vs 14-day average` : `${hrDelta} bpm vs 14-day average`}
                </span>
                <span className="text-slate-500">Flags use a 10 bpm difference</span>
              </div>
            </div>

            {/* Blood Pressure Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2">
                  <Activity size={16} className="text-sky-600 dark:text-cyan-400" />
                  Blood pressure
                </label>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  14-day average: <b className="text-slate-800 dark:text-slate-200">{baseline.systolic}/{baseline.diastolic}</b>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    <span>SYSTOLIC</span>
                    <span className="font-semibold">{sysDelta >= 0 ? `+${sysDelta}` : sysDelta} mmHg</span>
                  </div>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={60}
                    max={240}
                    value={draft.systolic}
                    onChange={(e) => onDraftChange({ ...draft, systolic: e.target.value === "" ? "" : Number(e.target.value) })}
                    className="w-full text-center py-2.5 px-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xl font-bold font-mono text-slate-900 dark:text-white outline-none focus:border-sky-500 dark:focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    <span>DIASTOLIC</span>
                    <span className="font-semibold">{diaDelta >= 0 ? `+${diaDelta}` : diaDelta} mmHg</span>
                  </div>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={40}
                    max={150}
                    value={draft.diastolic}
                    onChange={(e) => onDraftChange({ ...draft, diastolic: e.target.value === "" ? "" : Number(e.target.value) })}
                    className="w-full text-center py-2.5 px-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xl font-bold font-mono text-slate-900 dark:text-white outline-none focus:border-sky-500 dark:focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono pt-1">
                <span className="text-slate-500">Those plus and minus figures are versus the 14-day average.</span>
                <span className="text-slate-500">Flags use a 10 mmHg difference</span>
              </div>
            </div>

            {/* Sleep Duration & Quality Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="checkin-sleep-input" className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2">
                  <Moon size={16} className="text-indigo-500 dark:text-indigo-400" />
                  Sleep Duration
                </label>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  14-day average: <b className="text-slate-800 dark:text-slate-200">{baseline.sleep} hrs</b>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onDraftChange({ ...draft, sleep: Math.max(0, +(Number(draft.sleep) - 0.5).toFixed(1)) })}
                  className="size-11 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-lg grid place-items-center transition cursor-pointer active:scale-95"
                  aria-label="Decrease sleep duration"
                >
                  −
                </button>
                <div className="flex-1 relative">
                  <input
                    id="checkin-sleep-input"
                    type="number"
                    inputMode="decimal"
                    step={0.1}
                    min={0}
                    max={24}
                    value={draft.sleep}
                    onChange={(e) => onDraftChange({ ...draft, sleep: e.target.value === "" ? "" : Number(e.target.value) })}
                    className="w-full text-center py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-2xl font-bold font-mono text-slate-900 dark:text-white outline-none focus:border-sky-500 dark:focus:border-cyan-500"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 dark:text-slate-500 pointer-events-none">
                    hours
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onDraftChange({ ...draft, sleep: Math.min(24, +(Number(draft.sleep) + 0.5).toFixed(1)) })}
                  className="size-11 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-lg grid place-items-center transition cursor-pointer active:scale-95"
                  aria-label="Increase sleep duration"
                >
                  +
                </button>
              </div>

              {/* Sleep Quality Selector */}
              <div className="pt-2">
                <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 block mb-1.5">
                  How you slept
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(["Sound", "Fragmented", "Restless"] as const).map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setSleepQuality(q)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-mono transition cursor-pointer ${
                        sleepQuality === q
                          ? "bg-indigo-50 dark:bg-indigo-950 border border-indigo-400 dark:border-indigo-500/60 text-indigo-800 dark:text-indigo-200 font-semibold shadow-sm"
                          : "bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* In-Flight Core Biomarkers (Temp & SpO2) */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2">
                  <Thermometer size={16} className="text-amber-500" />
                  Temperature and oxygen
                </span>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  Entered on this form
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 mb-1 flex items-center justify-between">
                    <span>Temperature</span>
                    <span className={coreTemp >= 37.4 ? "text-amber-600 dark:text-amber-400 font-semibold" : "text-emerald-600 dark:text-emerald-400 font-semibold"}>
                      {coreTemp >= 37.4 ? "Noted" : "No note"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      inputMode="decimal"
                      step={0.1}
                      min={35.0}
                      max={41.0}
                      value={coreTemp}
                      onChange={(e) => setCoreTemp(Number(e.target.value))}
                      className="w-full text-lg font-mono font-bold text-slate-900 dark:text-white bg-transparent outline-none"
                    />
                    <span className="text-xs font-mono text-slate-400">°C</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 mb-1 flex items-center justify-between">
                    <span>Blood oxygen</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      inputMode="numeric"
                      min={85}
                      max={100}
                      value={spo2}
                      onChange={(e) => setSpo2(Number(e.target.value))}
                      aria-label="Blood oxygen"
                      className="w-full text-lg font-mono font-bold text-slate-900 dark:text-white bg-transparent outline-none"
                    />
                    <span className="text-xs font-mono text-slate-400">%</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 mb-1">
                    <span>Blood sugar</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      inputMode="numeric"
                      min={40}
                      max={400}
                      value={glucose}
                      onChange={(e) => setGlucose(Number(e.target.value))}
                      aria-label="Blood sugar"
                      className="w-full text-lg font-mono font-bold text-slate-900 dark:text-white bg-transparent outline-none"
                    />
                    <span className="text-xs font-mono text-slate-400">mg/dL</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 mb-1">
                    <span>Breathing</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      inputMode="numeric"
                      min={4}
                      max={40}
                      value={respiration}
                      onChange={(e) => setRespiration(Number(e.target.value))}
                      aria-label="Breathing"
                      className="w-full text-lg font-mono font-bold text-slate-900 dark:text-white bg-transparent outline-none"
                    />
                    <span className="text-xs font-mono text-slate-400">breaths/min</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-1 flex items-center justify-between">
                <span>This form notes 37.4°C or higher</span>
                <span>Blood oxygen is entered here</span>
              </div>
            </div>
          </div>

          {/* Step 1 Actions */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-mono text-slate-500">
              Step 1 of 3 · Measurements verified against 14-day mission baseline
            </span>
            <button
              type="button"
              onClick={handleNextStep}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs font-mono transition shadow-md active:scale-98 cursor-pointer"
            >
              <span>Next: How you feel</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Neuro-Ocular & Subjective Symptoms */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Space Adaptation Syndrome (SAS) */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2">
                  <Compass size={16} className="text-sky-600 dark:text-cyan-400" />
                  Balance and stomach
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                How steady you feel today.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { val: 0, label: "0 · Steady", desc: "No dizziness" },
                  { val: 1, label: "1 · Mild", desc: "Uneasy when you turn" },
                  { val: 2, label: "2 · Moderate", desc: "Nausea" },
                  { val: 3, label: "3 · Severe", desc: "Strong nausea" },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setSasRating(item.val)}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      sasRating === item.val
                        ? "bg-sky-50 dark:bg-cyan-950 border-sky-400 dark:border-cyan-500/60 text-sky-900 dark:text-cyan-200 shadow-sm font-medium"
                        : "bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <strong className="text-xs font-mono block">{item.label}</strong>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Cephalad Fluid Shift & SANS Visual Screen */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2">
                  <Eye size={16} className="text-purple-600 dark:text-purple-400" />
                  Head and eyes
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                A full feeling in the head, and whether near vision looks blurry.
              </p>

              {/* Cephalad shift scale */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 block">
                  Head Fullness / Facial Congestion
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {["0: None", "1: Mild", "2: Full", "3: Heavy"].map((label, idx) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setCephaladShift(idx)}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-mono transition cursor-pointer ${
                        cephaladShift === idx
                          ? "bg-purple-50 dark:bg-purple-950 border-purple-400 dark:border-purple-500/60 text-purple-900 dark:text-purple-200 shadow-sm font-semibold"
                          : "bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Near vision check */}
              <div
                role="checkbox"
                aria-checked={sansVisualBlur}
                tabIndex={0}
                onClick={() => setSansVisualBlur(!sansVisualBlur)}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    setSansVisualBlur(!sansVisualBlur);
                  }
                }}
                className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between mt-2 select-none ${
                  sansVisualBlur
                    ? "bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-500/50 text-rose-900 dark:text-rose-200"
                    : "bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px] rounded-md shrink-0 flex items-center justify-center transition-all ${
                      sansVisualBlur
                        ? "bg-rose-600 border border-rose-600 text-white shadow-xs"
                        : "bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-transparent hover:border-slate-400 dark:hover:border-slate-500"
                    }`}
                    aria-hidden="true"
                  >
                    <Check size={13} strokeWidth={3} className={sansVisualBlur ? "opacity-100" : "opacity-0"} />
                  </div>
                  <div>
                    <strong className="text-xs font-semibold block text-slate-900 dark:text-white">Near vision looks blurry</strong>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Check this if reading up close looks blurry today.</span>
                  </div>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                  sansVisualBlur ? "bg-rose-100 dark:bg-rose-950 border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-300" : "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400"
                }`}>
                  {sansVisualBlur ? "Noted" : "No note"}
                </span>
              </div>
            </div>

            {/* Fatigue Rating (Samn-Perelli Flight Scale) */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2">
                  <Zap size={16} className="text-amber-500" />
                  How tired
                </span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">1 low, 5 high</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => onDraftChange({ ...draft, fatigue: n })}
                    className={`py-3 px-1 rounded-xl border text-center transition cursor-pointer ${
                      draft.fatigue === n
                        ? "bg-amber-50 dark:bg-amber-950/80 border-amber-400 dark:border-amber-500/60 text-amber-900 dark:text-amber-200 shadow-sm font-semibold"
                        : "bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="text-base font-mono font-bold">{n}</div>
                    <div className="text-[9px] font-mono mt-1 text-slate-500 dark:text-slate-400 line-clamp-1">
                      {["Very Low", "Low", "Moderate", "High", "Very High"][n - 1]}
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 text-right">
                Current: <b className="text-amber-700 dark:text-amber-300">{draft.fatigue} / 5</b> ({["Very low", "Low", "Moderate", "High", "Very high"][draft.fatigue - 1]})
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 font-semibold">
                  Mood
                </span>
                <p className="mood-note">How today feels. This note is not part of the Usual, Different, or Flagged label.</p>
              </div>
              <div className="mood-choices" role="group" aria-label="Mood">
                {(
                  [
                    { name: "Great", Icon: Laugh },
                    { name: "Good", Icon: Smile },
                    { name: "Fair", Icon: Meh },
                    { name: "Low", Icon: Frown },
                  ] as const
                ).map(({ name, Icon }) => (
                  <button
                    key={name}
                    type="button"
                    data-mood={name.toLowerCase()}
                    aria-pressed={draft.mood === name}
                    onClick={() => onDraftChange({ ...draft, mood: name })}
                  >
                    <Icon size={22} aria-hidden="true" />
                    <span>{name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Operational Notes */}
          <div className="checkin-notes-card p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <label htmlFor="checkin-notes" className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2">
              <FileText size={16} className="text-slate-400" />
              Note (optional)
            </label>
            <textarea
              id="checkin-notes"
              maxLength={1000}
              placeholder="Anything you want to remember about today."
              value={draft.notes}
              onChange={(e) => onDraftChange({ ...draft, notes: e.target.value })}
              rows={3}
              className="checkin-notes-textarea w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-sky-500 dark:focus:border-cyan-500 focus:ring-1 focus:ring-sky-500 dark:focus:ring-cyan-500 leading-relaxed transition"
            />
          </div>

          {/* Step 2 Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono transition cursor-pointer"
            >
              Back to today's numbers
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs font-mono transition shadow-md active:scale-98 cursor-pointer"
            >
              <span>Next: Review</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Review & Transmit */}
      {step === 3 && (
        <div className="space-y-6">
          {/* Clinical Telemetry Summary Grid */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-sky-700 dark:text-cyan-400 tracking-wider font-semibold">
                  Review
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  Check today's numbers
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                {person.name} · Crew ID: {person.id.toUpperCase()}
              </span>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase text-slate-500 dark:text-slate-400">
                    <th className="pb-2">Measure</th>
                    <th className="pb-2">Today</th>
                    <th className="pb-2">14-day average</th>
                    <th className="pb-2">Difference</th>
                    <th className="pb-2">This form</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                  <tr>
                    <td className="py-2.5 text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Heart size={14} className="text-rose-500" />
                      Heart rate
                    </td>
                    <td className="py-2.5 font-bold text-slate-900 dark:text-white">{hrVal} bpm</td>
                    <td className="py-2.5 text-slate-500 dark:text-slate-400">{baseline.heart} bpm</td>
                    <td className="py-2.5 text-sky-600 dark:text-cyan-400 font-medium">{hrDelta >= 0 ? `+${hrDelta}` : hrDelta} bpm</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] border font-semibold ${
                        Math.abs(hrDelta) <= 8 ? "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-600/40 text-emerald-700 dark:text-emerald-300" : "bg-amber-50 dark:bg-amber-950/80 border-amber-300 dark:border-amber-600/40 text-amber-700 dark:text-amber-300"
                      }`}>
                        {Math.abs(hrDelta) <= 8 ? "No note" : "Noted"}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2.5 text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Activity size={14} className="text-sky-600 dark:text-cyan-400" />
                      Blood pressure
                    </td>
                    <td className="py-2.5 font-bold text-slate-900 dark:text-white">{sysVal}/{diaVal} mmHg</td>
                    <td className="py-2.5 text-slate-500 dark:text-slate-400">{baseline.systolic}/{baseline.diastolic} mmHg</td>
                    <td className="py-2.5 text-sky-600 dark:text-cyan-400 font-medium">{sysDelta >= 0 ? `+${sysDelta}` : sysDelta} / {diaDelta >= 0 ? `+${diaDelta}` : diaDelta}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] border font-semibold ${
                        sysVal >= 135 || diaVal >= 88
                          ? "bg-amber-50 dark:bg-amber-950/80 border-amber-300 dark:border-amber-600/40 text-amber-700 dark:text-amber-300"
                          : "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-600/40 text-emerald-700 dark:text-emerald-300"
                      }`}>
                        {sysVal >= 135 || diaVal >= 88 ? "Noted" : "No note"}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2.5 text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Moon size={14} className="text-indigo-500 dark:text-indigo-400" />
                      Sleep
                    </td>
                    <td className="py-2.5 font-bold text-slate-900 dark:text-white">{sleepVal} hrs ({sleepQuality})</td>
                    <td className="py-2.5 text-slate-500 dark:text-slate-400">{baseline.sleep} hrs</td>
                    <td className="py-2.5 text-indigo-600 dark:text-indigo-300 font-medium">{sleepDelta >= 0 ? `+${sleepDelta}` : sleepDelta} hrs</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] border font-semibold ${
                        sleepVal >= 6.5 ? "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-600/40 text-emerald-700 dark:text-emerald-300" : "bg-amber-50 dark:bg-amber-950/80 border-amber-300 dark:border-amber-600/40 text-amber-700 dark:text-amber-300"
                      }`}>
                        {sleepVal >= 6.5 ? "No note" : "Noted"}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2.5 text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Thermometer size={14} className="text-amber-500" />
                      Temperature and oxygen
                    </td>
                    <td className="py-2.5 font-bold text-slate-900 dark:text-white">{coreTemp}°C · {spo2}%</td>
                    <td className="py-2.5 text-slate-500 dark:text-slate-400">Not in the 14-day average</td>
                    <td className="py-2.5 text-slate-500 dark:text-slate-400">Form note</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] border font-semibold ${
                        coreTemp >= 37.4
                          ? "bg-amber-50 dark:bg-amber-950/80 border-amber-300 dark:border-amber-600/40 text-amber-700 dark:text-amber-300"
                          : "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-600/40 text-emerald-700 dark:text-emerald-300"
                      }`}>
                        {coreTemp >= 37.4 ? "Noted" : "No note"}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2.5 text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Eye size={14} className="text-purple-600 dark:text-purple-400" />
                      Vision and fullness
                    </td>
                    <td className="py-2.5 font-bold text-slate-900 dark:text-white">{sansVisualBlur ? "Blur noted" : "No blur noted"}</td>
                    <td className="py-2.5 text-slate-500 dark:text-slate-400">Not in the 14-day average</td>
                    <td className="py-2.5 text-slate-500 dark:text-slate-400">Fullness {cephaladShift}/3</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] border font-semibold ${
                        sansVisualBlur || cephaladShift >= 2 ? "bg-amber-50 dark:bg-amber-950/80 border-amber-300 dark:border-amber-600/40 text-amber-700 dark:text-amber-300" : "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-600/40 text-emerald-700 dark:text-emerald-300"
                      }`}>
                        {sansVisualBlur || cephaladShift >= 2 ? "Noted" : "No note"}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Dynamic Clinical Advisories */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">
                Notes from this form
              </span>
              {clinicalAdvisories.map((adv, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                    adv.type === "alert"
                      ? "bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-600/40 text-rose-900 dark:text-rose-200"
                      : adv.type === "warning"
                      ? "bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-600/40 text-amber-900 dark:text-amber-200"
                      : "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-600/40 text-emerald-900 dark:text-emerald-200"
                  }`}
                >
                  <strong className="block mb-0.5 font-semibold font-mono text-[11px]">
                    {adv.text}
                  </strong>
                  <span className="text-[11px] text-slate-600 dark:text-slate-300 block font-mono">
                    {adv.action}
                  </span>
                </div>
              ))}
            </div>

            {/* Transmit Button Bar */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono transition cursor-pointer"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleSaveCheckIn}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono transition shadow-md active:scale-98 cursor-pointer"
              >
                <CheckCircle2 size={16} />
                <span>Save this check-in</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
