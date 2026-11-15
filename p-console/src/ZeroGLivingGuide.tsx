import { useState, useMemo } from "react";
import {
  Search,
  Moon,
  Heart,
  Battery,
  Eye,
  Shield,
  AlertTriangle,
  CheckSquare,
  Square,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Filter,
  ChevronRight,
  Activity,
  Wind,
  Calculator,
  Bookmark,
  FileText,
  Sliders,
  Radio,
  BookOpen,
} from "lucide-react";

export type ClinicalTopic = {
  id: string;
  title: string;
  category: "Circadian" | "Neuro-Ocular" | "Cardiovascular" | "Musculoskeletal" | "Environmental" | "Psychological";
  severity: "Routine Operational" | "Daily Countermeasure" | "Clinical Protocol" | "Critical Monitoring";
  badgeColor: string;
  icon: string;
  lead: string;
  mechanism: string;
  flightConsideration: string;
  actionChecklist: { id: string; text: string; details: string }[];
  calculator?: "circadian" | "sans" | "co2" | "fluid";
  researchSource: string;
  citation: string;
  sourceUrl: string;
};

const PROTOCOL_TOPICS: ClinicalTopic[] = [
  {
    id: "sleep-circadian",
    title: "Circadian Entrainment & Sleep Architecture",
    category: "Circadian",
    severity: "Daily Countermeasure",
    badgeColor: "emerald",
    icon: "moon",
    lead: "Microgravity disruption of hypothalamic suprachiasmatic pacing due to 90-minute orbital sunrises and cabin acoustic noise.",
    mechanism:
      "Without Earth's natural 24-hour diurnal solar illuminance cues, melatonin synthesis delays by ~1.8 hours. Core body temperature remains elevated in zero-G ('Space Fever'), reducing slow-wave deep sleep (N3) and shortening REM epochs.",
    flightConsideration:
      "On Aster Expedition VII, crew crosses orbital night/day boundaries 16 times per 24-hour period. Ambient cabin illumination must be actively modulated to prevent chronic cognitive degradation.",
    actionChecklist: [
      {
        id: "light-shift",
        text: "Switch Solid-State Lighting (SSLA) to Blue-Depleted Spectrum",
        details: "Dim crew quarters to 480nm-filtered blue-block mode at least 60 minutes prior to scheduled sleep epoch.",
      },
      {
        id: "air-velocity",
        text: "Verify Sleep Pod Acoustic Fan & Air Circulation (> 0.08 m/s)",
        details: "In microgravity, exhaled CO₂ pools in front of mouth without gravity-driven convection. Ensure personal diffuser fan is blowing air past face.",
      },
      {
        id: "melatonin",
        text: "Keep a steady sleep time when the schedule shifts",
        details: "A shift of more than about two hours makes sleep harder. This page does not suggest a medicine or a dose.",
      },
      {
        id: "sound-masking",
        text: "Deploy Sound-Attenuating Earplugs and Opaque Eye Visor",
        details: "Reduces habitation module pump hum (ISS baseline 55-62 dBA) and stray window glare to achieve required 7.0+ hours sleep target.",
      },
    ],
    calculator: "circadian",
    researchSource: "NASA Human Research Program · Behavioral Health & Performance",
    citation: "HRP-47065: Risk of Performance Decrements and Disorders Associated with Sleep Loss and Work Overload.",
    sourceUrl: "https://www.nasa.gov/hrp/",
  },
  {
    id: "sans-neuro-ocular",
    title: "Neuro-Ocular Syndrome (SANS) & Cephalad Pressure",
    category: "Neuro-Ocular",
    severity: "Critical Monitoring",
    badgeColor: "rose",
    icon: "eye",
    lead: "Cephalad venous fluid redistribution causes sustained intracranial hypertension, optic nerve sheath distention, and hyperopic refractive drift.",
    mechanism:
      "Microgravity shifts ~1.5 to 2.0 liters of interstitial fluid and blood from the lower extremities toward the head. The absence of hydrostatic venous pooling elevates internal jugular and central venous pressures, flattening the posterior globe and causing choroidal folds and optic disc edema.",
    flightConsideration:
      "Astronauts frequently report progressive near-vision blurring by Flight Day 60–120. Early optical coherence tomography (OCT) and visual acuity mapping are vital to arrest irreversible optic nerve remodeling.",
    actionChecklist: [
      {
        id: "jaeger-check",
        text: "Conduct In-Flight Near-Visual Acuity Test (Jaeger Card / LogMAR)",
        details: "Log near and distance visual resolution. Compare against pre-flight baseline (0.0 LogMAR / 20/20 nominal).",
      },
      {
        id: "lbnp-session",
        text: "Perform 30-Minute Lower Body Negative Pressure (LBNP at -25 mmHg)",
        details: "LBNP seals the lower torso and pulls venous fluid back into femoral vasculature, transiently decompressing intracranial and intraocular pressures.",
      },
      {
        id: "co2-correlation",
        text: "Confirm Habitat Ambient pCO₂ < 3.0 mmHg",
        details: "Elevated carbon dioxide triggers cerebral vasodilation, which compounds intracranial pressure and optic sheath swelling.",
      },
      {
        id: "fundoscopy",
        text: "Quarterly Fundoscopic Optic Disc Photography",
        details: "Examine retinal vascular engorgement and Frisén grade papilledema via onboard fundus camera.",
      },
    ],
    calculator: "sans",
    researchSource: "NASA Human Research Program · Space Medicine SANS Clinical Working Group",
    citation: "PMC8095438: Spaceflight-Associated Neuro-Ocular Syndrome: Biomarkers and Clinical Countermeasures.",
    sourceUrl: "https://www.nasa.gov/hrp/",
  },
  {
    id: "cardiovascular-orthostatic",
    title: "Cardiovascular Remodeling & Orthostatic Intolerance",
    category: "Cardiovascular",
    severity: "Daily Countermeasure",
    badgeColor: "cyan",
    icon: "heart",
    lead: "Loss of hydrostatic pressure gradient induces baroreceptor recalibration, left ventricular mass reduction, and orthostatic intolerance.",
    mechanism:
      "In 1G, standing generates a ~100 mmHg pressure differential between heart and feet. In microgravity, this gradient disappears. Central blood volume increases initially, prompting the body to shed ~15% of circulating plasma volume through diuresis, reducing stroke volume and cardiac work.",
    flightConsideration:
      "Upon deorbit or emergency egress into 1G gravity, astronauts lack sufficient venous return, triggering severe presyncope, reflex tachycardia, and potential loss of consciousness.",
    actionChecklist: [
      {
        id: "cevis-workout",
        text: "Cycle Ergometer with Vibration Isolation (CEVIS) — 30 min at 75% VO₂max",
        details: "Maintains myocardial stroke capacity, peripheral arterial compliance, and aerobic capacity.",
      },
      {
        id: "bp-resting",
        text: "Standardized Morning Resting Blood Pressure Log",
        details: "Record blood pressure immediately post-waking before caffeine or resistive exercise. Target baseline: 110–125 / 70–80 mmHg.",
      },
      {
        id: "fluid-loading",
        text: "Pre-Landing / High-G Saline Fluid Loading (1.5 L with 8g NaCl)",
        details: "Restores intravascular plasma volume 2 to 4 hours prior to G-load deceleration or centrifuging.",
      },
      {
        id: "compression-garment",
        text: "Inspect G-Suit / Gradient Lower-Torso Compression Garments",
        details: "Ensure pneumatic bladders deliver 30–40 mmHg graduated counter-pressure to lower calves and thighs.",
      },
    ],
    calculator: "fluid",
    researchSource: "NASA Cardiovascular and Physical Performance Laboratory",
    citation: "NASA TM-20210018596: In-Flight Cardiovascular Adaptations and Countermeasure Verification.",
    sourceUrl: "https://www.nasa.gov/humans-in-space/the-human-body-in-space/",
  },
  {
    id: "bone-muscle-ared",
    title: "Musculoskeletal Atrophy & Bone Mineral Density Loss",
    category: "Musculoskeletal",
    severity: "Clinical Protocol",
    badgeColor: "amber",
    icon: "activity",
    lead: "Absence of ground reaction forces produces 1.0–1.5% monthly bone resorption in weight-bearing trabecular skeleton (calcaneus, femoral head).",
    mechanism:
      "Microgravity halts mechanical osteocyte signaling (piezoelectric load transduction), downregulating osteoblastic bone formation while osteoclasts aggressively resorb bone matrix. Mobilized calcium enters the bloodstream, elevating urinary calcium excretion and increasing nephrolithiasis (kidney stone) risk.",
    flightConsideration:
      "Type I slow-twitch postural muscle fibers (soleus, gastrocnemius, erector spinae) atrophy rapidly without daily axial compression and eccentric loading.",
    actionChecklist: [
      {
        id: "ared-resistance",
        text: "Advanced Resistive Exercise Device (ARED) Protocol — Squats & Deadlifts",
        details: "Apply 600 lbs pneumatic load across 6 sets to stimulate osteocytes and maintain femoral neck trabecular density.",
      },
      {
        id: "t2-treadmill",
        text: "T2 Treadmill Running with 80% Body-Mass Bungee Harness",
        details: "20 minutes interval running generates necessary impact heel-strike kinetic pulses to stimulate lower-limb osteogenesis.",
      },
      {
        id: "hydration-kidney",
        text: "Maintain Daily Fluid Ingestion > 2,500 mL (Kidney Stone Prevention)",
        details: "Dilutes excessive free ionic calcium and uric acid in renal tubules to prevent nephrolith crystallization.",
      },
      {
        id: "vitamin-d",
        text: "Sunlight is missing, so vitamin D is only a nutrition note",
        details: "This page does not set a dose or a medicine schedule.",
      },
    ],
    researchSource: "NASA Human Research Program · Bone and Muscle Laboratory",
    citation: "HRP-47056: Risk of Early Onset Osteoporosis and Muscle Atrophy in Exploration Missions.",
    sourceUrl: "https://www.nasa.gov/hrp/",
  },
  {
    id: "hypercapnia-co2",
    title: "Habitation Hypercapnia & Cabin CO₂ Micro-Pockets",
    category: "Environmental",
    severity: "Critical Monitoring",
    badgeColor: "rose",
    icon: "wind",
    lead: "Absence of natural thermal buoyancy causes localized carbon dioxide accumulation in unventilated spacecraft nooks.",
    mechanism:
      "On Earth, warm exhaled air rises due to buoyancy. In zero-G, buoyant convection is zero; exhaled air stays stagnant around an astronaut's head. If ambient ventilation drops below 0.05 m/s, an astronaut re-breathes their own exhaled CO₂, raising inspired pCO₂ above 5 mmHg.",
    flightConsideration:
      "Causes throbbing frontal headache, retro-orbital pressure, cognitive slowing, visual discomfort, and flushing. Chronic hypercapnia is directly linked to exacerbating SANS optic nerve edema.",
    actionChecklist: [
      {
        id: "meter-scan",
        text: "Compare a work-area reading with the stored cabin sample",
        details: "The stored cabin sample on day 142 is 3.2 mmHg. A higher reading is a reason to look at airflow. This page does not set a flight limit.",
      },
      {
        id: "fan-check",
        text: "Verify Habitation Air Duct Louver Alignment and Velocity",
        details: "Ensure duct velocity provides minimum 15 to 40 ft/min (0.08–0.2 m/s) continuous cabin air wash.",
      },
      {
        id: "scrubber-check",
        text: "Confirm ECLSS CDRA / Metox Desiccant Scrubber Cycling",
        details: "Check that the Carbon Dioxide Removal Assembly (CDRA) beds are regenerating on normal 140-minute thermal cycles.",
      },
      {
        id: "headache-triage",
        text: "A headache is a reason to notice the air, not to start a protocol",
        details: "Move toward moving air and drink water. This page does not start treatment. Sudden or severe symptoms belong to the crew's own emergency steps.",
      },
    ],
    calculator: "co2",
    researchSource: "NASA Spaceflight Environmental Medicine · ECLSS Working Group",
    citation: "NASA TP-2015-218570: Assessment of Carbon Dioxide Toxicity and Symptoms in Spacecraft Habitats.",
    sourceUrl: "https://www.nasa.gov/humans-in-space/the-human-body-in-space/",
  },
  {
    id: "radiation-spaceflight",
    title: "Space Radiation Dosimetry & Solar Particle Event (SPE) Shelter",
    category: "Environmental",
    severity: "Critical Monitoring",
    badgeColor: "amber",
    icon: "shield",
    lead: "Galactic Cosmic Rays (GCR) and Solar Particle Events outside Earth's magnetosphere deposit high-Z high-energy (HZE) ionizing radiation.",
    mechanism:
      "High-energy protons and stripped heavy ions (Fe, C, O) pierce aluminum hull plating, creating secondary spallation neutron cascades that cause double-strand DNA breaks, ocular light flashes (phosphenes), and long-term carcinogenic risk.",
    flightConsideration:
      "Cumulative dose on a 270-day mission is ~135–220 mSv (equivalent to ~1,000 chest X-rays). Real-time active dosimeters alert crew to solar coronal mass ejections.",
    actionChecklist: [
      {
        id: "dosimeter-read",
        text: "Daily Readout of Crew Personal Dosimeters (CPD)",
        details: "Log personal radiation absorption in µGy/day. Target threshold: < 350 µGy/day in nominal LEO.",
      },
      {
        id: "storm-shelter",
        text: "Identify Solar Particle Event (SPE) Shielded Storm Shelter",
        details: "In event of Class X solar flare, retreat to central water-wall habitat core (polyethylene and water ballast provides high hydrogen shielding).",
      },
      {
        id: "visual-phosphenes",
        text: "Log In-Flight Ocular Radiation Flashes (Phosphenes)",
        details: "Note frequency and visual quadrant of blue/white flashes perceived with closed eyes during sleep.",
      },
    ],
    researchSource: "NASA Space Radiation Analysis Group (SRAG) · Johnson Space Center",
    citation: "NASA TM-2020-5007321: Solar Particle Event Protection Standards for Exploration Missions.",
    sourceUrl: "https://www.nasa.gov/hrp/",
  },
];

function noteKind(severity: ClinicalTopic["severity"]) {
  if (severity === "Critical Monitoring") return "Worth a second look";
  if (severity === "Daily Countermeasure") return "Daily note";
  if (severity === "Clinical Protocol") return "Cabin note";
  return "Everyday note";
}

export default function ZeroGLivingGuide({
  onNavigate,
}: {
  onNavigate?: (page: any) => void;
}) {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState<string>("All");
  const [activeTopicId, setActiveTopicId] = useState<string>(PROTOCOL_TOPICS[0].id);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  // Interactive Calculators state
  const [sleepTargetHour, setSleepTargetHour] = useState(22);
  const [userCo2Reading, setUserCo2Reading] = useState(2.6);
  const [exertionMin, setExertionMin] = useState(90);

  const categories = ["All", "Circadian", "Neuro-Ocular", "Cardiovascular", "Musculoskeletal", "Environmental"];

  const filteredTopics = useMemo(() => {
    return PROTOCOL_TOPICS.filter((t) => {
      const matchCat = selectedCat === "All" || t.category === selectedCat;
      const matchSearch =
        !search ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.lead.toLowerCase().includes(search.toLowerCase()) ||
        t.mechanism.toLowerCase().includes(search.toLowerCase()) ||
        t.actionChecklist.some((a) => a.text.toLowerCase().includes(search.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [selectedCat, search]);

  const activeTopic = useMemo(() => {
    return PROTOCOL_TOPICS.find((t) => t.id === activeTopicId) || filteredTopics[0] || PROTOCOL_TOPICS[0];
  }, [activeTopicId, filteredTopics]);

  function toggleStep(stepId: string) {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  }

  const topicSteps = activeTopic.actionChecklist;
  const completedCount = topicSteps.filter((s) => completedSteps[s.id]).length;
  const progressPercent = Math.round((completedCount / topicSteps.length) * 100);

  function copySummary() {
    const text = `TanawOrbit cabin note
Day 142 · Mission altitude 408 km
Note: ${activeTopic.title} (${activeTopic.category})
Marked: ${completedCount}/${topicSteps.length}

${topicSteps
  .map(
    (s) =>
      `[${completedSteps[s.id] ? "marked" : "open"}] ${s.text}
  ${s.details}`
  )
  .join("\n")}

${activeTopic.flightConsideration}

Source: ${activeTopic.researchSource}
This is an educational note. It is not medical advice.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="zero-g-living-guide space-y-6 animate-fade-in">
      {/* Persistent Educational Disclaimer Banner */}
      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2.5">
        <AlertTriangle size={16} className="text-amber-600 dark:text-amber-400 shrink-0" />
        <p className="leading-snug">
          <strong>Educational notes:</strong> Stored reference material for mission simulation. Not medical advice and not a NASA manual.
        </p>
      </div>

      {/* Flight Operations Toolbar & Quick Actions */}
      <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-sky-50 dark:bg-cyan-950/80 border border-sky-300 dark:border-cyan-500/40 text-sky-800 dark:text-cyan-300 font-mono text-xs flex items-center gap-1.5 font-semibold">
            <BookOpen size={13} className="text-sky-600 dark:text-cyan-400" />
            Notes for this cabin
          </span>
          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 font-mono text-xs">
            Day 142 · Mission altitude 406 km
          </span>
          <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-600/40 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-semibold">
            {PROTOCOL_TOPICS.length} notes
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copySummary}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 dark:bg-cyan-950/80 dark:hover:bg-cyan-900/80 border border-sky-300 dark:border-cyan-500/50 text-xs font-mono text-sky-800 dark:text-cyan-200 font-semibold transition active:scale-98 shadow-sm cursor-pointer"
            title="Copy this note"
          >
            {copied ? <Check size={14} className="text-emerald-600 dark:text-emerald-400" /> : <Copy size={14} />}
            <span>{copied ? "Note copied" : "Copy this note"}</span>
          </button>
        </div>
      </div>

      {/* Interactive Search & Category Filter Pills */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition cursor-pointer ${
                selectedCat === cat
                  ? "bg-sky-100 dark:bg-cyan-950 border border-sky-400 dark:border-cyan-500/60 text-sky-900 dark:text-cyan-200 shadow-sm font-semibold"
                  : "bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative min-w-[240px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search sleep, air, exercise..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-sky-500 dark:focus:border-cyan-500 focus:ring-1 focus:ring-sky-500/30 transition outline-none font-mono"
          />
        </div>
      </div>

      {/* Main Dual-Pane Interactive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Topic Browser List (4 Cols) */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1 font-semibold flex items-center justify-between">
            <span>Notes ({filteredTopics.length})</span>
            <span className="text-[10px] text-sky-600 dark:text-cyan-400">SELECT TO VIEW</span>
          </div>

          <div className="space-y-2">
            {filteredTopics.map((topic) => {
              const isSelected = activeTopic.id === topic.id;
              const completedInTopic = topic.actionChecklist.filter((s) => completedSteps[s.id]).length;
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setActiveTopicId(topic.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition cursor-pointer relative group ${
                    isSelected
                      ? "bg-sky-50/60 dark:bg-slate-800/90 border-sky-400 dark:border-cyan-400/70 shadow-sm ring-1 ring-sky-400/30 dark:ring-cyan-400/30"
                      : "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-850 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wide px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                      {topic.category}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-full border font-semibold ${
                        topic.severity === "Critical Monitoring"
                          ? "bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-600/40 text-rose-700 dark:text-rose-300"
                          : topic.severity === "Daily Countermeasure"
                          ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-600/40 text-emerald-700 dark:text-emerald-300"
                          : "bg-sky-50 dark:bg-cyan-950/60 border-sky-300 dark:border-cyan-600/40 text-sky-700 dark:text-cyan-300"
                      }`}
                    >
                      {noteKind(topic.severity)}
                    </span>
                  </div>

                  <strong className="text-sm font-semibold text-slate-900 dark:text-white block group-hover:text-sky-600 dark:group-hover:text-cyan-300 transition">
                    {topic.title}
                  </strong>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {topic.lead}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <CheckSquare size={12} className={completedInTopic > 0 ? "text-emerald-600 dark:text-cyan-400" : "text-slate-400"} />
                      {completedInTopic} / {topic.actionChecklist.length} marked
                    </span>
                    <ChevronRight size={14} className={isSelected ? "text-sky-600 dark:text-cyan-400" : "text-slate-400"} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Clinical Protocol Deep Dive (8 Cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Active Header Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-sky-50 dark:bg-cyan-950/80 border border-sky-300 dark:border-cyan-500/40 text-sky-800 dark:text-cyan-300 text-xs font-mono font-medium">
                  {activeTopic.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono">
                  {noteKind(activeTopic.severity)}
                </span>
              </div>

              {/* Progress Pill */}
              <div className="flex items-center gap-2">
                <div className="w-28 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-sky-700 dark:text-cyan-300 font-bold">
                  {progressPercent}%
                </span>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {activeTopic.title}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              {activeTopic.lead}
            </p>

            {/* Microgravity Spaceflight Consideration Callout */}
            <div className="mt-4 p-4 rounded-xl bg-sky-50/70 dark:bg-cyan-950/30 border border-sky-200 dark:border-cyan-500/30 text-xs text-sky-900 dark:text-cyan-100 leading-relaxed">
              <strong className="text-sky-800 dark:text-cyan-300 block mb-1 font-semibold flex items-center gap-1.5">
                <Activity size={14} />
                In this cabin:
              </strong>
              {activeTopic.flightConsideration}
            </div>

            {/* Physiological Mechanism */}
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 font-bold mb-1.5 flex items-center gap-1.5">
                <Sliders size={13} className="text-sky-600 dark:text-cyan-400" />
                Why this happens
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeTopic.mechanism}
              </p>
            </div>
          </div>

          {/* Interactive Step-by-Step Action Checklist */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <CheckSquare size={17} className="text-sky-600 dark:text-cyan-400" />
                  Things to notice
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Educational notes for this cabin. Marking a line only remembers it in this browser. These are not medical steps.
                </p>
              </div>
              <span className="text-xs font-mono text-sky-800 dark:text-cyan-300 bg-sky-50 dark:bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-sky-200 dark:border-cyan-800/40 font-semibold">
                {completedCount} / {topicSteps.length} marked
              </span>
            </div>

            <div className="space-y-3">
              {topicSteps.map((step, idx) => {
                const isDone = Boolean(completedSteps[step.id]);
                return (
                  <div
                    key={step.id}
                    onClick={() => toggleStep(step.id)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start gap-3.5 ${
                      isDone
                        ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-500/40 text-slate-700 dark:text-slate-200"
                        : "bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <button
                      type="button"
                      aria-label={isDone ? "Mark incomplete" : "Mark complete"}
                      className={`size-6 rounded-lg grid place-items-center shrink-0 mt-0.5 transition ${
                        isDone
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-transparent hover:border-sky-500"
                      }`}
                    >
                      <Check size={14} strokeWidth={3} className={isDone ? "block" : "opacity-0"} />
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <strong
                          className={`text-xs font-semibold ${
                            isDone ? "text-emerald-700 dark:text-emerald-300 line-through opacity-90" : "text-slate-900 dark:text-white"
                          }`}
                        >
                          Step {idx + 1}: {step.text}
                        </strong>
                        <span className="text-[10px] font-mono text-slate-500 shrink-0 font-medium">
                          {isDone ? "COMPLETED" : "PENDING"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {step.details}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Inline Interactive Clinical Calculator (Topic Specific) */}
          {activeTopic.calculator === "circadian" && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Calculator size={16} className="text-sky-600 dark:text-cyan-400" />
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Sleep-time lighting example
                </h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                Shows when to dim the lights if sleep starts at the hour you pick. This does not schedule a medicine.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">TARGET SLEEP (UTC)</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={0}
                      max={23}
                      value={sleepTargetHour}
                      onChange={(e) => setSleepTargetHour(Number(e.target.value))}
                      className="w-full accent-sky-600 dark:accent-cyan-400 cursor-pointer"
                    />
                    <strong className="text-slate-900 dark:text-white text-sm whitespace-nowrap">
                      {String(sleepTargetHour).padStart(2, "0")}:00
                    </strong>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">DIM LIGHTING PROTOCOL</span>
                  <strong className="text-sky-700 dark:text-cyan-300 text-sm">
                    {String((sleepTargetHour + 23) % 24).padStart(2, "0")}:00 UTC
                  </strong>
                  <small className="text-[10px] text-slate-500 block mt-0.5">60 min before sleep</small>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">NO DOSE ON THIS PAGE</span>
                  <strong className="text-emerald-700 dark:text-emerald-400 text-sm">
                    Timing note only
                  </strong>
                  <small className="text-[10px] text-slate-500 block mt-0.5">Not a medicine schedule</small>
                </div>
              </div>
            </div>
          )}

          {activeTopic.calculator === "co2" && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Wind size={16} className="text-sky-600 dark:text-cyan-400" />
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Cabin carbon dioxide example
                </h4>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 font-mono">
                <div className="w-full sm:w-1/2 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">
                    CURRENT CABIN pCO₂ READING: {userCo2Reading.toFixed(1)} mmHg
                  </span>
                  <input
                    type="range"
                    min={1.0}
                    max={6.0}
                    step={0.1}
                    value={userCo2Reading}
                    onChange={(e) => setUserCo2Reading(Number(e.target.value))}
                    className="w-full accent-sky-600 dark:accent-cyan-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500 mt-1">
                    <span>1.0</span>
                    <span>3.0 example</span>
                    <span>6.0</span>
                  </div>
                </div>

                <div className="w-full sm:w-1/2 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/90 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">EXAMPLE READING:</span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                        userCo2Reading < 3.0
                          ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                          : userCo2Reading < 4.5
                          ? "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                          : "bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
                      }`}
                    >
                      {userCo2Reading < 3.0 ? "INSIDE THE EXAMPLE" : userCo2Reading < 4.5 ? "ABOVE THE EXAMPLE" : "WELL ABOVE THE EXAMPLE"}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                    {userCo2Reading < 3.0
                      ? "This slider sits under 3.0 mmHg. The stored cabin sample on day 142 is 3.2 mmHg. This is not a diagnosis."
                      : userCo2Reading < 4.5
                      ? "This slider is above 3.0 mmHg. It is a reason to look at airflow. It does not start treatment."
                      : "This slider is well above the example band. It is not a diagnosis and it does not start oxygen or any other treatment."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTopic.calculator === "fluid" && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Heart size={16} className="text-sky-600 dark:text-cyan-400" />
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Fluid example from workout time
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">DAILY WORKOUT DURATION</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={30}
                      max={150}
                      step={15}
                      value={exertionMin}
                      onChange={(e) => setExertionMin(Number(e.target.value))}
                      className="w-full accent-sky-600 dark:accent-cyan-400 cursor-pointer"
                    />
                    <strong className="text-slate-900 dark:text-white text-sm">{exertionMin}m</strong>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">EXAMPLE FIGURE ONLY</span>
                  <strong className="text-sky-700 dark:text-cyan-300 text-sm">
                    {(1500 + exertionMin * 10).toFixed(0)} mL
                  </strong>
                  <small className="text-[10px] text-slate-500 block mt-0.5">Not a fluid order</small>
                </div>
              </div>
            </div>
          )}

          {/* Research & Source Evidence Attribution Card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                NASA HRP Scientific Evidence Base
              </span>
              <strong className="text-slate-800 dark:text-slate-200 block mt-0.5 font-medium">
                {activeTopic.researchSource}
              </strong>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {activeTopic.citation}
              </p>
            </div>

            <a
              href={activeTopic.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sky-700 dark:text-cyan-400 hover:text-sky-800 dark:hover:text-cyan-300 font-mono text-xs transition shrink-0"
            >
              <span>View Source</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
