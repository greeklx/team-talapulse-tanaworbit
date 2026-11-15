import { useState } from "react";
import {
  X,
  Check,
  Globe,
  Rocket,
  Compass,
  Orbit,
  ShieldAlert,
  Radio,
  Scale,
  Info,
} from "lucide-react";
import { missionContexts, spaceHazards } from "./toolkitData";
import type { Page } from "./App";

interface ScenarioDetails {
  badge: string;
  location: string;
  gravityNote: string;
  commsNote: string;
  newbieTip: string;
}

const scenarioDetails: Record<string, ScenarioDetails> = {
  orbital: {
    badge: "Simulation 1 · LEO Station",
    location: "Low Earth Orbit (408 km)",
    gravityNote:
      "Fluid shifts redistributes ~2L of bodily fluids towards the head and chest. Space motion sickness (SMS) and cardiovascular unweighting are monitored daily.",
    commsNote: "Near real-time (~0.1s latency) via continuous TDRS ground satellite relay.",
    newbieTip:
      "As a rookie astronaut in orbit, log morning puffiness or sinus congestion in the Daily Check-In and monitor your resting heart rate against baseline.",
  },
  transit: {
    badge: "Simulation 2 · Deep-Space Cruise",
    location: "Cislunar / Mars Transit Trajectory",
    gravityNote:
      "Prolonged zero-g coasting. Musculoskeletal deconditioning (1–1.5% bone mineral density loss per month) necessitates strict 2-hour daily exercise regimens.",
    commsNote:
      "Periodic blackout windows and variable latency. Autonomous crew clinical protocols are required when out of ground contact.",
    newbieTip:
      "With delayed ground communication, use the Health Toolkit evidence library to review autonomous symptom management and sleep hygiene guidelines.",
  },
  lunar: {
    badge: "Simulation 3 · Artemis Base Camp",
    location: "Lunar South Pole (Shackleton Crater)",
    gravityNote:
      "Partial gravity (0.166g — 1/6th Earth). Partial weight-bearing stabilizes fluid shifts, but altered ground reaction forces challenge sensorimotor coordination and gait.",
    commsNote:
      "Direct line-of-sight and Lunar Gateway relay (~1.3s round-trip latency). Surface EVAs require suit pressure monitoring.",
    newbieTip:
      "Inspect the Sensorimotor & Reflex panel after surface EVAs to verify fine-motor dexterity and ensure abrasive lunar dust filters are operational.",
  },
  mars: {
    badge: "Simulation 4 · Planetary Outpost",
    location: "Martian Surface (Jezero Crater Outpost)",
    gravityNote:
      "Partial gravity (0.38g — 3/8th Earth). Re-adaptation following long cruise requires fluid loading and orthostatic tolerance countermeasures.",
    commsNote:
      "Deep Space Network latency ranges from 4 to 24 minutes each way. Real-time medical telemedicine is impossible; crew operates autonomously.",
    newbieTip:
      "On Mars, maintain rigorous daily check-ins and review the HRP Countermeasures section for closed-habitat environmental adaptation.",
  },
};

export default function SimulationScenarioModal({
  currentId,
  onSelect,
  onNavigate,
  onClose,
}: {
  currentId: string;
  onSelect: (id: string) => void;
  onNavigate?: (page: Page) => void;
  onClose: () => void;
}) {
  const [selectedId, setSelectedId] = useState<string>(currentId);

  const scenarioIcons: Record<string, any> = {
    orbital: Orbit,
    transit: Rocket,
    lunar: Globe,
    mars: Compass,
  };

  const selectedCtx = missionContexts.find((c) => c.id === selectedId) || missionContexts[0];
  const details = scenarioDetails[selectedId] || scenarioDetails.orbital;
  const SelectedIcon = scenarioIcons[selectedId] || Orbit;

  const relevantHazards = spaceHazards.filter((h) => selectedCtx.hazardIds.includes(h.id));

  function handleApplyAndGo(targetPage: Page) {
    onSelect(selectedId);
    if (onNavigate) {
      onNavigate(targetPage);
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div
        className="panel modal simulation-scenario-modal text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl relative my-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sim-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="modal-close absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-sky-600 dark:text-cyan-400 font-bold">
            Setting for this visit
          </span>
        </div>

        <h2 id="sim-modal-title" className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Where this visit is set
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Pick a setting. It changes the short note at the top of Today. It does not change the numbers or the Usual, Different, and Flagged labels. After you start, the page names the next click.
        </p>

        {/* Scenario Selector Cards */}
        <div className="mt-5">
          <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2.5">
            Setting
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {missionContexts.map((ctx) => {
              const isSelected = ctx.id === selectedId;
              const IconComp = scenarioIcons[ctx.id] || Orbit;
              const itemDetails = scenarioDetails[ctx.id];

              return (
                <button
                  key={ctx.id}
                  type="button"
                  onClick={() => setSelectedId(ctx.id)}
                  className={`p-3.5 rounded-xl border text-left transition relative flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? "bg-sky-50 dark:bg-cyan-950/70 border-sky-500 dark:border-cyan-400 ring-2 ring-sky-500/25 dark:ring-cyan-500/30 shadow-md"
                      : "bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300">
                        {itemDetails?.badge.split(" · ")[0] || "Sim"}
                      </span>
                      {isSelected && (
                        <span className="size-4.5 rounded-full bg-sky-600 dark:bg-cyan-500 text-white dark:text-slate-950 grid place-items-center shadow-xs">
                          <Check size={11} strokeWidth={3} />
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <IconComp
                        size={17}
                        className={isSelected ? "text-sky-600 dark:text-cyan-400" : "text-slate-500 dark:text-slate-400"}
                      />
                      <strong className="text-sm font-bold text-slate-900 dark:text-white block truncate">
                        {ctx.title}
                      </strong>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {itemDetails?.location}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800/80 text-[10px] font-mono text-slate-500 dark:text-slate-400 space-y-0.5">
                    <div className="flex justify-between">
                      <span>Gravity:</span>
                      <b className="text-slate-800 dark:text-slate-200">{ctx.gravity.split(" ")[0]}</b>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Scenario Orientation & Rookie Directives */}
        <div className="mt-6 p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3.5">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-sky-100 dark:bg-cyan-900/50 border border-sky-300 dark:border-cyan-700/60 grid place-items-center text-sky-700 dark:text-cyan-300 shrink-0">
                <SelectedIcon size={22} />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-sky-700 dark:text-cyan-400 font-bold block">
                  {details.badge}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                  {selectedCtx.title} — {details.location}
                </h3>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 self-start sm:self-center font-medium">
              Numbers stay as stored
            </span>
          </div>

          {/* Environmental Parameters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200 mb-1">
                <Scale size={14} className="text-sky-600 dark:text-cyan-400" />
                <span>Gravity Field Dynamics:</span>
                <b className="font-mono text-sky-700 dark:text-cyan-300 ml-auto">{selectedCtx.gravity}</b>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                {selectedCtx.description}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200 mb-1">
                <Radio size={14} className="text-sky-600 dark:text-cyan-400" />
                <span>Communications Latency:</span>
                <b className="font-mono text-sky-700 dark:text-cyan-300 ml-auto">{selectedCtx.communications}</b>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                {selectedCtx.measurementNote}
              </p>
            </div>
          </div>

          {/* Active Hazards */}
          <div>
            <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400 font-semibold block mb-1.5">
              NASA HRP Spaceflight Hazards Monitored:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {relevantHazards.map((h) => (
                <span
                  key={h.id}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                >
                  <ShieldAlert size={12} className="text-amber-500" />
                  {h.title}
                </span>
              ))}
            </div>
          </div>

          {/* Newbie Tip */}
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            The visit is still three steps: record today, try one practice, then log exercise. The bar at the top of each page tells you which one is next.
          </p>
        </div>

        {/* Modal Action Bar */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono text-center sm:text-left">
            Current Scenario: <b className="text-sky-600 dark:text-cyan-400">{selectedCtx.title}</b>
            <span className="mx-2 hidden sm:inline">·</span>
            <span className="block sm:inline mt-0.5 sm:mt-0">{details.badge}</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold cursor-pointer transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleApplyAndGo("Astronaut Dashboard")}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 text-xs font-bold cursor-pointer transition shadow-md flex items-center justify-center gap-1.5"
            >
              <Check size={14} strokeWidth={3} />
              Start on Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
