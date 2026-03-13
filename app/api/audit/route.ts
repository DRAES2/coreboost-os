export async function POST(req: Request) {
  const { url } = await req.json();

  try {
    const response = await fetch(url);
    const html = await response.text();

    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const metaMatch = html.match(
      /<meta\s+name=["']description["']\s+content=["'](.*?)["']/i
    );
    const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
    const canonicalMatch = html.match(
      /<link\s+rel=["']canonical["']\s+href=["'](.*?)["']/i
    );
    const robotsMatch = html.match(
      /<meta\s+name=["']robots["']\s+content=["'](.*?)["']/i
    );
    const ogMatch = html.match(/<meta\s+property=["']og:title["']/i);
    const imgWithoutAlt = html.match(/<img(?![^>]*alt=)[^>]*>/i);

    const textOnly = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const wordCount = textOnly ? textOnly.split(" ").length : 0;

    const internalLinks = [...html.matchAll(/<a\s+[^>]*href=["'](.*?)["']/gi)]
      .map((m) => m[1])
      .filter((href) => href.startsWith("/") || href.includes(new URL(url).hostname));

    const isHttps = url.startsWith("https://");

    const title = titleMatch ? titleMatch[1].trim() : null;
    const meta = metaMatch ? metaMatch[1].trim() : null;
    const h1 = h1Match ? h1Match[1].trim() : null;
    const canonical = canonicalMatch ? canonicalMatch[1].trim() : null;
    const robots = robotsMatch ? robotsMatch[1].trim() : null;

    const issues: string[] = [];
    const strengths: string[] = [];

    if (!title) issues.push("Missing page title");
    else strengths.push("Title tag detected");

    if (!meta) issues.push("Missing meta description");
    else strengths.push("Meta description found");

    if (!h1) issues.push("Missing H1 tag");
    else strengths.push("H1 tag detected");

    if (wordCount < 300) issues.push(`Low content depth (${wordCount} words)`);
    else strengths.push(`Content depth looks solid (${wordCount} words)`);

    if (!canonical) issues.push("Missing canonical tag");
    else strengths.push("Canonical tag found");

    if (!ogMatch) issues.push("Missing OpenGraph tags");
    else strengths.push("OpenGraph metadata detected");

    if (imgWithoutAlt) issues.push("Images missing alt text");
    else strengths.push("Images include alt text");

    if (robots?.toLowerCase().includes("noindex")) {
      issues.push("Page may be blocked from indexing (robots noindex)");
    } else {
      strengths.push("No noindex robots directive found");
    }

    if (!isHttps) issues.push("URL is not using HTTPS");
    else strengths.push("HTTPS detected");

    if (internalLinks.length < 3) {
      issues.push(`Weak internal linking (${internalLinks.length} internal links found)`);
    } else {
      strengths.push(`Internal linking present (${internalLinks.length} internal links found)`);
    }

    if (response.ok) strengths.push("Website reachable");
    else issues.push("Website not responding correctly");

    let score = 100 - issues.length * 8;
    if (score < 0) score = 0;

    return Response.json({
      score,
      issues,
      strengths,
    });
  } catch {
    return Response.json({
      score: 0,
      issues: ["Failed to audit site"],
      strengths: [],
      error: "Could not fetch or analyze that website.",
    });
  }
}