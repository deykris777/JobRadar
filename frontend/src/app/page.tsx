import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Briefcase, Zap, Search, Bell } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="noise-bg min-h-screen">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-6 pt-20 pb-32">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex items-center gap-2 rounded-full bg-accent-dim border border-accent-glow px-4 py-1.5 animate-in">
            <Zap size={14} className="text-accent" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-accent">
              Scraping 500+ new jobs daily
            </span>
          </div>

          <h1 className="mb-6 max-w-3xl text-5xl font-black tracking-tight text-white md:text-7xl animate-in" style={{ animationDelay: '0.1s' }}>
            The smartest way to find <span className="text-primary">Dev Internships</span>
          </h1>
          
          <p className="mb-10 max-w-xl text-lg text-fg-muted animate-in" style={{ animationDelay: '0.2s' }}>
            We aggregate high-quality developer roles from Internshala and Wellfound so you don't have to. Filters, alerts, and one-click applications.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 animate-in" style={{ animationDelay: '0.3s' }}>
            <Link href="/jobs" className="btn btn-primary h-14 rounded-2xl px-8 text-base font-bold shadow-2xl">
              Browse Jobs
            </Link>
            <Link href="/alerts" className="btn btn-ghost h-14 rounded-2xl px-8 text-base font-bold border border-border">
              Setup Alerts
            </Link>
          </div>

          <div className="mt-24 grid grid-cols-1 gap-8 md:grid-cols-3 animate-in" style={{ animationDelay: '0.4s' }}>
            {[
              { icon: Search, title: "Smart Filters", desc: "Filter by role, location, and stipend to find your perfect match." },
              { icon: Zap, title: "Real-time Scraping", desc: "Our bots crawl the web every 24h to ensure you never miss a lead." },
              { icon: Bell, title: "Instant Alerts", desc: "Get notified the moment a job matching your profile hits the web." }
            ].map((feature, i) => (
              <div key={i} className="glass rounded-3xl p-8 text-left transition-all hover:border-primary/30">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <feature.icon size={24} />
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-fg-muted">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
