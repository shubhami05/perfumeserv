import ProductModel from "@/models/product"
import { clerkClient, getAuth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from 'cloudinary'



export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = getAuth(req)
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId!);
    const isAdmin = user.publicMetadata?.role === 'admin';
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized", success: false }, { status: 403 })
    }
    const product = await ProductModel.findById(params.id);

    if(!product){
    return NextResponse.json({ message: "Product not found", success: false }, { status: 404 })
    }
    const id = await params.id;
    await ProductModel.findByIdAndDelete(id);
    return NextResponse.json({ message: "Products deleted successfully!", success: true }, { status: 200 })
  }
  catch (error) {
    console.log(error)
    return NextResponse.json({ message: "Something went wrong", success: false }, { status: 500 })
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = getAuth(req)
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId!);
    const isAdmin = user.publicMetadata?.role === 'admin';
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized", success: false }, { status: 403 })
    }
    const product = await ProductModel.findById(params.id);
    return NextResponse.json({ message: "Product fetched successfully!", success: true, product: product }, { status: 200 })
  }
  catch (error) {
    console.log(error)
    return NextResponse.json({ message: "Something went wrong", success: false }, { status: 500 })
  }
}



// Existing DELETE function...

// Existing GET function...

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = getAuth(req);
    const clerk = await clerkClient();
    const user = await clerk.users.getUser (userId!);
    const isAdmin = user.publicMetadata?.role === 'admin';
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized", success: false }, { status: 403 });
    }

    const formData = await req.formData();
    const id = await params.id;

    const product = await ProductModel.findById(id);

    if (!product) {
      return NextResponse.json({ message: "Product not found", success: false }, { status: 404 });
    }

    // Function to update fields
    const updateFields = (field: string, value: any) => {
      if (value !== null && value !== undefined && value !== '') {
        if (field === 'price') {
          product.price = parseFloat(value);
        } else if (field === 'quantity') {
          product.quantity = parseInt(value, 10);
        } else {
          product[field] = value;
        }
      }
    };

    // Update product fields from form data
    updateFields('name', formData.get('name'));
    updateFields('description', formData.get('description'));
    updateFields('price', formData.get('price'));
    updateFields('quantity', formData.get('quantity'));

    // Handle image upload if a new image is provided
    const newImage = formData.get('image') as File;
    if (newImage) {
      const buffer = await newImage.arrayBuffer();
      const base64Image = Buffer.from(buffer).toString('base64');
      const dataURI = `data:${newImage.type};base64,${base64Image}`;

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(dataURI, { folder: 'products' }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        });
      });

      // Update the image URL in the product
      product.imgUrl = (result as any).secure_url; // Update to the new image URL
    }

    await product.save(); // Save the product after all updates

    return NextResponse.json({ message: "Product updated successfully!", success: true, product }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Something went wrong", success: false }, { status: 500 });
  }
}
