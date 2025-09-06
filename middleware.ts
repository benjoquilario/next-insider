import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get("session")

  console.log("sessionCookie", sessionCookie)
  const sensitiveRoutes = ["/", "/setting", "/profile", "/edit-profile"]

  const isAccessingSensitiveRoute = sensitiveRoutes.some((route) =>
    pathname.startsWith(route)
  )

  const authRoutes =
    pathname.startsWith("/login") || pathname.startsWith("/register")

  if (authRoutes) {
    if (sessionCookie) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    return NextResponse.next()
  }

  if (isAccessingSensitiveRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/",
    "/login",
    "/register",
    "/profile/:path*",
    "/setting/",
    "/edit-profile",
  ],
}
