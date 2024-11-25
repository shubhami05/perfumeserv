
import ProductModel from "@/models/product";
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = await params.id;
    const product = await ProductModel.findById(id);
    return NextResponse.json({ message: "Product fetched successfully!", success: true, product: product }, { status: 200 })
  }
  catch (error) {
    console.log(error)
    return NextResponse.json({ message: "Something went wrong", success: false }, { status: 500 })
  }
}