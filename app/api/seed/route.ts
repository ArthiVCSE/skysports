import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import { Product } from "@/lib/models/Product";
import { products } from "@/lib/data";

export async function GET() {
  try {
    await dbConnect();
    
    // Clear existing products
    await Product.deleteMany({});
    
    // Insert new products from data.ts
    const inserted = await Product.insertMany(products);
    
    return NextResponse.json({ 
      success: true, 
      message: `Successfully seeded ${inserted.length} products to database.` 
    }, { status: 200 });
  } catch (error: any) {
    console.error("Seeding error:", error);
    return NextResponse.json({ error: error.message || "Failed to seed database" }, { status: 500 });
  }
}
