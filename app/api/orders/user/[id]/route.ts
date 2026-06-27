import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import Order from "@/lib/models/Order";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "@/lib/types/auth";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

async function getAuthPayload() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || cookieStore.get("admin_token")?.value;
  if (!token) return null;

  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const auth = await getAuthPayload();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (auth.id !== id && auth.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const orders = await Order.find({ userId: id }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, orders }, { status: 200 });
  } catch (error: unknown) {
    console.error("Fetch user orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
