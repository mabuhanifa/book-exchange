import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Define protected paths
const protectedPaths = [
  "/dashboard",
  "/profile",
  "/profile/:path*",
  "/books/new",
  "/books/:bookId/edit",
  "/transactions",
  "/transactions/:path*",
  "/chat",
  "/chat/:path*",
  "/notifications",
  "/admin",
  "/admin/:path*",
];
const adminPaths = ["/admin", "/admin/:path*"];
const authPaths = ["/auth/login", "/auth/register", "/auth/verify-otp"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read the authentication token from cookies
  const accessToken = request.cookies.get("accessToken")?.value;
  // In a real app, you might also need to check a refreshToken and potentially refresh here
  // or rely on the backend API calls to handle 401s and trigger client-side refresh.

  const isAuthenticated = !!accessToken; // Simple check based on cookie presence

  // --- Handle Protected Paths ---
  const isProtected = protectedPaths.some((path) => {
    // Basic path matching, consider a more robust solution for complex patterns
    if (path.endsWith(":path*")) {
      const base = path.replace(":path*", "");
      return pathname.startsWith(base);
    }
    if (
      path.includes(":bookId") ||
      path.includes(":userId") ||
      path.includes(":transactionType") ||
      path.includes(":transactionId") ||
      path.includes(":conversationId") ||
      path.includes(":disputeId") ||
      path.includes(":reviewId") ||
      path.includes(":reportType")
    ) {
      // Simple check if pathname starts with the base part of the dynamic route
      const base = path.split("/[").shift();
      return pathname.startsWith(base as string);
    }
    return pathname === path;
  });

  if (isProtected && !isAuthenticated) {
    // Redirect unauthenticated users trying to access protected paths
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.url); // Optional: add callback URL
    return NextResponse.redirect(loginUrl);
  }

  // --- Handle Admin Paths ---
  const isAdminPath = adminPaths.some((path) => {
    if (path.endsWith(":path*")) {
      const base = path.replace(":path*", "");
      return pathname.startsWith(base);
    }
    return pathname === path;
  });

  // Note: Checking admin role here requires fetching user data based on the token.
  // This is complex in middleware without hitting the backend or using a JWT library.
  // A simpler approach is to check the role *after* authentication is confirmed,
  // either in a Server Component layout/page or a Client Component wrapper.
  // For this example, we'll rely on checks within the admin pages themselves
  // after the middleware ensures authentication.
  // If you need strict middleware-level role checks, you'd need to decode the token
  // or make a quick API call here, which can impact performance.

  // --- Handle Auth Paths (Redirect authenticated users away) ---
  const isAuthPath = authPaths.includes(pathname);

  if (isAuthPath && isAuthenticated) {
    // Redirect authenticated users trying to access login/register/verify
    const dashboardUrl = new URL("/dashboard", request.url); // Or wherever authenticated users go
    return NextResponse.redirect(dashboardUrl);
  }

  // Continue to the requested page
  return NextResponse.next();
}

// Configure which paths the middleware applies to
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes - handle auth within the API routes themselves if needed)
     * - Any public static files in /public
     */
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
};
