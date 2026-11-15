import { useEffect, useRef, useState } from "react";
import { crew, crewStatus, latestRecord, mission, orbitalConditions } from "./data";
import { Clock } from "lucide-react";
import "./demo.css";

export default function DemoSignIn({
  initialCrew,
  onEnter,
}: {
  initialCrew: number;
  onEnter: (index: number) => void;
}) {
  const [selected, setSelected] = useState(initialCrew);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const [utcTime, setUtcTime] = useState("");
  const [orbitProgress, setOrbitProgress] = useState(0.42);
  const storedOrbit = orbitalConditions[orbitalConditions.length - 1];
  const inputRef = useRef<HTMLInputElement>(null);
  const person = crew[selected] || crew[0];

  // Live real-time spacecraft orbital trajectory animation & fluctuating telemetry
  useEffect(() => {
    let animId: number;
    let last = performance.now();

    function loop(now: number) {
      const delta = (now - last) / 1000;
      last = now;
      setOrbitProgress((prev) => (prev + delta * 0.031) % 1); // ~32s smooth revolution cycle
      animId = requestAnimationFrame(loop);
    }

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      setUtcTime(now.toUTCString().slice(17, 25) + " UTC");
    }
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });

    function handleKeyDown(e: KeyboardEvent) {
      if (checking) return;
      const target = e.target as HTMLElement | null;
      if (target && target.tagName === "INPUT" && target !== inputRef.current) return;
      if (target && (target.tagName === "TEXTAREA" || target.isContentEditable)) return;

      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        setError("");
        setPin((prev) => (prev.length < 4 ? prev + e.key : prev));
      } else if (e.key === "Backspace") {
        e.preventDefault();
        setError("");
        setPin((prev) => prev.slice(0, -1));
      } else if (e.key === "Escape" || e.key === "Delete") {
        e.preventDefault();
        setError("");
        setPin("");
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (pin.length === 4) {
          if (pin === person.demoPin) {
            onEnter(selected);
          } else {
            setError("That code does not match this person.");
            setPin("");
          }
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [checking, pin, person.demoPin, onEnter, selected]);

  useEffect(() => {
    if (pin.length !== 4) return;
    setChecking(true);
    const timer = window.setTimeout(() => {
      if (pin === person.demoPin) {
        onEnter(selected);
      } else {
        setChecking(false);
        setPin("");
        setError("That code does not match this person.");
        inputRef.current?.focus({ preventScroll: true });
      }
    }, 280);
    return () => window.clearTimeout(timer);
  }, [pin, selected, person.demoPin, onEnter]);

  function choose(index: number) {
    setSelected(index);
    setPin("");
    setError("");
    inputRef.current?.focus({ preventScroll: true });
  }

  function digit(value: string) {
    if (checking) return;
    setError("");
    setPin((current) => (current + value).slice(0, 4));
    inputRef.current?.focus({ preventScroll: true });
  }

  function openPage() {
    setChecking(true);
    window.setTimeout(() => onEnter(selected), 200);
  }

  function submitPin() {
    if (pin === person.demoPin) onEnter(selected);
    else {
      setError("That code does not match this person.");
      setPin("");
    }
  }

  return (
    <main className="demo-access">
      <section className="access-story">
        <div className="access-brand">
          <img src="/images/tanaworbit-mark.svg" alt="" />
          <div>
            <span>TanawOrbit</span>
            <small>Tala Pulse</small>
          </div>
        </div>

        <div className="access-story-copy">
          <p className="eyebrow">MISSION OPERATIONS · EXPEDITION VII</p>
          <h1>Human Spaceflight Telemetry Console</h1>
          <p>
            Operational physiological telemetry and in-flight health monitoring for Aster Expedition VII. Authenticate with assigned crew credentials to review longitudinal baselines and access autonomous countermeasures.
          </p>

          <div className="access-mission">
            <div className="access-mission-top">
              <strong>{mission.name}</strong>
              <span>
                Flight Day {mission.day} of {mission.durationDays}
              </span>
            </div>
            <div className="access-mission-facts">
              <div>
                <span>Orbital altitude</span>
                <strong>{storedOrbit.altitudeKm} km</strong>
              </div>
              <div>
                <span>Orbital speed</span>
                <strong>{storedOrbit.velocityKms} km/s</strong>
              </div>
              <div>
                <span>Station crew</span>
                <strong>{crew.length} active</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Self-contained Aerospace Orbital Tracking Viewport Card */}
        {(() => {
          // Precise quadratic bezier trajectory interpolation across framed viewport
          const s = 0.05 + 0.9 * orbitProgress;
          const u = 1 - s;
          const craftX = u * u * 10 + 2 * u * s * 240 + s * s * 470;
          const craftY = u * u * 125 + 2 * u * s * 35 + s * s * 95;
          const tagWidth = 142;
          const tagHeight = 32;
          const tagX = craftX < 320 ? craftX + 14 : craftX - (tagWidth + 14);
          const tagY = Math.max(12, Math.min(150, craftY - 36));

          return (
            <div className="access-orbital-vista" aria-hidden="true">
              <div className="vista-top-hud">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-[10px] tracking-wider font-bold text-emerald-400 uppercase">
                    ORBIT TRACK · LEO 51.6°
                  </span>
                </div>
                <span className="font-mono text-[10px] text-sky-300">
                  ALT: {storedOrbit.altitudeKm} KM · {storedOrbit.velocityKms} KM/S
                </span>
              </div>

              <div className="vista-horizon">
                <div className="vista-atmosphere-glow" />
              </div>

              <svg
                className="vista-orbit-svg"
                viewBox="0 0 480 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Orbital Trajectory Arc Glow */}
                <path
                  d="M 10 125 Q 240 35 470 95"
                  stroke="rgba(56, 189, 248, 0.22)"
                  strokeWidth="3.5"
                />

                {/* Orbital Trajectory Dashed Arc Track */}
                <path
                  d="M 10 125 Q 240 35 470 95"
                  stroke="rgba(56, 189, 248, 0.65)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />

                {/* Connecting telemetry line between moving spacecraft and callout HUD */}
                <line
                  x1={craftX.toFixed(1)}
                  y1={craftY.toFixed(1)}
                  x2={craftX < 320 ? tagX.toFixed(1) : (tagX + tagWidth).toFixed(1)}
                  y2={(tagY + 16).toFixed(1)}
                  stroke="rgba(56, 189, 248, 0.5)"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />

                {/* Moving Spacecraft Radar Ping Waves */}
                <circle
                  cx={craftX.toFixed(1)}
                  cy={craftY.toFixed(1)}
                  r="16"
                  stroke="rgba(56, 189, 248, 0.35)"
                  strokeWidth="1"
                  fill="none"
                />
                <circle
                  cx={craftX.toFixed(1)}
                  cy={craftY.toFixed(1)}
                  r="8"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  fill="rgba(8, 20, 42, 0.85)"
                />
                <circle
                  cx={craftX.toFixed(1)}
                  cy={craftY.toFixed(1)}
                  r="3.5"
                  fill="#38bdf8"
                />

                {/* Dynamic Telemetry HUD Tag (Follows craft with live telemetry) */}
                <g transform={`translate(${tagX.toFixed(1)}, ${tagY.toFixed(1)})`}>
                  <rect
                    x="0"
                    y="0"
                    width={tagWidth}
                    height={tagHeight}
                    rx="6"
                    className="vista-hud-rect"
                  />
                  <circle cx="12" cy="12" r="3" fill="#38bdf8" />
                  <text
                    x="20"
                    y="14"
                    className="vista-hud-title"
                  >
                    ORBIT · {storedOrbit.altitudeKm} KM
                  </text>
                  <text
                    x="20"
                    y="25"
                    className="vista-hud-sub"
                  >
                    {storedOrbit.velocityKms} KM/S · LEO 51.6°
                  </text>
                </g>
              </svg>

              <div className="vista-bottom-hud">
                <span className="text-[10px] font-mono text-slate-300">TDRS RELAY: CONTINUOUS (99.4%)</span>
                <span className="text-[10px] font-mono text-slate-400">TRACK: 13.8° N, 121.2° E</span>
              </div>
            </div>
          );
        })()}

        <p className="access-story-footer">Team Tala Pulse · Deep Space Habitat Telemetry Prototype</p>
      </section>

      <section className="access-console" aria-labelledby="access-title">
        <div className="access-console-top">
          <span>Flight Deck Operations</span>
          <span className="access-clock">
            <Clock size={14} aria-hidden="true" />
            {utcTime || "UTC"}
          </span>
        </div>

        <div className="access-heading">
          <h2 id="access-title">Select Crew Member</h2>
          <p>Choose your astronaut profile and enter your designated 4-digit mission PIN.</p>
        </div>

        <div className="access-crew-grid" role="group" aria-label="Expedition crew">
          {crew.map((member, index) => {
            const isSelected = selected === index;
            const status = crewStatus(index, latestRecord(member.id).reading);
            const statusLabel = status === "Attention" ? "Flagged" : status === "Observe" ? "Different" : "Usual";
            return (
              <button
                key={member.id}
                type="button"
                className={isSelected ? "selected" : undefined}
                aria-pressed={isSelected}
                disabled={checking}
                onClick={() => choose(index)}
              >
                <span className="access-avatar" style={{ backgroundColor: member.color || "#3d5344" }}>
                  {member.image ? <img src={member.image} alt="" /> : member.initials}
                </span>
                <span className="access-crew-copy">
                  <strong>{member.name}</strong>
                  <small>{member.role}</small>
                  <span className="access-crew-status">{statusLabel}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="access-demo-code">
          <span>
            Designated PIN
            <b>{person.demoPin}</b>
          </span>
          <button type="button" className="primary-button" onClick={openPage} disabled={checking}>
            {checking ? "Authenticating…" : "Authenticate & Enter Console"}
          </button>
        </div>

        <div className="access-pin-form">
          <label htmlFor="sample-code">
            Mission PIN Code
            <small>Keyboard or keypad</small>
          </label>
          <input
            id="sample-code"
            ref={inputRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            maxLength={4}
            value={pin}
            disabled={checking}
            onChange={(e) => {
              setError("");
              setPin(e.target.value.replace(/\D/g, "").slice(0, 4));
            }}
            className="sr-only"
            aria-label="Four-digit mission PIN"
          />
          <div className="access-pin-slots" onClick={() => inputRef.current?.focus({ preventScroll: true })}>
            {[0, 1, 2, 3].map((slot) => {
              const filled = Boolean(pin[slot]);
              const current = pin.length === slot;
              return (
                <span
                  key={slot}
                  className={`access-pin-slot${filled ? " is-filled" : ""}${current ? " is-current" : ""}`}
                  aria-hidden="true"
                >
                  {filled ? "•" : ""}
                </span>
              );
            })}
          </div>

          <div className="access-keypad">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "clear", "0", "enter"].map((key) => {
              if (key === "clear") {
                return (
                  <button
                    key={key}
                    type="button"
                    className="keypad-utility"
                    disabled={checking || !pin}
                    onClick={() => {
                      setPin("");
                      setError("");
                      inputRef.current?.focus({ preventScroll: true });
                    }}
                  >
                    Clear
                  </button>
                );
              }
              if (key === "enter") {
                return (
                  <button
                    key={key}
                    type="button"
                    className="keypad-utility"
                    disabled={checking || pin.length !== 4}
                    onClick={submitPin}
                  >
                    Enter
                  </button>
                );
              }
              return (
                <button key={key} type="button" disabled={checking} onClick={() => digit(key)}>
                  {key}
                </button>
              );
            })}
          </div>

          {error ? (
            <p className="access-error" role="alert">
              {error}
            </p>
          ) : (
            <p className="access-checking" aria-live="polite">
              {checking ? "Authenticating credentials…" : ""}
            </p>
          )}
        </div>

        <p className="access-disclaimer">
          Educational prototype for team Tala Pulse. Synthetic crew data. Not a medical device and not a NASA product.
        </p>
      </section>
    </main>
  );
}
