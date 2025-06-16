# Frontend UI Requirements - 4. Book UI Components

This document lists UI components specifically for displaying and managing book listings.

## 2. UI Components (React with Shadcn UI & Tailwind CSS)

... (Continuing from previous component lists)

| Component Name | Purpose                                         | Data/Props Needed                                                                                              | Relationships                                                       | Shadcn UI / Tailwind Notes                                                                         |
| :------------- | :---------------------------------------------- | :------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------- |
| `BookList`     | Displays a list of book cards                   | `books` (array), `loading`, `error`, `paginationData`, `onPageChange`, `onFilterChange`, `onSortChange`        | Contains `BookCard`. Uses `Pagination`, `Filter/Sort` components.   | Use Tailwind grid/flex for layout. `Filter/Sort` can use Shadcn `Select`, `Checkbox`, `Button`.    |
| `BookCard`     | Displays summary info for a single book listing | `book` (object: title, author, condition, type, price/exchange/duration, image, owner name/area, availability) | Links to `BookDetailsPage`.                                         | Use Shadcn `Card` component. Style with Tailwind.                                                  |
| `BookDetails`  | Displays full details of a single book          | `book` (object), `loading`, `error`, `currentUser`                                                             | May contain `TransactionRequestButton`, `ChatButton`.               | Use Tailwind for layout. Images can use Next.js `Image`. Buttons use Shadcn `Button`.              |
| `BookForm`     | Form for creating or editing a book listing     | `initialData` (for edit), `onSubmit` (callback), `loading`, `error`                                            | Handles image uploads (requires file input).                        | Use Shadcn `Form`, `Input`, `Textarea`, `Select`, `Button`. File input may be custom or a library. |
| `UserBookList` | Displays books posted by the authenticated user | `books` (array), `loading`, `error`, `paginationData`                                                          | Contains `BookCard`. Uses `Pagination`. Links to `BookForm` (edit). | Use Tailwind layout.                                                                               |
