import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Product } from "@/model/Product";

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
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      if (decoded.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    } catch (err) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    
    // Auto-increment ID simply for this example
    const lastProduct = await Product.findOne().sort({ id: -1 });
    const nextId = lastProduct ? lastProduct.id + 1 : 1;
    
    const newProduct = new Product({
      ...body,
      id: nextId,
    });
    
    await newProduct.save();
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
