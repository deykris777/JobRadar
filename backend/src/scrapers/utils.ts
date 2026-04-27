/**
 * Classifies a job title into a standard role category
 */
export function classifyRole(text: string): string {
  const t = text.toLowerCase();
  
  if (t.includes("full stack") || t.includes("fullstack")) return "fullstack";
  if (t.includes("frontend") || t.includes("react") || t.includes("angular") || t.includes("vue")) return "frontend";
  if (t.includes("backend") || t.includes("node") || t.includes("java") || t.includes("python") || t.includes("django")) return "backend";
  if (t.includes("mobile") || t.includes("android") || t.includes("ios") || t.includes("flutter") || t.includes("react native")) return "mobile";
  if (t.includes("data science") || t.includes("machine learning") || t.includes("ai") || t.includes("ml")) return "datascience";
  if (t.includes("devops") || t.includes("cloud") || t.includes("aws") || t.includes("azure")) return "devops";
  if (t.includes("design") || t.includes("ui") || t.includes("ux") || t.includes("product designer")) return "design";
  
  return "other";
}

/**
 * Parses stipend strings like "₹ 10,000 /month" or "₹ 15,000-20,000 /month"
 */
export function parseStipend(text: string): { stipendStr: string; stipendMin: number } {
  if (!text || text.toLowerCase().includes("unpaid")) {
    return { stipendStr: "Unpaid", stipendMin: 0 };
  }

  // Remove currency symbols, commas, and spaces
  const clean = text.replace(/[₹, ]/g, "");
  
  // Find numbers
  const matches = clean.match(/\d+/g);
  
  if (!matches || matches.length === 0) {
    return { stipendStr: text, stipendMin: 0 };
  }

  const min = parseInt(matches[0]);
  
  return { 
    stipendStr: text, 
    stipendMin: isNaN(min) ? 0 : min 
  };
}
