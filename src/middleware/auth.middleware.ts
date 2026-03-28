import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function authMiddleware(_req: NextRequest) {
  return NextResponse.next();
}
