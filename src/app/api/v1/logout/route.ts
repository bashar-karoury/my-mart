import { NextRequest, NextResponse } from "next/server";
import { deleteSession } from "@/utils/sessions";

export async function GET(req: NextRequest) {
  try {
    await deleteSession();
    return NextResponse.json(
      { message: "Successfully logged out" },
      { status: 200 }
    );
  } catch (error) {
    console.log("error ", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
