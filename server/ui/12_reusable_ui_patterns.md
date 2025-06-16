# Frontend UI Requirements - 12. Reusable UI Patterns

This document describes reusable UI patterns using Shadcn UI and Tailwind CSS.

## 6. Reusable UI Patterns (Shadcn UI & Tailwind CSS)

- **Forms:** Use Shadcn `Form` component with a validation library (e.g., Zod) for structured and validated forms. Style inputs, labels, and error messages with Tailwind.
- **Modals:** Use Shadcn `Dialog` for general modals and `AlertDialog` for confirmations. Style content within modals using Tailwind.
- **Lists:** Display lists using semantic HTML or Shadcn `Table` (especially for admin views). Implement pagination using Shadcn `Pagination`. Filtering and sorting controls use Shadcn `Select`, `Checkbox`, `Input`, `Button` styled with Tailwind.
- **Loading/Error States:** Use conditional rendering based on loading/error state variables. Display `LoadingSpinner` or `ErrorMessage` components styled with Tailwind.
- **Buttons:** Use Shadcn `Button` component for consistent styling and variants (primary, secondary, destructive).
- **Cards:** Use Shadcn `Card` component for displaying grouped information like book summaries or user profiles.
