"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { Bell, CheckCircle2, AlertCircle, Mail } from "lucide-react";
import { createAlert } from "@/lib/api";

export default function AlertsPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("all");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      await createAlert({ email, role, location: location || "any" });
      setStatus("success");
      setMessage("You're all set! We'll email you when new matching jobs are found.");
      setEmail("");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-background noise-bg">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-2xl mx-auto">
          <div className="glass p-8 md:p-12 rounded-3xl border border-white/10 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 blur-[100px]" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8">
                <Bell className="w-8 h-8 text-primary" />
              </div>
              
              <h1 className="text-4xl font-bold mb-4">Never miss an opening</h1>
              <p className="text-fg-muted text-lg mb-10">
                The best internships fill up in hours. Get notified the second we find a match for your skills.
              </p>

              {status === "success" ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl flex items-start gap-4 animate-in">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-emerald-500 font-semibold mb-1">Subscription Active!</h3>
                    <p className="text-emerald-500/80">{message}</p>
                    <button 
                      onClick={() => setStatus("idle")}
                      className="mt-4 text-sm font-medium underline underline-offset-4"
                    >
                      Create another alert
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-fg-muted ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-fg-muted" />
                      <input 
                        type="email" 
                        placeholder="your@email.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-surface-2 border border-white/5 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-fg-muted ml-1">Role</label>
                      <select 
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full bg-surface-2 border border-white/5 rounded-xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                      >
                        <option value="all">All Roles</option>
                        <option value="fullstack">Fullstack</option>
                        <option value="frontend">Frontend</option>
                        <option value="backend">Backend</option>
                        <option value="mobile">Mobile App</option>
                        <option value="ui-ux">UI/UX Design</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-fg-muted ml-1">Preferred Location</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Remote, Bangalore"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-surface-2 border border-white/5 rounded-xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>
                  </div>

                  {status === "error" && (
                    <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-xl flex items-center gap-3 text-destructive animate-in">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <p className="text-sm font-medium">{message}</p>
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full btn btn-primary py-4 text-base font-semibold"
                  >
                    {status === "loading" ? "Setting up..." : "Start Receiving Alerts"}
                  </button>
                  
                  <p className="text-center text-xs text-fg-muted">
                    No spam. Unsubscribe at any time with a single click.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
