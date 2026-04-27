import { JobFilters } from "@/types";
import { Search, SlidersHorizontal, MapPin, Briefcase, Filter } from "lucide-react";

interface FiltersProps {
  filters: JobFilters;
  onChange: (filters: JobFilters) => void;
  total: number;
}

export const Filters = ({ filters, onChange, total }: FiltersProps) => {
  const handleChange = (key: keyof JobFilters, value: any) => {
    onChange({ ...filters, [key]: value, page: 1 });
  };

  const roles = [
    { label: "All Roles", value: "" },
    { label: "Fullstack", value: "fullstack" },
    { label: "Frontend", value: "frontend" },
    { label: "Backend", value: "backend" },
    { label: "Mobile", value: "mobile" },
    { label: "Design", value: "design" },
  ];

  const types = [
    { label: "All Types", value: "" },
    { label: "Remote", value: "remote" },
    { label: "Onsite", value: "onsite" },
  ];

  return (
    <div className="sticky top-24 space-y-8 animate-in" style={{ animationDelay: '0.1s' }}>
      <div>
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white">
          <Search size={16} className="text-primary" />
          Search
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Title, company, or skill..."
            className="w-full rounded-xl bg-surface-2 border border-border px-4 py-3 pl-11 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            value={filters.search || ""}
            onChange={(e) => handleChange("search", e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-fg-muted" size={16} />
        </div>
      </div>

      <div>
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white">
          <Briefcase size={16} className="text-primary" />
          Role
        </h2>
        <div className="space-y-2">
          {roles.map((role) => (
            <button
              key={role.value}
              onClick={() => handleChange("role", role.value)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                filters.role === role.value 
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "text-fg-muted hover:bg-secondary hover:text-white"
              }`}
            >
              {role.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white">
          <MapPin size={16} className="text-primary" />
          Type
        </h2>
        <div className="flex gap-2">
          {types.map((type) => (
            <button
              key={type.value}
              onClick={() => handleChange("type", type.value)}
              className={`flex-1 rounded-lg border border-border py-2 text-[10px] font-bold uppercase tracking-wider transition-all ${
                filters.type === type.value
                ? "bg-white text-black border-white"
                : "text-fg-muted hover:border-fg-muted"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-accent-dim p-4 border border-accent-glow">
        <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-1">Total Found</p>
        <p className="text-2xl font-black text-white">{total}</p>
      </div>
    </div>
  );
};
