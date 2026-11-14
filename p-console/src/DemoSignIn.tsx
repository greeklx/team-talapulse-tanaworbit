import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { crew, mission } from "./data";
import {
  ShieldCheck,
  KeyRound,
  UserCheck,
  Radio,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2,
  Lock,
  Activity,
  Orbit,
} from "lucide-react";
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
  const [showKeypad, setShowKeypad] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const person = crew[selected] || crew[0];

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      setUtcTime(
        now.toUTCString().slice(17, 25) + " UTC"
      );
    }
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (pin.length !== 4) return;
    setChecking(true);
    const timer = window.setTimeout(() => {
      if (pin === person.demoPin) {
        onEnter(selected);
      } else {
        setChecking(false);
        setPin("");
        setError("Security code mismatch. Try the designated mission PIN.");
        inputRef.current?.focus();
      }
    }, 280);
    return () => window.clearTimeout(timer);
  }, [pin, selected, person.demoPin, onEnter]);

  function choose(index: number) {
    setSelected(index);
    setPin("");
    setError("");
  }

  function digit(value: string) {
    if (checking) return;
    setError("");
    setPin((current) => (current + value).slice(0, 4));
  }

  function quickAuthorize() {
    setChecking(true);
    setTimeout(() => onEnter(selected), 200);
  }

  return (
    <main className="demo-access">
      {/* Left Aerospace Story & Mission Telemetry Hero */}
      <section className="access-story">
        <div className="access-brand">
          <img src="/images/tanaworbit-mark.svg" alt="TanawOrbit Mission Badge" />
          <div>
            <span className="text-xl font-bold tracking-tight text-white block">
              TanawOrbit
            </span>
            <small className="text-[10px] tracking-[0.25em] font-mono text-cyan-400 block -mt-0.5">
              TALA PULSE · HUMAN SPACEFLIGHT
            </small>
          </div>
        </div>

        <div className="access-story-copy">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-4">
            <Radio size={13} className="text-cyan-400 animate-pulse" />
            <span>DEEP-SPACE HEALTH OPERATIONS</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white leading-[1.15]">
            One crew.
            <br />
            <span className="text-cyan-300">A connected perspective.</span>
          </h1>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed mt-4 max-w-[420px]">
            Autonomous physiological telemetry, cabin environment life-support correlation,
            and individualized clinical countermeasures for long-duration human spaceflight.
          </p>

          <div className="access-mission mt-6 p-4 rounded-xl bg-slate-900/70 border border-slate-700/60 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-cyan-950/80 border border-cyan-500/30 grid place-items-center text-cyan-300">
                <Orbit size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                  <strong className="text-white text-sm font-semibold">{mission.name}</strong>
                  <span className="text-[11px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/50 border border-cyan-800/40">
                    FD {mission.day} / {mission.durationDays}
                  </span>
                </div>
                <span className="block text-xs text-slate-400 mt-1">
                  Low-Earth Orbit Expedition · All 5 Crew Telemetry Channels Active
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="access-earth" />

        <div className="access-story-footer">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>TEAM TALA PULSE · NASA SPACE APPS 2026</span>
            <Link
              to="/b-login"
              className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 flex items-center gap-1"
            >
              Backend Review Door <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* Right Flight Deck Authentication Terminal */}
      <section className="access-console" aria-labelledby="access-title">
        <div className="access-console-top flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono tracking-wider text-slate-300 font-medium">
              SIMULATION GATEWAY · ACTIVE
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-cyan-400">
            <Clock size={13} />
            <span>{utcTime || "UTC TIME"}</span>
          </div>
        </div>

        <div className="access-heading">
          <div className="text-[11px] uppercase tracking-wider font-mono text-cyan-400 font-semibold mb-1">
            CREW AUTHENTICATION CONSOLE
          </div>
          <h2 id="access-title" className="text-2xl font-semibold text-white tracking-tight">
            Flight Deck Terminal
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Select your astronaut profile, then click Authorize or enter your 4-digit mission PIN.
          </p>
        </div>

        {/* 5 Real Crew Cards */}
        <div className="access-crew-grid mt-5" role="group" aria-label="Flight crew roster">
          {crew.map((member, index) => {
            const isSelected = selected === index;
            return (
              <button
                key={member.id}
                type="button"
                className={`relative p-3.5 rounded-xl border text-left transition flex items-center gap-3 cursor-pointer ${
                  isSelected
                    ? "bg-slate-800/90 border-cyan-400/80 shadow-[0_0_20px_rgba(34,211,238,0.15)] ring-1 ring-cyan-400/40"
                    : "bg-slate-900/60 border-slate-800 hover:bg-slate-800/50 hover:border-slate-700"
                }`}
                aria-pressed={isSelected}
                disabled={checking}
                onClick={() => choose(index)}
              >
                <div
                  className="size-10 rounded-full grid place-items-center font-bold text-xs text-white shrink-0 shadow-inner"
                  style={{ backgroundColor: member.color || "#0284c7" }}
                >
                  {member.image ? (
                    <img
                      src={member.image}
                      alt=""
                      className="size-full rounded-full object-cover"
                    />
                  ) : (
                    member.initials
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <strong className="text-xs font-semibold text-slate-100 truncate block">
                      {member.name}
                    </strong>
                    {isSelected && (
                      <CheckCircle2 size={15} className="text-cyan-400 shrink-0" />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 line-clamp-1 block mt-0.5">
                    {member.role}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-mono text-cyan-300/90 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/30">
                      PIN: {member.demoPin}
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-emerald-400" />
                      CLEARED
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Astronaut Clearance & Auth Box */}
        <div className="mt-6 p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[10px] font-mono text-slate-400 block uppercase">
                Ready for Station Clearance
              </span>
              <strong className="text-sm font-semibold text-white">
                {person.name}
              </strong>
            </div>

            <button
              type="button"
              onClick={quickAuthorize}
              disabled={checking}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs shadow-lg shadow-cyan-950/50 transition active:scale-[0.98] border border-cyan-400/30 cursor-pointer"
            >
              <ShieldCheck size={16} />
              <span>{checking ? "Authorizing..." : "1-Click Flight Authorize"}</span>
            </button>
          </div>

          {/* Interactive PIN Verification Area */}
          <div className="border-t border-slate-800/80 pt-3">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-400 flex items-center gap-1.5">
                <KeyRound size={13} className="text-cyan-400" />
                Manual PIN Verification (Assigned: <code className="text-cyan-300 font-mono font-bold">{person.demoPin}</code>)
              </span>
              <button
                type="button"
                onClick={() => setShowKeypad((v) => !v)}
                className="text-cyan-400 hover:text-cyan-300 text-[11px] underline underline-offset-2 cursor-pointer"
              >
                {showKeypad ? "Hide keypad" : "Show numeric keypad"}
              </button>
            </div>

            {/* Discrete 4-digit code slots */}
            <div className="flex items-center gap-3 justify-center my-3">
              {[0, 1, 2, 3].map((slot) => {
                const char = pin[slot];
                return (
                  <div
                    key={slot}
                    className={`size-12 rounded-lg border text-lg font-mono font-bold grid place-items-center transition ${
                      char
                        ? "border-cyan-400 bg-cyan-950/40 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.2)]"
                        : "border-slate-700 bg-slate-950/60 text-slate-500"
                    }`}
                  >
                    {char ? "•" : ""}
                  </div>
                );
              })}
            </div>

            {/* Optional Touch/Click Numeric Keypad */}
            {showKeypad && (
              <div className="grid grid-cols-3 gap-2 max-w-[260px] mx-auto mt-3">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((n) => (
                  <button
                    key={n}
                    type="button"
                    disabled={checking}
                    onClick={() => digit(n)}
                    className="h-10 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-sm font-mono font-medium text-slate-200 transition active:scale-95 cursor-pointer"
                  >
                    {n}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={checking || !pin}
                  onClick={() => setPin("")}
                  className="h-10 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-400 transition cursor-pointer"
                >
                  Clear
                </button>
                <button
                  type="button"
                  disabled={checking}
                  onClick={() => digit("0")}
                  className="h-10 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-sm font-mono font-medium text-slate-200 transition active:scale-95 cursor-pointer"
                >
                  0
                </button>
                <button
                  type="button"
                  disabled={checking || pin.length !== 4}
                  onClick={() => {
                    if (pin === person.demoPin) onEnter(selected);
                    else setError("Invalid code. Please try again.");
                  }}
                  className="h-10 rounded-lg bg-cyan-900/60 hover:bg-cyan-800/70 border border-cyan-700/50 text-xs font-mono text-cyan-200 transition cursor-pointer"
                >
                  Enter
                </button>
              </div>
            )}

            {error && (
              <p className="text-rose-400 text-xs text-center mt-2 font-medium" role="alert">
                {error}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-[11px] text-slate-500">
            Educational spaceflight simulation · Check-ins stay in local memory · Not a clinical medical device
          </p>
        </div>
      </section>
    </main>
  );
}
