import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware() {
        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl

                // Public routes - no auth required
                if (
                    pathname.startsWith("/api/auth") ||
                    pathname === "/login" ||
                    pathname === "/register" ||
                    pathname === "/" ||
                    pathname === "/feed" ||
                    pathname.startsWith("/api/videos")
                ) {
                    return true;
                }

                // Protected routes require token
                return !!token
            }
        }
    }
)

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.ico$).*)",
    ]
}