import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Product } from "@/model/Product";
import { User } from "@/model/User";
import bcrypt from "bcryptjs";

const initialProducts = [
  { id: 1, name: "Pro Running Shoes X9", price: 129, originalPrice: 179, rating: 4.5, reviews: 234, category: "Footwear", badge: "Best Seller", imageUrl: "/placeholder.png" },
  { id: 2, name: "Elite Football", price: 49, originalPrice: 69, rating: 4.8, reviews: 187, category: "Football", badge: "Sale", imageUrl: "/placeholder.png" },
  { id: 3, name: "Carbon Tennis Racket", price: 199, rating: 4.7, reviews: 98, category: "Tennis", imageUrl: "/placeholder.png" },
  { id: 4, name: "Speed Basketball", price: 65, originalPrice: 85, rating: 4.6, reviews: 143, category: "Basketball", badge: "New", imageUrl: "/placeholder.png" },
  { id: 5, name: "Compression Jersey", price: 39, rating: 4.3, reviews: 312, category: "Apparel", imageUrl: "/placeholder.png" },
  { id: 6, name: "Swim Goggles Pro", price: 28, originalPrice: 42, rating: 4.4, reviews: 76, category: "Swimming", badge: "Sale", imageUrl: "/placeholder.png" },
  { id: 7, name: "Yoga Mat Ultra Grip", price: 55, rating: 4.9, reviews: 421, category: "Fitness", badge: "Top Rated", imageUrl: "/placeholder.png" },
  { id: 8, name: "Cycling Helmet R3", price: 145, originalPrice: 195, rating: 4.6, reviews: 89, category: "Cycling", imageUrl: "/placeholder.png" },
];

export async function GET() {
  try {
    await connectDB();
    await Product.deleteMany({});
    await Product.insertMany(initialProducts);

    // Create an admin user
    await User.deleteMany({});
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await User.create({
      email: "admin@skysports.com",
      password: hashedPassword,
      role: "admin",
    });

    return NextResponse.json({ message: "Database seeded successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
