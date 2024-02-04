import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line consistent-return
export function middleware(request: NextRequest) {
  const sessionId = request.cookies.get("session_id");
  if (!sessionId) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
}

export const config = {
  matcher: ["/((?!signin|signup|api|_next/static|_next/image|.*\\.png$).*)"]
};
