"use client";

import Link from "next/link";
import { Briefcase, Bell, Menu, UserCircle, LogOut, Bookmark, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useRef } from "react";

interface NavbarProps {
  /** Set to true to render the mobile filter-open button  */
  onOpenFilters?: () => void;
}

export const Navbar = ({ onOpenFilters }: NavbarProps) => {
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  return (
    <nav
      className="glass"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        width: "100%",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div
            style={{
              width: 32, height: 32, borderRadius: 8,
              background: "var(--primary)",
              boxShadow: "0 4px 12px rgba(59,130,246,0.35)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Briefcase size={16} color="#fff" />
          </div>
          <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff" }}>
            Job<span style={{ color: "var(--primary)" }}>Radar</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="desktop-nav">
          <Link
            href="/jobs"
            style={{ fontSize: 13, fontWeight: 500, color: "var(--fg-muted)", textDecoration: "none", transition: "color 0.15s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg-muted)")}
          >
            Browse Jobs
          </Link>
          <Link
            href="/alerts"
            style={{ fontSize: 13, fontWeight: 500, color: "var(--fg-muted)", textDecoration: "none", transition: "color 0.15s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg-muted)")}
          >
            Email Alerts
          </Link>

          {/* Auth */}
          {!loading && (
            user ? (
              <div style={{ position: "relative" }} ref={dropdownRef}>
                <button
                  id="user-menu-btn"
                  onClick={() => setDropdownOpen((o) => !o)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    borderRadius: 9999, border: "1px solid var(--border)",
                    padding: "4px 12px 4px 4px",
                    background: "transparent", cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="User" style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }} />
                  ) : (
                    <UserCircle size={28} color="var(--fg-muted)" />
                  )}
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#fff", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user.displayName?.split(" ")[0] || "User"}
                  </span>
                </button>

                {dropdownOpen && (
                  <div
                    style={{
                      position: "absolute", right: 0, top: "calc(100% + 8px)",
                      width: 200, borderRadius: 14,
                      border: "1px solid var(--border)",
                      background: "#121215",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                      overflow: "hidden", zIndex: 100,
                    }}
                    className="animate-in"
                  >
                    <div style={{ padding: "12px 16px 10px", borderBottom: "1px solid var(--border)" }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{user.displayName}</p>
                      <p style={{ fontSize: 11, color: "var(--fg-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</p>
                    </div>

                    <Link
                      href="/saved"
                      onClick={() => setDropdownOpen(false)}
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", textDecoration: "none", color: "var(--fg-muted)", fontSize: 13, transition: "background 0.15s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--surface-2)"; e.currentTarget.style.color = "#fff"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--fg-muted)"; }}
                    >
                      <Bookmark size={15} />
                      Saved Jobs
                    </Link>

                    <button
                      onClick={() => { setDropdownOpen(false); signOut(); }}
                      style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 16px", background: "transparent", border: "none", cursor: "pointer", color: "#f87171", fontSize: 13, transition: "background 0.15s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <LogOut size={15} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="sign-in-btn"
                onClick={signInWithGoogle}
                className="btn btn-primary"
                style={{ height: 36, borderRadius: 9999, padding: "0 18px", fontSize: 12, fontWeight: 700, letterSpacing: "0.04em" }}
              >
                SIGN IN
              </button>
            )
          )}
        </div>

        {/* Mobile right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }} className="mobile-nav">
          {/* Filter button — only shows when onOpenFilters is provided (jobs page) */}
          {onOpenFilters && (
            <button
              id="mobile-filter-btn"
              onClick={onOpenFilters}
              className="btn btn-outline"
              style={{ height: 36, padding: "0 14px", fontSize: 12, fontWeight: 700, borderRadius: 8, gap: 6 }}
            >
              <Bell size={14} />
              Filters
            </button>
          )}
          <button
            id="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              width: 36, height: 36, borderRadius: 8,
              background: "var(--surface-2)", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}
          >
            {mobileMenuOpen ? <X size={18} color="var(--fg)" /> : <Menu size={18} color="var(--fg)" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          className="mobile-nav-dropdown animate-in"
          style={{
            position: "absolute",
            top: 60,
            left: 0,
            width: "100%",
            background: "var(--surface)",
            borderBottom: "1px solid var(--border)",
            padding: "16px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
            zIndex: 40,
          }}
        >
          <Link
            href="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: 14, fontWeight: 500, color: "var(--fg)", textDecoration: "none" }}
          >
            Browse Jobs
          </Link>
          <Link
            href="/alerts"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: 14, fontWeight: 500, color: "var(--fg)", textDecoration: "none" }}
          >
            Email Alerts
          </Link>

          {!loading && (
            user ? (
              <>
                <Link
                  href="/saved"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 500, color: "var(--fg)", textDecoration: "none" }}
                >
                  <Bookmark size={16} />
                  Saved Jobs
                </Link>
                <button
                  onClick={() => { setMobileMenuOpen(false); signOut(); }}
                  style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", border: "none", cursor: "pointer", color: "#f87171", fontSize: 14, fontWeight: 500, padding: 0 }}
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signInWithGoogle();
                }}
                className="btn btn-primary"
                style={{ height: 40, borderRadius: 8, fontSize: 14, fontWeight: 700, letterSpacing: "0.04em", width: "100%" }}
              >
                SIGN IN
              </button>
            )
          )}
        </div>
      )}

      <style>{`
        .desktop-nav { display: flex; }
        .mobile-nav  { display: none; }

        @media (max-width: 768px) {
          .desktop-nav { display: none; }
          .mobile-nav  { display: flex; }
        }
      `}</style>
    </nav>
  );
};
