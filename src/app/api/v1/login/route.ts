import bcrypt from "bcrypt";
import { userLoginSchema } from "@/utils/validation";
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/data/db";
import { createSession } from "@/utils/sessions";

export async function POST(req: NextRequest) {
  try {
    let userInfo = await req.json();
    // console.log("userInfo", userInfo);
    const result = userLoginSchema.safeParse(userInfo);
    // console.log("result after parsing", result);

    if (!result.success) {
      // console.log("Validation Errors:", result.error.format());
      return NextResponse.json(
        { error: result.error.format() },
        { status: 400 }
      );
    }
    // console.log("Valid Data:", result.data);
    userInfo = result.data;
    const existingUser = await getUser({ email: userInfo.email });
    if (!existingUser) {
      return NextResponse.json(
        { error: "No with this email exists" },
        { status: 400 }
      );
    }
    console.log("user form db", existingUser);
    const { password } = userInfo;
    const isPasswordValid: boolean = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    // create session
    const session_id = await createSession(existingUser.id);
    if (!session_id) {
      throw new Error("session creation problem");
    }

    const response = NextResponse.json(
      { message: "Login completed successfully" },
      { status: 200 }
    );
    response.cookies.set("session_id", session_id, {
      httpOnly: true, // Prevents JavaScript access (XSS protection)
      secure: true, // Ensures cookies are sent over HTTPS only
      sameSite: "strict", // Prevents CSRF
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
    });
    return response;
  } catch (error) {
    console.log("error ", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
