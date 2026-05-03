"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Check, X, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast Container */}
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          zIndex: 9999,
          pointerEvents: "none", // Let clicks pass through empty space
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="animate-slide-up glass"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "12px",
              pointerEvents: "auto",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              border: `1px solid ${
                t.type === "success"
                  ? "rgba(16, 185, 129, 0.2)"
                  : t.type === "error"
                  ? "rgba(239, 68, 68, 0.2)"
                  : "var(--border)"
              }`,
              background: "rgba(18, 18, 21, 0.95)",
              minWidth: "250px",
            }}
          >
            {t.type === "success" && <Check size={18} color="#10b981" />}
            {t.type === "error" && <X size={18} color="#ef4444" />}
            {t.type === "info" && <Info size={18} color="var(--primary)" />}
            
            <span style={{ fontSize: "14px", fontWeight: 500, color: "#fff", flex: 1 }}>
              {t.message}
            </span>
            
            <button
              onClick={() => removeToast(t.id)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={14} color="var(--fg-muted)" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
