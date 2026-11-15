import { useState, useEffect } from "react";
import {
  AlertTriangle,
  HeartPulse,
  Activity,
  ShieldAlert,
  Send,
  CheckCircle2,
  X,
  Stethoscope,
  ChevronRight,
  Radio,
  Clock,
  Zap,
} from "lucide-react";

export default function AcuteEmergencyProtocolModal({
  onClose,
  onNavigateToWaveforms,
}: {
  onClose: () => void;
  onNavigateToWaveforms?: () => void;
}) {
  const [activePhase, setActivePhase] = useState<number>(1);
  const [burstSent, setBurstSent] = useState(false);
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function markPhaseComplete(phase: number) {
    if (!completedPhases.includes(phase)) {
      setCompletedPhases((prev) => [...prev, phase]);
    }
    if (phase < 4) {
      setActivePhase(phase + 1);
    }
  }

  function handleSendBurst() {
    setBurstSent(true);
    markPhaseComplete(4);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div
        className="bg-[var(--panel)] border border-rose-500/60 dark:border-rose-500/80 rounded-2xl max-w-4xl w-full p-5 sm:p-7 text-[var(--text)] max-h-[94vh] overflow-y-auto shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="emergency-protocol-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-[var(--panel-elevated)] hover:bg-rose-500/20 text-[var(--muted)] hover:text-rose-500 transition border border-[var(--border)] cursor-pointer"
          aria-label="Close emergency drill"
        >
          <X size={18} />
        </button>

        {/* Challenge Header & Deep Space Context */}
        <div className="border-b border-rose-500/30 pb-4 mb-5">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-600 dark:text-rose-400 font-mono text-xs font-bold tracking-wider uppercase animate-pulse">
              <AlertTriangle size={13} />
              CRITICAL EMERGENCY DRILL · HALFWAY TO MARS
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--panel-elevated)] border border-[var(--border)] text-[var(--muted)] font-mono text-[11px]">
              <Radio size={12} className="text-amber-500" />
              14-MIN COMMS LATENCY (NO REAL-TIME GROUND CONTACT)
            </span>
          </div>

          <h1 id="emergency-protocol-title" className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)]">
            Acute Medical Crisis Stabilization: Sudden Chest Pain &amp; Collapse
          </h1>

          <p className="text-xs sm:text-sm text-[var(--muted)] mt-1.5 leading-relaxed max-w-3xl">
            <strong>Space Apps Challenge Scenario (Brazilian Space Agency / Rodrigo Leonardi):</strong> You are halfway to Mars when a fellow astronaut experiences acute crushing substernal chest pain and suddenly collapses. Astronauts are cross-trained engineers, pilots, and scientists—<strong>not medical doctors</strong>. Follow this 4-phase simulated training walkthrough.
          </p>
        </div>

        {/* Persistent Simulated Scenario Disclaimer */}
        <div className="mb-4 p-2.5 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-900 dark:text-amber-200 text-xs font-mono flex items-center gap-2">
          <AlertTriangle size={15} className="text-amber-600 dark:text-amber-400 shrink-0" />
          <span>SIMULATED TRAINING SCENARIO: Fictional demonstration doses and algorithm for educational walkthrough only — not medical guidance.</span>
        </div>

        {/* Phase Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 font-mono text-xs">
          {[
            { phase: 1, title: "1. Zero-G CPR Restraint", icon: HeartPulse },
            { phase: 2, title: "2. Sensor Deployment", icon: Activity },
            { phase: 3, title: "3. Decision Tree", icon: Stethoscope },
            { phase: 4, title: "4. Rx & Telemetry Burst", icon: Send },
          ].map((item) => {
            const isActive = activePhase === item.phase;
            const isDone = completedPhases.includes(item.phase);
            const IconComp = item.icon;
            return (
              <button
                key={item.phase}
                type="button"
                onClick={() => setActivePhase(item.phase)}
                className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                  isActive
                    ? "bg-rose-500/15 border-rose-500 text-rose-600 dark:text-rose-300 font-bold ring-1 ring-rose-500/30"
                    : isDone
                      ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                      : "bg-[var(--panel-elevated)] border-[var(--border)] text-[var(--muted)] hover:border-slate-400"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <IconComp size={15} />
                  <span className="truncate">{item.title}</span>
                </div>
                {isDone && <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Active Phase Content Cards */}
        <div className="p-4 sm:p-6 rounded-xl bg-[var(--bg)] border border-[var(--border)] space-y-5">
          {/* Phase 1: Zero-G CPR & Restraint */}
          {activePhase === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-lg bg-rose-500/20 text-rose-500 font-bold font-mono text-xs">PHASE 1</span>
                  <h2 className="text-base font-bold text-[var(--text)]">Immediate Zero-Gravity Life Safety &amp; Restraint CPR</h2>
                </div>
                <span className="text-xs font-mono text-amber-500 font-medium">Life Safety Priority</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
                <div className="p-3.5 rounded-xl bg-[var(--panel)] border border-[var(--border)] space-y-1.5">
                  <span className="font-mono text-sky-600 dark:text-sky-400 font-bold uppercase tracking-wider block">
                    HOW TO MEASURE
                  </span>
                  <strong className="block text-[var(--text)] font-semibold text-sm">Airway, Breathing &amp; Carotid Pulse</strong>
                  <p className="text-[var(--muted)] leading-relaxed">
                    Check patient responsiveness with verbal call and shoulder squeeze. In zero-g, palpate carotid artery for 10 seconds. Observe chest excursion for spontaneous breathing.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--panel)] border border-[var(--border)] space-y-1.5">
                  <span className="font-mono text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider block">
                    WHY IT MATTERS
                  </span>
                  <strong className="block text-[var(--text)] font-semibold text-sm">Microgravity Newton's 3rd Law</strong>
                  <p className="text-[var(--muted)] leading-relaxed">
                    Without physical restraint, every chest compression pushes the rescuer backwards into free float, delivering 0 N effective perfusion force to the heart and cerebral tissue.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--panel)] border border-[var(--border)] space-y-1.5">
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider block">
                    WHAT TO DO
                  </span>
                  <strong className="block text-[var(--text)] font-semibold text-sm">CMRS Tethering &amp; Handstand CPR</strong>
                  <p className="text-[var(--muted)] leading-relaxed">
                    Strap patient to Crew Medical Restraint System (CMRS). Place rescuer feet into footholds or straddle opposite bulkhead in inverted Handstand position. Deliver 100–120 compressions/min at 5 cm depth.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs">
                <Zap size={16} className="text-rose-500 shrink-0 mt-0.5" />
                <div className="text-[var(--text)]">
                  <strong>Automated External Defibrillator (AED):</strong> Deploy the station Tempus Pro AED immediately. Apply self-adhesive pads to bare chest (right infraclavicular and left cardiac apex). Clear crew and follow automated voice prompts.
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => markPhaseComplete(1)}
                  className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-md"
                >
                  <span>Confirm Restraint &amp; Advance to Sensor Placement</span>
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* Phase 2: Sensor Placement & Telemetry Capture */}
          {activePhase === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-lg bg-sky-500/20 text-sky-500 font-bold font-mono text-xs">PHASE 2</span>
                  <h2 className="text-base font-bold text-[var(--text)]">Sensor Deployment &amp; Continuous Telemetry Capture</h2>
                </div>
                <span className="text-xs font-mono text-sky-500 font-medium">Diagnostic Vitals</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
                <div className="p-3.5 rounded-xl bg-[var(--panel)] border border-[var(--border)] space-y-1.5">
                  <span className="font-mono text-sky-600 dark:text-sky-400 font-bold uppercase tracking-wider block">
                    HOW TO MEASURE
                  </span>
                  <strong className="block text-[var(--text)] font-semibold text-sm">3-Lead/12-Lead ECG &amp; Pulse Oximetry</strong>
                  <p className="text-[var(--muted)] leading-relaxed">
                    Attach ECG patches: White (right clavicle), Black (left clavicle), Red (left lower ribs). Snap SpO2 sensor onto index finger. Fit PUMA metabolic cannula over nose/mouth.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--panel)] border border-[var(--border)] space-y-1.5">
                  <span className="font-mono text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider block">
                    WHY IT MATTERS
                  </span>
                  <strong className="block text-[var(--text)] font-semibold text-sm">Cephalad Fluid Shift vs Infarction</strong>
                  <p className="text-[var(--muted)] leading-relaxed">
                    Microgravity cephalad fluid shifts cause facial puffiness and high jugular filling. Non-doctor crew must differentiate benign space venous congestion from acute coronary artery occlusion.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--panel)] border border-[var(--border)] space-y-1.5">
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider block">
                    WHAT TO DO
                  </span>
                  <strong className="block text-[var(--text)] font-semibold text-sm">Live Waveform Monitor Verification</strong>
                  <p className="text-[var(--muted)] leading-relaxed">
                    Verify live rhythm strip on console: evaluate for Ventricular Fibrillation (chaotic waves), Asystole (flatline), or ST-segment Elevation (tombstone pattern &gt; 2 mm above baseline).
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-[var(--panel)] border border-[var(--border)]">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <Activity size={16} className="text-cyan-500" />
                  <span>Interactive Telemetry: Live Waveforms active in console suite.</span>
                </div>
                {onNavigateToWaveforms && (
                  <button
                    type="button"
                    onClick={() => {
                      onNavigateToWaveforms();
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40 text-xs font-mono font-medium transition cursor-pointer"
                  >
                    Open Live Waveform Suite →
                  </button>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => markPhaseComplete(2)}
                  className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-md"
                >
                  <span>Confirm Sensors &amp; Proceed to Decision Tree</span>
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* Phase 3: Autonomous Diagnostic Triage (Non-Doctor Guide) */}
          {activePhase === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-lg bg-amber-500/20 text-amber-500 font-bold font-mono text-xs">PHASE 3</span>
                  <h2 className="text-base font-bold text-[var(--text)]">Autonomous Decision Tree: Simulated Walkthrough</h2>
                </div>
                <span className="text-xs font-mono text-amber-500 font-medium">Algorithmic Decision Tree</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
                {/* Condition 1: STEMI */}
                <div className="p-4 rounded-xl bg-[var(--panel)] border border-rose-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400">
                      HIGH MORTALITY
                    </span>
                    <HeartPulse size={16} className="text-rose-500" />
                  </div>
                  <strong className="text-sm font-bold text-[var(--text)] block">
                    Acute Myocardial Infarction (STEMI)
                  </strong>
                  <ul className="text-[11px] text-[var(--muted)] space-y-1 list-disc pl-4 leading-relaxed">
                    <li>Crushing central chest pain radiating to left jaw or arm</li>
                    <li>ECG: ST-segment elevation &gt; 2 mm in contiguous leads</li>
                    <li>SpO2 may be &gt; 92% initially; BP fluctuating</li>
                  </ul>
                  <div className="pt-2 border-t border-[var(--border)] font-mono text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
                    Simulated Scenario Action: Follow protocol Aspirin / Nitroglycerin under surgeon review
                  </div>
                </div>

                {/* Condition 2: Pulmonary Embolism */}
                <div className="p-4 rounded-xl bg-[var(--panel)] border border-amber-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400">
                      MICROGRAVITY THROMBUS
                    </span>
                    <Activity size={16} className="text-amber-500" />
                  </div>
                  <strong className="text-sm font-bold text-[var(--text)] block">
                    Pulmonary Thromboembolism (PE)
                  </strong>
                  <ul className="text-[11px] text-[var(--muted)] space-y-1 list-disc pl-4 leading-relaxed">
                    <li>Sudden sharp pleuritic chest pain + severe dyspnea</li>
                    <li>SpO2 rapidly drops below 88%; Respiration rate &gt; 24 br/min</li>
                    <li>ECG: Sinus tachycardia with right ventricular strain pattern</li>
                  </ul>
                  <div className="pt-2 border-t border-[var(--border)] font-mono text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                    Action: High-flow O2 (15 L/min mask) + Enoxaparin / Heparin SQ
                  </div>
                </div>

                {/* Condition 3: Spaceflight Cephalad Congestion */}
                <div className="p-4 rounded-xl bg-[var(--panel)] border border-sky-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/15 text-sky-600 dark:text-sky-400">
                      MICROGRAVITY SHIFT
                    </span>
                    <Stethoscope size={16} className="text-sky-500" />
                  </div>
                  <strong className="text-sm font-bold text-[var(--text)] block">
                    Severe Cephalad Venous Congestion
                  </strong>
                  <ul className="text-[11px] text-[var(--muted)] space-y-1 list-disc pl-4 leading-relaxed">
                    <li>Upper chest fullness, jugular venous engorgement, facial edema</li>
                    <li>ECG is normal sinus rhythm; SpO2 &gt; 96%</li>
                    <li>Mean Arterial Pressure (MAP) elevated above 105 mmHg</li>
                  </ul>
                  <div className="pt-2 border-t border-[var(--border)] font-mono text-[11px] text-sky-600 dark:text-sky-400 font-semibold">
                    Action: Lower Body Negative Pressure (LBNP) chamber (-30 mmHg)
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => markPhaseComplete(3)}
                  className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-md"
                >
                  <span>Select Protocol &amp; Administer Emergency Countermeasures</span>
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* Phase 4: Emergency Countermeasures & DSN Telemetry Burst */}
          {activePhase === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-lg bg-emerald-500/20 text-emerald-500 font-bold font-mono text-xs">PHASE 4</span>
                  <h2 className="text-base font-bold text-[var(--text)]">Emergency Countermeasures &amp; Deep Space Network (DSN) Telemetry Burst</h2>
                </div>
                <span className="text-xs font-mono text-emerald-500 font-medium">Stabilization &amp; Uplink</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[var(--panel)] border border-[var(--border)] space-y-2.5">
                  <strong className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
                    <ShieldAlert size={16} className="text-rose-500" />
                    Emergency Medical Kit (EMK) Checklist
                  </strong>
                  <div className="space-y-2 text-[var(--muted)] leading-relaxed">
                    <div className="flex items-center gap-2">
                      <span className="size-4 rounded-full bg-emerald-500/20 text-emerald-500 grid place-items-center font-bold text-[10px]">✓</span>
                      <span>High-Flow Oxygen via Non-Rebreather Mask (scenario demonstration).</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="size-4 rounded-full bg-emerald-500/20 text-emerald-500 grid place-items-center font-bold text-[10px]">✓</span>
                      <span>Simulated EMK Chewable Aspirin (demonstration protocol).</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="size-4 rounded-full bg-emerald-500/20 text-emerald-500 grid place-items-center font-bold text-[10px]">✓</span>
                      <span>Simulated EMK Sublingual Nitroglycerin (demonstration protocol, if SBP &gt; 100 mmHg).</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="size-4 rounded-full bg-emerald-500/20 text-emerald-500 grid place-items-center font-bold text-[10px]">✓</span>
                      <span>Initiate LBNP Suit at -30 mmHg to draw blood into legs.</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[var(--panel)] border border-[var(--border)] space-y-2.5">
                  <strong className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
                    <Radio size={16} className="text-sky-500" />
                    Deep Space Network (DSN) High-Rate Burst
                  </strong>
                  <p className="text-[var(--muted)] leading-relaxed">
                    Due to the 14-minute one-way light time to Earth, real-time audio consultation is delayed by 28 minutes round-trip. Package full 12-lead ECG raw telemetry, continuous SpO2 trends, and automated vitals snapshot into high-priority Emergency Burst Pack.
                  </p>
                  <div className="pt-2 font-mono text-[11px] text-[var(--subtle)]">
                    Target Ground Stations: Madrid · Goldstone · Canberra DSN 70m Antennas
                  </div>
                </div>
              </div>

              {/* DSN Telemetry Burst Action */}
              <div className="p-4 rounded-xl bg-[var(--panel-elevated)] border border-sky-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs font-mono">
                  <div className="text-[var(--text)] font-bold">EMERGENCY TELEMETRY PACKET: READY (12.4 MB)</div>
                  <div className="text-[var(--muted)] text-[11px]">Includes 12-lead ECG, blood gases, MAP delta, and non-doctor interventions.</div>
                </div>
                <button
                  type="button"
                  onClick={handleSendBurst}
                  disabled={burstSent}
                  className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-md shrink-0 ${
                    burstSent
                      ? "bg-emerald-600 text-white cursor-default"
                      : "bg-rose-600 hover:bg-rose-500 text-white active:scale-98"
                  }`}
                >
                  <Send size={14} />
                  <span>{burstSent ? "DSN Emergency Burst Transmitted (ACK)" : "Transmit High-Priority DSN Burst to Earth"}</span>
                </button>
              </div>

              {burstSent && (
                <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs font-mono leading-relaxed animate-fade-in flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong>Telemetry Packet Uplinked:</strong> Transmission dispatched to Deep Space Network. Estimated flight surgeon reception at T+14m 12s. Autonomous non-doctor stabilization protocol active on board. Patient vitals logged to local mission memory.
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-[var(--panel-elevated)] hover:bg-[var(--border)] text-[var(--text)] font-mono text-xs font-semibold transition border border-[var(--border)] cursor-pointer"
                >
                  Complete Drill &amp; Return to Flight Deck
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
