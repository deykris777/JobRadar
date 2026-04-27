import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db";
import { jobsRouter } from "./routes/jobs";
import { alertsRouter } from "./routes/alerts";
import { cronRouter } from "./routes/cron";
import { startCronJobs } from "./services/cronService";

const app = express();
const PORT = process.env.PORT || 5000;

// Security
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: "10kb" }));

// Health check
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Routes
app.use("/api/jobs", jobsRouter);
app.use("/api/alerts", alertsRouter);
app.use("/api/cron", cronRouter);

// 404
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal server error" });
  }
);

async function main() {
  await connectDB();
  startCronJobs();

  app.listen(PORT, () => {
    console.log(`\n🚀 JobBoard API running on http://localhost:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`   Frontend:    ${process.env.FRONTEND_URL || "http://localhost:3000"}`);
    console.log(`\n📋 Endpoints:`);
    console.log(`   GET  /api/jobs          - List jobs with filters`);
    console.log(`   GET  /api/jobs/stats    - Job counts by category`);
    console.log(`   GET  /api/jobs/:id      - Get single job`);
    console.log(`   POST /api/alerts        - Create email alert`);
    console.log(`   POST /api/cron/scrape   - Trigger scrape (protected)`);
    console.log(`   GET  /health            - Health check\n`);
  });
}

main().catch(console.error);
