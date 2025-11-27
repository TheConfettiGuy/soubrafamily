import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  // delete site-wide
  res.cookies.set({
    name: "ADMIN_AUTH",
    value: "",
    path: "/",
    maxAge: 0,
  });
  return res;
}
