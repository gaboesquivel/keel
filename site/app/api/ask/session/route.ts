import { NextResponse } from "next/server";

import { askConfigured, COOKIE, ownerToken, secretMatches } from "@/lib/ask";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NINETY_DAYS = 60 * 60 * 24 * 90;

/** Exchange the owner secret, once, for an httpOnly cookie that holds a MAC of it (never the secret itself). */
export async function POST(request: Request) {
  if (!askConfigured()) return NextResponse.json({ error: "unavailable" }, { status: 404 });
  let secret = "";
  try {
    const body = (await request.json()) as { secret?: unknown };
    secret = typeof body.secret === "string" ? body.secret.trim() : "";
  } catch {}
  if (!secretMatches(secret)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const res = NextResponse.json({ authorized: true });
  res.cookies.set(COOKIE, ownerToken(), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: NINETY_DAYS });
  return res;
}

/** Sign this browser out of Ask. */
export async function DELETE() {
  const res = NextResponse.json({ authorized: false });
  res.cookies.set(COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 0 });
  return res;
}
