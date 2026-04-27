import axios from "axios";
import { JobFilters } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getJobs = async (filters: JobFilters) => {
  const { data } = await api.get("/api/jobs", { params: filters });
  return data;
};

export const getJobById = async (id: string) => {
  const { data } = await api.get(`/api/jobs/${id}`);
  return data;
};

export const createAlert = async (alertData: any) => {
  const { data } = await api.post("/api/alerts", alertData);
  return data;
};

export const getStats = async () => {
  const { data } = await api.get("/api/jobs/stats");
  return data;
};
