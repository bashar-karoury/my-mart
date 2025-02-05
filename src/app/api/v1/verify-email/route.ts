import { NextRequest, NextResponse } from "next/server";
import { getCache, deleteCache } from "@/utils/cache";
import { addUser } from "@/data/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const cachedValue = await getCache(token);
    if (!cachedValue) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }
    console.log("cached value", cachedValue);
    const userToBeSignuped = JSON.parse(cachedValue);
    const result = await addUser(userToBeSignuped);

    console.log("result of db saving", result);
    // delete verification token from cache
    await deleteCache(token);

    return NextResponse.json(
      { message: "Signup process initiated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("error ", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
