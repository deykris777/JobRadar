import Link from "next/link";
import { Job } from "@/types";
import { MapPin, ExternalLink, IndianRupee, Heart, Link as LinkIcon, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { useToast } from "@/context/ToastContext";
import { useSavedJobs } from "@/context/SavedJobsContext";
import { useAuth } from "@/context/AuthContext";

interface JobCardProps {
  job: Job;
  style?: React.CSSProperties;
}

/** Compute deadline urgency info for display */
function getDeadlineInfo(lastDateToApply?: string) {
  if (!lastDateToApply) return null;
  const deadline = new Date(lastDateToApply);
  if (isNaN(deadline.getTime())) return null;

  const now = new Date();
  const diffMs = deadline.getTime() - now.getTime();
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const label = deadline.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  if (daysLeft < 0) return { label, daysLeft, variant: "closed" as const };
  if (daysLeft <= 3) return { label, daysLeft, variant: "urgent" as const };
  if (daysLeft <= 7) return { label, daysLeft, variant: "warning" as const };
  return { label, daysLeft, variant: "safe" as const };
}

export const JobCard = ({ job, style }: JobCardProps) => {
  const { toast } = useToast();
  const { toggleSave, isSaved } = useSavedJobs();
  const { user } = useAuth();
  const saved = isSaved(job._id);
  const deadline = getDeadlineInfo(job.lastDateToApply);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(job.applyUrl);
    toast("Link copied to clipboard!", "success");
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast("Sign in to save jobs!", "info");
      return;
    }
    await toggleSave(job);
    toast(saved ? "Removed from saved jobs" : "Job saved! ❤️", saved ? "info" : "success");
  };

  const deadlineBadgeClass =
    deadline?.variant === "closed"
      ? "bg-zinc-800 border-zinc-700 text-zinc-400"
      : deadline?.variant === "urgent"
      ? "bg-red-500/10 border-red-500/40 text-red-400 animate-pulse"
      : deadline?.variant === "warning"
      ? "bg-orange-500/10 border-orange-400/40 text-orange-300"
      : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";

  const DeadlineIcon =
    deadline?.variant === "closed"
      ? CheckCircle2
      : deadline?.variant === "urgent" || deadline?.variant === "warning"
      ? AlertTriangle
      : Clock;

  return (
    <Link
      href={`/jobs/${job._id}`}
      className="animate-in glass group relative flex flex-col justify-between rounded-2xl p-6 transition-all hover:scale-[1.02] hover:border-primary/50"
      style={{ ...style, textDecoration: "none" }}
    >
      <div>
        {/* Top row: logo + badges + action buttons */}
        <div className="mb-4 flex items-start justify-between">
          <CompanyLogo name={job.company} size={48} />
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-surface-2 border border-border px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-fg-muted">
                {job.source}
              </span>
              <span className="rounded-full bg-accent-dim border border-accent-glow px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent">
                {job.type}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-2 hover:bg-secondary border border-border transition-colors"
                title="Copy link"
              >
                <LinkIcon size={14} className="text-fg-muted" />
              </button>
              <button
                onClick={handleSave}
                className={`flex items-center justify-center w-8 h-8 rounded-full border transition-colors ${
                  saved
                    ? "bg-red-500/10 border-red-500/30 text-red-500"
                    : "bg-surface-2 hover:bg-secondary border-border text-fg-muted"
                }`}
                title={saved ? "Remove saved job" : "Save job"}
              >
                <Heart size={14} className={saved ? "fill-current" : ""} />
              </button>
            </div>
          </div>
        </div>

        {/* Title & Company */}
        <h3 className="mb-1 text-lg font-bold text-white group-hover:text-primary transition-colors line-clamp-2">
          {job.title}
        </h3>
        <p className="mb-4 text-sm font-medium text-fg-muted line-clamp-1">{job.company}</p>

        {/* Location & Stipend */}
        <div className="mb-4 flex flex-wrap gap-4 text-xs text-fg-muted">
          <div className="flex items-center gap-1.5">
            <MapPin size={14} />
            <span className="truncate max-w-[120px]">{job.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <IndianRupee size={14} />
            <span>{job.stipend || "Unpaid"}</span>
          </div>
        </div>

        {/* ⏰ Last Date to Apply Badge */}
        {deadline && (
          <div
            className={`mb-4 inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] font-semibold ${deadlineBadgeClass}`}
            title={deadline.variant === "closed" ? "Applications closed" : `Apply by ${deadline.label}`}
          >
            <DeadlineIcon size={12} />
            {deadline.variant === "closed" ? (
              "Applications Closed"
            ) : (
              <>
                Apply by {deadline.label}
                {deadline.daysLeft <= 7 && (
                  <span className="ml-1 opacity-80">({deadline.daysLeft}d left)</span>
                )}
              </>
            )}
          </div>
        )}

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {job.skills.slice(0, 3).map((skill) => (
            <span key={skill} className="rounded-md bg-secondary px-2 py-1 text-[11px] font-medium text-fg-muted">
              {skill}
            </span>
          ))}
          {job.skills.length > 3 && (
            <span className="rounded-md bg-secondary px-2 py-1 text-[11px] font-medium text-fg-muted">
              +{job.skills.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Apply Button */}
      <div
        onClick={(e) => {
          e.preventDefault();
          window.open(job.applyUrl, "_blank");
          toast("Opening application...", "info");
        }}
        className="btn btn-primary w-full gap-2 text-xs font-bold uppercase relative z-10"
      >
        Apply Now
        <ExternalLink size={14} />
      </div>
    </Link>
  );
};
