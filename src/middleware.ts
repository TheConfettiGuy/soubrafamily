import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const ADMIN_COOKIE = "ADMIN_AUTH";

export const config = { matcher: ["/admin/:path*"] };

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const role = (token as any)?.role as string | undefined;

  if (!token || role !== "admin") {
    const redirect = NextResponse.redirect(new URL("/login", url));
    redirect.cookies.set({
      name: ADMIN_COOKIE,
      value: "",
      path: "/",
      maxAge: 0,
    });
    return redirect;
  }

  const res = NextResponse.next();
  res.cookies.set({
    name: ADMIN_COOKIE,
    value: "1",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
