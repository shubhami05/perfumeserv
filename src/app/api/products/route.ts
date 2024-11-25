import dbConnect from "@/lib/dbConnetc";
import ProductModel from "@/models/product";
import { NextRequest, NextResponse } from "next/server"


export async function GET(req: NextRequest) {
    try {
      await dbConnect();
      const products = await ProductModel.find({});
      return NextResponse.json({ message: "Products fetched successfully!", success: true, products: products }, { status: 200 })
    }
    catch (error) {
      console.log(error)
      return NextResponse.json({ message: "Something went wrong", success: false }, { status: 500 })
    }
  }
  