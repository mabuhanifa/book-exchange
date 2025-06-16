# Frontend UI Requirements - 10. Authentication Handling

This document specifies how authentication will be handled in the Next.js frontend.

## 4. Authentication Handling (Next.js)

- **Login/Registration Flow:**
  - User enters phone number in a Client Component form.
  - Submit form data to a Next.js Route Handler (`/api/auth/register` or `/api/auth/login`) or directly to backend API.
  - Navigate to OTP verification page (`/auth/verify-otp`), passing phone number and potentially `userId` via search params or state.
  - User enters OTP in a Client Component form.
  - Submit form data to a Route Handler (`/api/auth/verify-otp`) or backend API.
  - On success, receive `accessToken` and `refreshToken`.
  - Store tokens securely. **Recommendation:** Use HttpOnly cookies set by a Next.js Route Handler or Middleware after successful login/refresh. Avoid storing sensitive tokens in browser Local Storage.
  - Set `isAuthenticated` state (in client-side state management) based on the presence and validity of tokens (checked via API calls or cookie presence). Store `currentUser` data in state.
  - Redirect to a private route (`/dashboard` or `/profile`) using `next/navigation`.
- **Protected Routes:**
  - **Middleware:** Use Next.js Middleware (`middleware.js`) to check for authentication cookies/tokens on incoming requests to protected paths (`/dashboard`, `/profile`, `/admin/*`, etc.). Redirect to `/auth/login` if not authenticated.
  - **Server Components:** In Server Components for private routes, fetch user data based on authentication status (e.g., read cookies). If user data is not found/invalid, redirect using `redirect` from `next/navigation`.
  - **Client Components:** In Client Components within private routes, check authentication state from global state management. If not authenticated, redirect.
  - **Admin Role:** For admin routes (`/admin/*`), check the user's `role` after verifying authentication. Redirect if not 'admin'.
- **API Authentication:**
  - When fetching data in Client Components, use a data fetching library (like SWR or React Query) or a custom fetch wrapper that automatically includes the authentication token (read from cookies or client-side state) in the `Authorization` header.
  - When fetching data in Server Components or Route Handlers, read the authentication cookie from the incoming request headers and include it in the backend API call.
- **Token Refresh:**
  - Implement token refresh logic within your API service layer or data fetching wrapper.
  - If a backend API call returns 401, trigger a refresh request to `/api/auth/refresh-token` (or a Next.js Route Handler that calls the backend refresh endpoint).
  - If refresh is successful, update the authentication cookies/state and retry the original request.
  - If refresh fails, clear authentication state and redirect to login.
- **Logout:** Call `/api/auth/logout` (or a Next.js Route Handler that calls the backend endpoint) to invalidate the refresh token on the server. Clear authentication cookies (e.g., by setting them to expired values in a Route Handler) and client-side state. Redirect to a public route.
