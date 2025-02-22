import { NextRequest, NextResponse } from "next/server";
import { passwordScheme } from "@/utils/validation";
import { deleteCache, getCache } from "@/utils/cache";
import { getUser, updateUser } from "@/data/db";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const { newPassword, token } = await req.json();
    console.log("new password", newPassword);

    const parsedData = passwordScheme.safeParse(newPassword);
    console.log("parsedData", parsedData);
    if (!parsedData.success) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    const emailFromCache = await getCache(token);
    if (!emailFromCache) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }
    console.log("emailFromCache value", emailFromCache);
    // hash the password first
    const hashedPassword: string = await bcrypt.hash(newPassword, 10);
    const result = await updateUser(emailFromCache, {
      password: hashedPassword,
    });

    console.log("result of db updating", result);
    // delete reset token from cache
    await deleteCache(token);
    return NextResponse.json(
      { message: "Reset password token has been sent to your email" },
      { status: 200 }
    );
  } catch (error) {
    console.log("error ", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
