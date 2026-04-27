import puppeteer from "puppeteer";
import { Job } from "../models/Job";
import { classifyRole, parseStipend } from "./utils";

// Search terms to look for on Wellfound
const SEARCH_QUERIES = [
  "react developer internship",
  "node.js internship",
  "frontend developer internship india",
  "fullstack internship india",
  "software engineer internship india",
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function scrapeWellfound(): Promise<number> {
  let newJobsCount = 0;
  let browser;

  try {
    console.log("  🤖 Launching Puppeteer browser...");
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
        "--window-size=1280,800",
      ],
    });

    const page = await browser.newPage();

    // Set a real browser user agent to avoid bot detection
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    );

    // Set viewport
    await page.setViewport({ width: 1280, height: 800 });

    // Set extra headers to look like a real browser
    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    });

    for (const query of SEARCH_QUERIES) {
      try {
        console.log(`  📥 Scraping Wellfound: "${query}"`);

        const searchUrl = `https://wellfound.com/jobs?q=${encodeURIComponent(query)}&type=internship`;

        await page.goto(searchUrl, {
          waitUntil: "networkidle2",
          timeout: 30000,
        });

        // Wait for job cards to load
        await page.waitForSelector("[data-test='StartupResult'], .job-listing, [class*='JobListing'], [class*='jobListing']", {
          timeout: 10000,
        }).catch(() => {
          console.log(`    ⚠️ No job cards found for: ${query}`);
        });

        // Add a small human-like delay
        await delay(2000 + Math.random() * 1000);

        // Extract job data from the page
        const jobs = await page.evaluate(() => {
          const results: any[] = [];

          // Try multiple selectors as Wellfound updates their UI
          const cards = document.querySelectorAll(
            "[data-test='StartupResult'], .job-listing, [class*='styles_component']"
          );

          cards.forEach((card) => {
            try {
              const titleEl =
                card.querySelector("[class*='title'], h2, h3, [class*='jobTitle']") ||
                card.querySelector("a[href*='/jobs/']");
              const companyEl = card.querySelector(
                "[class*='company'], [class*='startup'], [class*='name']"
              );
              const locationEl = card.querySelector("[class*='location'], [class*='remote']");
              const linkEl = card.querySelector("a[href*='/jobs/']");

              const title = titleEl?.textContent?.trim() || "";
              const company = companyEl?.textContent?.trim() || "";
              const location = locationEl?.textContent?.trim() || "";
              const link = linkEl?.getAttribute("href") || "";

              if (title && company && link) {
                results.push({ title, company, location, link });
              }
            } catch {
              // skip malformed card
            }
          });

          return results;
        });

        console.log(`    Found ${jobs.length} jobs for "${query}"`);

        // Save each job to MongoDB
        for (const job of jobs) {
          try {
            const sourceId = `wellfound-${job.link}`;
            const exists = await Job.findOne({ sourceId });
            if (exists) continue;

            const isRemote =
              job.location.toLowerCase().includes("remote") ||
              job.location.toLowerCase().includes("anywhere");

            const role = classifyRole(job.title);
            const applyUrl = job.link.startsWith("http")
              ? job.link
              : `https://wellfound.com${job.link}`;

            await Job.create({
              title: job.title,
              company: job.company,
              location: isRemote ? "Remote" : job.location || "India",
              type: isRemote ? "remote" : "onsite",
              role,
              stipend: "Not specified",
              stipendMin: 0,
              skills: [],
              description: `${job.title} at ${job.company}`,
              applyUrl,
              source: "wellfound",
              sourceId,
              postedAt: new Date(),
              isActive: true,
            });

            newJobsCount++;
          } catch {
            continue;
          }
        }

        // Polite delay between searches to avoid rate limiting
        await delay(4000 + Math.random() * 2000);
      } catch (err) {
        console.error(`  ❌ Error scraping Wellfound for "${query}":`, (err as Error).message);
        continue;
      }
    }
  } catch (err) {
    console.error("  ❌ Wellfound scraper failed:", (err as Error).message);
  } finally {
    if (browser) {
      await browser.close();
      console.log("  🔒 Puppeteer browser closed.");
    }
  }

  return newJobsCount;
}
