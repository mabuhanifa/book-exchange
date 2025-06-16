import axios from "axios";
import { cookies } from "next/headers";

// Define the base URL for your backend API
const BACKEND_API_BASE_URL =
  process.env.BACKEND_API_BASE_URL || "http://localhost:3001/api"; // Replace with your actual backend URL

// This function is intended to be called from Next.js Route Handlers (Server-side)
// It forwards the request to the backend API, including cookies for authentication.
export async function callBackendApi(
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  data?: any,
  headers?: Record<string, string>
) {
  const url = `${BACKEND_API_BASE_URL}${path}`;
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (accessToken) {
    defaultHeaders["Authorization"] = `Bearer ${accessToken}`;
  }

  try {
    const response = await axios({
      method,
      url,
      data,
      headers: defaultHeaders,
      // Do NOT handle token refresh here directly in this simple utility.
      // Token refresh should ideally be handled by the backend returning a specific status (e.g., 401)
      // which is then caught by the client-side data fetching library (like React Query)
      // or a dedicated client-side API wrapper that triggers the refresh flow.
    });

    return response.data;
  } catch (error: any) {
    console.error(`Backend API call failed: ${method} ${path}`, error.message);
    // Re-throw the error so the Route Handler can handle it
    throw error;
  }
}
