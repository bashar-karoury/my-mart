import { NextRequest, NextResponse } from "next/server";
import { getUserFromSession } from "@/utils/sessions";
export const runtime = "nodejs";
const authPathes = [
  "/login",
  "/signup",
  "/api/v1/login",
  "/api/v1/signup",
  "/api/v1/verify-email",
  "/api/v1/signout",
];

export async function middleware(request: NextRequest) {
  // console.log("Runtime environment:", process.env.NEXT_RUNTIME);
  // const isAuthPath = authPathes.includes(request.nextUrl.pathname);

  // // const user = await getUserFromSession(request);
  // const user = null;
  // if (!user) {
  //   if (isAuthPath) {
  //     return NextResponse.next();
  //   }
  //   if (request.nextUrl.pathname.startsWith("/api/")) {
  //     return new NextResponse("Not authorized", { status: 401 });
  //   }
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  // if (isAuthPath) {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  // You can add your own route protection logic here
  // Make sure not to protect the root URL, as it would prevent users from accessing static Next.js files or Stack's /handler path
  //   matcher: ["/((?!_next/static|_next/image|favicon.ico|login|signup|$).*)"],
  matcher: ["/((?!_next/static|_next/image|favicon.ico|$).*)"],
  // matcher: ["/:path*"],
};

// export default function handler() {}
