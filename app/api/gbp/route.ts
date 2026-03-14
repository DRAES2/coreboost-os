export async function POST(req: Request) {
  const { keyword, city } = await req.json();

  try {
    const query = `${keyword} ${city}`;
    const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;

    const response = await fetch(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/115 Safari/537.36",
      },
    });

    const html = await response.text();

    const businesses: any[] = [];

    const nameMatches = html.match(/"title":"(.*?)"/g) || [];
    const ratingMatches = html.match(/"rating":([0-9.]+)/g) || [];
    const reviewMatches = html.match(/"reviews":([0-9]+)/g) || [];

    for (let i = 0; i < Math.min(nameMatches.length, 15); i++) {
      const name = nameMatches[i]?.match(/"title":"(.*?)"/)?.[1];
      const rating = ratingMatches[i]?.match(/([0-9.]+)/)?.[1];
      const reviews = reviewMatches[i]?.match(/([0-9]+)/)?.[1];

      if (!name) continue;

      businesses.push({
        name,
        rating: rating || "N/A",
        reviews: reviews || "0",
      });
    }

    return Response.json({
      businesses,
    });
  } catch {
    return Response.json({
      businesses: [],
      error: "Failed to fetch Google Maps results.",
    });
  }
}