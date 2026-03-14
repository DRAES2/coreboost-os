export async function POST(req: Request) {
  const { url } = await req.json();

  try {
    const response = await fetch(url);
    const html = await response.text();

    const issues: string[] = [];
    const strengths: string[] = [];

    // TITLE
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    if (!titleMatch) issues.push("Missing page title");
    else strengths.push("Title tag detected");

    // META DESCRIPTION
    const metaMatch = html.match(
      /<meta\s+name=["']description["']\s+content=["'](.*?)["']/i
    );
    if (!metaMatch) issues.push("Missing meta description");
    else strengths.push("Meta description found");

    // H1 TAG
    const h1Matches = html.match(/<h1[^>]*>/gi);
    if (!h1Matches) issues.push("Missing H1 tag");
    else {
      strengths.push("H1 tag detected");

      if (h1Matches.length > 1) {
        issues.push("Multiple H1 tags detected");
      }
    }

    // IMAGE ALT TEXT
    const imgTags = html.match(/<img [^>]*>/gi) || [];
    const missingAlt = imgTags.filter(
      (img) => !img.match(/alt=["'][^"']*["']/i)
    );

    if (imgTags.length === 0) {
      issues.push("No images detected");
    } else if (missingAlt.length > 0) {
      issues.push(`${missingAlt.length} images missing alt text`);
    } else {
      strengths.push("All images contain alt text");
    }

    // PAGE LENGTH CHECK
    const textContent = html.replace(/<[^>]*>/g, "");
    if (textContent.length < 500) {
      issues.push("Page content appears very thin");
    } else {
      strengths.push("Page contains sufficient text content");
    }

    // WEBSITE REACHABLE
    if (response.ok) strengths.push("Website reachable");
    else issues.push("Website not responding correctly");

    // SCORE CALCULATION
    let score = 100 - issues.length * 10;
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