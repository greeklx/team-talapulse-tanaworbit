import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import DemoSignIn from "./DemoSignIn";
import App from "./App";
import {
  accessRoles,
  biodata,
  cabinConditions,
  crew,
  latestRecord,
  mission,
  nutritionFor,
  orbitalConditions,
  trendCalculation,
} from "./data";
import { clearSession, readSession, writeSession, type DemoSession } from "./session";
import "./portals.css";

function useSession(): DemoSession | null {
  return readSession();
}

export function PortalHome() {
  const session = useSession();
  return (
    <main className="portal-home">
      <section className="portal-hero">
        <div className="portal-brand">
          <img src="/images/tanaworbit-mark.svg" alt="" />
          <span>
            TanawOrbit
            <small>TALA PULSE</small>
          </span>
        </div>
        <div>
          <span className="portal-kicker">EDUCATIONAL PROTOTYPE</span>
          <h1>Choose a door.</h1>
          <p>
            Astronauts enter the crew console. Admin and tester use the backend door to review the
            same synthetic datasets. Demo codes are public. They are not accounts.
          </p>
        </div>
        <p>
          {mission.name} · day {mission.day}. Fictional crew and measurements.
        </p>
      </section>
      <section className="portal-choices">
        <Link className="portal-card" to="/a-login">
          <span className="portal-kicker">/a-login</span>
          <strong>Astronaut</strong>
          <p>Public sample PIN. Opens /Astronaut for that fictional profile.</p>
        </Link>
        <Link className="portal-card" to="/b-login">
          <span className="portal-kicker">/b-login</span>
          <strong>Backend</strong>
          <p>Admin opens the console for any crew. Tester checks dataset accuracy on the API.</p>
        </Link>
        {session?.kind === "astronaut" && (
          <Link className="portal-card" to="/Astronaut">
            <span className="portal-kicker">CONTINUE</span>
            <strong>Return to the crew console</strong>
          </Link>
        )}
        {session?.kind === "backend" && (
          <Link className="portal-card" to={session.role === "admin" ? "/admin" : "/tester"}>
            <span className="portal-kicker">CONTINUE</span>
            <strong>Return to the {session.role} portal</strong>
          </Link>
        )}
      </section>
    </main>
  );
}

export function AstronautLogin() {
  const navigate = useNavigate();
  return (
    <>
      <DemoSignIn
        initialCrew={0}
        onEnter={(index) => {
          writeSession({ kind: "astronaut", crewId: crew[index].id });
          navigate("/Astronaut");
        }}
      />
    </>
  );
}

export function BackendLogin() {
  const navigate = useNavigate();
  const [roleId, setRoleId] = useState<(typeof accessRoles)[number]["id"]>("admin");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const role = accessRoles.find((item) => item.id === roleId) ?? accessRoles[0];

  useEffect(() => {
    if (code.length !== 4) return;
    if (code === role.demoCode) {
      const backendRole = role.id === "tester" ? "tester" : "admin";
      writeSession({ kind: "backend", role: backendRole });
      navigate(backendRole === "admin" ? "/admin" : "/tester");
      return;
    }
    setCode("");
    setError("That public demo code does not match this backend role.");
  }, [code, navigate, role.demoCode, role.id, role.portal]);

  function digit(value: string) {
    setError("");
    setCode((current) => (current + value).slice(0, 4));
  }

  return (
    <main className="demo-access">
      <section className="access-story">
        <div className="access-brand">
          <img src="/images/tanaworbit-mark.svg" alt="" />
          <span>
            TanawOrbit<small>BACKEND DOOR</small>
          </span>
        </div>
        <div className="access-story-copy">
          <span className="eyebrow">DATASET REVIEW</span>
          <h2>
            Admin or tester.
            <br />
            Same public fixtures.
          </h2>
          <p>This door does not create an account and does not store a health record.</p>
        </div>
        <div className="access-story-footer">
          <span>EDUCATIONAL CONCEPT</span>
          <Link to="/a-login">Astronaut door</Link>
        </div>
      </section>
      <section className="access-console" aria-labelledby="backend-title">
        <div className="access-heading">
          <span className="eyebrow">/b-login</span>
          <h1 id="backend-title">Backend demo access.</h1>
          <p>Pick a role, then enter its public four-digit code.</p>
        </div>
        <div className="role-switch" role="group" aria-label="Backend role">
          {accessRoles.map((item) => (
            <button
              key={item.id}
              type="button"
              className={item.id === role.id ? "secondary-button selected" : "secondary-button"}
              aria-pressed={item.id === role.id}
              onClick={() => {
                setRoleId(item.id);
                setCode("");
                setError("");
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
        <form className="access-pin-form" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="backend-code">
            <span>4-digit demo code</span>
            <small>Auto-continue when the four digits match</small>
          </label>
          <input
            id="backend-code"
            inputMode="numeric"
            autoComplete="off"
            maxLength={4}
            value={code}
            placeholder="••••"
            aria-invalid={Boolean(error)}
            onChange={(event) => {
              setError("");
              setCode(event.target.value.replace(/\D/g, "").slice(0, 4));
            }}
          />
          <div className="access-keypad" aria-label="Demo code keypad">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].map((value) => (
              <button key={value} type="button" onClick={() => digit(value)}>
                {value}
              </button>
            ))}
          </div>
          {error && (
            <p className="access-error" role="alert">
              {error}
            </p>
          )}
          <div className="access-demo-code">
            <span>
              Public code for {role.label}: <b>{role.demoCode}</b>
            </span>
            <button type="button" onClick={() => setCode(role.demoCode)}>
              Fill demo code
            </button>
          </div>
        </form>
        <div className="access-disclaimer">
          <p>
            <strong>Demo access, not secure authentication.</strong> The code only chooses which
            review page opens. Refreshing still clears console edits.
          </p>
        </div>
      </section>
    </main>
  );
}

function leave(login: "/a-login" | "/b-login", navigate: (path: string) => void) {
  clearSession();
  navigate(login);
}

export function AstronautPortal() {
  const session = useSession();
  const navigate = useNavigate();
  if (session && session.kind === "backend" && session.role !== "admin") return <Navigate to="/b-login" replace />;
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("crew");
  const savedCrew = typeof localStorage !== "undefined" ? localStorage.getItem("tanaworbit_crew_id") : null;
  const effectiveCrewId =
    session && session.kind === "astronaut"
      ? session.crewId
      : (requested && crew.some((p) => p.id === requested))
        ? requested
        : (savedCrew && crew.some((p) => p.id === savedCrew))
          ? savedCrew
          : crew[0].id;

  // Auto-establish astronaut demo session if not already set
  useEffect(() => {
    if (!session) {
      writeSession({ kind: "astronaut", crewId: effectiveCrewId });
    }
  }, [session, effectiveCrewId]);

  return (
    <App
      key={effectiveCrewId}
      crewId={effectiveCrewId}
      allowCrewSwitch={true}
      portal={session && session.kind === "backend" ? "admin" : "astronaut"}
      onSignOut={() => leave("/a-login", navigate)}
    />
  );
}

export function AdminPortal() {
  const session = useSession();
  const navigate = useNavigate();
  if (!session || session.kind !== "backend" || session.role !== "admin") {
    return <Navigate to="/b-login" replace />;
  }
  const cabin = cabinConditions[cabinConditions.length - 1];
  const orbit = orbitalConditions[orbitalConditions.length - 1];
  return (
    <main className="portal-page">
      <div className="portal-bar">
        <div>
          <span className="portal-kicker">/admin</span>
          <h1>Admin portal</h1>
        </div>
        <div className="portal-actions">
          <Link className="secondary-button" to="/tester">
            Dataset tester
          </Link>
          <button className="secondary-button" type="button" onClick={() => leave("/b-login", navigate)}>
            Sign out
          </button>
        </div>
      </div>
      <p className="portal-lead">
        Open any fictional crew in the console. Cabin, orbit, biodata, and today’s example intake
        are the same synthetic fixtures the tester checks. Nothing here is stored.
      </p>
      <div className="portal-grid">
        <article className="portal-card">
          <span className="portal-kicker">CABIN</span>
          <strong>
            {cabin.pressureKpa} kPa · {cabin.co2MmHg} mmHg CO₂
          </strong>
          <p>
            {cabin.temperatureC} °C · {cabin.humidityPercent}% humidity · day {cabin.missionDay}
          </p>
        </article>
        <article className="portal-card">
          <span className="portal-kicker">ORBIT</span>
          <strong>
            {orbit.altitudeKm} km · {orbit.lighting}
          </strong>
          <p>
            {orbit.velocityKms} km/s · eclipse {orbit.eclipseMinutes} min · day {orbit.missionDay}
          </p>
        </article>
      </div>
      <div className="portal-grid" style={{ marginTop: 14 }}>
        {crew.map((person) => {
          const body = biodata.find((row) => row.crewId === person.id);
          const intake = nutritionFor(person.id).find((row) => row.missionDay === mission.day);
          return (
            <article className="portal-card" key={person.id}>
              <span className="portal-kicker">{person.role}</span>
              <strong>{person.name}</strong>
              <p>
                {body ? `${body.statureCm} cm · ${body.massKg} kg · ${body.bloodTypeLabel}` : "No biodata"}
              </p>
              <p>{intake ? `${intake.kcal} kcal · ${intake.waterMl} mL water on day ${mission.day}` : "No intake row"}</p>
              <div className="portal-actions">
                <Link className="primary-button" to={`/Astronaut?crew=${person.id}`}>
                  Open console
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}

async function fetchApi(path: string): Promise<Response> {
  const bases = [
    import.meta.env.VITE_API_URL,
    "https://api.tanaw-orbit.app",
    "https://tanaworbit-api.robotics8051.workers.dev",
    "http://127.0.0.1:8787",
    "",
  ].filter(Boolean) as string[];
  let lastStatus = 0;
  for (const base of bases) {
    try {
      const response = await fetch(`${base}${path}`);
      if (response.ok || response.status === 422) return response;
      lastStatus = response.status;
    } catch {
      lastStatus = 0;
    }
  }
  throw new Error(lastStatus ? `API returned ${lastStatus}` : "API unreachable");
}

type VerifyBody = {
  ok: boolean;
  checks: { id: string; label: string; ok: boolean; detail: string }[];
  disclaimer?: string;
};

type TrendBody = {
  trend?: {
    baseline: { heart: number; systolic: number; diastolic: number; sleep: number; fatigue: number };
  };
};

export function TesterPortal() {
  const session = useSession();
  const sessionKey = session ? `${session.kind}:${session.kind === "backend" ? session.role : session.crewId}` : "";
  const navigate = useNavigate();
  const [report, setReport] = useState<VerifyBody | null>(null);
  const [compare, setCompare] = useState<string>("Waiting for the API.");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionKey.startsWith("backend:")) return;
    let cancelled = false;
    async function load() {
      try {
        const response = await fetchApi("/api/verify");
        const body = (await response.json()) as VerifyBody;
        const local = trendCalculation("crew-am", latestRecord("crew-am").reading);
        const trendResponse = await fetchApi("/api/trends?crewId=crew-am");
        const trendBody = (await trendResponse.json()) as TrendBody;
        const remote = trendBody.trend?.baseline;
        const matched =
          remote &&
          remote.heart === local.baseline.heart &&
          remote.systolic === local.baseline.systolic &&
          remote.diastolic === local.baseline.diastolic &&
          remote.sleep === local.baseline.sleep &&
          remote.fatigue === local.baseline.fatigue;
        if (!cancelled) {
          setReport(body);
          setCompare(
            matched
              ? `Alex Morgan’s 14-day means match. Heart ${local.baseline.heart} bpm.`
              : "The console mean and the API mean do not match.",
          );
          setError("");
        }
      } catch {
        if (!cancelled) {
          setError("The read-only API is not reachable. Start it with pnpm dev:api, then reload this page.");
        }
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [sessionKey]);

  if (!session || session.kind !== "backend") return <Navigate to="/b-login" replace />;

  return (
    <main className="portal-page">
      <div className="portal-bar">
        <div>
          <span className="portal-kicker">/tester</span>
          <h1>Dataset tester</h1>
        </div>
        <div className="portal-actions">
          {session.role === "admin" && (
            <Link className="secondary-button" to="/admin">
              Admin portal
            </Link>
          )}
          <button className="secondary-button" type="button" onClick={() => leave("/b-login", navigate)}>
            Sign out
          </button>
        </div>
      </div>
      <p className="portal-lead">
        This page asks the Worker to recheck the synthetic fixtures: counts, links, monitor bounds,
        and the 14-day mean. It does not write a record and it does not judge clinical accuracy.
      </p>
      {error && (
        <p className="access-error" role="alert">
          {error}
        </p>
      )}
      {report && (
        <section className="portal-card">
          <span className="portal-kicker">{report.ok ? "FIXTURES PASSED" : "FIXTURES NEED ATTENTION"}</span>
          <strong>{compare}</strong>
          {report.checks.map((item) => (
            <div className="portal-check" key={item.id}>
              <b className={item.ok ? "pass" : "fail"}>{item.ok ? "Pass" : "Fail"}</b>
              <div>
                <strong>{item.label}</strong>
                <p>{item.detail}</p>
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
