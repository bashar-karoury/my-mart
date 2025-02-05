import bcrypt from "bcrypt";
import sendVerificationEmail from "@/utils/userVerification";
import { userSignUpSchema } from "@/utils/validation";
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/data/db";

export async function POST(req: NextRequest) {
  try {
    let userInfo = await req.json();
    console.log("userInfo", userInfo);
    const result = userSignUpSchema.safeParse(userInfo);
    console.log("result after parsing", result);

    if (!result.success) {
      console.log("Validation Errors:", result.error.format());
      return NextResponse.json(
        { error: result.error.format() },
        { status: 400 }
      );
    }
    console.log("Valid Data:", result.data);
    userInfo = result.data;
    const existingUser = await getUser({ email: userInfo.email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const { password } = userInfo;
    const hashedPassword: string = await bcrypt.hash(password, 10);
    userInfo.password = hashedPassword;
    await sendVerificationEmail(userInfo);

    return NextResponse.json(
      { message: "Signup process initiated successfully, verify from email" },
      { status: 200 }
    );
  } catch (error) {
    console.log("error ", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
