import ProductModel from "@/models/product"
import { clerkClient, getAuth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from 'cloudinary'
import dbConnect from "@/lib/dbConnetc";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    // const { userId } = await getAuth(req)
    // const clerk = await clerkClient();
    // const user = await clerk.users.getUser(userId!);
    // const isAdmin = user.publicMetadata?.role === 'admin';
    // if (!isAdmin) {
    //   return NextResponse.json({ message: "Unauthorized", success: false }, { status: 403 })
    // }
    const products = await ProductModel.find({});
    return NextResponse.json({ message: "Products fetched successfully!", success: true, products: products }, { status: 200 });
  }
  catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Something went wrong!", success: false }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { userId } = getAuth(req)
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId!);
    const isAdmin = user.publicMetadata?.role === 'admin';
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized", success: false }, { status: 403 })
    }

    const formData = await req.formData();
    const name = formData.get('name') as string;
    const price = parseFloat(formData.get('price') as string);
    const description = formData.get('description') as string;
    const quantity = parseInt(formData.get('quantity') as string, 10);
    const image = formData.get('image') as File;
    console.log(image);

    let imgUrl = '';
    if (image) {
      const buffer = await image.arrayBuffer();
      const base64Image = Buffer.from(buffer).toString('base64');
      const dataURI = `data:${image.type};base64,${base64Image}`;

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(dataURI, {
          folder: 'products',
        }, (error, result) => {
          if (error) {
            reject(error)
            console.log(error)
          }
          else resolve(result);
        });
      });
      imgUrl = (result as any).secure_url;
      console.log(imgUrl)
    }

    const newProduct = new ProductModel({
      name,
      price,
      description,
      quantity,
      imgUrl
    });

    await newProduct.save();

    return NextResponse.json({ message: "Product added successfully", success: true }, { status: 201 })
  }
  catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Something went wrong", success: false }, { status: 500 })
  }
}