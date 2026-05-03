import { Navbar } from "@/components/layout/Navbar";
import { getJobById } from "@/lib/api";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { MapPin, IndianRupee, Briefcase, ExternalLink, ArrowLeft, Calendar, Building, Timer, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const job = await getJobById(params.id);
    return {
      title: `${job.title} at ${job.company} | JobRadar`,
      description: job.description ? job.description.substring(0, 160) : "View job details on JobRadar",
    };
  } catch {
    return {
      title: "Job Not Found | JobRadar",
    };
  }
}

function getDeadlineInfo(lastDateToApply?: string) {
  if (!lastDateToApply) return null;
  const deadline = new Date(lastDateToApply);
  if (isNaN(deadline.getTime())) return null;
  const now = new Date();
  const diffMs = deadline.getTime() - now.getTime();
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const label = deadline.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
  if (daysLeft < 0) return { label, daysLeft, variant: "closed" as const };
  if (daysLeft <= 3) return { label, daysLeft, variant: "urgent" as const };
  if (daysLeft <= 7) return { label, daysLeft, variant: "warning" as const };
  return { label, daysLeft, variant: "safe" as const };
}

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  let job;
  try {
    job = await getJobById(params.id);
  } catch (error) {
    return (
      <div className="min-h-screen noise-bg flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <p className="text-4xl mb-4">🔍</p>
          <h1 className="text-2xl font-bold mb-2 text-white">Job Not Found</h1>
          <p className="text-fg-muted mb-6">This job may have been removed or the link is invalid.</p>
          <Link href="/jobs" className="btn btn-primary">Back to Jobs</Link>
        </main>
      </div>
    );
  }

  const deadline = getDeadlineInfo(job.lastDateToApply);

  return (
    <div className="min-h-screen noise-bg flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-12 md:py-20 animate-in">
        <Link href="/jobs" className="inline-flex items-center gap-2 text-sm font-medium text-fg-muted hover:text-white transition-colors mb-10">
          <ArrowLeft size={16} />
          Back to all jobs
        </Link>
        
        {/* Header Section */}
        <div className="glass rounded-3xl p-8 md:p-12 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/3" />
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-start gap-8 justify-between mb-8">
              <div className="flex items-center gap-6">
                <CompanyLogo name={job.company} size={80} />
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
                    {job.title}
                  </h1>
                  <div className="flex items-center gap-2 text-lg text-fg-muted font-medium">
                    <Building size={18} />
                    {job.company}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
                <a 
                  href={job.applyUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-primary w-full md:w-auto h-12 px-8 text-sm font-bold uppercase tracking-wider gap-2 shadow-lg shadow-primary/20"
                >
                  Apply Now
                  <ExternalLink size={16} />
                </a>
                <span className="text-xs font-medium text-fg-muted flex items-center gap-1.5 px-1">
                  <Calendar size={12} />
                  Posted {new Date(job.postedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
                {deadline && deadline.variant !== "closed" && (
                  <span className={`text-xs font-semibold flex items-center gap-1.5 px-1 ${
                    deadline.variant === "urgent" ? "text-red-400" : deadline.variant === "warning" ? "text-orange-300" : "text-emerald-400"
                  }`}>
                    <Timer size={12} />
                    Apply by {deadline.label}
                  </span>
                )}
              </div>
            </div>

            {/* Urgency banner — shown only when deadline exists */}
            {deadline && (
              <div className={`mb-6 flex items-center gap-3 rounded-2xl border px-5 py-4 ${
                deadline.variant === "closed"
                  ? "bg-zinc-800/60 border-zinc-700 text-zinc-400"
                  : deadline.variant === "urgent"
                  ? "bg-red-500/10 border-red-500/40 text-red-300"
                  : deadline.variant === "warning"
                  ? "bg-orange-500/10 border-orange-400/40 text-orange-200"
                  : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              }`}>
                {deadline.variant === "closed" ? <CheckCircle2 size={18} /> : deadline.variant === "urgent" || deadline.variant === "warning" ? <AlertTriangle size={18} /> : <Clock size={18} />}
                <div>
                  {deadline.variant === "closed" ? (
                    <p className="text-sm font-bold">Applications Closed</p>
                  ) : (
                    <>
                      <p className="text-sm font-bold">
                        {deadline.variant === "urgent" ? "⚡ Closing Soon — " : ""}
                        Last date to apply: {deadline.label}
                      </p>
                      <p className="text-xs opacity-75 mt-0.5">
                        {deadline.daysLeft === 0 ? "Closes today!" : `${deadline.daysLeft} day${deadline.daysLeft === 1 ? "" : "s"} remaining`}
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-4 py-6 border-t border-b border-border">
              <div className="flex items-center gap-2 text-sm font-medium text-white bg-surface-2 px-4 py-2 rounded-xl border border-border">
                <MapPin size={16} className="text-primary" />
                {job.location}
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-white bg-surface-2 px-4 py-2 rounded-xl border border-border">
                <IndianRupee size={16} className="text-primary" />
                {job.stipend || "Unpaid"}
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-white bg-surface-2 px-4 py-2 rounded-xl border border-border">
                <Briefcase size={16} className="text-primary" />
                <span className="capitalize">{job.type}</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-accent bg-accent-dim border border-accent-glow px-4 py-2 rounded-xl">
                Source: {job.source}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <section className="glass rounded-3xl p-8 md:p-10">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                About the role
              </h2>
              <div className="prose prose-invert prose-p:text-fg-muted prose-p:leading-relaxed prose-headings:text-white max-w-none">
                {/* Note: This assumes description might be HTML. If plain text, use whitespace-pre-wrap */}
                {job.description && job.description.includes('<') ? (
                  <div dangerouslySetInnerHTML={{ __html: job.description }} />
                ) : (
                  <p className="whitespace-pre-wrap">{job.description || "No description provided."}</p>
                )}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section className="glass rounded-3xl p-8">
              <h2 className="text-lg font-bold text-white mb-6">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills && job.skills.length > 0 ? (
                  job.skills.map((skill: string) => (
                    <span 
                      key={skill} 
                      className="rounded-lg bg-surface-2 border border-border px-3 py-1.5 text-xs font-medium text-fg-muted"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-fg-muted italic">No specific skills listed.</span>
                )}
              </div>
            </section>
            
            <section className="glass rounded-3xl p-8 bg-primary/5 border-primary/20">
              <h2 className="text-lg font-bold text-white mb-3">Ready to apply?</h2>
              <p className="text-sm text-fg-muted mb-6">
                You will be redirected to {job.source} to complete your application.
              </p>
              <a 
                href={job.applyUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-primary w-full gap-2 font-bold uppercase text-xs"
              >
                Apply for this job
                <ExternalLink size={14} />
              </a>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
