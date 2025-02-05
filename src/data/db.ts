import prisma from "./prismaClient";
import { User_t, GetUser_t } from "@/utils/types";
export async function addUser(user: User_t) {
  return await prisma.user.create({
    data: user,
  });
}

export async function getUser(userInfo: GetUser_t) {
  return await prisma.user.findUnique({
    where: userInfo,
  });
}
