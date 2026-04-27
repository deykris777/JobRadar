import { Router } from "express";
import { runManualScrape } from "../services/cronService";

export const cronRouter = Router();

// POST /api/cron/scrape - Trigger manual scrape (protected by secret)
cronRouter.post("/scrape", async (req, res) => {
  try {
    const secret = req.headers["x-cron-secret"];
    
    if (process.env.NODE_ENV === "production" && secret !== process.env.CRON_SECRET) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const count = await runManualScrape();
    res.json({ message: "Scrape triggered", newJobs: count });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});
