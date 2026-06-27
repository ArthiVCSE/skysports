import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import Order from "@/lib/models/Order";
import { getErrorMessage } from "@/lib/errors";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "@/lib/types/auth";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

async function getUserIdFromCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || cookieStore.get("admin_token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded.id;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const userId = await getUserIdFromCookie();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const items = Array.isArray(body.items) ? body.items : [];

    if (items.length === 0) {
      return NextResponse.json({ error: "Order must include at least one item" }, { status: 400 });
    }
    
    // Ensure deliveryDate is handled (the frontend sends it as YYYY-MM-DD string)
    const order = await Order.create({
      userId,
      items,
      totalAmount: body.totalAmount,
      paymentMethod: body.paymentMethod,
      deliveryDate: body.deliveryDate ? new Date(body.deliveryDate) : undefined,
      status: "pending"
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error: unknown) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: getErrorMessage(error, "Failed to create order") },
      { status: 500 }
    );
  }
}
