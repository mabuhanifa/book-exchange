import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  console.log("API: Received logout request");

  // --- Simulate Backend Interaction ---
  // In a real app, you would call your backend API here to invalidate the refresh token
  // await fetch('YOUR_BACKEND_API/auth/logout', { ... });

  // --- Clear HttpOnly Cookies ---
  // Clear cookies by setting them to an empty value and past expiry
  cookies().set("accessToken", "", { expires: new Date(0), path: "/" });
  cookies().set("refreshToken", "", { expires: new Date(0), path: "/" });

  return NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });
}
