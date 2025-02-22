import { getUserFromSession } from "@/utils/sessions";
import { NextResponse, NextRequest } from "next/server";
import { createProduct, getProducts } from "@/data/db";
import { productSchema } from "@/utils/validation";

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromSession();
    console.log("user", user);
    if (!user) {
      return NextResponse.json(
        { message: { message: "Not Authorized" } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name")?.trim();
    const priceLt = parseFloat(searchParams.get("price[lt]") || "");
    const priceGt = parseFloat(searchParams.get("price[gt]") || "");
    const priceGte = parseFloat(searchParams.get("price[gte]") || "");
    const priceLte = parseFloat(searchParams.get("price[lte]") || "");
    const sort = searchParams.get("sort")?.trim();
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    // Validate and sanitize parameters
    const validSortFields = ["name", "price", "-name", "-price"];
    const sanitizedSort =
      sort && validSortFields.includes(sort) ? sort : "name";

    const products = await getProducts({
      name,
      priceLt: isNaN(priceLt) ? undefined : priceLt,
      priceGt: isNaN(priceGt) ? undefined : priceGt,
      priceGte: isNaN(priceGte) ? undefined : priceGte,
      priceLte: isNaN(priceLte) ? undefined : priceLte,
      sort: sanitizedSort,
      limit: isNaN(limit) ? 10 : limit,
      offset: isNaN(offset) ? 0 : offset,
    });
    console.log("products", products);

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.log("error ", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromSession();

    if (!user) {
      return NextResponse.json(
        { message: { message: "Not Authorized" } },
        { status: 401 }
      );
    }

    const productData = await request.json();
    const validatedData = productSchema.safeParse(productData);
    if (!validatedData.success) {
      console.log("Validation Errors:", validatedData.error.format());
      return NextResponse.json(
        { error: validatedData.error.format() },
        { status: 400 }
      );
    }
    const newProduct = await createProduct(productData);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.log("error ", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
