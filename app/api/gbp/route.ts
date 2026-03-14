export async function GET() {
  return Response.json({
    status: "GBP API running"
  });
}
export async function POST(req: Request) {
  try {
    const { keyword, city } = await req.json();

    const query = encodeURIComponent(`${keyword} in ${city}`);

    const url = `https://www.google.com/search?q=${query}&hl=en`;

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      },
    });

    const html = await res.text();

    const matches = [...html.matchAll(/<h3[^>]*>(.*?)<\/h3>/g)];

    const businesses = matches.slice(0, 20).map((m) => ({
      name: m[1].replace(/<[^>]+>/g, ""),
      rating: "N/A",
      reviews: "N/A",
    }));

    return Response.json({
      businesses,
      nextStart: 20,
    });
  } catch (err) {
    console.error(err);

    return Response.json({
      businesses: [],
      nextStart: 0,
      error: "scanner failed",
    });
  }
}