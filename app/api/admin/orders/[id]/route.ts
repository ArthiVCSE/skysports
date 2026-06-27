import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import Order from "@/lib/models/Order";
import { User } from "@/model/User";
import { getErrorMessage } from "@/lib/errors";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "@/lib/types/auth";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token =
    cookieStore.get("admin_token")?.value ||
    cookieStore.get("token")?.value;

  if (!token) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    await dbConnect();
    const user = await User.findById(decoded.id);
    if (!user || user.role !== "admin") {
      return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
    }
    return { decoded, user };
  } catch {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const order = await Order.findByIdAndUpdate(
      id,
      { status: body.status },
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
