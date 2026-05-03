import { JobFilters } from "@/types";
import { Search, Briefcase, MapPin, ArrowUpDown, IndianRupee } from "lucide-react";

interface FiltersProps {
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

export const Filters = ({ filters, onChange, total }: FiltersProps) => {
  const handleChange = (key: keyof JobFilters, value: any) => {
    onChange({ ...filters, [key]: value, page: 1 });
  };

  return (
    <div className="sticky animate-in" style={{ top: 96, animationDelay: "0.1s" }}>

      {/* ── Search ────────────────────────────────────── */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--fg)", marginBottom: 10 }}>
          <Search size={14} color="var(--accent)" /> Search
        </h2>
        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Title, company, or skill..."
            style={{
              width: "100%", boxSizing: "border-box",
              background: "var(--surface-2)", border: "1px solid var(--border)",
              borderRadius: 12, padding: "10px 14px 10px 38px",
              color: "var(--fg)", fontSize: 13, outline: "none", transition: "border-color 0.15s",
            }}
            value={filters.search || ""}
            onChange={(e) => handleChange("search", e.target.value)}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          />
          <Search size={14} color="var(--fg-muted)" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
        </div>
      </div>

      {/* ── Role ──────────────────────────────────────── */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--fg)", marginBottom: 10 }}>
          <Briefcase size={14} color="var(--accent)" /> Role
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {ROLES.map((role) => (
            <button
              key={role.value}
              onClick={() => handleChange("role", role.value)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                borderRadius: 8, padding: "7px 10px", fontSize: 12, fontWeight: 500,
                cursor: "pointer", border: "none", transition: "all 0.15s",
                background: filters.role === role.value ? "var(--primary)" : "transparent",
                color: filters.role === role.value ? "#fff" : "var(--fg-muted)",
                boxShadow: filters.role === role.value ? "0 4px 12px rgba(59,130,246,0.25)" : "none",
              }}
            >
              {role.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Work Type ─────────────────────────────────── */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--fg)", marginBottom: 10 }}>
          <MapPin size={14} color="var(--accent)" /> Work Type
        </h2>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => handleChange("type", type.value)}
              style={{
                flex: 1, minWidth: "calc(50% - 4px)",
                padding: "7px 4px", borderRadius: 8, fontSize: 11, fontWeight: 700,
                cursor: "pointer", transition: "all 0.15s",
                background: filters.type === type.value ? "#fff" : "transparent",
                border: `1px solid ${filters.type === type.value ? "#fff" : "var(--border)"}`,
                color: filters.type === type.value ? "#000" : "var(--fg-muted)",
              }}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Min Stipend ───────────────────────────────── */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--fg)", marginBottom: 10 }}>
          <IndianRupee size={14} color="var(--accent)" /> Min. Stipend
        </h2>
        <input
          type="range"
          min={0}
          max={50000}
          step={1000}
          value={filters.minStipend || 0}
          onChange={(e) => handleChange("minStipend", Number(e.target.value))}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <span style={{ fontSize: 11, color: "var(--fg-muted)" }}>₹0</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)" }}>
            {filters.minStipend ? `₹${Number(filters.minStipend).toLocaleString("en-IN")}/mo+` : "Any amount"}
          </span>
          <span style={{ fontSize: 11, color: "var(--fg-muted)" }}>₹50K</span>
        </div>
      </div>

      {/* ── Sort By ───────────────────────────────────── */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--fg)", marginBottom: 10 }}>
          <ArrowUpDown size={14} color="var(--accent)" /> Sort By
        </h2>
        <select
          value={filters.sort || "newest"}
          onChange={(e) => handleChange("sort", e.target.value as JobFilters["sort"])}
          style={{ width: "100%" }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="stipend">Highest Stipend</option>
        </select>
      </div>

      {/* ── Stats pill ────────────────────────────────── */}
      <div style={{
        borderRadius: 14, background: "var(--accent-dim)", border: "1px solid var(--accent-glow)",
        padding: "12px 16px",
      }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 2 }}>
          Total Found
        </p>
        <p style={{ fontSize: 24, fontWeight: 900, color: "var(--fg)" }}>{total}</p>
      </div>
    </div>
  );
};
