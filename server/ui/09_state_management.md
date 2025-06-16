# Frontend UI Requirements - 9. State Management

This document outlines the state management strategy for the frontend application.

## 3. State Management (Next.js)

A centralized state management solution (e.g., Zustand, React Context, Redux Toolkit) is required to manage global or shared application state. Consider server-side data fetching patterns in Next.js (Server Components, `use` hook, React Query/SWR) to minimize client-side state complexity.

Key state areas:

- **Authentication:** `currentUser` (user object), `accessToken`, `refreshToken`, `isAuthenticated`, `authLoading`, `authError`. This state should be accessible globally, potentially managed in a Context Provider or Zustand store.
- **Notifications:** `notifications` (array), `unreadCount`, `notificationsLoading`, `notificationsError`. Global state for real-time updates and display in Header.
- **Global Loading/Error:** Potentially a global indicator for major operations (less critical with per-component loading states).
- **User-specific Data:** User's own books, transactions, reviews. Can be fetched on the relevant pages (potentially in Server Components) and passed down, or managed in local component state/Context/Zustand if needed across components.
- **Admin Data:** Lists of users, books, disputes, etc. Likely fetched per page in Server Components or Client Components using hooks like SWR or React Query.
