export async function POST(req: Request) {
  const { url } = await req.json();

  try {
    const response = await fetch(url);
    const html = await response.text();

    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const metaMatch = html.match(
      /<meta\s+name=["']description["']\s+content=["'](.*?)["']/i
    );

    const title = titleMatch ? titleMatch[1] : null;
    const meta = metaMatch ? metaMatch[1] : null;

    const issues = [];
    const strengths = [];

    if (!title) issues.push("Missing page title");
    else strengths.push("Title tag detected");

    if (!meta) issues.push("Missing meta description");
    else strengths.push("Meta description found");

    if (response.ok) strengths.push("Website reachable");
    else issues.push("Website not responding correctly");

    const score = 100 - issues.length * 10;

    return Response.json({
      score,
      issues,
      strengths,
    });
  } catch {
    return Response.json({
      error: "Failed to audit site",
    });
  }
}