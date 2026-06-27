import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/lib/mongoose";
import { Product } from "@/lib/models/Product";
import Order from "@/lib/models/Order";
import { User } from "@/model/User";
import { getErrorMessage } from "@/lib/errors";
import type { JwtPayload } from "@/lib/types/auth";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value || cookieStore.get("token")?.value;

  if (!token) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    await dbConnect();
    const user = await User.findById(decoded.id);

    if (!user || user.role !== "admin") {
      return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
    }

    return { user };
  } catch {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
}

export async function GET() {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const [productCount, orders, productsByCategory] = await Promise.all([
      Product.countDocuments(),
      Order.find({}).sort({ createdAt: -1 }).lean(),
      Product.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1, _id: 1 } },
      ]),
    ]);

    const totalRevenue = orders
      .filter((order) => order.status === "delivered")
      .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

    const pendingOrders = orders.filter((order) => order.status === "pending").length;
    const activeOrders = orders.filter((order) => order.status !== "delivered").length;
    const itemsSold = orders
      .filter((order) => order.status === "delivered")
      .reduce(
        (sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + Number(item.quantity || 0), 0),
        0
      );

    const recentOrders = orders.slice(0, 5).map((order) => ({
      id: String(order._id),
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
      itemCount: order.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    }));

    return NextResponse.json({
      success: true,
      stats: {
        productCount,
        orderCount: orders.length,
        totalRevenue,
        pendingOrders,
        activeOrders,
        itemsSold,
        productsByCategory: productsByCategory.map((category) => ({
          category: category._id || "Uncategorized",
          count: category.count,
        })),
        recentOrders,
      },
    });
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
