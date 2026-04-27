import axios from "axios";
import * as cheerio from "cheerio";
import { Job } from "../models/Job";
import { classifyRole, parseStipend } from "./utils";

const BASE_URL = "https://internshala.com";
const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.5",
  "Accept-Encoding": "gzip, deflate",
  Connection: "keep-alive",
};

// Categories to scrape from Internshala
const CATEGORIES = [
  "web-development",
  "software-development",
  "nodejs",
  "reactjs",
  "full-stack",
  "python",
];

export async function scrapeInternshala(): Promise<number> {
  let newJobsCount = 0;

  for (const category of CATEGORIES) {
    try {
      console.log(`  📥 Scraping Internshala: ${category}`);
      const url = `${BASE_URL}/internships/${category}-internship`;

      const { data: html } = await axios.get(url, {
        headers: HEADERS,
        timeout: 15000,
      });

      const $ = cheerio.load(html);
      const cards = $(".individual_internship");

      for (let i = 0; i < cards.length; i++) {
        const card = $(cards[i]);

        try {
          const title = card.find(".job-internship-name").text().trim();
          const company = card.find(".company-name").text().trim();
          const location = card
            .find(".location_link, .locations_name")
            .first()
            .text()
            .trim()
            .toLowerCase();
          const stipendText = card.find(".stipend").text().trim();
          const duration = card.find(".item_body").first().text().trim();
          const sourceId = card.attr("internship_id") || card.attr("id") || `${company}-${title}`;
          const relativeUrl = card.find(".job-internship-name").attr("href") || "";
          const applyUrl = relativeUrl.startsWith("http")
            ? relativeUrl
            : `${BASE_URL}${relativeUrl}`;

          if (!title || !company) continue;

          // Parse stipend
          const { stipendStr, stipendMin } = parseStipend(stipendText);

          // Detect remote
          const isRemote =
            location.includes("work from home") ||
            location.includes("remote") ||
            card.find(".ic-16-wfh").length > 0;

          // Classify role from title
          const role = classifyRole(title + " " + category);

          // Extract skills from badges
          const skills: string[] = [];
          card.find(".round_tabs span").each((_, el) => {
            skills.push($(el).text().trim());
          });

          // Check if job exists
          const exists = await Job.findOne({ sourceId: `internshala-${sourceId}` });
          if (exists) continue;

          await Job.create({
            title,
            company,
            location: isRemote ? "Remote" : location || "India",
            type: isRemote ? "remote" : "onsite",
            role,
            stipend: stipendStr,
            stipendMin,
            skills,
            description: `${title} internship at ${company}. Duration: ${duration}`,
            applyUrl,
            source: "internshala",
            sourceId: `internshala-${sourceId}`,
            postedAt: new Date(),
            isActive: true,
          });

          newJobsCount++;
        } catch (err) {
          // Skip individual card errors
          continue;
        }
      }

      // Polite delay between requests
      await delay(2000);
    } catch (err) {
      console.error(`  ❌ Error scraping ${category}:`, (err as Error).message);
      continue;
    }
  }

  return newJobsCount;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
