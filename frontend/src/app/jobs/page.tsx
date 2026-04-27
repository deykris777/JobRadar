"use client";

import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { JobCard } from "@/components/jobs/JobCard";
import { Filters } from "@/components/jobs/Filters";
import { getJobs } from "@/lib/api";
import { Job, JobFilters, Pagination } from "@/types";
import { ChevronLeft, ChevronRight, Loader2, RefreshCw, Zap } from "lucide-react";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [filters, setFilters] = useState<JobFilters>({ page: 1, limit: 20 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobs = useCallback(async (f: JobFilters) => {
    setLoading(true);
    setError("");
    try {
      const res = await getJobs(f);
      setJobs(res.jobs);
      setPagination(res.pagination);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs(filters);
  }, [filters, fetchJobs]);

  const handleFiltersChange = (newFilters: JobFilters) => {
    setFilters({ ...newFilters, limit: 20 });
  };

  const goToPage = (page: number) => {
    setFilters((f) => ({ ...f, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="noise-bg" style={{ minHeight: "100vh" }}>
      <Navbar />

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        {/* Hero */}
        <div className="animate-in" style={{ marginBottom: 40 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 12px",
              borderRadius: 999,
              background: "var(--accent-dim)",
              border: "1px solid var(--accent-glow)",
              marginBottom: 16,
            }}
          >
            <Zap size={12} color="var(--accent)" />
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "var(--accent)",
                fontFamily: "var(--font-display)",
                letterSpacing: "0.05em",
              }}
            >
              UPDATED DAILY
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 5vw, 48px)",
              fontWeight: 800,
              color: "var(--fg)",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              marginBottom: 12,
            }}
          >
            Dev internships &{" "}
            <span style={{ color: "var(--accent)" }}>jobs in India</span>
          </h1>
          <p style={{ fontSize: 16, color: "var(--fg-muted)", maxWidth: 520 }}>
            Scraped daily from Internshala, Wellfound, and more. Filter by role, location, stipend. Get email alerts for new matches.
          </p>
        </div>

        {/* Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 28, alignItems: "start" }}>
          {/* Sidebar */}
          <Filters
            filters={filters}
            onChange={handleFiltersChange}
            total={pagination?.total || 0}
          />

          {/* Job grid */}
          <div>
            {loading ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 320,
                  gap: 12,
                  color: "var(--fg-muted)",
                }}
              >
                <Loader2 size={20} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />
                <span style={{ fontSize: 14 }}>Loading jobs...</span>
              </div>
            ) : error ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "64px 24px",
                  color: "var(--fg-muted)",
                }}
              >
                <p style={{ marginBottom: 16, fontSize: 15 }}>
                  Could not connect to backend. Is the server running?
                </p>
                <p
                  style={{
                    fontSize: 13,
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    padding: "8px 16px",
                    display: "inline-block",
                    color: "var(--red)",
                    fontFamily: "monospace",
                  }}
                >
                  {error}
                </p>
                <button
                  onClick={() => fetchJobs(filters)}
                  className="btn btn-ghost"
                  style={{ display: "flex", margin: "16px auto 0" }}
                >
                  <RefreshCw size={14} />
                  Retry
                </button>
              </div>
            ) : jobs.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "64px 24px",
                  color: "var(--fg-muted)",
                }}
              >
                <p style={{ fontSize: 32, marginBottom: 12 }}>🔍</p>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--fg)", marginBottom: 8 }}>
                  No jobs found
                </p>
                <p style={{ fontSize: 14 }}>Try adjusting your filters or run a scrape.</p>
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                    gap: 14,
                    marginBottom: 28,
                  }}
                >
                  {jobs.map((job, i) => (
                    <JobCard
                      key={job._id}
                      job={job}
                      style={{ animationDelay: `${i * 0.04}s` }}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    <button
                      onClick={() => goToPage(pagination.page - 1)}
                      disabled={!pagination.hasPrev}
                      className="btn btn-ghost"
                      style={{ padding: "8px 12px" }}
                    >
                      <ChevronLeft size={16} />
                    </button>

                    {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => {
                      const page = i + 1;
                      const isActive = page === pagination.page;
                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 8,
                            border: isActive ? "1px solid var(--accent)" : "1px solid var(--border)",
                            background: isActive ? "var(--accent)" : "transparent",
                            color: isActive ? "white" : "var(--fg-muted)",
                            fontFamily: "var(--font-display)",
                            fontWeight: 600,
                            fontSize: 13,
                            cursor: "pointer",
                            transition: "all 0.15s",
                          }}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => goToPage(pagination.page + 1)}
                      disabled={!pagination.hasNext}
                      className="btn btn-ghost"
                      style={{ padding: "8px 12px" }}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
