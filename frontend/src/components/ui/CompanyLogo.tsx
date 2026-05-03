"use client";

import { useState } from "react";

interface CompanyLogoProps {
  name: string;
  size?: number;
}

export const CompanyLogo = ({ name, size = 48 }: CompanyLogoProps) => {
  const [error, setError] = useState(false);
  
  // Use a predictable domain name derived from company name
  // Note: For a real app, storing the actual domain in the DB is better
  const domain = name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';

  // Hash company name for consistent fallback background color
  const hash = name.split("").reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];
  const bgColor = colors[Math.abs(hash) % colors.length];

  const fallback = (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size > 32 ? 12 : 8,
        background: bgColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span style={{ fontSize: size * 0.4, fontWeight: "bold", color: "#fff" }}>
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  );

  // If we already know it fails, just show fallback
  if (error) {
    return fallback;
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size > 32 ? 12 : 8,
        background: "var(--surface-2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        flexShrink: 0,
        border: "1px solid var(--border)",
      }}
    >
      {/* We use logo.dev without token fallback for development */}
      <img
        src={`https://img.logo.dev/${domain}?token=pk_YOUR_TOKEN`}
        alt={`${name} logo`}
        style={{ width: "100%", height: "100%", objectFit: "contain", padding: 4 }}
        onError={() => setError(true)}
      />
    </div>
  );
};
