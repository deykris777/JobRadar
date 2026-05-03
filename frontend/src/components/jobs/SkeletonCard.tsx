// Animated shimmer placeholder — matches JobCard layout exactly
export const SkeletonCard = () => {
  return (
    <div
      style={{
        background: "rgba(18,18,21,0.8)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 12, flexShrink: 0 }} />
        <div className="skeleton" style={{ width: 64, height: 22, borderRadius: 999 }} />
      </div>

      {/* Title */}
      <div className="skeleton" style={{ height: 20, width: "75%", marginBottom: 8 }} />
      {/* Company */}
      <div className="skeleton" style={{ height: 14, width: "45%", marginBottom: 20 }} />

      {/* Meta row */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
        <div className="skeleton" style={{ height: 14, width: 80 }} />
        <div className="skeleton" style={{ height: 14, width: 100 }} />
      </div>

      {/* Skill chips */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <div className="skeleton" style={{ height: 24, width: 60, borderRadius: 6 }} />
        <div className="skeleton" style={{ height: 24, width: 72, borderRadius: 6 }} />
        <div className="skeleton" style={{ height: 24, width: 50, borderRadius: 6 }} />
      </div>

      {/* Button */}
      <div className="skeleton" style={{ height: 40, width: "100%", borderRadius: 8 }} />
    </div>
  );
};
