import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import { Cart } from "@/lib/models/Cart";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "@/lib/types/auth";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

function getUserIdFromToken(request: Request): string | null {
  try {
    // Attempt to get token from Authorization header or cookies
    const cookieStore = cookies();
    let token = cookieStore.get("token")?.value;
    
    if (!token) {
      const authHeader = request.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }
    
    if (!token) return null;
    
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded.id;
  } catch (err) {
    return null;
  }
}

export async function GET(request: Request) {
  try {
    await dbConnect();
    const userId = getUserIdFromToken(request);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    return NextResponse.json({ success: true, cart });
  } catch (error: any) {
    console.error("Cart GET error:", error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const userId = getUserIdFromToken(request);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items } = await request.json();
    
    let cart = await Cart.findOne({ userId });
    if (cart) {
      cart.items = items;
      await cart.save();
    } else {
      cart = await Cart.create({ userId, items });
    }

    return NextResponse.json({ success: true, cart });
  } catch (error: any) {
    console.error("Cart POST error:", error);
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
  }
}
