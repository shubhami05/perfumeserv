import OrderModel from "@/models/order";
import ProductModel from "@/models/product"
import { clerkClient, getAuth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req)
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId!);
    const isAdmin = user.publicMetadata?.role === 'admin';
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized", success: false }, { status: 403 })
    }
    const orders = await OrderModel.find({});
    return NextResponse.json({ message: "Orders fetched successfully!", success: true, orders: orders }, { status: 200 })
  }
  catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Something went wrong", success: false }, { status: 500 })
  }
}
