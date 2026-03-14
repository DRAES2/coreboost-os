export async function POST(req: Request) {
  return Response.json({
    businesses: [
      { name: "Desert Valley Plumbing", rating: "4.6", reviews: "48" },
      { name: "Rooter Ranger", rating: "4.7", reviews: "214" },
      { name: "Benjamin Franklin Plumbing", rating: "4.8", reviews: "390" },
    ],
  });
}