import mongoose, { Schema, Document } from "mongoose";

export interface IAlert extends Document {
  email: string;
  roles: string[];
  locations: string[];
  keywords: string[];
  minStipend: number;
  isActive: boolean;
  createdAt: Date;
}

const AlertSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    roles: [{ type: String }],
    locations: [{ type: String }],
    keywords: [{ type: String }],
    minStipend: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Alert = mongoose.model<IAlert>("Alert", AlertSchema);
