# Frontend UI Requirements - 11. API Integration

This document describes how the Next.js frontend will interact with the backend Express.js API.

## 5. API Integration (Next.js)

Interact with the backend Express.js API (`/api/*`) from Next.js.

- **Server Components:** Fetch data directly in Server Components using `fetch` or a library like `axios`. This is ideal for initial page loads and data that doesn't change frequently based on user interaction. Pass fetched data down to Client Components.
- **Client Components:** Fetch data in Client Components for interactive parts of the UI (forms, buttons, real-time updates) using hooks like `useEffect` or data fetching libraries (SWR, React Query).
- **Route Handlers (App Router) / API Routes (Pages Router):** Create Next.js API endpoints (`/app/api/*` or `/pages/api/*`) to act as a proxy to the backend Express.js API. This can help with:
  - Handling authentication cookies securely.
  - Keeping backend API URL private from the frontend.
  - Implementing server-side logic before calling the backend (e.g., validation, data transformation).
  - Handling file uploads.
- Map UI actions (button clicks, form submissions, page loads) to corresponding API calls (either directly to backend or via Next.js API routes).
- Handle loading states (`loading` boolean) while waiting for API responses.
- Handle error states (`error` variable) and display appropriate messages using the `ErrorMessage` component.
- Use asynchronous functions (`async/await`) for API calls.

Example API mapping:

- `BookList` page (Server Component): Fetches data using `fetch('/api/books?...')` including query parameters from URL search params.
- `BookForm` component (Client Component): Submits data using `axios.post('/api/books', data)` or a custom fetch wrapper.
- `TransactionDetails` page (Mix): Server Component fetches initial transaction data. Client Component buttons trigger actions using `fetch` or `axios` to PUT endpoints.
- `ChatThread` page (Mix): Server Component fetches initial messages. Client Component uses SWR/React Query for real-time updates or polling. Message sending can use a Server Action or a Route Handler.
