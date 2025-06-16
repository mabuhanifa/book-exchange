# Frontend UI Requirements - 8. Reusable UI Components

This document lists reusable UI components used across the application, leveraging Shadcn UI and Tailwind CSS.

## 2. UI Components (React with Shadcn UI & Tailwind CSS)

... (Continuing from previous component lists)

| Component Name       | Purpose                                     | Data/Props Needed                                                                                       | Relationships                                                  | Shadcn UI / Tailwind Notes                                                            |
| :------------------- | :------------------------------------------ | :------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------- | :------------------------------------------------------------------------------------ |
| `Pagination`         | Handles page navigation for lists           | `currentPage`, `totalPages`, `onPageChange`                                                             | Used in any list component.                                    | Use Shadcn `Pagination` component.                                                    |
| `FilterSortControls` | Provides UI for filtering and sorting lists | `availableFilters`, `availableSorts`, `currentFilters`, `currentSort`, `onFilterChange`, `onSortChange` | Used in list components (`BookList`, `AdminUserList`, etc.).   | Use Shadcn `Select`, `Checkbox`, `Button`, `Input` (for search). Style with Tailwind. |
| `Modal`              | Generic modal component                     | `isOpen`, `onClose`, `children`                                                                         | Used for forms, confirmations, notifications list, etc.        | Use Shadcn `Dialog` component.                                                        |
| `ConfirmationDialog` | Generic confirmation modal                  | `isOpen`, `onClose`, `message`, `onConfirm`                                                             | Used for delete actions, transaction cancellations, etc.       | Use Shadcn `AlertDialog` component.                                                   |
| `LoadingSpinner`     | Visual indicator for loading states         | `isLoading`                                                                                             | Used in components fetching data.                              | Use a simple spinner component styled with Tailwind.                                  |
| `ErrorMessage`       | Displays error messages                     | `error` (string or object)                                                                              | Used in components fetching data or handling form submissions. | Use a simple alert or text component styled with Tailwind.                            |
