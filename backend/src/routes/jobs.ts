import { Router } from "express";
import { Job } from "../models/Job";

export const jobsRouter = Router();

// GET /api/jobs - List jobs with filters
jobsRouter.get("/", async (req, res) => {
  try {
    const { 
      role, 
      type, 
      location, 
      minStipend, 
      search, 
      sort = "newest", 
      page = 1, 
      limit = 20 
    } = req.query;

    const query: any = { isActive: true };

    // Filters
    if (role) query.role = role;
    if (type) query.type = type;
    if (location) query.location = { $regex: location, $options: "i" };
    if (minStipend) query.stipendMin = { $gte: Number(minStipend) };

    // Search
    if (search) {
      query.$text = { $search: search as string };
    }

    // Sort
    let sortQuery: any = { postedAt: -1 };
    if (sort === "stipend") sortQuery = { stipendMin: -1 };
    if (sort === "oldest") sortQuery = { postedAt: 1 };

    const skip = (Number(page) - 1) * Number(limit);

    const jobs = await Job.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(Number(limit));

    const total = await Job.countDocuments(query);

    res.json({
      jobs,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        hasPrev: Number(page) > 1,
        hasNext: skip + jobs.length < total,
      }
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET /api/jobs/stats - Category counts
jobsRouter.get("/stats", async (_req, res) => {
  try {
    const stats = await Job.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$role", count: { $sum: 1 } } }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET /api/jobs/:id - Single job
jobsRouter.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});
