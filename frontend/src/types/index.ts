export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: "remote" | "onsite" | "hybrid";
  role: string;
  stipend: string;
  stipendMin: number;
  skills: string[];
  description: string;
  applyUrl: string;
  source: string;
  postedAt: string;
  createdAt: string;
}

export interface JobFilters {
  role?: string;
  type?: string;
  location?: string;
  minStipend?: number;
  search?: string;
  sort?: "newest" | "oldest" | "stipend";
  page?: number;
  limit?: number;
}

export interface Pagination {
  total: number;
  page: number;
  pages: number;
  hasPrev: boolean;
  hasNext: boolean;
}
