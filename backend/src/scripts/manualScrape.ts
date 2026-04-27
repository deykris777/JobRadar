import "dotenv/config";
import { connectDB } from "../config/db";
import { runManualScrape } from "../services/cronService";
import mongoose from "mongoose";

async function run() {
  try {
    console.log("🚀 JobRadar — Manual Scrape");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    await connectDB();
    
    const total = await runManualScrape();
    
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`✨ Done! ${total} new jobs added to MongoDB.`);
    
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Scrape failed:", (error as Error).message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

run();
