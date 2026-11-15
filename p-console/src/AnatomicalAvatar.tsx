import { useState, useRef, useEffect } from "react";
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
  ChevronDown,
  Check,
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
    telemetryBadge: string;
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
    telemetryBadge: "Demonstration reference: SANS nominal · CO₂: 3.2 mmHg",
    spacePhenomenon:
      "Fluid Shift & SANS: Without gravity, ~2 liters of bodily fluids float up into your upper body and head, causing facial puffiness, sinus fullness, and mild optic nerve flattening (Spaceflight Associated Neuro-ocular Syndrome).",
    symptoms: [
      "Head fullness & sinus congestion",
      "Blurred vision / near-sight focus difficulty (SANS)",
      "Mild headache from elevated cabin CO₂",
      "Puffiness around eyelids",
    ],
    countermeasure:
      "A full feeling in the head is a reason to look at today's check-in and the Cabin air page. This picture does not start a pressure session.",
    normalBaseline: "Clear optical vision, normal intracranial pressure, normal alertness.",
    status: "Nominal",
  },
  neck: {
    title: "Cervical & Vestibular System",
    laymanLabel: "Neck & Inner Ear (Balance)",
    telemetryBadge: "Demonstration reference: Otolith adaptation nominal",
    spacePhenomenon:
      "Otolith Disorientation: Gravity sensors in your inner ear no longer detect 'down'. Rapid head turns cause illusions like feeling inverted or spinning while floating.",
    symptoms: [
      "Feeling upside-down while floating (inversion illusion)",
      "Motion-triggered dizziness when turning head quickly",
      "Neck paraspinal muscle tension from awkward tethering",
    ],
    countermeasure:
      "Quick head turns can feel like spinning while floating. This picture does not assign a stretch.",
    normalBaseline: "Normal balance adaptation, stable gaze tracking during movement.",
    status: "Nominal",
  },
  chest: {
    title: "Thoracic & Cardiovascular",
    laymanLabel: "Heart, Lungs & Breath",
    telemetryBadge: "Demonstration reference: Resting HR: 71 bpm · SpO₂: 97%",
    spacePhenomenon:
      "Cardiovascular Deconditioning: Your heart doesn't have to pump against gravity, so it works less, stroke volume shifts, and resting pulse fluctuates during intense exercise.",
    symptoms: [
      "Elevated resting heart rate (>90 bpm)",
      "Chest tightness during cycle ergometer workout",
      "Slight shortness of breath (post-exercise dyspnea)",
      "Sensations of heart fluttering (palpitations)",
    ],
    countermeasure:
      "Heart rate, blood oxygen, and breathing on this page come from the stored day or from a saved check-in. The breathing-gas card is an example of one breath. A sudden or severe feeling belongs to the crew's own emergency steps.",
    normalBaseline: "Resting pulse 60-80 bpm, blood pressure 110-120/70-80 mmHg, SpO₂ 97-99%.",
    status: "Nominal",
  },
  abdomen: {
    title: "Gastrointestinal & Digestive",
    laymanLabel: "Stomach & Digestion",
    telemetryBadge: "Demonstration reference: Motility active · SMS index 0",
    spacePhenomenon:
      "Space Motion Sickness (SMS): Disorientation between your inner ear and eyes causes stomach awareness, reduced appetite, and slow gastric emptying, common during initial microgravity adaptation.",
    symptoms: [
      "Stomach awareness / mild queasiness",
      "Loss of appetite despite low calories",
      "Bloating & slower digestion in zero gravity",
      "Sudden nausea triggered by floating head-over-heels",
    ],
    countermeasure:
      "Queasiness is common in the first days of floating. Meals for this day are on Nutrition. This picture does not suggest a medicine.",
    normalBaseline: "Normal appetite, smooth digestion, meeting 2,400 kcal/day nutritional target.",
    status: "Nominal",
  },
  spine: {
    title: "Vertebral Column & Posture",
    laymanLabel: "Spine & Lower Back",
    telemetryBadge: "Demonstration reference: Elongation +4.2 cm (expected 3–5 cm)",
    spacePhenomenon:
      "Spinal Elongation: Intervertebral discs absorb fluid and expand without gravitational load. Astronauts may lengthen +3 to 5 cm (+4.2 cm typical), stretching spinal ligaments and causing a dull lower back ache.",
    symptoms: [
      "Dull lower back ache (morning or after waking)",
      "Height increase sensation (+4.2 cm typical elongation)",
      "Core muscle fatigue from floating in Neutral Body Posture",
    ],
    countermeasure:
      "The back can ache when the spine lengthens a few centimeters. Exercise and sleep notes are on their own pages. This picture does not assign a stretch.",
    normalBaseline: "Spine lengthened comfortably within expected 3-5 cm range, zero sharp pain.",
    status: "Nominal",
  },
  upperLimbs: {
    title: "Upper Extremities & Motor Control",
    laymanLabel: "Arms, Wrists & Hands",
    telemetryBadge: "Demonstration reference: Handgrip: 48 kg · Motor praxis: 98%",
    spacePhenomenon:
      "Handgrip Fatigue & Tether Strain: Because you don't walk, you navigate the space station entirely by pulling and gripping handrails, leading to forearm flexor strain and tired finger joints.",
    symptoms: [
      "Forearm muscle burn from gripping station handrails",
      "Wrist stiffness after tool assembly or EVA glove work",
      "Slight tremor during fine motor screen tapping",
    ],
    countermeasure:
      "Hands do more of the moving, by gripping rails. Practice on this console has a short tapping test. This picture does not measure grip.",
    normalBaseline: "Full handgrip strength, flexible wrists, rapid finger motor accuracy.",
    status: "Nominal",
  },
  lowerLimbs: {
    title: "Lower Extremities & Bones",
    laymanLabel: "Hips, Legs & Calves",
    telemetryBadge: "Demonstration reference: Calf change -1.2 cm",
    spacePhenomenon:
      "Muscle & Bone Unloading ('Bird Legs'): Because your legs do zero work to support body weight in microgravity, leg fluids travel upward and calf muscles atrophy rapidly if not exercised.",
    symptoms: [
      "'Bird legs' fluid redistribution (thinning calves)",
      "Heavy or restless leg sensation after floating all day",
      "Shin or knee tenderness from treadmill bungee load harness",
    ],
    countermeasure:
      "Legs do less work when they are not standing. Exercise minutes are logged on the Exercise page. This picture does not assign a workout.",
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

  // Reset selected symptom when user clicks a different body zone
  useEffect(() => {
    setSelectedSymptom("");
  }, [activeZone]);

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
    <div className="quiet-card panel">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[var(--border)] pb-4 mb-5">
        <div>
          <h3 className="text-lg font-semibold">Body notes</h3>
          <p className="text-sm text-[var(--muted)]">
            Pick a region to read stored physiological adaptation notes. For educational exploration only — not medical guidance.
          </p>
        </div>

        <div className="text-xs font-mono text-[var(--muted)] bg-sky-50 dark:bg-slate-900 px-2.5 py-1 rounded border border-sky-200 dark:border-slate-800">
          Stored notes · Not medical advice
        </div>
      </div>

      {/* Main Grid: Anatomical Wireframe (Left) + Layman Action Protocol (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Precision Medical Contoured Humanoid Silhouette */}
        <div className="lg:col-span-5 relative flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 overflow-hidden shadow-xs">
          {/* Subtle medical HUD grid background */}
          <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

          {/* Top Aerospace Telemetry Pill */}
          <div className="relative z-10 w-full mb-2 flex items-center justify-between gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-slate-900/90 border border-sky-200 dark:border-slate-800 text-[9.5px] font-mono">
            <span className="flex items-center gap-1 font-bold text-sky-800 dark:text-cyan-300 uppercase tracking-wider shrink-0 text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {zoneInfo.laymanLabel}
            </span>
            <span className="text-slate-600 dark:text-slate-400 text-right truncate text-[9px]" title={zoneInfo.telemetryBadge}>
              {zoneInfo.telemetryBadge}
            </span>
          </div>

          {/* SVG Contoured Medical Silhouette */}
          <svg
            viewBox="0 0 240 440"
            className="w-full max-w-[230px] h-auto drop-shadow-[0_0_18px_rgba(56,189,248,0.2)] relative z-10 select-none"
            aria-label="Contoured medical body silhouette with selectable anatomical regions"
          >
            <defs>
              {/* Default Ambient Body Gradient */}
              <linearGradient id="bodyAmbientGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.32" />
                <stop offset="45%" stopColor="#0ea5e9" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#0369a1" stopOpacity="0.42" />
              </linearGradient>

              {/* Active Zone Illuminated Gradient */}
              <linearGradient id="activeZoneGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.65" />
                <stop offset="50%" stopColor="#0284c7" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#0369a1" stopOpacity="0.7" />
              </linearGradient>

              {/* Node Glow Blur Filter */}
              <filter id="reticleGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Microgravity Cephalad Fluid Shift Vectors (Faint Upward Indicators) */}
            <g opacity="0.35" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 3">
              <path d="M 120 250 L 120 75" />
              <path d="M 102 210 C 98 160 98 120 108 80" />
              <path d="M 138 210 C 142 160 142 120 132 80" />
            </g>

            {/* Anatomical Contoured Silhouette Groups */}
            <g className="transition-all duration-300">
              {/* Head & Cranium */}
              <path
                d="M 120 18 C 102 18 92 32 92 48 C 92 62 102 72 112 74 L 128 74 C 138 72 148 62 148 48 C 148 32 138 18 120 18 Z"
                fill={activeZone === "head" ? "url(#activeZoneGradient)" : "url(#bodyAmbientGradient)"}
                stroke={activeZone === "head" ? "#0284c7" : "#38bdf8"}
                strokeWidth={activeZone === "head" ? "2.2" : "1.2"}
                className="cursor-pointer transition-all duration-200 hover:opacity-90"
                onClick={() => setActiveZone("head")}
              />
              {/* Ocular / SANS Sightline Reticle inside Cranium */}
              <g opacity={activeZone === "head" ? "0.9" : "0.45"} pointerEvents="none">
                <circle cx="113" cy="44" r="2.5" fill="#38bdf8" />
                <circle cx="127" cy="44" r="2.5" fill="#38bdf8" />
                <path d="M 108 44 L 132 44" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="1 2" />
              </g>

              {/* Neck & Cervical Area */}
              <path
                d="M 112 74 L 128 74 C 131 82 134 90 142 96 L 98 96 C 106 90 109 82 112 74 Z"
                fill={activeZone === "neck" ? "url(#activeZoneGradient)" : "url(#bodyAmbientGradient)"}
                stroke={activeZone === "neck" ? "#0284c7" : "#38bdf8"}
                strokeWidth={activeZone === "neck" ? "2.2" : "1.2"}
                className="cursor-pointer transition-all duration-200 hover:opacity-90"
                onClick={() => setActiveZone("neck")}
              />

              {/* Thorax, Pectorals & Cardiovascular Core */}
              <path
                d="M 120 96 L 142 96 C 154 98 168 104 178 114 C 181 118 178 132 164 142 C 160 146 156 160 152 172 C 130 176 110 176 88 172 C 84 160 80 146 76 142 C 62 132 59 118 62 114 C 72 104 86 98 98 96 Z"
                fill={activeZone === "chest" ? "url(#activeZoneGradient)" : "url(#bodyAmbientGradient)"}
                stroke={activeZone === "chest" ? "#0284c7" : "#38bdf8"}
                strokeWidth={activeZone === "chest" ? "2.2" : "1.2"}
                className="cursor-pointer transition-all duration-200 hover:opacity-90"
                onClick={() => setActiveZone("chest")}
              />
              {/* Cardiac Pulse Silhouette inside Chest */}
              <g opacity={activeZone === "chest" ? "0.95" : "0.5"} pointerEvents="none">
                <circle cx="128" cy="128" r="8" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" />
                <path d="M 123 128 L 126 128 L 128 123 L 130 133 L 132 128 L 135 128" stroke="#38bdf8" strokeWidth="1.2" fill="none" />
                {/* Ribcage Curvature Highlights */}
                <path d="M 100 134 C 110 138 130 138 140 134" stroke="#38bdf8" strokeWidth="0.8" opacity="0.4" fill="none" />
                <path d="M 96 148 C 108 153 132 153 144 148" stroke="#38bdf8" strokeWidth="0.8" opacity="0.4" fill="none" />
              </g>

              {/* Upper Limbs (Bilateral Arms) */}
              {/* Left Arm */}
              <path
                d="M 62 114 C 54 124 45 146 42 172 C 39 190 33 208 30 222 C 28 230 24 236 26 242 C 28 245 34 245 37 240 C 40 234 40 226 42 222 C 47 208 51 190 53 172 C 55 158 64 148 76 142 C 70 134 65 124 62 114 Z"
                fill={activeZone === "upperLimbs" ? "url(#activeZoneGradient)" : "url(#bodyAmbientGradient)"}
                stroke={activeZone === "upperLimbs" ? "#0284c7" : "#38bdf8"}
                strokeWidth={activeZone === "upperLimbs" ? "2.2" : "1.2"}
                className="cursor-pointer transition-all duration-200 hover:opacity-90"
                onClick={() => setActiveZone("upperLimbs")}
              />
              {/* Right Arm */}
              <path
                d="M 178 114 C 186 124 195 146 198 172 C 201 190 207 208 210 222 C 212 230 216 236 214 242 C 212 245 206 245 203 240 C 200 234 200 226 198 222 C 193 208 189 190 187 172 C 185 158 176 148 164 142 C 170 134 175 124 178 114 Z"
                fill={activeZone === "upperLimbs" ? "url(#activeZoneGradient)" : "url(#bodyAmbientGradient)"}
                stroke={activeZone === "upperLimbs" ? "#0284c7" : "#38bdf8"}
                strokeWidth={activeZone === "upperLimbs" ? "2.2" : "1.2"}
                className="cursor-pointer transition-all duration-200 hover:opacity-90"
                onClick={() => setActiveZone("upperLimbs")}
              />

              {/* Abdomen & Gastric Region */}
              <path
                d="M 88 172 C 110 176 130 176 152 172 C 150 186 151 198 155 208 C 157 213 158 216 158 218 C 138 222 102 222 82 218 C 82 216 83 213 85 208 C 89 198 90 186 88 172 Z"
                fill={activeZone === "abdomen" ? "url(#activeZoneGradient)" : "url(#bodyAmbientGradient)"}
                stroke={activeZone === "abdomen" ? "#0284c7" : "#38bdf8"}
                strokeWidth={activeZone === "abdomen" ? "2.2" : "1.2"}
                className="cursor-pointer transition-all duration-200 hover:opacity-90"
                onClick={() => setActiveZone("abdomen")}
              />

              {/* Pelvis & Lumbar Foundation */}
              <path
                d="M 82 218 C 102 222 138 222 158 218 C 162 226 165 238 164 254 C 150 255 132 258 120 258 C 108 258 90 255 76 254 C 75 238 78 226 82 218 Z"
                fill={activeZone === "spine" ? "url(#activeZoneGradient)" : "url(#bodyAmbientGradient)"}
                stroke={activeZone === "spine" ? "#0284c7" : "#38bdf8"}
                strokeWidth={activeZone === "spine" ? "2.2" : "1.2"}
                className="cursor-pointer transition-all duration-200 hover:opacity-90"
                onClick={() => setActiveZone("spine")}
              />

              {/* Lower Limbs (Bilateral Legs) */}
              {/* Left Leg */}
              <path
                d="M 76 254 C 72 274 69 300 68 326 C 66 344 63 360 64 372 C 65 388 67 404 68 414 L 64 420 L 79 420 L 78 414 C 80 404 83 388 84 372 C 85 360 85 344 84 326 C 84 300 96 274 114 260 L 120 258 C 108 258 90 255 76 254 Z"
                fill={activeZone === "lowerLimbs" ? "url(#activeZoneGradient)" : "url(#bodyAmbientGradient)"}
                stroke={activeZone === "lowerLimbs" ? "#0284c7" : "#38bdf8"}
                strokeWidth={activeZone === "lowerLimbs" ? "2.2" : "1.2"}
                className="cursor-pointer transition-all duration-200 hover:opacity-90"
                onClick={() => setActiveZone("lowerLimbs")}
              />
              {/* Right Leg */}
              <path
                d="M 164 254 C 168 274 171 300 172 326 C 174 344 177 360 176 372 C 175 388 173 404 172 414 L 176 420 L 161 420 L 162 414 C 160 404 157 388 156 372 C 155 360 155 344 156 326 C 156 300 144 274 126 260 L 120 258 C 132 258 150 255 164 254 Z"
                fill={activeZone === "lowerLimbs" ? "url(#activeZoneGradient)" : "url(#bodyAmbientGradient)"}
                stroke={activeZone === "lowerLimbs" ? "#0284c7" : "#38bdf8"}
                strokeWidth={activeZone === "lowerLimbs" ? "2.2" : "1.2"}
                className="cursor-pointer transition-all duration-200 hover:opacity-90"
                onClick={() => setActiveZone("lowerLimbs")}
              />
            </g>

            {/* Vertebral Column Bead Line (24 Articulating Vertebrae C1-L5) */}
            <g opacity={activeZone === "spine" ? "0.95" : "0.55"} pointerEvents="none">
              <line x1="120" y1="80" x2="120" y2="242" stroke="#38bdf8" strokeDasharray="3 3" strokeWidth="1.2" />
              {[82, 94, 106, 118, 130, 142, 154, 166, 178, 190, 202, 214, 226, 238].map((y) => (
                <circle
                  key={y}
                  cx="120"
                  cy={y}
                  r={activeZone === "spine" ? "2.5" : "1.6"}
                  fill={activeZone === "spine" ? "#22d3ee" : "#38bdf8"}
                />
              ))}
            </g>

            {/* Symmetric Aerospace Telemetry Hotspot Nodes */}
            {[
              { zone: "head" as BodyZone, cx: 120, cy: 46, label: "Head & Eyes" },
              { zone: "neck" as BodyZone, cx: 120, cy: 84, label: "Inner Ear" },
              { zone: "chest" as BodyZone, cx: 120, cy: 128, label: "Heart / Lungs" },
              { zone: "spine" as BodyZone, cx: 120, cy: 172, label: "Spine Elongation" },
              { zone: "abdomen" as BodyZone, cx: 120, cy: 198, label: "Digestion / SMS" },
              { zone: "upperLimbs" as BodyZone, cx: 46, cy: 178, label: "Left Arm" },
              { zone: "upperLimbs" as BodyZone, cx: 194, cy: 178, label: "Right Arm" },
              { zone: "lowerLimbs" as BodyZone, cx: 78, cy: 334, label: "Left Calf" },
              { zone: "lowerLimbs" as BodyZone, cx: 162, cy: 334, label: "Right Calf" },
            ].map((node, idx) => {
              const isSelected = activeZone === node.zone;
              return (
                <g
                  key={`${node.zone}-${idx}`}
                  className="cursor-pointer"
                  onClick={() => setActiveZone(node.zone)}
                >
                  {/* Outer Radar Ping Target for Selected Node */}
                  {isSelected && (
                    <>
                      <circle
                        cx={node.cx}
                        cy={node.cy}
                        r="14"
                        fill="none"
                        stroke="#0284c7"
                        strokeWidth="1.5"
                        className="animate-ping"
                        opacity="0.65"
                      />
                      <circle
                        cx={node.cx}
                        cy={node.cy}
                        r="10"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="1.2"
                        strokeDasharray="2 3"
                      />
                    </>
                  )}
                  {/* Glowing Node Center */}
                  <circle
                    cx={node.cx}
                    cy={node.cy}
                    r={isSelected ? 6 : 4}
                    fill={isSelected ? "#22d3ee" : "#0284c7"}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    filter="url(#reticleGlow)"
                    className="transition-all duration-200"
                  />
                </g>
              );
            })}
          </svg>

          {/* Structured Quick Selector Matrix */}
          <div className="w-full mt-3 flex flex-col gap-1.5 z-10 font-mono text-[11px]">
            {/* Upper Systems: Head, Neck, Chest, Stomach */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 w-full">
              {(
                [
                  ["head", "Head & Eyes", "Cranial"],
                  ["neck", "Neck & Ear", "Balance"],
                  ["chest", "Heart & Lungs", "Thorax"],
                  ["abdomen", "Stomach", "Digestive"],
                ] as [BodyZone, string, string][]
              ).map(([zone, title, sub]) => (
                <button
                  key={zone}
                  type="button"
                  onClick={() => setActiveZone(zone)}
                  className={`p-2 rounded-lg border text-left transition duration-150 cursor-pointer ${
                    activeZone === zone
                      ? "bg-sky-100 dark:bg-cyan-950/80 border-sky-500 dark:border-cyan-400 text-sky-900 dark:text-cyan-200 font-semibold shadow-xs"
                      : "bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="block font-bold text-[10px] leading-tight">{title}</span>
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        activeZone === zone ? "bg-cyan-500 animate-pulse" : "bg-emerald-500"
                      }`}
                    />
                  </div>
                  <span className="text-[9px] text-slate-600 dark:text-slate-400 block mt-0.5">{sub}</span>
                </button>
              ))}
            </div>

            {/* Core & Extremities: Spine, Arms, Legs */}
            <div className="grid grid-cols-3 gap-1.5 w-full">
              {(
                [
                  ["spine", "Spine & Back", "Elongation"],
                  ["upperLimbs", "Arms & Hands", "Dexterity"],
                  ["lowerLimbs", "Hips & Legs", "Calves"],
                ] as [BodyZone, string, string][]
              ).map(([zone, title, sub]) => (
                <button
                  key={zone}
                  type="button"
                  onClick={() => setActiveZone(zone)}
                  className={`p-2 rounded-lg border text-left transition duration-150 cursor-pointer ${
                    activeZone === zone
                      ? "bg-sky-100 dark:bg-cyan-950/80 border-sky-500 dark:border-cyan-400 text-sky-900 dark:text-cyan-200 font-semibold shadow-xs"
                      : "bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="block font-bold text-[10px] leading-tight">{title}</span>
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        activeZone === zone ? "bg-cyan-500 animate-pulse" : "bg-emerald-500"
                      }`}
                    />
                  </div>
                  <span className="text-[9px] text-slate-600 dark:text-slate-400 block mt-0.5">{sub}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Space Medicine Protocols & Clinical Countermeasure */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Card: Microgravity Physiological Adaptation */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h4 className="text-base font-semibold text-slate-900 dark:text-white">{zoneInfo.title}</h4>
              <span className="text-[11px] font-mono text-sky-700 dark:text-cyan-400 bg-sky-100 dark:bg-cyan-950/60 border border-sky-300 dark:border-cyan-800/40 px-2 py-0.5 rounded">
                {zoneInfo.laymanLabel}
              </span>
            </div>

            <div className="mt-3 p-3 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong className="block text-sky-700 dark:text-cyan-300 text-xs font-mono uppercase tracking-wider mb-1">
                On a long mission:
              </strong>
              {zoneInfo.spacePhenomenon}
            </div>

            <div className="mt-2.5 text-xs text-slate-500 dark:text-slate-400 px-1">
              <span className="text-slate-500 font-mono text-[11px] uppercase tracking-wider block mb-0.5">
                On Earth:
              </span>
              {zoneInfo.normalBaseline}
            </div>
          </div>

          {/* Card: In-Flight Clinical Protocols & Countermeasures */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={15} className="text-emerald-500 dark:text-emerald-400" />
              <strong className="text-sm font-semibold text-slate-900 dark:text-white">
                Stored note
              </strong>
            </div>
            <p className="text-xs text-emerald-950 dark:text-slate-200 leading-relaxed bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/20 p-3 rounded-lg">
              {zoneInfo.countermeasure}
            </p>
          </div>

          {/* Bespoke Interactive Symptom Logger */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Activity size={13} className="text-sky-600 dark:text-cyan-400" />
                Write a note ({zoneInfo.laymanLabel})
              </label>
              {loggedNotice && (
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 animate-fade-in bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-500/40 px-2 py-0.5 rounded">
                  ✓ {loggedNotice}
                </span>
              )}
            </div>

            {/* Accessible Native Symptom Selector */}
            <div className="mt-1">
              <select
                id="symptom-select-dropdown"
                value={selectedSymptom}
                onChange={(e) => setSelectedSymptom(e.target.value)}
                className="w-full text-xs"
                aria-label={`Select symptom note for ${zoneInfo.laymanLabel}`}
              >
                <option value="">Select observed note for {zoneInfo.laymanLabel}...</option>
                {zoneInfo.symptoms.map((symptom) => (
                  <option key={symptom} value={symptom}>
                    {symptom}
                  </option>
                ))}
              </select>
            </div>

            {/* Severity Rating Selector & Action Row */}
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 uppercase tracking-wider shrink-0">
                  Severity:
                </span>
                <div className="flex items-center gap-1.5">
                  {(["Mild", "Moderate", "Severe"] as const).map((sev) => {
                    const isCurrent = severity === sev;
                    return (
                      <button
                        key={sev}
                        type="button"
                        onClick={() => setSeverity(sev)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition cursor-pointer ${
                          isCurrent
                            ? sev === "Severe"
                              ? "bg-rose-100 dark:bg-rose-950/90 border-rose-500 text-rose-800 dark:text-rose-300 ring-1 ring-rose-500/40 shadow-sm"
                              : sev === "Moderate"
                                ? "bg-amber-100 dark:bg-amber-950/90 border-amber-500 text-amber-800 dark:text-amber-300 ring-1 ring-amber-500/40 shadow-sm"
                                : "bg-sky-100 dark:bg-cyan-950/90 border-sky-400 dark:border-cyan-400 text-sky-800 dark:text-cyan-300 ring-1 ring-sky-400/40 shadow-sm"
                            : "bg-slate-100 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700"
                        }`}
                      >
                        {sev}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={handleLog}
                disabled={!selectedSymptom}
                className="primary-button"
              >
                <CheckCircle2 size={14} className={selectedSymptom ? "text-cyan-300" : "text-slate-500"} />
                <span>Save this note</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
