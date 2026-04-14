import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const adminPaths = ["/dashboard", "/requests", "/resources", "/volunteers"];
const volunteerPaths = ["/portal"];
const citizenPaths = ["/submit-request", "/track"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register"
  ) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (adminPaths.some((p) => pathname.startsWith(p))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (token.role !== "admin" && token.role !== "shelter_manager") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (volunteerPaths.some((p) => pathname.startsWith(p))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (token.role !== "volunteer" && token.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (citizenPaths.some((p) => pathname.startsWith(p))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (
      token.role !== "citizen" &&
      token.role !== "admin" &&
      token.role !== "shelter_manager"
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
