import { getUserFromSession } from "@/utils/sessions";
import { NextRequest, NextResponse } from "next/server";
import { getProduct, editProduct, deleteProduct } from "@/data/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromSession();

    if (!user) {
      return NextResponse.json(
        { message: { message: "Not Authorized" } },
        { status: 401 }
      );
    }

    const { id } = await params;
    const productId = parseInt(id);
    if (isNaN(productId)) {
      return NextResponse.json({ message: "Bad Request" }, { status: 400 });
    }
    const product = await getProduct(productId);
    if (!product) {
      return NextResponse.json(
        { message: "Product Not Found" },
        { status: 404 }
      );
    }
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.log("error ", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromSession();

    if (!user) {
      return NextResponse.json(
        { message: { message: "Not Authorized" } },
        { status: 401 }
      );
    }

    const { id } = await params;
    const productId = parseInt(id);
    if (isNaN(productId)) {
      return NextResponse.json({ message: "Bad Request" }, { status: 400 });
    }
    const productData = await request.json();
    const updatedProduct = await editProduct(productId, productData);

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.log("error ", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromSession();

    if (!user) {
      return NextResponse.json(
        { message: { message: "Not Authorized" } },
        { status: 401 }
      );
    }

    const { id } = await params;
    const productId = parseInt(id);
    if (isNaN(productId)) {
      return NextResponse.json({ message: "Bad Request" }, { status: 400 });
    }
    const result = await deleteProduct(productId);
    if (!result) {
      return NextResponse.json(
        { message: "Product Not Found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Product deleted" }, { status: 200 });
  } catch (error) {
    console.log("error ", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
