export async function GET() {
  return Response.json({
    status: "GBP API running"
  });
}
export async function POST(req: Request) {
  try {
    const { keyword, city, start = 0 } = await req.json();

    const query = `${keyword} ${city}`;
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&start=${start}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/115 Safari/537.36",
      },
    });

    const html = await response.text();

    const businesses: any[] = [];

    const nameMatches = html.match(/<h3[^>]*>(.*?)<\/h3>/g) || [];

    for (let i = 0; i < nameMatches.length; i++) {
      const name = nameMatches[i]
        .replace(/<[^>]+>/g, "")
        .trim();

      businesses.push({
        name,
        rating: "N/A",
        reviews: "N/A",
      });
    }

    return Response.json({
      businesses,
      nextStart: start + 20,
    });

  } catch {
    return Response.json({
      businesses: [],
      error: "Failed to scan",
    });
  }
}