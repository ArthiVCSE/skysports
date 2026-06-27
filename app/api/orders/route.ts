import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import Order from "@/lib/models/Order";
import { getErrorMessage } from "@/lib/errors";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // Ensure deliveryDate is handled (the frontend sends it as YYYY-MM-DD string)
    const order = await Order.create({
      userId: body.userId,
      items: body.items,
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
