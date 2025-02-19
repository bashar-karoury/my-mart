import { productSchema } from "@/utils/validation";
import prisma from "./prismaClient";
import { User_t, GetUser_t } from "@/utils/types";
import { Product } from "@prisma/client";

export async function addUser(user: User_t) {
  try {
    return await prisma.user.create({
      data: user,
    });
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
}

export async function getUser(userInfo: GetUser_t) {
  try {
    return await prisma.user.findUnique({
      where: userInfo,
    });
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
}

export async function getProducts(
  params: {
    name?: string;
    priceLt?: number;
    priceGt?: number;
    priceGte?: number;
    priceLte?: number;
    sort?: string;
    limit?: number;
    offset?: number;
  } = {}
) {
  try {
    console.log("params=", params);
    let {
      name,
      priceLt,
      priceGt,
      priceGte,
      priceLte,
      sort = "name",
      limit = 10,
      offset = 0,
    } = params;

    const where = {
      ...(name && { name: { contains: name } }),
      ...(priceLt && { price: { lt: priceLt } }),
      ...(priceGt && { price: { gt: priceGt } }),
      ...(priceGte && { price: { gte: priceGte } }),
      ...(priceLte && { price: { lte: priceLte } }),
    };
    let orderBy: { [key: string]: string } = { ["name"]: "asc" };

    let sortedBy = sort;
    if (sort && sort[0] === "-") {
      sortedBy = sort.substring(1);
      orderBy = { [sortedBy]: "desc" };
    } else {
      orderBy = { [sortedBy]: "asc" };
    }
    console.log("limit", limit);
    console.log("offset", offset);
    return await prisma.product.findMany({
      where,
      orderBy,
      take: limit,
      skip: offset,
    });
  } catch (error) {
    console.error("Error getting products:", error);
    throw error;
  }
}

export async function createProduct(productData: Product) {
  try {
    return await prisma.product.create({
      data: productData,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}

export async function editProduct(productId: number, productData: Product) {
  try {
    return await prisma.product.update({
      where: { id: productId },
      data: productData,
    });
  } catch (error) {
    console.error("Error editing product:", error);
    throw error;
  }
}

export async function deleteProduct(productId: number) {
  try {
    return await prisma.product.delete({
      where: { id: productId },
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}

export async function getProduct(productId: number) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    return product;
  } catch (error) {
    console.error("Error getting product:", error);
    throw error;
  }
}
