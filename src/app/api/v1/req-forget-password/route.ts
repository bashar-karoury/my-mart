import { NextRequest, NextResponse } from "next/server";
import sendResetPasswordEmail from "@/utils/resetPassword";
import { emailSchema } from "@/utils/validation";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    const parsedData = emailSchema.safeParse({ email });

    if (!parsedData.success) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }
    await sendResetPasswordEmail(email);
    return NextResponse.json(
      { message: "Reset password token has been sent to your email" },
      { status: 200 }
    );
  } catch (error) {
    console.log("error ", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
