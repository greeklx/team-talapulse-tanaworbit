import { useEffect } from "react";
import type { CrewMember, Reading } from "./data";
import { biodataFor, cabinConditions, mission, observationFlags, rules } from "./data";

export default function TelemetryReportModal({
  crewMember,
  reading,
  baseline,
  onClose,
  onExportCsv,
}: {
  crewMember: CrewMember;
  reading: Reading;
  baseline: Reading;
  onClose: () => void;
  onExportCsv: () => void;
}) {
  const bio = biodataFor(crewMember.id);
  const latestCabin = cabinConditions[cabinConditions.length - 1];
  const flags = observationFlags(reading, baseline);

  function getStatus(isFlagged: boolean) {
    if (!isFlagged) {
      return {
        label: "USUAL",
        cls: "bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-400",
      };
    }
    if (crewMember.reviewRequested) {
      return {
        label: "FLAGGED",
        cls: "bg-rose-500/15 border-rose-500/30 text-rose-700 dark:text-rose-400 font-bold",
      };
    }
    return {
      label: "DIFFERENT",
      cls: "bg-amber-500/15 border-amber-500/30 text-amber-700 dark:text-amber-400 font-bold",
    };
  }

  // Keyboard shortcut listener: Escape closes modal
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function handlePrint() {
    window.print();
  }

  // Mean Arterial Pressure calculations
  const baselineMap = Math.round((2 * baseline.diastolic + baseline.systolic) / 3);
  const currentMap = Math.round((2 * reading.diastolic + reading.systolic) / 3);
  const mapDelta = currentMap - baselineMap;

  const hrDelta = Number((reading.heart - baseline.heart).toFixed(1));
  const sysDelta = Number((reading.systolic - baseline.systolic).toFixed(1));
  const diaDelta = Number((reading.diastolic - baseline.diastolic).toFixed(1));
  const sleepDelta = Number((reading.sleep - baseline.sleep).toFixed(1));
  const fatigueDelta = Number((reading.fatigue - baseline.fatigue).toFixed(1));

  const groundMass = bio.massKgGround ?? bio.massKg;
  const inflightMass = bio.massKgInflight ?? bio.massKg;
  const massDelta = Number((inflightMass - groundMass).toFixed(1));

  return (
    <div className="telemetry-dossier-overlay">
      <div className="telemetry-dossier-modal">
        {/* On-Screen Modal Controls Bar (Hidden in Print) */}
        <div className="dossier-controls print:hidden">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-sky-600 dark:text-sky-400">
                Synthetic Telemetry Dossier · Example Report
              </span>
              <span className="text-[11px] text-[var(--muted)] font-mono">
                FD {mission.day} · {crewMember.name} ({crewMember.id.toUpperCase()})
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="dossier-control-btn flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white border-sky-600"
              title="Print official report or save as PDF (Ctrl+P)"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Export PDF / Print</span>
            </button>
            <button
              type="button"
              onClick={onExportCsv}
              className="dossier-control-btn"
            >
              Export CSV
            </button>
            <button
              type="button"
              onClick={onClose}
              className="dossier-control-btn"
              aria-label="Close dossier"
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Printable Official Document Sheet */}
        <div className="printable-report">
          {/* Document Header */}
          <div className="report-header">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5 font-mono text-xs">
                  <span className="text-sky-600 dark:text-sky-400 font-bold tracking-widest uppercase">
                    TANAWORBIT
                  </span>
                  <span className="text-[var(--subtle)]">/</span>
                  <span className="text-[var(--muted)] tracking-wider uppercase font-medium">
                    TEAM TALA PULSE
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)] leading-tight">
                  STORED WEEKLY READINGS
                </h1>
                <p className="text-xs text-[var(--muted)] font-mono mt-1">
                  MISSION: {mission.name.toUpperCase()} · FLIGHT DAY {mission.day} OF {mission.durationDays} · MISSION ALTITUDE {mission.altitudeKm} KM · 51.6° INC
                </p>
              </div>

              {/* Status Badge & Metadata */}
              <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-2 shrink-0 font-mono">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold tracking-wider whitespace-nowrap">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  EXAMPLE ONLY
                </div>
                <div className="text-right text-[11px] text-[var(--muted)] space-y-0.5 whitespace-nowrap">
                  <div><span className="text-[var(--subtle)]">DOC ID:</span> WMR-2026-W4-0142</div>
                  <div><span className="text-[var(--subtle)]">DATE:</span> 2035-06-14 UTC</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Crew Member Demographics & Anthropometrics */}
          <section className="mb-6">
            <div className="report-section-heading">
              <h2>1. Crew Member Biodata &amp; Flight Profile</h2>
              <span className="text-[10px] font-mono text-[var(--subtle)]">VERIFIED ID: {crewMember.id.toUpperCase()}</span>
            </div>
            <div className="report-profile-grid">
              <div>
                <span className="text-[var(--muted)] block text-[10px] font-mono uppercase mb-0.5">Crew Member</span>
                <strong className="text-[var(--text)] text-sm font-semibold">{crewMember.name}</strong>
              </div>
              <div>
                <span className="text-[var(--muted)] block text-[10px] font-mono uppercase mb-0.5">Mission Role</span>
                <strong className="text-[var(--text)] font-medium">{crewMember.role}</strong>
              </div>
              <div>
                <span className="text-[var(--muted)] block text-[10px] font-mono uppercase mb-0.5">Age / Stature</span>
                <strong className="text-[var(--text)] font-mono">{bio.ageYears} yrs / {bio.statureCm} cm</strong>
              </div>
              <div>
                <span className="text-[var(--muted)] block text-[10px] font-mono uppercase mb-0.5">Body Mass (Ground → Inflight)</span>
                <strong className="text-emerald-600 dark:text-emerald-400 font-mono">
                  {groundMass} kg → {inflightMass} kg ({massDelta >= 0 ? `+${massDelta}` : massDelta} kg)
                </strong>
              </div>
            </div>
          </section>

          {/* Section 2: Physiological Telemetry Matrix */}
          <section className="mb-6">
            <div className="report-section-heading">
              <h2>2. Cardiovascular &amp; Physiological Telemetry</h2>
              <span className="text-[10px] font-mono text-[var(--subtle)]">DEMONSTRATION RANGES · FOR EDUCATIONAL REVIEW</span>
            </div>
            <div className="report-table-wrapper">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>BIOMARKER</th>
                    <th className="text-center">14-DAY BASELINE</th>
                    <th className="text-center text-sky-600 dark:text-sky-400">TODAY'S VALUE</th>
                    <th className="text-center">DELTA (vs AVG)</th>
                    <th className="text-center">STORED USUAL RANGE</th>
                    <th className="text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-xs">
                  <tr>
                    <td className="text-[var(--text)] font-sans font-medium">Resting Heart Rate</td>
                    <td className="text-center text-[var(--muted)]">{baseline.heart} bpm</td>
                    <td className="text-center text-sky-600 dark:text-sky-300 font-bold">{reading.heart} bpm</td>
                    <td className="text-center text-[var(--muted)]">
                      <span className={Math.abs(hrDelta) > rules.heartDifferenceBpm ? "text-amber-600 dark:text-amber-400 font-bold" : ""}>
                        {hrDelta >= 0 ? `+${hrDelta}` : hrDelta} bpm
                      </span>
                    </td>
                    <td className="text-center text-[var(--subtle)]">60–100 bpm</td>
                    <td className="text-right">
                      {(() => {
                        const s = getStatus(flags.heart);
                        return (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${s.cls}`}>
                            {s.label}
                          </span>
                        );
                      })()}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-[var(--text)] font-sans font-medium">Systolic Blood Pressure</td>
                    <td className="text-center text-[var(--muted)]">{baseline.systolic} mmHg</td>
                    <td className="text-center text-sky-600 dark:text-sky-300 font-bold">{reading.systolic} mmHg</td>
                    <td className="text-center text-[var(--muted)]">
                      {sysDelta >= 0 ? `+${sysDelta}` : sysDelta} mmHg
                    </td>
                    <td className="text-center text-[var(--subtle)]">90–120 mmHg</td>
                    <td className="text-right">
                      {(() => {
                        const s = getStatus(Math.abs(sysDelta) > rules.pressureDifferenceMmHg);
                        return (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${s.cls}`}>
                            {s.label}
                          </span>
                        );
                      })()}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-[var(--text)] font-sans font-medium">Diastolic Blood Pressure</td>
                    <td className="text-center text-[var(--muted)]">{baseline.diastolic} mmHg</td>
                    <td className="text-center text-sky-600 dark:text-sky-300 font-bold">{reading.diastolic} mmHg</td>
                    <td className="text-center text-[var(--muted)]">
                      {diaDelta >= 0 ? `+${diaDelta}` : diaDelta} mmHg
                    </td>
                    <td className="text-center text-[var(--subtle)]">60–80 mmHg</td>
                    <td className="text-right">
                      {(() => {
                        const s = getStatus(Math.abs(diaDelta) > rules.pressureDifferenceMmHg);
                        return (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${s.cls}`}>
                            {s.label}
                          </span>
                        );
                      })()}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-[var(--text)] font-sans font-medium">Mean Arterial Pressure (MAP)</td>
                    <td className="text-center text-[var(--muted)]">{baselineMap} mmHg</td>
                    <td className="text-center text-sky-600 dark:text-sky-300 font-bold">{currentMap} mmHg</td>
                    <td className="text-center text-[var(--muted)]">
                      {mapDelta >= 0 ? `+${mapDelta}` : mapDelta} mmHg
                    </td>
                    <td className="text-center text-[var(--subtle)]">70–105 mmHg</td>
                    <td className="text-right">
                      {(() => {
                        const s = getStatus(Math.abs(mapDelta) > 10);
                        return (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${s.cls}`}>
                            {s.label}
                          </span>
                        );
                      })()}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-[var(--text)] font-sans font-medium">Nightly Sleep Duration</td>
                    <td className="text-center text-[var(--muted)]">{baseline.sleep} hrs</td>
                    <td className="text-center text-sky-600 dark:text-sky-300 font-bold">{reading.sleep} hrs</td>
                    <td className="text-center text-[var(--muted)]">
                      {sleepDelta >= 0 ? `+${sleepDelta}` : sleepDelta} hrs
                    </td>
                    <td className="text-center text-[var(--subtle)]">7.0–9.0 hrs</td>
                    <td className="text-right">
                      {(() => {
                        const s = getStatus(flags.sleep);
                        return (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${s.cls}`}>
                            {s.label}
                          </span>
                        );
                      })()}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-[var(--text)] font-sans font-medium">Subjective Fatigue Score</td>
                    <td className="text-center text-[var(--muted)]">{baseline.fatigue} / 5</td>
                    <td className="text-center text-sky-600 dark:text-sky-300 font-bold">{reading.fatigue} / 5</td>
                    <td className="text-center text-[var(--muted)]">
                      {fatigueDelta >= 0 ? `+${fatigueDelta}` : fatigueDelta}
                    </td>
                    <td className="text-center text-[var(--subtle)]">&lt; 3.0 (Low Fatigue)</td>
                    <td className="text-right">
                      {(() => {
                        const s = getStatus(flags.fatigue);
                        return (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${s.cls}`}>
                            {s.label}
                          </span>
                        );
                      })()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3: Environmental Life Support Correlation */}
          <section className="mb-6">
            <div className="report-section-heading">
              <h2>3. Environmental Life Support Correlation (Cabin Air)</h2>
              <span className="text-[10px] font-mono text-[var(--subtle)]">SAMPLE DAY {latestCabin.missionDay}</span>
            </div>
            <div className="report-environmental-grid">
              <div>
                <span className="text-[var(--muted)] block text-[10px] uppercase mb-0.5">Cabin Total Pressure</span>
                <strong className="text-[var(--text)] text-sm font-semibold">{latestCabin.pressureKpa} kPa</strong>
                <small className="text-[var(--subtle)] block text-[10px] mt-0.5">14.65 psi (Nominal Sea-level)</small>
              </div>
              <div>
                <span className="text-[var(--muted)] block text-[10px] uppercase mb-0.5">CO₂ Partial Pressure</span>
                <strong className="text-[var(--text)] text-sm font-semibold">{latestCabin.co2MmHg} mmHg</strong>
                <small className="text-[var(--subtle)] block text-[10px] mt-0.5">Nominal limit &lt; 5.3 mmHg</small>
              </div>
              <div>
                <span className="text-[var(--muted)] block text-[10px] uppercase mb-0.5">Oxygen Concentration</span>
                <strong className="text-[var(--text)] text-sm font-semibold">{latestCabin.o2Percent}%</strong>
                <small className="text-[var(--subtle)] block text-[10px] mt-0.5">3.1 psi partial O₂</small>
              </div>
              <div>
                <span className="text-[var(--muted)] block text-[10px] uppercase mb-0.5">Temp &amp; Rel. Humidity</span>
                <strong className="text-[var(--text)] text-sm font-semibold">
                  {latestCabin.temperatureC} °C / {latestCabin.humidityPercent}% RH
                </strong>
                <small className="text-[var(--subtle)] block text-[10px] mt-0.5">Noise: {latestCabin.noiseDb} dB</small>
              </div>
            </div>
          </section>

          {/* Section 4: Mission Attestation & Archival Notice */}
          <div className="report-footer">
            <div className="max-w-md">
              <span className="text-[10px] text-[var(--subtle)] font-semibold uppercase tracking-wider block mb-1">
                Mission Attestation &amp; Synthetic Notice
              </span>
              <p className="text-[10px] text-[var(--muted)] leading-relaxed">
                TanawOrbit spaceflight health console. Prototype for Team Tala Pulse.
                Synthetic crew data. Not a medical device and not a NASA product.
              </p>
            </div>
            <div className="text-left sm:text-right sm:border-l sm:border-[var(--border)] sm:pl-6 shrink-0 w-full sm:w-auto">
              <span className="text-[10px] text-[var(--subtle)] uppercase tracking-wider block">Example status</span>
              <strong className="text-xs text-[var(--text)] block font-mono mt-0.5">
                SYNTHETIC CREW · NOT A SIGN-OFF
              </strong>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-mono mt-0.5">
                STORED EXAMPLE · DAY {mission.day}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
