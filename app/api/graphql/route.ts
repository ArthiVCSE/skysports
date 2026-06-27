import { NextResponse } from "next/server";

// GraphQL via apollo-server-micro is not compatible with the App Router.
// REST auth and product APIs under /api/auth and /api/products are used instead.
export async function POST() {
  return NextResponse.json(
    { error: "GraphQL is not available. Use REST endpoints under /api." },
    { status: 501 }
  );
}

export async function GET() {
  return NextResponse.json(
    { error: "GraphQL is not available. Use REST endpoints under /api." },
    { status: 501 }
  );
}
