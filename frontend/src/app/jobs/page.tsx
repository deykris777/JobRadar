"use client";

import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { JobCard } from "@/components/jobs/JobCard";
import { Filters } from "@/components/jobs/Filters";
import { SkeletonCard } from "@/components/jobs/SkeletonCard";
import { FilterDrawer } from "@/components/ui/FilterDrawer";
import { getJobs } from "@/lib/api";
import { Job, JobFilters, Pagination } from "@/types";
import { ChevronLeft, ChevronRight, RefreshCw, Zap, X, SlidersHorizontal } from "lucide-react";

// ─── Label maps for filter chips ────────────────────────────────────────────
const ROLE_LABELS: Record<string, string> = {
  fullstack: "Fullstack", frontend: "Frontend", backend: "Backend",
  mobile: "Mobile", design: "Design",
};
const TYPE_LABELS: Record<string, string> = {
  remote: "Remote", onsite: "Onsite", hybrid: "Hybrid",
};
const SORT_LABELS: Record<string, string> = {
  newest: "Newest", oldest: "Oldest", stipend: "High Stipend",
};

// ─── Active filter chips ─────────────────────────────────────────────────────
function ActiveChips({ filters, onChange }: { filters: JobFilters; onChange: (f: JobFilters) => void }) {
  const chips: { label: string; clear: () => void }[] = [];

  if (filters.search)     chips.push({ label: `"${filters.search}"`,       clear: () => onChange({ ...filters, search: undefined, page: 1 }) });
  if (filters.role)       chips.push({ label: ROLE_LABELS[filters.role] ?? filters.role, clear: () => onChange({ ...filters, role: undefined, page: 1 }) });
  if (filters.type)       chips.push({ label: TYPE_LABELS[filters.type] ?? filters.type, clear: () => onChange({ ...filters, type: undefined, page: 1 }) });
  if (filters.minStipend) chips.push({ label: `₹${Number(filters.minStipend).toLocaleString("en-IN")}+`, clear: () => onChange({ ...filters, minStipend: undefined, page: 1 }) });
  if (filters.sort && filters.sort !== "newest") chips.push({ label: SORT_LABELS[filters.sort] ?? filters.sort, clear: () => onChange({ ...filters, sort: "newest", page: 1 }) });

  if (chips.length === 0) return null;

  const clearAll = () => onChange({ page: 1, limit: 20 });

  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 16 }}>
      {chips.map((chip) => (
        <button key={chip.label} className="filter-chip" onClick={chip.clear}>
          {chip.label}
          <span className="filter-chip-x">✕</span>
        </button>
      ))}
      {chips.length > 1 && (
        <button
          onClick={clearAll}
          style={{
            fontSize: 11, fontWeight: 600, color: "var(--fg-muted)",
            background: "transparent", border: "none", cursor: "pointer",
            padding: "4px 8px", borderRadius: 9999,
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg-muted)")}
        >
          Clear all ×
        </button>
      )}
    </div>
  );
}

// ─── Pagination ──────────────────────────────────────────────────────────────
function PaginationRow({ pagination, onPage }: { pagination: Pagination; onPage: (p: number) => void }) {
  if (pagination.pages <= 1) return null;

  const { page, pages } = pagination;

  // Build page number array with ellipsis logic
  const buildPages = (): (number | "...")[] => {
    if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
    const result: (number | "...")[] = [1];
    if (page > 3) result.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(pages - 1, page + 1); i++) result.push(i);
    if (page < pages - 2) result.push("...");
    result.push(pages);
    return result;
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 32 }}>
      <button
        onClick={() => onPage(page - 1)}
        disabled={!pagination.hasPrev}
        className="btn btn-ghost"
        style={{ padding: "8px 10px" }}
      >
        <ChevronLeft size={16} />
      </button>

      {buildPages().map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} style={{ padding: "0 4px", color: "var(--fg-muted)", fontSize: 13 }}>…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPage(p as number)}
            style={{
              width: 36, height: 36, borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
              border: `1px solid ${p === page ? "var(--accent)" : "var(--border)"}`,
              background: p === page ? "var(--accent)" : "transparent",
              color: p === page ? "#fff" : "var(--fg-muted)",
              transition: "all 0.15s",
            }}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPage(page + 1)}
        disabled={!pagination.hasNext}
        className="btn btn-ghost"
        style={{ padding: "8px 10px" }}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function JobsPage() {
  const [jobs, setJobs]               = useState<Job[]>([]);
  const [pagination, setPagination]   = useState<Pagination | null>(null);
  const [filters, setFilters]         = useState<JobFilters>({ page: 1, limit: 20, sort: "newest" });
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [drawerOpen, setDrawerOpen]   = useState(false);

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
      {/* Navbar — passes drawer-open handler for mobile filter button */}
      <Navbar onOpenFilters={() => setDrawerOpen(true)} />

      {/* Mobile Filter Drawer */}
      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        onChange={handleFiltersChange}
        total={pagination?.total ?? 0}
      />

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 64px" }}>

        {/* ── Hero ──────────────────────────────────────────────── */}
        <div className="animate-in" style={{ marginBottom: 36 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "4px 12px", borderRadius: 9999,
            background: "var(--accent-dim)", border: "1px solid var(--accent-glow)",
            marginBottom: 14,
          }}>
            <Zap size={12} color="var(--accent)" />
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Updated Daily
            </span>
          </div>

          <h1 style={{ fontSize: "clamp(26px, 5vw, 44px)", fontWeight: 900, color: "var(--fg)", lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 10 }}>
            Dev internships &amp;{" "}
            <span style={{ color: "var(--accent)" }}>jobs in India</span>
          </h1>
          <p style={{ fontSize: 15, color: "var(--fg-muted)", maxWidth: 500 }}>
            Scraped daily from Internshala, Wellfound, and more. Filter by role, location, stipend. Get email alerts for new matches.
          </p>
        </div>

        {/* ── Layout: sidebar + grid ─────────────────────────────── */}
        <div className="jobs-layout">

          {/* Sidebar (hidden on mobile via CSS) */}
          <aside className="jobs-sidebar">
            <Filters
              filters={filters}
              onChange={handleFiltersChange}
              total={pagination?.total ?? 0}
            />
          </aside>

          {/* Main content */}
          <div>
            {/* Active filter chips */}
            <ActiveChips filters={filters} onChange={handleFiltersChange} />

            {/* Results header */}
            {!loading && !error && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <p style={{ fontSize: 13, color: "var(--fg-muted)" }}>
                  {pagination?.total ?? 0} jobs found
                </p>
                {/* Mobile: show active filters count */}
                <button
                  onClick={() => setDrawerOpen(true)}
                  style={{
                    display: "none",
                    alignItems: "center", gap: 6,
                    fontSize: 12, fontWeight: 600, color: "var(--fg-muted)",
                    background: "var(--surface-2)", border: "1px solid var(--border)",
                    borderRadius: 8, padding: "6px 12px", cursor: "pointer",
                  }}
                  className="mobile-filter-trigger"
                >
                  <SlidersHorizontal size={13} />
                  Filters
                </button>
              </div>
            )}

            {/* States: loading / error / empty / grid */}
            {loading ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : error ? (
              <div style={{ textAlign: "center", padding: "64px 24px" }}>
                <p style={{ fontSize: 32, marginBottom: 12 }}>⚠️</p>
                <p style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", marginBottom: 8 }}>
                  Could not connect to backend
                </p>
                <p style={{ fontSize: 13, color: "var(--fg-muted)", marginBottom: 20 }}>
                  {error}
                </p>
                <button onClick={() => fetchJobs(filters)} className="btn btn-ghost" style={{ margin: "0 auto" }}>
                  <RefreshCw size={14} />
                  Retry
                </button>
              </div>
            ) : jobs.length === 0 ? (
              <div style={{ textAlign: "center", padding: "64px 24px" }}>
                <p style={{ fontSize: 40, marginBottom: 12 }}>🔍</p>
                <p style={{ fontSize: 18, fontWeight: 800, color: "var(--fg)", marginBottom: 8 }}>
                  No jobs found
                </p>
                <p style={{ fontSize: 14, color: "var(--fg-muted)", marginBottom: 20 }}>
                  Try adjusting your filters or clearing some criteria.
                </p>
                <button onClick={() => handleFiltersChange({ page: 1, limit: 20 })} className="btn btn-outline">
                  <X size={14} />
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14, marginBottom: 8 }}>
                  {jobs.map((job, i) => (
                    <JobCard key={job._id} job={job} style={{ animationDelay: `${i * 0.04}s` }} />
                  ))}
                </div>

                {pagination && (
                  <PaginationRow pagination={pagination} onPage={goToPage} />
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .mobile-filter-trigger { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
