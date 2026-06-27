import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import { Product } from "@/lib/models/Product";
import { User } from "@/model/User";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getErrorMessage } from "@/lib/errors";
import type { JwtPayload } from "@/lib/types/auth";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token =
    cookieStore.get("admin_token")?.value ||
    cookieStore.get("token")?.value;

  if (!token) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

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

// GET — public
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const product = await Product.findOne({ id: Number(id) });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

// PUT — admin only
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

    const product = await Product.findOneAndUpdate(
      { id: Number(id) },
      body,
      { new: true }
    );

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

// DELETE — admin only
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    await dbConnect();
    const { id } = await params;
    const product = await Product.findOneAndDelete({ id: Number(id) });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
