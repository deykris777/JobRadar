import mongoose, { Schema, Document } from "mongoose";

export interface IJob extends Document {
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
  source: "internshala" | "wellfound" | "custom";
  sourceId: string;
  postedAt: Date;
  isActive: boolean;
  createdAt: Date;
}

const JobSchema: Schema = new Schema(
  {
    title: { type: String, required: true, index: true },
    company: { type: String, required: true, index: true },
    location: { type: String, required: true },
    type: { type: String, enum: ["remote", "onsite", "hybrid"], default: "onsite" },
    role: { type: String, required: true, index: true },
    stipend: { type: String },
    stipendMin: { type: Number, default: 0 },
    skills: [{ type: String }],
    description: { type: String },
    applyUrl: { type: String, required: true },
    source: { type: String, required: true },
    sourceId: { type: String, required: true, unique: true },
    postedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Text search index
JobSchema.index({ title: "text", company: "text", role: "text", skills: "text" });

export const Job = mongoose.model<IJob>("Job", JobSchema);
