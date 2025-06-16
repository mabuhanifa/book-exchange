# Frontend UI Requirements - 14. Admin Panel Considerations

This document outlines specific considerations for building the admin panel UI.

## 8. Admin Panel Considerations (Next.js, Tailwind, Shadcn UI)

- Admin routes must be strictly protected by Next.js Middleware and/or checks in Server/Client Components based on the user's `role`.
- Use Shadcn `Table` for displaying lists of users, books, transactions, disputes, and reviews. Implement server-side pagination, filtering, and sorting by passing parameters to the backend API via URL search params.
- Display dashboard stats using simple cards styled with Tailwind.
- Use Shadcn `Form`, `Textarea`, `Select`, and `Button` for dispute resolution and review moderation forms.
- Implement data fetching for admin details pages (`/admin/users/[userId]`, `/admin/disputes/[disputeId]`) in Server Components.
