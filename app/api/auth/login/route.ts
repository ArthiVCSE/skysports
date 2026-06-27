import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/model/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { getErrorMessage } from "@/lib/errors";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    // Find existing user
    let user = await User.findOne({ email });

    if (!user) {
      // Auto-create user for first‑time login (demo convenience)
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = new User({
        name: email.split('@')[0],
        email,
        password: hashedPassword,
        role: email === 'admin@skysports.com' ? 'admin' : 'user',
      });
      await newUser.save();
      user = await User.findOne({ email });
    } else {
      // Verify provided password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
      
      // Auto-upgrade to admin for testing
      if (email === 'admin@skysports.com' && user.role !== 'admin') {
        user.role = 'admin';
        await user.save();
      }
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    const cookieStore = await cookies();
    cookieStore.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return NextResponse.json({ message: "Logged in successfully", token }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
