"use client";

import { useEffect, useRef } from "react";
import { X, Search, Briefcase, MapPin, ArrowUpDown, IndianRupee } from "lucide-react";
import { JobFilters } from "@/types";

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filters: JobFilters;
  onChange: (filters: JobFilters) => void;
  total: number;
}

const ROLES = [
  { label: "All Roles",  value: "" },
  { label: "Fullstack",  value: "fullstack" },
  { label: "Frontend",   value: "frontend" },
  { label: "Backend",    value: "backend" },
  { label: "Mobile",     value: "mobile" },
  { label: "Design",     value: "design" },
];

const TYPES = [
  { label: "All",    value: "" },
  { label: "Remote", value: "remote" },
  { label: "Onsite", value: "onsite" },
  { label: "Hybrid", value: "hybrid" },
];

export const FilterDrawer = ({ open, onClose, filters, onChange, total }: FilterDrawerProps) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleChange = (key: keyof JobFilters, value: any) => {
    onChange({ ...filters, [key]: value, page: 1 });
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="animate-fade-bg"
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          zIndex: 99,
        }}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="animate-slide-up"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: "85vh",
          overflowY: "auto",
          background: "#121215",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "20px 20px 0 0",
          zIndex: 100,
          padding: "0 0 env(safe-area-inset-bottom, 16px)",
        }}
      >
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 12, paddingBottom: 4 }}>
          <div style={{ width: 40, height: 4, borderRadius: 9999, background: "var(--border)" }} />
        </div>

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 20px 16px", borderBottom: "1px solid var(--border)",
        }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: "var(--fg)" }}>Filters</span>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12, color: "var(--fg-muted)", fontWeight: 600 }}>
              {total} jobs
            </span>
            <button
              onClick={onClose}
              style={{
                width: 32, height: 32, borderRadius: "50%", background: "var(--secondary)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", border: "none",
              }}
            >
              <X size={16} color="var(--fg-muted)" />
            </button>
          </div>
        </div>

        <div style={{ padding: "20px" }}>
          {/* Search */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "var(--fg-muted)", textTransform: "uppercase", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
              <Search size={13} color="var(--accent)" /> Search
            </p>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Title, company, or skill..."
                value={filters.search || ""}
                onChange={(e) => handleChange("search", e.target.value)}
                style={{
                  width: "100%", boxSizing: "border-box",
                  background: "var(--surface-2)", border: "1px solid var(--border)",
                  borderRadius: 12, padding: "10px 14px 10px 38px",
                  color: "var(--fg)", fontSize: 14, outline: "none",
                }}
              />
              <Search size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} color="var(--fg-muted)" />
            </div>
          </div>

          {/* Role */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "var(--fg-muted)", textTransform: "uppercase", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
              <Briefcase size={13} color="var(--accent)" /> Role
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {ROLES.map((role) => (
                <button
                  key={role.value}
                  onClick={() => handleChange("role", role.value)}
                  style={{
                    padding: "8px 12px", borderRadius: 10, fontSize: 13, fontWeight: 500,
                    cursor: "pointer", border: "1px solid",
                    background: filters.role === role.value ? "var(--primary)" : "var(--surface-2)",
                    borderColor: filters.role === role.value ? "var(--primary)" : "var(--border)",
                    color: filters.role === role.value ? "#fff" : "var(--fg-muted)",
                    transition: "all 0.15s",
                  }}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          {/* Work Type */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "var(--fg-muted)", textTransform: "uppercase", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
              <MapPin size={13} color="var(--accent)" /> Work Type
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleChange("type", type.value)}
                  style={{
                    padding: "8px 4px", borderRadius: 10, fontSize: 12, fontWeight: 600,
                    cursor: "pointer", border: "1px solid",
                    background: filters.type === type.value ? "#fff" : "var(--surface-2)",
                    borderColor: filters.type === type.value ? "#fff" : "var(--border)",
                    color: filters.type === type.value ? "#000" : "var(--fg-muted)",
                    transition: "all 0.15s",
                  }}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stipend */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "var(--fg-muted)", textTransform: "uppercase", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
              <IndianRupee size={13} color="var(--accent)" /> Min. Stipend
            </p>
            <input
              type="range"
              min={0}
              max={50000}
              step={1000}
              value={filters.minStipend || 0}
              onChange={(e) => handleChange("minStipend", Number(e.target.value))}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              <span style={{ fontSize: 12, color: "var(--fg-muted)" }}>₹0</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)" }}>
                {filters.minStipend ? `₹${filters.minStipend.toLocaleString("en-IN")}/mo+` : "Any"}
              </span>
              <span style={{ fontSize: 12, color: "var(--fg-muted)" }}>₹50K</span>
            </div>
          </div>

          {/* Sort */}
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "var(--fg-muted)", textTransform: "uppercase", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
              <ArrowUpDown size={13} color="var(--accent)" /> Sort By
            </p>
            <select
              value={filters.sort || "newest"}
              onChange={(e) => handleChange("sort", e.target.value)}
              style={{ width: "100%", padding: "10px 32px 10px 12px" }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="stipend">Highest Stipend</option>
            </select>
          </div>

          {/* Apply button */}
          <button className="btn btn-primary" style={{ width: "100%", padding: "14px", fontSize: 15 }} onClick={onClose}>
            Show {total} Jobs
          </button>
        </div>
      </div>
    </>
  );
};
