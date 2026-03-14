export async function GET() {
  return Response.json({
    status: "GBP API running"
  });
}
export async function POST(req: Request) {
  try {
    const { keyword, city } = await req.json();

    const businesses = [
      {
        name: `${keyword} Services ${city}`,
        rating: "4.7",
        reviews: "132",
      },
      {
        name: `${city} Elite ${keyword}`,
        rating: "4.5",
        reviews: "89",
      },
      {
        name: `${keyword} Experts`,
        rating: "4.8",
        reviews: "215",
      },
    ];

    return Response.json({
      businesses,
    });

  } catch (err) {
    console.error(err);

    return Response.json({
      businesses: [],
    });
  }
}