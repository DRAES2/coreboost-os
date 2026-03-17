import { scrapeLeads } from "@/lib/scraper";

export async function POST(req) {
  try {
    const body = await req.json();
    const { query } = body;

    if (!query) {
      return Response.json({ error: "No query provided" }, { status: 400 });
    }

    console.log("🔥 Running scraper for:", query);

    const leads = await scrapeLeads(query);

    return Response.json({ leads });

  } catch (err) {
    console.error(err);
    return Response.json({ error: "Scraper failed" }, { status: 500 });
  }
}