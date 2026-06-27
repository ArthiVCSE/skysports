import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import { Product } from "@/lib/models/Product";
import { getErrorMessage } from "@/lib/errors";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const product = await Product.findOne({ id: Number(resolvedParams.id) });
    
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
