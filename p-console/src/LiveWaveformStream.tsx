import { useEffect, useRef, useState } from "react";
import { Heart, Activity, Wind } from "lucide-react";
import Term from "./Term";

export type WaveformProps = {
  heartRate: number;
  spo2: number;
  respiration: number;
};

// Educational insights for astronauts and users who need explanations of metrics
const METRIC_INSIGHTS = {
  heartRate: {
    title: "Heart rate",
    layman: "How fast your heart is beating",
    unit: "bpm",
    normal: "60 – 100 bpm (Resting)",
    whatItMeans:
      "Measures the electrical pacing of your cardiac cycle (P-wave atrial contraction, QRS ventricular pump, and T-wave repolarization).",
    spaceSignificance:
      "In microgravity, blood and fluids shift from your legs into your upper chest and head (cephalad fluid shift). Your heart initially pumps more blood per beat, so resting pulse can fluctuate or drop as the cardiovascular system adapts to zero gravity.",
  },
  spo2: {
    title: "Blood oxygen",
    layman: "How much oxygen your blood is carrying",
    unit: "%",
    normal: "Often near 95–100% at rest",
    whatItMeans:
      "The percentage of hemoglobin proteins in your red blood cells currently carrying oxygen molecules to your brain and vital organs.",
    spaceSignificance:
      "Less oxygen in the cabin air can lower this number.",
  },
  respiration: {
    title: "Breathing",
    layman: "How many breaths you take in a minute",
    unit: "breaths/min",
    normal: "12 – 20 breaths/min (Resting)",
    whatItMeans:
      "The number of complete inhalation and exhalation breath cycles per minute.",
    spaceSignificance:
      "Exhaled CO₂ has no buoyancy in zero-G; without gravity it doesn't rise. If you are working in an unventilated spacecraft corner, your own exhaled CO₂ pools in front of your mouth, triggering rapid breathing, headache, and flushing.",
  },
};

export default function LiveWaveformStream({
  heartRate,
  spo2,
  respiration,
}: WaveformProps) {
  const [phase, setPhase] = useState(0);
  const [activeInfo, setActiveInfo] = useState<string | null>(null);
  const animFrame = useRef<number | null>(null);

  // Smooth continuous oscilloscope sweep animation
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const delta = currentTime - lastTime;
      lastTime = currentTime;
      // Increment phase based on elapsed time (smooth ~45 px/sec)
      setPhase((p) => (p + (delta * 0.055)) % 290);
      animFrame.current = requestAnimationFrame(loop);
    };

    animFrame.current = requestAnimationFrame(loop);
    return () => {
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, []);

  // Generate dynamic wave paths shifted by the moving phase
  const pxPerSec = 55;
  const safeHeart = Math.max(35, Math.min(220, Number(heartRate) || 70));
  const safeBreath = Math.max(6, Math.min(40, Number(respiration) || 15));
  const beatPx = (pxPerSec * 60) / safeHeart;
  const breathPx = (pxPerSec * 60) / safeBreath;

  function generateEcgPath(width: number, height: number, offset: number) {
    const points: string[] = [];
    const baseline = height / 2;
    const beatInterval = beatPx;

    for (let x = 0; x <= width; x += 3) {
      const cycleX = (((x + offset) % beatInterval) / beatInterval) * 48;
      let y = baseline;

      // P wave
      if (cycleX > 10 && cycleX <= 18) {
        y = baseline - 4 * Math.sin(((cycleX - 10) / 8) * Math.PI);
      }
      // Q dip
      else if (cycleX > 20 && cycleX <= 22) {
        y = baseline + 3;
      }
      // R spike
      else if (cycleX > 22 && cycleX <= 26) {
        y = baseline - (height * 0.42);
      }
      // S plunge
      else if (cycleX > 26 && cycleX <= 29) {
        y = baseline + (height * 0.35);
      }
      // T wave
      else if (cycleX > 32 && cycleX <= 42) {
        y = baseline - 7 * Math.sin(((cycleX - 32) / 10) * Math.PI);
      }

      points.push(`${x},${y.toFixed(1)}`);
    }

    return points.join(" ");
  }

  function generatePlethPath(width: number, height: number, offset: number) {
    const points: string[] = [];
    const cycleLength = beatPx;

    for (let x = 0; x <= width; x += 4) {
      const cycleX = (((x + offset) % cycleLength) / cycleLength) * 55;
      let y = height * 0.7;

      if (cycleX < 18) {
        // Systolic upstroke & peak
        y = height * 0.7 - (height * 0.55) * Math.sin((cycleX / 18) * (Math.PI / 2));
      } else if (cycleX < 28) {
        // Dicrotic notch descent
        y = height * 0.15 + (height * 0.28) * ((cycleX - 18) / 10);
      } else if (cycleX < 36) {
        // Dicrotic wave rebound
        y = height * 0.43 - 5 * Math.sin(((cycleX - 28) / 8) * Math.PI);
      } else {
        // Diastolic runoff
        y = height * 0.43 + (height * 0.27) * ((cycleX - 36) / (cycleLength - 36));
      }

      points.push(`${x},${y.toFixed(1)}`);
    }

    return points.join(" ");
  }

  function generateRespPath(width: number, height: number, offset: number) {
    const points: string[] = [];
    const baseline = height / 2;

    for (let x = 0; x <= width; x += 4) {
      // Gentle sine curve with smooth breathing rhythm
      const y = baseline + (height * 0.38) * Math.sin(((x + offset) / breathPx) * Math.PI * 2);
      points.push(`${x},${y.toFixed(1)}`);
    }

    return points.join(" ");
  }

  const sweepX = (phase * 1.5) % 290;

  return (
    <div className="quiet-card panel live-waveform-terminal">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--border)] pb-3 mb-4 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold tracking-tight">Heart, oxygen, and breathing</h3>
          </div>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Today's stored heart rate, blood oxygen, and breathing. The lines follow those numbers.
          </p>
        </div>
      </div>

      {/* 3 Live Interactive Waveform Traces */}
      <div className="space-y-3">
        {/* 1. Heart Rate ECG Waveform */}
        <div
          onClick={() => setActiveInfo(activeInfo === "heartRate" ? null : "heartRate")}
          className={`p-3.5 rounded-xl border relative overflow-hidden group cursor-pointer transition ${
            activeInfo === "heartRate"
              ? "bg-emerald-50/50 dark:bg-slate-900 border-emerald-500 shadow-md ring-2 ring-emerald-500/20"
              : "bg-slate-50 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <Heart size={15} className="text-emerald-500 dark:text-emerald-400" />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                <Term>Heart rate</Term>
              </span>
            </div>
            <div className="flex items-baseline gap-1 font-mono">
              <strong className="text-lg font-bold text-emerald-600 dark:text-emerald-300 tabular-nums">
                {heartRate}
              </strong>
              <small className="text-xs text-slate-500 dark:text-slate-400">bpm</small>
            </div>
          </div>

          {/* SVG Waveform Canvas */}
          <div className="relative h-12 w-full overflow-hidden">
            {/* Background Oscilloscope Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#33415515_1px,transparent_1px),linear-gradient(to_bottom,#33415515_1px,transparent_1px)] bg-[size:16px_16px]" />

            <svg
              viewBox="0 0 290 50"
              preserveAspectRatio="none"
              className="w-full h-full relative z-10 text-emerald-400"
            >
              <polyline
                points={generateEcgPath(290, 50, phase)}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                vectorEffect="non-scaling-stroke"
              />
              {/* Sweeping cursor bar */}
              <line
                x1={sweepX}
                y1="0"
                x2={sweepX}
                y2="50"
                stroke="#34d399"
                strokeWidth="2"
                opacity="0.8"
              />
            </svg>
          </div>

          {/* Collapsible Explanatory Insight */}
          {activeInfo === "heartRate" && (
            <div className="mt-2.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-300 leading-relaxed animate-fade-in">
              <div className="flex items-center justify-between text-emerald-700 dark:text-cyan-300 font-semibold mb-1">
                <span>{METRIC_INSIGHTS.heartRate.layman}</span>
                <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                  Often: {METRIC_INSIGHTS.heartRate.normal}
                </span>
              </div>
              <p className="mb-1.5">{METRIC_INSIGHTS.heartRate.whatItMeans}</p>
              <div className="p-2 rounded bg-emerald-50 dark:bg-cyan-950/40 border border-emerald-200 dark:border-cyan-800/40 text-[11px] text-emerald-800 dark:text-cyan-200">
                <strong>On a long mission: </strong> {METRIC_INSIGHTS.heartRate.spaceSignificance}
              </div>
            </div>
          )}
        </div>

        {/* 2. SpO2 Plethysmograph Waveform */}
        <div
          onClick={() => setActiveInfo(activeInfo === "spo2" ? null : "spo2")}
          className={`p-3.5 rounded-xl border relative overflow-hidden group cursor-pointer transition ${
            activeInfo === "spo2"
              ? "bg-sky-50/50 dark:bg-slate-900 border-cyan-500 shadow-md ring-2 ring-cyan-500/20"
              : "bg-slate-50 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <Activity size={15} className="text-cyan-500 dark:text-cyan-400" />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                <Term>Blood oxygen</Term>
              </span>
            </div>
            <div className="flex items-baseline gap-1 font-mono">
              <strong className="text-lg font-bold text-cyan-600 dark:text-cyan-300 tabular-nums">
                {spo2}
              </strong>
              <small className="text-xs text-slate-500 dark:text-slate-400">% SpO₂</small>
            </div>
          </div>

          <div className="relative h-12 w-full overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#33415515_1px,transparent_1px),linear-gradient(to_bottom,#33415515_1px,transparent_1px)] bg-[size:16px_16px]" />
            <svg
              viewBox="0 0 290 50"
              preserveAspectRatio="none"
              className="w-full h-full relative z-10 text-cyan-400"
            >
              <polyline
                points={generatePlethPath(290, 50, phase)}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                vectorEffect="non-scaling-stroke"
              />
              <line
                x1={sweepX}
                y1="0"
                x2={sweepX}
                y2="50"
                stroke="#38bdf8"
                strokeWidth="2"
                opacity="0.8"
              />
            </svg>
          </div>

          {activeInfo === "spo2" && (
            <div className="mt-2.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-300 leading-relaxed animate-fade-in">
              <div className="flex items-center justify-between text-cyan-700 dark:text-cyan-300 font-semibold mb-1">
                <span>{METRIC_INSIGHTS.spo2.layman}</span>
                <span className="font-mono text-[11px] text-cyan-600 dark:text-cyan-400">
                  Often: {METRIC_INSIGHTS.spo2.normal}
                </span>
              </div>
              <p className="mb-1.5">{METRIC_INSIGHTS.spo2.whatItMeans}</p>
              <div className="p-2 rounded bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/40 text-[11px] text-cyan-800 dark:text-cyan-200">
                <strong>On a long mission: </strong> {METRIC_INSIGHTS.spo2.spaceSignificance}
              </div>
            </div>
          )}
        </div>

        {/* 3. Respiration Waveform */}
        <div
          onClick={() => setActiveInfo(activeInfo === "respiration" ? null : "respiration")}
          className={`p-3.5 rounded-xl border relative overflow-hidden group cursor-pointer transition ${
            activeInfo === "respiration"
              ? "bg-purple-50/50 dark:bg-slate-900 border-purple-500 shadow-md ring-2 ring-purple-500/20"
              : "bg-slate-50 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <Wind size={15} className="text-purple-500 dark:text-purple-400" />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                <Term>Breathing</Term>
              </span>
            </div>
            <div className="flex items-baseline gap-1 font-mono">
              <strong className="text-lg font-bold text-purple-600 dark:text-purple-300 tabular-nums">
                {respiration}
              </strong>
              <small className="text-xs text-slate-500 dark:text-slate-400">breaths/min</small>
            </div>
          </div>

          <div className="relative h-12 w-full overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#33415515_1px,transparent_1px),linear-gradient(to_bottom,#33415515_1px,transparent_1px)] bg-[size:16px_16px]" />
            <svg
              viewBox="0 0 290 50"
              preserveAspectRatio="none"
              className="w-full h-full relative z-10 text-purple-400"
            >
              <polyline
                points={generateRespPath(290, 50, phase)}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                vectorEffect="non-scaling-stroke"
              />
              <line
                x1={sweepX}
                y1="0"
                x2={sweepX}
                y2="50"
                stroke="#c084fc"
                strokeWidth="2"
                opacity="0.8"
              />
            </svg>
          </div>

          {activeInfo === "respiration" && (
            <div className="mt-2.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-300 leading-relaxed animate-fade-in">
              <div className="flex items-center justify-between text-purple-700 dark:text-purple-300 font-semibold mb-1">
                <span>{METRIC_INSIGHTS.respiration.layman}</span>
                <span className="font-mono text-[11px] text-purple-600 dark:text-purple-400">
                  Often: {METRIC_INSIGHTS.respiration.normal}
                </span>
              </div>
              <p className="mb-1.5">{METRIC_INSIGHTS.respiration.whatItMeans}</p>
              <div className="p-2 rounded bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40 text-[11px] text-purple-800 dark:text-purple-200">
                <strong>On a long mission: </strong> {METRIC_INSIGHTS.respiration.spaceSignificance}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
