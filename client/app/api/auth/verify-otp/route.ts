import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { userId, phoneNumber, otp } = await request.json();

  console.log(
    `API: Received OTP verification request for userId: ${userId}, phone: ${phoneNumber}, otp: ${otp}`
  );

  // --- Simulate Backend Interaction ---
  // In a real app, you would call your backend API here to verify OTP
  // const backendResponse = await fetch('YOUR_BACKEND_API/auth/verify-otp', { ... });
  // const data = await backendResponse.json();

  // Simulate OTP verification success
  const isOtpValid = otp === "123456"; // Dummy OTP check

  if (!isOtpValid) {
    return NextResponse.json(
      { success: false, message: "Invalid OTP" },
      { status: 400 }
    );
  }

  // Simulate receiving tokens and user data after successful verification
  const dummyAccessToken = "verified-access-token-" + userId + "-" + Date.now();
  const dummyRefreshToken =
    "verified-refresh-token-" + userId + "-" + Date.now();
  const dummyUser = {
    id: userId,
    name: "Verified User " + userId.substring(5, 9),
    role: userId.includes("admin") ? "admin" : "user", // Simulate admin role for certain user IDs
    // Add other user properties
  };

  // --- Set HttpOnly Cookies ---
  cookies().set("accessToken", dummyAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60, // 1 hour (example)
    path: "/",
  });

  cookies().set("refreshToken", dummyRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days (example)
    path: "/",
  });

  // Return success response with user data
  return NextResponse.json({
    success: true,
    user: dummyUser,
    message: "OTP verified, login successful",
  });
}
