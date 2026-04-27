import cron from "node-cron";
import { scrapeInternshala } from "../scrapers/internshala";
import { scrapeWellfound } from "../scrapers/wellfound";
import { scrapeCuvette } from "../scrapers/cuvette";
import { matchAndSendAlerts } from "./alertsService";

export const startCronJobs = () => {
  // Run daily at 6:00 AM IST (00:30 UTC)
  cron.schedule("30 0 * * *", async () => {
    console.log("\n🕒 Running scheduled daily scrape...");
    try {
      // Run all scrapers in parallel for speed
      const [internshalaCount, wellfoundCount, cuvetteCount] = await Promise.allSettled([
        scrapeInternshala(),
        scrapeWellfound(),
        scrapeCuvette(),
      ]).then(results => results.map(r => r.status === 'fulfilled' ? r.value : 0));

      const totalNew = (internshalaCount as number) + (wellfoundCount as number) + (cuvetteCount as number);
      console.log(`✅ Scrape complete!`);
      console.log(`   Internshala: ${internshalaCount} new | Wellfound: ${wellfoundCount} new | Cuvette: ${cuvetteCount} new`);
      console.log(`   Total new jobs: ${totalNew}`);
      
      if (totalNew > 0) {
        console.log("📧 Checking for matching alerts...");
        await matchAndSendAlerts();
      }
    } catch (error) {
      console.error("❌ Cron Job Error:", (error as Error).message);
    }
  });

  console.log("⏰ Cron jobs initialized (Daily at 6:00 AM IST)");
};

export const runManualScrape = async () => {
  console.log("\n🚀 Starting manual scrape across all platforms...");
  
  const [internshalaCount, wellfoundCount, cuvetteCount] = await Promise.allSettled([
    scrapeInternshala(),
    scrapeWellfound(),
    scrapeCuvette(),
  ]).then(results => results.map(r => r.status === 'fulfilled' ? r.value : 0));

  const total = (internshalaCount as number) + (wellfoundCount as number) + (cuvetteCount as number);
  console.log(`\n📊 Results:`);
  console.log(`   Internshala: ${internshalaCount} new jobs`);
  console.log(`   Wellfound:   ${wellfoundCount} new jobs`);
  console.log(`   Cuvette:     ${cuvetteCount} new jobs`);
  console.log(`   ─────────────────────`);
  console.log(`   Total:       ${total} new jobs`);

  if (total > 0) {
    await matchAndSendAlerts();
  }
  
  return total;
};
