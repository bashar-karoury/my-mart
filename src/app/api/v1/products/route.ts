import { getUserFromSession } from "@/utils/sessions";
import { NextResponse } from "next/server";
import { getFilteredProducts } from "@/services/products";
import { createProduct, getProducts } from "@/data/db";

export async function GET(request) {
  try {
    const user = await getUserFromSession();

    if (!user) {
      return NextResponse.json(
        { message: { message: "Not Authorized" } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    const priceLt = searchParams.get("price[lt]");
    const priceGt = searchParams.get("price[gt]");
    const priceGte = searchParams.get("price[gte]");
    const priceLte = searchParams.get("price[lte]");
    const sort = searchParams.get("sort");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");

    const products = await getProducts({
      name,
      priceLt,
      priceGt,
      priceGte,
      priceLte,
      sort,
      limit,
      offset,
    });
    console.log("products", products);

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.log("error ", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getUserFromSession();

    if (!user) {
      return NextResponse.json(
        { message: { message: "Not Authorized" } },
        { status: 401 }
      );
    }

    const productData = await request.json();
    const newProduct = await createProduct(productData);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.log("error ", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
