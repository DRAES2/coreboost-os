export async function GET() {
  return Response.json({
    status: "GBP API running"
  });
}
export async function POST(req: Request) {
  try {
    const { keyword, city } = await req.json();

    const query = encodeURIComponent(`${keyword} ${city}`);

    const url =
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}`;

    const res = await fetch(url);
    const data = await res.json();

    const businesses =
      data.results?.map((place: any) => ({
        name: place.name,
        rating: place.rating ?? "N/A",
        reviews: place.user_ratings_total ?? "N/A",
      })) || [];

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