import bcrypt from "bcrypt";
import { userLoginSchema } from "@/utils/validation";
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/data/db";
import { createSession } from "@/utils/sessions";

export async function POST(req: NextRequest) {
  try {
    let userInfo = await req.json();
    const result = userLoginSchema.safeParse(userInfo);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.format() },
        { status: 400 }
      );
    }
    userInfo = result.data;
    const existingUser = await getUser({ email: userInfo.email });
    if (!existingUser) {
      return NextResponse.json(
        { error: "No with this email exists" },
        { status: 400 }
      );
    }
    // console.log("user form db", existingUser);
    const { password } = userInfo;
    const isPasswordValid: boolean = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    await createSession(String(existingUser?.id));
    return NextResponse.json(
      { message: "login completed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("error ", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
