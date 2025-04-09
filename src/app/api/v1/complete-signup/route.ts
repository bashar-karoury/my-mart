import { NextRequest, NextResponse } from "next/server";
import { getCache, deleteCache } from "@/utils/cache";
import { addUser, createApprovalRequest } from "@/data/db";
import { createAccount, generateOnboardingLink } from "@/utils/payment";

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
    // delete verification token from cache
    await deleteCache(token);
    // create stripe account and onboarding link
    const accountId = await createAccount(userToBeSignuped.email);
    userToBeSignuped.stripeAccountId = accountId;

    const onBoardingLink = await generateOnboardingLink(accountId);
    console.log(`OnBoarding Link ${onBoardingLink}`);
    // sumbit admin verify request
    if (userToBeSignuped.role === "Seller") {
      const appReq = {
        email: userToBeSignuped.email,
        data: JSON.stringify(userToBeSignuped),
      };
      const result = await createApprovalRequest(appReq);

      console.log("result of creating approval request", result);

      return NextResponse.redirect(onBoardingLink);
    } else {
      const result = await addUser(userToBeSignuped);

      console.log("result of db saving", result);

      return NextResponse.json(
        { message: "Signup process initiated successfully" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log("error ", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
