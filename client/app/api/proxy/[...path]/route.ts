import { callBackendApi } from "@/lib/api";
import { NextResponse } from "next/server";

// This handler will catch requests like /api/proxy/books, /api/proxy/users/123, etc.
// and forward them to the backend API.

export async function GET(request: Request) {
  const { pathname, searchParams } = new URL(request.url);
  // Extract the backend path from the Next.js route path
  const backendPath =
    pathname.replace("/api/proxy", "") +
    (searchParams.toString() ? `?${searchParams.toString()}` : "");

  try {
    const data = await callBackendApi("GET", backendPath);
    return NextResponse.json(data);
  } catch (error: any) {
    // Forward backend errors to the frontend
    return NextResponse.json(
      { message: error.message || "Backend error" },
      { status: error.response?.status || 500 }
    );
  }
}

export async function POST(request: Request) {
  const { pathname } = new URL(request.url);
  const backendPath = pathname.replace("/api/proxy", "");
  const body = await request.json();

  try {
    const data = await callBackendApi("POST", backendPath, body);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Backend error" },
      { status: error.response?.status || 500 }
    );
  }
}

export async function PUT(request: Request) {
  const { pathname } = new URL(request.url);
  const backendPath = pathname.replace("/api/proxy", "");
  const body = await request.json();

  try {
    const data = await callBackendApi("PUT", backendPath, body);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Backend error" },
      { status: error.response?.status || 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { pathname } = new URL(request.url);
  const backendPath = pathname.replace("/api/proxy", "");

  try {
    const data = await callBackendApi("DELETE", backendPath);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Backend error" },
      { status: error.response?.status || 500 }
    );
  }
}

// Add other HTTP methods (PATCH, etc.) as needed
