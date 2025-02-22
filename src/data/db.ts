import prisma from "./prismaClient";
import { Prisma, Product, User, ApprovalRequest } from "@prisma/client";
import { GetUser_t } from "@/utils/types";

export async function addUser(user: User) {
  try {
    return await prisma.user.create({
      data: user,
    });
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
}

export async function updateUser(email: string, userInfo: GetUser_t) {
  try {
    return await prisma.user.update({
      where: { email },
      data: userInfo,
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
      console.log("order desc", orderBy);
    } else {
      orderBy = { [sortedBy]: "asc" };
      console.log("order asc", orderBy);
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
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === "P2025") {
        return null;
      }
    }
    console.error("Error editing product:", e);
    throw e;
  }
}
export async function deleteProduct(productId: number) {
  try {
    return await prisma.product.delete({
      where: { id: productId },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === "P2025") {
        return null;
      }
    }
    console.error("Error deleting product:", e);
    throw e;
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

export async function createApprovalRequest(request: ApprovalRequest) {
  try {
    const result = await prisma.approvalRequest.create({ data: request });
    return result;
  } catch (error) {
    console.error("Error creating approval request:", error);
    throw error;
  }
}

export async function getApprovalRequests(type: string) {
  let result = null;
  try {
    if (type === "all") {
      result = await prisma.approvalRequest.findMany();
    } else {
      result = await prisma.approvalRequest.findMany({
        where: { status: type },
      });
    }
    return result;
  } catch (error) {
    console.error("Error getting approval requests:", error);
    throw error;
  }
}
export async function updateApprovalRequest(
  id: number,
  adminId: number,
  newStatus: string
) {
  try {
    if (!["APPROVED", "REJECTED"].includes(newStatus)) {
      throw new Error("newStatus wrong type");
    }

    let result = await prisma.approvalRequest.update({
      where: { id },
      data: { status: newStatus, adminId: adminId },
    });
    const newSeller = JSON.parse(result.data);
    result = await addUser(newSeller);

    console.log("result of db saving", result);
    return result;
  } catch (error) {
    console.error("Error updating approval request:", error);
    throw error;
  }
}
