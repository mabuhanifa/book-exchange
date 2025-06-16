import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { phoneNumber } = await request.json();

  console.log("API: Received registration request for phone:", phoneNumber);

  // --- Simulate Backend Interaction ---
  // In a real app, you would call your backend API here
  // const backendResponse = await fetch('YOUR_BACKEND_API/auth/register', { ... });
  // const data = await backendResponse.json();

  // Simulate success response from backend
  const dummyUserId = "user-" + Math.random().toString(36).substring(7);

  // Simulate sending OTP (backend would handle this)
  console.log(
    `API: Simulating OTP sent to ${phoneNumber} for registration. Dummy userId: ${dummyUserId}`
  );

  // Note: We don't set auth cookies yet, only after OTP verification

  // Return response indicating success and user ID for OTP step
  return NextResponse.json({
    success: true,
    userId: dummyUserId,
    message: "OTP sent for registration",
  });
}
