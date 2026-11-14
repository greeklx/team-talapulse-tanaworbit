import { useState } from "react";
import {
  Activity,
  Heart,
  Brain,
  Eye,
  Cross,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Shield,
  Sparkles,
} from "lucide-react";

export type BodyZone =
  | "head"
  | "neck"
  | "chest"
  | "abdomen"
  | "spine"
  | "upperLimbs"
  | "lowerLimbs";

export type SymptomLog = {
  zone: BodyZone;
  symptom: string;
  severity: "Mild" | "Moderate" | "Severe";
  countermeasure: string;
  timestamp: string;
};

const ZONE_DATA: Record<
  BodyZone,
  {
    title: string;
    laymanLabel: string;
    spacePhenomenon: string;
    symptoms: string[];
    countermeasure: string;
    normalBaseline: string;
    status: "Nominal" | "Attention" | "Monitor";
  }
> = {
  head: {
    title: "Cranial & Ocular System",
    laymanLabel: "Head, Eyes & Brain",
    spacePhenomenon:
      "Fluid Shift & SANS: Without gravity, ~2 liters of bodily fluids float up into your upper body and head, causing facial puffiness, sinus fullness, and mild optic nerve flattening (Spaceflight Associated Neuro-ocular Syndrome).",
    symptoms: [
      "Head fullness & sinus congestion",
      "Blurred vision / near-sight focus difficulty (SANS)",
      "Mild headache from elevated cabin CO₂",
      "Puffiness around eyelids",
    ],
    countermeasure:
      "Perform a 15-minute Lower Body Negative Pressure (LBNP) session to draw fluids down; verify cabin air scrubber is keeping CO₂ < 5.3 mmHg; stay in the path of the cabin ventilation stream.",
    normalBaseline: "Clear optical vision, normal intracranial pressure, normal alertness.",
    status: "Nominal",
  },
  neck: {
    title: "Cervical & Vestibular System",
    laymanLabel: "Neck & Inner Ear (Balance)",
    spacePhenomenon:
      "Otolith Disorientation: Gravity sensors in your inner ear no longer detect 'down'. Rapid head turns cause illusions like feeling inverted or spinning while floating.",
    symptoms: [
      "Feeling upside-down while floating (inversion illusion)",
      "Motion-triggered dizziness when turning head quickly",
      "Neck paraspinal muscle tension from awkward tethering",
    ],
    countermeasure:
      "Keep head movements slow and aligned with your body axis during the first 3 days; look at clear visual references (cabin deck/ceiling labels); perform gentle neck isometric stretches.",
    normalBaseline: "Normal balance adaptation, stable gaze tracking during movement.",
    status: "Nominal",
  },
  chest: {
    title: "Thoracic & Cardiovascular",
    laymanLabel: "Heart, Lungs & Breath",
    spacePhenomenon:
      "Cardiovascular Deconditioning: Your heart doesn't have to pump against gravity, so it works less, stroke volume shifts, and resting pulse fluctuates during intense exercise.",
    symptoms: [
      "Elevated resting heart rate (>90 bpm)",
      "Chest tightness during cycle ergometer workout",
      "Slight shortness of breath (post-exercise dyspnea)",
      "Sensations of heart fluttering (palpitations)",
    ],
    countermeasure:
      "Rest at your tethered station; put on pulse oximeter and check SpO₂ (target >96%); breathe slowly and monitor PUMA lung gas exchange; alert Medical Officer if chest discomfort persists.",
    normalBaseline: "Resting pulse 60-80 bpm, blood pressure 110-120/70-80 mmHg, SpO₂ 97-99%.",
    status: "Nominal",
  },
  abdomen: {
    title: "Gastrointestinal & Digestive",
    laymanLabel: "Stomach & Digestion",
    spacePhenomenon:
      "Space Motion Sickness (SMS): Disorientation between your inner ear and eyes causes stomach awareness, reduced appetite, and slow gastric emptying in 70% of astronauts in the first 72 hours.",
    symptoms: [
      "Stomach awareness / mild queasiness",
      "Loss of appetite despite low calories",
      "Bloating & slower digestion in zero gravity",
      "Sudden nausea triggered by floating head-over-heels",
    ],
    countermeasure:
      "Sip electrolyte water slowly; choose bland, easy-to-digest NASA meal pouches (e.g. oatmeal, rice); take prescribed motion sickness countermeasure (oral Promethazine) if nausea prevents drinking.",
    normalBaseline: "Normal appetite, smooth digestion, meeting 2,400 kcal/day nutritional target.",
    status: "Nominal",
  },
  spine: {
    title: "Vertebral Column & Posture",
    laymanLabel: "Spine & Lower Back",
    spacePhenomenon:
      "Spinal Elongation: Intervertebral discs absorb fluid and expand without gravitational load. Astronauts grow 2 to 3 inches taller in space, which stretches back ligaments and causes a dull lower back ache.",
    symptoms: [
      "Dull lower back ache (morning or after waking)",
      "Height increase feeling (4-6 cm elongation)",
      "Core muscle fatigue from floating in Neutral Body Posture",
    ],
    countermeasure:
      "Perform the NASA 'fetal tuck' stretch: pull knees tightly to chest while tethered for 5-10 minutes twice daily; ensure ARED resistive workout harness has snug lumbar support.",
    normalBaseline: "Spine lengthened comfortably within expected 3-5 cm range, zero sharp pain.",
    status: "Nominal",
  },
  upperLimbs: {
    title: "Upper Extremities & Motor Control",
    laymanLabel: "Arms, Wrists & Hands",
    spacePhenomenon:
      "Handgrip Fatigue & Tether Strain: Because you don't walk, you navigate the space station entirely by pulling and gripping handrails, leading to forearm flexor strain and tired finger joints.",
    symptoms: [
      "Forearm muscle burn from gripping station handrails",
      "Wrist stiffness after tool assembly or EVA glove work",
      "Slight tremor during fine motor screen tapping",
    ],
    countermeasure:
      "Gently stretch forearms and flex/extend wrists; apply a warm thermal pad from the crew care pack; run the built-in 15-second Motor Skills test to benchmark finger dexterity.",
    normalBaseline: "Full handgrip strength, flexible wrists, rapid finger motor accuracy.",
    status: "Nominal",
  },
  lowerLimbs: {
    title: "Lower Extremities & Bones",
    laymanLabel: "Hips, Legs & Calves",
    spacePhenomenon:
      "Muscle & Bone Unloading ('Bird Legs'): Because your legs do zero work to support body weight in microgravity, leg fluids travel upward and calf muscles atrophy rapidly if not exercised.",
    symptoms: [
      "'Bird legs' fluid redistribution (thinning calves)",
      "Heavy or restless leg sensation after floating all day",
      "Shin or knee tenderness from treadmill bungee load harness",
    ],
    countermeasure:
      "Complete the mandatory daily 2-hour workout: 1 hour heavy ARED resistive squats + deadlifts, followed by 30-45 minutes on the T2 treadmill with bungee harness loaded to 1G bodyweight equivalent.",
    normalBaseline: "Calf circumference stable, strong pedal pulses, zero swelling or edema.",
    status: "Nominal",
  },
};

export default function AnatomicalAvatar({
  onLogSymptom,
  recentLogs,
}: {
  onLogSymptom?: (log: SymptomLog) => void;
  recentLogs?: SymptomLog[];
}) {
  const [activeZone, setActiveZone] = useState<BodyZone>("head");
  const [selectedSymptom, setSelectedSymptom] = useState<string>("");
  const [severity, setSeverity] = useState<"Mild" | "Moderate" | "Severe">("Mild");
  const [loggedNotice, setLoggedNotice] = useState<string | null>(null);

  const zoneInfo = ZONE_DATA[activeZone];

  function handleLog() {
    if (!selectedSymptom) return;
    const log: SymptomLog = {
      zone: activeZone,
      symptom: selectedSymptom,
      severity,
      countermeasure: zoneInfo.countermeasure,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    onLogSymptom?.(log);
    setLoggedNotice(`Logged: ${selectedSymptom} (${severity})`);
    setTimeout(() => setLoggedNotice(null), 3500);
    setSelectedSymptom("");
  }

  return (
    <div className="p-5 md:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px] font-mono tracking-wider text-cyan-400 uppercase font-semibold">
              Interactive Body Telemetry & In-Flight Symptoms
            </span>
          </div>
          <h3 className="text-lg md:text-xl font-semibold text-white tracking-tight mt-0.5">
            Body Area Health Map
          </h3>
          <p className="text-xs text-slate-400">
            Click any body region to learn how zero gravity affects it, see normal baselines, and log symptoms.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            Normal
          </span>
          <span className="px-2.5 py-1 rounded-full bg-amber-950/70 border border-amber-500/30 text-amber-300 flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-amber-400" />
            Attention
          </span>
          <span className="px-2.5 py-1 rounded-full bg-rose-950/70 border border-rose-500/30 text-rose-300 flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-rose-400" />
            Action Required
          </span>
        </div>
      </div>

      {/* Main Grid: Anatomical Wireframe (Left) + Layman Action Protocol (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Precision Medical Wireframe Humanoid Figure */}
        <div className="lg:col-span-5 relative flex flex-col items-center justify-center p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 overflow-hidden">
          {/* Subtle medical HUD grid lines */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

          {/* SVG Contoured Medical Silhouette */}
          <svg
            viewBox="0 0 240 440"
            className="w-full max-w-[220px] h-auto drop-shadow-[0_0_20px_rgba(34,211,238,0.15)] relative z-10"
            aria-label="Contoured medical body wireframe with selectable regions"
          >
            <defs>
              <linearGradient id="avatarWireframe" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#0369a1" stopOpacity="0.5" />
              </linearGradient>
              <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Anatomical Contour Paths */}
            <g
              stroke="#38bdf8"
              strokeWidth="1.5"
              fill="url(#avatarWireframe)"
              className="transition duration-300"
            >
              {/* Head & Cranium */}
              <path
                d="M120 22 C106 22 96 34 96 48 C96 62 105 74 120 74 C135 74 144 62 144 48 C144 34 134 22 120 22 Z"
                className={`cursor-pointer transition ${
                  activeZone === "head" ? "fill-cyan-500/40 stroke-cyan-300 stroke-2" : "hover:fill-cyan-500/20"
                }`}
                onClick={() => setActiveZone("head")}
              />

              {/* Neck */}
              <path
                d="M112 74 L128 74 L132 90 L108 90 Z"
                className={`cursor-pointer transition ${
                  activeZone === "neck" ? "fill-cyan-500/40 stroke-cyan-300 stroke-2" : "hover:fill-cyan-500/20"
                }`}
                onClick={() => setActiveZone("neck")}
              />

              {/* Shoulders, Chest & Ribcage */}
              <path
                d="M108 90 L80 102 L60 115 L66 142 L84 132 L92 158 L148 158 L156 132 L174 142 L180 115 L160 102 L132 90 Z"
                className={`cursor-pointer transition ${
                  activeZone === "chest" ? "fill-cyan-500/40 stroke-cyan-300 stroke-2" : "hover:fill-cyan-500/20"
                }`}
                onClick={() => setActiveZone("chest")}
              />

              {/* Upper Limbs / Arms */}
              {/* Left Arm */}
              <path
                d="M60 115 L40 160 L32 205 L44 208 L52 168 L66 142 Z"
                className={`cursor-pointer transition ${
                  activeZone === "upperLimbs" ? "fill-cyan-500/40 stroke-cyan-300 stroke-2" : "hover:fill-cyan-500/20"
                }`}
                onClick={() => setActiveZone("upperLimbs")}
              />
              {/* Right Arm */}
              <path
                d="M180 115 L200 160 L208 205 L196 208 L188 168 L174 142 Z"
                className={`cursor-pointer transition ${
                  activeZone === "upperLimbs" ? "fill-cyan-500/40 stroke-cyan-300 stroke-2" : "hover:fill-cyan-500/20"
                }`}
                onClick={() => setActiveZone("upperLimbs")}
              />

              {/* Abdomen & Core */}
              <path
                d="M92 158 L88 205 L152 205 L148 158 Z"
                className={`cursor-pointer transition ${
                  activeZone === "abdomen" ? "fill-cyan-500/40 stroke-cyan-300 stroke-2" : "hover:fill-cyan-500/20"
                }`}
                onClick={() => setActiveZone("abdomen")}
              />

              {/* Pelvis & Hips */}
              <path
                d="M88 205 L78 238 L162 238 L152 205 Z"
                className={`cursor-pointer transition ${
                  activeZone === "spine" ? "fill-cyan-500/40 stroke-cyan-300 stroke-2" : "hover:fill-cyan-500/20"
                }`}
                onClick={() => setActiveZone("spine")}
              />

              {/* Lower Limbs / Thighs & Calves */}
              {/* Left Leg */}
              <path
                d="M78 238 L68 318 L64 395 L78 398 L88 322 L112 240 Z"
                className={`cursor-pointer transition ${
                  activeZone === "lowerLimbs" ? "fill-cyan-500/40 stroke-cyan-300 stroke-2" : "hover:fill-cyan-500/20"
                }`}
                onClick={() => setActiveZone("lowerLimbs")}
              />
              {/* Right Leg */}
              <path
                d="M162 238 L172 318 L176 395 L162 398 L152 322 L128 240 Z"
                className={`cursor-pointer transition ${
                  activeZone === "lowerLimbs" ? "fill-cyan-500/40 stroke-cyan-300 stroke-2" : "hover:fill-cyan-500/20"
                }`}
                onClick={() => setActiveZone("lowerLimbs")}
              />
            </g>

            {/* Spine Centerline Reference */}
            <line
              x1="120"
              y1="82"
              x2="120"
              y2="230"
              stroke="#38bdf8"
              strokeDasharray="3 3"
              strokeWidth="1.5"
              opacity="0.6"
            />

            {/* Glowing Telemetry Hotspot Nodes */}
            {[
              { zone: "head" as BodyZone, cx: 120, cy: 48, label: "Head / SANS" },
              { zone: "neck" as BodyZone, cx: 120, cy: 82, label: "Inner Ear" },
              { zone: "chest" as BodyZone, cx: 120, cy: 122, label: "Heart / Lungs" },
              { zone: "spine" as BodyZone, cx: 120, cy: 168, label: "Spine Stretch" },
              { zone: "abdomen" as BodyZone, cx: 120, cy: 196, label: "Digestion" },
              { zone: "upperLimbs" as BodyZone, cx: 48, cy: 168, label: "Hands" },
              { zone: "lowerLimbs" as BodyZone, cx: 80, cy: 300, label: "Legs" },
            ].map((node) => {
              const isSelected = activeZone === node.zone;
              return (
                <g
                  key={node.zone}
                  className="cursor-pointer"
                  onClick={() => setActiveZone(node.zone)}
                >
                  {isSelected && (
                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r="16"
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="1.5"
                      className="animate-ping"
                      opacity="0.6"
                    />
                  )}
                  <circle
                    cx={node.cx}
                    cy={node.cy}
                    r={isSelected ? 7 : 5}
                    fill={isSelected ? "#22d3ee" : "#0284c7"}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    filter="url(#nodeGlow)"
                    className="transition duration-200"
                  />
                </g>
              );
            })}
          </svg>

          {/* Quick Body Selector Pills */}
          <div className="flex flex-wrap gap-1.5 justify-center mt-3 z-10">
            {(
              [
                ["head", "Head & Eyes"],
                ["neck", "Neck & Ear"],
                ["chest", "Heart & Lungs"],
                ["abdomen", "Stomach"],
                ["spine", "Spine"],
                ["upperLimbs", "Arms"],
                ["lowerLimbs", "Legs"],
              ] as [BodyZone, string][]
            ).map(([zone, title]) => (
              <button
                key={zone}
                type="button"
                onClick={() => setActiveZone(zone)}
                className={`text-[10px] font-mono px-2 py-1 rounded-md border transition cursor-pointer ${
                  activeZone === zone
                    ? "bg-cyan-950 border-cyan-400 text-cyan-200 font-semibold shadow-[0_0_10px_rgba(34,211,238,0.3)]"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                {title}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Layman Space Medicine Protocol & Countermeasure */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Card: What Zero Gravity Does Here */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block">
                  SELECTED REGION
                </span>
                <h4 className="text-base font-semibold text-white">
                  {zoneInfo.laymanLabel} <span className="text-slate-400 font-normal text-xs">({zoneInfo.title})</span>
                </h4>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                Baseline: {zoneInfo.status}
              </span>
            </div>

            <div className="mt-3 p-3 rounded-lg bg-slate-900/80 border border-slate-800/80 text-xs leading-relaxed text-slate-300">
              <strong className="text-cyan-300 block mb-1">How Microgravity Affects This:</strong>
              {zoneInfo.spacePhenomenon}
            </div>

            <div className="mt-2.5 text-xs text-slate-400">
              <span className="text-slate-500 font-mono text-[10px] uppercase block">Typical Normal Baseline:</span>
              {zoneInfo.normalBaseline}
            </div>
          </div>

          {/* Card: Actionable Countermeasures */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={15} className="text-emerald-400" />
              <strong className="text-xs font-semibold text-emerald-300 uppercase tracking-wider font-mono">
                In-Flight Action Protocol
              </strong>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed bg-emerald-950/30 border border-emerald-500/20 p-3 rounded-lg">
              {zoneInfo.countermeasure}
            </p>
          </div>

          {/* Quick Symptom Logger */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="symptom-select" className="text-xs font-semibold text-slate-200 block">
                Log Observed Spaceflight Symptom
              </label>
              {loggedNotice && (
                <span className="text-[11px] font-mono text-emerald-400 animate-fade-in">
                  ✓ {loggedNotice}
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <select
                id="symptom-select"
                value={selectedSymptom}
                onChange={(e) => setSelectedSymptom(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-cyan-400 cursor-pointer"
              >
                <option value="">-- Choose symptom observed --</option>
                {zoneInfo.symptoms.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <div className="flex gap-1.5">
                {(["Mild", "Moderate", "Severe"] as const).map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverity(sev)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition cursor-pointer ${
                      severity === sev
                        ? sev === "Severe"
                          ? "bg-rose-950 border-rose-500 text-rose-300"
                          : sev === "Moderate"
                            ? "bg-amber-950 border-amber-500 text-amber-300"
                            : "bg-cyan-950 border-cyan-400 text-cyan-300"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {sev}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={handleLog}
                  disabled={!selectedSymptom}
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-medium text-xs transition cursor-pointer"
                >
                  Record
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
