import { useState } from "react";
import { Orbit, LineChart, Activity, Gauge, ArrowRight, ArrowLeft, Check, X } from "lucide-react";

export default function OnboardingModal({
  isOpen = true,
  onClose,
}: {
  isOpen?: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState(1);
  if (!isOpen) return null;

  function next() {
    if (step < 4) setStep(step + 1);
    else onClose();
  }

  function prev() {
    if (step > 1) setStep(step - 1);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl p-6 md:p-8 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl text-slate-100">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          aria-label="Close tour"
        >
          <X size={18} />
        </button>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
            ORIENTATION TOUR · STEP {step} OF 4
          </span>
        </div>

        {/* Step 1: Real Crew Profiles */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Orbit size={24} />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Meet the Crew & Mission Profiles</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              TanawOrbit monitors <strong>5 real Tala Pulse astronauts</strong> (Ella, Abrey, Hannah, Gary, Greek)
              on Aster Expedition VII. Each crew member has calibrated preflight and in-flight anthropometrics
              derived from NIH aerospace studies (PMC10973451).
            </p>
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-xs text-slate-400">
              Switch crew anytime from the top bar or sidebar to inspect individualized baseline shifts.
            </div>
          </div>
        )}

        {/* Step 2: Longitudinal Telemetry */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <LineChart size={24} />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">30-Day Physiological Baselines</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Instead of static snapshots, TanawOrbit benchmarks telemetry against a <strong>14-day rolling mean</strong>.
              Clinical alerts trigger only when measurements diverge significantly from a crew member's personal norm.
            </p>
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-xs text-slate-400 space-y-1">
              <div>• <strong>Heart Rate:</strong> ±15 bpm shift from personal 14-day baseline.</div>
              <div>• <strong>Blood Pressure:</strong> ±15 mmHg systolic or diastolic shift.</div>
              <div>• <strong>Circadian Fatigue:</strong> Sleep &lt;1.5 hrs or fatigue score jumps &gt;1.5 pts.</div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Activity size={24} />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Interactive Symptom & Fine Motor Testing</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Use the <strong>Anatomical Visualizer</strong> to click localized body regions (Cranial fluid shift,
              SANS ocular blur, vestibular nausea, spinal elongation backache) and immediately receive
              NASA-backed countermeasure protocols.
            </p>
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-xs text-slate-400">
              Run the <strong>NASA Fine Motor Skills Test Battery</strong> (Target-Tapping & Visual Reaction Time)
              to track sensorimotor recovery following microgravity adaptation.
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Gauge size={24} />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">ECLSS & PUMA Metabolic Integration</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Health does not happen in a vacuum. TanawOrbit cross-correlates crew symptoms with
              <strong> Cabin Life Support</strong> (14.7 psi, 3.1 psi O₂, 5.3 mmHg CO₂) and NASA's
              <strong> PUMA gas analyzer</strong> (VO₂, VCO₂, Respiratory Exchange Ratio).
            </p>
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-xs text-slate-400">
              Generate an official, printable <strong>Weekly Medical Telemetry Dossier (PDF)</strong> with a single click
              for ground flight surgeons or emergency telemedicine reviews.
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4 mt-6">
          <button
            type="button"
            onClick={prev}
            disabled={step === 1}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold rounded text-slate-300 transition cursor-pointer"
          >
            <ArrowLeft size={14} />
            Previous
          </button>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  step === i ? "bg-cyan-400 w-5" : "bg-slate-700"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={next}
            className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold rounded text-white shadow-md transition cursor-pointer"
          >
            <span>{step === 4 ? "Enter Console" : "Next"}</span>
            {step === 4 ? <Check size={14} /> : <ArrowRight size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}
