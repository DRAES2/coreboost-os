export async function POST(req: Request) {
  const { url } = await req.json();

  const visited = new Set<string>();
  const pagesToScan: string[] = [url];

  const issues: string[] = [];
  const strengths: string[] = [];

  async function auditPage(pageUrl: string) {
    try {
      const response = await fetch(pageUrl);
      const html = await response.text();

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

      if (!titleMatch) issues.push(`${pageUrl} missing title tag`);
      else strengths.push(`${pageUrl} title detected`);

      if (!metaMatch) issues.push(`${pageUrl} missing meta description`);
      else strengths.push(`${pageUrl} meta description found`);

      if (!h1Matches) issues.push(`${pageUrl} missing H1`);
      if (!h2Matches) issues.push(`${pageUrl} missing H2 headings`);

      if (imgTags.length === 0) {
        issues.push(`${pageUrl} no images detected`);
      } else if (missingAlt.length > 0) {
        issues.push(`${pageUrl} ${missingAlt.length} images missing alt text`);
      }

      const textContent = html.replace(/<[^>]*>/g, "");
      if (textContent.length < 800) {
        issues.push(`${pageUrl} content may be too thin`);
      }

      if (response.ok) strengths.push(`${pageUrl} reachable`);

      return html;
    } catch {
      issues.push(`${pageUrl} failed to load`);
      return null;
    }
  }

  try {
    // scan homepage first
    const homepageHtml = await auditPage(url);

    if (homepageHtml) {
      const linkMatches =
        homepageHtml.match(/href=["'](.*?)["']/gi) || [];

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
          pagesToScan.length < 4
        ) {
          pagesToScan.push(foundUrl);
          visited.add(foundUrl);
        }
      }
    }

    // scan additional pages
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