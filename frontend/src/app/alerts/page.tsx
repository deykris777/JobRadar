"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Bell, CheckCircle2, AlertCircle, Mail, Briefcase, MapPin, Zap, Trash2 } from "lucide-react";
import { createAlert } from "@/lib/api";

const ROLES = [
  { label: "All Roles", value: "all" },
  { label: "Fullstack", value: "fullstack" },
  { label: "Frontend", value: "frontend" },
  { label: "Backend", value: "backend" },
  { label: "Mobile", value: "mobile" },
  { label: "Design", value: "ui-ux" },
];

const HOW_IT_WORKS = [
  { icon: "🔍", title: "We scrape daily", desc: "Our bots check Internshala, Wellfound & more every 24 hours for new openings." },
  { icon: "🎯", title: "We filter for you", desc: "Only jobs matching your role and location filter hit your inbox." },
  { icon: "📬", title: "You get notified", desc: "A clean email digest — no spam, no fluff. Unsubscribe in one click." },
];

export default function AlertsPage() {
  const [email, setEmail]       = useState("");
  const [role, setRole]         = useState("all");
  const [location, setLocation] = useState("");
  const [status, setStatus]     = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage]   = useState("");

  // Unsubscribe flow
  const [unsubEmail, setUnsubEmail]   = useState("");
  const [unsubStatus, setUnsubStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      await createAlert({ email, role, location: location || "any" });
      setStatus("success");
      setMessage("You're all set! We'll email you when new matching jobs are found.");
      setEmail("");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unsubEmail) return;
    setUnsubStatus("loading");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/alerts/unsubscribe`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: unsubEmail }),
        }
      );
      if (!res.ok) throw new Error("Not found");
      setUnsubStatus("done");
      setUnsubEmail("");
    } catch {
      setUnsubStatus("error");
    }
  };

  return (
    <main className="min-h-screen noise-bg">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-12 md:py-20">

        {/* ── Hero ──────────────────────────────────────────────── */}
        <div className="animate-in text-center mb-16">
          <div
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "4px 14px", borderRadius: 9999,
              background: "var(--accent-dim)", border: "1px solid var(--accent-glow)",
              marginBottom: 18,
            }}
          >
            <Zap size={12} color="var(--accent)" />
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Free · No Spam
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(32px, 6vw, 56px)", fontWeight: 900,
              color: "var(--fg)", letterSpacing: "-0.03em", lineHeight: 1.05,
              marginBottom: 16,
            }}
          >
            Never miss a great<br />
            <span style={{ color: "var(--primary)" }}>opportunity again</span>
          </h1>
          <p style={{ fontSize: 17, color: "var(--fg-muted)", maxWidth: 500, margin: "0 auto" }}>
            Get a daily digest of dev jobs matching your preferences — delivered straight to your inbox.
          </p>
        </div>

        {/* ── How it works ─────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
            marginBottom: 40,
          }}
        >
          {HOW_IT_WORKS.map((step) => (
            <div
              key={step.title}
              className="glass animate-in"
              style={{ borderRadius: 20, padding: "24px 20px", textAlign: "center" }}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>{step.icon}</div>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: "var(--fg)", marginBottom: 6 }}>{step.title}</h3>
              <p style={{ fontSize: 12, color: "var(--fg-muted)", lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>

        {/* ── Form card ────────────────────────────────────────── */}
        <div
          className="glass animate-in"
          style={{ borderRadius: 28, padding: "40px 36px", maxWidth: 600, margin: "0 auto 40px", position: "relative", overflow: "hidden" }}
        >
          <div
            style={{
              position: "absolute", top: -60, right: -60,
              width: 200, height: 200, borderRadius: "50%",
              background: "var(--primary)", filter: "blur(120px)", opacity: 0.15,
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                width: 52, height: 52, borderRadius: 14,
                background: "var(--primary)",
                boxShadow: "0 8px 24px rgba(59,130,246,0.35)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <Bell size={24} color="#fff" />
            </div>

            <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--fg)", marginBottom: 6 }}>
              Set up your alert
            </h2>
            <p style={{ fontSize: 14, color: "var(--fg-muted)", marginBottom: 28 }}>
              Takes 10 seconds. Unsubscribe anytime.
            </p>

            {status === "success" ? (
              <div
                style={{
                  background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)",
                  borderRadius: 16, padding: "20px 24px",
                  display: "flex", alignItems: "flex-start", gap: 14,
                }}
                className="animate-in"
              >
                <CheckCircle2 size={22} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#10b981", marginBottom: 4 }}>Subscription Active!</p>
                  <p style={{ fontSize: 13, color: "rgba(16,185,129,0.8)" }}>{message}</p>
                  <button
                    onClick={() => setStatus("idle")}
                    style={{
                      marginTop: 12, fontSize: 12, fontWeight: 600,
                      color: "#10b981", background: "transparent", border: "none",
                      cursor: "pointer", textDecoration: "underline",
                    }}
                  >
                    Create another alert
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Email */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 8 }}>
                    Email Address
                  </label>
                  <div style={{ position: "relative" }}>
                    <Mail size={16} color="var(--fg-muted)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ width: "100%", boxSizing: "border-box", paddingLeft: 42 }}
                    />
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 8 }}>
                    <Briefcase size={12} style={{ display: "inline", marginRight: 6 }} />
                    Role
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {ROLES.map((r) => (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setRole(r.value)}
                        style={{
                          padding: "7px 14px", borderRadius: 9999, fontSize: 12, fontWeight: 600,
                          cursor: "pointer", transition: "all 0.15s",
                          background: role === r.value ? "var(--primary)" : "var(--surface-2)",
                          border: `1px solid ${role === r.value ? "var(--primary)" : "var(--border)"}`,
                          color: role === r.value ? "#fff" : "var(--fg-muted)",
                          boxShadow: role === r.value ? "0 4px 12px rgba(59,130,246,0.25)" : "none",
                        }}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 8 }}>
                    <MapPin size={12} style={{ display: "inline", marginRight: 6 }} />
                    Location (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Remote, Bangalore, Mumbai"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                {status === "error" && (
                  <div
                    style={{
                      background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                      borderRadius: 12, padding: "12px 16px",
                      display: "flex", alignItems: "center", gap: 10,
                    }}
                    className="animate-in"
                  >
                    <AlertCircle size={16} color="#ef4444" />
                    <p style={{ fontSize: 13, color: "#ef4444" }}>{message}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn btn-primary"
                  style={{ height: 48, fontSize: 14, fontWeight: 700, letterSpacing: "0.04em", marginTop: 4 }}
                >
                  {status === "loading" ? "Setting up…" : "Start Receiving Alerts →"}
                </button>
                <p style={{ fontSize: 11, color: "var(--fg-muted)", textAlign: "center" }}>
                  No spam · Unsubscribe at any time · Free forever
                </p>
              </form>
            )}
          </div>
        </div>

        {/* ── Unsubscribe section ───────────────────────────────── */}
        <div
          className="glass animate-in"
          style={{ borderRadius: 20, padding: "28px 32px", maxWidth: 600, margin: "0 auto", borderColor: "rgba(239,68,68,0.15)" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <Trash2 size={18} color="#ef4444" />
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--fg)" }}>Unsubscribe from alerts</h3>
          </div>
          <p style={{ fontSize: 13, color: "var(--fg-muted)", marginBottom: 16 }}>
            Enter the email address you used to subscribe to remove all your alerts instantly.
          </p>

          {unsubStatus === "done" ? (
            <div className="animate-in" style={{ fontSize: 14, color: "#10b981", fontWeight: 600 }}>
              ✅ Unsubscribed successfully. You won't receive any more emails.
            </div>
          ) : (
            <form onSubmit={handleUnsubscribe} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <input
                type="email"
                placeholder="your@email.com"
                required
                value={unsubEmail}
                onChange={(e) => setUnsubEmail(e.target.value)}
                style={{ flex: 1, minWidth: 200 }}
              />
              <button
                type="submit"
                disabled={unsubStatus === "loading"}
                style={{
                  padding: "0 20px", height: 42, borderRadius: 10,
                  background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
                  color: "#ef4444", fontSize: 13, fontWeight: 600, cursor: "pointer",
                  transition: "background 0.15s", whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.2)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.1)")}
              >
                {unsubStatus === "loading" ? "Removing…" : "Unsubscribe"}
              </button>
              {unsubStatus === "error" && (
                <p style={{ width: "100%", fontSize: 12, color: "#ef4444", marginTop: 4 }}>
                  No active alerts found for that email.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
