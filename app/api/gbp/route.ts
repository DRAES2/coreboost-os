export async function POST(req: Request) {
  try {
    const { keyword, city } = await req.json();

    const businesses = [
      { name: `${keyword} Pro Services`, rating: "4.7", reviews: "134" },
      { name: `${keyword} Experts ${city}`, rating: "4.5", reviews: "82" },
      { name: `${city} Elite ${keyword}`, rating: "4.8", reviews: "201" }
    ];

    return Response.json({ businesses });

  } catch {
    return Response.json({
      businesses: [],
      error: "Failed to scan"
    });
  }
}