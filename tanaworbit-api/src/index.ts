import { Hono } from "hono";
import { cors } from "hono/cors";
import { isValidHeartRate,  isValidSleepDuration, isValidFatigue} from "./validation";

import { accuracyReport, judgeReading, trendFor } from "./accuracy";
import {
  DISCLAIMER,
  accessRoles,
  biodata,
  cabinConditions,
  crew,
  crewIdFrom,
  exerciseCatalog,
  exerciseRecords,
  faq,
  filterByCrew,
  healthRecords,
  mission,
  monitorParameters,
  monitoringRules,
  nutritionItems,
  nutritionRecords,
  orbitalConditions,
  toolkit,
} from "./fixtures";

const READ_ONLY = {
  error: "read_only",
  message:
    "TanawOrbit does not store check-ins or health records. This API only publishes synthetic fixtures.",
  disclaimer: DISCLAIMER,
};

const ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/(www\.)?tanaw-orbit\.app$/,
  /^https:\/\/tanaworbit-console\.robotics8051\.workers\.dev$/,
  /^http:\/\/localhost:\d+$/,
  /^http:\/\/127\.0.0\.1:\d+$/,
];

// In-memory sliding rate limiter (120 req/min per IP)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 120;

const app = new Hono<{ Bindings: Env }>();

app.use(
  "*",
  cors({
    origin: (origin) => {
      if (!origin) return "*";
      return ALLOWED_ORIGIN_PATTERNS.some((pattern) => pattern.test(origin)) ? origin : null;
    },
    allowMethods: ["GET", "HEAD", "OPTIONS"],
    maxAge: 86400,
  }),
);

// Security & Rate Limiting Middleware
app.use("*", async (c, next) => {
  if (!["GET", "HEAD", "OPTIONS"].includes(c.req.method)) {
    c.header("Allow", "GET, HEAD, OPTIONS");
    return c.json(READ_ONLY, 405);
  }

  // Rate Limiting
  const ip = c.req.header("cf-connecting-ip") || c.req.header("x-forwarded-for") || "unknown";
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
  } else {
    entry.count += 1;
    if (entry.count > MAX_REQUESTS_PER_WINDOW) {
      c.header("Retry-After", "60");
      return c.json(
        { error: "rate_limit_exceeded", message: "Too many requests. Please retry in 1 minute." },
        429,
      );
    }
  }

  // Periodic cleanup
  if (rateLimitMap.size > 2000) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (now > val.resetAt) rateLimitMap.delete(key);
    }
  }

  await next();

  // Defense-in-depth HTTP Security Headers
  c.header("X-Content-Type-Options", "nosniff");
  c.header("X-Frame-Options", "DENY");
  c.header("Referrer-Policy", "strict-origin-when-cross-origin");
  c.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  c.header("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  c.header("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'; base-uri 'none'");
  c.header("Cross-Origin-Resource-Policy", "cross-origin");
  c.header("Cross-Origin-Opener-Policy", "same-origin");
  c.header("X-Permitted-Cross-Domain-Policies", "none");
  c.header("X-TanawOrbit-Data", "synthetic");
  c.header("Cache-Control", "public, max-age=300");
});

app.onError((error, c) => {
  console.error(
    JSON.stringify({
      message: "request failed",
      method: c.req.method,
      path: c.req.path,
      error: error instanceof Error ? error.message : String(error),
    }),
  );
  return c.json({ error: "unavailable", disclaimer: DISCLAIMER }, 500);
});

function published<T>(body: T) {
  return { disclaimer: DISCLAIMER, synthetic: true, persistsCheckIns: false, ...body };
}

app.get("/health", (c) =>
  c.json({
    ok: true,
    service: "tanaworbit-api",
    environment: c.env.ENVIRONMENT,
    synthetic: true,
    medicalDevice: false,
    persistsCheckIns: false,
    disclaimer: DISCLAIMER,
  }),
);

app.get("/api", (c) =>
  c.json(
    published({
      resources: [
        "/health",
        "/api/mission",
        "/api/crew",
        "/api/health-records",
        "/api/exercise-records",
        "/api/exercise-catalog",
        "/api/monitoring-rules",
        "/api/monitor-parameters",
        "/api/biodata",
        "/api/cabin",
        "/api/orbital",
        "/api/nutrition",
        "/api/trends",
        "/api/evaluate",
        "/api/verify",
        "/api/access",
        "/api/toolkit",
        "/api/guide",
      ],
    }),
  ),
);

app.get("/api/mission", (c) => c.json(published({ mission })));
app.get("/api/crew", (c) => c.json(published({ records: crew })));
app.get("/api/exercise-catalog", (c) => c.json(published({ records: exerciseCatalog })));
app.get("/api/monitoring-rules", (c) => c.json(published({ rules: monitoringRules })));
app.get("/api/toolkit", (c) => c.json(published({ toolkit })));
app.get("/api/guide", (c) => c.json(published({ guide: faq })));

app.get("/api/health-records", (c) => {
  const crewId = crewIdFrom(new URL(c.req.url));
  return c.json(published({ crewId, records: filterByCrew(healthRecords, crewId) }));
});

app.get("/api/exercise-records", (c) => {
  const crewId = crewIdFrom(new URL(c.req.url));
  return c.json(published({ crewId, records: filterByCrew(exerciseRecords, crewId) }));
});

app.get("/api/biodata", (c) => {
  const crewId = crewIdFrom(new URL(c.req.url));
  return c.json(published({ crewId, records: filterByCrew(biodata, crewId) }));
});

app.get("/api/monitor-parameters", (c) => c.json(published({ records: monitorParameters })));
app.get("/api/cabin", (c) => c.json(published({ records: cabinConditions })));
app.get("/api/orbital", (c) => c.json(published({ records: orbitalConditions })));
app.get("/api/nutrition", (c) => {
  const crewId = crewIdFrom(new URL(c.req.url));
  return c.json(
    published({ crewId, items: nutritionItems, records: filterByCrew(nutritionRecords, crewId) }),
  );
});
app.get("/api/access", (c) =>
  c.json(
    published({
      roles: accessRoles,
      note: "These demo codes are public fixtures. They do not authenticate a person.",
    }),
  ),
);
app.get("/api/trends", (c) => {
  const crewId = crewIdFrom(new URL(c.req.url));
  if (!crewId) {
    return c.json(published({ trends: crew.map((person) => trendFor(person.id)) }));
  }
  const trend = trendFor(crewId);
  if (!trend) return c.json(published({ error: "unknown_crew", crewId }), 404);
  return c.json(published({ trend }));
});
app.get("/api/evaluate", (c) => {
  const url = new URL(c.req.url);
  const crewId = crewIdFrom(url);
  if (!crewId) {
    return c.json(
      published({
        error: "missing_crew",
        message: "Choose a crew id, then enter heart, systolic, diastolic, sleep, and fatigue.",
      }),
      400,
    );
  }
  const fields = ["heart", "systolic", "diastolic", "sleep", "fatigue"] as const;
  const reading = { heart: 0, systolic: 0, diastolic: 0, sleep: 0, fatigue: 0 };
  for (const field of fields) {
    const raw = url.searchParams.get(field);
    const value = raw === null ? Number.NaN : Number(raw);
    if (raw === null || raw.trim() === "" || !Number.isFinite(value)) {
      return c.json(
        published({
          error: "missing_input",
          field,
          message: "Enter a number for heart, systolic, diastolic, sleep, and fatigue.",
        }),
        400,
      );
    }

    if (field === "heart" && !isValidHeartRate(value)) {
      return c.json(
        published({
          error: "invalid_input",
          field,
          message: "Heart Rate Must be greater than zero.",
        }),
        400,
      );
    }

    if (field === "sleep" && !isValidSleepDuration(value)) {
      return c.json(
        published({
          error: "invalid_input",
          field,
          message: "Sleep Duration must be between 0 and 24 hours",
        }),
        400,
      );
    }
    

    if (field === "fatigue" && !isValidFatigue(value)) {
      return c.json(
        published({
          error: "invalid_input",
          field,
          message: "Fatigue score must be between 1 and 5.",
        }),
        400,
      );
    }

    reading[field] = value;
  }
  const judged = judgeReading(crewId, reading);
  if (!judged) return c.json(published({ error: "unknown_crew", crewId }), 404);
  return c.json(published({ evaluated: judged }));
});
app.get("/api/verify", (c) => {
  const report = accuracyReport();
  return c.json(published(report), report.ok ? 200 : 422);
});

app.notFound((c) => c.json({ error: "not_found", disclaimer: DISCLAIMER }, 404));

export default app;
