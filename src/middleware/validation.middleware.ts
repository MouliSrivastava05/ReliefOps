import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function validationMiddleware(_req: NextRequest) {
  return NextResponse.next();
}
