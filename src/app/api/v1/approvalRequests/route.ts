import { getUserFromSession } from "@/utils/sessions";
import { getApprovalRequests } from "@/data/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
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
    const { searchParams } = new URL(req.url);
    let type = searchParams.get("type");
    if (!type) {
      type = "all";
    } else {
      if (["PENDING", "APPROVED", "REJECTED"].includes(type)) {
      } else {
        return NextResponse.json(
          { message: { message: "Bad Requested" } },
          { status: 400 }
        );
      }
    }
    const approvalRequests = await getApprovalRequests(type);
    return NextResponse.json(approvalRequests, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
