import { NextResponse } from "next/server";

/** Wire NextAuth here — see https://next-auth.js.org */
export function GET() {
  return NextResponse.json(
    { message: "NextAuth route placeholder — add NextAuth handler" },
    { status: 501 },
  );
}

export function POST() {
  return NextResponse.json(
    { message: "" },
    { status: 501 },
  );
}
