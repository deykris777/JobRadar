import Link from "next/link";
import { Job } from "@/types";
import { MapPin, ExternalLink, IndianRupee, Heart, Link as LinkIcon } from "lucide-react";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { useToast } from "@/context/ToastContext";

interface JobCardProps {
  job: Job;
  style?: React.CSSProperties;
}

export const JobCard = ({ job, style }: JobCardProps) => {
  const { toast } = useToast();
  // SavedJobs integration to come in Sprint 3
  const saved = false;

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(job.applyUrl);
    toast("Link copied to clipboard!", "success");
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast("Saved jobs feature coming in Sprint 3!", "info");
  };

  return (
    <Link
      href={`/jobs/${job._id}`}
      className="animate-in glass group relative flex flex-col justify-between rounded-2xl p-6 transition-all hover:scale-[1.02] hover:border-primary/50"
      style={{ ...style, textDecoration: "none" }}
    >
      <div>
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

        <h3 className="mb-1 text-lg font-bold text-white group-hover:text-primary transition-colors line-clamp-2">
          {job.title}
        </h3>
        <p className="mb-4 text-sm font-medium text-fg-muted line-clamp-1">{job.company}</p>

        <div className="mb-6 flex flex-wrap gap-4 text-xs text-fg-muted">
          <div className="flex items-center gap-1.5">
            <MapPin size={14} />
            <span className="truncate max-w-[120px]">{job.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <IndianRupee size={14} />
            <span>{job.stipend || "Unpaid"}</span>
          </div>
        </div>

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
