import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Product } from "@/model/Product";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
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
    const resolvedParams = await params;
    const updatedProduct = await Product.findOneAndUpdate(
      { id: parseInt(resolvedParams.id) },
      body,
      { new: true }
    );
    
    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
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
    const resolvedParams = await params;
    const deletedProduct = await Product.findOneAndDelete({ id: parseInt(resolvedParams.id) });
    
    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
