import { Job } from "@/types";
import { MapPin, Calendar, ExternalLink, IndianRupee } from "lucide-react";

interface JobCardProps {
  job: Job;
  style?: React.CSSProperties;
}

export const JobCard = ({ job, style }: JobCardProps) => {
  return (
    <div 
      className="animate-in glass group relative flex flex-col justify-between rounded-2xl p-6 transition-all hover:scale-[1.02] hover:border-primary/50"
      style={style}
    >
      <div>
        <div className="mb-4 flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-2 border border-border group-hover:border-primary/30 transition-colors">
            <span className="text-xl font-bold text-primary">{job.company[0]}</span>
          </div>
          <span className="rounded-full bg-accent-dim border border-accent-glow px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent">
            {job.type}
          </span>
        </div>

        <h3 className="mb-1 text-lg font-bold text-white group-hover:text-primary transition-colors">
          {job.title}
        </h3>
        <p className="mb-4 text-sm font-medium text-fg-muted">{job.company}</p>

        <div className="mb-6 flex flex-wrap gap-4 text-xs text-fg-muted">
          <div className="flex items-center gap-1.5">
            <MapPin size={14} />
            <span>{job.location}</span>
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

      <a 
        href={job.applyUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="btn btn-primary w-full gap-2 text-xs font-bold uppercase"
      >
        Apply Now
        <ExternalLink size={14} />
      </a>
    </div>
  );
};
