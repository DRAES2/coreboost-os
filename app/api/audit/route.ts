export async function POST(req: Request) {
  const { url } = await req.json();

  const visited = new Set<string>();
  const pagesToScan: string[] = [url];

  const issues: string[] = [];
  const strengths: string[] = [];

  async function auditPage(pageUrl: string) {
    try {
      if (visited.has(pageUrl)) return null;
      visited.add(pageUrl);

      const response = await fetch(pageUrl);
      const html = await response.text();

      const pageName = new URL(pageUrl).pathname || "/";

      const titleMatch = html.match(/<title>(.*?)<\/title>/i);
      const metaMatch = html.match(
        /<meta\s+name=["']description["']\s+content=["'](.*?)["']/i
      );

      const h1Matches = html.match(/<h1[^>]*>/gi);
      const h2Matches = html.match(/<h2[^>]*>/gi);

      const imgTags = html.match(/<img [^>]*>/gi) || [];

      const missingAlt = imgTags.filter(
        (img) => !img.match(/alt=["'][^"']*["']/i)
      );

      if (!titleMatch) issues.push(`${pageName} missing title tag`);
      else strengths.push(`${pageName} title detected`);

      if (!metaMatch) issues.push(`${pageName} missing meta description`);
      else strengths.push(`${pageName} meta description found`);

      if (!h1Matches) issues.push(`${pageName} missing H1`);
      if (!h2Matches) issues.push(`${pageName} missing H2 headings`);

      if (imgTags.length === 0) {
        issues.push(`${pageName} no images detected`);
      } else if (missingAlt.length > 0) {
        issues.push(`${pageName} ${missingAlt.length} images missing alt text`);
      }

      const textContent = html.replace(/<[^>]*>/g, "");

      if (textContent.length < 800) {
        issues.push(`${pageName} content may be too thin`);
      }

      if (response.ok) strengths.push(`${pageName} reachable`);

      return html;
    } catch {
      const pageName = new URL(pageUrl).pathname || "/";
      issues.push(`${pageName} failed to load`);
      return null;
    }
  }

  try {
    const homepageHtml = await auditPage(url);

    if (homepageHtml) {
      const linkMatches = homepageHtml.match(/href=["'](.*?)["']/gi) || [];

      const base = new URL(url).origin;

      for (const link of linkMatches) {
        const match = link.match(/href=["'](.*?)["']/i);
        if (!match) continue;

        let foundUrl = match[1];

        if (foundUrl.startsWith("/")) {
          foundUrl = base + foundUrl;
        }

        if (
          foundUrl.startsWith(base) &&
          !visited.has(foundUrl) &&
          pagesToScan.length < 4 &&
          !foundUrl.includes("/_next/") &&
          !foundUrl.includes(".css") &&
          !foundUrl.includes(".js") &&
          !foundUrl.includes(".woff") &&
          !foundUrl.includes(".png") &&
          !foundUrl.includes(".jpg") &&
          !foundUrl.includes(".svg")
        ) {
          pagesToScan.push(foundUrl);
        }
      }
    }

    for (let i = 1; i < pagesToScan.length; i++) {
      await auditPage(pagesToScan[i]);
    }

    let score = 100 - issues.length * 5;
    if (score < 0) score = 0;

    return Response.json({
      pagesScanned: pagesToScan.length,
      score,
      issues,
      strengths
    });

  } catch {
    return Response.json({
      score: 0,
      issues: ["Failed to audit site"],
      strengths: []
    });
  }
}