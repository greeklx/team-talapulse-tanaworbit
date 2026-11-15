import { useEffect } from "react";

export default function DemoPage() {
  useEffect(() => {
    document.title = "TanawOrbit Demo | Team Tala Pulse";
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100dvh",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        background: "#080d1a",
      }}
    >
      {/* 1 Floating Action Button to Launch Console in a new tab */}
      <a
        href="/Astronaut"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Launch TanawOrbit Astronaut Console in new tab"
        style={{
          position: "fixed",
          top: "16px",
          right: "16px",
          zIndex: 9999,
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 18px",
          borderRadius: "9999px",
          background: "rgba(11, 16, 25, 0.9)",
          color: "#ffffff",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          fontSize: "13px",
          fontWeight: 600,
          letterSpacing: "0.01em",
          textDecoration: "none",
          border: "1px solid rgba(56, 189, 248, 0.5)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.55), 0 0 16px rgba(56, 189, 248, 0.25)",
          transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#0284c7";
          e.currentTarget.style.borderColor = "#38bdf8";
          e.currentTarget.style.transform = "translateY(-1px) scale(1.02)";
          e.currentTarget.style.boxShadow =
            "0 10px 28px rgba(2, 132, 199, 0.45), 0 0 20px rgba(56, 189, 248, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(11, 16, 25, 0.9)";
          e.currentTarget.style.borderColor = "rgba(56, 189, 248, 0.5)";
          e.currentTarget.style.transform = "translateY(0) scale(1)";
          e.currentTarget.style.boxShadow =
            "0 8px 24px rgba(0, 0, 0, 0.55), 0 0 16px rgba(56, 189, 248, 0.25)";
        }}
      >
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#38bdf8",
            boxShadow: "0 0 8px #38bdf8",
          }}
        />
        <span>Launch Console</span>
        <span style={{ fontSize: "14px", fontWeight: 700, marginLeft: "2px" }}>↗</span>
      </a>

      {/* Full-Screen Edge-to-Edge Canva Presentation Embed */}
      <iframe
        title="TanawOrbit – NASA Space Apps 2026 demo (Team Tala Pulse)"
        loading="lazy"
        src="https://www.canva.com/design/DAHa8xQstYY/0dZ3tWzglTqGK7v1WPpGDA/view?embed"
        allowFullScreen
        allow="fullscreen; autoplay"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: "none",
          margin: 0,
          padding: 0,
        }}
      />
    </div>
  );
}
