import { getUserFromSession } from "@/utils/sessions";
import { updateApprovalRequest } from "@/data/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ reqId: string }> }
) {
  try {
    const user = await getUserFromSession();

    if (!user) {
      return NextResponse.json(
        { message: { message: "Not Authorized" } },
        { status: 401 }
      );
    }

    if (user.role !== "Admin") {
      return NextResponse.json(
        { message: { message: "Forbidden" } },
        { status: 403 }
      );
    }
    console.log("User :", user);

    const { reqId } = await params;
    console.log("id", reqId);
    const { newStatus } = await req.json();
    console.log("newStatus", newStatus);
    const id = Number(reqId);
    if (!newStatus || !reqId || isNaN(id)) {
      return NextResponse.json(
        { message: { message: "Bad Request" } },
        { status: 400 }
      );
    }

    const result = await updateApprovalRequest(id, user.id, newStatus);
    return NextResponse.json(
      { message: "approval request updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
