import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Product } from "@/model/Product";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getErrorMessage } from "@/lib/errors";
import type { JwtPayload } from "@/lib/types/auth";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

function requireAdmin(token: string | undefined) {
  if (!token) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    if (decoded.role !== "admin") {
      return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
    }
    return { decoded };
  } catch {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
}

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let query = {};
    if (category && category !== "All") {
      query = { category };
    }

    const products = await Product.find(query).sort({ id: 1 });
    return NextResponse.json(products);
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const auth = requireAdmin(cookieStore.get("admin_token")?.value);
    if (auth.error) return auth.error;

    await connectDB();
    const body = await request.json();

    const lastProduct = await Product.findOne().sort({ id: -1 });
    const nextId = lastProduct ? lastProduct.id + 1 : 1;

    const newProduct = new Product({
      ...body,
      id: nextId,
    });

    await newProduct.save();
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
