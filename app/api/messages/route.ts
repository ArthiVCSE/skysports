import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Message } from "@/model/Message";
import { getErrorMessage } from "@/lib/errors";

export async function GET() {
  try {
    await connectDB();
    const messages = await Message.find().sort({ createdAt: -1 });
    return NextResponse.json(messages);
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const newMessage = new Message(body);
    await newMessage.save();
    return NextResponse.json(newMessage, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
