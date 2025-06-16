# Frontend UI Requirements - 1. Routing Structure

This document details the routing structure for the frontend UI using Next.js App Router.

## 1. Overall Application Structure & Routing (Next.js)

The application will leverage Next.js for routing, server-side rendering (SSR) or static site generation (SSG) where appropriate, and API route handling for backend interactions. A clear separation between public and private routes will be enforced.

### Routing Structure (Next.js App Router)

- **Public Routes:** Accessible without authentication. Can be Server Components for initial render.

  - `/`: Landing page / Home (can be a Server Component, might show featured books or prompt login/signup)
  - `/auth/register`: User registration flow (Client Component)
  - `/auth/login`: User login flow (Client Component)
  - `/books`: Public book listings browse page (can be Server Component with search/filter in URL params)
  - `/books/[bookId]`: Public single book details page (can be Server Component)
  - `/users/[userId]`: Public user profile page (can be Server Component)
  - `/about`, `/contact`, etc. (Optional static pages, can be Server Components)

- **Private Routes:** Require authentication (valid JWT access token). Access control enforced via Next.js Middleware or checks in Server/Client Components.
  - `/dashboard`: User dashboard (Mix of Server/Client Components)
  - `/profile`: Authenticated user's own profile management (Client Component for forms, Server Component for display)
  - `/profile/edit`: Edit user profile (Client Component)
  - `/profile/my-books`: List of books posted by the user (Mix of Server/Client Components)
  - `/profile/my-reviews`: List of reviews given and received by the user (Mix of Server/Client Components)
  - `/books/new`: Create new book listing (Client Component)
  - `/books/[bookId]/edit`: Edit existing book listing (Owner only, Client Component)
  - `/transactions`: List of all user's transactions (Mix of Server/Client Components)
  - `/transactions/exchange/sent`: List of sent exchange requests (Mix of Server/Client Components)
  - `/transactions/exchange/received`: List of received exchange requests (Mix of Server/Client Components)
  - `/transactions/sell/buying`: List of buy transactions (as buyer) (Mix of Server/Client Components)
  - `/transactions/sell/selling`: List of sell transactions (as seller) (Mix of Server/Client Components)
  - `/transactions/borrow/sent`: List of borrow requests (as borrower) (Mix of Server/Client Components)
  - `/transactions/borrow/received`: List of borrow requests (as owner) (Mix of Server/Client Components)
  - `/transactions/[transactionType]/[transactionId]`: Detailed view of a specific transaction (Mix of Server/Client Components)
  - `/chat`: List of user's conversations (Mix of Server/Client Components)
  - `/chat/[conversationId]`: Specific chat thread view (Mix of Server/Client Components, potentially using Server Actions for sending messages)
  - `/notifications`: User's notification list (Mix of Server/Client Components)
  - `/admin`: Admin dashboard (requires 'admin' role, Mix of Server/Client Components)
  - `/admin/users`: Admin user management list (Mix of Server/Client Components)
  - `/admin/users/[userId]`: Admin view of specific user details (Mix of Server/Client Components)
  - `/admin/books`: Admin book listing management (Mix of Server/Client Components)
  - `/admin/transactions`: Admin view of all transactions (Mix of Server/Client Components)
  - `/admin/disputes`: Admin dispute management list (Mix of Server/Client Components)
  - `/admin/disputes/[disputeId]`: Admin dispute details and resolution (Mix of Server/Client Components)
  - `/admin/reviews`: Admin review moderation list (Mix of Server/Client Components)
  - `/admin/system/logs`: Admin system logs view (Mix of Server/Client Components)
  - `/admin/system/reports`: Admin reports view (Mix of Server/Client Components)

### Dynamic Routes (Next.js App Router)

- `/books/[bookId]`
- `/users/[userId]`
- `/transactions/[transactionType]/[transactionId]`
- `/chat/[conversationId]`
- `/admin/users/[userId]`
- `/admin/disputes/[disputeId]`
- `/admin/reviews/[reviewId]` (if admin can view single review details page)
- `/admin/reports/[reportType]`
