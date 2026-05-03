"use client";

import { Navbar } from "@/components/layout/Navbar";
import { JobCard } from "@/components/jobs/JobCard";
import { useAuth } from "@/context/AuthContext";
import { useSavedJobs } from "@/context/SavedJobsContext";
import { Bookmark, LogIn, Loader2 } from "lucide-react";
import Link from "next/link";

export default function SavedJobsPage() {
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const { savedJobs, loading } = useSavedJobs();

  return (
    <div className="min-h-screen noise-bg">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="animate-in mb-10">
          <div
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "4px 12px", borderRadius: 9999,
              background: "var(--accent-dim)", border: "1px solid var(--accent-glow)",
              marginBottom: 14,
            }}
          >
            <Bookmark size={12} color="var(--accent)" />
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Your Collection
            </span>
          </div>
          <h1
            style={{
              fontSize: "clamp(26px, 5vw, 40px)", fontWeight: 900,
              color: "var(--fg)", letterSpacing: "-0.03em", marginBottom: 8,
            }}
          >
            Saved Jobs
          </h1>
          <p style={{ fontSize: 15, color: "var(--fg-muted)" }}>
            Jobs you&apos;ve bookmarked — ready when you are.
          </p>
        </div>

        {/* States */}
        {authLoading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 size={32} className="animate-spin text-primary" />
          </div>
        ) : !user ? (
          /* Not signed in */
          <div
            className="glass rounded-3xl"
            style={{ padding: "64px 32px", textAlign: "center" }}
          >
            <div
              style={{
                width: 72, height: 72, borderRadius: 20,
                background: "var(--primary)", margin: "0 auto 20px",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 12px 32px rgba(59,130,246,0.35)",
              }}
            >
              <LogIn size={32} color="#fff" />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--fg)", marginBottom: 10 }}>
              Sign in to view saved jobs
            </h2>
            <p style={{ fontSize: 14, color: "var(--fg-muted)", marginBottom: 28, maxWidth: 380, margin: "0 auto 28px" }}>
              Your saved jobs are stored in the cloud and synced across all your devices.
            </p>
            <button onClick={signInWithGoogle} className="btn btn-primary" style={{ height: 44, padding: "0 28px", fontSize: 13, fontWeight: 700 }}>
              Sign in with Google
            </button>
          </div>
        ) : loading ? (
          /* Loading */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 14,
            }}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="skeleton"
                style={{ height: 240, borderRadius: 20 }}
              />
            ))}
          </div>
        ) : savedJobs.length === 0 ? (
          /* Empty state */
          <div
            className="glass rounded-3xl"
            style={{ padding: "64px 32px", textAlign: "center" }}
          >
            <p style={{ fontSize: 48, marginBottom: 16 }}>🔖</p>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--fg)", marginBottom: 10 }}>
              No saved jobs yet
            </h2>
            <p style={{ fontSize: 14, color: "var(--fg-muted)", marginBottom: 28 }}>
              Hit the ♥ icon on any job card to save it here.
            </p>
            <Link href="/jobs" className="btn btn-primary" style={{ height: 44, padding: "0 28px", fontSize: 13, fontWeight: 700 }}>
              Browse Jobs
            </Link>
          </div>
        ) : (
          /* Jobs grid */
          <>
            <p style={{ fontSize: 13, color: "var(--fg-muted)", marginBottom: 16 }}>
              {savedJobs.length} job{savedJobs.length !== 1 ? "s" : ""} saved
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 14,
              }}
            >
              {savedJobs.map((job, i) => (
                <JobCard key={job._id} job={job} style={{ animationDelay: `${i * 0.04}s` }} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
