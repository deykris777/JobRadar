import axios from "axios";
import * as cheerio from "cheerio";
import { Job } from "../models/Job";
import { classifyRole, parseStipend } from "./utils";

const BASE_URL = "https://cuvette.tech";
const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.5",
  Referer: "https://cuvette.tech/internships",
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function scrapeCuvette(): Promise<number> {
  let newJobsCount = 0;

  try {
    console.log("  📥 Scraping Cuvette...");

    // Cuvette uses API endpoints — we call them directly like a real browser
    const apiUrl = `${BASE_URL}/api/v2/internship/listings`;
    
    const { data } = await axios.get(apiUrl, {
      headers: {
        ...HEADERS,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      timeout: 20000,
    });

    const internships = data?.internships || data?.data || [];
    console.log(`    Found ${internships.length} listings on Cuvette`);

    for (const item of internships) {
      try {
        const sourceId = `cuvette-${item._id || item.id}`;
        const exists = await Job.findOne({ sourceId });
        if (exists) continue;

        const title = item.profile || item.title || "Internship";
        const company = item.company?.name || item.companyName || "Unknown";
        const location = (item.location || item.city || "India").toLowerCase();
        const isRemote =
          item.isWfh === true ||
          location.includes("remote") ||
          location.includes("work from home");

        const stipendText = item.stipend
          ? `₹${item.stipend.min || 0} - ₹${item.stipend.max || 0}/month`
          : "Unpaid";

        const { stipendStr, stipendMin } = parseStipend(stipendText);
        const role = classifyRole(title + " " + (item.skills || []).join(" "));
        const applyUrl = `${BASE_URL}/internships/${item._id || item.id}`;

        await Job.create({
          title,
          company,
          location: isRemote ? "Remote" : location || "India",
          type: isRemote ? "remote" : "onsite",
          role,
          stipend: stipendStr,
          stipendMin,
          skills: item.skills || [],
          description: item.description || `${title} at ${company}`,
          applyUrl,
          source: "cuvette",
          sourceId,
          postedAt: new Date(item.createdAt || Date.now()),
          isActive: true,
        });

        newJobsCount++;
      } catch {
        continue;
      }
    }
  } catch (err) {
    console.error("  ❌ Cuvette scraper failed:", (err as Error).message);
    // Fallback to HTML scrape if API fails
    try {
      console.log("  🔄 Trying Cuvette HTML fallback...");
      const { data: html } = await axios.get(`${BASE_URL}/internships`, {
        headers: HEADERS,
        timeout: 15000,
      });

      const $ = cheerio.load(html);
      const cards = $(".internship-card, [class*='InternshipCard'], [class*='internshipCard']");
      console.log(`    Found ${cards.length} cards via HTML fallback`);
    } catch {
      console.error("  ❌ Cuvette HTML fallback also failed.");
    }
  }

  return newJobsCount;
}
