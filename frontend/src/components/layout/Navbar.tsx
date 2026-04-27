import Link from "next/link";
import { Briefcase, Bell, Menu } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="glass sticky top-0 z-50 w-full border-b border-border py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/30">
            <Briefcase size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Job<span className="text-primary">Radar</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link href="/jobs" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
            Browse Jobs
          </Link>
          <Link href="/alerts" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
            Email Alerts
          </Link>
          <button className="btn btn-primary h-9 rounded-full px-5 text-xs font-bold uppercase tracking-wider">
            Sign In
          </button>
        </div>

        <button className="md:hidden text-white">
          <Menu size={24} />
        </button>
      </div>
    </nav>
  );
};
