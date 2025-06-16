import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { phoneNumber } = await request.json();

  console.log("API: Received login request for phone:", phoneNumber);

  // --- Simulate Backend Interaction ---
  // In a real app, you would call your backend API here
  // const backendResponse = await fetch('YOUR_BACKEND_API/auth/login', { ... });
  // const data = await backendResponse.json();

  // Simulate success response from backend
  const dummyUserId = "user-" + Math.random().toString(36).substring(7);
  const dummyAccessToken = "access-token-" + dummyUserId + "-" + Date.now();
  const dummyRefreshToken = "refresh-token-" + dummyUserId + "-" + Date.now();

  // Simulate sending OTP (backend would handle this)
  console.log(
    `API: Simulating OTP sent to ${phoneNumber}. Dummy userId: ${dummyUserId}`
  );

  // --- Set HttpOnly Cookies ---
  // Set cookies using the `cookies` helper from `next/headers` (works in App Router Route Handlers)
  cookies().set("accessToken", dummyAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure in production
    sameSite: "strict",
    maxAge: 60 * 60, // 1 hour (example) - should match your access token expiry
    path: "/", // Make cookie available across the site
  });

  cookies().set("refreshToken", dummyRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days (example)
    path: "/",
  });

  // Return response indicating success and user ID for OTP step
  return NextResponse.json({
    success: true,
    userId: dummyUserId,
    message: "OTP sent",
  });
}
